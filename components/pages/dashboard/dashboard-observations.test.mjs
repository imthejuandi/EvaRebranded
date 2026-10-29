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
const {wearableSeries,wearableChartPoints,estimateProvenance}=load('components/pages/dashboard/dashboard-observations.ts');
const {WearableObservations}=load('components/pages/dashboard/WearableObservations.tsx');
const {EstimateMetadata}=load('components/pages/dashboard/EstimateMetadata.tsx');
const {createPreviewExport}=load('components/pages/profile/profile-export.ts');
const {createElement}=require('react');const {renderToStaticMarkup}=require('react-dom/server');
const june=s=>s.reports.find(r=>r.id==='demo-junio');
test('wearable series keeps dated missing observations and never averages different sources',()=>{
 const s=createFixture();s.wearableObservations.push({date:'2026-06-11',source:'Other example source',sleep_hours:6.2,steps:0,hrv_ms:null,resting_hr_bpm:null,respiratory_rate:null});
 const rows=wearableSeries(s,'sleep_hours');assert.equal(rows.filter(x=>x.date==='2026-06-11').length,2);
 assert.equal(rows.find(x=>x.date==='2026-06-07').value,null);
 assert.equal(wearableSeries(s,'sleep_hours','Other example source')[0].value,6.2);
 assert.equal(wearableSeries(s,'steps','Other example source')[0].value,0);
 assert.equal(wearableSeries(s,'recovery_score').filter(x=>x.value!==null).length,0);
});
test('wearable chart preserves date spacing and missing points instead of interpolating',()=>{
 const rows=[{id:'a',date:'2026-06-01',source:'Example',value:7},{id:'b',date:'2026-06-02',source:'Example',value:null},{id:'c',date:'2026-06-11',source:'Example',value:8}];
 const graph=wearableChartPoints(rows);assert.equal(graph.points[1].y,null);assert.ok(graph.points[1].x-graph.points[0].x<graph.points[2].x-graph.points[1].x);
 const missing=wearableChartPoints(rows.map(row=>({...row,value:null})));assert.equal(missing.low,null);assert.notEqual(missing.points[0].x,missing.points[2].x);
 assert.equal(wearableChartPoints([]).points.length,0);
});
test('wearable UI identifies fictional dated source data and empty import states',()=>{
 const s=createFixture();let html=renderToStaticMarkup(createElement(WearableObservations,{state:s}));
 assert.ok(html.includes('Observaciones ficticias'));assert.ok(html.includes('Apple Health'));assert.ok(html.includes('2026-06-11'));assert.ok(html.includes('Sin dato'));assert.ok(html.includes('Ver los registros'));assert.ok(html.includes('no se calculan correlaciones'));
 html=renderToStaticMarkup(createElement(WearableObservations,{state:{...s,wearableObservations:[]}}));assert.ok(html.includes('no contiene registros con fecha'));
 html=renderToStaticMarkup(createElement(WearableObservations,{state:{...s,profile:{...s.profile,wearableConnected:false}}}));assert.ok(html.includes('No hay una importación activa'));assert.ok(!html.includes('<svg'));
});
test('report estimates preserve provenance and never substitute a report age for rolling profile age',()=>{
 const s=createFixture(),r=june(s);let e=estimateProvenance(r,s.profile);
 assert.equal(e.referenceAge,29);assert.equal(e.rolling.value,null);assert.equal(e.method,null);assert.equal(e.markerCount,null);assert.equal(e.calibration,null);
 const profile={...s.profile,current_ba:31.2,current_ba_method:'Reference',current_ba_n_labs_averaged:3,current_ba_window_months:6,current_ba_n_markers_used:10,current_ba_computed_at:'2026-06-13T12:00:00Z'};
 const report={...r,biological_age_comprehensive:30.1,bio_age_method:'KDM_v2.2_ReferenceBA',bio_age_n_markers:12,bio_age_applied_spanish_calibration:[],longevity_grade:'B'};
 e=estimateProvenance(report,profile);assert.equal(e.rolling.value,31.2);assert.equal(e.referenceAge,29);assert.equal(e.comprehensiveAge,30.1);assert.equal(e.method,'KDM_v2.2_ReferenceBA');assert.deepEqual(e.calibration,[]);assert.equal(e.rolling.labs,3);assert.equal(e.grade,'B');
 const unavailable=estimateProvenance({...report,status:'processing'},profile);assert.equal(unavailable.referenceAge,null);assert.equal(unavailable.method,null);assert.equal(unavailable.rolling.value,31.2);
 const stale=estimateProvenance({...report,reading:{...r.reading,status:'stale'}},profile);assert.equal(stale.method,null);
});
test('estimate metadata UI identifies missing fields without inventing a method',()=>{
 const s=createFixture();const html=renderToStaticMarkup(createElement(EstimateMetadata,{report:june(s),profile:s.profile}));
 assert.ok(html.includes('data-estimate-report="demo-junio"'));assert.ok(html.includes('No consta'));assert.ok(html.includes('Lectura conjunta de varios informes'));assert.ok(!html.includes('KDM_v2.2'));
});
test('synthetic export includes isolated wearable and cycle snapshots with nulls preserved',()=>{
 const s=createFixture(),copy=createPreviewExport(s,'2026-09-18T12:00:00Z');
 assert.equal(copy.exportedAt,'2026-09-18T12:00:00Z');assert.deepEqual(copy.wearableObservations,s.wearableObservations);assert.deepEqual(copy.kitCycle,s.kitCycle);
 assert.equal(copy.wearableObservations.find(x=>x.date==='2026-06-07').sleep_hours,null);
 copy.wearableObservations[0].sleep_hours=0;copy.kitCycle.status='changed';assert.notEqual(s.wearableObservations[0].sleep_hours,0);assert.notEqual(s.kitCycle.status,'changed');
 assert.ok(copy.notice.includes('Datos ficticios'));assert.equal(createPreviewExport({...s,kitCycle:undefined,wearableObservations:undefined}).kitCycle,null);
});
