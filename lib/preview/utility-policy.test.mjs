// Run from the project root: node components/pages/dashboard/dashboard-reading.test.mjs
// Tests report facts and rendering semantics, not browser paint/performance.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {test} from 'node:test';

const require = createRequire(import.meta.url);
const ts = require('typescript');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const cache = new Map();
function load(relative) {
  const file = path.resolve(root, relative);
  if (cache.has(file)) return cache.get(file).exports;
  const module = {exports: {}};
  cache.set(file, module);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {fileName: file, compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX}}).outputText;
  const localRequire = name => {
    if (!name.startsWith('.') && !name.startsWith('@/')) return require(name);
    const base = name.startsWith('@/') ? path.join(root, name.slice(2)) : path.resolve(path.dirname(file), name);
    const resolved = [base, `${base}.ts`, `${base}.tsx`].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    assert.ok(resolved, `Cannot resolve ${name}`);
    return load(path.relative(root, resolved));
  };
  new Function('require', 'module', 'exports', code)(localRequire, module, module.exports);
  return module.exports;
}



const policy=load('lib/preview/policy.ts');
const {createFixture}=load('lib/preview/fixtures.ts');
const {previewTransport,backendBindings}=load('lib/preview/adapter.ts');
const mb=1024*1024;
const file=(size=mb,type='application/pdf',name='sample.pdf')=>({name,type,size});
test('uploads enforce ten files fifteen MB each and forty MB aggregate at exact boundaries',()=>{
 assert.equal(policy.validateUploadMetadata(Array.from({length:10},()=>file())),null);
 assert.equal(policy.validateUploadMetadata(Array.from({length:11},()=>file())),'count');
 assert.equal(policy.validateUploadMetadata([file(15*mb)]),null);
 assert.equal(policy.validateUploadMetadata([file(15*mb+1)]),'file_size');
 assert.equal(policy.validateUploadMetadata([file(15*mb),file(15*mb),file(10*mb)]),null);
 assert.equal(policy.validateUploadMetadata([file(15*mb),file(15*mb),file(10*mb+1)]),'total_size');
});
test('uploads accept WEBP HEIF and empty-mime extension fallback but reject spoofed MIME',()=>{
 for(const ext of ['webp','heif','heic'])assert.equal(policy.validateUploadMetadata([file(mb,'image/'+ext,'sample.'+ext)]),null);
 assert.equal(policy.validateUploadMetadata([file(mb,'','sample.HEIF')]),null);
 assert.equal(policy.validateUploadMetadata([file(mb,'application/octet-stream','sample.webp')]),null);
 assert.equal(policy.validateUploadMetadata([file(mb,'application/javascript','sample.pdf')]),'type');
 assert.equal(policy.validateUploadMetadata([file(0)]),'empty_file');
 assert.equal(policy.validateUploadMetadata([]),'empty');
});
test('exactly five confirmed free reports are available per account, including after replacements, deletion and reload',()=>{
 let state={...createFixture('new'),reports:[]};
 for(let confirmed=1;confirmed<=5;confirmed++) {
  state=policy.recordConfirmedUpload(state);
  assert.equal(state.totalUploadsUsed,confirmed);assert.equal(state.freeUploadsUsed,confirmed);
  assert.equal(policy.uploadQuota(state).remaining,5-confirmed);
 }
 const loaded=JSON.parse(JSON.stringify({...state,reports:[]}));
 assert.equal(policy.uploadQuota(loaded).atLimit,true);
 assert.equal(policy.recordConfirmedUpload(loaded),loaded);
});
test('uploads during a paid subscription do not spend any of the five free uses',()=>{
 const start=Date.UTC(2026,0,1),end=Date.UTC(2026,3,1);
 const subscription={...createFixture('new'),plan:'quarterly',subscriptionStatus:'active',subscriptionPeriodEnd:new Date(end).toISOString(),totalUploadsUsed:4};
 let state=policy.recordConfirmedUpload(subscription,start);
 assert.equal(state.totalUploadsUsed,5);assert.equal(state.freeUploadsUsed,4);
 state=policy.recordConfirmedUpload({...state,subscriptionStatus:'cancelled'},end-1);
 assert.equal(state.totalUploadsUsed,6);assert.equal(state.freeUploadsUsed,4);assert.equal(policy.uploadQuota(state,end-1).unlimited,true);
 state=policy.recordConfirmedUpload(state,end);
 assert.equal(state.freeUploadsUsed,5);assert.equal(policy.uploadQuota(state,end).atLimit,true);
 for(const status of ['paused','past_due'])assert.equal(policy.uploadQuota({...subscription,freeUploadsUsed:5,subscriptionStatus:status},start).atLimit,true);
});
test('a valid lab year grants unlimited uploads independent of the subscription and preserves the remaining free uses',()=>{
 const now=Date.UTC(2026,0,1),quarterEnd=Date.UTC(2026,3,1),yearEnd=Date.UTC(2027,0,1);
 const lab={...createFixture('new'),plan:'full_panel',hasPurchasedLabPanel:true,labUploadAccessUntil:new Date(yearEnd).toISOString(),totalUploadsUsed:4};
 assert.equal(policy.uploadQuota(lab,now).coverage,'lab');
 const withUpload=policy.recordConfirmedUpload(lab,now);
 assert.equal(withUpload.freeUploadsUsed,4);assert.equal(withUpload.totalUploadsUsed,5);
 const both={...withUpload,plan:'quarterly',subscriptionStatus:'cancelled',subscriptionPeriodEnd:new Date(quarterEnd).toISOString()};
 assert.equal(policy.uploadQuota(both,quarterEnd-1).coverage,'subscription');
 assert.equal(policy.uploadQuota(both,quarterEnd).coverage,'lab');
 assert.equal(policy.uploadQuota(both,yearEnd).remaining,1);assert.equal(policy.uploadQuota(both,yearEnd).unlimited,false);
 assert.equal(policy.uploadQuota({...both,subscriptionPeriodEnd:new Date(yearEnd+60_000).toISOString()},yearEnd).unlimited,true);
 assert.equal(policy.hasPaidAccess(withUpload,yearEnd),true);
 assert.equal(policy.uploadQuota(policy.recordConfirmedUpload(withUpload,yearEnd),yearEnd).atLimit,true);
});
test('older saved accounts preserve known usage, including deleted uploads, without counting the seeded reports',()=>{
 const {reports}=createFixture(),legacy={...createFixture('new'),reports};
 assert.equal(policy.uploadQuota({...legacy,totalUploadsUsed:undefined}).used,0);
 assert.equal(policy.uploadQuota({...legacy,totalUploadsUsed:3}).used,3);
 const imported={...reports[1],id:'demo-upload',source:'upload'};
 assert.equal(policy.uploadQuota({...legacy,totalUploadsUsed:undefined,reports:[...reports,imported]}).used,1);
 assert.equal(policy.uploadQuota({...legacy,totalUploadsUsed:12,freeUploadsUsed:2}).remaining,3);
});
test('annual member access survives while new signup offers only the current subscription',()=>{
 const s=createFixture();assert.equal(policy.normalizePlan('annual'),'annual');
 assert.equal(policy.hasPaidAccess({...s,plan:'annual',subscriptionStatus:'active'}),true);
 assert.equal(policy.hasPaidAccess({...s,plan:'annual',subscriptionStatus:'past_due'}),false);
 for(const raw of ['intent=annual','plan=annual','next='+encodeURIComponent('/es/checkout-resume?intent=annual')])assert.equal(policy.readFlowIntent(new URLSearchParams(raw)).plan,'annual');
 assert.equal(policy.readFlowIntent(new URLSearchParams('plan=invalid&intent=annual')).invalidPlan,true);
 const {onboardingCopy}=load('components/preview/OnboardingPage.tsx');
 assert.equal(onboardingCopy.es.paths.some(([key])=>key==='annual'),false);
 assert.ok(onboardingCopy.es.paths.some(([key])=>key==='quarterly'));
 const flow=policy.readFlowIntent(new URLSearchParams('intent=annual&redirect=%2Fes%2Flabs%2Fdemo-junio'));
 assert.match(policy.destinationAfterOnboarding(flow,'quarterly'),/plan=quarterly/);
 assert.match(policy.flowHref('/es/signup',flow),/plan=annual/);
});
test('identity mapping preserves compound first surname and optional second surname',()=>{
 const profile={...createFixture().profile,firstName:' Alex ',lastName:'García de la Torre',secondSurname:'Rivera',dateOfBirth:'1992-04-04'};
 const value=policy.profileIdentityPayload(profile);
 assert.equal(value.last_name,'García de la Torre');assert.equal(value.second_surname,'Rivera');
 assert.equal(value.full_name,'Alex García de la Torre Rivera');
 assert.equal(policy.profileIdentityPayload({...profile,secondSurname:''}).second_surname,null);
});
test('shipping document validation normalizes valid pairs and allows clearing both fields',()=>{
 assert.deepEqual(policy.validateIdentityDocument('DNI','12.345.678-z'),{ok:true,type:'DNI',number:'12345678Z'});
 assert.equal(policy.validateIdentityDocument('DNI','12345678A').ok,false);
 assert.equal(policy.validateIdentityDocument('NIE','X1234567L').ok,true);
 assert.equal(policy.validateIdentityDocument('PASAPORTE','A1234567').ok,true);
 assert.equal(policy.validateIdentityDocument('DNI','').ok,false);
 assert.deepEqual(policy.validateIdentityDocument('',''),{ok:true,type:null,number:null});
 const p={...createFixture().profile,idDocumentType:'DNI',idDocumentNumber:'12345678-z'};
 assert.equal(policy.profileShippingPayload(p).id_document_number,'12345678Z');
});
test('shipping readiness requires original identity fields without inventing a second surname',()=>{
 const p={...createFixture().profile,firstName:'Alex',lastName:'Sample',secondSurname:'',patientNumber:12,dateOfBirth:'1992-04-04',sex:'female',idDocumentType:'DNI',idDocumentNumber:'12345678Z'};
 assert.equal(policy.patientShippingReadiness(p).ready,true);
 assert.deepEqual(policy.patientShippingReadiness({...p,patientNumber:undefined,idDocumentNumber:''}).missing,['patient_number','id_document']);
 assert.equal(policy.patientShippingReadiness({...p,sex:'other'}).ready,false);
});
test('account deletion requires exact confirmation and returns synchronous deleted result',async()=>{
 assert.equal(policy.accountDeletionPayload('delete_my_account'),null);
 assert.equal(policy.accountDeletionPayload('DELETE_MY_ACCOUNT '),null);
 const invalid=await previewTransport.execute('data.delete',{confirmation:'wrong'});assert.equal(invalid.ok,false);
 const failed=await previewTransport.execute('data.delete',{confirmation:'DELETE_MY_ACCOUNT',simulateError:true});assert.equal(failed.ok,false);assert.equal(failed.deleted,undefined);
 const result=await previewTransport.execute('data.delete',policy.accountDeletionPayload('DELETE_MY_ACCOUNT'));
 assert.equal(result.deleted,true);assert.equal(result.ok,true);
 const s=createFixture();const completed=policy.completePreviewAccountDeletion(s);
 assert.equal(completed.deletionStatus,'completed');assert.equal(completed.session,false);assert.equal(completed.reports.length,0);assert.equal(completed.chat.length,0);assert.equal(completed.profile.healthConsent,false);
 assert.ok(s.reports.length>0);assert.match(backendBindings['data.delete'],/POST \/api\/gdpr\/delete/);
});

test('cancelling a paid quarter preserves its original end across reload and expires at that instant',()=>{
 const {purchasePreviewPlan,changePreviewRenewal,hasCurrentSubscription,subscriptionDetails}=load('lib/preview/subscription.ts');
 const purchasedAt=Date.parse('2026-08-31T12:30:00Z');
 const active=purchasePreviewPlan(createFixture('new'),'quarterly',purchasedAt);
 assert.equal(active.subscriptionPeriodEnd,'2026-11-30T12:30:00.000Z');
 const end=Date.parse(active.subscriptionPeriodEnd);
 const cancelled=JSON.parse(JSON.stringify(changePreviewRenewal(active,'cancelled',end-1000)));
 assert.equal(cancelled.subscriptionStatus,'cancelled');
 assert.equal(cancelled.subscriptionPeriodEnd,active.subscriptionPeriodEnd);
 assert.equal(hasCurrentSubscription(cancelled,end-1),true);
 assert.equal(hasCurrentSubscription(cancelled,end),false);
 assert.equal(subscriptionDetails(cancelled,end-1).canRestoreRenewal,true);
 assert.equal(subscriptionDetails(cancelled,end).canStartNewTerm,true);
 assert.equal(changePreviewRenewal(cancelled,'active',end-1).subscriptionPeriodEnd,active.subscriptionPeriodEnd);
 assert.equal(changePreviewRenewal(cancelled,'active',end).subscriptionStatus,'cancelled');
 assert.equal(purchasePreviewPlan(cancelled,'quarterly',end-1).subscriptionPeriodEnd,active.subscriptionPeriodEnd);
 assert.ok(Date.parse(purchasePreviewPlan(cancelled,'quarterly',end).subscriptionPeriodEnd)>end);
 assert.equal(changePreviewRenewal(cancelled,'cancelled',end).subscriptionPeriodEnd,active.subscriptionPeriodEnd);
});

test('retired and unpaid preview plans gain no new paid period by cancelling',()=>{
 const {hasCurrentSubscription,changePreviewRenewal,subscriptionDetails}=load('lib/preview/subscription.ts');
 const now=Date.parse('2026-11-18T10:00:00Z');
 const state={...createFixture(),plan:'annual',subscriptionPeriodEnd:undefined};
 assert.equal(hasCurrentSubscription(state,now),true);
 const old=changePreviewRenewal(state,'cancelled',now);
 assert.equal(hasCurrentSubscription(old,now),false);
 assert.equal(subscriptionDetails(old,now).canRestoreRenewal,false);
 for (const status of ['past_due','paused']) {
  const unpaid={...state,subscriptionStatus:status,subscriptionPeriodEnd:'2026-12-31T00:00:00Z'};
  assert.equal(hasCurrentSubscription(changePreviewRenewal(unpaid,'cancelled',now),now),false);
 }
 assert.equal(hasCurrentSubscription({...state,subscriptionPeriodEnd:'invalid'},now),false);
});

test('a one-off lab purchase and a subscription preserve independent entitlements in both purchase orders',()=>{
 const {purchasePreviewPlan,changePreviewRenewal,hasCurrentSubscription}=load('lib/preview/subscription.ts');
 const now=Date.parse('2026-11-18T10:00:00Z');
 const free=createFixture('new');
 const lab=purchasePreviewPlan(free,'full_panel',now);
 assert.equal(lab.plan,'full_panel');assert.equal(lab.hasPurchasedLabPanel,true);
 assert.equal(hasCurrentSubscription(lab,now),false);
 const subscribed=purchasePreviewPlan(free,'quarterly',now);
 const addedLab=purchasePreviewPlan(subscribed,'full_panel',now);
 assert.equal(addedLab.plan,'quarterly');assert.equal(addedLab.hasPurchasedLabPanel,true);
 assert.equal(addedLab.subscriptionPeriodEnd,subscribed.subscriptionPeriodEnd);
 assert.equal(addedLab.kitCycle,subscribed.kitCycle);
 const addedSubscription=purchasePreviewPlan(lab,'quarterly',now);
 assert.equal(addedSubscription.hasPurchasedLabPanel,true);assert.equal(hasCurrentSubscription(addedSubscription,now),true);
 const cancelled=changePreviewRenewal(addedSubscription,'cancelled',now);
 assert.equal(cancelled.hasPurchasedLabPanel,true);
 assert.equal(hasCurrentSubscription(cancelled,Date.parse(cancelled.subscriptionPeriodEnd)),false);
});

test('lab uploads last one calendar year per purchase, including leap days, independently of renewal',()=>{
 const {purchasePreviewPlan,hasCurrentSubscription,hasLabUploadAccess,changePreviewRenewal}=load('lib/preview/subscription.ts');
 const now=Date.parse('2028-02-29T10:15:00Z');
 const lab=purchasePreviewPlan(createFixture('new'),'full_panel',now);
 assert.equal(lab.labPurchasedAt,'2028-02-29T10:15:00.000Z');
 assert.equal(lab.labUploadAccessUntil,'2029-02-28T10:15:00.000Z');
 const end=Date.parse(lab.labUploadAccessUntil);
 const sub=purchasePreviewPlan(lab,'quarterly',end-86400_000);
 assert.equal(sub.labUploadAccessUntil,lab.labUploadAccessUntil);
 const cancelled=changePreviewRenewal(sub,'cancelled',end-3600_000);
 assert.equal(hasLabUploadAccess(cancelled,end-1),true);
 assert.equal(hasLabUploadAccess(cancelled,end),false);
 assert.equal(hasCurrentSubscription(cancelled,end),true);
 assert.equal(hasCurrentSubscription(cancelled,Date.parse(cancelled.subscriptionPeriodEnd)),false);
 const anotherLab=purchasePreviewPlan(cancelled,'full_panel',end);
 assert.equal(anotherLab.labUploadAccessUntil,'2030-02-28T10:15:00.000Z');
 assert.equal(anotherLab.subscriptionPeriodEnd,cancelled.subscriptionPeriodEnd);
 assert.equal(anotherLab.subscriptionStatus,'cancelled');
 assert.equal(hasLabUploadAccess(anotherLab,Date.parse(anotherLab.subscriptionPeriodEnd)),true);
});

test('legacy lab upload periods are restored once and a known historical purchase keeps its true expiry',()=>{
 const {restoreLabUploadPeriod,hasLabUploadAccess}=load('lib/preview/subscription.ts');
 const now=Date.parse('2026-11-18T10:00:00Z');
 const free=createFixture('new');
 assert.equal(restoreLabUploadPeriod(free,now),free);
 const legacy={...free,plan:'full_panel'};
 const restored=restoreLabUploadPeriod(legacy,now);
 assert.equal(restored.labUploadAccessUntil,'2027-11-18T10:00:00.000Z');
 assert.equal(restored.labPurchasedAt,undefined);
 const afterExpiry=JSON.parse(JSON.stringify(restored));
 assert.equal(restoreLabUploadPeriod(afterExpiry,now+2*366*86400_000),afterExpiry);
 assert.equal(hasLabUploadAccess(afterExpiry,Date.parse(restored.labUploadAccessUntil)),false);
 const dated=restoreLabUploadPeriod({...legacy,profile:{...legacy.profile,full_panel_purchased_at:'2023-06-01T12:00:00Z'}},now);
 assert.equal(dated.labUploadAccessUntil,'2024-06-01T12:00:00.000Z');
 assert.equal(hasLabUploadAccess(dated,now),false);
});
