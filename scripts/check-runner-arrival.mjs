import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';

const file=path=>new URL(path,import.meta.url);
const read=path=>readFileSync(file(path),'utf8');
// Node strips .ts types but cannot import TSX. Compile the real module, then load
// its exports without mounting React or substituting the timing/crop functions.
function importTypeScript(path){
 const url=file(path),module={exports:{}};
 const compiled=ts.transpileModule(read(path),{fileName:url.pathname,compilerOptions:{
  target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true,
 }}).outputText;
 runInNewContext(compiled,{module,exports:module.exports,require:createRequire(url)},{filename:url.pathname});
 return module.exports;
}
const {runnerArrivalState,runnerArrivalCrop,runnerSilhouetteEnergy,RUNNER_ARRIVAL_END,RUNNER_ARRIVAL_PHOTO_READY,RUNNER_ARRIVAL_LABEL_OFFSET}=importTypeScript('../components/story/RunnerArrival.tsx');
const {runnerPoint,signalStart,signalProgress,signalsSettledAt}=importTypeScript('../lib/runner-signals.ts');
const tracks=JSON.parse(read('../lib/runner-tracking.json'));
const close=(actual,expected,message)=>assert(Math.abs(actual-expected)<1e-8,`${message}: ${actual} versus ${expected}`);

assert.equal(RUNNER_ARRIVAL_END,5.5,'The direct arrival hands off after 5.5 seconds');
assert.equal(RUNNER_ARRIVAL_PHOTO_READY,3.5,'The clean photograph is ready at 3.5 seconds');
assert.equal(RUNNER_ARRIVAL_LABEL_OFFSET,2,'The existing label choreography starts on its delayed clock');
const stages=[['arrival',.08,1],['develop',1.65,3.4],['clean',3.15,3.5]];
for(const [key,start,end] of stages){
 close(runnerArrivalState(-1)[key],0,`${key} stays dark before playback`);
 close(runnerArrivalState(start)[key],0,`${key} begins at the direct-reveal time`);
 close(runnerArrivalState((start+end)/2)[key],.5,`${key} keeps its smooth midpoint`);
 close(runnerArrivalState(end)[key],1,`${key} completes at the direct-reveal time`);
}
let previous=runnerArrivalState(0),largestStep=0;
for(let frame=1;frame<=8.5*240;frame++){
 const next=runnerArrivalState(frame/240);
 for(const [key] of stages){
  assert(Number.isFinite(next[key])&&next[key]>=0&&next[key]<=1,`${key} stays finite and bounded`);
  assert(next[key]>=previous[key],`${key} never reverses during the reveal`);
  largestStep=Math.max(largestStep,next[key]-previous[key]);
 }
 previous=next;
}
assert(largestStep<.02,'No reveal phase snaps between closely sampled times');
assert(runnerArrivalState(.25).arrival>.08,'The silhouette starts appearing within a quarter second');
close(runnerArrivalState(1).develop,0,'The fully lit dot silhouette is visible before photo development');
for(const time of [3.5,4,5.1,5.5,8,10])close(runnerArrivalState(time).clean,1,'The photograph remains complete through and after handoff');
for(const peak of [0,30,80,160,255])close(runnerSilhouetteEnergy(peak,0),0,'Transparent backing cannot light dots');
for(const alpha of [0,64,128,255])close(runnerSilhouetteEnergy(0,alpha),0,'Black backing cannot light dots');
let previousEnergy=0;
for(let peak=0;peak<=255;peak++){
 const energy=runnerSilhouetteEnergy(peak,255);
 assert(energy>=previousEnergy&&energy>=0&&energy<=1,'The figure intensity remains monotonic and bounded');
 close(runnerSilhouetteEnergy(peak,128),energy*128/255,'Optical edge alpha stays attached to the silhouette');
 previousEnergy=energy;
}
const firstSignal=RUNNER_ARRIVAL_LABEL_OFFSET+signalStart.head/24;
const settled=RUNNER_ARRIVAL_LABEL_OFFSET+signalsSettledAt;
close(firstSignal,RUNNER_ARRIVAL_PHOTO_READY,'The first head marker begins only when the photo is ready');
close(settled,5.625,'The complete label sequence settles just after the direct handoff');
assert(settled>RUNNER_ARRIVAL_END);
for(const key of ['head','stomach','knee']){
 const age=(RUNNER_ARRIVAL_PHOTO_READY-RUNNER_ARRIVAL_LABEL_OFFSET)*24-signalStart[key];
 close(signalProgress(age,0,10),0,'No marker is already visible before the photograph is ready');
 const finalAge=(settled-RUNNER_ARRIVAL_LABEL_OFFSET)*24-signalStart[key];
 close(signalProgress(finalAge,10,23),1,`${key} is settled when the page is revealed`);
}

// The arrival canvas and native object-fit:cover video must show the same pose.
const rectangles=[
 {x:0,y:0,width:864,height:1080},
 {x:30,y:16,width:432,height:540},
 {x:-46,y:50,width:390,height:844},
 {x:180,y:-25,width:1280,height:800},
 {x:8,y:29,width:320,height:720},
];
for(const rect of rectangles){
 const crop=runnerArrivalCrop(rect),scale=Math.max(rect.width/864,rect.height/1080);
 for(const value of Object.values(crop))assert(Number.isFinite(value),'Cover crop stays finite');
 assert(crop.width>0&&crop.height>0&&crop.x>=-1e-8&&crop.y>=-1e-8);
 assert(crop.x+crop.width<=864+1e-8&&crop.y+crop.height<=1080+1e-8,'Cover crop stays inside the source');
 close(crop.x+crop.width/2,432,'Source crop stays horizontally centered');
 close(crop.y+crop.height/2,540,'Source crop stays vertically centered');
 close(rect.width/crop.width,scale,'Horizontal cover scale matches native video');
 close(rect.height/crop.height,scale,'Vertical cover scale matches native video');
 const translated=runnerArrivalCrop({...rect,x:rect.x+101,y:rect.y-71});
 for(const key of Object.keys(crop))close(translated[key],crop[key],'Plane translation must not change source cropping');
 for(const frame of [0,29.5,60,119.5])for(const key of ['head','stomach','knee']){
  const low=Math.floor(frame),high=(low+1)%120,fraction=frame-low;
  const source=tracks[low][key].map((value,index)=>(value+(tracks[high][key][index]-value)*fraction)*2);
  const tracking=runnerPoint(frame/24,key,rect.width,rect.height);
  close(rect.x+(source[0]-crop.x)*scale,rect.x+tracking[0],`${key} x aligns with tracking through the native cover crop`);
  close(rect.y+(source[1]-crop.y)*scale,rect.y+tracking[1],`${key} y aligns with tracking through the native cover crop`);
 }
}

// Small static architecture guards complement the numerical checks. These do
// not claim that a browser decoded, composited, paused or disposed successfully.
function ast(path){return ts.createSourceFile(path,read(path),ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX)}
function nodes(root,test){const found=[];const visit=node=>{if(test(node))found.push(node);ts.forEachChild(node,visit)};visit(root);return found}
const arrivalAst=ast('../components/story/RunnerArrival.tsx'),trackedAst=ast('../components/story/TrackedRunner.tsx'),glowAst=ast('../components/story/GlowMotion.tsx');
const jsxNames=root=>nodes(root,node=>ts.isJsxSelfClosingElement(node)||ts.isJsxOpeningElement(node)).map(node=>node.tagName.getText(root));
assert.equal(jsxNames(arrivalAst).filter(name=>['video','Video','Html5Video','Player'].includes(name)).length,0,'Arrival owns no media element or second player');
assert.equal(jsxNames(trackedAst).filter(name=>name==='GlowMotion').length,1,'Tracked runner retains one native media host');
assert.equal(jsxNames(glowAst).filter(name=>name==='video').length,1,'GlowMotion declares one native video element');
const timers=new Set(['requestAnimationFrame','requestVideoFrameCallback','setInterval','setTimeout','addEventListener']);
assert.equal(nodes(arrivalAst,ts.isCallExpression).filter(call=>timers.has(ts.isPropertyAccessExpression(call.expression)?call.expression.name.text:call.expression.getText(arrivalAst))).length,0,'Arrival adds no independent frame clock or event subscriptions');
const update=nodes(trackedAst,node=>ts.isVariableDeclaration(node)&&node.name.getText(trackedAst)==='update')[0]?.initializer;
assert(update&&ts.isArrowFunction(update),'The existing decoded callback retains its update function');
assert.equal(nodes(update,node=>ts.isCallExpression(node)&&ts.isPropertyAccessExpression(node.expression)&&node.expression.name.text==='drawFrame').length,1,'Arrival is painted once by the existing decoded update');
assert(nodes(trackedAst,node=>ts.isCallExpression(node)&&node.expression.getText(trackedAst)==='update'&&node.arguments[0]?.getText(trackedAst)==='metadata.mediaTime').length===1,'Native video metadata still drives tracking and the arrival');
const trackedText=trackedAst.getText(),arrivalText=arrivalAst.getText();
assert(!/\b(cloudX|cloudY|settle|trail|gather)\b/.test(arrivalText),'No dispersed cloud trajectory or gathering phase remains');
assert(nodes(arrivalAst,node=>ts.isCallExpression(node)&&node.expression.getText(arrivalAst)==='ctx.arc'&&node.arguments[0]?.getText(arrivalAst)==='p.x'&&node.arguments[1]?.getText(arrivalAst)==='p.y').length===1,'Visible dots remain at the live silhouette sample coordinates');
assert(/arrivalEnabled\s*&&\s*!timed\s*&&\s*!arrivalDone/.test(trackedText),'Completed or skipped arrival canvases are not mounted');
assert(/onComplete=\{\(\)\s*=>\s*setArrivalDone\(true\)\}/.test(trackedText),'Canvas completion removes the arrival layer');
assert(/disposed\s*=\s*true/.test(arrivalText)&&/engine\.current\s*=\s*null/.test(arrivalText)&&/buffer\.width\s*=\s*1/.test(arrivalText)&&/buffer\.height\s*=\s*1/.test(arrivalText),'Effect cleanup invalidates the painter and releases its canvas buffers');

console.log('Runner arrival passed: direct silhouette timing, no dispersed cloud, transparent/black background stays empty, monotonic stages, photo ready at 3.5s, labels settled at 5.625s, cover-crop agreement with real tracking, single-media/static lifecycle guards. Browser rendering and mobile performance require separate verification.');
