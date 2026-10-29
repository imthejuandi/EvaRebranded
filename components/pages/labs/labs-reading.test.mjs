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
    if (name.endsWith('.css')) return {};
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
const {readingsForReport,previousComparableReport}=load('components/pages/labs/LabsPage.tsx');
const {ReportNarrative}=load('components/pages/labs/ReportNarrative.tsx');
const {createElement}=require('react');const {renderToStaticMarkup}=require('react-dom/server');
const {selectMarkerInterpretation}=load('components/pages/dashboard/dashboard-reading.ts');
const june=s=>s.reports.find(r=>r.id==='demo-junio');const march=s=>s.reports.find(r=>r.id==='demo-marzo');
test('report folios render distinct June and March narratives and own action links',()=>{
 const s=createFixture();
 const a=renderToStaticMarkup(createElement(ReportNarrative,{report:june(s),literacy:'balanced'}));
 const b=renderToStaticMarkup(createElement(ReportNarrative,{report:march(s),literacy:'balanced'}));
 assert.notEqual(a,b);assert.ok(a.includes('data-report-id="demo-junio"'));assert.ok(b.includes('data-report-id="demo-marzo"'));
 assert.ok(a.includes('78'));assert.ok(b.includes('88'));
 assert.ok(a.includes('data-action-report="demo-junio"'));assert.ok(b.includes('data-action-report="demo-marzo"'));
 assert.ok(!b.includes('data-action-report="demo-junio"'));
});
test('report result rows retain critical and unclassified zones and own intervals',()=>{
 const s=createFixture(),r=june(s);r.markerValues.apob.zone='critical_low';r.markerValues.apob.optimal_low=65;r.markerValues.apob.optimal_high=85;
 r.markerValues.hscrp.zone='unclassified';
 const rows=readingsForReport(s.markers,r),apo=rows.find(x=>x.key==='apob'),crp=rows.find(x=>x.key==='hscrp');
 assert.equal(apo.zone,'critical_low');assert.equal(apo.readingStatus,'action');assert.deepEqual(apo.range,[65,85]);
 assert.equal(crp.zone,'unclassified');assert.equal(crp.readingStatus,'unknown');
});
test('report comparison excludes later dates different units and different source types',()=>{
 const s=createFixture(),r=june(s),prior=march(s);prior.source=r.source;
 assert.equal(previousComparableReport(s.markers,s.reports,r)?.id,prior.id);
 assert.equal(previousComparableReport(s.markers,s.reports.map(x=>x.id===prior.id?{...x,source:'upload'}:x),r),undefined);
 assert.equal(previousComparableReport(s.markers,[{...prior,date:'2027-01-01'},r],r),undefined);
 const units={...prior,markerValues:Object.fromEntries(Object.entries(prior.markerValues).map(([k,v])=>[k,{...v,unit:'incompatible'}]))};
 assert.equal(previousComparableReport(s.markers,[units,r],r),undefined);
});
test('missing report prose remains missing rather than becoming a catalogue explanation',()=>{
 const s=createFixture(),r={...june(s),id:'demo-upload',reading:undefined,summary_narrative:undefined,summary_narrative_es:undefined};
 const text=renderToStaticMarkup(createElement(ReportNarrative,{report:r,literacy:'balanced'}));
 assert.ok(text.includes('data-narrative-state="missing"'));assert.ok(text.includes('todavía no está disponible'));
 assert.equal(selectMarkerInterpretation(r,'apob').text,null);
 assert.ok(!text.includes('data-action-report'));
 const source=fs.readFileSync(path.join(root,'components/pages/labs/LabsPage.tsx'),'utf8');
 assert.ok(!source.includes('{marker.interpretation}'));assert.ok(source.includes('selectMarkerInterpretation(report,marker.key'));
});
