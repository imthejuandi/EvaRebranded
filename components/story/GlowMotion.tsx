'use client';

import {useEffect,useRef,useState,type CSSProperties} from 'react';
import {Html5Video,Img,staticFile,useRemotionEnvironment} from 'remotion';
import {RUNNER_MASK,RUNNER_INK_OVERLAY} from '@/lib/runner-media';

export const glowMotionStyle={
 background:'#0b1010',
 mask:RUNNER_MASK,
 colorLanguage:'amber / lilac / blue',
 texture:'optical defocus, bloom and fine grain in the source asset',
} as const;

type GlowMotionProps={
 poster:string;
 posterSrcSet?:string;
 priority?:boolean;
 video?:string;
 mobileVideo?:string;
 mobileInkEdges?:boolean;
 alt?:string;
 enabled?:boolean;
 active?:boolean;
 inComposition?:boolean;
 className?:string;
 style?:CSSProperties;
 mask?:string;
 onPlaybackBlocked?:()=>void;
 onMediaError?:()=>void;
 loop?:boolean;
 replayKey?:number;
 onEnded?:()=>void;
};

/** Source-led optical artwork. Scroll controls its parent; only the living texture follows time. */
export function GlowMotion({poster,posterSrcSet,priority=false,video,mobileVideo,mobileInkEdges=false,alt='',enabled=true,active=true,inComposition=false,className,style,mask=glowMotionStyle.mask,onPlaybackBlocked,onMediaError,loop=true,replayKey=0,onEnded}:GlowMotionProps){
 const environment=useRemotionEnvironment();
 const timedComposition=environment.isStudio||environment.isRendering;
 const native=!timedComposition&&!environment.isClientSideRendering;
 const container=useRef<HTMLDivElement>(null),media=useRef<HTMLVideoElement>(null);
 const blockedCallback=useRef(onPlaybackBlocked);
 useEffect(()=>{blockedCallback.current=onPlaybackBlocked},[onPlaybackBlocked]);
 const [reduced,setReduced]=useState(true),[inView,setInView]=useState(false),[visible,setVisible]=useState(true),[near,setNear]=useState(false);
 const [mobile,setMobile]=useState(true);
 useEffect(()=>{const query=matchMedia('(max-width: 700px)');const sync=()=>setMobile(query.matches);sync();query.addEventListener('change',sync);return()=>query.removeEventListener('change',sync)},[]);
 const selectedVideo=mobile&&mobileVideo?mobileVideo:video;
 const [ready,setReady]=useState(false),[failed,setFailed]=useState(false),[playing,setPlaying]=useState(false);
 useEffect(()=>{setReady(false);setFailed(false)},[selectedVideo,replayKey]);
 useEffect(()=>{const query=matchMedia('(prefers-reduced-motion: reduce)');const sync=()=>setReduced(query.matches);sync();query.addEventListener('change',sync);return()=>query.removeEventListener('change',sync)},[]);
 useEffect(()=>{const el=container.current;if(!el)return;const observer=new IntersectionObserver(entries=>setInView(entries[0]?.isIntersecting??false));observer.observe(el);const warm=new IntersectionObserver(entries=>{if(entries[0]?.isIntersecting){setNear(true);warm.disconnect()}},{rootMargin:'400px'});warm.observe(el);const sync=()=>setVisible(document.visibilityState==='visible');sync();document.addEventListener('visibilitychange',sync);return()=>{observer.disconnect();warm.disconnect();document.removeEventListener('visibilitychange',sync)}},[]);
 const sourceReady=(near||priority)&&!reduced;
 const shouldPlay=native&&sourceReady&&enabled&&active&&inView&&visible&&!failed;
 useEffect(()=>{const el=media.current;if(!el)return;let cancelled=false;if(shouldPlay){void el.play().catch((error:unknown)=>{if(cancelled||(error instanceof DOMException&&error.name==='AbortError'))return;setPlaying(false);blockedCallback.current?.()})}else el.pause();return()=>{cancelled=true;el.pause()}},[shouldPlay,selectedVideo,replayKey]);
 const fill:CSSProperties={position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'};
 const inkEdges=mobileInkEdges&&mobile&&native&&mask===RUNNER_MASK;
 return <div ref={container} className={className} data-glow-motion data-glow-state={failed?'fallback':playing?'playing':'paused'} data-edge-composite={inkEdges?'opaque-overlay':'alpha-mask'} style={{position:'relative',width:'100%',height:'100%',overflow:'hidden',maskImage:inkEdges?'none':mask,...style}}>
  {timedComposition&&inComposition?<Img src={poster.startsWith('/')?staticFile(poster):poster} alt={alt} style={fill}/>:<img src={poster} srcSet={posterSrcSet} sizes={priority?"(max-width: 700px) 90vw, 31vw":"(max-width: 700px) 100vw, 50vw"} loading={priority?"eager":"lazy"} decoding="async" fetchPriority={priority?"high":"auto"} alt={alt} style={{...fill,visibility:inkEdges&&ready&&!reduced&&!failed?'hidden':'visible'}}/>}
  {video&&timedComposition&&enabled&&active&&<Html5Video src={video.startsWith('/')?staticFile(video):video} muted loop={loop} style={fill}/>}
  {video&&native&&<video key={replayKey} ref={media} src={sourceReady?selectedVideo:undefined} muted loop={loop} playsInline preload={sourceReady?"auto":"none"} aria-hidden="true" disablePictureInPicture onPlaying={()=>{setReady(true);setPlaying(true)}} onPause={()=>setPlaying(false)} onEnded={()=>{setPlaying(false);onEnded?.()}} onError={()=>{setFailed(true);setReady(false);onMediaError?.()}} style={{...fill,opacity:ready&&!reduced?1:0}}/>}
  {inkEdges&&<div data-runner-ink-overlay aria-hidden="true" style={{position:'absolute',inset:0,background:RUNNER_INK_OVERLAY,pointerEvents:'none'}}/>}
 </div>
}
