// Run with Node >= 22.13: node scripts/check-creative-journeys.mjs
// Native type stripping loads these pure TypeScript helpers; no application build is needed.
import assert from 'node:assert/strict';
import test from 'node:test';
import {archiveReport,restoreReport} from '../components/preview/archive-policy.ts';
import {createDemoReceipt,parseDemoReceipt,parseDemoPhase,phaseStorageKey,storeDemoReceipt,DEMO_RECEIPT_KEY} from '../components/pages/profile/deletion-receipt.ts';
import {bookingPayload,entryPayload,reprocessPayload} from '../components/preview/admin-operations.ts';
import {canReadReport,reportReadiness,reportForKit,invalidateReportEstimates} from '../lib/preview/policy.ts';
import {createFixture} from '../lib/preview/fixtures.ts';

const sample=()=>createFixture().reports[0];

test('archive round-trip preserves the exact prior state and source data',()=>{
 for(const status of ['ready','processing','pending_context','error']){
  const original={...sample(),status,contextComplete:status!=='pending_context',version:7,markerValues:{apob:{value:88,unit:'mg/dL'}}};
  const before=structuredClone(original);
  const archived=archiveReport(original);
  assert.equal(archived.status,'archived');
  assert.equal(archived.archivedStatus,status);
  assert.equal(canReadReport(archived),false);
  assert.strictEqual(archiveReport(archived),archived,'archiving twice must preserve the recorded prior state');
  const restored=restoreReport(archived);
  assert.equal(restored.status,status);
  assert.equal(restored.archivedStatus,undefined);
  assert.deepEqual({...restored,archivedStatus:undefined},{...before,archivedStatus:undefined});
  assert.deepEqual(original,before,'archiving/restoring must not mutate the source report');
  assert.equal(canReadReport(restored),status==='ready');
  assert.strictEqual(restoreReport(original),original,'restore must leave an active report alone');
 }
});

test('legacy archives without prior status return to preparation, never inferred readiness',()=>{
 for(const contextComplete of [true,false]){
  const restored=restoreReport({...sample(),status:'archived',contextComplete});
  assert.equal(restored.status,contextComplete?'processing':'pending_context');
  assert.equal(canReadReport(restored),false);
 }
});

test('deletion receipts require exact identity and a valid receipt window',()=>{
 const now=Date.UTC(2026,8,18,12),receipt=createDemoReceipt(now);
 assert.deepEqual(parseDemoReceipt(receipt,now),receipt);
 assert.deepEqual(parseDemoReceipt(receipt,now+30*86400000),receipt);
 assert.equal(parseDemoReceipt(receipt,now+30*86400000+1),null);
 for(const invalid of [null,{}, {...receipt,simulated:false},{...receipt,receipt:'production'}, {...receipt,operationId:`demo-delete-${now-1}`},{...receipt,savedAt:now+.5},createDemoReceipt(now+1)]){
  assert.equal(parseDemoReceipt(invalid,now),null);
 }
});

test('receipt phases remain isolated across requests',()=>{
 const now=Date.UTC(2026,8,18,12),first=createDemoReceipt(now),second=createDemoReceipt(now+1);
 const storage=new Map(),originalStorage=globalThis.sessionStorage;
 globalThis.sessionStorage={setItem:(key,value)=>storage.set(key,value),getItem:key=>storage.get(key)??null};
 try{
  storeDemoReceipt(first);
  assert.deepEqual(parseDemoReceipt(JSON.parse(storage.get(DEMO_RECEIPT_KEY)),now),first);
  storage.set(phaseStorageKey(first),'complete');
  storeDemoReceipt(second);
  assert.notEqual(phaseStorageKey(first),phaseStorageKey(second));
  assert.equal(parseDemoPhase(storage.get(phaseStorageKey(second))??null),'pending');
  assert.equal(parseDemoPhase(storage.get(phaseStorageKey(first))),'complete');
  storage.set(phaseStorageKey(second),'manual_review');
  assert.equal(parseDemoPhase(storage.get(phaseStorageKey(second))),'manual_review');
  assert.equal(parseDemoPhase(storage.get(phaseStorageKey(first))),'complete');
  for(const value of [null,'completed','unknown',''])assert.equal(parseDemoPhase(value),'pending');
 }finally{
  if(originalStorage===undefined)delete globalThis.sessionStorage;
  else globalThis.sessionStorage=originalStorage;
 }
});

test('admin actions have distinct exact targets, versions and validated values',()=>{
 assert.deepEqual(bookingPayload('booking-2','sample_received'),{action:'booking.update',bookingId:'booking-2',status:'sample_received',simulated:true});
 assert.deepEqual(reprocessPayload('report-3',8),{action:'report.reprocess',reportId:'report-3',expectedVersion:8,simulated:true});
 const rows=[{key:'apob',value:' 88.5 ',unit:'mg/dL'},{key:'insulin',value:'0',unit:'mIU/L'},{key:'glucose',value:' ',unit:'mg/dL'}];
 const before=structuredClone(rows);
 assert.deepEqual(entryPayload('person-4',rows),{action:'results.enter',userId:'person-4',values:[{marker:'apob',value:88.5,unit:'mg/dL'},{marker:'insulin',value:0,unit:'mIU/L'}],simulated:true});
 assert.deepEqual(rows,before);
 assert.throws(()=>entryPayload('person-4',[]));
 assert.throws(()=>entryPayload('person-4',[{key:'apob',value:' ',unit:'mg/dL'}]));
 for(const value of ['-1','NaN','Infinity','eighty'])assert.throws(()=>entryPayload('person-4',[{key:'apob',value,unit:'mg/dL'}]));
 assert.throws(()=>entryPayload('person-4',[{key:'apob',value:'88',unit:' '}]));
});

test('kit identity survives newer uploads, pending states, archival and restoration',()=>{
 for(const scenario of ['ready','context','processing','error']){
  const state=createFixture(scenario),own=state.reports[0];
  const upload={...state.reports[1],id:'newer-upload',date:'2026-09-18',status:'ready',contextComplete:true};
  state.reports=[upload,...state.reports];
  assert.strictEqual(reportForKit(state),own,'the latest upload cannot take ownership of a kit');
  assert.equal(reportReadiness(reportForKit(state)),scenario==='context'?'pending_context':scenario);
  assert.equal(canReadReport(reportForKit(state)),scenario==='ready');
  state.reports=state.reports.map(report=>report.id===own.id?archiveReport(report):report);
  assert.equal(reportForKit(state),undefined,'an archived kit report cannot borrow a readable upload');
  state.reports=state.reports.map(report=>report.id===own.id?restoreReport(report):report);
  assert.equal(canReadReport(reportForKit(state)),scenario==='ready');
  assert.equal(canReadReport(reportForKit(state),false),false);
 }
});

test('editing and restoring a kit report keeps estimates invalid until preparation completes',()=>{
 for(const contextComplete of [true,false]){
  const state=createFixture(),original={...state.reports[0],contextComplete,version:4,markerValues:{apob:{value:91,unit:'mg/dL'}}};
  const before=structuredClone(original);
  const updated=restoreReport(archiveReport(invalidateReportEstimates(original)));
  state.reports=[updated,...state.reports.slice(1)];
  assert.deepEqual(original,before);
  assert.equal(updated.version,5);
  assert.equal(updated.biologicalAge,null);
  assert.equal(updated.longevityScore,null);
  assert.deepEqual(updated.markerValues,original.markerValues);
  assert.equal(updated.id,original.id);
  assert.equal(updated.date,original.date);
  assert.equal(reportReadiness(reportForKit(state)),contextComplete?'processing':'pending_context');
  assert.equal(canReadReport(reportForKit(state)),false);
 }
});
