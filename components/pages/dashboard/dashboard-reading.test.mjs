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
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const cache = new Map();
function load(relative) {
  const file = path.resolve(root, relative);
  if (cache.has(file)) return cache.get(file).exports;
  const module = {exports: {}};
  cache.set(file, module);
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {fileName: file, compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX}}).outputText;
  const localRequire = name => {
    if(name.endsWith('.css'))return {};
    if (!name.startsWith('.') && !name.startsWith('@/')) return require(name);
    const base = name.startsWith('@/') ? path.join(root, name.slice(2)) : path.resolve(path.dirname(file), name);
    const resolved = [base, `${base}.ts`, `${base}.tsx`].find(candidate => fs.existsSync(candidate) && fs.statSync(candidate).isFile());
    assert.ok(resolved, `Cannot resolve ${name}`);
    return load(path.relative(root, resolved));
  };
  new Function('require', 'module', 'exports', code)(localRequire, module, module.exports);
  return module.exports;
}


const {createFixture} = load('lib/preview/fixtures.ts');
const {invalidateReportEstimates,reportInputSignature} = load('lib/preview/policy.ts');
const {selectExecutiveStory,selectDashboardReading,selectReportNarrative,selectMarkerInterpretation,selectReportActions,dashboardMarkerForReport,dashboardMarkerHistory,selectWearableObservations} = load('components/pages/dashboard/dashboard-reading.ts');
const june = state => state.reports.find(item=>item.id==='demo-junio');
const march = state => state.reports.find(item=>item.id==='demo-marzo');
const stamp = report => {report.reading={...report.reading,reportId:report.id,reportVersion:report.version??1,inputSignature:reportInputSignature(report),status:'ready'};return report;};

test('latest ready report remains readable while newer sample is pending',()=>{
 for(const scenario of ['processing','context','error']){
  const state=createFixture(scenario),reading=selectDashboardReading(state);
  assert.equal(reading.latest.id,'demo-marzo');assert.equal(reading.latestSubmission.id,'demo-junio');assert.equal(reading.pending.id,'demo-junio');assert.equal(reading.ready,true);
  assert.equal(selectExecutiveStory(state).reportId,'demo-marzo');
 }
 for(const mutate of [s=>s.session=false,s=>s.profile.healthConsent=false,s=>s.deletionStatus='completed']){
  const s=createFixture();mutate(s);assert.equal(selectDashboardReading(s).ready,false);assert.equal(selectExecutiveStory(s),null);
 }
});
test('summary remains bound to selected report and revision',()=>{
 const s=createFixture(),a=selectReportNarrative(june(s)),b=selectReportNarrative(march(s));
 assert.equal(a.state,'ready');assert.equal(b.state,'ready');assert.notEqual(a.text,b.text);assert.match(a.text,/78 mg\/dL/);assert.match(b.text,/88 mg\/dL/);
 const wrong={...june(s),id:'different-report'};assert.equal(selectReportNarrative(wrong).state,'stale');
 june(s).version=2;assert.equal(selectReportNarrative(june(s)).state,'stale');
});
test('missing and stale summaries never become reassuring generic copy',()=>{
 const s=createFixture(),r=june(s);delete r.summary_narrative;delete r.summary_narrative_es;
 assert.deepEqual(selectReportNarrative(r).text,null);assert.equal(selectReportNarrative(r).state,'missing');
 r.summary_narrative_es='A real report-specific fixture sentence';r.markerValues.apob.value=79;
 assert.equal(selectReportNarrative(r).state,'stale');assert.equal(selectReportNarrative(r).text,null);
 delete r.reading;assert.equal(selectReportNarrative(r).text,null);
});
test('marker interpretation belongs to selected report not global definition',()=>{
 const s=createFixture();const a=selectMarkerInterpretation(june(s),'apob'),b=selectMarkerInterpretation(march(s),'apob');
 assert.match(a.text,/78/);assert.match(b.text,/88/);assert.notEqual(a.text,b.text);assert.notEqual(a.text,s.markers[0].description);
 delete june(s).markerValues.apob.interpretation;delete june(s).markerValues.apob.interpretation_es;
 assert.equal(selectMarkerInterpretation(june(s),'apob').text,null);
 assert.equal(selectMarkerInterpretation(june(s),'not-in-report').text,null);
});
test('actions retain owning report and linked biomarkers',()=>{
 const s=createFixture(),r=june(s);r.actionSteps.push({...march(s).actionSteps[0]});
 const actions=selectReportActions(r);assert.equal(actions.length,2);assert.ok(actions.every(a=>a.lab_result_id===r.id));
 assert.deepEqual(actions[0].related_biomarker_keys,['hscrp','insulin']);
 r.reading.status='stale';assert.equal(selectReportActions(r).length,0);
});
test('sample context preserves unknown skipped and recorded values',()=>{
 const {contextValue}=load('components/pages/dashboard/ExecutiveReading.tsx');
 assert.equal(contextValue(undefined),'No consta');assert.equal(contextValue('unknown'),'No consta');assert.equal(contextValue('skipped'),'Se omitió esta respuesta');
 assert.equal(contextValue('true'),'Sí, registrado');assert.equal(contextValue('false'),'No, registrado');
 const s=createFixture();s.profile.context={currently_ill:'true'};assert.equal(june(s).context.transient.currently_ill,'unknown');
 assert.equal(selectExecutiveStory(s).context.transient.currently_ill,'unknown');
});
test('recorded illness is shown without claiming it was used in interpretation',()=>{
 const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{ExecutiveReading}=load('components/pages/dashboard/ExecutiveReading.tsx');
 const s=createFixture(),r=june(s);r.context.transient.currently_ill='true';stamp(r);
 const html=renderToStaticMarkup(React.createElement(ExecutiveReading,{story:selectExecutiveStory(s)}));
 assert.match(html,/Sí, registrado/);assert.match(html,/no se ha usado para generar/);assert.equal(selectReportNarrative(r).contextApplied,false);
});
test('historical comparison excludes later reports and incompatible units',()=>{
 const s=createFixture(),r=june(s),marker=dashboardMarkerForReport(s,r,'apob');
 const prior=stamp({...structuredClone(r),id:'earlier-kit',date:'2026-05-01',markerValues:{...r.markerValues,apob:{...r.markerValues.apob,value:81}}});
 const future=stamp({...structuredClone(r),id:'later-kit',date:'2026-07-01'});
 const differentUnit=stamp({...structuredClone(r),id:'other-unit',date:'2026-04-01',markerValues:{...r.markerValues,apob:{value:.8,unit:'g/L',zone:'optimal'}}});
 s.reports.push(prior,future,differentUnit);
 assert.deepEqual(dashboardMarkerHistory(s,r,marker).map(item=>item.report.id),['earlier-kit','demo-junio']);
});
test('missing June or March rows stay unavailable across selection, overview, story and gallery',()=>{
 const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
 cache.set(path.join(root,'components/preview/PreviewProvider.tsx'),{exports:{usePreview:()=>{throw new Error('Gallery does not read the provider');}}});
 const {DashboardBiomarkerGallery}=load('components/pages/dashboard/DashboardPage.tsx');
 for(const scenario of ['ready','processing']){
  const s=createFixture(scenario),report=selectDashboardReading(s).latest;
  const initial=selectDashboardReading(s).markers.filter(marker=>marker.status==='optimal').length;
  delete report.markerValues.apob;stamp(report);
  const reading=selectDashboardReading(s),missing=reading.markers.find(marker=>marker.key==='apob');
  assert.equal(reading.latest.id,scenario==='ready'?'demo-junio':'demo-marzo');
  assert.ok(Number.isNaN(missing.value),'A missing row must not recover the fixture value/history');
  assert.equal(missing.unit,'');assert.equal(missing.zone,'unclassified');assert.equal(missing.status,'unknown');assert.equal(missing.rangeComparable,false);
  assert.equal(reading.markers.filter(marker=>marker.status==='optimal').length,initial-1);
  assert.ok(!dashboardMarkerHistory(s,report,missing).some(item=>item.report.id===report.id));
  const story=selectExecutiveStory(s),evidence=story.evidence.find(item=>item.key==='apob');
  assert.equal(evidence.value,null);assert.equal(evidence.range,null);assert.ok(!story.available.some(item=>item.key==='apob'));
  const html=renderToStaticMarkup(React.createElement(DashboardBiomarkerGallery,{markers:[missing],report,state:s}));
  assert.match(html,/class="dashboard-main-value"><span>No disponible<\/span>/);
  assert.match(html,/Sin dato en esta lectura/);assert.match(html,/No hay lecturas comparables disponibles/);
  delete report.markerValues;
  assert.ok(selectDashboardReading(s).markers.every(marker=>Number.isNaN(marker.value)&&marker.status==='unknown'&&!marker.rangeComparable));
 }
});
test('critical and unclassified server zones survive mapping',()=>{
 const s=createFixture(),r=june(s);
 for(const zone of ['critical_low','below_optimal','optimal','above_optimal','critical_high','unclassified']){
  r.markerValues.apob.zone=zone;const marker=dashboardMarkerForReport(s,r,'apob');
  assert.equal(marker.zone,zone);assert.equal(marker.status,zone.startsWith('critical')?'action':zone==='unclassified'?'unknown':zone==='optimal'?'optimal':'attention');
 }
 r.markerValues.apob={value:0,unit:'alternate source unit',zone:'critical_high'};assert.equal(dashboardMarkerForReport(s,r,'apob').zone,'critical_high');
 assert.equal(dashboardMarkerForReport(s,r,'apob').rangeComparable,false);
 delete r.markerValues.apob.zone;assert.equal(dashboardMarkerForReport(s,r,'apob').zone,'unclassified');
});
test('wearable observations keep dates source and missing values',()=>{
 const s=createFixture(),values=selectWearableObservations(s);
 const tenth=values.find(item=>item.date==='2026-06-10'),eleventh=values.find(item=>item.date==='2026-06-11');assert.ok(tenth);assert.match(tenth.source,/Apple Health/);
 assert.equal(eleventh.hrv_ms,null);assert.equal(eleventh.steps,null);assert.equal(eleventh.sleep_hours,7.8);
 assert.notEqual(values,s.wearableObservations);s.profile.wearableConnected=false;assert.deepEqual(selectWearableObservations(s),[]);
});
test('language and literacy select the same source interpretation',()=>{
 const s=createFixture(),r=june(s),before=JSON.stringify(r);
 for(const locale of ['es','en'])for(const literacy of ['simple','balanced','advanced']){
  const summary=selectReportNarrative(r,locale,literacy),marker=selectMarkerInterpretation(r,'apob',locale,literacy);
  assert.equal(summary.state,'ready');assert.equal(summary.language,locale);assert.equal(marker.language,locale);assert.match(marker.text,/78/);
 }
 assert.notEqual(selectReportNarrative(r,'es','simple').text,selectReportNarrative(r,'es','advanced').text);
 assert.equal(JSON.stringify(r),before);
 delete r.narrativeVariants.simple;assert.equal(selectReportNarrative(r,'es','simple').state,'missing');
});
test('edits invalidate affected interpretation without overwriting other reports',()=>{
 const s=createFixture(),before=JSON.stringify(march(s));s.reports=s.reports.map(r=>r.id==='demo-junio'?invalidateReportEstimates({...r,markerValues:{...r.markerValues,apob:{value:80,unit:'mg/dL'}}}):r);
 assert.equal(selectDashboardReading(s).latest.id,'demo-marzo');assert.equal(selectReportNarrative(june(s)).text,null);assert.equal(JSON.stringify(march(s)),before);
 june(s).status='ready';assert.equal(selectReportNarrative(june(s)).state,'stale');assert.equal(selectMarkerInterpretation(june(s),'apob').text,null);
});
test('rendered story has keyboard tab semantics, sample labelling and report-linked evidence',()=>{
 const React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{ExecutiveReading,ReportActions}=load('components/pages/dashboard/ExecutiveReading.tsx');
 const story=selectExecutiveStory(createFixture()),html=renderToStaticMarkup(React.createElement(ExecutiveReading,{story}));
 assert.equal((html.match(/role="tab"/g)??[]).length,3);assert.equal((html.match(/role="tabpanel"/g)??[]).length,3);
 assert.equal((html.match(/aria-selected="true"/g)??[]).length,1);assert.match(html,/Texto de demostración del informe/);
 assert.match(html,/data-panel-narrative="demo-junio"/);assert.match(html,/biomarker\/hscrp\?report=demo-junio/);
 const actions=renderToStaticMarkup(React.createElement(ReportActions,{story}));assert.match(actions,/data-action-report="demo-junio"/);
});
