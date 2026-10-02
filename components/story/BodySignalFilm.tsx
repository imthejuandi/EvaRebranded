import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {bodySignalState,bodyTitleTravel} from '@/lib/body-signal';
import {signalLabels} from '@/lib/analog-motion';
import {BodySignalCanvas} from './BodySignalCanvas';
import {bodyPlayback,BODY_PLAYBACK_DURATION} from '@/lib/body-signal-playback';
const descriptions=['Tu punto de partida para comparar futuras lecturas.','Repite la recogida y compara tus resultados con los anteriores.','Observa tu evolución junto a tus hábitos y cómo te encuentras.'];
const ease=(n:number)=>{const t=Math.max(0,Math.min(1,n));return t*t*(3-2*t)};
export function BodySignalFilm({autoplaySequence=false,ambientActive=false,sequenceComplete=false}:{autoplaySequence?:boolean;ambientActive?:boolean;sequenceComplete?:boolean}={}){
 const playerFrame=useCurrentFrame(),{width,height}=useVideoConfig(),mobile=width<700,pad=mobile?24:48;
 const frame=autoplaySequence&&sequenceComplete?BODY_PLAYBACK_DURATION-1:playerFrame;
 const playback=autoplaySequence?bodyPlayback(frame):null;
 const narrative=playback?.narrative??frame;
 const state=bodySignalState(narrative,width,height,playback??{}),numberChapter=Math.max(0,state.chapter-1);
 const introFont=mobile?Math.min(width*.109,height*.059):width*.047,titleHeight=introFont*3.18;
 
 const titleTravel=bodyTitleTravel(narrative);
 const textShadow='0 1px 2px #0b1010, 0 0 5px #0b1010';
 return <AbsoluteFill data-body-signal-frame={frame} data-body-signal-phase={state.orb===1?'orb':state.phase} data-body-resolve={state.resolve.toFixed(3)} style={{background:'#0b1010',color:'#f3f0e8',fontFamily:'Arial,Helvetica,sans-serif',overflow:'hidden'}}>
  <div style={{position:'absolute',zIndex:1,textShadow,top:mobile?36:48,left:pad,right:pad,display:'flex',justifyContent:'space-between',gap:20,borderTop:'1px solid #f3f0e838',paddingTop:17,fontSize:mobile?11:12,letterSpacing:'.1em'}}><span>UNA SEÑAL PARA CONOCERTE</span><span>0{state.chapter+1} / 04</span></div>
  <div style={{position:'absolute',zIndex:1,textShadow,left:pad,top:mobile?'15%':'26%',width:mobile?width-pad*2:width*.43,height:titleHeight}}>
   <div style={{position:'absolute',inset:0,translate:`0 ${-18*titleTravel}px`,opacity:1-ease(titleTravel/.45),fontSize:introFont,letterSpacing:'-.055em',lineHeight:1.03}}>Entiende mejor<br/>las señales<br/><span style={{fontFamily:'Georgia,serif',fontStyle:'italic'}}>de tu cuerpo.</span></div>
   <div style={{position:'absolute',inset:0,translate:`0 ${18*(1-titleTravel)}px`,opacity:ease((titleTravel-.55)/.45),fontSize:mobile?Math.min(width*.117,height*.065):width*.057,letterSpacing:'-.055em',lineHeight:1.03}}>De los datos.<br/><span style={{fontFamily:'Georgia,serif',fontStyle:'italic'}}>A tu vida.</span></div>
  </div>
  <BodySignalCanvas state={state} ambient={autoplaySequence&&frame>=BODY_PLAYBACK_DURATION-1} active={ambientActive}/>
  <div style={{position:'absolute',zIndex:1,textShadow,left:pad,top:mobile?undefined:'64%',bottom:mobile?(autoplaySequence?158:106):undefined,maxWidth:mobile?width-48:310}}>
   <p style={{fontSize:mobile?23:28,letterSpacing:'-.03em',marginBottom:13}}>{state.phase==='data'?signalLabels[numberChapter]:'Tu cuerpo cambia.'}</p>
   <p style={{fontSize:16,lineHeight:1.5,maxWidth:300,color:'#bec4bb'}}>{state.phase==='data'?descriptions[numberChapter]:'Tus biomarcadores ayudan a observar esos cambios.'}</p>
  </div>
 </AbsoluteFill>;
}
