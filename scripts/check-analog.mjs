import assert from 'node:assert/strict';
import {signalState,signalStops,signalWords,SIGNAL_DURATION} from '../lib/analog-motion.ts';
const lit=state=>state.points.filter(p=>p.r>0);
const mask=state=>state.points.map(p=>p.r>0);
const originalCounts=[27,35,27],previousCounts=[108,140,108];
for(let i=0;i<3;i++){
 const count=lit(signalState(signalStops[i])).length;
 assert.equal(count,previousCounts[i]*2,`${signalWords[i]} must have exactly twice the previous board's lit dots`);
 assert.equal(count,originalCounts[i]*8,`${signalWords[i]} must have exactly eight times the initial 03.2 lit dots`);
}
const coordinates=signalState(0).points.map(({x,y})=>({x,y}));
assert.equal(coordinates.length,624,'The 78 original lamp positions must each have eight fixed lamps');
assert.equal(new Set(coordinates.map(p=>`${p.x},${p.y}`)).size,624,'Every lamp needs a distinct position');
const body=coordinates.filter(p=>p.y>0);
const columns=[...new Set(body.map(p=>p.x))].sort((a,b)=>a-b);
const rows=[...new Set(body.map(p=>p.y))].sort((a,b)=>a-b);
assert.equal(columns.length,44);assert.equal(rows.length,28);
for(const axis of [columns,rows])for(let i=1;i<axis.length;i++)assert.equal(axis[i]-axis[i-1],.25,'Staggered rows and columns must use uniform quarter-unit spacing');
let nearest=Infinity;
for(let i=0;i<coordinates.length;i++)for(let j=i+1;j<coordinates.length;j++)nearest=Math.min(nearest,Math.hypot(coordinates[i].x-coordinates[j].x,coordinates[i].y-coordinates[j].y));
assert.equal(body.length,44*28/2,'Alternate sites form a staggered lattice, with exactly twice the previous density');
assert(nearest-.13*2>.09,'Neighboring circular lamps must retain visible gaps');
const frames=[];
for(let f=0;f<SIGNAL_DURATION;f++){
 const s=signalState(f);assert(Number.isFinite(s.phase)&&s.phase>=0&&s.phase<=2);
 assert.deepEqual(s.points.map(({x,y})=>({x,y})),coordinates,'Scroll must never move any lamp center');
 assert(s.points.every(p=>p.r===0||p.r===.13),'Lamps must switch on/off, with no whole-display fade');
 frames.push(JSON.stringify(s));
}
for(let f=SIGNAL_DURATION-1;f>=0;f--)assert.equal(JSON.stringify(signalState(f)),frames[f],'Reverse traversal must return the same display');
for(const [start,end] of [[55,135],[215,295]]){
 const before=mask(signalState(start)),after=mask(signalState(end));
 const snapshots=Array.from({length:end-start+1},(_,i)=>mask(signalState(start+i)));
 assert(new Set(snapshots.map(s=>s.join(''))).size>=5,'The board must update through multiple discrete intermediate states');
 const switches=[];
 for(let i=0;i<before.length;i++){
  const changed=snapshots.slice(1).flatMap((s,j)=>s[i]!==snapshots[j][i]?[j+1]:[]);
  assert.equal(changed.length,before[i]===after[i]?0:1,'Each changing lamp switches once; unchanged lamps hold');
  if(changed.length)switches.push({frame:changed[0],on:after[i],x:coordinates[i].x});
 }
 assert(switches.some(s=>s.on)&&switches.some(s=>!s.on),'Each transition must switch individual lamps both on and off');
 const firstFrame=Math.min(...switches.map(s=>s.frame));
 const first=switches.filter(s=>s.frame===firstFrame);
 assert(Math.max(...first.map(s=>s.x))-Math.min(...first.map(s=>s.x))>5,'The first update must be scattered across the board, not a wipe');
}
assert.deepEqual(signalState(-50),signalState(0));assert.deepEqual(signalState(999),signalState(360));
assert.deepEqual(signalState(0),signalState(55),'Opening state must have a readable hold');
assert.deepEqual(signalState(160),signalState(215),'Middle state must have a readable hold');
console.log('Analog board passed: doubled current endpoints (216/280/216), 624 fixed lamps on a staggered grid plus accent, separated circles, scattered individual on/off steps, readable holds, bounded and reversible across 361 frames.');
