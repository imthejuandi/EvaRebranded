'use client';

import {useEffect, useRef, useState} from 'react';
import {DotNumber} from '@/components/story/DotNumber';
import type {PlanId} from './ServiceCalendar';
import './rhythm-theatre.css';

const chapters=[{month:'00',title:'Conocer.',body:'Una primera lectura. Tu punto de partida.'},{month:'03',title:'Comparar.',body:'Una nueva fecha para mirar tus resultados juntos.'},{month:'06',title:'Entender.',body:'Volver a las preguntas que te importan.'},{month:'09',title:'Continuar.',body:'Hacerle un espacio a tu salud, a tu ritmo.'}];

/** Scroll-to-chapter mapping and direct chapter navigation adapted from
 * minhxthanh Interactive Scrolling Story (21st.dev, retrieved component6265).
 * The nested scroller is replaced by GSAP document progress; no hidden mobile art.
 * Original EVA choreography. SAVEE Pentagram scXd_4O: a photographic world
 * held inside a translucent capsule. Here that material becomes four dated
 * folios, rather than repeating the homepage's sphere or running figure. */
export function RhythmTheatre({plan}:{plan:PlanId}){
 const root=useRef<HTMLElement>(null),progress=useRef(0);const [chapter,setChapter]=useState(0);
 useEffect(()=>{
  let dispose=()=>{},cancelled=false;
  void Promise.all([import('gsap'),import('gsap/ScrollTrigger')]).then(([g,s])=>{
   if(cancelled||!root.current)return;const gsap=g.gsap,ScrollTrigger=s.ScrollTrigger;gsap.registerPlugin(ScrollTrigger);
   const media=gsap.matchMedia();
   media.add('(prefers-reduced-motion: no-preference)',()=>{
    const node=root.current!;node.dataset.enhanced='true';
    const trigger=ScrollTrigger.create({trigger:node,start:'top 88px',end:'bottom bottom',scrub:true,onUpdate:self=>{
     progress.current=self.progress;node.style.setProperty('--rhythm-progress',String(self.progress));node.dataset.progress=self.progress.toFixed(3);setChapter(Math.min(3,Math.floor(self.progress*4)));
    }});
    return()=>{trigger.kill();node.dataset.enhanced='false';node.style.removeProperty('--rhythm-progress');};
   });
   dispose=()=>media.revert();
  });
  return()=>{cancelled=true;dispose();};
 },[]);
 const single=plan!=='quarterly';
 const title=single?(plan==='free'?'Lo que ya sabes, en un solo lugar.':'Una lectura con más perspectiva.'):chapters[chapter].title;
 return <section ref={root} className="rhythm-theatre" data-plan={plan} aria-label="El ritmo de tus lecturas" data-progress="0">
  <div className="rhythm-theatre-stage">
   <div className="rhythm-theatre-heading"><p>EL TIEMPO TAMBIÉN CUENTA</p><h2>{title}</h2><p className="rhythm-theatre-description">{single?(plan==='free'?'Reúne los resultados de una analítica que ya tienes.':'Explora el panel y consulta el alcance de la extracción en laboratorio.'):chapters[chapter].body}</p></div>
   <div className="rhythm-photo"><img src="/art/editorial/after-the-morning-1024.webp" width="864" height="576" alt="Una pausa en casa después de entrenar." loading="lazy" decoding="async"/><span>ENTRE UNA LECTURA Y LA SIGUIENTE,<br/>TU VIDA.</span></div>
   <div className="rhythm-folio-space" aria-hidden="true">{chapters.slice(0,single?1:4).map((item,i)=><div className="rhythm-folio" key={item.month} data-index={i} data-current={single||chapter===i} style={{'--folio-index':i} as React.CSSProperties}><div className="rhythm-folio-bezel"><span>eva <i>LECTURA {String(i+1).padStart(2,'0')}</i></span><div className="rhythm-folio-number"><DotNumber value={String(i+1).padStart(2,'0')} calm density="coarse"/></div><div className="rhythm-folio-field">{Array.from({length:8},(_,row)=><span key={row} style={{'--row':row} as React.CSSProperties}/>)}</div><p>{single?plan==='free'?'TU INFORME':'EN LABORATORIO':`MES ${item.month}`}</p></div></div>)}</div>
   <div className="rhythm-theatre-timeline" aria-label="Cadencia de las lecturas">{(single?chapters.slice(0,1):chapters).map((item,i)=><button type="button" aria-current={chapter===i?'step':undefined} key={item.month} onClick={()=>{const node=root.current;if(!node)return;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;if(reduced){setChapter(i);return;}const top=node.getBoundingClientRect().top+scrollY-88;window.scrollTo({top:top+(node.offsetHeight-innerHeight+88)*((i+.25)/4),behavior:'smooth'});}}><span>{single?'01':item.month}</span>{single?'Tu lectura':i===0?'Punto de partida':`A los ${Number(item.month)} meses`}</button>)}</div>
   <p className="rhythm-theatre-note">{single?'Recorrido ilustrativo.': 'Cuatro muestras, separadas por tres meses. Fechas ilustrativas.'}<span>Desliza para recorrer <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v13m-5-5 5 5 5-5" fill="none" stroke="currentColor"/></svg></span></p>
  </div>
 </section>;
}
