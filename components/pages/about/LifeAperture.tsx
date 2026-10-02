'use client';

import {useEffect,useRef,type ReactNode} from 'react';
import './life-aperture.css';

/** A photographic accordion, inspired by the refracted capsule in SAVEE
 * Pentagram scXd_4O. Three everyday moments unfold with document scroll.
 * No image/video borrowed from the reference; EVA's own editorial assets. */
export function LifeAperture({children}:{children:ReactNode}){
 const root=useRef<HTMLElement>(null);
 useEffect(()=>{
  let cancelled=false,dispose=()=>{};
  void Promise.all([import('gsap'),import('gsap/ScrollTrigger')]).then(([g,s])=>{
   if(cancelled||!root.current)return;const gsap=g.gsap;gsap.registerPlugin(s.ScrollTrigger);const media=gsap.matchMedia();
   media.add('(prefers-reduced-motion: no-preference)',()=>{
    const el=root.current!;el.dataset.enhanced='true';
    const t=s.ScrollTrigger.create({trigger:el,start:'top 74px',end:'bottom bottom',onUpdate:self=>{el.style.setProperty('--life-progress',String(self.progress));el.dataset.progress=self.progress.toFixed(3);}});
    return()=>{t.kill();el.dataset.enhanced='false';el.style.removeProperty('--life-progress');};
   });dispose=()=>media.revert();
  });return()=>{cancelled=true;dispose();};
 },[]);
 return <section ref={root} className="life-aperture" data-progress="0" aria-label="EVA, en tu vida">
  <div className="life-aperture-stage"><div className="life-aperture-copy">{children}</div>
   <div className="life-aperture-gallery">
    <figure className="life-aperture-frame life-aperture-frame-one"><img src="/art/editorial/a-moment-to-read-880.webp" width="880" height="1168" alt="Una mujer se toma un momento para leer en casa después de correr." fetchPriority="high" decoding="async"/><figcaption><span>01 / UN MOMENTO PARA TI</span><strong>Conocer.</strong></figcaption></figure>
    <figure className="life-aperture-frame life-aperture-frame-two"><img src="/art/editorial/about-everyday-notes-1200.webp" width="896" height="1120" alt="Un cuaderno, una taza y una mano sobre la mesa, con luz cálida." decoding="async"/><figcaption><span>02 / UNA BUENA PREGUNTA</span><strong>Entender.</strong></figcaption></figure>
    <figure className="life-aperture-frame life-aperture-frame-three"><img src="/art/editorial/after-the-morning-1024.webp" width="864" height="576" alt="Dos personas descansan juntas en casa después de entrenar." decoding="async"/><figcaption><span>03 / TODO LO DEMÁS</span><strong>Vivir.</strong></figcaption></figure>
   </div>
   <div className="life-aperture-footer"><p>Tus resultados son una parte.<br/><strong>La vida es todo lo demás.</strong></p><span aria-hidden="true">CONOCER / ENTENDER / VIVIR</span><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 2v15m-5-5 5 5 5-5" fill="none" stroke="currentColor"/></svg></div>
  </div>
 </section>;
}
