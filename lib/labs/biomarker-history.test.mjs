import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {test} from 'node:test';
const require=createRequire(import.meta.url),ts=require('typescript'),root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..'),cache=new Map();
function load(relative){
 const file=path.resolve(root,relative);if(cache.has(file))return cache.get(file).exports;
 const module={exports:{}};cache.set(file,module);
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{fileName:file,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 const localRequire=name=>{if(name.endsWith('.css')||name==='server-only')return {};if(!name.startsWith('.')&&!name.startsWith('@/'))return require(name);const base=name.startsWith('@/')?path.join(root,name.slice(2)):path.resolve(path.dirname(file),name);const resolved=[base,base+'.ts',base+'.tsx'].find(f=>fs.existsSync(f)&&fs.statSync(f).isFile());return load(path.relative(root,resolved));};
 new Function('require','module','exports',code)(localRequire,module,module.exports);return module.exports;
}
const {biomarkerHistory,yearBefore,historyDirectionLabel,historySentence}=load('lib/labs/biomarker-history.ts');
const {previewHistoryObservations}=load('components/pages/labs/preview-history.ts');
const {createFixture}=load('lib/preview/fixtures.ts');
const {BiomarkerHistory}=load('components/pages/labs/BiomarkerHistory.tsx');
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const point=(date,value,extra={})=>({reportId:date,key:'apob',name:'ApoB',date,value,unit:'mg/dL',source:'kit',zone:'optimal',interpretation:{es:'Texto guardado.',en:'Stored text.'},...extra});
test('calendar-year cutoff is inclusive and the visible extent follows real sample dates',()=>{
 assert.equal(yearBefore('2024-02-29'),'2023-02-28');
 const h=biomarkerHistory([point('2025-06-11',90),point('2025-06-12',89),point('2026-03-12',88),point('2026-06-12',78)],'apob','2026-09-20');
 assert.equal(h.start,'2025-06-12');assert.equal(h.end,'2026-06-12');assert.equal(h.points.length,3);
 const short=biomarkerHistory([point('2026-03-12',88),point('2026-06-12',78)],'apob','2026-09-20');
 assert.equal(short.start,'2026-03-12');assert.equal(short.end,'2026-06-12');assert.equal(short.change,-10);
});
test('old report selection does not acquire future readings or borrow other marker data',()=>{
 const h=biomarkerHistory([point('2026-03-12',88),point('2026-06-12',78),point('2026-02-01',100,{key:'other'})],'apob','2026-03-12');
 assert.equal(h.points.length,1);assert.equal(h.latest.value,88);assert.equal(h.direction,'insufficient');assert.equal(h.change,null);
});
test('source is retained, while units and comparator bounds never become exact deltas',()=>{
 const h=biomarkerHistory([point('2026-01-12',.9,{unit:'g/L'}),point('2026-02-12',90,{comparator:'<'}),point('2026-03-12',88,{source:'upload'}),point('2026-06-12',78)],'apob','2026-06-12');
 assert.equal(h.records.length,4);assert.equal(h.points.length,2);assert.equal(h.excludedUnits,1);assert.equal(h.mixedSources,true);assert.equal(h.change,-10);
 assert.equal(biomarkerHistory([point('2026-06-12',78,{comparator:'>'})],'apob','2026-06-12').change,null);
});
test('directions are descriptive, not clinical thresholds, and mixed series retain last-step delta',()=>{
 const series=values=>biomarkerHistory(values.map((v,i)=>point(`2026-0${i+1}-12`,v)),'apob','2026-06-12');
 assert.equal(series([0,1,2]).direction,'up');assert.equal(series([3,2,1]).direction,'down');assert.equal(series([3,3,3]).direction,'unchanged');
 assert.equal(series([3,3.0001]).direction,'up');
 assert.equal(series([3,5,3]).direction,'mixed');assert.equal(series([3,5,3]).recentChange,-2);
 assert.equal(historyDirectionLabel(series([3,4]),'es'),'Sube entre las dos muestras');
 assert.ok(!historySentence(series([3,4]),'es').includes('mejor'));
});
test('missing values, invalid dates, duplicate observations and same-day samples cannot fabricate a trend',()=>{
 for(const rows of [[],[point('2026-02-30',9)],[point('2026-01-12',2),point('2026-02-12',null)],[point('2026-01-12',2),point('2026-01-12',3)],[point('2026-01-12',2),point('2026-01-12',3,{reportId:'second'})]]){
  const h=biomarkerHistory(rows,'apob','2026-06-12');assert.equal(h.change,null);assert.equal(h.direction,'insufficient');
 }
});
test('preview adapter uses only report-owned values and honors consent and readiness',()=>{
 const state=createFixture(),report=state.reports.find(r=>r.id==='demo-junio');
 const obs=previewHistoryObservations(state,report),h=biomarkerHistory(obs,'apob',report.date);
 assert.equal(h.points.length,2);assert.deepEqual(h.points.map(p=>p.value),[88,78]);
 assert.deepEqual(previewHistoryObservations({...state,profile:{...state.profile,healthConsent:false}},report),[]);
 assert.deepEqual(previewHistoryObservations({...state,session:false},report),[]);
 const hidden=previewHistoryObservations({...state,reports:state.reports.map(r=>r.id==='demo-marzo'?{...r,status:'archived'}:r)},report);
 assert.equal(biomarkerHistory(hidden,'apob',report.date).points.length,1);
});
test('rendered graph exposes actual dates, retained provenance and stored interpretation as text',()=>{
 const observations=[point('2026-03-12',88),point('2026-06-12',78,{interpretation:{es:'<script>stored plain text</script>',en:null}})];
 const html=renderToStaticMarkup(React.createElement(BiomarkerHistory,{observations,markerKey:'apob',asOf:'2026-06-12'}));
 assert.match(html,/data-history-start="2026-03-12"/);assert.match(html,/data-history-end="2026-06-12"/);
 assert.match(html,/Baja entre las dos muestras/);assert.match(html,/&lt;script&gt;/);assert.ok(!html.includes('<script>'));
 assert.match(html,/88 mg\/dL/);assert.match(html,/78 mg\/dL/);
});
test('same-day report selection keeps the chosen value and narrative without inventing an ordered line',()=>{
 const observations=[point('2026-01-12',1),point('2026-06-12',2,{reportId:'a',interpretation:{es:'Informe A',en:null}}),point('2026-06-12',3,{reportId:'z',interpretation:{es:'Informe Z',en:null}})];
 const model=biomarkerHistory(observations,'apob','2026-06-12','a');
 assert.equal(model.latest.reportId,'a');assert.equal(model.latest.value,2);assert.equal(model.direction,'insufficient');
 const html=renderToStaticMarkup(React.createElement(BiomarkerHistory,{observations,markerKey:'apob',asOf:'2026-06-12',reportId:'a'}));
 assert.ok(html.includes('Informe A'));assert.ok(!html.includes('Informe Z'));assert.ok(!html.includes('<polyline'));
});
test('a qualified or missing current result preserves comparable historical points without claiming current change',()=>{
 for(const latest of [point('2026-06-12',null),point('2026-06-12',3,{comparator:'<'})]) {
  const model=biomarkerHistory([point('2026-01-12',1),point('2026-03-12',2),latest],'apob','2026-06-12');
  assert.equal(model.points.length,2);assert.equal(model.records.length,3);assert.equal(model.change,null);assert.equal(model.latest.reportId,latest.reportId);
  assert.equal(model.end,'2026-03-12');
 }
});
