import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),ts=require('typescript'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const root=process.cwd(),cache=new Map();
function load(relative){
  const base=path.resolve(root,relative),file=['','.tsx','.ts'].map(ext=>base+ext).find(existsSync);
  assert(file,relative);if(cache.has(file))return cache.get(file).exports;
  const module={exports:{}};cache.set(file,module);
  const source=readFileSync(file,'utf8');
  const output=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
  const localRequire=name=>name.endsWith('.css')?{}:name.startsWith('@/')?load(name.slice(2)):name.startsWith('.')?load(path.resolve(path.dirname(file),name)):require(name);
  new Function('require','module','exports',output)(localRequire,module,module.exports);return module.exports;
}
const {methodSceneState,METHOD_CHAPTER_FRAMES}=load('components/pages/method/method-journey-motion');
const {MethodJourneyArtwork}=load('components/pages/method/MethodJourneyArtwork');
for(let frame=-30;frame<=390;frame++){
  const state=methodSceneState(frame);
  for(const value of Object.values(state))assert(Number.isFinite(value)&&value>=0&&value<=1,'All motion fields stay within a finite bounded interval');
  if(frame>=0&&frame<=360)assert(state.morning+state.sample+state.lab+state.result>.4,'The sample has a visible context through every transition');
}
assert.equal(methodSceneState(180).lab,1,'Midpoint must retain an opaque primary document');
assert.equal(methodSceneState(180).sample,0,'Outgoing sample must not wash out the midpoint document');
assert.equal(methodSceneState(0).morning,1);assert.equal(methodSceneState(120).sample,1);assert.equal(methodSceneState(240).lab,1);assert.equal(methodSceneState(360).result,1);
const rendered=METHOD_CHAPTER_FRAMES.map(frame=>renderToStaticMarkup(React.createElement(MethodJourneyArtwork,{frame})));
assert.equal(new Set(rendered).size,4,'Each chapter has a visibly different resolved composition');
for(const html of rendered)assert(!/NaN|Infinity|undefined/.test(html),'Artwork geometry must remain valid');
const {default:MethodPage,methodCopy}=load('components/pages/method/MethodPage');
const methodHtml=renderToStaticMarkup(React.createElement(MethodPage));
for(const stage of methodCopy.es.stages){assert(methodHtml.includes(stage.title));assert(methodHtml.includes(stage.body));assert(methodHtml.includes(stage.detail));}
for(const route of ['/es/pricing','/es/upload','/es/science'])assert(methodHtml.includes(route));
const {default:DocumentReading,readingFields}=load('components/pages/science/DocumentReading');
const scienceHtml=renderToStaticMarkup(React.createElement(DocumentReading));
for(const field of readingFields){assert(scienceHtml.includes(field.explanation),'Every explanatory field survives without motion');assert(scienceHtml.includes(field.value),'The source value survives without canvas');}
assert(scienceHtml.includes('/es/labs/demo-junio'));assert(scienceHtml.includes('No incluida en este esquema'));
const {drawOpticalField}=load('components/pages/science/OpticalReading');
const pictures=[];
for(const p of [0,.5,1]){
  const dots=[];const ctx={clearRect(){},beginPath(){},arc(x,y,r){assert([x,y,r].every(Number.isFinite));assert(r>0);dots.push([x,y,r]);},fill(){},moveTo(){},lineTo(){},stroke(){}};
  drawOpticalField(ctx,650,570,p);assert(dots.length>2000);pictures.push(dots);
}
assert.equal(pictures[0].length,pictures[2].length,'Optical parts preserve identity as they separate');
const meanMovement=pictures[0].reduce((sum,point,i)=>sum+Math.hypot(point[0]-pictures[2][i][0],point[1]-pictures[2][i][1]),0)/pictures[0].length;
assert(meanMovement>60,'The optical story must make substantial spatial movement');
console.log('Public story contracts passed: full frame range, four resolved contexts, retained content/routes, no missing source assumptions, finite optical geometry and substantial field separation.');
