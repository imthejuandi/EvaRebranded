'use client';
import {useId,useState} from 'react';
import {GlowMotion} from './GlowMotion';
import {solarLifestyle} from '@/lib/design';

/** A living photograph: the gait and light trail are authored together in the source clip. */
export function SolarMotion({calm=false}:{calm?:boolean}){
 const [paused,setPaused]=useState(false),[failed,setFailed]=useState(false),[ended,setEnded]=useState(false),[replayKey,setReplayKey]=useState(0),id=useId();
 return <div className="solar-motion" data-solar-motion>
  <div className="solar-motion-art" id={id}>
   <GlowMotion poster={solarLifestyle.poster} posterSrcSet={solarLifestyle.posterSrcSet} video={calm?undefined:solarLifestyle.video} mobileVideo={solarLifestyle.mobileVideo} alt={solarLifestyle.alt} enabled={!paused&&!calm&&!ended} mask="none" loop={false} replayKey={replayKey} onEnded={()=>setEnded(true)} onPlaybackBlocked={()=>setPaused(true)} onMediaError={()=>setFailed(true)}/>
  </div>
  {!calm&&!failed&&<button className="solar-motion-pause" type="button" aria-controls={id} aria-pressed={ended?undefined:paused} onClick={()=>{if(ended){setEnded(false);setPaused(false);setReplayKey(replayKey+1)}else setPaused(!paused)}}>{ended?'Volver a ver':paused?'Reanudar paseo':'Pausar paseo'}</button>}
 </div>
}
