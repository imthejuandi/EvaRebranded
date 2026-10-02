'use client';

import {useId, useState} from 'react';
import {usePreview} from '@/components/preview/PreviewProvider';
import {AppPageHeader, AsyncState, SourceTag, StatusIndicator} from '@/components/preview/AppPrimitives';
import {ActionLink} from '@/components/site/Primitives';
import {DotNumber} from '@/components/story/DotNumber';
import {canReadReport,reportForKit,reportReadiness} from '@/lib/preview/policy';
import {dateLabel, numberLabel} from '@/lib/preview/fixtures';
import type {PreviewState, Report} from '@/lib/preview/model';
import {dashboardMarkerForReport, dashboardMarkerHistory, selectDashboardReading, selectExecutiveStory, selectMarkerInterpretation, zoneLabels, type DashboardMarker} from './dashboard-reading';
import {ExecutiveReading, BiomarkerExplanation} from './ExecutiveReading';
import {WearableObservations} from './WearableObservations';
import {EstimateMetadata} from './EstimateMetadata';
import DashboardActionables from './actionables/DashboardActionables';
import {HealthSignature} from './HealthSignature';
import {previewReportResults} from './preview-report-results';
export {dashboardMarkerForReport, dashboardMarkerHistory, selectDashboardReading} from './dashboard-reading';

export const dashboardCopy = {es: {
  eyebrow: 'MI EVA / RESUMEN', greeting: (name: string) => `Hola, ${name}.`,
  intro: 'Tus resultados más recientes, en un mismo lugar.', upload: 'Añadir resultados', loading: 'Preparando tu espacio de ejemplo…',
  plan: {free: 'Cuenta gratuita', quarterly: 'EVA Trimestral', annual: 'EVA Anual', full_panel: 'Panel Completo'},
  subscription: {active: 'Plan activo', paused: 'Plan en pausa', cancelled: 'Plan cancelado', past_due: 'Revisa el pago de tu plan'},
  current: 'TU LECTURA ACTUAL', sample: 'Informe de ejemplo', source: {kit: 'Muestra del kit', upload: 'Analítica subida'},
  reportLink: 'Abrir el informe', methodology: 'Cómo se calculan',
  score: 'Puntuación de longevidad', scoreUnit: '/ 100', age: 'Edad estimada de este informe', years: 'años',
  born: (year: string) => `Año de nacimiento: ${year}`, unavailable: 'No disponible', noEstimate: 'Esta lectura no incluye la estimación.',
  estimateNote: 'Estimaciones de ejemplo. No sustituyen una evaluación profesional.',
  paidFeature: 'Disponible con un plan de pago', paidCopy: 'Tus valores siguen disponibles. Explora los planes para conocer las funciones de interpretación.', plans: 'Ver planes',
  overviewLabel: 'PANORAMA DE LA LECTURA', analysed: 'biomarcadores en este informe', inRange: 'En rango orientativo', review: 'Para poner en contexto', unknown: 'Sin clasificación',
  noMarkers: 'Este informe todavía no tiene valores disponibles.', countsNote: 'La clasificación pertenece al ejemplo. Un valor aislado no resume tu salud.',
  next: {
    label: 'TU SIGUIENTE PASO', attentionTitle: 'Empieza por el contexto.', attention: (count: number) => `${count} ${count === 1 ? 'valor está' : 'valores están'} fuera del rango orientativo del ejemplo. Revisa qué significa cada uno junto al informe.`,
    calmTitle: 'Mira la lectura completa.', calm: 'Recorre tus valores y sus explicaciones. La comparación entre lecturas aporta más información que una cifra por separado.',
    action: 'Ver qué significa', fullReport: 'Explorar mi lectura',
  },
  markers: {title: 'Tus biomarcadores', description: 'Selecciona una cápsula y recorre tus lecturas. Cada cifra conserva su fecha, unidad y contexto.', all: 'Todos', filterLabel: 'Filtrar el resumen por categoría', name: 'Biomarcador', value: 'Lectura', status: 'Contexto', allLink: (count: number) => `Ver los ${count} biomarcadores`, open: (name: string) => `Ver ${name} y su evolución`, empty: 'No hay biomarcadores en esta categoría.',},
  glass: {title:'Explora tus resultados',aria:'Explorador de biomarcadores de tus informes de ejemplo',views:[{id:'history',label:'Evolución'},{id:'range',label:'Rangos'},{id:'reading',label:'Lectura'}],viewLabel:'Vista del biomarcador',select:'Seleccionar un biomarcador',readings:'Lecturas disponibles',previous:'Lectura anterior',next:'Siguiente lectura',range:'Rango orientativo del ejemplo',rangeUnavailable:'Esta unidad no tiene un rango comparable en el ejemplo.',rangeNote:'Es un rango ilustrativo. Consulta el intervalo del laboratorio y tu contexto al interpretar el resultado.',historyNote:'Solo se comparan lecturas disponibles del mismo tipo de origen y con la misma unidad. La dirección del cambio no indica por sí sola una mejora.',single:'Todavía no hay otra lectura comparable.',missing:'Sin dato en esta lectura',open:'Entender este biomarcador',expand:(n:number)=>`Explorar los ${n}`,collapse:'Ver la selección',count:(n:number)=>`${n} biomarcadores`,caption:'Valores del informe seleccionado',source:'Ver informe de origen',status:{optimal:'Dentro del intervalo',attention:'Fuera de rango',action:'Revisión',unknown:'Sin clasificar'},noReadings:'No hay lecturas comparables disponibles.',table:'Lecturas que forman la gráfica',date:'Fecha',value:'Valor'},
  actions: {title: 'Sigue con una buena pregunta.', description: 'Revisa tu información o explora una explicación.', personalEmpty: 'Este informe de ejemplo no incluye acciones personalizadas.',
    items: [
      {id: 'context', title: 'Revisa tus datos', copy: 'Tu información y el nivel de explicación ayudan a presentar la lectura.', link: 'Revisar mi perfil'},
      {id: 'ai', title: 'Haz una buena pregunta', copy: 'Explora las explicaciones educativas de EVA AI.', link: 'Abrir EVA AI'},
    ],
  },
  wearable: {eyebrow: 'ENTRE LECTURAS', title: 'También cuenta tu día a día.', connected: 'Resumen de ejemplo importado', disconnected: 'Sin resumen importado', imported: 'La importación guarda los datos de un resumen de ejemplo. No hay una conexión activa con un dispositivo ni lecturas sincronizadas.', empty: 'Todavía no has importado un resumen de ejemplo. Puedes explorar esta opción desde tu perfil.', link: 'Revisar resumen importado',
    prompts: [{label: 'Descanso', copy: 'Cómo has dormido.'}, {label: 'Actividad', copy: 'Cómo ha cambiado tu rutina.'}, {label: 'Recuperación', copy: 'Cómo te has encontrado.'}],
    noCausation: 'Estas señales aportan contexto; observarlas juntas no demuestra una causa.',
  },
  kit: {title: 'Tu kit, paso a paso.', fullTitle: 'Tu análisis en laboratorio.', freeTitle: 'Elige cómo continuar.', freeCopy: 'Puedes subir una analítica que ya tengas o explorar el seguimiento trimestral.', activeCopy: 'Consulta el estado de tu ciclo y los detalles de tu plan.', completed: 'Informe del kit disponible', progress: 'Ciclo en curso', empty: 'No hay un kit programado en este ejemplo.', view: 'Ver mi kit', fullView: 'Ver mi plan', steps: ['Preparación', 'Envío', 'Muestra', 'Laboratorio', 'Resultados'], label: 'Estado del kit de ejemplo',},
  history: {title: 'Tu archivo', link: 'Gestionar informes', unavailable: 'No hay informes anteriores.', statuses: {ready: 'Disponible', processing: 'En preparación', pending_context: 'Falta contexto', error: 'Necesita revisión', archived: 'Archivado'}},
  stages: ['Informe recibido', 'Contexto', 'Interpretación', 'Disponible'], stageLabel: 'Progreso del informe de ejemplo',
  waiting: {
    new: {eyebrow: 'TU PUNTO DE PARTIDA', title: 'Aquí empieza tu primera lectura.', copy: 'Personaliza tu espacio y elige cómo empezar. Puedes reunir una analítica que ya tengas o conocer las opciones de EVA.', primary: 'Personalizar mi espacio', href: '/es/onboarding', secondary: 'Subir una analítica', secondaryHref: '/es/upload'},
    kit: {eyebrow: 'UNA NUEVA LECTURA, EN MARCHA', title: 'Tu kit tiene su propio recorrido.', copy: 'Todavía no hay resultados. Sigue el ciclo de tu kit y consulta el siguiente paso desde Mi kit.', primary: 'Ver el estado de mi kit', href: '/es/book', secondary: 'Cómo funciona', secondaryHref: '/es/how-it-works'},
    processing: {eyebrow: 'ESTAMOS EN EL SIGUIENTE PASO', title: 'Tu informe está en preparación.', copy: 'Los valores y las estimaciones se mostrarán cuando el informe esté disponible. Mientras tanto, puedes consultar su estado.', primary: 'Ver el estado del informe', href: '/es/labs', secondary: 'Gestionar mis informes', secondaryHref: '/es/labs/manage'},
    context: {eyebrow: 'FALTA UNA PARTE DE LA HISTORIA', title: 'Añade contexto a esta lectura.', copy: 'Antes de mostrar la interpretación, revisa tu información y lo que ocurrió el día de la muestra. Puedes indicar lo que no recuerdes.', primary: 'Completar el contexto', href: '/es/labs/demo-junio/context', secondary: 'Ver mis informes', secondaryHref: '/es/labs/manage'},
    error: {eyebrow: 'PODEMOS RETOMARLO', title: 'Este informe necesita revisión.', copy: 'No se ha podido completar la preparación del ejemplo. Vuelve al proceso de subida para revisar los datos o elegir otro informe.', primary: 'Revisar la subida', href: '/es/upload', secondary: 'Ver mis informes', secondaryHref: '/es/labs/manage'},
    consent: {eyebrow: 'TÚ DECIDES SOBRE TUS DATOS', title: 'Revisa tu consentimiento.', copy: 'Los resultados no se muestran sin el consentimiento para tratar datos de salud. Puedes revisarlo en tu perfil.', primary: 'Revisar mi perfil', href: '/es/profile', secondary: 'Política de privacidad', secondaryHref: '/es/legal/privacy'},
    session: {eyebrow: 'VUELVE A TU ESPACIO', title: 'Continúa con una cuenta de ejemplo.', copy: 'Accede a la vista previa para explorar los estados y las lecturas de EVA.', primary: 'Entrar a la vista previa', href: '/es/login?redirect=/es/dashboard', secondary: 'Descubrir EVA', secondaryHref: '/es'},
  },
  emptyNext: {title: 'Mientras llega tu primera lectura.', copy: 'Descubre cómo se presentan los resultados o prepara el contexto que te gustaría reunir.', method: 'Entender el método', profile: 'Completar mi perfil'},
}} as const;

const copy = dashboardCopy.es;

const finite = (value:unknown):value is number => typeof value==='number' && Number.isFinite(value);
const svgNumber = (value:number) => Number(value.toFixed(3));

function Arrow() {return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.35"/></svg>;}

type GalleryView='history'|'range'|'reading';
type DatedReading={report:Report;marker:DashboardMarker};
const priority={action:0,attention:1,unknown:2,optimal:3};
const tones=['lilac','amber','rose','sage','plum'] as const;

function CapsuleNumber({value}:{value:number}) {
  return finite(value)?<span className="dashboard-capsule-number"><span className="dashboard-visually-hidden">{numberLabel(value)}</span><span aria-hidden="true"><DotNumber value={String(Number(value.toFixed(2)))} calm density="coarse"/></span></span>:<span className="dashboard-capsule-missing">{copy.glass.missing}</span>;
}

function EvolutionChart({readings,current,marker}:{readings:DatedReading[];current:string;marker:DashboardMarker}) {
  const id=useId().replaceAll(':','');
  if(!readings.length)return <p className="dashboard-glass-empty">{copy.glass.noReadings}</p>;
  const values=readings.map(item=>item.marker.value);
  const bounds=marker.rangeComparable?[...values,...marker.range]:values;
  const low=Math.min(...bounds),high=Math.max(...bounds),padding=Math.max((high-low)*.18,Math.abs(high)*.02,.05);
  const y=(value:number)=>svgNumber(182-(value-(low-padding))/(high-low+padding*2)*145);
  const firstDate=Date.parse(readings[0].report.date),lastDate=Date.parse(readings[readings.length-1].report.date),duration=lastDate-firstDate;
  const points=readings.map(item=>({x:svgNumber(duration>0?56+(Date.parse(item.report.date)-firstDate)*408/duration:260),y:y(item.marker.value),id:item.report.id}));
  const selected=points.find(point=>point.id===current)??points[points.length-1];
  const path=points.map((point,index)=>`${index?'L':'M'}${point.x} ${point.y}`).join(' ');
  return <div className="dashboard-glass-chart"><svg viewBox="0 0 520 230" role="img" aria-labelledby={`${id}-chart-title`}><title id={`${id}-chart-title`}>{`${marker.name}: ${readings.map(item=>`${dateLabel(item.report.date)}, ${numberLabel(item.marker.value)} ${marker.unit}`).join('; ')}`}</title><defs><pattern id={`${id}-chart-dots`} width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r=".6" fill="currentColor" opacity=".18"/></pattern></defs><rect x="36" y="29" width="448" height="160" fill={`url(#${id}-chart-dots)`}/>{marker.rangeComparable&&<rect x="36" y={y(marker.range[1])} width="448" height={svgNumber(y(marker.range[0])-y(marker.range[1]))} rx="3" fill="currentColor" opacity=".07"/>}<path d="M36 199H484" stroke="currentColor" opacity=".22" strokeDasharray="1 5"/>{points.length>1&&<path className="dashboard-evolution-line" d={path} fill="none" stroke="currentColor" strokeWidth="1.3" strokeDasharray="2 5" strokeOpacity=".66"/>}{points.map(point=><circle key={point.id} cx={point.x} cy={point.y} r="3" fill="currentColor" opacity={point.id===current?1:.58}/>)}<path d={`M${selected.x} ${selected.y}V211`} stroke="currentColor" opacity=".52" strokeDasharray="1 5"/><circle cx={selected.x} cy={selected.y} r="18" fill="currentColor" fillOpacity=".1" stroke="currentColor" strokeOpacity=".45"/><circle cx={selected.x} cy={selected.y} r="3.5" fill="currentColor"/></svg>{readings.length===1&&<p className="dashboard-single-reading">{copy.glass.single}</p>}</div>;
}

function CapsuleRange({marker}:{marker:DashboardMarker}) {
  if(!finite(marker.value)||!marker.rangeComparable)return <div className="dashboard-glass-empty">{finite(marker.value)?copy.glass.rangeUnavailable:copy.glass.missing}</div>;
  const low=Math.min(marker.domain[0],marker.value),high=Math.max(marker.domain[1],marker.value),span=high-low||1;
  const at=(value:number)=>svgNumber((value-low)/span*100);
  return <div className="dashboard-capsule-range"><div><span>{copy.glass.range}</span><strong>{numberLabel(marker.range[0])}–{numberLabel(marker.range[1])} <small>{marker.unit}</small></strong></div><div className="dashboard-capsule-range-track" aria-hidden="true"><i style={{left:`${at(marker.range[0])}%`,width:`${at(marker.range[1])-at(marker.range[0])}%`}}/><b style={{left:`${at(marker.value)}%`}}/></div><div className="dashboard-capsule-range-scale" aria-hidden="true"><span>{numberLabel(low)}</span><span>{numberLabel(high)}</span></div><p>{copy.glass.rangeNote}</p></div>;
}

/** The approved BiomarkerGallery capsule interaction, driven by actual shared report fixtures. */
export function DashboardBiomarkerGallery({markers,report,state}:{markers:DashboardMarker[];report:Report;state:PreviewState}) {
  const [category,setCategory]=useState('all'),[selectedKey,setSelectedKey]=useState(''),[view,setView]=useState<GalleryView>('history'),[readingId,setReadingId]=useState(report.id),[expanded,setExpanded]=useState(false);
  const categories=Array.from(new Set(markers.map(marker=>marker.category)));
  const filtered=[...markers].filter(marker=>category==='all'||marker.category===category).sort((a,b)=>priority[a.status]-priority[b.status]);
  const selected=filtered.find(marker=>marker.key===selectedKey)??filtered[0];
  const readings=selected?dashboardMarkerHistory(state,report,selected):[];
  const current=readings.find(item=>item.report.id===readingId)??readings.find(item=>item.report.id===report.id);
  const readingReport=current?.report??report,readingMarker=current?.marker??selected;
  const readingIndex=readings.findIndex(item=>item.report.id===readingReport.id);
  const tiles=expanded?filtered:filtered.slice(0,5);
  const changeCategory=(value:string)=>{setCategory(value);setSelectedKey('');setReadingId(report.id);setExpanded(false);};
  const chooseMarker=(key:string)=>{setSelectedKey(key);setReadingId(report.id);};
  return <section id="dashboard-biomarkers" className="dashboard-markers" aria-label={copy.markers.title}><div className="dashboard-section-heading dashboard-biomarker-heading"><div><p className="dashboard-mini-label">04 / CADA SEÑAL</p><h2>{copy.markers.title}</h2></div><p>{copy.markers.description}</p></div><div className="dashboard-category-filters" role="group" aria-label={copy.markers.filterLabel}><button type="button" aria-pressed={category==='all'} onClick={()=>changeCategory('all')}>{copy.markers.all}</button>{categories.map(item=><button key={item} type="button" aria-pressed={category===item} onClick={()=>changeCategory(item)}>{item}</button>)}</div>
    {!selected||!readingMarker?<p className="dashboard-inline-empty">{copy.markers.empty}</p>:<div className="dashboard-glass-console" aria-label={copy.glass.aria}><div className="dashboard-glass-gallery"><div className="dashboard-glass-explorer"><label className="dashboard-mobile-marker-picker"><span>Biomarcador</span><select value={selected.key} onChange={event=>chooseMarker(event.target.value)}>{filtered.map(marker=><option key={marker.key} value={marker.key}>{marker.name}</option>)}</select></label><div className="dashboard-glass-views" role="group" aria-label={copy.glass.viewLabel}>{copy.glass.views.map(item=><button key={item.id} type="button" aria-pressed={view===item.id} onClick={()=>setView(item.id)}>{item.label}</button>)}</div><article className="dashboard-main-capsule eva-glass eva-glass-lilac"><div className="dashboard-main-capsule-heading"><div><p>{readingMarker.category}</p><h3>{readingMarker.name}</h3></div><span className="dashboard-glass-status" data-status={readingMarker.status}><i aria-hidden="true"/>{zoneLabels.es[readingMarker.zone]}</span></div><div className="dashboard-main-value"><span>{finite(readingMarker.value)?numberLabel(readingMarker.value):copy.unavailable}</span>{finite(readingMarker.value)&&<small>{readingMarker.unit}</small>}</div><div className="dashboard-capsule-visual" key={`${view}-${selected.key}`}>
      {view==='history'&&<EvolutionChart readings={readings} current={readingReport.id} marker={selected}/>}
      {view==='range'&&<CapsuleRange marker={readingMarker}/>}
      {view==='reading'&&<div className="dashboard-focus-reading"><CapsuleNumber value={readingMarker.value}/><span>{readingMarker.unit}</span><p>{selectMarkerInterpretation(readingReport,readingMarker.key,'es',state.profile.literacy).text??'Esta lectura todavía no tiene una interpretación disponible.'}</p></div>}
    </div><div className="dashboard-dated-readings" role="group" aria-label={copy.glass.readings}>{readings.map((item,index)=><button type="button" key={item.report.id} aria-pressed={readingReport.id===item.report.id} aria-label={`${dateLabel(item.report.date)}: ${numberLabel(item.marker.value)} ${item.marker.unit}`} onClick={()=>setReadingId(item.report.id)}><span>{String(index+1).padStart(2,'0')}</span><small>{new Intl.DateTimeFormat('es',{month:'short',year:'2-digit',timeZone:'UTC'}).format(new Date(item.report.date))}</small></button>)}</div><div className="dashboard-capsule-period"><button type="button" aria-label={copy.glass.previous} disabled={readingIndex<=0} onClick={()=>setReadingId(readings[readingIndex-1].report.id)}><span className="dashboard-arrow-back"><Arrow/></span></button><span>{dateLabel(readingReport.date)}</span><button type="button" aria-label={copy.glass.next} disabled={readingIndex<0||readingIndex>=readings.length-1} onClick={()=>setReadingId(readings[readingIndex+1].report.id)}><Arrow/></button></div><a className="dashboard-capsule-detail-link" href={`/es/biomarker/${selected.key}?report=${readingReport.id}`}>{copy.glass.open}<Arrow/></a></article><p className="dashboard-glass-explanation">{view==='history'?copy.glass.historyNote:copy.glass.rangeNote}</p><BiomarkerExplanation marker={readingMarker} report={readingReport} state={state}/></div>
    <div className="dashboard-capsule-selection"><p className="dashboard-capsule-selection-label">{copy.glass.caption}<span>{dateLabel(readingReport.date)}</span></p><div className="dashboard-capsule-tiles" role="group" aria-label={copy.glass.select}>{tiles.map((marker,index)=>{const reading=dashboardMarkerForReport(state,readingReport,marker.key);return <button key={marker.key} className={`dashboard-marker-capsule eva-glass dashboard-tone-${tones[index%tones.length]}`} type="button" aria-pressed={selected.key===marker.key} onClick={()=>chooseMarker(marker.key)} aria-label={`${marker.name}: ${reading&&finite(reading.value)?`${numberLabel(reading.value)} ${reading.unit}`:copy.glass.missing}. ${reading?copy.glass.status[reading.status]:copy.glass.status.unknown}`}><span className="dashboard-capsule-name">{marker.name}</span><CapsuleNumber value={reading?.value??Number.NaN}/><span className="dashboard-capsule-unit">{reading?.unit??marker.unit}</span><span className="dashboard-capsule-status" data-status={reading?.status??'unknown'}><i aria-hidden="true"/>{copy.glass.status[reading?.status??'unknown']}</span></button>;})}{filtered.length>5&&<button type="button" className="dashboard-capsule-expand" aria-expanded={expanded} onClick={()=>setExpanded(value=>!value)}><span aria-hidden="true">{expanded?'−':'+'}</span><span>{expanded?copy.glass.collapse:copy.glass.expand(filtered.length)}</span></button>}</div><a className="dashboard-all-markers" href={`/es/labs/${readingReport.id}`}>{copy.markers.allLink(readingReport.markerKeys.length)}<Arrow/></a></div></div></div>}
  </section>;
}

export function selectDashboardKitStatus(state: PreviewState) {
  const hasKit = state.plan === 'quarterly' && Number.isInteger(state.kitStep) && state.kitStep >= 0 && state.kitStep <= 4;
  const report = reportForKit(state);
  const ready = Boolean(state.session && state.deletionStatus !== 'completed' && canReadReport(report, state.profile.healthConsent));
  const current = hasKit ? state.kitStep : 0;
  const readiness = reportReadiness(report, state.profile.healthConsent);
  const pending = readiness === 'pending_context' ? 'Falta completar el contexto del informe' : readiness === 'processing' ? 'Informe del kit en preparación' : readiness === 'error' ? 'Informe del kit pendiente de revisión' : readiness === 'no_consent' ? 'Revisa tus permisos' : 'Informe del kit aún no vinculado';
  return {hasKit, current, ready, label: !hasKit ? copy.kit.empty : current === 4 ? ready ? copy.kit.completed : pending : copy.kit.progress};
}

function KitSummary({state}: {state: PreviewState}) {
  const free = state.plan === 'free', full = state.plan === 'full_panel';
  const {hasKit, current, label} = selectDashboardKitStatus(state);
  return <section className="dashboard-kit" aria-labelledby="dashboard-kit-title"><div className="dashboard-section-heading"><div><p className="dashboard-mini-label">{copy.plan[state.plan]}</p><h2 id="dashboard-kit-title">{free ? copy.kit.freeTitle : full ? copy.kit.fullTitle : copy.kit.title}</h2></div><span className={`dashboard-plan-state is-${state.subscriptionStatus}`}>{free ? copy.plan.free : copy.subscription[state.subscriptionStatus]}</span></div><p className="dashboard-kit-copy">{free ? copy.kit.freeCopy : copy.kit.activeCopy}</p>
    {!free && !full && <>{hasKit && <ol className="dashboard-kit-progress" aria-label={copy.kit.label}>{copy.kit.steps.map((label,index)=><li key={label} aria-current={index===current?'step':undefined} data-complete={index<current}><i aria-hidden="true"/><span>{label}</span></li>)}</ol>}<p className="dashboard-kit-status">{label}</p></>}
    <a href={free?'/es/pricing':'/es/book'}>{free?copy.plans:full?copy.kit.fullView:copy.kit.view}<Arrow/></a>
  </section>;
}


type WaitMode = keyof typeof copy.waiting;
function waitMode(state: PreviewState, report?: Report): WaitMode {
  if (!state.session || state.deletionStatus==='completed') return 'session';
  if (!state.profile.healthConsent) return 'consent';
  if (report?.status === 'error') return 'error';
  if (report?.status === 'pending_context' || report && !report.contextComplete) return 'context';
  if (report?.status === 'processing') return 'processing';
  if (state.scenario === 'kit') return 'kit';
  return 'new';
}

function PendingReading({state, report}: {state: PreviewState; report?: Report}) {
  const mode = waitMode(state,report), content = copy.waiting[mode];
  const href = mode === 'context' && report ? `/es/labs/${report.id}/context` : mode === 'processing' && report ? `/es/labs/${report.id}` : content.href;
  const current = mode === 'context' ? 1 : mode === 'processing' ? 2 : 0;
  return <section className={`dashboard-pending dashboard-pending-${mode}`} aria-labelledby="dashboard-pending-title"><div className="dashboard-pending-copy"><p className="dashboard-mini-label">{content.eyebrow}</p><h2 id="dashboard-pending-title">{content.title}</h2><p>{content.copy}</p>{report && state.profile.healthConsent && state.session && <SourceTag>{report.name} · {dateLabel(report.date)}</SourceTag>}<div className="dashboard-pending-actions"><ActionLink href={href}>{content.primary}</ActionLink><a href={content.secondaryHref}>{content.secondary}<Arrow/></a></div></div><div className="dashboard-pending-visual" aria-hidden="true"><div className="dashboard-empty-sheet"><span/><span/><span/><span/><span/><span/></div><div className="dashboard-empty-shadow"/></div>{['context','processing','error'].includes(mode) && <ol className="dashboard-report-progress" aria-label={copy.stageLabel}>{copy.stages.map((label,index)=><li key={label} aria-current={index===current?'step':undefined}><span>0{index+1}</span>{label}</li>)}</ol>}</section>;
}

export default function DashboardPage() {
  const {state, hydrated} = usePreview();
  const {latest, latestSubmission, pending, ready, markers, paid} = selectDashboardReading(state);
  const executiveStory = selectExecutiveStory(state);
  if (!hydrated) return <div className="page-dashboard"><AsyncState message={copy.loading}/></div>;
  const toReview = markers.filter(marker => marker.status === 'attention' || marker.status === 'action');
  const optimal = markers.filter(marker => marker.status === 'optimal').length;
  const unknown = markers.filter(marker => marker.status === 'unknown').length;
  const canShowSupport = state.session && state.deletionStatus!=='completed' && state.profile.healthConsent;
  return <div className="page-dashboard">
    {ready?<header className="dashboard-ready-heading"><h1>{copy.greeting(state.profile.firstName)}</h1><a href="/es/upload">{copy.upload}<Arrow/></a></header>:<AppPageHeader eyebrow={copy.eyebrow} title={copy.greeting(state.profile.firstName)} action={state.session?<ActionLink href="/es/upload" secondary>{copy.upload}</ActionLink>:undefined}/>}
    {ready&&latest&&<nav className="dashboard-section-nav" aria-label="En esta lectura"><a href="#dashboard-signature"><span>01</span>Tu firma</a><a href="#dashboard-reading"><span>02</span>Tu lectura</a><a href="#dashboard-actions"><span>03</span>Tus acciones</a><a href="#dashboard-biomarkers"><span>04</span>Biomarcadores</a></nav>}
    {canShowSupport&&pending&&<aside className="dashboard-new-submission" aria-label="Informe más reciente en preparación"><div><p className="dashboard-mini-label">UNA NUEVA LECTURA</p><strong>{pending.name}</strong><p>{dateLabel(pending.date)} · {copy.history.statuses[pending.status]}. {latest?'Tu última lectura disponible sigue aquí.':'Puedes consultar su estado.'}</p></div><a href={pending.status==='pending_context'?`/es/labs/${pending.id}/context`:`/es/labs/${pending.id}`}>{pending.status==='pending_context'?'Completar contexto':'Ver estado'}<Arrow/></a></aside>}
    {ready && latest ? <>
      <HealthSignature report={latest} paid={paid} profile={state.profile} markers={markers} reportResults={previewReportResults(latest,markers)} ageReferenceDate={!finite(state.profile.current_ba)||state.profile.current_ba<=0?latest.date:undefined}/><div className="dashboard-report-masthead"><div><p className="dashboard-mini-label">ÚLTIMO INFORME · DATOS DE EJEMPLO</p><h2>{latest.name}</h2><p>{dateLabel(latest.date)} · {copy.source[latest.source]}</p></div><a href={`/es/labs/${latest.id}`} className="eva-button">{copy.reportLink}<Arrow/></a></div>{executiveStory&&<ExecutiveReading key={`reading:${executiveStory.signature}`} story={executiveStory} literacy={state.profile.literacy}/>}{executiveStory&&<DashboardActionables key={`actionables:${executiveStory.signature}`} story={executiveStory}/>}<DashboardBiomarkerGallery key={`${latest.id}-${latest.version??1}`} markers={markers} report={latest} state={state}/><div className="dashboard-follow-up"><details id="dashboard-estimate-method" className="dashboard-estimate-disclosure"><summary>Cómo se calculan tus estimaciones <span>Método y procedencia</span></summary><p>Este apartado muestra cifras ficticias para revisar la presentación. No son una evaluación personal ni una validación del método.</p>{paid&&<EstimateMetadata report={latest} profile={state.profile}/>}</details></div>
      <section className="dashboard-overview" aria-label={copy.overviewLabel}><div className="dashboard-total"><strong>{markers.length}</strong><span>{copy.analysed}</span></div><div className="dashboard-distribution"><div className="dashboard-distribution-bar" aria-hidden="true">{optimal>0&&<span className="is-optimal" style={{flex:optimal}}/>}{toReview.length>0&&<span className="is-attention" style={{flex:toReview.length}}/>}{unknown>0&&<span className="is-unknown" style={{flex:unknown}}/>}</div><div className="dashboard-distribution-legend"><span><i className="is-optimal"/>{copy.inRange}<b>{optimal}</b></span><span><i className="is-attention"/>{copy.review}<b>{toReview.length}</b></span>{unknown>0&&<span><i className="is-unknown"/>{copy.unknown}<b>{unknown}</b></span>}</div></div></section><p className="dashboard-counts-note">{copy.countsNote}</p>

    </> : <><PendingReading state={state} report={latestSubmission}/>{canShowSupport && <div className="dashboard-pending-support"><h2>{copy.emptyNext.title}</h2><p>{copy.emptyNext.copy}</p><div><a href="/es/how-it-works">{copy.emptyNext.method}<Arrow/></a><a href="/es/profile">{copy.emptyNext.profile}<Arrow/></a></div></div>}</>}
    {canShowSupport && <><div className="dashboard-bottom-grid"><WearableObservations state={state}/><KitSummary state={state}/></div>{state.reports.length>0&&<section className="dashboard-history" aria-labelledby="dashboard-history-title"><div className="dashboard-section-heading"><h2 id="dashboard-history-title">{copy.history.title}</h2><a href="/es/labs/manage">{copy.history.link}<Arrow/></a></div><div>{[...state.reports].filter(report=>report.status!=='archived').sort((a,b)=>b.date.localeCompare(a.date)).slice(0,3).map(report=><a key={report.id} href={report.status==='pending_context'?`/es/labs/${report.id}/context`:`/es/labs/${report.id}`}><div><span>{dateLabel(report.date)}</span><h3>{report.name}</h3></div><StatusIndicator status={report.status} label={copy.history.statuses[report.status]}/><Arrow/></a>)}</div></section>}</>}
  </div>;
}
