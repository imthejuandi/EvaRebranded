import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {bodySignalState,BODY_SIGNAL_DURATION,BODY_RESOLVE_START,BODY_RESOLVE_END,bodyTitleTravel,bodyLampGuidance,bodySignalStops,bodyNumberPhase,bodySignalChapter} from '../lib/body-signal.ts';
import {halftoneState,halftoneMasks,HALFTONE_COLS,HALFTONE_ROWS,HALFTONE_PITCH} from '../lib/halftone-motion.ts';
import {livingLamp} from '../lib/living-lamp.ts';
import {signalStops} from '../lib/analog-motion.ts';
import {productHover} from '../lib/product-motion.ts';
const hash=s=>createHash('sha256').update(JSON.stringify(s)).digest('hex');
const coords=s=>s.points.map(({x,y})=>({x,y}));
const positions=coords(bodySignalState(0)),frames=[];
let previous,maxRadiusChange=0;
for(let f=0;f<BODY_SIGNAL_DURATION;f++){
 const state=bodySignalState(f),{pitch,left,top}=state.layout;
 assert.deepEqual(coords(state),positions,'Every lamp keeps its identity throughout the field and numerals');
 for(const [i,p] of state.points.entries()){
  const col=Math.round((p.x-left)/pitch),row=Math.round((p.y-top)/pitch);
  const lamp=livingLamp(col,row,f);
  assert.equal(p.r,pitch*lamp.radius,'Glyph guidance must never swap or reset a lamp radius or clock');
  assert(p.r>pitch*.14&&p.r<pitch*.43,'Field and numerals share separated, substantial halftone dots');
  assert(p.opacity>=.1&&p.opacity<=1,'The surrounding field must remain visible');
  if(f>=BODY_RESOLVE_END)assert(p.on?p.opacity>=.85:p.opacity<=.4,'Emerging strokes need clear energy contrast over the living field');
  if(previous)maxRadiusChange=Math.max(maxRadiusChange,Math.abs(p.r-previous.points[i].r)/pitch);
 }
 previous=state;frames.push(hash(state));
}
assert(maxRadiusChange<.025,'Common lamp motion remains continuous across the reveal and number changes');
for(const [w,h] of [[1440,900],[390,844],[320,568]])for(const f of [75,260,BODY_RESOLVE_END-1,BODY_RESOLVE_END,BODY_RESOLVE_END+30]){
 const state=bodySignalState(f,w,h),p=state.points;
 assert(Math.min(...p.map(p=>p.x))<0&&Math.max(...p.map(p=>p.x))>w);
 assert(Math.min(...p.map(p=>p.y))<0&&Math.max(...p.map(p=>p.y))>h);
 if(w<700){
  assert(p.every(p=>p.r>.7&&p.opacity>=.14),'Mobile lamps must remain visibly substantial everywhere, even behind letters');
  const title=p.filter(p=>p.x>30&&p.x<w-30&&p.y>h*.17&&p.y<h*.29);
  assert(title.length>50&&title.every(p=>p.opacity<=.32),'Dim behind the text without deleting the field');
 }
 const peripheral=p.filter(p=>p.x>state.layout.left+10&&p.y>10&&p.y<state.layout.top-20);
 assert(new Set(peripheral.map(p=>p.r.toFixed(2))).size>8,'Surrounding current keeps spatial variation');
}
const before=bodySignalState(BODY_RESOLVE_END-1),after=bodySignalState(BODY_RESOLVE_END);
assert(after.points.every((p,i)=>Math.abs(p.opacity-before.points[i].opacity)<.05),'No visual handoff at the reveal boundary');
assert.deepEqual(halftoneMasks.map(mask=>mask.filter(Boolean).length),[675,875,670]);
assert(BODY_RESOLVE_END-BODY_RESOLVE_START>=210,'Give the initial emergence at least twice the original frame span');
for(let col=0;col<HALFTONE_COLS;col++)for(let row=0;row<HALFTONE_ROWS;row++){
 let previous=0;
 for(let f=BODY_RESOLVE_START;f<=BODY_RESOLVE_END;f++){
  const light=bodyLampGuidance((f-BODY_RESOLVE_START)/(BODY_RESOLVE_END-BODY_RESOLVE_START),col,row);
  assert(light>=previous&&light-previous<.009,'Glyph guidance builds gently without a brightness jump or reversal');
  previous=light;
 }
 assert.equal(previous,1);
}
assert.equal(bodyTitleTravel(BODY_RESOLVE_END-100),0);
assert.equal(bodyTitleTravel(BODY_RESOLVE_END),1);
for(let f=BODY_RESOLVE_END-100;f<BODY_RESOLVE_END;f++){
 const step=bodyTitleTravel(f+1)-bodyTitleTravel(f);
 assert(step>=0&&step<.016,'Copy moves gradually in one direction with eased endpoints');
}
assert(bodyTitleTravel(BODY_RESOLVE_END-99)<.001&&1-bodyTitleTravel(BODY_RESOLVE_END-1)<.001);
for(const f of [BODY_RESOLVE_END+30,BODY_RESOLVE_END+180,BODY_RESOLVE_END+360]){
 const points=bodySignalState(f).points;
 assert(points.filter(p=>!p.on).every(p=>p.opacity>=.1),'The surrounding field remains alive after the numerals settle');
}
for(const f of signalStops){
 const active=halftoneState(f).points.filter(p=>p.r>0);
 assert(new Set(active.map(p=>p.r.toFixed(3))).size>20);
 assert(active.every(p=>p.r*2<HALFTONE_PITCH*.87));
}
const a=halftoneState(0).points,b=halftoneState(160).points,mid=halftoneState(95).points;
const changing=a.map((_,i)=>i).filter(i=>(a[i].r>0)!==(b[i].r>0));
assert(changing.some(i=>(mid[i].r>0)===(a[i].r>0))&&changing.some(i=>(mid[i].r>0)===(b[i].r>0)));
assert.deepEqual(bodySignalStops.map(bodySignalChapter),[0,1,2,3]);
for(const [start,end,phase] of [[0,200,0],[310,540,1],[650,830,2]]){
 for(let f=start;f<=end;f++)assert.equal(bodyNumberPhase(BODY_RESOLVE_END+f),phase,'Complete numerals must remain readable through longer holds');
}
assert(200>=95*2&&230>120&&180>85,'Reading holds extend the previous complete-number spans');
for(let f=BODY_SIGNAL_DURATION-1;f>=0;f--)assert.equal(hash(bodySignalState(f)),frames[f]);
for(let f=0;f<981;f++){assert(Math.abs(productHover(f))<=8);assert(Math.abs(productHover(f+1)-productHover(f))<.34)}
const film=readFileSync('components/story/BodySignalCanvas.tsx','utf8');
assert(film.includes('data-lamp-material="continuous-halftone"')&&!film.includes('state.glow'),'One persistent renderer and halo for every phase');
console.log(`Continuous field passed: ${BODY_SIGNAL_DURATION} reversible frames; one lamp size/clock/material throughout; mobile coverage behind legible text; 225-frame eased emergence; surrounding field retained; angular glyphs and Tasso hover retained.`);
