'use client';

import {useEffect,useRef,useState} from 'react';
import {RunnerArrival,RUNNER_ARRIVAL_END,RUNNER_ARRIVAL_LABEL_OFFSET,type RunnerArrivalHandle} from './RunnerArrival';
import {useCurrentFrame,useRemotionEnvironment,useVideoConfig} from 'remotion';
import {GlowMotion} from './GlowMotion';
import {glowRunner} from '@/lib/design';
import {setRunnerStyle} from '@/lib/runner-media';
import {runnerPoint,runnerSignals,runnerSignalCopy,signalStart,signalProgress,signalsSettledAt,type SignalLanguage} from '@/lib/runner-signals';

type Props={width:number;height:number;viewportWidth:number;viewportHeight:number;top:number;saludTop:number;enabled:boolean;active:boolean;language?:SignalLanguage;onPlaybackBlocked?:()=>void;onSignalsReady?:()=>void;signalsImmediate?:boolean;arrivalEnabled?:boolean;onArrivalUnavailable?:()=>void};

/** The approved tracking overlay shares the video's plane and follows decoded media time.
 * Scroll moves the whole plane; it never changes the runner's tracking clock. */
export function TrackedRunner({width,height,viewportWidth,viewportHeight,top,saludTop,enabled,active,language='es',onPlaybackBlocked,onSignalsReady,signalsImmediate=false,arrivalEnabled=false,onArrivalUnavailable}:Props){
 const container=useRef<HTMLDivElement>(null);
 const elapsed=useRef(0),lastTime=useRef<number|null>(null);
 const arrival=useRef<RunnerArrivalHandle>(null),arrivalLayer=useRef<HTMLDivElement>(null);
 const [arrivalDone,setArrivalDone]=useState(false);
 const arrivalConfig=useRef({enabled:arrivalEnabled,unavailable:onArrivalUnavailable});
 arrivalConfig.current={enabled:arrivalEnabled,unavailable:onArrivalUnavailable};
 const announced=useRef(false),readyCallback=useRef(onSignalsReady);
 useEffect(()=>{readyCallback.current=onSignalsReady},[onSignalsReady]);
 const frame=useCurrentFrame(),{fps}=useVideoConfig();
 const environment=useRemotionEnvironment();
 const timed=environment.isStudio||environment.isRendering;
 const mobile=viewportWidth<=700;
 const planeLeft=(viewportWidth-width)/2;
 const fontSize=mobile?16:Math.min(26,Math.max(20,viewportWidth*.018));
 const nameSize=mobile?10:11;
 const labelWidth=mobile?112:172;
 const rightX=mobile?viewportWidth-labelWidth-18:Math.min(planeLeft+width+30,viewportWidth-labelWidth-48);
 const leftX=mobile?20:Math.max(48,planeLeft-labelWidth-24);
 const labelPositions={
  head:[rightX-planeLeft,height*.17],
  stomach:[leftX-planeLeft,height*.47],
  knee:[rightX-planeLeft,Math.min(height*.73,saludTop-top-52)],
 };
 // Save the renderer for both the decoded-video callback and the Studio clock.
 const draw=useRef<(time:number,revealSeconds:number)=>void>(()=>{});
 useEffect(()=>{
  const root=container.current;if(!root)return;
  const entries=runnerSignals.map(key=>({key,
   group:root.querySelector<SVGGElement>(`[data-runner-signal="${key}"]`)!,
   path:root.querySelector<SVGPathElement>(`[data-runner-signal="${key}"] path`)!,
   dot:root.querySelector<SVGGElement>(`[data-runner-signal="${key}"] [data-anchor]`)!,
   label:root.querySelector<SVGGElement>(`[data-runner-signal="${key}"] [data-label]`)!,
   letters:Array.from(root.querySelectorAll<SVGTSpanElement>(`[data-runner-signal="${key}"] tspan`)),
  }));
  draw.current=(time,revealSeconds)=>{
   if(arrivalConfig.current.enabled&&!timed)revealSeconds=Math.max(0,revealSeconds-RUNNER_ARRIVAL_LABEL_OFFSET);
   if(signalsImmediate)revealSeconds=5;
   const sourceHead=runnerPoint(time,'head',width,height);
   const driftX=(sourceHead[0]-width*.53)*.16;
   const driftY=(sourceHead[1]-height*.2)*.12;
   root.dataset.signalTime=time.toFixed(3);
   for(const entry of entries){
    const {key,group,path,dot,label,letters}=entry;
    const [x,y]=runnerPoint(time,key,width,height);
    const [baseX,baseY]=labelPositions[key];
    const lx=baseX+driftX,ly=baseY+driftY;
    const endX=key==='stomach'?lx+(mobile?88:labelWidth-14):lx-10;
    const endY=ly+7,turnX=endX+(key==='stomach'?18:-18);
    const age=revealSeconds*24-signalStart[key];
    setRunnerStyle(group,'opacity',String(signalProgress(age,0,10)));
    path.setAttribute('d',`M ${x} ${y} L ${turnX} ${endY} L ${endX} ${endY}`);
    setRunnerStyle(path,'strokeDashoffset',String(1-signalProgress(age,5,18)));
    dot.setAttribute('transform',`translate(${x} ${y})`);
    label.setAttribute('transform',`translate(${lx} ${ly+5*(1-signalProgress(age,10,23))})`);
    setRunnerStyle(label,'opacity',String(signalProgress(age,10,21)));
    letters.forEach((letter,index)=>{setRunnerStyle(letter,'opacity',String(signalProgress(age-13,index*.18,index*.18+7)))});
   }
   if(revealSeconds>=signalsSettledAt&&!announced.current){announced.current=true;readyCallback.current?.()}
  };
  if(lastTime.current!==null||signalsImmediate)draw.current(lastTime.current??0,elapsed.current);
 },[width,height,viewportWidth,viewportHeight,top,saludTop,language,mobile,fontSize,signalsImmediate,timed]);
 useEffect(()=>{
  if(timed){draw.current(frame/fps,frame/fps);return}
  const video=container.current?.querySelector('video');if(!video)return;
  let callback=0,raf=0,fallbackRaf=0,watchdog=0,disposed=false,rebaseDecoded=false,lastDecodedAt=performance.now(),decoded=false;
  const poster=container.current?.querySelector('img');
  let posterReady=Boolean(poster?.complete&&poster.naturalWidth);
  const stopFallback=()=>{cancelAnimationFrame(fallbackRaf);fallbackRaf=0};
  // If playback is blocked or stalls, finish the same reveal over the still image.
  // Tracking remains frozen at the last decoded pose; this clock stops at completion.
  const fallback=()=>{
   if(disposed||fallbackRaf||announced.current||!active||document.hidden||!posterReady)return;
   // A stalled decoder cannot keep a live silhouette aligned with the runner.
   // Reveal the usable still page immediately instead of trapping it behind ink.
   if(arrivalConfig.current.enabled){arrivalConfig.current.unavailable?.();return}
   rebaseDecoded=true;
   let previous=performance.now();
   const tick=(now:number)=>{
    fallbackRaf=0;
    if(disposed||announced.current||!active||document.hidden)return;
    elapsed.current=Math.min(5,elapsed.current+Math.min((now-previous)/1000,.05));previous=now;
    draw.current(lastTime.current??0,elapsed.current);
    if(!announced.current)fallbackRaf=requestAnimationFrame(tick);
   };
   fallbackRaf=requestAnimationFrame(tick);
  };
  const loaded=()=>{posterReady=true;lastDecodedAt=performance.now()};
  poster?.addEventListener('load',loaded);
  const watch=()=>{
   clearInterval(watchdog);
   if(!active||announced.current||document.hidden)return;
   watchdog=window.setInterval(()=>{
    if(announced.current){clearInterval(watchdog);stopFallback();return}
    // Normal loading is not a decoder stall. ScrollStory bounds startup at 12s;
    // this shorter watchdog only applies after playback has delivered a frame.
    if(decoded&&!video.paused&&performance.now()-lastDecodedAt>1000)fallback();
   },250);
  };
  watch();
  const requestFrame=video.requestVideoFrameCallback?.bind(video);
  const update=(time:number)=>{
   // The rAF compatibility path can repeat currentTime during a media stall.
   if(lastTime.current!==null&&Math.abs(time-lastTime.current)<.0001)return;
   decoded=true;lastDecodedAt=performance.now();stopFallback();
   const previous=rebaseDecoded?null:lastTime.current;rebaseDecoded=false;
   if(previous!==null){
    const delta=time>=previous?time-previous:(Number.isFinite(video.duration)?video.duration-previous+time:0);
    // Cap the reveal clock; later loops preserve every signal without resets.
    elapsed.current=Math.min(arrivalConfig.current.enabled?13:5,elapsed.current+Math.max(0,delta));
   }
   lastTime.current=time;
   if(arrivalConfig.current.enabled&&arrival.current){
    arrival.current.drawFrame(video,elapsed.current);
    if(arrivalLayer.current)arrivalLayer.current.style.opacity=String(Math.max(0,Math.min(1,(RUNNER_ARRIVAL_END-elapsed.current)/.4)));
   }
   draw.current(time,elapsed.current);
  };
  const cancel=()=>{
   if(callback&&'cancelVideoFrameCallback' in video)video.cancelVideoFrameCallback(callback);
   cancelAnimationFrame(raf);callback=0;raf=0;
  };
  const schedule=()=>{
   if(disposed||video.paused||!active||document.hidden)return;
   if(requestFrame){
    callback=requestFrame((_now,metadata)=>{callback=0;update(metadata.mediaTime);schedule()});
   }else{
    raf=requestAnimationFrame(()=>{raf=0;update(video.currentTime);schedule()});
   }
  };
  const start=()=>{lastDecodedAt=performance.now();cancel();schedule()};
  const visibility=()=>{if(document.hidden){cancel();stopFallback();clearInterval(watchdog);rebaseDecoded=true}else{lastDecodedAt=performance.now();watch();start()}};
  video.addEventListener('playing',start);video.addEventListener('pause',cancel);
  document.addEventListener('visibilitychange',visibility);
  if(!video.paused)start();
  return()=>{disposed=true;cancel();stopFallback();clearInterval(watchdog);poster?.removeEventListener('load',loaded);video.removeEventListener('playing',start);video.removeEventListener('pause',cancel);document.removeEventListener('visibilitychange',visibility)};
 // The native playback loop survives scroll frames and pauses; no React render per frame.
 },[timed,timed?frame:0,fps,active]);
 return <div ref={container} data-tracked-runner data-arrival-state={!arrivalEnabled?'skipped':arrivalDone?'complete':'running'} style={{position:'relative',width:'100%',height:'100%'}}>
  <GlowMotion {...glowRunner} inComposition priority mobileInkEdges enabled={enabled} active={active} onPlaybackBlocked={onPlaybackBlocked} onMediaError={onArrivalUnavailable}/>
  {arrivalEnabled&&!timed&&!arrivalDone&&<div ref={arrivalLayer} data-runner-arrival-layer style={{position:'absolute',left:-planeLeft,top:-top,width:viewportWidth,height:viewportHeight,zIndex:1,pointerEvents:'none'}}>
   <RunnerArrival ref={arrival} width={viewportWidth} height={viewportHeight} mediaRect={{x:planeLeft,y:top,width,height}} onComplete={()=>setArrivalDone(true)} onError={onArrivalUnavailable}/>
  </div>}
  <svg data-runner-signals aria-hidden="true" width={width} height={height} style={{position:'absolute',inset:0,zIndex:2,overflow:'visible',pointerEvents:'none',fontFamily:'EVA Hanken, Arial, sans-serif'}}>
   {runnerSignals.map(key=>{
    const color=key==='knee'?'#e9a067':'#f3f0e8',copy=runnerSignalCopy[language][key];
    return <g key={key} data-runner-signal={key} style={{opacity:0}}>
     <path fill="none" stroke={color} strokeWidth={.7} opacity={.43} pathLength={1} strokeDasharray="1" strokeDashoffset={1}/>
     <g data-anchor><circle r={9} fill={color} opacity={.045}/><circle r={5.2} fill={color} opacity={.13}/><circle r={mobile?2.5:3.2} fill="#f3f0e8"/></g>
     <g data-label style={{opacity:0,filter:'drop-shadow(0 2px 5px #0b1010)'}}>
      <text y={nameSize} fill="#b7bcb6" fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace" fontSize={nameSize} letterSpacing=".06em">{copy.name}</text>
      <text y={nameSize+fontSize+5} fill={color} fontSize={fontSize} letterSpacing="-.025em">{[...copy.status].map((letter,index)=><tspan key={index}>{letter}</tspan>)}</text>
     </g>
    </g>;
   })}
  </svg>
 </div>;
}
