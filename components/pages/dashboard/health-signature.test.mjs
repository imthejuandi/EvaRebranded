// node components/pages/dashboard/health-signature.test.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {test} from 'node:test';
const require = createRequire(import.meta.url), ts = require('typescript');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..'), cache = new Map();
function load(relative) {
 const file = path.resolve(root, relative);
 if (cache.has(file)) return cache.get(file).exports;
 const module = {exports:{}}; cache.set(file,module);
 const code = ts.transpileModule(fs.readFileSync(file,'utf8'), {fileName:file,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
 const localRequire = name => {
  if(name.endsWith('.css'))return {};
  if(!name.startsWith('.')&&!name.startsWith('@/'))return require(name);
  const base = name.startsWith('@/') ? path.join(root,name.slice(2)) : path.resolve(path.dirname(file),name);
  const resolved = [base,`${base}.ts`,`${base}.tsx`].find(candidate=>fs.existsSync(candidate)&&fs.statSync(candidate).isFile());
  assert.ok(resolved,`Cannot resolve ${name}`);return load(path.relative(root,resolved));
 };
 new Function('require','module','exports',code)(localRequire,module,module.exports);return module.exports;
}
const {signatureReadouts}=load('components/pages/dashboard/health-signature-motion.ts');
const {scoreDialGeometry,signatureTicks}=load('components/pages/dashboard/score-orb/score-dial.ts');
const {createFixture}=load('lib/preview/fixtures.ts');
const {selectDashboardReading}=load('components/pages/dashboard/dashboard-reading.ts');
const {HealthSignature}=load('components/pages/dashboard/HealthSignature.tsx');
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');

test('the ring follows the actual score clockwise from twelve o’clock and has no missing-value arc',()=>{
 for(const value of [null,0,.5,-1,101,NaN,Infinity])assert.equal(scoreDialGeometry(value),null);
 for(const score of [1,18.5,25,50,75,82,100]){
  const geometry=scoreDialGeometry(score);assert.match(geometry.path,/^M 250 45 A 205 205/);
  assert.ok(Math.abs(Math.hypot(geometry.x-250,geometry.y-250)-205)<.0001);
 }
 const quarter=scoreDialGeometry(25),half=scoreDialGeometry(50),full=scoreDialGeometry(100);
 assert.equal(quarter.x,455);assert.equal(quarter.y,250);assert.ok(Math.abs(half.y-455)<.0001);assert.ok(Math.abs(full.y-45)<.0001);
 assert.equal(signatureTicks.length,100);
 assert.ok(signatureTicks.every(tick=>Object.values(tick).every(value=>Number.isFinite(value)&&value>=7&&value<=493)));
});
test('only finite estimates within the score engine range become readouts',()=>{
 const state=createFixture(),report=selectDashboardReading(state).latest;
 assert.equal(signatureReadouts(report,true,state.profile).score,82);assert.equal(signatureReadouts(report,true,state.profile).age,29);
 for(const change of [r=>r.longevityScore=null,r=>r.longevityScore=NaN,r=>r.longevityScore=Infinity,r=>r.longevityScore=101,r=>r.longevityScore=-1,r=>r.longevityScore=0,r=>r.longevityScore=.5]){
  const altered={...report};change(altered);assert.equal(signatureReadouts(altered,true,state.profile).score,null);
 }
 for(const longevityScore of [1,100])assert.equal(signatureReadouts({...report,longevityScore},true,state.profile).score,longevityScore);
 for(const biologicalAge of [null,NaN,Infinity,-1,0])assert.equal(signatureReadouts({...report,biologicalAge},true,state.profile).age,null);
 for(const inputs of [[report,false,state.profile],[report,true,{healthConsent:false}],[{...report,status:'processing'},true,state.profile]]){
  const readout=signatureReadouts(...inputs);assert.equal(readout.score,null);assert.equal(readout.age,null);
 }
});
test('current profile age wins with explicit provenance; missing profile age falls back to the report',()=>{
 const state=createFixture(),report=selectDashboardReading(state).latest;
 const profile={...state.profile,current_ba:31.5,current_ba_computed_at:'2026-09-18T08:30:00Z'};
 const current=signatureReadouts(report,true,profile);
 assert.equal(current.age,31.5);assert.equal(current.ageSource,'profile');assert.equal(current.ageComputedAt,profile.current_ba_computed_at);
 assert.equal(signatureReadouts({...report,biologicalAge:null},true,profile).age,31.5);
 for(const current_ba of [undefined,null,NaN,Infinity,-1,0]){
  const fallback=signatureReadouts(report,true,{...profile,current_ba});
  assert.equal(fallback.age,29);assert.equal(fallback.ageSource,'report');assert.equal(fallback.ageComputedAt,null);
 }
 assert.equal(signatureReadouts(report,true,{...profile,current_ba_computed_at:'invalid'}).ageComputedAt,null);
 const missing=signatureReadouts({...report,biologicalAge:null},true,state.profile);
 assert.equal(missing.age,null);assert.equal(missing.ageSource,null);
 assert.equal(signatureReadouts({...report,longevity_grade:'  Very Good  '},true,profile).grade,'Very Good');
 assert.equal(signatureReadouts({...report,longevity_grade:null},true,profile).grade,null);
 assert.equal(signatureReadouts({...report,longevityScore:0,longevity_grade:'Insufficient Data'},true,profile).grade,null);
});
test('profile values, provenance and grade cannot bypass consent, paid access or report readiness',()=>{
 const state=createFixture(),report={...selectDashboardReading(state).latest,longevity_grade:'Very Good'};
 const profile={...state.profile,current_ba:31.5,current_ba_computed_at:'2026-09-18T08:30:00Z'};
 const cases=[[report,false,profile],[report,true,{...profile,healthConsent:false}],...['processing','pending_context','error','archived'].map(status=>[{...report,status},true,profile]),[{...report,contextComplete:false},true,profile],[{...report,markerKeys:[]},true,profile]];
 for(const inputs of cases){
  const actual=signatureReadouts(...inputs);
  for(const key of ['score','age','ageSource','ageComputedAt','grade'])assert.equal(actual[key],null,`${key} must be gated`);
 }
});
test('both metrics are initially visible DOM values; paid and consent gates leave no hidden estimate',()=>{
 const state=createFixture(),{latest:report,markers}=selectDashboardReading(state);
 const render=(props={})=>renderToStaticMarkup(React.createElement(HealthSignature,{report,markers,paid:true,profile:state.profile,...props}));
 const html=render();assert.match(html,/>EVA Score<|EVA Score/);assert.match(html,/Edad biológica/);assert.match(html,/data-dot-number="82"/);assert.match(html,/data-dot-number="29"/);assert.ok(!html.includes('birthYear'));assert.ok(!html.includes('1990'));
 assert.match(html,/data-signature-design="anillo"/);assert.match(html,/<path class="dial-score-arc"/);assert.ok(!html.includes('stroke-dasharray="82 100"'));assert.ok(!html.includes('Pausar movimiento'));assert.match(html,/aria-labelledby=/);assert.match(html,/Ejemplo/);
 for(const props of [{paid:false},{profile:{...state.profile,healthConsent:false}},{report:{...report,status:'processing'}}]){
  const gated=render(props);assert.ok(!gated.includes('data-dot-number="82"'));assert.ok(!gated.includes('data-dot-number="29"'));
 }
 const missing=render({report:{...report,longevityScore:null,biologicalAge:null}});assert.match(missing,/data-age="unavailable"/);assert.match(missing,/data-score="unavailable"/);
});
test('rendered metrics distinguish profile and report scope without leaking gated provenance',()=>{
 const state=createFixture(),{latest:report,markers}=selectDashboardReading(state);
 const profile={...state.profile,current_ba:31.5,current_ba_computed_at:'2026-09-18T08:30:00Z'};
 const render=(props={})=>renderToStaticMarkup(React.createElement(HealthSignature,{report:{...report,longevity_grade:'Very Good'},markers,paid:true,profile,locale:'en',...props}));
 const html=render();assert.match(html,/data-dot-number="31.5"/);assert.match(html,/Current profile estimate/);assert.match(html,/Calculated on/);assert.match(html,/Sep 18, 2026/);assert.match(html,/data-age-source="profile"/);assert.match(html,/Grade: Very Good/);assert.ok(!html.includes('data-dot-number="29"'));
 const fallback=render({profile:state.profile});assert.match(fallback,/data-age-source="report"/);assert.ok(!fallback.includes('Calculated on'));
 for(const props of [{paid:false},{profile:{...profile,healthConsent:false}},{report:{...report,status:'processing'}}]){
  const gated=render(props);for(const privateText of ['31.5','Current profile estimate','Calculated on','Very Good','data-age-source'])assert.ok(!gated.includes(privateText),privateText);
 }
 const zero=render({report:{...report,longevityScore:0}});assert.ok(!zero.includes('data-dot-number="0"'));assert.match(zero,/Unavailable/);
});

test('one missing estimate does not hide the other and an invalid score creates no visible arc',()=>{
 const state=createFixture(),{latest:report,markers}=selectDashboardReading(state);
 const render=(change)=>renderToStaticMarkup(React.createElement(HealthSignature,{report:{...report,...change},markers,paid:true,profile:state.profile}));
 const noScore=render({longevityScore:0});assert.match(noScore,/data-dot-number="29"/);assert.ok(!noScore.includes('class="dial-score-arc"'));assert.ok(!noScore.includes('data-dot-number="0"'));
 const noAge=render({biologicalAge:null});assert.match(noAge,/data-dot-number="82"/);assert.match(noAge,/<path class="dial-score-arc"/);assert.match(noAge,/data-age="unavailable"/);
 const actual=render({biologicalAge:46.5,longevityScore:63.5});assert.match(actual,/data-dot-number="46,5"/);assert.match(actual,/data-dot-number="63,5"/);assert.match(actual,/data-score="63.5"/);assert.ok(!actual.includes('data-dot-number="29"'));
});
test('backend source accepts the minimal profile and omits demo labels and unsupplied counts',()=>{
 const state=createFixture(),{latest:report}=selectDashboardReading(state);
 const html=renderToStaticMarkup(React.createElement(HealthSignature,{report,paid:true,profile:{healthConsent:true,current_ba:34,current_ba_computed_at:'2026-09-21T00:00:00Z'},source:'backend',reportHref:'/es/production-report/123'}));
 assert.match(html,/data-signature-source="backend"/);assert.match(html,/data-dot-number="34"/);assert.ok(!html.includes('Ejemplo'));assert.ok(!html.includes('biomarcadores</p>'));assert.ok(!html.includes('áreas de salud'));
 assert.match(html,/href="\/es\/production-report\/123"/);assert.match(html,/href="#dashboard-estimate-method"/);assert.match(html,/href="#dashboard-reading"/);
});
