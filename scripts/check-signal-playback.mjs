import assert from 'node:assert/strict';
import {bodyPlayback,bodyPlaybackProgress,advanceBodyMaterialFrame,BODY_MATERIAL_RATE,BODY_PLAYBACK_DURATION,BODY_PLAYBACK_FPS,BODY_ORB_START,bodyPlaybackStops} from '../lib/body-signal-playback.ts';
import {bodyNumberPhase,bodySignalState} from '../lib/body-signal.ts';
import {halftoneMasks,halftoneMaskAt} from '../lib/halftone-motion.ts';

const readings=[[27,106,0],[114,193,1],[201,279,2]];
const morphs=[[106,114,0],[193,201,1]];
assert.deepEqual(bodyPlaybackStops.map(f=>bodyPlayback(f).chapter),[0,1,2,3]);
assert.deepEqual(bodyPlaybackStops,[0,...readings.map(([from])=>from)],'Chapter controls land on fully readable stages');
assert.equal((BODY_PLAYBACK_DURATION-1)/BODY_PLAYBACK_FPS,10,'The complete narrative takes ten seconds');
assert.equal(bodyPlaybackStops[1]/BODY_PLAYBACK_FPS,.9,'The first complete reading appears after nine tenths of a second');
assert.equal((BODY_PLAYBACK_DURATION-1-BODY_ORB_START)/BODY_PLAYBACK_FPS,.7,'The last seven tenths of a second settle into the orb');
for(const [from,to,phase] of readings){
 assert((to-from)/BODY_PLAYBACK_FPS>=2.5,'Each complete reading preserves at least two and a half seconds');
 for(let f=from;f<=to;f++)assert.equal(bodyNumberPhase(bodyPlayback(f).narrative),phase);
}
let previous=bodyPlayback(0);
for(let f=1;f<BODY_PLAYBACK_DURATION;f++){
 const next=bodyPlayback(f);
 assert(next.narrative>=previous.narrative&&next.narrative-previous.narrative<=390/27+.001,'The narrative moves forward without skipping a transformation');
 assert(next.orb>=previous.orb&&next.orb-previous.orb<.0715,'The orb remains a gradual eased release');
 assert(Math.abs(next.materialFrame-previous.materialFrame-BODY_MATERIAL_RATE)<1e-10,'The authored field flows fifteen percent faster');
 previous=next;
}
for(const [from,to,phase] of morphs){
 assert.equal(to-from,8,'Each transformation uses the eight-frame minimum for every analog mask');
 const source=halftoneMasks[phase],target=halftoneMasks[phase+1];
 const differing=source.filter((value,index)=>value!==target[index]).length;
 const visited=new Set();let previousMask=source;
 for(let frame=from;frame<=to;frame++){
  const currentPhase=bodyNumberPhase(bodyPlayback(frame).narrative);
  const mask=source.map((_,index)=>halftoneMaskAt(currentPhase,index));
  visited.add(mask.map(value=>value?'1':'0').join(''));
  const switched=mask.filter((value,index)=>value!==previousMask[index]).length;
  assert(switched<=differing*.2,'A morph frame changes a scattered subset, never the complete numeral');
  for(let index=0;index<mask.length;index++){
   if(source[index]===target[index])assert.equal(mask[index],source[index],'Shared glyph cells remain lit through the morph');
   if(previousMask[index]===target[index])assert.equal(mask[index],target[index],'Resolved cells do not flicker back to the prior numeral');
  }
  previousMask=mask;
 }
 assert.equal(visited.size,9,'Both complete numerals and every intermediate analog mask remain visible');
 assert.deepEqual(previousMask,target,'Every transformed cell settles into the next readable numeral');
}
assert.equal(readings.reduce((total,[from,to])=>total+to-from,0),236,'The eleven frames saved from morphs become extra reading time');
assert.equal(BODY_MATERIAL_RATE,1.15);
let flowingClock=bodyPlayback(BODY_PLAYBACK_DURATION-1).materialFrame;
const handoffClock=flowingClock;
assert.equal(advanceBodyMaterialFrame(flowingClock,0),flowingClock,'A paused clock does not advance');
for(let i=0;i<60;i++)flowingClock=advanceBodyMaterialFrame(flowingClock,1000/60);
assert(Math.abs(flowingClock-handoffClock-34.5)<1e-9,'Ambient material preserves the same fifteen percent speedup');
assert.equal(advanceBodyMaterialFrame(handoffClock,1000),advanceBodyMaterialFrame(handoffClock,100),'A stalled frame cannot jump the material clock');
assert.deepEqual(bodyPlaybackProgress(-10),[0,0,0,0]);
assert.deepEqual(bodyPlaybackProgress(BODY_PLAYBACK_DURATION+30),[1,1,1,1]);
for(let frame=0;frame<BODY_PLAYBACK_DURATION;frame++){
 const chapter=bodyPlayback(frame).chapter,progress=bodyPlaybackProgress(frame);
 for(let index=0;index<4;index++){
  assert(progress[index]>=0&&progress[index]<=1,'Timeline progress stays inside its segment');
  if(index<chapter)assert.equal(progress[index],1,'Earlier chapters are complete when the caption changes');
  if(index>chapter)assert.equal(progress[index],0,'Future chapters do not fill before their caption');
 }
}
const render=(f,w,h)=>{const p=bodyPlayback(f);return bodySignalState(p.narrative,w,h,p)};
const transitionFrames=[...new Set([0,26,27,...readings.flatMap(([from,to])=>[from,to]),...morphs.flatMap(([from,to])=>Array.from({length:to-from},(_,index)=>from+index)),...Array.from({length:BODY_PLAYBACK_DURATION-1-BODY_ORB_START},(_,index)=>BODY_ORB_START+index)])];
for(const [w,h] of [[1440,900],[390,844],[320,720]]){
 for(const f of transitionFrames){
  const a=render(f,w,h),b=render(f+1,w,h);
  assert.deepEqual(a.points.map(p=>[p.x,p.y]),b.points.map(p=>[p.x,p.y]),'No dot is swapped or moved at a stage boundary');
  assert(Math.max(...a.points.map((p,i)=>Math.abs(p.r-b.points[i].r)/a.layout.pitch))<.025,'The shared lamp radius never snaps');
  if(f>=BODY_ORB_START)assert(Math.max(...a.points.map((p,i)=>Math.abs(p.opacity-b.points[i].opacity)))<.09,'No frame in the faster orb release flashes or cuts');
 }
 const terminal=BODY_PLAYBACK_DURATION-1,final=render(terminal,w,h);
 const ambientStart=bodySignalState(final.frame,w,h,{orb:1,materialFrame:final.materialFrame});
 assert.deepEqual(final,ambientStart,'Ambient rendering starts exactly where the authored scene ends');
 let advanced=final.materialFrame;
 for(let i=0;i<60;i++)advanced=advanceBodyMaterialFrame(advanced,1000/BODY_PLAYBACK_FPS);
 const flowing=bodySignalState(final.frame,w,h,{orb:1,materialFrame:advanced});
 assert.equal(final.frame,flowing.frame,'Narrative remains complete');
 assert(final.points.some((p,i)=>Math.abs(p.r-flowing.points[i].r)>.05),'Orb light and dots keep moving after completion');
 assert(final.points.length===flowing.points.length,'Keep the same continuous field');
}
console.log('Signal playback passed: 10-second narrative, longer reading holds, eight-frame numeral changes preserving every mask, fifteen percent faster authored/ambient waves, caption-aligned timeline, seamless orb handoff, desktop/mobile field identity.');
