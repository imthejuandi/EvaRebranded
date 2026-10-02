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


const {createFixture}=load('lib/preview/fixtures.ts');
const {reportInputSignature}=load('lib/preview/policy.ts');
const {selectExecutiveStory,selectReportNarrative}=load('components/pages/dashboard/dashboard-reading.ts');
const {reportActionables}=load('components/pages/dashboard/actionables/report-actionables.ts');
const {previewReportResults}=load('components/pages/dashboard/preview-report-results.ts');
const {selectDashboardReading}=load('components/pages/dashboard/dashboard-reading.ts');
const {deriveResultSignal,formatOptimalRange}=load('components/pages/dashboard/actionables/result-shape.ts');
const {paragraphsForReading,segmentsWithEntities}=load('components/pages/dashboard/summary-format.ts');
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const ReportSummary=load('components/pages/dashboard/ReportSummary.tsx').default;
const Campo=load('components/pages/dashboard/actionables/DashboardActionables.tsx').default;
const stamp=r=>{r.reading={...r.reading,inputSignature:reportInputSignature(r),reportId:r.id,reportVersion:r.version??1,status:'ready'};};
const summary=(story,level='balanced')=>renderToStaticMarkup(React.createElement(ReportSummary,{story,locale:'es',level,onLevel:()=>{}}));

test('summary and Campo resolve the same available report when latest is pending',()=>{
 for(const scenario of ['ready','processing','context','error']){
  const state=createFixture(scenario),story=selectExecutiveStory(state),{actions,results}=reportActionables(story.report);
  assert.equal(story.reportId,scenario==='ready'?'demo-junio':'demo-marzo');
  assert.ok(actions.every(a=>a.lab_result_id===story.reportId));
  assert.ok(Object.values(results).every(r=>r.reportId===story.reportId&&r.collectionDate===story.date));
  assert.equal(results.apob.value,scenario==='ready'?78:88);
  assert.equal(results.insulin.value,scenario==='ready'?8.4:10.3);
  assert.equal(results.hscrp.value,scenario==='ready'?2.1:2.4);
  assert.match(summary(story),new RegExp(`data-report-id="${story.reportId}"`));
  assert.match(renderToStaticMarkup(React.createElement(Campo,{story})),new RegExp(`data-action-report="${story.reportId}"`));
 }
});
test('missing result never borrows a catalog value or another report row',()=>{
 const state=createFixture(),r=state.reports[0];delete r.markerValues.apob;stamp(r);
 const {results}=reportActionables(r);assert.equal(results.apob,undefined);assert.equal(deriveResultSignal(results.apob,r.id).direction,'unknown');
 r.markerValues.foreign={value:999,unit:'mg/dL',zone:'optimal'};assert.equal(reportActionables(r).results.foreign,undefined);
});
test('action records retain exact text association and order, excluding foreign and stale actions',()=>{
 const state=createFixture(),r=state.reports[0];r.actionSteps.push({...state.reports[1].actionSteps[0]});
 const mapped=reportActionables(r);assert.equal(mapped.actions.length,2);assert.equal(mapped.actions[0].description_es,r.actionSteps[0].description_es);
 assert.deepEqual(mapped.actions[0].related_biomarker_keys,r.actionSteps[0].related_biomarker_keys);
 r.reading.status='stale';assert.deepEqual(reportActionables(r).actions,[]);
});
test('zero missing units reversed bounds and persisted zones stay distinct',()=>{
 const r=createFixture().reports[0];r.markerValues.apob={value:0,unit:'mg/dL',zone:'below_optimal',optimal_low:20,optimal_high:90};
 let result=reportActionables(r).results.apob;assert.equal(result.value,0);assert.equal(deriveResultSignal(result,r.id).direction,'low');
 result={...result,optimalLow:100,optimalHigh:20};assert.equal(formatOptimalRange(result),'Intervalo no disponible');assert.equal(deriveResultSignal(result,r.id).direction,'unknown');
 result={...result,optimalLow:20,optimalHigh:90,unit:null};assert.equal(result.value,0);assert.equal(deriveResultSignal(result,r.id).direction,'unknown');
 result={...result,unit:'mg/dL',zone:null};assert.equal(deriveResultSignal(result,r.id).direction,'unknown');
});
test('full authored summary paragraphs and final qualifications are visible together',()=>{
 const state=createFixture(),r=state.reports[0];r.summary_narrative_es='El resultado no confirma una enfermedad.\n\nEl valor de ApoB es 78 mg/dL. La interpretación depende del contexto.';stamp(r);
 const html=summary(selectExecutiveStory(state));assert.match(html,/El resultado no confirma una enfermedad/);assert.match(html,/La interpretación depende del contexto/);
 assert.equal((html.match(/data-source-order=/g)||[]).length,2);assert.ok(!html.includes('Leer la lectura completa'));
 const split=paragraphsForReading(r.summary_narrative_es);assert.deepEqual(split,r.summary_narrative_es.split('\n\n'));
});
test('missing selected literacy does not substitute another variant',()=>{
 const state=createFixture(),r=state.reports[0];delete r.narrativeVariants.advanced;
 const story=selectExecutiveStory(state);assert.equal(selectReportNarrative(r,'es','advanced').text,null);
 const html=summary(story,'advanced');assert.match(html,/Este nivel todavía no tiene un texto propio/);assert.ok(!html.includes('data-source-order='));
});
test('emphasis preserves identifier boundaries and negated source text',()=>{
 const text='LDL-C no permite confirmar una causa. ApoB permanece en 78 mg/dL; no prueba un cambio clínico.';
 const pieces=segmentsWithEntities(text,['LDL','ApoB'],2);assert.equal(pieces.map(p=>p.text).join(''),text);assert.deepEqual(pieces.filter(p=>p.emphasis).map(p=>p.text),['ApoB']);
});
test('no summary or actions are rendered without consent or after deletion',()=>{
 for(const edit of [s=>s.profile.healthConsent=false,s=>s.session=false,s=>s.deletionStatus='completed']){const state=createFixture();edit(state);assert.equal(selectExecutiveStory(state),null);}
});

// Exercise the actual DashboardPage element tree. Duplicate sibling keys break
// React ownership when the summary returns an article + details fragment.
test('report changes keep every DashboardPage sibling key unique',()=>{
 let active=createFixture();
 cache.set(path.join(root,'components/preview/PreviewProvider.tsx'),{exports:{usePreview:()=>({state:active,hydrated:true})}});
 const DashboardPage=load('components/pages/dashboard/DashboardPage.tsx').default;
 const visit=node=>{
  if(!React.isValidElement(node))return;
  const children=Array.isArray(node.props.children)?node.props.children:[node.props.children];
  const keys=children.filter(React.isValidElement).map(child=>child.key).filter(key=>key!==null);
  assert.equal(new Set(keys).size,keys.length,'Every keyed sibling owns a distinct React subtree');
  for(const child of children)visit(child);
 };
 for(const scenario of ['ready','processing','ready','context']){active=createFixture(scenario);visit(DashboardPage());}
});


test('the orb and Campo share report rows; absent data never reappears from the legacy catalog',()=>{
 const state=createFixture(),{latest,markers}=selectDashboardReading(state);
 const initial=previewReportResults(latest,markers);
 assert.equal(initial.length,15);assert.equal(initial.find(row=>row.key==='hscrp').value,2.1);
 delete latest.markerValues.hscrp;
 assert.ok(!previewReportResults(latest,markers).some(row=>row.key==='hscrp'));
 latest.markerValues.insulin={...latest.markerValues.insulin,value:0};
 assert.equal(previewReportResults(latest,markers).find(row=>row.key==='insulin').value,0);
 for(const row of previewReportResults(latest,markers)){assert.equal(row.reportId,latest.id);assert.equal(row.collectionDate,latest.date);}
 latest.markerValues={};assert.deepEqual(previewReportResults(latest,markers),[]);
});
