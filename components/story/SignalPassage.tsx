'use client';
import {Player,type PlayerRef} from '@remotion/player';
import {useEffect,useMemo,useRef,useState} from 'react';
import type {BodySignalFilm} from './BodySignalFilm';
import {HalftoneNumber} from './HalftoneNumber';
import {Arrow} from './Arrow';
import {SignalTimeline,type SignalTimelineHandle} from './SignalTimeline';
import {useSignalArrival} from './useSignalArrival';
import {BODY_PLAYBACK_DURATION,BODY_PLAYBACK_FPS,bodyPlayback,bodyPlaybackStops} from '@/lib/body-signal-playback';

export function SignalPassage({calm=false}:{calm?:boolean}){
 const section=useRef<HTMLElement>(null),stage=useRef<HTMLDivElement>(null),player=useRef<PlayerRef>(null);
 const playhead=useRef(0);
 const timeline=useRef<SignalTimelineHandle>(null);
 const [size,setSize]=useState<{width:number;height:number}|null>(null);
 const [chapter,setChapter]=useState(0),[Film,setFilm]=useState<typeof BodySignalFilm|null>(null),[failed,setFailed]=useState(false);
 const [inView,setInView]=useState(false),[visible,setVisible]=useState(true),[paused,setPaused]=useState(false),[complete,setComplete]=useState(false);
 const active=inView&&visible&&!paused&&!calm;
 useSignalArrival({section,playhead,enabled:!!Film&&!!size&&!calm&&!failed&&!paused&&!complete,playing:active});
 const filmProps=useMemo(()=>({autoplaySequence:true,ambientActive:active,sequenceComplete:complete}),[active,complete]);
 useEffect(()=>{
  if(calm||!stage.current)return;
  const el=stage.current;
  const measure=()=>{const width=Math.round(el.clientWidth),height=Math.round(el.clientHeight);if(width&&height)setSize(previous=>previous?.width===width&&previous.height===height?previous:{width,height})};
  const resize=new ResizeObserver(measure);resize.observe(el);measure();
  // Hysteresis lets the scene continue while it is still meaningfully on screen.
  const observer=new IntersectionObserver(entries=>{
   const entry=entries[0];
   const ratio=entry?entry.intersectionRect.height/Math.max(1,Math.min(entry.boundingClientRect.height,window.innerHeight)):0;
   setInView(previous=>ratio>=.85?true:ratio<.1?false:previous);
  },{threshold:[0,.1,.85,1]});
  observer.observe(el);
  const visibility=()=>setVisible(!document.hidden);visibility();document.addEventListener('visibilitychange',visibility);
  return()=>{resize.disconnect();observer.disconnect();document.removeEventListener('visibilitychange',visibility)};
 },[calm]);
 useEffect(()=>{
  if(calm||!section.current)return;let alive=true;
  const observer=new IntersectionObserver(entries=>{
   if(entries[0]?.isIntersecting){observer.disconnect();void import('./BodySignalFilm').then(module=>{if(alive)setFilm(()=>module.BodySignalFilm)}).catch(()=>{if(alive)setFailed(true)})}
  },{rootMargin:'150% 0px'});
  observer.observe(section.current);return()=>{alive=false;observer.disconnect()};
 },[calm]);
 useEffect(()=>{
  const instance=player.current;if(calm||!Film||!size||!instance)return;
  const frame=(event:{detail:{frame:number}})=>{
   playhead.current=event.detail.frame;
   timeline.current?.setFrame(playhead.current);
   const next=bodyPlayback(event.detail.frame).chapter;
   setChapter(previous=>previous===next?previous:next);
  };
  const ended=()=>{
   // Render the terminal composition explicitly: ended can skip the last frame,
   // and seeking to it emits another ended event in the player.
   playhead.current=BODY_PLAYBACK_DURATION-1;
   timeline.current?.setFrame(playhead.current);
   setChapter(3);setComplete(true);
  };
  instance.addEventListener('frameupdate',frame);instance.addEventListener('ended',ended);
  instance.seekTo(playhead.current);
  return()=>{instance.removeEventListener('frameupdate',frame);instance.removeEventListener('ended',ended)};
 },[calm,Film,size]);
 useEffect(()=>{
  const instance=player.current;if(!instance)return;
  if(active&&!complete)instance.play();else instance.pause();
 },[active,complete,Film,size]);
 const jump=(index:number)=>{
  playhead.current=bodyPlaybackStops[index];timeline.current?.setFrame(playhead.current);player.current?.seekTo(playhead.current);setChapter(index);setComplete(false);
  if(active)player.current?.play();
 };
 const continueLink=<a className="signal-continue" href="#una-perspectiva">Sigue descubriendo <Arrow direction="down"/></a>;
 if(calm||failed)return <section id="una-senal" className="signal-calm body-signal-calm"><p className="eyebrow">UNA SEÑAL PARA CONOCERTE</p><h2>Entiende mejor las señales<br/><em>de tu cuerpo.</em></h2><HalftoneNumber/><p>15 biomarcadores. Cada 90 días.<br/>De los datos. A tu vida.</p>{continueLink}</section>;
 return <section id="una-senal" className={'signal-passage body-signal-passage signal-autoplay '+(!size||!Film?'signal-loading':'')} ref={section} aria-labelledby="signal-title" data-signal-playback={complete?(active?'ambient':'ambient-paused'):paused?'paused':active?'playing':'waiting'}>
  <div className="signal-stage" ref={stage}>
   <div aria-hidden="true" className="film">{size&&Film?<Player ref={player} component={Film} inputProps={filmProps} compositionWidth={size.width} compositionHeight={size.height} durationInFrames={BODY_PLAYBACK_DURATION} fps={BODY_PLAYBACK_FPS} controls={false} initiallyMuted numberOfSharedAudioTags={0} autoPlay={false} loop={false} moveToBeginningWhenEnded={false} clickToPlay={false} spaceKeyToPlayOrPause={false} doubleClickToFullscreen={false} allowFullscreen={false} style={{width:'100%',height:'100%',pointerEvents:'none'}}/>:<div className="signal-placeholder"><p>UNA SEÑAL PARA CONOCERTE</p><h2>De los datos.<br/><em>A tu vida.</em></h2><p>15 biomarcadores. Cada 90 días.<br/>Compara tus resultados en el tiempo.</p></div>}</div>
   {size&&Film&&<div className="signal-playback-actions"><button type="button" aria-pressed={paused} onClick={()=>setPaused(value=>!value)}>{complete?(paused?'Reanudar puntos':'Pausar puntos'):(paused?'Reanudar animación':'Pausar animación')}</button>{complete&&continueLink}</div>}
   <SignalTimeline ref={timeline} chapter={chapter} initialFrame={playhead.current} onSelect={jump}/>
  </div>
  <div className="sr-only"><h2 id="signal-title">Entiende mejor las señales de tu cuerpo. De los datos. A tu vida.</h2><p>15 biomarcadores. Cada 90 días. Compara tus resultados en el tiempo.</p></div>
 </section>;
}
