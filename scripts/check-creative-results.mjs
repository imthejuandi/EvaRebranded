// Run: node scripts/check-creative-results.mjs
// Uses Node built-ins and the project's existing TypeScript compiler; installs nothing.
// Shallow hook/JSX harness executes actual helpers and save handlers. It does not
// certify React rendering, browser focus, accessibility or asynchronous backend behavior.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';

const require=createRequire(import.meta.url);
const ts=require('typescript');
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const cache=new Map();
let active,preview;
const node=(type,props)=>({type,props:props||{}});
const slot=initial=>{const harness=active,index=harness.cursor++;if(!(index in harness.slots))harness.slots[index]=typeof initial==='function'?initial():initial;return [harness,index]};
const react={
  useState(initial){const [h,i]=slot(initial);return [h.slots[i],value=>{h.slots[i]=typeof value==='function'?value(h.slots[i]):value}]},
  useRef(initial){const [h,i]=slot(()=>({current:initial}));return h.slots[i]},
  useEffect(effect,deps){const [h,i]=slot(()=>undefined),previous=h.slots[i];if(!previous||!deps||deps.some((value,index)=>value!==previous[index])){h.slots[i]=deps;h.effects.push(effect)}},
  useMemo(factory){return factory()},useId(){const [,i]=slot('id');return `test-${i}`},
};
const componentStubs=new Proxy({}, {get:(_,name)=>name==='__esModule'?true:props=>node(String(name),props)});
function load(relative){
  const filename=path.resolve(root,relative);
  if(cache.has(filename))return cache.get(filename).exports;
  const module={exports:{}};cache.set(filename,module);
  let code=ts.transpileModule(fs.readFileSync(filename,'utf8'),{fileName:filename,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  // Expose a private component only inside this test module, leaving source/API intact.
  if(relative.endsWith('/BiomarkerPage.tsx'))code+='\nexports.testEditReading=EditReading;';
  const localRequire=specifier=>{
    if(specifier==='react')return react;
    if(specifier==='react/jsx-runtime')return {jsx:node,jsxs:node,Fragment:'fragment'};
    if(specifier.endsWith('/PreviewProvider')||specifier==='./PreviewProvider')return {usePreview:()=>preview};
    if(specifier==='lucide-react'||specifier.includes('AppPrimitives')||specifier.includes('/story/'))return componentStubs;
    const base=specifier.startsWith('@/')?path.join(root,specifier.slice(2)):path.resolve(path.dirname(filename),specifier);
    const resolved=[base,`${base}.ts`,`${base}.tsx`].find(candidate=>fs.existsSync(candidate)&&fs.statSync(candidate).isFile());
    assert.ok(resolved,`Unhandled dependency: ${specifier}`);
    return load(path.relative(root,resolved));
  };
  new Function('require','module','exports',code)(localRequire,module,module.exports);
  return module.exports;
}
function harness(component,props){
  const h={slots:[],cursor:0,effects:[],tree:null,render(){this.cursor=0;this.effects=[];active=this;this.tree=component(props);active=undefined;for(const effect of this.effects)effect();return this.tree}};
  h.render();return h;
}
function all(tree,predicate){
  if(Array.isArray(tree))return tree.flatMap(child=>all(child,predicate));
  if(!tree||typeof tree!=='object')return [];
  return [...(predicate(tree)?[tree]:[]),...all(tree.props?.children,predicate)];
}
function one(tree,predicate){const matches=all(tree,predicate);assert.equal(matches.length,1,'Expected one matching control');return matches[0]}
function provider(state){
  const calls=[];
  preview={state,hydrated:true,update(update){this.state=update(this.state)},async request(operation,payload){calls.push({operation,payload});return {ok:true,simulated:true}}};
  // Production destructures these methods; retain their provider binding.
  preview.update=preview.update.bind(preview);preview.request=preview.request.bind(preview);
  return calls;
}
const event={preventDefault(){}};
const fixtures=load('lib/preview/fixtures.ts');
const policy=load('lib/preview/policy.ts');
const labs=load('components/pages/labs/LabsPage.tsx');
const upload=load('components/pages/upload/UploadPage.tsx');
const context=load('components/pages/upload/ContextPage.tsx');
const ReportEditor=load('components/preview/ReportEditor.tsx').default;
const EditReading=load('components/pages/biomarker/BiomarkerPage.tsx').testEditReading;
const initial=fixtures.createFixture();
const june=initial.reports.find(report=>report.id==='demo-junio');
const march=initial.reports.find(report=>report.id==='demo-marzo');
const marker=initial.markers.find(item=>item.key==='apob');
assert.ok(june&&march&&marker);

// Dated fixtures and uploaded reports must preserve their own source/value identity.
assert.equal(labs.readingsForReport(initial.markers,june).find(item=>item.key==='apob').readingValue,78);
assert.equal(labs.readingsForReport(initial.markers,march).find(item=>item.key==='apob').readingValue,88);
const middle={...march,id:'uploaded-may',source:'upload',date:'2026-05-12',markerKeys:['apob'],markerValues:{apob:{value:83,unit:'mg/dL'}}};
const future={...middle,id:'future',date:'2026-08-01'};
const incomparable={...middle,id:'wrong-unit',date:'2026-05-20',markerValues:{apob:{value:0.83,unit:'g/L'}}};
const missing={...middle,id:'missing',date:'2026-05-25',markerValues:{}};
const reports=[future,march,incomparable,june,missing,middle];
const untouched=structuredClone(reports);
assert.equal(labs.previousComparableReport(initial.markers,reports,june),middle);
assert.equal(labs.previousComparableReport(initial.markers,[june,march],march),undefined);
assert.equal(labs.previousComparableReport(initial.markers,reports,june,false),undefined);
for(const status of ['processing','pending_context','archived','error'])assert.equal(labs.previousComparableReport(initial.markers,[march,{...middle,status}],june)?.id,march.id);
assert.deepEqual(reports,untouched,'Comparison cannot sort/mutate stored reports');
assert.deepEqual([middle.id,middle.date,middle.source],['uploaded-may','2026-05-12','upload']);
const missingReading=labs.readingsForReport(initial.markers,missing)[0];
assert.equal(missingReading.readingValue,null);assert.equal(missingReading.readingStatus,'unknown');
const mismatchedReading=labs.readingsForReport(initial.markers,incomparable)[0];
assert.equal(mismatchedReading.readingValue,0.83);assert.equal(mismatchedReading.unit,'g/L');
assert.equal(mismatchedReading.rangeComparable,false);assert.equal(mismatchedReading.readingStatus,'unknown');
const zero={...middle,markerValues:{apob:{value:0,unit:'mg/dL'}}};
assert.equal(labs.readingsForReport(initial.markers,zero)[0].readingValue,0);
assert.equal(labs.previousComparableReport(initial.markers,[zero],june),zero);

// Execute each real save entrypoint; neither may alter the other report or fixture.
for(const entrypoint of ['report','marker']){
  const state=fixtures.createFixture(),original=structuredClone(state);
  const target=state.reports.find(report=>report.id==='demo-marzo');target.version=6;
  const calls=provider(state);
  const h=entrypoint==='report'?harness(ReportEditor,{report:target,onClose(){}}):harness(EditReading,{marker,reading:{report:target,value:88,unit:'mg/dL'},onClose(){},onSaved(){}});
  const input=one(h.tree,item=>item.type==='input'&&(entrypoint==='report'?item.props['aria-label']==='Valor de apob':item.props.inputMode==='decimal'));
  input.props.onChange({target:{value:'0'}});h.render();
  await one(h.tree,item=>item.type==='form').props.onSubmit(event);
  const changed=preview.state.reports.find(report=>report.id===target.id);
  assert.equal(calls[0].operation,entrypoint==='report'?'report.save':'marker.edit');
  assert.equal(calls[0].payload.reportId,target.id);
  assert.equal(changed.markerValues.apob.value,0);assert.equal(changed.markerValues.apob.unit,'mg/dL');
  assert.equal(changed.date,target.date);assert.equal(changed.source,target.source);assert.equal(changed.version,7);
  assert.equal(changed.biologicalAge,null);assert.equal(changed.longevityScore,null);assert.equal(policy.reportReadiness(changed),'processing');
  assert.deepEqual(preview.state.reports.find(report=>report.id==='demo-junio'),original.reports.find(report=>report.id==='demo-junio'));
  assert.deepEqual(preview.state.markers,original.markers);
}

// File metadata, extracted draft validation and confirmed/deferred upload snapshots.
assert.equal(upload.validateFileMetadata({name:'example.pdf',type:'application/pdf',size:upload.MAX_UPLOAD_SIZE}),null);
for(const file of [{name:'example.pdf',type:'application/pdf',size:upload.MAX_UPLOAD_SIZE+1},{name:'example.exe',type:'application/pdf',size:1},{name:'example.pdf',type:'text/plain',size:1},{name:'empty.pdf',type:'application/pdf',size:0}])assert.ok(upload.validateFileMetadata(file));
const rows=upload.makeDraft(initial.markers).map(row=>({...row,confirmed:true}));
rows[0].value='0';
assert.deepEqual(upload.validateDraft(rows,initial.markers,'2026-06-12'),{});
assert.ok(upload.validateDraft(rows,initial.markers,'2026-02-30').date);
assert.ok(upload.validateDraft(rows,initial.markers,'2999-01-01').date);
assert.ok(upload.validateDraft(rows.map((row,index)=>index===0?{...row,value:''}:row),initial.markers,'2026-06-12')[rows[0].id]);
assert.ok(upload.validateDraft(rows.map((row,index)=>index===0?{...row,unit:'g/L'}:row),initial.markers,'2026-06-12')[rows[0].id]);
assert.ok(upload.validateDraft([...rows,{...rows[0],id:'duplicate'}],initial.markers,'2026-06-12')[rows[0].id]);
const draft={durable:{medications:'unknown',supplements:'[]',conditions:'',alcohol_drinks_per_week:'0'},transient:{currently_ill:'unknown'},confirmedAt:'2026-06-12T10:00:00Z',version:4};
const deferred=upload.createUploadedReport(rows,'2026-06-12',draft,false);
assert.equal(deferred.source,'upload');assert.equal(deferred.date,'2026-06-12');assert.equal(deferred.markerValues.apob.value,0);
assert.equal(policy.reportReadiness(deferred),'pending_context');assert.equal(deferred.context.confirmedAt,'');assert.equal(deferred.context.version,4);
assert.equal(draft.confirmedAt,'2026-06-12T10:00:00Z');
assert.deepEqual(deferred.context.durable,draft.durable);assert.notEqual(deferred.context.durable,draft.durable);assert.notEqual(deferred.context.transient,draft.transient);
const confirmed=upload.createUploadedReport(rows,'2026-06-12',draft,true);
assert.equal(policy.reportReadiness(confirmed),'processing');assert.equal(confirmed.context.confirmedAt,draft.confirmedAt);
for(const [value,presence] of [[undefined,'not_added'],['','not_added'],['unknown','unknown'],['[]','none'],['0','provided']])assert.equal(context.contextPresence(value),presence);
const durableLines=context.contextSummaryLines(draft,'durable').map(([,value])=>value);
assert.ok(durableLines.includes('0'));assert.ok(durableLines.includes(context.contextCopy.es.durable.unknown));assert.ok(durableLines.includes(context.contextCopy.es.durable.noneAnswer));assert.ok(durableLines.includes(context.contextCopy.es.durable.empty));
assert.equal(context.contextSummaryLines(draft,'transient')[0][1],context.contextCopy.es.durable.unknown);
assert.equal(context.contextSummaryLines({...draft,transient:{currently_ill:'false'}},'transient')[0][1],context.contextCopy.es.transient.no);
assert.equal(context.contextSummaryLines({...draft,transient:{skipped:'true'}},'transient')[0][1],context.contextCopy.es.transient.skipped);
assert.deepEqual(context.validateContext({alcohol_drinks_per_week:'unknown'},{cycle_day:'unknown'}),{});
assert.ok(context.validateContext({alcohol_drinks_per_week:'-1'},{cycle_day:'61'}).cycle_day);

// The actual context editor strips profile metadata from answers and increments its
// snapshot version only on explicit confirmation, retaining unknown/none answers.
let editorDraft,editorConfirmation;
const editor=harness(context.ContextEditor,{initialContext:{...draft,durable:{...draft.durable,_version:'4',_confirmedAt:draft.confirmedAt}},onDraftChange:value=>{editorDraft=value},onConfirm:value=>{editorConfirmation=value}});
assert.equal(editorDraft.confirmedAt,'');assert.equal(editorDraft.version,4);assert.equal(editorDraft.durable._version,undefined);
one(editor.tree,item=>item.type==='input'&&item.props.type==='checkbox').props.onChange({target:{checked:true}});editor.render();
await one(editor.tree,item=>item.type==='form').props.onSubmit(event);
assert.equal(editorConfirmation.version,5);assert.ok(editorConfirmation.confirmedAt);assert.equal(editorConfirmation.durable.medications,'unknown');assert.equal(editorConfirmation.durable.supplements,'[]');

function contextState(){const state=fixtures.createFixture();state.profile.context={medications:'[]',_confirmedAt:'2026-03-01T12:00:00Z',_version:'2'};state.reports=state.reports.map(report=>report.id===june.id?{...report,status:'pending_context',contextComplete:false,version:8}:report);return state}
// Execute the actual deferred-save callback: partial answers attach to this report,
// never overwrite the person's confirmed durable profile, and remain unreadable.
{
  const state=contextState(),profileBefore=structuredClone(state.profile),otherBefore=structuredClone(state.reports.find(report=>report.id===march.id));
  const calls=provider(state);const h=harness(context.default,{reportId:june.id});
  one(h.tree,item=>item.type===context.ContextEditor).props.onDraftChange({...draft,confirmedAt:''});h.render();
  await one(h.tree,item=>item.type==='button'&&item.props.className?.includes('context-defer')).props.onClick();
  const saved=preview.state.reports.find(report=>report.id===june.id);
  assert.equal(calls[0].payload.saveDraftOnly,true);assert.equal(calls[0].payload.reportId,june.id);
  assert.deepEqual(preview.state.profile,profileBefore);assert.deepEqual(preview.state.reports.find(report=>report.id===march.id),otherBefore);
  assert.equal(saved.version,9);assert.equal(saved.context.version,4);assert.equal(saved.context.confirmedAt,'');assert.equal(policy.reportReadiness(saved),'pending_context');
  assert.deepEqual(saved.context.durable,draft.durable);assert.deepEqual(saved.context.transient,draft.transient);
}
// A response to an older context revision must not overwrite a newer report.
{
  provider(contextState());let resolveRequest;
  preview.request=()=>new Promise(resolve=>{resolveRequest=resolve});
  const h=harness(context.default,{reportId:june.id});
  const pending=one(h.tree,item=>item.type===context.ContextEditor).props.onConfirm(editorConfirmation);
  preview.state={...preview.state,reports:preview.state.reports.map(report=>report.id===june.id?{...report,version:9}:report)};
  h.render();const before=structuredClone(preview.state);resolveRequest({ok:true});await pending;
  assert.deepEqual(preview.state,before,'Stale context response must leave newer report and profile intact');
  h.render();assert.equal(all(h.tree,item=>item.props?.role==='alert').length,1);
}
console.log('PASS: dated/source-specific comparison; unit mismatch and missing versus zero; actual report/marker invalidation handlers; upload constraints and snapshots; unknown/none/deferred context; confirmed context version; durable-profile preservation; stale-version rejection.');
