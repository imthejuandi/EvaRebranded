'use client';

import {useEffect, useRef, useState} from 'react';
import {usePreview} from '@/components/preview/PreviewProvider';
import {AppPageHeader, AsyncState, ConfirmationDialog, EmptyState, SourceTag} from '@/components/preview/AppPrimitives';
import {ActionLink} from '@/components/site/Primitives';
import {canReadReport,reportForKit,reportReadiness} from '@/lib/preview/policy';
import type {PreviewState} from '@/lib/preview/model';
import KitActivation from './KitActivation';
import {cycleStep} from './kit-activation';

export const bookCopy = {es: {
  eyebrow:'MI EVA / MI KIT', title:'Mi kit.', intro:'El estado de tu muestra, su informe y los detalles de tu plan.', back:'Volver al resumen', loading:'Preparando los detalles de tu plan…',
  session:{title:'Accede a tu espacio de ejemplo.',copy:'Aquí podrás explorar un plan y seguir el recorrido de una muestra.',action:'Entrar a la vista previa'},
  status:{active:'Activo',paused:'En pausa',cancelled:'Cancelado',past_due:'Pago pendiente'},
  member:{label:'TU PLAN',quarterly:'EVA Trimestral',annual:'EVA Anual',annualPrice:'396 €',annualUnit:'/ año',full:'Panel en laboratorio',quarterPrice:'99 €',fullPrice:'499 €',quarterUnit:'/ trimestre',fullUnit:'pago único',sample:'PLAN DE EJEMPLO',
    headlines:{active:'Tu recogida, paso a paso.',paused:'A tu ritmo, también al parar.',cancelled:'Tu historial sigue contigo.',past_due:'Hay un pago que revisar.'},
    descriptions:{active:'Recogida de muestra en casa y análisis en laboratorio. Panel ilustrativo de 15 biomarcadores; alcance final pendiente de confirmación.',paused:'La suscripción está en pausa en este ejemplo. Puedes explorar cómo reanudarla cuando quieras continuar.',cancelled:'La cancelación está aplicada a este ejemplo. Tus lecturas anteriores siguen en el archivo; puedes explorar la reactivación.',past_due:'El plan de ejemplo tiene un pago pendiente. Revisa las opciones de facturación para retomar el seguimiento.'},
    fullTitle:'Una visita al laboratorio.',fullDescription:'Una lectura en laboratorio con pago único. Confirma la composición del panel y las condiciones antes de contratarlo.',
    renewal:'Próxima renovación',cadence:'Trimestral',unknownDate:'Fecha no disponible en este ejemplo',noRenewal:'Sin renovación automática',pausedRenewal:'Renovación en pausa',cancelledRenewal:'Renovación cancelada',
    billing:'Gestionar facturación',updatePayment:'Revisar el pago',resume:'Reanudar el plan',reactivate:'Reactivar el plan',pause:'Pausar',cancel:'Cancelar suscripción',
    fullConditions:'Ver condiciones del panel',
  },
  free:{eyebrow:'TU PRIMER PASO',title:'Elige cómo quieres empezar.',copy:'Puedes seguir tu salud cada trimestre o hacer una lectura más amplia en laboratorio. Si ya tienes una analítica, también puedes subirla.',upload:'Subir una analítica',
    plans:[{id:'quarterly',label:'EVA Trimestral',price:'99 €',cadence:'/ trimestre',description:'Panel ilustrativo de 15 biomarcadores con recogida trimestral en casa y análisis en laboratorio. Alcance final por confirmar.',action:'Revisar el plan trimestral'}, {id:'full_panel',label:'Panel Completo',price:'499 €',cadence:'pago único',description:'Una extracción en laboratorio para un panel más amplio. Confirma su alcance antes de contratarlo.',action:'Revisar el panel completo'}],
  },
  parcel:{caption:'ESTUDIO DEL KIT / REPRESENTACIÓN ILUSTRATIVA',top:'UN MOMENTO PARA TI',bottom:'MUESTRA → LECTURA',aria:'Estudio abstracto de un paquete EVA en papel claro, con luz cálida y una impresión de puntos'},
  itinerary:{eyebrow:'EL RECORRIDO DE TU MUESTRA',title:'El recorrido de tu muestra.',copy:'La etapa actual indica el estado del ejemplo. Puedes abrir las demás para conocer el proceso.',current:'Estado del ejemplo',explore:'Explorar las etapas del kit',viewing:'ESTÁS EXPLORANDO',completed:'Ciclo completado',done:'Completada',live:'En curso',future:'Próxima etapa',
    steps:[
      {name:'Preparación',title:'Todo empieza con tu kit.',copy:'El kit se prepara para la siguiente lectura. Revisa la dirección de envío en tu perfil para que esté al día.'},
      {name:'Envío',title:'El kit inicia su recorrido.',copy:'En esta etapa, el kit está en camino. Los detalles de entrega se consultarán con la información del envío disponible.'},
      {name:'Muestra',title:'Un momento en tu día.',copy:'La recogida se realiza en casa con Tasso+. Sigue las instrucciones del dispositivo y del kit para preparar el retorno de la muestra.'},
      {name:'Laboratorio',title:'La muestra llega al análisis.',copy:'La muestra se analiza en laboratorio. Los valores aparecen cuando el informe está disponible; una etapa en proceso todavía no es un resultado.'},
      {name:'Resultados',title:'El informe de esta muestra.',copy:'Cuando el laboratorio publique el informe y completes su contexto, podrás consultar los valores de esta muestra.'},
    ],
    report:'Abrir el informe',context:'Completar el contexto',processing:'Ver el estado del informe',archive:'Ver mis informes',
    noKitTitle:'Sin kit programado.',noKitCopy:'El próximo recorrido aparecerá aquí cuando exista un kit programado. Puedes consultar tu plan o subir una analítica que ya tengas.',
    address:'DIRECCIÓN DEL EJEMPLO',addressEmpty:'Todavía no hay una dirección de envío.',addressLink:'Revisar dirección',timing:'Las fechas de envío y entrega aparecerán cuando estén disponibles.',
  },
  extra:{eyebrow:'OTRA FORMA DE CONTINUAR',fullTitle:'Amplía la perspectiva.',fullCopy:'El Panel Completo es una opción adicional en laboratorio, con pago único. Su composición se confirma antes de la contratación.',quarterTitle:'Añade continuidad.',quarterCopy:'El seguimiento trimestral reúne una nueva lectura trimestral de 15 biomarcadores de ejemplo, con recogida de muestra en casa.',lab:'En laboratorio',home:'Recogida en casa',single:'Pago único',quarter:'Cada trimestre',fullAction:'Revisar el panel completo',quarterAction:'Revisar EVA Trimestral'},
  specialties:{eyebrow:'OTROS PERFILES',title:'Una pregunta más específica.',copy:'Hay perfiles centrados en distintos sistemas. El alcance, el laboratorio y las condiciones se confirman mediante presupuesto.',quote:'Pedir presupuesto',
    panels:[
      {id:'hormonal',name:'Hormonal',copy:'Hormonas sexuales, cortisol y DHEA-S.'},
      {id:'cardiovascular',name:'Cardiovascular',copy:'Subfracciones lipídicas, ApoB, Lp(a) y marcadores inflamatorios.'},
      {id:'thyroid',name:'Tiroides',copy:'TSH, T3 libre, T4 libre y anticuerpos tiroideos.'},
      {id:'nutrients',name:'Nutricional',copy:'Vitaminas y minerales como B12, folato, hierro, zinc y magnesio.'},
      {id:'inflammatory',name:'Inflamatorio',copy:'hs-CRP, IL-6, TNF-α y homocisteína.'},
      {id:'liver',name:'Hepático',copy:'ALT, AST, GGT, bilirrubina y albúmina.'},
    ],
  },
  future:{label:'PRÓXIMAMENTE',title:'Más espacio para conversar.',copy:'EVA está preparando una red de profesionales centrados en prevención y longevidad. La reserva de consultas todavía no está disponible.',link:'Conocer EVA'},
  management:{label:'GESTIÓN DEL PLAN DE EJEMPLO',title:'Tu plan, bajo tu control.',copy:'Explora cómo se presentan los cambios de una suscripción. Las acciones de esta pantalla se aplican solo a los datos de ejemplo.',terms:'Consultar los términos',billingReady:'La vista de facturación de ejemplo está preparada. Puedes explorar las opciones de gestión de abajo.',applying:'Aplicando el cambio al ejemplo…',failure:'No se ha podido completar el cambio de ejemplo. Inténtalo de nuevo.',retry:'Reintentar',close:'Cerrar aviso',
    confirm:{
      pause:{title:'¿Pausar el plan de ejemplo?',description:'El plan quedará en pausa dentro de esta vista previa. Tus informes seguirán disponibles y podrás explorar cómo reanudarlo.',action:'Pausar el ejemplo',done:'El plan de ejemplo está en pausa.'},
      resume:{title:'¿Reanudar el plan de ejemplo?',description:'El plan volverá a aparecer como activo en esta vista previa. Este cambio no genera una compra ni un envío.',action:'Reanudar el ejemplo',done:'El plan de ejemplo vuelve a estar activo.'},
      cancel:{title:'¿Cancelar el plan de ejemplo?',description:'La suscripción quedará marcada como cancelada en esta vista previa. Las condiciones comerciales finales se confirmarán antes de contratar.',action:'Cancelar el ejemplo',done:'La cancelación está aplicada al plan de ejemplo.'},
    },
  },
  end:'Tus informes, cuando los necesites.',endCopy:'Consulta los resultados que ya tienes y la fecha de cada muestra.',
}} as const;

const copy=bookCopy.es;
type ManagementAction='pause'|'resume'|'cancel';
type Banner={message:string;error:boolean;retry?:ManagementAction|'portal'};

export function selectBookState(state:PreviewState){
  const annual=state.plan==='annual',quarterly=state.plan==='quarterly'||annual, full=state.plan==='full_panel';
  const hasKit=quarterly&&state.kitCycle?.status!=='cancelled'&&Number.isInteger(state.kitStep)&&state.kitStep>=0&&state.kitStep<=4;
  const report=quarterly?reportForKit(state):undefined;
  const reportReady=Boolean(state.session&&canReadReport(report,state.profile.healthConsent));
  return{quarterly,annual,full,hasKit,step:hasKit?(state.kitCycle?cycleStep(state.kitCycle.status,state.kitStep):state.kitStep):0,report,reportReady};
}

function Arrow(){return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.4"/></svg>;}

function ParcelStudy(){
  return <figure className="book-product-reference"><img src="/art/tasso-plus-product.jpg" width="1500" height="1500" alt="Dispositivo Tasso+ para recogida de una muestra capilar, con botón coral y carcasa blanca."/><figcaption><strong>Tasso+</strong><span>Dispositivo de recogida de muestra</span><p>Sigue las instrucciones incluidas en tu kit. La imagen muestra el dispositivo, no un envío en curso.</p></figcaption></figure>;
}

function PlanChoices(){return <section className="book-free-start" aria-labelledby="book-free-title"><div className="book-free-intro"><p className="book-eyebrow">{copy.free.eyebrow}</p><h2 id="book-free-title">{copy.free.title}</h2><p>{copy.free.copy}</p><a href="/es/upload">{copy.free.upload}<Arrow/></a></div><div className="book-plan-choices">{copy.free.plans.map(plan=><article key={plan.id}><div><h3>{plan.label}</h3><p className="book-choice-price"><strong>{plan.price}</strong><span>{plan.cadence}</span></p><p className="book-choice-description">{plan.description}</p></div><ActionLink href={`/es/checkout/resume?plan=${plan.id}`}>{plan.action}</ActionLink>{plan.id==='quarterly'&&<a className="book-annual-choice" href="/es/checkout-resume?intent=annual">Revisar pago anual · 396 € de ejemplo</a>}</article>)}</div></section>;}

function KitItinerary({state}:{state:PreviewState}){
  const{step,hasKit,report,reportReady}=selectBookState(state),[selected,setSelected]=useState(step);
  useEffect(()=>setSelected(step),[step,state.scenario]);
  const selectedCopy=copy.itinerary.steps[selected];
  const readiness=reportReadiness(report,state.profile.healthConsent);
  const reportHref=readiness==='pending_context'&&report?`/es/labs/${report.id}/context`:report?`/es/labs/${report.id}`:'/es/labs';
  const reportLabel=reportReady?copy.itinerary.report:readiness==='pending_context'?copy.itinerary.context:copy.itinerary.processing;
  return <section className="book-itinerary" aria-labelledby="book-itinerary-title"><div className="book-section-heading"><div><p className="book-eyebrow">{copy.itinerary.eyebrow}</p><h2 id="book-itinerary-title">{copy.itinerary.title}</h2></div><p>{copy.itinerary.copy}</p></div>
    {hasKit?<><div className="book-current-status"><span>{copy.itinerary.current}</span><strong>{step===4?(reportReady?'Informe disponible':readiness==='pending_context'?'Falta completar el contexto':readiness==='processing'?'Informe en proceso':readiness==='error'?'Informe pendiente de revisión':readiness==='no_consent'?'Revisa tus permisos':'Informe aún no vinculado'):copy.itinerary.steps[step].name}</strong></div><div className="book-itinerary-stops" role="group" aria-label={copy.itinerary.explore}>{copy.itinerary.steps.map((item,index)=><button key={item.name} type="button" aria-pressed={selected===index} onClick={()=>setSelected(index)} data-done={index<step} data-current={index===step}><span className="book-stop-marker" aria-hidden="true">{String(index+1).padStart(2,'0')}</span><span>{item.name}</span><small>{index<step?copy.itinerary.done:index===step?(step===4?(reportReady?'Disponible':'Pendiente'):copy.itinerary.live):copy.itinerary.future}</small></button>)}</div><div className="book-itinerary-detail" aria-live="polite"><span className="book-detail-ordinal" aria-hidden="true">{String(selected+1).padStart(2,'0')}</span><div><p className="book-eyebrow">{copy.itinerary.viewing}</p><h3>{selectedCopy.title}</h3><p>{selectedCopy.copy}</p>{selected===4&&report&&state.profile.healthConsent&&<a href={reportHref}>{reportLabel}<Arrow/></a>}{selected===4&&!report&&<p className="book-report-pending">El informe de este kit todavía no está vinculado. Tus otros informes siguen en Resultados.</p>}{selected===4&&!state.profile.healthConsent&&<a href="/es/profile#consentimientos">Revisar permisos<Arrow/></a>}{selected===0&&<a href="/es/profile#direccion">{copy.itinerary.addressLink}<Arrow/></a>}</div></div></>:<EmptyState title={copy.itinerary.noKitTitle} description={copy.itinerary.noKitCopy}><ActionLink href="/es/upload" secondary>{copy.free.upload}</ActionLink></EmptyState>}
    <div className="book-shipping-strip"><div><p className="book-eyebrow">{copy.itinerary.address}</p><p className="book-address">{state.profile.address||copy.itinerary.addressEmpty}{state.profile.address&&<span>{state.profile.postalCode} {state.profile.city}</span>}</p></div><a href="/es/profile#direccion">{copy.itinerary.addressLink}<Arrow/></a></div>
  </section>;
}

export default function BookPage(){
  const{state,update,request,hydrated}=usePreview();
  const{quarterly,annual,full,hasKit,step,report,reportReady}=selectBookState(state);
  const[confirm,setConfirm]=useState<ManagementAction|null>(null),[busy,setBusy]=useState(false),[banner,setBanner]=useState<Banner|null>(null);
  const failed=useRef(false);
  const returnFocus=useRef<HTMLButtonElement|null>(null),management=useRef<HTMLElement|null>(null),actionVersion=useRef(0);
  const openConfirm=(action:ManagementAction,button:HTMLButtonElement)=>{returnFocus.current=button;setConfirm(action);setBanner(null);};
  const closeConfirm=()=>{actionVersion.current+=1;setConfirm(null);requestAnimationFrame(()=>returnFocus.current?.focus());};
  async function apply(action:ManagementAction|'portal'){
    if(busy)return;const version=++actionVersion.current;setBusy(true);setBanner(null);
    try{
      const result=await request('billing.portal',{previewAction:action,plan:state.plan,locale:'es',simulateError:state.scenario==='error'&&!failed.current});
      if(version!==actionVersion.current)return;
      if(!result.ok){failed.current=true;if(action!=='portal')closeConfirm();setBanner({message:copy.management.failure,error:true,retry:action});return;}
      if(action==='portal'){setBanner({message:copy.management.billingReady,error:false});management.current?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});}
      else{const status=action==='pause'?'paused':action==='cancel'?'cancelled':'active';update(current=>({...current,subscriptionStatus:status,lastAction:copy.management.confirm[action].done}));setBanner({message:copy.management.confirm[action].done,error:false});closeConfirm();}
    }catch{if(version===actionVersion.current){if(action!=='portal')closeConfirm();setBanner({message:copy.management.failure,error:true,retry:action});}}finally{setBusy(false);}
  }
  if(!hydrated)return <div className="page-book"><AsyncState message={copy.loading}/></div>;
  if(!state.session)return <div className="page-book"><AppPageHeader eyebrow={copy.eyebrow} title={copy.title}/><EmptyState title={copy.session.title} description={copy.session.copy}><ActionLink href="/es/login?redirect=/es/book">{copy.session.action}</ActionLink></EmptyState></div>;
  const alternative=full?'quarterly':'full_panel';
  return <div className="page-book"><AppPageHeader eyebrow={copy.eyebrow} title={quarterly&&hasKit?(step===4?(reportReady?'El informe de tu kit está listo.':'Consulta el estado de tu informe.'):step===1?'Tu kit está en camino.':step===2?'Tu kit, listo para la muestra.':step===3?'Tu muestra está en laboratorio.':'Tu kit está en preparación.'):copy.title} description={copy.intro} action={<a className="book-header-back" href="/es/dashboard">{copy.back}<Arrow/></a>}/>
    {quarterly&&hasKit&&<section className="book-service-receipt" aria-label="Resumen del kit de ejemplo"><div><span>Recogida de muestra · ejemplo</span><strong>{step===4?(reportReady?'Informe disponible':report?'Informe pendiente':'Informe aún no vinculado'):copy.itinerary.steps[step].name}</strong><p>{report&&state.profile.healthConsent?`Muestra del ${new Intl.DateTimeFormat('es',{day:'numeric',month:'long',year:'numeric',timeZone:'UTC'}).format(new Date(report.date))}`:'Las fechas se mostrarán cuando estén disponibles.'}</p></div>{reportReady&&report?<ActionLink href={`/es/labs/${report.id}`}>Abrir este informe</ActionLink>:report&&state.profile.healthConsent?<ActionLink href={reportReadiness(report,state.profile.healthConsent)==='pending_context'?`/es/labs/${report.id}/context`:`/es/labs/${report.id}`}>{reportReadiness(report,state.profile.healthConsent)==='pending_context'?'Completar contexto':'Consultar informe'}</ActionLink>:<a className="book-receipt-link" href={state.profile.healthConsent?'#book-itinerary-title':'/es/profile#consentimientos'}>{state.profile.healthConsent?'Ver el recorrido':'Revisar permisos'}<Arrow/></a>}</section>}
    {state.plan==='free'?<PlanChoices/>:<section className="book-membership" aria-labelledby="book-membership-title"><div className="book-membership-copy"><div className="book-membership-label"><p className="book-eyebrow">{copy.member.label}</p><SourceTag>{copy.member.sample}</SourceTag></div><div className="book-membership-name"><span>{full?copy.member.full:annual?copy.member.annual:copy.member.quarterly}</span>{quarterly&&<span className={`book-subscription-status is-${state.subscriptionStatus}`}><i aria-hidden="true"/>{copy.status[state.subscriptionStatus]}</span>}</div><h2 id="book-membership-title">{full?copy.member.fullTitle:copy.member.headlines[state.subscriptionStatus]}</h2><p className="book-membership-description">{full?copy.member.fullDescription:copy.member.descriptions[state.subscriptionStatus]}</p>{annual&&<p className="book-annual-note">396 € al año en este ejemplo. Facturación anual y recogida trimestral; importe provisional, sin descuento indicado.</p>}<div className="book-membership-price"><strong>{full?copy.member.fullPrice:annual?copy.member.annualPrice:copy.member.quarterPrice}</strong><span>{full?copy.member.fullUnit:annual?copy.member.annualUnit:copy.member.quarterUnit}</span></div><div className="book-renewal"><span>{copy.member.renewal}</span><div><strong>{full?copy.member.noRenewal:state.subscriptionStatus==='paused'?copy.member.pausedRenewal:state.subscriptionStatus==='cancelled'?copy.member.cancelledRenewal:annual?'Anual · recogida trimestral':copy.member.cadence}</strong>{quarterly&&state.subscriptionStatus!=='cancelled'&&<p>{copy.member.unknownDate}</p>}</div></div><div className="book-membership-actions">{quarterly&&(state.subscriptionStatus==='paused'||state.subscriptionStatus==='cancelled')?<button type="button" className="eva-button" disabled={busy} onClick={event=>openConfirm('resume',event.currentTarget)}>{state.subscriptionStatus==='cancelled'?copy.member.reactivate:copy.member.resume}<Arrow/></button>:quarterly?<button type="button" className="eva-button" disabled={busy} onClick={()=>void apply('portal')}>{state.subscriptionStatus==='past_due'?copy.member.updatePayment:copy.member.billing}<Arrow/></button>:<ActionLink href="/es/pricing" secondary>{copy.member.fullConditions}</ActionLink>}</div></div>{quarterly?<ParcelStudy/>:<div className="book-lab-receipt"><span>Servicio de ejemplo</span><strong>Una extracción<br/>en laboratorio.</strong><p>La visita, el panel y su disponibilidad se confirman antes de reservar. Esta vista previa no programa una cita.</p></div>}</section>}
    {banner&&<div className={`book-feedback ${banner.error?'is-error':''}`} role={banner.error?'alert':'status'}><p>{banner.message}</p>{banner.retry&&<button type="button" disabled={busy} onClick={()=>void apply(banner.retry!)}>{copy.management.retry}<Arrow/></button>}<button type="button" className="book-close-feedback" aria-label={copy.management.close} onClick={()=>setBanner(null)}>×</button></div>}
    {quarterly&&<><KitActivation/><KitItinerary state={state}/><section ref={management} className="book-management" aria-labelledby="book-management-title"><div><p className="book-eyebrow">{copy.management.label}</p><h2 id="book-management-title">{copy.management.title}</h2><p>{copy.management.copy}</p><a href="/es/legal/terms">{copy.management.terms}<Arrow/></a></div><div className="book-management-options"><button type="button" disabled={busy} onClick={()=>void apply('portal')}>{copy.member.billing}<Arrow/></button>{state.subscriptionStatus==='active'||state.subscriptionStatus==='past_due'?<button type="button" disabled={busy} onClick={event=>openConfirm('pause',event.currentTarget)}>{copy.member.pause}<Arrow/></button>:<button type="button" disabled={busy} onClick={event=>openConfirm('resume',event.currentTarget)}>{state.subscriptionStatus==='cancelled'?copy.member.reactivate:copy.member.resume}<Arrow/></button>}{state.subscriptionStatus!=='cancelled'&&<button className="book-cancel-plan" type="button" disabled={busy} onClick={event=>openConfirm('cancel',event.currentTarget)}>{copy.member.cancel}<Arrow/></button>}</div></section></>}

    {state.plan!=='free'&&<section className="book-extra" aria-labelledby="book-extra-title"><div><p className="book-eyebrow">{copy.extra.eyebrow}</p><h2 id="book-extra-title">{full?copy.extra.quarterTitle:copy.extra.fullTitle}</h2><p>{full?copy.extra.quarterCopy:copy.extra.fullCopy}</p><ul><li>{full?copy.extra.home:copy.extra.lab}</li><li>{full?copy.extra.quarter:copy.extra.single}</li></ul></div><div className="book-extra-order"><p><strong>{full?copy.member.quarterPrice:copy.member.fullPrice}</strong><span>{full?copy.member.quarterUnit:copy.member.fullUnit}</span></p><ActionLink href={`/es/checkout/resume?plan=${alternative}`}>{full?copy.extra.quarterAction:copy.extra.fullAction}</ActionLink></div></section>}
    <section className="book-specialties" aria-labelledby="book-specialties-title"><div className="book-section-heading"><div><p className="book-eyebrow">{copy.specialties.eyebrow}</p><h2 id="book-specialties-title">{copy.specialties.title}</h2></div><p>{copy.specialties.copy}</p></div><div className="book-specialty-list">{copy.specialties.panels.map((panel,index)=><a href={`/es/contact?panel=${panel.id}`} key={panel.id}><span className="book-specialty-index">{String(index+1).padStart(2,'0')}</span><div><h3>{panel.name}</h3><p>{panel.copy}</p></div><span className="book-specialty-quote">{copy.specialties.quote}<Arrow/></span></a>)}</div></section>
<div className="book-closing"><h2>{copy.end}</h2><p>{copy.endCopy}</p><a href="/es/dashboard">{copy.back}<Arrow/></a></div>
    {confirm&&<ConfirmationDialog title={copy.management.confirm[confirm].title} description={copy.management.confirm[confirm].description} confirmLabel={copy.management.confirm[confirm].action} busy={busy} onCancel={closeConfirm} onConfirm={()=>void apply(confirm)}/>}
  </div>;
}
