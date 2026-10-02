'use client';

import {useLayoutEffect,useRef,useState} from 'react';
import {Dialog} from '@base-ui/react/dialog';
import gsap from 'gsap';
import {CustomEase} from 'gsap/CustomEase';
import {DotMorphLabel} from '@/components/story/DotMorphLabel';
import {EvaWordmark} from '@/components/story/EvaWordmark';

export type KineticNavigationLink={label:string;href:string};
type PanelProps={open:boolean;links:KineticNavigationLink[];onExit:()=>void;onNavigate:()=>void};

function MenuMark(){return <span className="kinetic-menu-mark" aria-hidden="true"/>}

function AmbientShapes({active}:{active:number|null}){
 const root=useRef<HTMLDivElement>(null);
 useLayoutEffect(()=>{
  if(active===null||!root.current||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const ctx=gsap.context(()=>{
   gsap.fromTo(root.current!.querySelectorAll(`[data-shape="${active%4}"] .kinetic-shape-element`),
    {scale:.65,rotation:-8,opacity:0,transformOrigin:'50% 50%'},
    {scale:1,rotation:0,opacity:1,duration:.55,stagger:.055,ease:'power3.out'});
  },root);
  return()=>ctx.revert();
 },[active]);
 return <div ref={root} className="kinetic-ambient" aria-hidden="true">
  <svg data-shape="0" data-active={active!==null&&active%4===0} viewBox="0 0 400 400"><circle className="kinetic-shape-element" cx="80" cy="120" r="40"/><circle className="kinetic-shape-element" cx="300" cy="80" r="60"/><circle className="kinetic-shape-element" cx="200" cy="300" r="80"/></svg>
  <svg data-shape="1" data-active={active!==null&&active%4===1} viewBox="0 0 400 400" fill="none"><path className="kinetic-shape-element" d="M0 200 Q100 100 200 200 T400 200" strokeWidth="48"/><path className="kinetic-shape-element" d="M0 280 Q100 180 200 280 T400 280" strokeWidth="28"/></svg>
  <svg data-shape="2" data-active={active!==null&&active%4===2} viewBox="0 0 400 400">{Array.from({length:16},(_,i)=><circle key={i} className="kinetic-shape-element" cx={45+i%4*100} cy={45+Math.floor(i/4)*100} r={[5,9,13,7][(i+Math.floor(i/4))%4]}/>)}</svg>
  <svg data-shape="3" data-active={active!==null&&active%4===3} viewBox="0 0 400 400"><path className="kinetic-shape-element" d="M100 100 Q150 50 200 100 Q250 150 200 200 Q150 250 100 200 Q50 150 100 100"/><path className="kinetic-shape-element" d="M250 200 Q300 150 350 200 Q400 250 350 300 Q300 350 250 300 Q200 250 250 200"/></svg>
 </div>;
}

function KineticPanel({open,links,onExit,onNavigate}:PanelProps){
 const root=useRef<HTMLDivElement>(null),timeline=useRef<gsap.core.Timeline|null>(null);
 const exit=useRef(onExit),currentOpen=useRef(open);
 exit.current=onExit;currentOpen.current=open;
 const [active,setActive]=useState<number|null>(null);
 useLayoutEffect(()=>{
  if(!root.current)return;
  gsap.registerPlugin(CustomEase);
  CustomEase.create('eva-navigation','0.65, 0.01, 0.05, 0.99');
  const ctx=gsap.context(()=>{
   timeline.current=gsap.timeline({paused:true,defaults:{ease:'eva-navigation'},onReverseComplete:()=>{if(!currentOpen.current)exit.current()}})
    .fromTo('.kinetic-backdrop-layer',{xPercent:101},{xPercent:0,duration:.58,stagger:.09},0)
    .fromTo('.kinetic-link-motion',{yPercent:130,rotate:6},{yPercent:0,rotate:0,duration:.55,stagger:.055},.25)
    .fromTo('.kinetic-panel-head,.kinetic-panel-note',{opacity:0,y:12},{opacity:1,y:0,duration:.35,stagger:.04},.35);
  },root);
  return()=>{ctx.revert();timeline.current=null};
 },[]);
 useLayoutEffect(()=>{
  const tl=timeline.current;if(!tl)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const update=()=>{
   if(reduced.matches){tl.pause().progress(open?1:0);if(!open)exit.current();return}
   if(open)tl.timeScale(1).play();
   else if(tl.time()===0)exit.current();
   else tl.timeScale(1.5).reverse();
  };
  update();reduced.addEventListener('change',update);
  return()=>reduced.removeEventListener('change',update);
 },[open]);
 const resetActive=(root:HTMLElement)=>{
  const focused=Array.from(root.querySelectorAll('a')).findIndex(link=>link.matches(':focus-visible'));
  setActive(focused<0?null:focused);
 };
 return <Dialog.Popup ref={root} className="kinetic-panel" data-open={open}>
  <Dialog.Title className="sr-only">Navegación de EVA</Dialog.Title>
  <div className="kinetic-panel-layers" aria-hidden="true"><div className="kinetic-backdrop-layer kinetic-layer-first"/><div className="kinetic-backdrop-layer kinetic-layer-second"/><div className="kinetic-backdrop-layer kinetic-layer-paper"/></div>
  <div className="kinetic-panel-content">
   <div className="kinetic-panel-head"><EvaWordmark/><Dialog.Close className="kinetic-toggle kinetic-close"><span>Cerrar</span><MenuMark/></Dialog.Close></div>
   <div className="kinetic-menu-body">
    <AmbientShapes active={active}/>
    <nav aria-label="EVA Health" onPointerLeave={event=>resetActive(event.currentTarget)} onBlur={event=>{if(!event.currentTarget.contains(event.relatedTarget))setActive(null)}}>
     <ul className="kinetic-menu-list">{links.map(({label,href},index)=><li key={href}>
      <div className="kinetic-link-motion"><a className="kinetic-nav-link" href={href} onClick={onNavigate}
       onPointerEnter={event=>{if(event.pointerType==='mouse')setActive(index)}}
       onFocus={event=>{if(event.currentTarget.matches(':focus-visible'))setActive(index)}}>
       <span className="kinetic-link-hover" aria-hidden="true"/><DotMorphLabel>{label}</DotMorphLabel>
      </a></div>
     </li>)}</ul>
    </nav>
   </div>
   <p className="kinetic-panel-note">Conoce tu cuerpo.<br/><span>Vive a tu ritmo.</span></p>
  </div>
 </Dialog.Popup>;
}

/** EVA adaptation of the supplied Sterling Gate kinetic navigation. */
export function KineticNavigation({links}:{links:KineticNavigationLink[]}){
 const [open,setOpen]=useState(false);
 const actions=useRef<Dialog.Root.Actions|null>(null);
 return <Dialog.Root open={open} actionsRef={actions} onOpenChange={(next,details)=>{if(!next)details.preventUnmountOnClose();setOpen(next)}}>
  <Dialog.Trigger className="kinetic-toggle kinetic-trigger"><span className="kinetic-button-text" aria-hidden="true"><span>Menú</span><span>Cerrar</span></span><span className="sr-only">Menú</span><MenuMark/></Dialog.Trigger>
  <Dialog.Portal>
   <Dialog.Backdrop className="kinetic-backdrop"/>
   <KineticPanel open={open} links={links} onExit={()=>actions.current?.unmount()} onNavigate={()=>actions.current?.close()}/>
  </Dialog.Portal>
 </Dialog.Root>;
}

export {KineticNavigation as Component};
