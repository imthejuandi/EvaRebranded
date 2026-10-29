import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';

const read=path=>readFileSync(new URL(path,import.meta.url),'utf8');
const parse=(path,source=read(path))=>ts.createSourceFile(path,source,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
// The optional source override verifies that this test catches the pre-fix
// implementation without replacing or modifying the production component.
const tracked=parse('../components/story/TrackedRunner.tsx',process.env.EVA_RUNNER_STARTUP_SOURCE);
const story=parse('../components/story/ScrollStory.tsx');
const glow=parse('../components/story/GlowMotion.tsx');
function find(tree,predicate){
 const found=[];const visit=node=>{if(predicate(node))found.push(node);ts.forEachChild(node,visit)};visit(tree);return found;
}
function effect(tree,marker){
 const matches=find(tree,node=>ts.isCallExpression(node)&&node.expression.getText(tree)==='useEffect'&&node.arguments[0]?.getText(tree).includes(marker));
 assert.equal(matches.length,1,`Exactly one production effect contains ${marker}`);
 return matches[0].arguments[0].getText(tree);
}
function compile(source,context){
 const module={exports:{}};
 const code=ts.transpileModule(`module.exports=${source}`,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 runInNewContext(code,{module,...context});return module.exports;
}
const playbackSource=effect(tracked,'requestVideoFrameCallback');
const entranceSource=effect(story,'const failOpen=');
class Surface{
 listeners=new Map();
 addEventListener(type,fn){const listeners=this.listeners.get(type)??new Set();listeners.add(fn);this.listeners.set(type,listeners)}
 removeEventListener(type,fn){this.listeners.get(type)?.delete(fn)}
 emit(type,event={}){const queued=Array.from(this.listeners.get(type)??[]);for(const fn of queued)fn(event)}
 get listenerCount(){return [...this.listeners.values()].reduce((sum,set)=>sum+set.size,0)}
}
function fixture({active=true,source=playbackSource}={}){
 let now=0,id=0,skips=0;
 const timers=new Map(),frames=new Map(),draws=[],arrivalDraws=[];
 const timer=(fn,delay,repeat=false)=>{const key=++id;timers.set(key,{fn,delay,at:now+delay,repeat});return key};
 const clear=key=>timers.delete(key);
 const win=new Surface(),doc=new Surface(),video=new Surface(),poster=new Surface();
 Object.assign(win,{setInterval:(fn,delay)=>timer(fn,delay,true),clearInterval:clear,setTimeout:(fn,delay)=>timer(fn,delay),clearTimeout:clear,scrollY:0});
 Object.assign(doc,{hidden:false,activeElement:null});
 Object.assign(video,{paused:true,currentTime:0,duration:5,readyState:0,videoWidth:0,
  requestVideoFrameCallback(fn){const key=++id;frames.set(key,fn);return key},cancelVideoFrameCallback(key){frames.delete(key)}});
 Object.assign(poster,{complete:true,naturalWidth:1450});
 const elapsed={current:0},lastTime={current:null},announced={current:false};
 const arrivalConfig={current:{enabled:true,unavailable:()=>{skips++}}};
 const context={window:win,document:doc,performance:{now:()=>now},timed:false,frame:0,fps:30,active,
  container:{current:{querySelector:selector=>selector==='video'?video:poster}},elapsed,lastTime,announced,arrivalConfig,
  arrival:{current:{drawFrame:(media,time)=>{assert.equal(media,video);arrivalDraws.push(time)}}},arrivalLayer:{current:{style:{}}},
  draw:{current:(time,reveal)=>draws.push({time,reveal})},RUNNER_ARRIVAL_END:5.5,
  clearInterval:clear,requestAnimationFrame:fn=>timer(()=>fn(now),16),cancelAnimationFrame:clear};
 let dispose=compile(source,context)();
 function advance(ms){
  const end=now+ms;
  while(true){
   let selected=null;for(const item of timers)if(item[1].at<=end&&(!selected||item[1].at<selected[1].at))selected=item;
   if(!selected)break;const [key,item]=selected;now=item.at;
   if(item.repeat)item.at+=item.delay;else timers.delete(key);item.fn();
  }
  now=end;
 }
 function decode(time){video.currentTime=time;video.readyState=4;video.videoWidth=864;const queued=[...frames];frames.clear();for(const [,fn]of queued)fn(now,{mediaTime:time})}
 function play(){video.paused=false;video.emit('playing')}
 function pause(){video.paused=true;video.emit('pause')}
 function hidden(value){doc.hidden=value;doc.emit('visibilitychange')}
 function setActive(value){dispose?.();context.active=value;dispose=compile(source,context)()}
 return {advance,decode,play,pause,hidden,setActive,video,doc,win,poster,elapsed,lastTime,announced,draws,arrivalDraws,
  skips:()=>skips,frames:()=>frames.size,pending:()=>timers.size+frames.size,dispose:()=>dispose?.(),context};
}

// A cached poster must not cause a normally loading video to lose its entrance.
function coldStart(source=playbackSource){
 const f=fixture({source});f.advance(3500);
 assert.equal(f.skips(),0,'Cold loading for 3.5 seconds must not be treated as a decoded-video stall');
 f.play();f.advance(400);f.decode(0);f.advance(100);f.decode(.1);
 assert.equal(f.skips(),0,'The real reveal survives a delayed first decoded frame');
 assert.equal(f.arrivalDraws.length,2);assert.equal(f.arrivalDraws[0],0);assert.equal(f.elapsed.current,.1);
 f.dispose();assert.equal(f.pending(),0);
}
coldStart();
{
 const f=fixture();f.play();f.decode(0);
 for(let i=1;i<=80;i++){f.advance(100);f.decode((i/10)%5)}
 assert.equal(f.skips(),0,'Advancing frames across the 5-second media loop do not trigger fallback');
 assert(Math.abs(f.elapsed.current-8)<1e-8,'Reveal clock accumulates correctly through a native loop');
 assert.equal(f.arrivalDraws.length,81,'The same callback paints every decoded arrival frame');f.dispose();
}
{
 const f=fixture();f.play();f.decode(0);f.advance(100);f.decode(.1);
 f.advance(900);assert.equal(f.skips(),0,'A subsecond gap does not skip');f.advance(350);
 assert(f.skips()>0,'A real playing-video stall still fails open after one second');f.dispose();
}
{
 const f=fixture();f.play();f.decode(0);f.advance(100);f.decode(.1);f.pause();
 assert.equal(f.frames(),0,'Pausing removes the decoded callback');f.advance(4500);
 assert.equal(f.skips(),0,'An intentional user pause is not a decoder failure');
 f.play();f.advance(400);assert.equal(f.skips(),0,'Resume grants time for the next decoded frame');f.decode(.2);
 assert(Math.abs(f.elapsed.current-.2)<1e-8,'User pause does not advance reveal time');f.dispose();
}
{
 const f=fixture();f.play();f.decode(0);f.advance(100);f.decode(.1);f.hidden(true);
 assert.equal(f.pending(),0,'A hidden document stops watchdog and decoded callbacks');f.advance(4500);
 assert.equal(f.skips(),0);f.hidden(false);f.advance(400);f.decode(2);
 assert.equal(f.skips(),0,'Visibility restoration does not inherit a stale stall deadline');
 assert.equal(f.elapsed.current,.1,'Hidden media time is rebased rather than consuming the reveal');f.dispose();
}
{
 const f=fixture({active:false});f.play();f.advance(4500);
 assert.equal(f.skips(),0,'Offscreen/inactive startup never fails the entrance');assert.equal(f.frames(),0);
 f.setActive(true);f.decode(0);f.advance(100);f.decode(.1);f.setActive(false);f.advance(4500);
 assert.equal(f.skips(),0,'Leaving the active scene cancels its watchdog');f.dispose();
}
{
 const f=fixture();f.play();f.decode(0);f.announced.current=true;f.advance(2500);
 assert.equal(f.skips(),0,'An already completed entrance is never invalidated by a later stall');f.dispose();
 assert.equal(f.pending(),0);for(const surface of [f.video,f.poster,f.doc])assert.equal(surface.listenerCount,0,'Disposal removes media, poster and visibility listeners');
}

// The parent still owns the bounded startup timeout; we run that actual effect.
{
 const f=fixture();let skips=0;
 const entrance={current:{dataset:{heroEntrance:'pending'},contains:()=>false}};
 const dispose=compile(entranceSource,{...f.context,matchMedia:()=>({matches:false}),location:{hash:''},entrance,
  setEntry:fn=>{entrance.current.dataset.heroEntrance=fn(entrance.current.dataset.heroEntrance)},skipEntry:()=>{skips++;entrance.current.dataset.heroEntrance='skip'},clearTimeout:f.win.clearTimeout})();
 f.advance(11999);assert.equal(skips,0,'The bounded startup grace remains available');
 f.advance(1);assert.equal(skips,1,'A never-starting entrance still becomes usable at 12 seconds');
 dispose();f.dispose();assert.equal(f.pending(),0);assert.equal(f.win.listenerCount,0);
}

// Execute actual media-error and play-rejection paths without loading a browser.
{
 const errors=find(glow,node=>ts.isJsxAttribute(node)&&node.name.getText(glow)==='onError');
 assert.equal(errors.length,1);let failed=false,ready=true,unavailable=0;
 compile(errors[0].initializer.expression.getText(glow),{setFailed:value=>{failed=value},setReady:value=>{ready=value},onMediaError:()=>{unavailable++}})();
 assert.equal(failed,true);assert.equal(ready,false);assert.equal(unavailable,1,'A real media error still calls the immediate fallback');
 const playSource=effect(glow,'el.play().catch');
 for(const name of ['NotAllowedError','AbortError']){
  let blocked=0,pauses=0;
  const dispose=compile(playSource,{media:{current:{play:()=>Promise.reject(new DOMException('test',name)),pause:()=>{pauses++}}},shouldPlay:true,DOMException,setPlaying:()=>{},blockedCallback:{current:()=>{blocked++}}})();
  await Promise.resolve();await Promise.resolve();
  assert.equal(blocked,name==='NotAllowedError'?1:0,`${name} retains its intentional playback handling`);dispose();assert.equal(pauses,1);
 }
}

console.log('Runner startup passed: actual production effects survive 3.5s cold load, advance through a media loop, detect real stalls, respect pause/resume/inactivity/visibility, clean up callbacks, retain 12s startup fail-open and immediate media/autoplay failure paths. This is a deterministic lifecycle test, not browser decode or rendering QA.');
