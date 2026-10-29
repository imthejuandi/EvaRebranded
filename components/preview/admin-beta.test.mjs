import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import {test} from 'node:test';
const require=createRequire(import.meta.url),ts=require('typescript');
function load(relative){const file=new URL(relative,import.meta.url),module={exports:{}};const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;new Function('module','exports',code)(module,module.exports);return module.exports;}
const {createDemoCycles,cyclePayload,applyCycleAction,actionsForCycle,simulateBridgePass}=load('./admin-cycle-operations.ts');
const {betaNext,simulateBetaAccess,simulateBetaSubscribe}=load('../site/beta-preview.ts');

test('a cycle progresses through assignment and shipping while preserving its identifier and values',()=>{
 let cycles=createDemoCycles();const original=structuredClone(cycles),id=cycles[0].id;
 const assigned=cyclePayload(id,'assign_kit',{kitLabelCode:' DEMO-NEW '});assert.deepEqual(assigned,{cycleId:id,action:'assign_kit',kitLabelCode:'DEMO-NEW'});
 cycles=applyCycleAction(cycles,assigned,1);assert.equal(cycles[0].status,'kit_assigned');assert.equal(cycles[0].kitLabelCode,'DEMO-NEW');
 cycles=applyCycleAction(cycles,cyclePayload(id,'ship',{trackingNumber:' DEMO-TRACK ',trackingUrl:'https://example.com/tracking'}),2);
 assert.equal(cycles[0].status,'shipped');assert.equal(cycles[0].trackingNumber,'DEMO-TRACK');assert.equal(cycles[0].id,id);assert.equal(cycles[0].kitLabelCode,'DEMO-NEW');assert.deepEqual(cycles.slice(1),original.slice(1));assert.equal(original[0].status,'awaiting_fulfillment');
});
test('shipping requires assigned state, complete identity, and a configured panel',()=>{
 const cycles=createDemoCycles();
 for(const i of [0,1,2,4])assert.throws(()=>applyCycleAction(cycles,cyclePayload(cycles[i].id,'ship',{trackingNumber:'DEMO-TRACK'}),1));
 assert.equal(cycles[1].status,'kit_assigned');assert.equal(cycles[2].status,'kit_assigned');
});
test('duplicate labels and stale cycle operations never overwrite another cycle',()=>{
 const cycles=createDemoCycles(),id=cycles[0].id;
 assert.throws(()=>applyCycleAction(cycles,cyclePayload(id,'assign_kit',{kitLabelCode:'DEMO-KIT-B'}),1),/asignada/);
 assert.throws(()=>applyCycleAction(cycles,cyclePayload(id,'assign_kit',{kitLabelCode:'DEMO-FREE'}),0),/cambió/);
 assert.equal(cycles[0].kitLabelCode,null);
});
test('reopening releases its label and cancellation is terminal',()=>{
 let cycles=createDemoCycles(),id=cycles[3].id;
 cycles=applyCycleAction(cycles,cyclePayload(id,'reopen'),1);assert.equal(cycles[3].kitLabelCode,null);assert.equal(cycles[3].status,'awaiting_fulfillment');
 cycles=applyCycleAction(cycles,cyclePayload(id,'cancel'),2);assert.equal(cycles[3].status,'cancelled');assert.deepEqual(actionsForCycle('cancelled'),[]);assert.deepEqual(actionsForCycle('completed'),[]);assert.deepEqual(actionsForCycle('order_sent'),[]);
 assert.throws(()=>applyCycleAction(cycles,cyclePayload(id,'reopen'),3));
});
test('cycle action payloads reject absent tracking, undersized labels, unsafe URLs and unknown actions',()=>{
 const id=createDemoCycles()[0].id;for(const f of [()=>cyclePayload(id,'ship'),()=>cyclePayload(id,'assign_kit',{kitLabelCode:'AB'}),()=>cyclePayload(id,'ship',{trackingNumber:'TEST',trackingUrl:'javascript:alert(1)'}),()=>cyclePayload(id,'invented')])assert.throws(f);
});
test('bridge failure can be retried without altering cycle or report state',()=>{
 const cycles=createDemoCycles(),before=structuredClone(cycles);assert.equal(simulateBridgePass(true).ok,false);assert.deepEqual(simulateBridgePass().summary,{uploaded:1,acks:1,orus:0,errors:[],ms:24});assert.deepEqual(cycles,before);
});
test('beta gate fails closed when unconfigured and never accepts a wrong password',()=>{
 assert.equal(simulateBetaAccess({password:'EVA-DEMO'},'unconfigured').status,503);assert.equal(simulateBetaAccess({password:' EVA-DEMO'}).status,401);assert.equal(simulateBetaAccess({password:'wrong'}).status,401);assert.equal(simulateBetaAccess({password:'EVA-DEMO'},'failure').ok,false);assert.equal(simulateBetaAccess({password:'EVA-DEMO'}).ok,true);
});
test('beta continuation preserves internal intent but rejects external and gate-loop destinations',()=>{
 const valid='/es/dashboard?tab=latest#reading';assert.equal(simulateBetaAccess({password:'EVA-DEMO',next:valid}).next,valid);
 for(const target of ['https://evil.test','//evil.test','/\\evil.test','/es/beta','/es/%62eta','/%0A/beta'])assert.equal(betaNext(target),'/es/dashboard');
});
test('waitlist normalizes the original payload and treats repeated addresses as success',()=>{
 const seen=new Set();const first=simulateBetaSubscribe({email:' Example@EXAMPLE.com ',locale:'en'},seen);assert.deepEqual(first,{ok:true,httpStatus:200,status:'subscribed',email:'example@example.com',locale:'en'});assert.equal(seen.size,0);seen.add(first.email);const repeat=simulateBetaSubscribe({email:'example@example.com',locale:'xx'},seen);assert.equal(repeat.ok,true);assert.equal(repeat.status,'duplicate');assert.equal(repeat.locale,'es');
});
test('invalid waitlist email and service failure leave the list unchanged for retry',()=>{
 const seen=new Set();assert.equal(simulateBetaSubscribe({email:'bad',locale:'es'},seen).httpStatus,400);assert.equal(simulateBetaSubscribe({email:'a@example.com',locale:'es'},seen,true).httpStatus,500);assert.equal(seen.size,0);assert.equal(simulateBetaSubscribe({email:'a@example.com',locale:'es'},seen).status,'subscribed');
});
