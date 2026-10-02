import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';

const source=readFileSync('components/story/useSignalArrival.ts','utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
function fixture({hash='',reduced=false,restored=false}={}){
 let now=0,id=0,geometryReads=0;
 const frames=new Map(),timers=new Map();
 class Surface{
  listeners=new Map();dataset={};parentElement=null;scrollHeight=0;clientHeight=0;scrollTop=0;
  addEventListener(type,fn,options){const set=this.listeners.get(type)||new Map();set.set(fn,options);this.listeners.set(type,set)}
  removeEventListener(type,fn){this.listeners.get(type)?.delete(fn)}
  emit(type,event={}){event.target??=this;event.cancelable??=true;event.preventDefault??=()=>{event.prevented=true};const pending=Array.from(this.listeners.get(type)||[]);for(const [fn] of pending)fn(event);return event}
  closest(){return null}
 }
 const win=new Surface(),doc=new Surface(),query=new Surface(),section=new Surface();
 query.matches=reduced;
 const status={enabled:true,playing:false},playhead={current:0},consumed={current:false};
 const raf=fn=>{const key=++id;frames.set(key,fn);return key},clearRaf=key=>frames.delete(key);
 const timeout=(fn,ms)=>{const key=++id;timers.set(key,{fn,at:now+ms});return key},clearTimer=key=>timers.delete(key);
 Object.assign(win,{innerWidth:390,innerHeight:667,scrollY:0,matchMedia:()=>query,setTimeout:timeout,clearTimeout:clearTimer});
 doc.body=new Surface();doc.documentElement={scrollHeight:15000};doc.hidden=false;
 section.getBoundingClientRect=()=>{geometryReads++;return {top:7000-win.scrollY}};
 win.scrollTo=({top})=>{win.scrollY=top;win.emit('scroll')};
 const module={exports:{}};
 runInNewContext(code,{module,exports:module.exports,require:()=>({}),window:win,document:doc,location:{hash},performance:{now:()=>now,getEntriesByType:()=>[{type:restored?'back_forward':'navigate'}]},Element:Surface,getComputedStyle:()=>({overflowY:'visible'}),ResizeObserver:class{observe(){}disconnect(){}},requestAnimationFrame:raf,cancelAnimationFrame:clearRaf,setTimeout:timeout,clearTimeout:clearTimer});
 const handle=module.exports.installSignalArrival(section,playhead,()=>status,consumed);
 function step(ms){now+=ms;for(const [key,timer] of timers)if(timer.at<=now){timers.delete(key);timer.fn()};const pending=[...frames];frames.clear();for(const [,fn] of pending)fn(now)}
 function settle(ms){for(let spent=0;spent<ms;spent+=20)step(Math.min(20,ms-spent))}
 const wheel=delta=>win.emit('wheel',{target:doc.body,deltaY:delta,deltaX:0,ctrlKey:false,metaKey:false});
 const touch=(type,y)=>win.emit(type,{target:doc.body,touches:type==='touchend'?[]:[{clientX:100,clientY:y}],cancelable:false});
 const blockCount=()=>[...(win.listeners.get('wheel')?.values()||[])].filter(options=>options?.passive===false).length;
 return {win,doc,section,status,playhead,consumed,handle,step,settle,wheel,touch,blockCount,geometryReads:()=>geometryReads,pending:()=>frames.size+timers.size};
}
{
 const f=fixture();assert.equal(f.blockCount(),0,'No scroll-blocking listeners before entry');
 f.win.scrollTo({top:6750});assert.equal(f.section.dataset.signalArrival,undefined,'Programmatic movement does not capture');
 f.wheel(80);assert.equal(f.section.dataset.signalArrival,'holding');assert.equal(f.blockCount(),1);
 f.playhead.current=2;f.status.playing=true;f.settle(280);
 assert(Math.abs(f.win.scrollY-7000)<.6,'The scene aligns within 260 ms');
 assert.equal(f.section.dataset.signalArrival,'holding','A visible minimum arrival hold remains');
 f.settle(140);assert.equal(f.section.dataset.signalArrival,'released');assert.equal(f.blockCount(),0);
 assert.equal(f.geometryReads(),1,'Scroll/alignment do not read layout');
 f.win.scrollTo({top:7100});f.wheel(80);assert.equal(f.pending(),0,'The one-time latch cannot reattach');f.handle.dispose();
}
{
 const f=fixture();f.touch('touchstart',500);f.touch('touchmove',350);f.touch('touchend');
 f.win.scrollTo({top:7080});f.step(16);
 assert.equal(f.section.dataset.signalArrival,'holding','An earlier non-cancelable touch gesture retains its momentum intent');
 f.settle(280);assert(Math.abs(f.win.scrollY-7000)<.6,'Small fling overshoot aligns back to scene');
 f.playhead.current=1;f.status.playing=true;f.settle(140);assert.equal(f.section.dataset.signalArrival,'released');f.handle.dispose();
}
for(const escape of ['Escape','Tab','ArrowDown','PageDown']){
 const f=fixture();f.win.scrollTo({top:6800});f.wheel(80);f.win.emit('keydown',{key:escape});
 assert.equal(f.section.dataset.signalArrival,'released',`${escape} releases immediately`);assert.equal(f.pending(),0);f.handle.dispose();
}
{
 const f=fixture();f.win.scrollTo({top:6500});f.wheel(800);f.win.scrollTo({top:7300});f.step(16);
 assert.equal(f.section.dataset.signalArrival,'holding','A single momentum tick can cross the entire capture window');
 f.settle(280);assert(Math.abs(f.win.scrollY-7000)<.6);f.handle.dispose();
}
{
 const f=fixture();f.win.scrollTo({top:6500});f.wheel(1100);f.win.scrollTo({top:7600});f.step(16);
 assert.equal(f.section.dataset.signalArrival,undefined,'Do not pull back after most of the stage has passed');f.handle.dispose();
}
{
 const f=fixture();f.win.scrollTo({top:6800});f.wheel(80);const up=f.wheel(-30);
 assert.equal(f.section.dataset.signalArrival,'released');assert(!up.prevented,'Upward scrolling remains native');f.handle.dispose();
}
{
 const f=fixture();f.win.scrollTo({top:6800});f.wheel(80);f.status.enabled=false;f.step(16);
 assert.equal(f.section.dataset.signalArrival,'released','Pause/failure cancels immediately');f.handle.dispose();
}
{
 const f=fixture();f.win.scrollTo({top:6800});f.wheel(80);f.settle(899);
 assert.equal(f.section.dataset.signalArrival,'holding');f.step(1);assert.equal(f.section.dataset.signalArrival,'released','Stalled playback fails open at 900ms');assert.equal(f.pending(),0);f.handle.dispose();
}
for(const opts of [{hash:'#una-senal'},{reduced:true},{restored:true}]){
 const f=fixture(opts);f.win.scrollTo({top:6800});f.wheel(80);f.step(16);assert.equal(f.section.dataset.signalArrival,undefined);assert.equal(f.blockCount(),0);f.handle.dispose();
}
{
 const f=fixture();f.win.scrollTo({top:6800});f.wheel(80);f.win.innerHeight=720;f.win.emit('resize');
 assert.equal(f.section.dataset.signalArrival,'holding','Mobile browser-chrome height change does not cancel arrival');
 f.handle.dispose();assert.equal(f.pending(),0,'Disposal cancels every timer/frame');for(const set of f.win.listeners.values())assert.equal(set.size,0,'Disposal removes all input listeners');
}
console.log('Signal arrival passed: passive pre-entry gestures, touch momentum, cached geometry, 260ms alignment, actual playback + 400ms minimum, 900ms fail-open, one visit, escape/pause/reduced-motion/history and cleanup. Native Safari compositor behavior still needs device QA.');
