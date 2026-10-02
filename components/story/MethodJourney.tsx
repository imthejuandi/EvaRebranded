'use client';

import {useEffect, useRef, useState, type KeyboardEvent} from 'react';
import {businessLinks, methodSteps} from '@/lib/landing-content';
import {MethodGraphs} from './MethodGraphs';
import {MethodPouchStill} from './MethodPouchStill';

// Dedicated method artwork: a new home ritual photograph and three original visual studies.
const chapters = ['En casa', 'Resultados', 'Contexto', 'Evolución'];
const captions = [
  ['EN CASA', 'TU PRIMER PASO'],
  ['15 BIOMARCADORES', 'TU PUNTO DE PARTIDA'],
  ['TU LECTURA', 'EN PERSPECTIVA'],
  ['CADA 90 DÍAS', 'COMPARA TUS LECTURAS'],
];

function JourneyArrow({back = false}: {back?: boolean}) {
  return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true" focusable="false" style={back ? {transform: 'rotate(180deg)'} : undefined}><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.35"/></svg>;
}

function MethodArtwork({step,calm}:{step:number;calm:boolean}) {
  const stage=useRef<HTMLDivElement>(null);
  const [visible,setVisible]=useState(false),[cycle,setCycle]=useState(0);
  useEffect(()=>{
    const element=stage.current;if(!element)return;
    let intersects=false;
    const sync=()=>setVisible(intersects&&document.visibilityState==='visible');
    const observer=new IntersectionObserver(([entry])=>{intersects=entry.isIntersecting;sync()},{threshold:.12});
    observer.observe(element);document.addEventListener('visibilitychange',sync);
    return()=>{observer.disconnect();document.removeEventListener('visibilitychange',sync)};
  },[]);
  return <div ref={stage} className="method-new-art" data-method-artwork={step===0?'home-ritual':['','signal-strands','context-lens','quarterly-trace'][step]}>
    <div className="method-art-window">
      {step===0?<MethodPouchStill calm={calm}/>:<MethodGraphs kind={step===1?'results':step===2?'context':'evolution'} active visible={visible} calm={calm} cycle={cycle}/>}
    </div>
    {!calm&&step!==0&&<button className="method-replay" type="button" onClick={()=>setCycle(value=>value+1)} aria-label="Repetir la animación de este paso">Ver de nuevo <JourneyArrow/></button>}
  </div>;
}

export function MethodJourney({calm = false}: {calm?: boolean}) {
  const [active, setActive] = useState(0);
  const [hasChanged, setHasChanged] = useState(false);
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  function selectStep(index: number, focus = false) {
    const next = Math.max(0, Math.min(methodSteps.length - 1, index));
    if (next !== active) { setHasChanged(true); setActive(next); }
    if (focus) tabs.current[next]?.focus();
  }

  function handleKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let next: number;
    if (event.key === 'ArrowRight') next = (index + 1) % methodSteps.length;
    else if (event.key === 'ArrowLeft') next = (index + methodSteps.length - 1) % methodSteps.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = methodSteps.length - 1;
    else return;
    event.preventDefault();
    selectStep(next, true);
  }

  return <section className={'method-journey' + (calm ? ' method-journey-calm' : '') + (hasChanged ? ' method-has-changed' : '')} id="el-metodo" aria-labelledby="routine-title">
    <div className="section-kicker"><span>02 / EL MÉTODO</span><span>UN MOMENTO PARA TI.</span></div>
    <div className="method-heading">
      <h2 id="routine-title">Cuatro pasos.<br/><em>A tu ritmo.</em></h2>
      <p>Recogida de muestra en casa, análisis en laboratorio acreditado. De tu primera muestra al seguimiento cada 90 días.</p>
    </div>

    <div className="method-chapters" role="tablist" aria-label="Los cuatro pasos de EVA" aria-orientation="horizontal">
      {methodSteps.map((step, index) => <button
        key={index}
        ref={node => { tabs.current[index] = node; }}
        id={`method-tab-${index}`}
        role="tab"
        type="button"
        aria-selected={active === index}
        aria-controls={`method-panel-${index}`}
        aria-label={`Paso ${index + 1}, ${chapters[index]}: ${step.title}`}
        tabIndex={active === index ? 0 : -1}
        onClick={() => selectStep(index)}
        onKeyDown={event => handleKey(event, index)}
      ><span className="method-chapter-index">0{index + 1}</span><span>{chapters[index]}</span><i aria-hidden="true"/></button>)}
    </div>

    {methodSteps.map((step, index) => <div
      key={index}
      className="method-panel"
      id={`method-panel-${index}`}
      role="tabpanel"
      aria-labelledby={`method-tab-${index}`}
      hidden={active !== index}
      tabIndex={0}
    >
      <figure className={`method-figure method-figure-${index}`}>
        <div className="method-figure-stage">{active === index && <MethodArtwork step={index} calm={calm}/>}</div>
        <figcaption><span>{captions[index][0]}</span><span>{captions[index][1]}</span></figcaption>
        <p className="method-illustration-note">{index===0?'Escena editorial.':'Representación ilustrativa.'}</p>
      </figure>
      <div className="method-chapter-copy">
        <div className="method-page-number" aria-hidden="true"><span className="method-ordinal">0{index+1}</span><span>/ 04</span></div>
        <div className="method-chapter-body"><h3>{step.title}</h3><p>{step.copy}</p></div>
        <div className="method-paging" role="group" aria-label="Recorrer los pasos">
          <button type="button" aria-label="Paso anterior" disabled={index === 0} onClick={() => selectStep(index - 1, true)}><JourneyArrow back/><span>Anterior</span></button>
          <button type="button" aria-label="Siguiente paso" disabled={index === methodSteps.length - 1} onClick={() => selectStep(index + 1, true)}><span>Siguiente</span><JourneyArrow/></button>
        </div>
        <a className="method-detail-link" href={businessLinks.method}>Así funciona EVA <JourneyArrow/></a>
      </div>
    </div>)}
  </section>;
}
