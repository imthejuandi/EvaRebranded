'use client';

import {useId, useState, type CSSProperties} from 'react';
import {EditorialReveal} from '@/components/engagement/EditorialReveal';

export type PlanId = 'free' | 'quarterly' | 'full';
type Inclusion = 'markers' | 'delivery' | 'report';
type ServiceEvent = {kind:'uploaded_record' | 'home_collection' | 'laboratory_collection'; month:number; label:string};

// Relative months describe the service rhythm, never an appointment or annual purchase.
export function serviceEvents(plan:PlanId):ServiceEvent[] {
  if(plan==='free') return [{kind:'uploaded_record',month:0,label:'Tu informe'}];
  if(plan==='full') return [{kind:'laboratory_collection',month:0,label:'Una visita al laboratorio'}];
  return [0,3,6,9].map((month,index)=>({kind:'home_collection',month,label:index===0?'Primera muestra':`A los ${month} meses`}));
}

function ServiceSymbol({kind}:{kind:ServiceEvent['kind']}) {
  return <svg viewBox="0 0 80 96" fill="none" aria-hidden="true">
    {kind==='uploaded_record'?<><path d="M17 9h31l15 16v63H17z"/><path d="M48 9v17h15M27 42h25M27 52h25M27 62h16"/><circle cx="28" cy="76" r="2"/></>:kind==='laboratory_collection'?<><path d="M26 12h28M31 12v39L17 77q-4 9 7 9h32q11 0 7-9L49 51V12M27 64h26"/><path d="M36 29h9M36 39h9"/><circle cx="35" cy="74" r="2"/><circle cx="47" cy="78" r="2"/></>:<><rect x="12" y="22" width="56" height="62" rx="6"/><path d="M12 38h56M32 22v16M48 22v16"/><rect x="25" y="52" width="30" height="17" rx="3"/><path d="M34 60h12M40 55v10"/></>}
  </svg>;
}

export default function ServiceCalendar({plan,quarter,onQuarterChange,markers}:{plan:PlanId;quarter:number;onQuarterChange:(quarter:number)=>void;markers:{code:string;name:string}[]}) {
  const [expanded,setExpanded]=useState<Inclusion|null>(null);
  const id=useId();
  const events=serviceEvents(plan);
  const selected=events[plan==='quarterly'?quarter:0];
  const tabs: {id:Inclusion;label:string;value:string}[]=plan==='quarterly'
    ?[{id:'markers',label:'Panel de ejemplo',value:'15 biomarcadores'},{id:'delivery',label:'Recogida y retorno',value:'En casa'},{id:'report',label:'Tus resultados',value:'En un informe'}]
    :plan==='free'
      ?[{id:'markers',label:'Valores disponibles',value:'Los de tu informe'},{id:'delivery',label:'Cómo empezar',value:'Un documento'},{id:'report',label:'Tus resultados',value:'Con su fuente'}]
      :[{id:'markers',label:'Panel en laboratorio',value:'Alcance a confirmar'},{id:'delivery',label:'Tipo de recogida',value:'Una extracción'},{id:'report',label:'Tus resultados',value:'En un informe'}];
  return <EditorialReveal className={`service-calendar service-calendar--${plan}`} style={{'--service-quarter':quarter} as CSSProperties}>
    <div className="service-calendar-heading"><h3 data-editorial-reveal>{plan==='quarterly'?'Un ritmo para volver a comparar.':plan==='free'?'Empieza por lo que ya tienes.':'Una visita. Un nuevo informe.'}</h3><span>{plan==='quarterly'?'Cadencia ilustrativa':'Un solo punto de partida'}</span></div>
    <div className="service-calendar-events" role="group" aria-label={plan==='quarterly'?'Elige una recogida del calendario ilustrativo':'Servicio de la opción seleccionada'}>
      {plan==='quarterly'&&<span className="service-selection-track" aria-hidden="true"/>}
      {events.map((event,index)=>{
        const content=<><span className="service-event-month">{plan==='quarterly'?`Mes ${String(event.month).padStart(2,'0')}`:plan==='free'?'Documento existente':'Visita única'}</span><ServiceSymbol kind={event.kind}/><span className="service-event-title">{event.label}</span><span className="service-event-detail">{plan==='quarterly'?'Recogida en casa':plan==='free'?'Resultados con fecha y origen':'Extracción en laboratorio'}</span>{plan==='quarterly'&&<span className="service-event-state">{quarter===index?'Seleccionada':'Ver detalle'}<span aria-hidden="true">{quarter===index?'−':'+'}</span></span>}</>;
        return plan==='quarterly'?<button type="button" key={event.month} aria-pressed={quarter===index} onClick={()=>onQuarterChange(index)} className="service-event" data-editorial-reveal>{content}</button>:<div key={event.kind} className="service-event service-event-single" data-editorial-reveal>{content}</div>;
      })}
    </div>
    <div className="service-calendar-caption"><p>{plan==='quarterly'?'Cuatro momentos separados por tres meses. El calendario explica la frecuencia; las fechas se coordinan por separado.':plan==='free'?'Explora los valores de un informe que ya tienes y conserva su fecha y procedencia.':'Consulta el panel disponible y los detalles de la visita antes de elegir esta opción.'}</p>{plan==='quarterly'&&<div className="service-calendar-arrows"><button type="button" aria-label="Recogida anterior" disabled={quarter===0} onClick={()=>onQuarterChange(quarter-1)}>←</button><button type="button" aria-label="Siguiente recogida" disabled={quarter===3} onClick={()=>onQuarterChange(quarter+1)}>→</button></div>}</div>
    <div className="service-inclusion-lens">
      <div className="service-lens-heading"><span>Dentro de esta opción</span><EditorialReveal as="span" className="service-lens-selection" aria-live="polite" replayKey={selected.label} offset={8} duration={.38}>{selected.label}</EditorialReveal></div>
      <div className="service-inclusion-controls">{tabs.map(tab=><button type="button" key={tab.id} aria-expanded={expanded===tab.id} aria-controls={`${id}-${tab.id}`} onClick={()=>setExpanded(expanded===tab.id?null:tab.id)}><small>{tab.label}</small><span>{tab.value}</span><b aria-hidden="true">{expanded===tab.id?'−':'+'}</b></button>)}</div>
      {tabs.map(tab=><div key={tab.id} id={`${id}-${tab.id}`} className="service-inclusion-content" hidden={expanded!==tab.id}>
        {tab.id==='markers'?(plan==='quarterly'?<><p>Panel ilustrativo de 15 biomarcadores. La composición final está pendiente de confirmación.</p><ul className="service-marker-names">{markers.map(marker=><li key={marker.code}>{marker.name}</li>)}</ul></>:<p>{plan==='free'?'Los valores disponibles dependen del documento que añadas. En esta vista previa puedes recorrer un informe de ejemplo.':'El alcance y la disponibilidad del panel se confirman antes de reservar.'}</p>):tab.id==='delivery'?<p>{plan==='quarterly'?'La opción ilustrada incluye el kit y el envío de ida y vuelta. La muestra se recoge en casa siguiendo las instrucciones del dispositivo y se analiza en laboratorio.':plan==='free'?'Añade un documento desde tu cuenta. La demostración permite revisar cómo se organizan sus resultados.':'La muestra se obtiene mediante una extracción en un laboratorio asociado. Esta vista previa no reserva una cita.'}</p>:<><p>Un informe reúne los valores, las unidades, la fecha y el laboratorio de origen.</p><a href="/es/labs/demo-junio">Explorar el informe de junio · ejemplo</a></>}
      </div>)}
    </div>
  </EditorialReveal>;
}
