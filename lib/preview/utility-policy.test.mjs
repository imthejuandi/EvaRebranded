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
test('confirmed upload quota is cumulative and deleting a report does not restore it',()=>{
 const s=createFixture('new');s.totalUploadsUsed=4;s.reports=[];
 assert.equal(policy.uploadQuota(s).remaining,1);
 const next=policy.recordConfirmedUpload(s);
 assert.equal(next.totalUploadsUsed,5);assert.equal(policy.uploadQuota({...next,reports:[]}).atLimit,true);
 assert.equal(policy.uploadQuota({...next,plan:'annual',subscriptionStatus:'active'}).atLimit,false);
 assert.equal(policy.uploadQuota({...next,plan:'annual',subscriptionStatus:'cancelled'}).atLimit,true);
});
test('annual entitlement and original intent links survive authentication and onboarding',()=>{
 const s=createFixture();assert.equal(policy.normalizePlan('annual'),'annual');
 assert.equal(policy.hasPaidAccess({...s,plan:'annual',subscriptionStatus:'active'}),true);
 assert.equal(policy.hasPaidAccess({...s,plan:'annual',subscriptionStatus:'past_due'}),false);
 for(const raw of ['intent=annual','plan=annual','next='+encodeURIComponent('/es/checkout-resume?intent=annual')])assert.equal(policy.readFlowIntent(new URLSearchParams(raw)).plan,'annual');
 assert.equal(policy.readFlowIntent(new URLSearchParams('plan=invalid&intent=annual')).invalidPlan,true);
 const {onboardingCopy}=load('components/preview/OnboardingPage.tsx');assert.ok(onboardingCopy.es.paths.some(([key])=>key==='annual'));
 const flow=policy.readFlowIntent(new URLSearchParams('intent=annual&redirect=%2Fes%2Flabs%2Fdemo-junio'));
 assert.match(policy.destinationAfterOnboarding(flow,'annual'),/plan=annual/);
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
