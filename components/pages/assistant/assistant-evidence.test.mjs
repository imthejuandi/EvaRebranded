// Run with node --test components/pages/assistant/assistant-evidence.test.mjs
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
const {selectAssistantEvidence,assistantEvidenceSummary}=load('components/pages/assistant/assistant-evidence.ts');
const june=s=>s.reports.find(r=>r.id==='demo-junio');
test('assistant evidence retains critical and unclassified report zones without catalogue reclassification',()=>{
 const s=createFixture(),r=june(s);r.markerValues.apob={...r.markerValues.apob,value:70,zone:'critical_high',optimal_low:40,optimal_high:65};
 r.markerValues.hscrp={...r.markerValues.hscrp,value:0.5,zone:'unclassified',optimal_low:null,optimal_high:null};
 const evidence=selectAssistantEvidence(s,r),apob=evidence.find(x=>x.key==='apob'),hscrp=evidence.find(x=>x.key==='hscrp');
 assert.equal(apob.zone,'critical_high');assert.equal(apob.status,'action');assert.deepEqual(apob.range,[40,65]);
 assert.equal(hscrp.zone,'unclassified');assert.equal(hscrp.status,'unknown');assert.equal(hscrp.range,null);
 const text=assistantEvidenceSummary([apob,hscrp]);assert.ok(text.includes('Crítico · alto'));assert.ok(text.includes('Sin clasificación'));assert.ok(!text.includes('Dentro del intervalo'));
 assert.ok(assistantEvidenceSummary([apob,hscrp],'en').includes('Critical · high'));
});
test('assistant evidence remains tied to the selected report and never fills missing readings from another report',()=>{
 const s=createFixture(),j=june(s),m=s.reports.find(r=>r.id==='demo-marzo');
 const juneA=selectAssistantEvidence(s,j).find(x=>x.key==='apob'),marchA=selectAssistantEvidence(s,m).find(x=>x.key==='apob');
 assert.equal(juneA.value,78);assert.equal(marchA.value,88);assert.equal(juneA.reportId,j.id);assert.equal(marchA.reportId,m.id);
 const upload={...j,id:'another-upload',source:'upload',markerValues:{apob:{value:91,unit:'mg/dL',zone:'unclassified'}}};
 const uploaded=selectAssistantEvidence(s,upload);assert.equal(uploaded.length,1);assert.equal(uploaded[0].value,91);assert.equal(uploaded[0].range,null);assert.equal(uploaded[0].reportId,'another-upload');
 assert.deepEqual(selectAssistantEvidence(s,{...upload,markerValues:{}}),[]);
});
test('assistant evidence is absent for missing pending or inaccessible reports',()=>{
 const s=createFixture(),r=june(s);
 assert.deepEqual(selectAssistantEvidence(s,undefined),[]);assert.deepEqual(selectAssistantEvidence(s,{...r,status:'processing'}),[]);
 assert.deepEqual(selectAssistantEvidence({...s,session:false},r),[]);
 assert.deepEqual(selectAssistantEvidence({...s,profile:{...s.profile,healthConsent:false}},r),[]);
 assert.deepEqual(selectAssistantEvidence({...s,deletionStatus:'completed'},r),[]);
 const missing={...r,markerValues:Object.fromEntries(r.markerKeys.map(key=>[key,{value:null,unit:'mg/dL',zone:'critical_high'}]))};
 assert.deepEqual(selectAssistantEvidence(s,missing),[]);
});
