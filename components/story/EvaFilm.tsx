import {AbsoluteFill,Img,staticFile,interpolate,useCurrentFrame,useVideoConfig,useRemotionEnvironment} from 'remotion';
import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {createStoryScrollPainter,type StoryScrollDriver} from '@/lib/story-scroll-driver';
import {installStoryScrollCompositor} from '@/lib/story-scroll-compositor';
import {TrackedRunner} from './TrackedRunner';
import type {SignalLanguage} from '@/lib/runner-signals';
import {AnalogType} from './AnalogType';
import {HeroIntro} from './HeroIntro';
import {heroLayout} from '@/lib/hero-layout';
import {storyMotion} from '@/lib/story-motion';
import {productHover} from '@/lib/product-motion';
export const DURATION=981;
const clamp={extrapolateLeft:'clamp',extrapolateRight:'clamp'} as const;
const range=(f:number,a:number,b:number,x:number,y:number)=>interpolate(f,[a,b],[x,y],clamp);
export function EvaFilm({ambientRunner=true,onRunnerBlocked,language='es',onSignalsReady,signalsImmediate=false,arrivalEnabled=false,onArrivalUnavailable,scrollDriver}:{ambientRunner?:boolean;onRunnerBlocked?:()=>void;language?:SignalLanguage;onSignalsReady?:()=>void;signalsImmediate?:boolean;arrivalEnabled?:boolean;onArrivalUnavailable?:()=>void;scrollDriver?:StoryScrollDriver}={}){
 const f=useCurrentFrame();const {width:w,height:h}=useVideoConfig();const environment=useRemotionEnvironment();const still=environment.isRendering||environment.isStudio;const mobile=w<=700;const pad=mobile?24:48;
 const nativeScroll=scrollDriver&&!still?scrollDriver:undefined;
 const root=useRef<HTMLDivElement>(null),nativePainter=useRef<ReturnType<typeof createStoryScrollPainter>|null>(null);
 const [runnerActive,setRunnerActive]=useState((nativeScroll?.current??f)<200);
 const renders=useRef(0);renders.current++;
 const travel=range(f,45,190,0,1);const runnerX=travel*w*1.05;const motion=storyMotion(f);
 const scene=f<230?'Vivir':f<490?'Conocer':f<715?'Entender':'Seguir';
 const track=useRef<HTMLDivElement>(null);const [overflow,setOverflow]=useState(w);useEffect(()=>{const el=track.current;if(!el)return;const measure=()=>setOverflow(Math.max(0,el.scrollWidth-(w-pad*2)));measure();const ro=new ResizeObserver(measure);ro.observe(el);return()=>ro.disconnect()},[w,pad]);
 const hover=productHover(f);
 const hero=heroLayout(w,h);
 useLayoutEffect(()=>{
  if(!nativeScroll||!root.current)return;
  const journey=root.current.closest<HTMLElement>('.scroll-journey');
  const compositor=journey?installStoryScrollCompositor(root.current,journey,{width:w,height:h,overflow,top:journey.getBoundingClientRect().top+window.scrollY,span:journey.offsetHeight-h}):null;
  const paint=createStoryScrollPainter(root.current,compositor?.owned);nativePainter.current=paint;
  root.current.dataset.scrollEngine=compositor?'compositor-timeline':'native-transforms';
  let heroActive=nativeScroll.current<200;
  const update=(value:number)=>{paint(value,w,h,overflow);const next=value<200;if(next!==heroActive){heroActive=next;setRunnerActive(next)}};
  update(nativeScroll.current);setRunnerActive(heroActive);
  const stop=nativeScroll.subscribe(update);
  return()=>{stop();compositor?.dispose();nativePainter.current=null};
 },[nativeScroll,w,h,overflow]);
 // Reapply the current pose after a coarse React state change or responsive resize.
 useLayoutEffect(()=>{if(nativeScroll)nativePainter.current?.(nativeScroll.current,w,h,overflow)});
 useEffect(()=>{
  if(still||!root.current)return;
  const images=Array.from(root.current.querySelectorAll<HTMLImageElement>('[data-motion-preload]'));
  for(const image of images){void image.decode().then(()=>{image.dataset.decodeState='ready'}).catch(()=>{})}
 },[still]);
 return <AbsoluteFill ref={root} data-film-renders={renders.current} data-scroll-engine={nativeScroll?'native-transforms':'remotion'} data-rendered-frame={f} data-scene={scene} style={{background:'#0b1010',color:'#f3f0e8',fontFamily:'Arial, Helvetica, sans-serif',overflow:'hidden'}}>
  <AbsoluteFill data-layer="human" style={{overflow:'hidden',translate:`0 ${motion.humanY*h}px`,visibility:Math.abs(motion.humanY)>=1?'hidden':'visible',willChange:Math.abs(motion.humanY)<1?'translate':'auto'}}>
   <div data-layer="runner-plane" style={{position:'absolute',left:'50%',top:hero.runnerTop,width:hero.runnerWidth,height:hero.runnerHeight,translate:`calc(-50% + ${runnerX}px) 0`,scale:1+travel*.08,willChange:f<200?'translate, scale':'auto'}}><TrackedRunner width={hero.runnerWidth} height={hero.runnerHeight} viewportWidth={w} viewportHeight={h} top={hero.runnerTop} saludTop={hero.saludTop} enabled={ambientRunner} active={nativeScroll?runnerActive:f<200} language={language} onPlaybackBlocked={onRunnerBlocked} onSignalsReady={onSignalsReady} signalsImmediate={signalsImmediate} arrivalEnabled={arrivalEnabled} onArrivalUnavailable={onArrivalUnavailable}/></div>
   <div data-hero-reveal="headline" style={{position:'absolute',inset:0,pointerEvents:'none'}}><HeroIntro width={hero.introWidth} height={hero.introHeight} style={{position:'absolute',left:pad,top:hero.introTop,translate:`${range(f,45,160,0,-w*1.05)}px 0`}}/>
   <ScrollSalud scrollDriver={nativeScroll} text="salud." frame={Math.min(f,160)} width={hero.saludWidth} height={hero.saludHeight} style={{position:'absolute',right:pad,top:hero.saludTop,translate:`${range(f,45,160,0,w*1.05)}px 0`}}/>
   {!mobile&&<p className="hero-support" data-hero-support style={{position:'absolute',left:pad,top:hero.supportTop,opacity:range(f,20,100,1,0)}}>Para lo que disfrutas.<br/>Y lo que está por venir.</p>}</div>
  </AbsoluteFill>
  <AbsoluteFill data-layer="product-scene" style={{background:'#f3f0e8',color:'#171b18',overflow:'hidden',translate:`0 ${motion.productY*h}px`,visibility:Math.abs(motion.productY)>=1?'hidden':'visible',willChange:Math.abs(motion.productY)<1?'translate':'auto'}}>
   <div data-layer="product" data-hover={hover.toFixed(3)} style={{position:'absolute',left:mobile?'50%':'58%',top:'48%',width:mobile?Math.min(w*.96,h*.48):Math.min(w*.53,h*.85),aspectRatio:'1',transform:`translate(-50%, calc(-50% + ${hover}px))`}}><Img data-motion-preload="product" src={staticFile("art/tasso-plus-glow-v1.webp")} loading="eager" decoding="async" style={{width:'100%',height:'100%',objectFit:'contain',maskImage:'radial-gradient(ellipse closest-side, black 76%, transparent 100%)'}}/></div>
   <div style={{position:'absolute',zIndex:1,top:mobile?'15%':'17%',left:pad,fontSize:mobile?Math.min(w*.11,48):w*.073,lineHeight:.94,letterSpacing:'-.06em'}}>Un pequeño<br/><span style={{fontFamily:'Georgia,serif',fontStyle:'italic',fontWeight:400}}>gesto.</span></div>
   <div style={{position:'absolute',right:pad,bottom:mobile?135:110,width:mobile?w-48:250}}><p style={{fontSize:11,letterSpacing:'.13em',marginBottom:10}}>01 / RECOGIDA CON TASSO+</p><p style={{fontSize:mobile?18:22,lineHeight:1.3}}>Recogida de muestra en casa, análisis en laboratorio acreditado.</p></div>
  </AbsoluteFill>
  <AbsoluteFill data-layer="insight-scene" style={{background:'#e9a067',color:'#22271f',overflow:'hidden',translate:`0 ${motion.insightY*h}px`,visibility:Math.abs(motion.insightY)>=1?'hidden':'visible',willChange:Math.abs(motion.insightY)<1?'translate':'auto'}}>
   <div style={{position:'absolute',top:mobile?'19%':'16%',left:pad,fontSize:mobile?51:w*.072,letterSpacing:'-.065em',lineHeight:.98}}>Tus datos.<br/><span style={{fontFamily:'Georgia,serif',fontStyle:'italic'}}>Con contexto.</span></div>
   <div ref={track} data-layer="insight-track" data-overflow={overflow} style={{position:'absolute',left:pad,top:mobile?'46%':'47%',display:'flex',gap:pad,width:'max-content',translate:`${-range(f,590,635,0,overflow)}px 0`}}>
    <div style={{width:w-pad*2,display:'flex',alignItems:'center',gap:mobile?22:55}}><span style={{fontSize:mobile?Math.min(w*.37,155):w*.22,letterSpacing:'-.08em',lineHeight:.8}}>15</span><span style={{fontSize:mobile?22:35,maxWidth:240,lineHeight:1.05}}>biomarcadores.<br/>Cada<br/>90 días.</span></div>
    <div style={{width:w-pad*2,fontSize:mobile?25:42,lineHeight:1.12}}>Tus resultados, explicados.<br/><span style={{fontFamily:'Georgia,serif',fontStyle:'italic'}}>Tu evolución, en perspectiva.</span><p style={{fontSize:mobile?16:18,lineHeight:1.4,maxWidth:420,marginTop:25}}>Compara tus lecturas a lo largo del tiempo y observa cómo cambian tus biomarcadores.</p></div>
   </div>
  </AbsoluteFill>
  <AbsoluteFill data-layer="return-to-life" style={{background:'#0b1010',overflow:'hidden',translate:`0 ${motion.lifeY*h}px`,visibility:Math.abs(motion.lifeY)>=1?'hidden':'visible',willChange:Math.abs(motion.lifeY)<1?'translate':'auto'}}>
   <Img data-motion="return-image" data-motion-preload="return" src={staticFile("art/stretch.jpg")} loading="eager" decoding="async" style={{position:'absolute',height:'100%',width:mobile?'100%':'60%',left:mobile?'0':'22%',objectFit:'cover',maskImage:'radial-gradient(ellipse,black 15%,transparent 74%)',scale:range(f,710,840,1.18,1)}}/>
   <div data-motion="return-title" style={{position:'absolute',left:pad,top:mobile?'27%':'26%',fontSize:mobile?w*.18:w*.115,letterSpacing:'-.07em',lineHeight:.97,translate:`0 ${range(f,735,800,60,0)}px`}}>Y volver<br/><span style={{fontFamily:'Georgia,serif',fontStyle:'italic'}}>a la vida.</span></div>
   <p style={{position:'absolute',right:pad,bottom:mobile?135:110,fontSize:mobile?18:23,lineHeight:1.3,maxWidth:mobile?230:310}}>Cuidarte también es hacer<br/>espacio para lo que disfrutas.</p>
  </AbsoluteFill>
 </AbsoluteFill>
}

/** Keep the analog microletters alive without rerendering all four scenes on each scroll tick. */
function ScrollSalud({scrollDriver,...props}:Parameters<typeof AnalogType>[0]&{scrollDriver?:StoryScrollDriver}){
 const [scanFrame,setScanFrame]=useState(0);
 useEffect(()=>{
  if(!scrollDriver)return;
  let previous=-1;
  const update=(frame:number)=>{const next=Math.floor(Math.min(frame,160)/9)*9;if(next!==previous){previous=next;setScanFrame(next)}};
  update(scrollDriver.current);return scrollDriver.subscribe(update);
 },[scrollDriver]);
 return <AnalogType {...props} frame={scrollDriver?scanFrame:props.frame}/>;
}
