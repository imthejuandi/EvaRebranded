import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';
import {RUNNER_EDGE,RUNNER_MASK,RUNNER_INK_OVERLAY,setRunnerStyle} from '../lib/runner-media.ts';
import {glowRunner} from '../lib/design.ts';

assert.equal(RUNNER_MASK,'radial-gradient(ellipse,black 36%,transparent 73%)');
assert.equal(RUNNER_INK_OVERLAY,'radial-gradient(ellipse,transparent 36%,#0b1010 73%)');
const clamp=n=>Math.max(0,Math.min(1,n));
// H.264 is opaque. Alpha-mask over ink and inverse-ink overlay over video
// therefore produce the same color, including both endpoints and edge ramp.
for(let radius=0;radius<=1.5;radius+=.001){
 const overlay=clamp((radius-RUNNER_EDGE.opaque)/(RUNNER_EDGE.transparent-RUNNER_EDGE.opaque)),mask=1-overlay;
 for(const color of [[255,255,255],[230,124,51],[154,133,213],[11,16,16],[0,0,0]]){
  color.forEach((channel,index)=>assert(Math.abs((mask*channel+(1-mask)*[11,16,16][index])-((1-overlay)*channel+overlay*[11,16,16][index]))<1e-9));
 }
}

function loadTs(file,require){
 const module={exports:{}};
 const code=ts.transpileModule(readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 runInNewContext(code,{module,exports:module.exports,require});return module.exports;
}
const signal=loadTs('lib/runner-signals.ts',()=>JSON.parse(readFileSync('lib/runner-tracking.json','utf8')));
const text=readFileSync('components/story/TrackedRunner.tsx','utf8');
const tree=ts.createSourceFile('TrackedRunner.tsx',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
let drawSource;
function visit(node){
 if(ts.isBinaryExpression(node)&&node.left.getText(tree)==='draw.current'&&ts.isArrowFunction(node.right))drawSource=node.right.getText(tree);
 ts.forEachChild(node,visit);
}
visit(tree);assert(drawSource,'The actual production tracking renderer is testable');
const drawCode=ts.transpileModule(`module.exports=${drawSource}`,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
function replay(writeStyle){
 const writes={style:0,geometry:0,dataset:0};
 const element=()=>({style:new Proxy({}, {set(target,key,value){writes.style++;target[key]=value;return true}}),attributes:{},setAttribute(key,value){writes.geometry++;this.attributes[key]=value}});
 const entries=signal.runnerSignals.map(key=>({key,group:element(),path:element(),dot:element(),label:element(),letters:[...signal.runnerSignalCopy.es[key].status].map(element)}));
 const root={dataset:new Proxy({}, {set(target,key,value){writes.dataset++;target[key]=value;return true}})};
 const module={exports:{}};
 runInNewContext(drawCode,{module,entries,root,...signal,setRunnerStyle:writeStyle,arrivalConfig:{current:{enabled:false}},timed:false,signalsImmediate:false,width:351,height:591.232,viewportWidth:390,viewportHeight:844,mobile:true,labelWidth:112,labelPositions:{head:[240,100],stomach:[-10,280],knee:[240,400]},announced:{current:true},readyCallback:{current:()=>{}}});
 const draw=module.exports;draw(0,5);writes.style=0;writes.geometry=0;writes.dataset=0;
 const poses=[];
 for(let frame=0;frame<120;frame++){
  draw(frame/24,5);
  poses.push(JSON.stringify(entries.map(({path,dot,label})=>[path.attributes,dot.attributes,label.attributes])));
 }
 return {writes,poses};
}
// The old renderer unconditionally assigned these 35 settled style values.
const before=replay((element,property,value)=>{element.style[property]=value});
const after=replay(setRunnerStyle);
assert.deepEqual(after.poses,before.poses,'All 120 decoded tracking poses stay identical');
assert.equal(before.writes.style,4200);assert.equal(after.writes.style,0);
assert.equal(before.writes.geometry,1080);assert.equal(after.writes.geometry,1080);
assert.equal(before.writes.dataset,120);assert.equal(after.writes.dataset,120);

const vendor=path.resolve('node_modules/@remotion/compositor-darwin-arm64');
const probe=file=>JSON.parse(execFileSync(path.join(vendor,'ffprobe'),['-v','error','-select_streams','v:0','-show_entries','stream=codec_name,width,height,r_frame_rate,nb_frames,duration:format=size:packet=pts_time,duration_time','-of','json',path.join('public',file)],{encoding:'utf8',env:{...process.env,DYLD_LIBRARY_PATH:vendor}}));
const original=probe(glowRunner.video),mobile=probe(glowRunner.mobileVideo);
const a=original.streams[0],b=mobile.streams[0];
assert.deepEqual([a.width,a.height],[864,1080]);assert.deepEqual([b.width,b.height],[576,720]);
assert.equal(a.width/a.height,b.width/b.height,'Identical source aspect preserves object-fit cover and tracking');
for(const key of ['codec_name','r_frame_rate','nb_frames','duration'])assert.equal(b[key],a[key],key);
assert.equal(b.nb_frames,'120');assert.equal(b.duration,'5.000000');assert.equal(b.r_frame_rate,'24/1');
const packetTimes=data=>data.packets.map(packet=>[Number(packet.pts_time),Number(packet.duration_time)]).sort((x,y)=>x[0]-y[0]);
assert.deepEqual(packetTimes(mobile),packetTimes(original),'Every frame presentation timestamp and duration is retained');
assert(Number(mobile.format.size)<Number(original.format.size));
const glow=readFileSync('components/story/GlowMotion.tsx','utf8');
assert(glow.includes('mobileInkEdges=false')&&glow.includes('mobileInkEdges&&mobile&&native&&mask===RUNNER_MASK'),'Overlay remains opt-in and mobile/native only');
assert(text.includes('priority mobileInkEdges'),'Only the runner explicitly opts into its fixed ink backing');
console.log(JSON.stringify({passed:true,original:{width:a.width,height:a.height,bytes:Number(original.format.size)},mobile:{width:b.width,height:b.height,bytes:Number(mobile.format.size)},decodedPixelReduction:1-(b.width*b.height)/(a.width*a.height),bytesReduction:1-Number(mobile.format.size)/Number(original.format.size),settledWritesPerFrame:{before:Object.values(before.writes).reduce((a,b)=>a+b)/120,after:Object.values(after.writes).reduce((a,b)=>a+b)/120},trackingPoses:120,frameTimestamps:'identical',gradient:'equivalent over opaque ink',limitation:'Workload/geometry verification; physical mobile FPS is not measured.'},null,2));
