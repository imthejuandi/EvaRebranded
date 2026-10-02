'use client';

import {useState} from 'react';
import type {PlanId} from './ServiceCalendar';

const details = [
  {label:'En casa', title:'Un espacio en tu día.', body:'La recogida de muestra se realiza siguiendo las instrucciones del dispositivo. El kit incluye el envío de vuelta.'},
  {label:'En el laboratorio', title:'Una muestra, su análisis.', body:'El laboratorio analiza la muestra. El panel y las condiciones se confirman antes de contratar.'},
  {label:'En tu informe', title:'Los detalles que importan.', body:'Valor, unidad, fecha y una explicación: información que puedes volver a consultar en tu cuenta.'},
] as const;

/** Conceptual service still life. The photograph is not the commercial kit. */
export default function ServiceContents({plan}:{plan:PlanId}) {
  const [detail,setDetail]=useState(0);
  return <div className={`service-contents service-contents--${plan}`} data-testid="service-contents">
    <div className="service-contents-scene">
      <img className="service-still" src="/art/editorial/pricing-service-still-1200.webp" srcSet="/art/editorial/pricing-service-still-640.webp 640w, /art/editorial/pricing-service-still-1200.webp 1024w" sizes="(max-width: 820px) 100vw, 62vw" width="1024" height="688" alt="Composición editorial de un sobre de recogida, papel y vidrio sobre piedra iluminada por el sol." fetchPriority="high" decoding="async"/>
      <div className="service-document" aria-hidden="true">
        <span className="service-document-eyebrow">EVA / UNA LECTURA</span>
        <span className="service-document-title">Cada dato,<br/>con su origen.</span>
        <span className="service-document-rule"/>
        <span className="service-document-row"><span>Valor</span><span>Unidad</span></span>
        <span className="service-document-row"><span>Fecha</span><span>Fuente</span></span>
        <span className="service-document-note">DOCUMENTO ILUSTRATIVO</span>
      </div>
      <div className="service-lab-card" aria-hidden="true"><span>EN LABORATORIO</span><strong>Una visita.<br/>Tu punto de partida.</strong><span>Panel y cita a confirmar.</span><i/></div>
      <div className="service-scene-label"><span>La información empieza aquí.</span><span>Ilustración del servicio</span></div>
    </div>
    <div className="service-scene-caption" aria-live="polite">
      <span className="service-scene-index">{plan==='quarterly'?`0${detail+1}`:'01'}</span>
      <div><h3>{plan==='quarterly'?details[detail].title:plan==='free'?'Lo que ya tienes, reunido.':'Una extracción en laboratorio.'}</h3><p>{plan==='quarterly'?details[detail].body:plan==='free'?'Añade una analítica y conserva sus valores junto a la fecha y el documento original.':'Explora el alcance del panel y las condiciones de la visita antes de reservar. Esta vista previa no crea una cita.'}</p></div>
    </div>
    {plan==='quarterly'&&<div className="service-scene-nav" role="group" aria-label="Explora qué incluye el servicio">{details.map((item,index)=><button key={item.label} type="button" aria-pressed={detail===index} onClick={()=>setDetail(index)}><span aria-hidden="true">0{index+1}</span>{item.label}<i aria-hidden="true"/></button>)}</div>}
  </div>;
}
