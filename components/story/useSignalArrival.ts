'use client';

import {useEffect,useRef,type RefObject} from 'react';

type ArrivalStatus={enabled:boolean;playing:boolean};
type SignalArrivalOptions=ArrivalStatus&{section:RefObject<HTMLElement|null>;playhead:RefObject<number>};
type ArrivalHandle={cancel:()=>void;dispose:()=>void};
const ALIGN_MS=260,MIN_HOLD_MS=400,MAX_HOLD_MS=900;

/** A short, fail-open acknowledgement of the first pointer-led downward arrival. */
export function installSignalArrival(element:HTMLElement,playhead:RefObject<number>,status:()=>ArrivalStatus,consumed:{current:boolean}):ArrivalHandle{
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 const navigation=performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming|undefined;
 const noop=()=>{};
 if(consumed.current||location.hash||window.scrollY>32||navigation?.type==='back_forward'||reduced.matches)return {cancel:noop,dispose:noop};
 let holding=false,disposed=false,raf=0,intentRaf=0,timeout=0;
 let sectionTop=0,maxScroll=0,lastY=window.scrollY,lastIntent=-Infinity,lastWheel=-Infinity,lastWidth=window.innerWidth;
 let seenAbove=false,crossedTop=false,touchX=0,touchY=0,touchReady=false,wheelAllowed=true;
 const interactive='a,button,input,textarea,select,[contenteditable="true"],[role="dialog"],[role="slider"]';
 const measure=()=>{
  sectionTop=element.getBoundingClientRect().top+window.scrollY;
  maxScroll=Math.max(0,document.documentElement.scrollHeight-window.innerHeight);
  if(sectionTop-window.scrollY>0)seenAbove=true;
 };
 measure();
 // A nested scroller is inspected once at gesture start, never on every scroll tick.
 const bypass=(target:EventTarget|null)=>{
  if(!(target instanceof Element))return false;
  if(target.closest(interactive))return true;
  for(let node:Element|null=target;node&&node!==document.body;node=node.parentElement){
   const box=node as HTMLElement;
   if(box.scrollHeight>box.clientHeight+2&&/auto|scroll/.test(getComputedStyle(node).overflowY)&&box.scrollTop+box.clientHeight<box.scrollHeight-2)return true;
  }
  return false;
 };
 const release=()=>{
  holding=false;cancelAnimationFrame(raf);clearTimeout(timeout);raf=0;timeout=0;
  window.removeEventListener('wheel',blockWheel);window.removeEventListener('touchmove',blockTouch);
  if(consumed.current){element.dataset.signalArrival='released';detachGestures()}
 };
 const abandon=()=>{consumed.current=true;lastIntent=-Infinity;release()};
 const capture=()=>{
  if(disposed||holding||consumed.current||!status().enabled||document.hidden||reduced.matches)return;
  const top=sectionTop-window.scrollY;
  if(top>0)seenAbove=true;
  // Catch a fast wheel or touch fling crossing the top, without pulling back
  // a reader who has already intentionally passed most of the scene.
  const crossedWindow=crossedTop&&top>=-window.innerHeight*.6;
  if(!seenAbove||top>Math.min(320,window.innerHeight*.4)||(top< -Math.min(220,window.innerHeight*.3)&&!crossedWindow))return;
  consumed.current=true;holding=true;element.dataset.signalArrival='holding';
  const start=performance.now(),initialFrame=playhead.current,startY=window.scrollY,targetY=Math.min(sectionTop,maxScroll);
  window.addEventListener('wheel',blockWheel,{passive:false});
  window.addEventListener('touchmove',blockTouch,{passive:false});
  const tick=(now:number)=>{
   if(!holding)return;
   if(!status().enabled||document.hidden||reduced.matches){release();return}
   const elapsed=now-start,progress=Math.min(1,elapsed/ALIGN_MS);
   const target=startY+(targetY-startY)*(1-(1-progress)**3);
   // Continue cancelling native touch momentum until playback is observed.
   // This reads only the scroll offset; geometry was cached before the gesture.
   if(Math.abs(window.scrollY-target)>.5)window.scrollTo({top:target,behavior:'instant'});
   if(elapsed>=MIN_HOLD_MS&&status().playing&&playhead.current>initialFrame){release();return}
   raf=requestAnimationFrame(tick);
  };
  timeout=window.setTimeout(release,MAX_HOLD_MS);
  raf=requestAnimationFrame(tick);
 };
 function blockWheel(event:WheelEvent){
  if(event.deltaY<0||event.ctrlKey||event.metaKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)){abandon();return}
  if(holding&&event.deltaY>0&&event.cancelable)event.preventDefault();
 }
 function blockTouch(event:TouchEvent){if(holding&&touchReady&&event.touches.length===1&&event.cancelable)event.preventDefault()}
 const wheel=(event:WheelEvent)=>{
  const now=performance.now();
  if(event.deltaY<0||event.ctrlKey||event.metaKey||Math.abs(event.deltaX)>Math.abs(event.deltaY)){lastIntent=-Infinity;if(holding)abandon();return}
  if(event.deltaY<=0)return;
  if(now-lastWheel>180){wheelAllowed=!bypass(event.target);crossedTop=false}
  lastWheel=now;if(!wheelAllowed)return;
  lastIntent=now;capture();
 };
 const touchStart=(event:TouchEvent)=>{
  touchReady=event.touches.length===1&&!bypass(event.target);crossedTop=false;
  if(!touchReady){lastIntent=-Infinity;if(holding)abandon();return}
  touchX=event.touches[0].clientX;touchY=event.touches[0].clientY;
 };
 const touchMove=(event:TouchEvent)=>{
  if(!touchReady||event.touches.length!==1)return;
  const next=event.touches[0],dy=touchY-next.clientY,dx=touchX-next.clientX;
  touchX=next.clientX;touchY=next.clientY;
  if(dy<0||Math.abs(dx)>Math.abs(dy)){lastIntent=-Infinity;if(holding)abandon();return}
  if(dy>0){lastIntent=performance.now();capture()}
 };
 const touchEnd=()=>{if(touchReady&&Number.isFinite(lastIntent))lastIntent=performance.now();touchReady=false};
 const scroll=()=>{
  const y=window.scrollY,down=y>lastY;
  if(down&&lastY<=sectionTop&&y>sectionTop)crossedTop=true;
  lastY=y;
  if(holding||!down||consumed.current||performance.now()-lastIntent>1800||intentRaf)return;
  intentRaf=requestAnimationFrame(()=>{intentRaf=0;capture()});
 };
 const key=(event:KeyboardEvent)=>{if(['Tab','Escape','ArrowUp','ArrowDown','PageUp','PageDown','Home','End',' '].includes(event.key))abandon()};
 const pointer=(event:PointerEvent)=>{if(holding&&event.pointerType!=='touch')abandon()};
 const visibility=()=>{if(document.hidden)abandon()};
 const restored=(event:PageTransitionEvent)=>{if(event.persisted)abandon()};
 const motion=()=>{if(reduced.matches)abandon()};
 const resize=()=>{if(window.innerWidth!==lastWidth){lastWidth=window.innerWidth;if(holding)abandon()}measure()};
 function detachGestures(){
  window.removeEventListener('wheel',wheel);window.removeEventListener('touchstart',touchStart);window.removeEventListener('touchmove',touchMove);
  window.removeEventListener('touchend',touchEnd);window.removeEventListener('touchcancel',touchEnd);window.removeEventListener('scroll',scroll);
 }
 const observer=new ResizeObserver(measure);observer.observe(element);
 // Passive listeners remember gestures that begin above this section. Scroll
 // remains compositor-driven everywhere except the bounded arrival itself.
 window.addEventListener('wheel',wheel,{passive:true});
 window.addEventListener('touchstart',touchStart,{passive:true});
 window.addEventListener('touchmove',touchMove,{passive:true});
 window.addEventListener('touchend',touchEnd,{passive:true});
 window.addEventListener('touchcancel',touchEnd,{passive:true});
 window.addEventListener('scroll',scroll,{passive:true});
 window.addEventListener('keydown',key,true);window.addEventListener('pointerdown',pointer,{passive:true});
 window.addEventListener('hashchange',abandon);window.addEventListener('popstate',abandon);window.addEventListener('pageshow',restored);window.addEventListener('resize',resize);
 document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',motion);
 return {cancel:abandon,dispose:()=>{
  disposed=true;release();cancelAnimationFrame(intentRaf);observer.disconnect();
  window.removeEventListener('wheel',wheel);window.removeEventListener('touchstart',touchStart);window.removeEventListener('touchmove',touchMove);
  window.removeEventListener('touchend',touchEnd);window.removeEventListener('touchcancel',touchEnd);window.removeEventListener('scroll',scroll);
  window.removeEventListener('keydown',key,true);window.removeEventListener('pointerdown',pointer);
  window.removeEventListener('hashchange',abandon);window.removeEventListener('popstate',abandon);window.removeEventListener('pageshow',restored);window.removeEventListener('resize',resize);
  document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',motion);
 }};
}

export function useSignalArrival({section,playhead,enabled,playing}:SignalArrivalOptions){
 const current=useRef({enabled,playing}),consumed=useRef(false),handle=useRef<ArrivalHandle|null>(null);
 current.current={enabled,playing};
 useEffect(()=>{
  if(!section.current)return;
  const installed=installSignalArrival(section.current,playhead,()=>current.current,consumed);handle.current=installed;
  return()=>{installed.dispose();handle.current=null};
 },[section,playhead]);
 useEffect(()=>{if(!enabled&&handle.current&&consumed.current)handle.current.cancel()},[enabled]);
}
