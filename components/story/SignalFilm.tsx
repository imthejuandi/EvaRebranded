import {AbsoluteFill,useCurrentFrame,useVideoConfig} from 'remotion';
import {signalState,signalLabels} from '@/lib/analog-motion';
const descriptions=['Una mirada a lo que pasa dentro de ti.','Vuelve a conocerte. Observa cómo cambias.','Los datos son el principio. Tú decides cómo seguir.'];
export function SignalFilm(){
 const frame=useCurrentFrame(),{width,height}=useVideoConfig(),mobile=width<700;
 const {points,phase,chapter}=signalState(frame),pad=mobile?24:48;
 return <AbsoluteFill data-signal-frame={frame} data-signal-phase={phase.toFixed(3)} style={{background:'#f3f0e8',color:'#0b1010',fontFamily:'Arial,Helvetica,sans-serif'}}>
  <div style={{position:'absolute',top:mobile?36:48,left:pad,right:pad,display:'flex',justifyContent:'space-between',borderTop:'1px solid #0b101035',paddingTop:17,fontSize:12,letterSpacing:'.1em'}}><span>UNA SEÑAL PARA CONOCERTE</span><span>0{chapter+1} / 03</span></div>
  <div style={{position:'absolute',left:pad,top:mobile?'16%':'26%',fontSize:mobile?Math.min(width*.117,height*.065):width*.057,letterSpacing:'-.055em',lineHeight:1.03}}>De los datos.<br/><span style={{fontFamily:'Georgia,serif',fontStyle:'italic'}}>A tu vida.</span></div>
  <svg data-dot-matrix="true" viewBox="-1.5 -1.5 13 11" style={{position:'absolute',width:mobile?width*.91:width*.54,height:mobile?height*.33:height*.73,left:mobile?'4.5%':'45%',top:mobile?'32%':'15%',overflow:'visible'}} aria-hidden="true">
   {points.map((p,i)=><circle key={'grid'+i} cx={p.x} cy={p.y} r=".027" fill="#0b1010" opacity=".16"/>)}
   {points.map((p,i)=><circle data-dot-lamp="true" key={i} cx={p.x} cy={p.y} r={p.r} fill="#0b1010"/>)}
  </svg>
  <div data-signal-copy="true" style={{position:'absolute',left:pad,top:mobile?undefined:'64%',bottom:mobile?106:undefined,maxWidth:mobile?width-48:300}}><p style={{fontSize:mobile?23:28,letterSpacing:'-.03em',marginBottom:13}}>{signalLabels[chapter]}</p><p style={{fontSize:16,lineHeight:1.5,maxWidth:290,color:'#555d54'}}>{descriptions[chapter]}</p></div>
 </AbsoluteFill>
}
