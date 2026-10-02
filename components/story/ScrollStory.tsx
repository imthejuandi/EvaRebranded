'use client';
import {EvaWordmark} from '@/components/story/EvaWordmark';
import {AnalogType} from './AnalogType';
import {HeroKitCta} from './HeroKitCta';
import {HeroIntro} from './HeroIntro';
import {Arrow} from './Arrow';
import {Player,type PlayerRef} from '@remotion/player';
import {memo,useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {EvaFilm,DURATION} from './EvaFilm';
import {HealthEditorial} from './HealthEditorial';
import {BusinessOffer} from './BusinessOffer';
import {BusinessNavigation} from './BusinessNavigation';
import {DotMorphLabel} from './DotMorphLabel';
import {BusinessFooter} from './BusinessFooter';
import {businessLinks} from '@/lib/landing-content';
import {glowRunner} from '@/lib/design';
import {SignalPassage} from './SignalPassage';
import {storyMotion} from '@/lib/story-motion';
import {createStoryScrollDriver} from '@/lib/story-scroll-driver';
const EditorialContent=memo(HealthEditorial),OfferContent=memo(BusinessOffer),SignalContent=memo(SignalPassage);
export function ScrollStory(){
 const section=useRef<HTMLElement>(null),stage=useRef<HTMLDivElement>(null),player=useRef<PlayerRef>(null),heroCta=useRef<HTMLDivElement>(null);
 const [size,setSize]=useState<{width:number;height:number}|null>(null);const [frame,setFrame]=useState(0);const [calm,setCalm]=useState(false);const [runnerPaused,setRunnerPaused]=useState(false);
 const entrance=useRef<HTMLElement>(null);
 const scrollDriver=useMemo(()=>createStoryScrollDriver(),[]);
 const [entry,setEntry]=useState<'pending'|'watching'|'reveal'|'skip'>('pending');
 const reveal=useCallback(()=>setEntry(current=>current==='skip'?'skip':'reveal'),[]);
 const skipEntry=useCallback(()=>{if(entrance.current)entrance.current.dataset.heroEntrance='skip';setEntry('skip')},[]);
 const filmProps=useMemo(()=>({scrollDriver,ambientRunner:!runnerPaused,onRunnerBlocked:()=>{setRunnerPaused(true);skipEntry()},onSignalsReady:reveal,signalsImmediate:entry==='skip',arrivalEnabled:entry!=='skip',onArrivalUnavailable:skipEntry}),[scrollDriver,runnerPaused,reveal,skipEntry,entry==='skip']);
 useEffect(()=>{
  const restored=()=>{if(window.scrollY>24||location.hash)skipEntry()};
  if(matchMedia('(prefers-reduced-motion: reduce)').matches||window.scrollY>24||location.hash||entrance.current?.contains(document.activeElement)){skipEntry();return}
  setEntry(current=>current==='pending'?'watching':current);
  const key=(event:KeyboardEvent)=>{if(['Tab','Enter','Escape',' ','ArrowDown','PageDown','End'].includes(event.key))skipEntry()};
  window.addEventListener('scroll',restored,{passive:true});window.addEventListener('pageshow',restored);window.addEventListener('keydown',key,true);
  // A failed media/player mount must never leave the site's navigation hidden.
  const failOpen=window.setTimeout(()=>{if(['pending','watching'].includes(entrance.current?.dataset.heroEntrance??''))skipEntry()},12000);
  return()=>{clearTimeout(failOpen);window.removeEventListener('scroll',restored);window.removeEventListener('pageshow',restored);window.removeEventListener('keydown',key,true)};
 },[skipEntry]);
 useEffect(()=>{const mq=matchMedia('(prefers-reduced-motion: reduce)');setCalm(mq.matches);const change=()=>setCalm(mq.matches);mq.addEventListener('change',change);return()=>mq.removeEventListener('change',change)},[]);
 useEffect(()=>{if(calm||!stage.current)return;const el=stage.current;const measure=()=>{const width=Math.round(el.clientWidth),height=Math.round(el.clientHeight);if(width&&height)setSize(previous=>previous?.width===width&&previous.height===height?previous:{width,height})};const ro=new ResizeObserver(measure);ro.observe(el);measure();return()=>ro.disconnect()},[calm]);
 useEffect(()=>{if(calm||!size||!section.current||!stage.current)return;let raf=0,last=-1,lastChrome='',journeyTop=0,journeySpan=1;const measure=()=>{if(!section.current||!stage.current)return;journeyTop=section.current.getBoundingClientRect().top+window.scrollY;journeySpan=Math.max(1,section.current.offsetHeight-stage.current.clientHeight)};measure();const update=()=>{raf=0;if(document.visibilityState!=='visible'||!section.current||!stage.current)return;const p=Math.max(0,Math.min(1,(window.scrollY-journeyTop)/journeySpan));const f=p*(DURATION-1);if(f!==last){scrollDriver.setFrame(f);
 const slot=heroCta.current;if(slot){const fade=Math.max(0,Math.min(1,(f-20)/70)),hidden=fade>=1;if(slot.dataset.scrollCompositor!=='true'){slot.style.opacity=String(1-fade);slot.style.transform=`translateY(${fade*14}px)`}slot.style.visibility=hidden?'hidden':'visible';slot.inert=hidden;slot.setAttribute('aria-hidden',String(hidden))}
 const m=storyMotion(f),h=size.height,small=size.width<=700;
 const chrome=[m.lightAt(50/h),m.lightAt(1-(small?45:50)/h),m.lightAt(1-((small?75:41)+(f<200?22:5))/h),f<200,f<30,f<230?0:f<490?1:f<715?2:3].join('/');
 if(chrome!==lastChrome){lastChrome=chrome;setFrame(f)};last=f}};const schedule=()=>{if(!raf)raf=requestAnimationFrame(update)};window.addEventListener('scroll',schedule,{passive:true});document.addEventListener('visibilitychange',schedule);schedule();return()=>{window.removeEventListener('scroll',schedule);document.removeEventListener('visibilitychange',schedule);cancelAnimationFrame(raf)}},[size,calm,scrollDriver]);
 const jump=(f:number)=>{if(!section.current||!stage.current)return;window.scrollTo({top:section.current.offsetTop+(section.current.offsetHeight-stage.current.clientHeight)*f/(DURATION-1),behavior:'instant'})};
 const motion=storyMotion(frame),height=size?.height??900;
 const mobile=(size?.width??1440)<=700;
 const headerLight=motion.lightAt(50/height),navLight=motion.lightAt(1-(mobile?45:50)/height),noteLight=motion.lightAt(1-((mobile?75:41)+(frame<200?22:5))/height);
 const chapter=frame<230?0:frame<490?1:frame<715?2:3;
 useEffect(()=>{const ctx=(document as Document&{modelContext?:{registerTool:(tool:unknown,opts:unknown)=>unknown}}).modelContext;if(!ctx)return;const lifecycle=new AbortController();const register=(tool:unknown)=>{try{Promise.resolve(ctx.registerTool(tool,{signal:lifecycle.signal})).catch(()=>{})}catch{}};register({name:'read_eva_story',description:'Read the current EVA chapter, native scroll position and rendered Remotion frame.',inputSchema:{type:'object',properties:{},additionalProperties:false},annotations:{readOnlyHint:true},execute:()=>({frame:Number(document.querySelector('[data-rendered-frame]')?.getAttribute('data-rendered-frame')??0),scrollY:window.scrollY,reducedMotion:!document.querySelector('.scroll-journey')})});register({name:'navigate_eva_chapter',description:'Navigate using the same four chapter controls visible below the EVA motion story.',inputSchema:{type:'object',properties:{chapter:{type:'integer',minimum:1,maximum:4}},required:['chapter'],additionalProperties:false},annotations:{readOnlyHint:false},execute:async(input:{chapter:number})=>{if(!Number.isInteger(input.chapter)||input.chapter<1||input.chapter>4)throw new Error('Chapter must be an integer from 1 to 4.');if(!section.current||!stage.current)throw new Error('Motion is reduced. Use the visible narrative.');jump([0,325,560,810][input.chapter-1]);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));return{chapter:input.chapter,frame:Number(document.querySelector('[data-rendered-frame]')?.getAttribute('data-rendered-frame'))}}});return()=>lifecycle.abort()},[calm]);
 return <main ref={entrance} className="hero-entrance" data-hero-entrance={calm?'skip':entry} onFocusCapture={skipEntry}><noscript><style>{'.hero-entrance [data-hero-reveal]{opacity:1!important;transform:none!important;animation:none!important;pointer-events:auto!important}.hero-entrance [data-hero-reveal] *{pointer-events:auto!important}'}</style></noscript><a className="skip" href="#empezar">Ver planes y empezar</a><header data-hero-reveal="navigation" className={'masthead '+(headerLight&&!calm?'ink':'')}><EvaWordmark/><div className="header-actions"><button className="header-language" type="button" aria-disabled="true" title="English estará disponible en la siguiente etapa" aria-label="English, próximamente"><DotMorphLabel>EN</DotMorphLabel></button><a className="join" href={businessLinks.signup} aria-label="Empieza con EVA">Empieza </a><BusinessNavigation/></div></header>
 {!calm?<section className="scroll-journey" ref={section} aria-label="La experiencia EVA"><div className="stage" ref={stage}><div aria-hidden="true" className="film">{size?<Player ref={player} component={EvaFilm} inputProps={filmProps} compositionWidth={size.width} compositionHeight={size.height} durationInFrames={DURATION} fps={30} autoPlay={false} loop={false} controls={false} clickToPlay={false} doubleClickToFullscreen={false} spaceKeyToPlayOrPause={false} allowFullscreen={false} moveToBeginningWhenEnded={false} initiallyMuted browserMediaControlsBehavior={{mode:'prevent-media-session'}} style={{width:'100%',height:'100%',pointerEvents:'none'}}/>:<div className="poster"><img className="hero-runner-static" src={glowRunner.poster} alt="" fetchPriority="high" decoding="async"/><div data-hero-reveal="headline" className="poster-title hero-static-title"><HeroIntro width={640} height={256} style={{position:'absolute',left:'var(--gutter)',top:'var(--hero-intro-top)',width:'calc(var(--hero-intro-size)*4.6)',height:'var(--hero-intro-height)',fontSize:'var(--hero-intro-size)'}}/><AnalogType text="salud." width={640} height={256} style={{position:'absolute',right:'var(--gutter)',top:'var(--hero-salud-top)',width:'var(--hero-salud-width)',height:'auto',aspectRatio:'5 / 2'}}/></div><p data-hero-reveal="support" className="hero-support hero-static-support">Para lo que disfrutas.<br/>Y lo que está por venir.</p></div>}</div><div className="hero-kit-slot" ref={heroCta}><div data-hero-reveal="action"><HeroKitCta/></div></div><nav data-hero-reveal="controls" aria-label="Capítulos de la experiencia" className={'chapter-nav '+(navLight?'ink':'')}>{['Vivir','Conocer','Entender','Seguir'].map((n,i)=><button key={n} onClick={()=>jump([0,325,560,810][i])} aria-current={chapter===i?'step':undefined}><small>0{i+1}</small><span>{n}</span><i style={{scale:`${chapter===i?1:.12} 1`}}/></button>)}</nav><div data-hero-reveal="controls" className={'stage-note '+(noteLight?'ink':'')}>{frame<200&&<button className="runner-pause" aria-pressed={runnerPaused} onClick={()=>setRunnerPaused(!runnerPaused)}>{runnerPaused?'Reanudar imagen':'Pausar imagen'}</button>}<span className="scroll-cue">{frame<30?'DESLIZA PARA DESCUBRIR':'TU VIDA · A TU RITMO'} <Arrow direction="down"/></span></div></div><div className="sr-only"><h1>Conoce tu salud.</h1><p>Ejemplo ilustrativo de resultados: ApoB y HbA1c óptimos; HsCRP fuera de rango.</p><p>Recogida de muestra en casa, análisis en laboratorio. 15 biomarcadores cada 90 días para entender tus resultados y seguir tu evolución.</p></div></section>:<section className="calm-hero"><img className="hero-runner-static" src={glowRunner.poster} alt="Figura corriendo, reinterpretada en luz ámbar y azul"/><h1 className="hero-static-title" aria-label="Conoce tu salud."><HeroIntro width={640} height={256} style={{position:'absolute',left:'var(--gutter)',top:'var(--hero-intro-top)',width:'calc(var(--hero-intro-size)*4.6)',height:'var(--hero-intro-height)',fontSize:'var(--hero-intro-size)'}}/><AnalogType text="salud." width={640} height={256} style={{position:'absolute',right:'var(--gutter)',top:'var(--hero-salud-top)',width:'var(--hero-salud-width)',height:'auto',aspectRatio:'5 / 2'}}/></h1><p className="hero-support hero-static-support">Para lo que disfrutas.<br/>Y lo que está por venir.</p><HeroKitCta/></section>}
 <SignalContent calm={calm}/>
 <EditorialContent calm={calm}/>
 <OfferContent/>
 <BusinessFooter calm={calm} onCalmChange={v=>{setCalm(v);window.scrollTo({top:0,behavior:'instant'})}}/>
 </main>
}
