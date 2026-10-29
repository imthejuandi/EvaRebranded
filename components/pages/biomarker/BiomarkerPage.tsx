'use client';

import {useEffect, useId, useRef, useState, type FormEvent} from 'react';
import {ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, Pencil, X} from 'lucide-react';
import {usePreview} from '@/components/preview/PreviewProvider';
import {AppPageHeader, AsyncState, EmptyState, SourceTag, StatusIndicator} from '@/components/preview/AppPrimitives';
import {canReadReport, reportReadiness, invalidateReportEstimates, statusForZone} from '@/lib/preview/policy';
import {dateLabel, numberLabel} from '@/lib/preview/fixtures';
import {selectMarkerInterpretation, zoneLabels} from '../dashboard/dashboard-reading';
import type {Marker, MarkerStatus, PreviewState, Report, ServerZone} from '@/lib/preview/model';

export const biomarkerCopy = {es: {
  back:'Volver al informe', eyebrow:'Ficha de biomarcador', fallbackTitle:'Biomarcador', loading:'Preparando tu lectura de ejemplo…',
  description:'Su valor, su fecha y sus referencias.', sample:'Datos de ejemplo',
  access:{title:'Entra para consultar tus lecturas.',body:'Inicia una sesión de ejemplo para explorar este biomarcador.',action:'Entrar a la vista previa'},
  healthGate:{title:'Completa el consentimiento de salud.',body:'Antes de consultar resultados, revisa y acepta el tratamiento de datos de salud en tu perfil.',action:'Revisar mi consentimiento'},
  missingMarker:{title:'Este biomarcador no está disponible.',body:'No hay una ficha de ejemplo para esta dirección. Puedes volver al informe y elegir otro biomarcador.',action:'Ver mis análisis'},
  missingReport:{title:'No encontramos ese informe.',body:'El informe seleccionado no está disponible en esta vista previa. Elige otra lectura para continuar.',action:'Elegir otro informe'},
  empty:{title:'Tu primera lectura empieza aquí.',body:'Todavía no tienes un informe disponible para este biomarcador. Puedes subir una analítica existente o explorar un kit.',upload:'Subir una analítica',book:'Explorar un kit'},
  unavailable:{title:'Todavía no hay un valor disponible.',body:'Este informe no contiene una lectura utilizable de este biomarcador. No la sustituimos por el valor de otra fecha.',action:'Abrir el informe'},
  reportStatus:{ready:'Disponible',processing:'En proceso',pending_context:'Necesita contexto',error:'Requiere revisión',archived:'Archivado'},
  states:{processing:'Este informe se está procesando. Sus valores estarán disponibles cuando termine la lectura.',pending_context:'Falta completar el contexto de este informe para consultar sus resultados.',error:'Este informe necesita revisión. Abre el informe para revisar el estado o volver a intentarlo.',archived:'Este informe está archivado. No se utiliza como una lectura activa.'},
  source:{kit:'Kit EVA',upload:'Analítica subida'},
  labels:{report:'Informe y fecha',selected:'Lectura seleccionada',unit:'Unidad',interval:'Intervalo orientativo',scale:'Escala de visualización',rangeUnavailable:'Intervalo no disponible',rangeUnknown:'Sin clasificación disponible',rangeNote:'El intervalo de esta vista es ilustrativo. No sustituye el intervalo de tu laboratorio.',rangeOutside:'Fuera del intervalo orientativo',source:'Origen de la lectura',date:'Fecha de recogida',value:'Valor',status:'Clasificación',actions:'Acciones',context:'Ver el contexto del informe'},
  history:{eyebrow:'01 / Lecturas en el tiempo',title:'Cada punto, una fecha.',body:'Selecciona un punto o una fila para situar esa lectura en el instrumento.',single:'Hay una sola lectura disponible. Hace falta otra fecha para comparar valores.',note:'Solo se muestran lecturas de informes disponibles. Los espacios entre puntos no representan mediciones continuas.',unitNote:'El gráfico agrupa lecturas con la misma unidad y conserva su origen en la tabla. Compartir unidad no confirma que procedan del mismo laboratorio o método; no se infiere un cambio clínico.',table:'Lecturas de este biomarcador',select:'Seleccionar lectura',edit:'Editar lectura',count:'lecturas disponibles'},
  explain:{eyebrow:'02 / Entender el dato',title:'Qué mide. Qué aporta.',definition:'Qué mide',interpretation:'Cómo leerlo',level:'Nivel de detalle',levels:{simple:'Esencial',balanced:'Con contexto',advanced:'Más detalle'},detail:'El valor y la unidad se leen juntos. Un resultado se interpreta con la fecha de recogida, los otros biomarcadores y el intervalo del laboratorio.',advanced:'El intervalo coloreado es el intervalo orientativo del ejemplo. Los extremos de la escala solo organizan el dibujo: no son umbrales clínicos. Se muestran hasta dos decimales; la edición conserva el valor guardado. No se han añadido límites críticos ni un intervalo de laboratorio que no figure en los datos.',unknown:'Esta lectura no tiene una clasificación utilizable. Conservamos el valor, si existe, sin asignarle una zona por defecto.'},
  references:{eyebrow:'Trazabilidad',title:'De dónde sale esta lectura.',body:'El origen y la fecha pertenecen al informe seleccionado. Los textos y los intervalos son ejemplos educativos de esta vista previa.',laboratory:'Intervalo del laboratorio',notProvided:'No incluido en los datos del ejemplo',method:'Consultar la metodología',report:'Abrir el informe de origen'},
  wearable:{eyebrow:'Más contexto',title:'Tu vida entre lecturas.',active:'El ejemplo incluye una importación de actividad. Puedes revisar sus datos y preferencias en tu perfil.',empty:'Puedes explorar cómo una importación de actividad y descanso acompaña a tus resultados desde el perfil.',note:'Esta ficha no muestra correlaciones calculadas ni atribuye cambios del biomarcador a tu actividad.',activeAction:'Ver la importación',emptyAction:'Explorar la importación'},
  next:{eyebrow:'La siguiente lectura',title:'Vuelve a mirar con perspectiva.',body:'El seguimiento trimestral permite comparar lecturas de distintas fechas. Consulta el kit y sus condiciones para planificar tu siguiente muestra.',action:'Ver el siguiente kit',geneticEyebrow:'Marcador genético',geneticTitle:'Una información de otra naturaleza.',geneticBody:'La referencia de este marcador lo identifica como genético. Su interpretación y la necesidad de repetir la prueba dependen del tipo de análisis; no se aplica por defecto la cadencia trimestral.',geneticAction:'Consultar el método'},
  edit:{title:'Corregir una lectura de ejemplo',description:'Revisa el valor y la unidad contra el informe de origen. Este cambio se guarda solo en la vista previa.',value:'Valor de la lectura',unit:'Unidad del informe',unitHint:'Revisa la unidad del informe. Si la cambias, los valores y los intervalos no se convierten automáticamente.',valueError:'Escribe un número válido, igual o mayor que cero. Puedes usar una coma decimal.',unitError:'Escribe una unidad válida, por ejemplo mg/dL. Usa un máximo de 24 caracteres.',changed:'El informe ya no está disponible para editarlo. Vuelve a abrir la lectura.',failed:'No se pudo guardar la simulación. Revisa los datos y vuelve a intentarlo.',save:'Guardar cambio de ejemplo',saving:'Guardando…',cancel:'Cancelar',close:'Cerrar edición',saved:'Cambio guardado. El informe y sus estimaciones quedan pendientes de actualizar.',differentUnit:'Esta unidad no coincide con la referencia del ejemplo. La lectura se conserva sin convertirla ni asignarle un intervalo.'},
}};
const c = biomarkerCopy.es;
type Reading = {report:Report;value:number;unit:string;status:MarkerStatus;zone:ServerZone;range:NumericRange|null};
type NumericRange = [number,number];
type ReferenceMarker = Marker & {is_genetic?:boolean};

const finite=(value:unknown):value is number=>typeof value==='number'&&Number.isFinite(value);
function validRange(value:unknown):value is NumericRange {return Array.isArray(value)&&value.length===2&&finite(value[0])&&finite(value[1])&&value[1]>value[0];}
function readingValue(marker:Marker,report:Report):number|null {
  if(!canReadReport(report)||!report.markerKeys.includes(marker.key))return null;
  const override=report.markerValues?.[marker.key];
  const value=override?override.value:report.id==='demo-junio'?marker.value:report.id==='demo-marzo'?marker.history?.[1]:null;
  return finite(value)?value:null;
}
function readingStatus(marker:Marker,value:number,report:Report,unit:string):MarkerStatus {
  const zone=report.markerValues?.[marker.key]?.zone;if(zone)return statusForZone(zone);
  if(report.markerValues?.[marker.key]||unit!==marker.unit||!validRange(marker.range)||marker.status==='unknown')return 'unknown';
  if(report.id==='demo-junio'&&!report.markerValues?.[marker.key]&&marker.status==='action')return 'action';
  return value<marker.range[0]||value>marker.range[1]?'attention':'optimal';
}
function getReadings(marker:Marker,reports:Report[]):Reading[] {
  return reports.flatMap(report=>{const value=readingValue(marker,report),unit=report.markerValues?.[marker.key]?.unit??marker.unit;const row=report.markerValues?.[marker.key],status=value===null?'unknown':readingStatus(marker,value,report,unit);const zone:ServerZone=row?.zone??(status==='optimal'?'optimal':status==='attention'?(value!<marker.range[0]?'below_optimal':'above_optimal'):'unclassified');const range=row?(finite(row.optimal_low)&&finite(row.optimal_high)&&row.optimal_high>row.optimal_low?[row.optimal_low,row.optimal_high] as NumericRange:null):unit===marker.unit?marker.range:null;return value===null?[]:[{report,value,unit,status,zone,range}];}).sort((a,b)=>a.report.date.localeCompare(b.report.date));
}
function chartDomain(marker:Marker,readings:Reading[],unit:string):NumericRange {
  const referenceUnit=unit===marker.unit;
  const bounds=[...readings.filter(reading=>reading.unit===unit).map(reading=>reading.value),...(referenceUnit&&validRange(marker.domain)?marker.domain:[]),...(referenceUnit&&validRange(marker.range)?marker.range:[])];
  const lo=bounds.length?Math.min(...bounds):0,hi=bounds.length?Math.max(...bounds):1;
  return hi>lo?[lo,hi]:[Math.max(0,lo-1),hi+1];
}
const percent=(value:number,domain:NumericRange)=>Math.max(0,Math.min(100,(value-domain[0])/(domain[1]-domain[0])*100));
const reportHref=(id:string)=>`/es/labs/${encodeURIComponent(id)}`;

function MeasurementInstrument({marker,reading,domain}:{marker:Marker;reading:Reading;domain:NumericRange}) {
  const uid=useId().replace(/:/g,''),range=reading.range;
  const classified=reading.status!=='unknown'&&range!==null;
  const x=45+percent(reading.value,domain)*8.1;
  const start=range?45+percent(range[0],domain)*8.1:0;
  const width=range?(percent(range[1],domain)-percent(range[0],domain))*8.1:0;
  return <section id="biomarker-result" className="biomarker-instrument eva-glass" aria-labelledby="biomarker-selected-heading">
    <div className="biomarker-instrument-meta"><p id="biomarker-selected-heading" className="eva-kicker">{c.labels.selected}</p><span>{dateLabel(reading.report.date)} · v{reading.report.version??1}</span></div>
    <div className="biomarker-readout"><div><strong>{numberLabel(reading.value)}</strong><span>{reading.unit}</span></div><StatusIndicator status={reading.status} label={zoneLabels.es[reading.zone]}/></div>
    <div className="biomarker-instrument-plot" aria-hidden="true">
      <svg viewBox="0 0 900 185" fill="none">
        <defs><pattern id={`${uid}-halftone`} width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.3" fill="#fffdf6"/></pattern><linearGradient id={`${uid}-edge`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fffdf6" stopOpacity=".12"/><stop offset="1" stopColor="#fffdf6" stopOpacity=".02"/></linearGradient></defs>
        <path d="M45 130H855" stroke="#fffdf6" strokeOpacity=".35"/>
        {classified&&<><rect x={start} y="24" width={width} height="106" fill={`url(#${uid}-edge)`}/><rect x={start} y="24" width={width} height="106" fill={`url(#${uid}-halftone)`} opacity=".45"/><path d={`M${start} 22v111M${start+width} 22v111`} stroke="#fffdf6" strokeOpacity=".65"/></>}
        {Array.from({length:41},(_,i)=><path key={i} d={`M${45+i*20.25} 130v${i%10===0?22:i%5===0?14:7}`} stroke="#fffdf6" strokeOpacity={i%10===0?.6:.24}/>) }
        <path d={`M${x} 10v133`} stroke="#fffdf6" strokeWidth="1.5"/><circle cx={x} cy="130" r="6" fill="#4b4658" stroke="#fffdf6" strokeWidth="2"/>
        <path d={`M${x-4} 9h8l-4 6z`} fill="#fffdf6"/>
        {[0,.25,.5,.75,1].map(fraction=><text key={fraction} x={45+fraction*810} y="177" textAnchor="middle" fontSize="11" fontFamily="monospace" fill="#f0eee6">{numberLabel(domain[0]+(domain[1]-domain[0])*fraction)}</text>)}
      </svg>
    </div>
    <div className="biomarker-instrument-bottom"><div><span className="biomarker-range-key" aria-hidden="true"/><span>{classified?c.labels.interval:c.labels.rangeUnknown}</span><strong>{range?`${numberLabel(range[0])}–${numberLabel(range[1])} ${reading.unit}`:c.labels.rangeUnavailable}</strong></div><p>{reading.unit===marker.unit?c.labels.rangeNote:c.edit.differentUnit}</p></div>
  </section>;
}

function HistoryStudy({readings,selectedId,domain,plotUnit,onSelect,onEdit}:{marker:Marker;readings:Reading[];selectedId:string;domain:NumericRange;plotUnit:string;onSelect:(id:string)=>void;onEdit:(reading:Reading)=>void}) {
  const plotted=readings.filter(reading=>reading.unit===plotUnit);
  const first=Date.parse(plotted[0].report.date),last=Date.parse(plotted[plotted.length-1].report.date);
  const xOf=(reading:Reading)=>plotted.length===1||first===last?450:65+(Date.parse(reading.report.date)-first)/(last-first)*770;
  const yOf=(reading:Reading)=>205-percent(reading.value,domain)*1.55;
  const range=plotted.find(reading=>reading.report.id===selectedId)?.range??null;
  return <section id="biomarker-history" className="biomarker-history" aria-labelledby="biomarker-history-heading">
    <div className="biomarker-section-heading"><div><p className="eva-kicker">{c.history.eyebrow}</p><h2 id="biomarker-history-heading">{c.history.title}</h2></div><p>{plotted.length===1?c.history.single:c.history.body}</p></div>
    <div className="biomarker-history-chart">
      <svg viewBox="0 0 900 260" preserveAspectRatio="none" fill="none" aria-hidden="true">
        {range&&<rect x="36" y={205-percent(range[1],domain)*1.55} width="828" height={(percent(range[1],domain)-percent(range[0],domain))*1.55} fill="#a7b394" fillOpacity=".19"/>}
        {[50,127.5,205].map((y,i)=><g key={y}><path d={`M36 ${y}H864`} stroke="#171b18" strokeOpacity=".12" strokeDasharray="2 6"/><text x="39" y={y-8} fontSize="10" fontFamily="monospace" fill="#757b70">{numberLabel(domain[1]-(domain[1]-domain[0])*i/2)}</text></g>)}
        {plotted.map(reading=><path key={reading.report.id} d={`M${xOf(reading)} ${yOf(reading)}V226`} stroke="#171b18" strokeOpacity=".18" strokeDasharray="2 5"/>)}
        <path d="M36 226H864" stroke="#171b18" strokeOpacity=".23"/>
      </svg>
      {plotted.map(reading=><button key={reading.report.id} type="button" className="biomarker-history-point" style={{left:`${xOf(reading)/9}%`,top:`${yOf(reading)/2.6}%`}} aria-label={`${c.history.select}: ${dateLabel(reading.report.date)}, ${numberLabel(reading.value)} ${reading.unit}`} aria-pressed={selectedId===reading.report.id} onClick={()=>onSelect(reading.report.id)}><span aria-hidden="true"/></button>)}
      <div className="biomarker-chart-dates" aria-hidden="true"><span>{dateLabel(plotted[0].report.date)}</span>{plotted.length>1&&<span>{dateLabel(plotted[plotted.length-1].report.date)}</span>}</div>
    </div>
    <p className="biomarker-history-note">{c.history.note} {c.history.unitNote} <strong>{plotUnit}</strong></p>
    <div className="biomarker-table-wrap" role="region" aria-label={c.history.table} tabIndex={0}><table><caption className="biomarker-sr-only">{c.history.table}</caption><thead><tr><th scope="col">{c.labels.date}</th><th scope="col">{c.labels.source}</th><th scope="col">{c.labels.value}</th><th scope="col">{c.labels.actions}</th></tr></thead><tbody>{[...readings].reverse().map(reading=><tr key={reading.report.id} data-selected={selectedId===reading.report.id}><th scope="row"><button type="button" onClick={()=>onSelect(reading.report.id)} aria-pressed={selectedId===reading.report.id}>{dateLabel(reading.report.date)}{selectedId===reading.report.id&&<Check size={13} aria-hidden="true"/>}</button></th><td>{c.source[reading.report.source]}</td><td><strong>{numberLabel(reading.value)}</strong><span>{reading.unit}</span></td><td><button type="button" className="biomarker-edit-row" onClick={()=>onEdit(reading)} aria-label={`${c.history.edit}: ${dateLabel(reading.report.date)}`}><Pencil size={15} aria-hidden="true"/><span>{c.history.edit}</span></button></td></tr>)}</tbody></table></div>
  </section>;
}

function EditReading({marker,reading,onClose,onSaved}:{marker:Marker;reading:Reading;onClose:()=>void;onSaved:()=>void}) {
  const {state,request,update}=usePreview(),stateRef=useRef<PreviewState>(state),dialog=useRef<HTMLDialogElement>(null),valueInput=useRef<HTMLInputElement>(null),unitInput=useRef<HTMLInputElement>(null);
  stateRef.current=state;
  const [value,setValue]=useState(String(reading.value)),[unit,setUnit]=useState(reading.unit),[busy,setBusy]=useState(false),[error,setError]=useState(''),[errorField,setErrorField]=useState<'value'|'unit'|null>(null);
  useEffect(()=>{const node=dialog.current;node?.showModal();valueInput.current?.focus();return()=>{node?.close();};},[]);
  async function save(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();if(busy)return;setError('');setErrorField(null);
    const normal=value.trim().replace(',','.');
    if(!/^(?:\d+(?:\.\d+)?|\.\d+)$/.test(normal)||!Number.isFinite(Number(normal))||Number(normal)<0||Number(normal)>Number.MAX_SAFE_INTEGER){setError(c.edit.valueError);setErrorField('value');valueInput.current?.focus();return;}
    const cleanUnit=unit.trim().replace('μ','µ');
    if(!cleanUnit||cleanUnit.length>24||!/^[\p{L}\p{N}µμ%/·.^\-\s()]+$/u.test(cleanUnit)){setError(c.edit.unitError);setErrorField('unit');unitInput.current?.focus();return;}
    const parsed=Number(normal);setBusy(true);
    try {
      const result=await request('marker.edit',{reportId:reading.report.id,markerKey:marker.key,value:parsed,unit:cleanUnit,simulateError:stateRef.current.scenario==='error'});
      if(!result.ok){setError(result.message||c.edit.failed);return;}
      const currentReport=stateRef.current.reports.find(item=>item.id===reading.report.id);
      if(!stateRef.current.session||!stateRef.current.profile.healthConsent||!currentReport||!canReadReport(currentReport,stateRef.current.profile.healthConsent)||!currentReport.markerKeys.includes(marker.key)||!stateRef.current.markers.some(item=>item.key===marker.key)){setError(c.edit.changed);return;}
      update(current=>({...current,
        reports:current.reports.map(item=>item.id===reading.report.id?invalidateReportEstimates({...item,markerValues:{...item.markerValues,[marker.key]:{value:parsed,unit:cleanUnit}}}):item),
        lastAction:c.edit.saved}));
      onSaved();
    } catch {setError(c.edit.failed);} finally {setBusy(false);}
  }
  return <dialog ref={dialog} className="biomarker-edit-dialog" aria-labelledby="biomarker-edit-heading" onCancel={event=>{event.preventDefault();if(!busy)onClose();}}>
    <form onSubmit={save} noValidate><div className="biomarker-modal-top"><p className="eva-kicker">{c.sample}</p><button type="button" aria-label={c.edit.close} onClick={onClose} disabled={busy}><X size={19}/></button></div><h2 id="biomarker-edit-heading">{c.edit.title}</h2><p>{c.edit.description}</p><div className="biomarker-edit-context"><strong>{marker.name}</strong><span>{dateLabel(reading.report.date)} · {c.source[reading.report.source]}</span></div><div className="biomarker-edit-fields"><label className="eva-field">{c.edit.value}<input ref={valueInput} type="text" inputMode="decimal" value={value} onChange={event=>setValue(event.target.value)} required aria-invalid={errorField==='value'} aria-describedby={error?'biomarker-edit-error':undefined} disabled={busy}/></label><label className="eva-field">{c.edit.unit}<input ref={unitInput} value={unit} onChange={event=>setUnit(event.target.value)} required aria-invalid={errorField==='unit'} aria-describedby={error?'biomarker-unit-hint biomarker-edit-error':'biomarker-unit-hint'} disabled={busy}/></label></div><p id="biomarker-unit-hint" className="biomarker-input-hint">{c.edit.unitHint}</p>{error&&<p id="biomarker-edit-error" role="alert" className="eva-form-error">{error}</p>}<div className="biomarker-edit-actions"><button type="button" className="eva-button eva-button-secondary" onClick={onClose} disabled={busy}>{c.edit.cancel}</button><button type="submit" className="eva-button" disabled={busy}>{busy?c.edit.saving:c.edit.save}</button></div></form>
  </dialog>;
}

export default function BiomarkerPage({markerKey}:{markerKey:string}) {
  const {state,hydrated}=usePreview();
  const [selectedId,setSelectedId]=useState<string|null>(null),[queryReady,setQueryReady]=useState(false),[editing,setEditing]=useState<Reading|null>(null),[notice,setNotice]=useState('');
  const [level,setLevel]=useState<PreviewState['profile']['literacy']>('balanced');
  useEffect(()=>{setEditing(null);setNotice('');const sync=()=>{setSelectedId(new URL(window.location.href).searchParams.get('report'));setQueryReady(true);};sync();window.addEventListener('popstate',sync);return()=>window.removeEventListener('popstate',sync);},[markerKey]);
  useEffect(()=>{if(hydrated)setLevel(state.profile.literacy);},[hydrated,state.profile.literacy]);
  const marker=state.markers.find(item=>item.key===markerKey) as ReferenceMarker|undefined;
  const reports=state.reports.filter(report=>report.status!=='archived').sort((a,b)=>b.date.localeCompare(a.date));
  const report=selectedId?state.reports.find(item=>item.id===selectedId):reports.find(item=>canReadReport(item,state.profile.healthConsent)&&item.markerKeys.includes(markerKey))||reports[0];
  const readings=marker?getReadings(marker,state.reports):[];
  const selectedReading=report?readings.find(item=>item.report.id===report.id):undefined;
  const interpretation=report?selectMarkerInterpretation(report,markerKey,'es',level):null;
  const plotUnit=selectedReading?.unit||readings[readings.length-1]?.unit||marker?.unit||'';
  const domain=marker?chartDomain(marker,readings,plotUnit):[0,1] as NumericRange;
  function selectReport(id:string){setSelectedId(id);setNotice('');const url=new URL(window.location.href);url.searchParams.set('report',id);window.history.replaceState(window.history.state,'',url);}
  const title=marker?.name||c.fallbackTitle;
  const header=<><a className="biomarker-back" href={report?reportHref(report.id):'/es/labs'}><ArrowLeft size={16} aria-hidden="true"/>{c.back}</a><AppPageHeader eyebrow={marker?`${c.eyebrow} / ${marker.category}`:c.eyebrow} title={title} description={c.description}/></>;
  if(!hydrated||!queryReady)return <div className="page-biomarker">{header}<AsyncState message={c.loading}/></div>;
  if(!state.session||state.deletionStatus==='completed')return <div className="page-biomarker">{header}<EmptyState title={c.access.title} description={c.access.body}><a className="eva-button" href={`/es/login?redirect=${encodeURIComponent(`/es/biomarker/${markerKey}${selectedId?`?report=${selectedId}`:''}`)}`}>{c.access.action}<ArrowRight size={17}/></a></EmptyState></div>;
  if(!state.profile.healthConsent)return <div className="page-biomarker">{header}<EmptyState title={c.healthGate.title} description={c.healthGate.body}><a className="eva-button" href="/es/profile">{c.healthGate.action}</a></EmptyState></div>;
  if(!marker)return <div className="page-biomarker">{header}<EmptyState title={c.missingMarker.title} description={c.missingMarker.body}><a className="eva-button" href="/es/labs">{c.missingMarker.action}</a></EmptyState></div>;
  return <div className="page-biomarker">
    {header}
    {reports.length>0&&<div className="biomarker-report-toolbar"><label htmlFor="biomarker-report-select">{c.labels.report}</label><div className="biomarker-report-select"><select id="biomarker-report-select" value={report?.id||''} onChange={event=>selectReport(event.target.value)}>{!report&&<option value="">{c.missingReport.action}</option>}{report?.status==='archived'&&<option value={report.id}>{dateLabel(report.date)} · {c.reportStatus.archived}</option>}{reports.map(item=><option key={item.id} value={item.id}>{dateLabel(item.date)} · {item.name} · {reportReadiness(item)==='pending_context'?c.reportStatus.pending_context:c.reportStatus[item.status]}</option>)}</select><ChevronDown size={16} aria-hidden="true"/></div><SourceTag>{c.sample}</SourceTag></div>}
    {selectedReading&&<nav className="biomarker-section-nav" aria-label="Secciones del biomarcador"><a href="#biomarker-result">Resultado</a><a href="#biomarker-history">Historial</a><a href="#biomarker-understanding">Qué mide</a></nav>}
    {notice&&<div className="biomarker-save-notice" role="status"><Check size={16} aria-hidden="true"/>{notice}</div>}
    {!report?(selectedId?<EmptyState title={c.missingReport.title} description={c.missingReport.body}><a className="eva-button" href="/es/labs">{c.missingReport.action}</a></EmptyState>:<EmptyState title={c.empty.title} description={c.empty.body}><div className="biomarker-empty-actions"><a className="eva-button" href="/es/upload">{c.empty.upload}<ArrowRight size={17}/></a><a className="eva-button eva-button-secondary" href="/es/book">{c.empty.book}</a></div></EmptyState>):!canReadReport(report,state.profile.healthConsent)?<AsyncState error={report.status==='error'} message={reportReadiness(report)==='pending_context'?c.states.pending_context:report.status==='ready'?c.unavailable.body:c.states[report.status]}><a className="eva-button" href={reportReadiness(report)==='pending_context'?`${reportHref(report.id)}/context`:reportHref(report.id)}>{reportReadiness(report)==='pending_context'?c.labels.context:c.unavailable.action}<ArrowRight size={17}/></a></AsyncState>:selectedReading?<MeasurementInstrument marker={marker} reading={selectedReading} domain={domain}/>:<EmptyState title={c.unavailable.title} description={c.unavailable.body}><a className="eva-button" href={reportHref(report.id)}>{c.unavailable.action}</a></EmptyState>}
    {readings.length>0&&<HistoryStudy marker={marker} readings={readings} selectedId={report?.id||''} domain={domain} plotUnit={plotUnit} onSelect={selectReport} onEdit={reading=>{setEditing(reading);setNotice('');}}/>}
    <section id="biomarker-understanding" className="biomarker-understanding" aria-labelledby="biomarker-understanding-heading"><div className="biomarker-section-heading"><div><p className="eva-kicker">{c.explain.eyebrow}</p><h2 id="biomarker-understanding-heading">{c.explain.title}</h2></div><div className="biomarker-reading-level" role="group" aria-label={c.explain.level}>{(['simple','balanced','advanced'] as const).map(item=><button type="button" key={item} aria-pressed={level===item} onClick={()=>setLevel(item)}>{c.explain.levels[item]}</button>)}</div></div><div className="biomarker-explanation-grid"><article><span className="biomarker-section-index" aria-hidden="true">01</span><h3>{c.explain.definition}</h3><p>{marker.description}</p>{level!=='simple'&&<p className="biomarker-extra-copy">{c.explain.detail}</p>}</article><article><span className="biomarker-section-index" aria-hidden="true">02</span><h3>Qué dice esta lectura</h3><p data-marker-interpretation={marker.key} data-report-id={report?.id} data-interpretation-state={interpretation?.state??'missing'}>{selectedReading?interpretation?.text??(interpretation?.state==='stale'?'Los datos cambiaron. La interpretación de este informe necesita actualizarse.':'Todavía no hay una interpretación específica para este resultado.'):c.unavailable.body}</p>{level==='advanced'&&<p className="biomarker-extra-copy">{c.explain.advanced}</p>}</article></div></section>
    {selectedReading&&<section className="biomarker-provenance" aria-labelledby="biomarker-provenance-heading"><div><p className="eva-kicker">{c.references.eyebrow}</p><h2 id="biomarker-provenance-heading">{c.references.title}</h2><p>{c.references.body}</p></div><div><dl><div><dt>{c.labels.source}</dt><dd>{c.source[selectedReading.report.source]}</dd></div><div><dt>{c.labels.date}</dt><dd>{dateLabel(selectedReading.report.date)}</dd></div><div><dt>{c.labels.unit}</dt><dd>{selectedReading.unit}</dd></div><div><dt>{c.references.laboratory}</dt><dd>{c.references.notProvided}</dd></div></dl><div className="biomarker-provenance-links"><a href={reportHref(selectedReading.report.id)}>{c.references.report}<ArrowUpRight size={16}/></a><a href="/es/metodologia">{c.references.method}<ArrowUpRight size={16}/></a></div></div></section>}
    <section className="biomarker-next-grid"><article><p className="eva-kicker">{c.wearable.eyebrow}</p><h2>{c.wearable.title}</h2><p>{state.profile.wearableConnected?c.wearable.active:c.wearable.empty}</p><p className="biomarker-extra-copy">{c.wearable.note}</p><a className="eva-text-link" href="/es/profile">{state.profile.wearableConnected?c.wearable.activeAction:c.wearable.emptyAction}<ArrowUpRight size={16}/></a></article><article><p className="eva-kicker">{marker.is_genetic?c.next.geneticEyebrow:c.next.eyebrow}</p><h2>{marker.is_genetic?c.next.geneticTitle:c.next.title}</h2><p>{marker.is_genetic?c.next.geneticBody:c.next.body}</p><a className="eva-text-link" href={marker.is_genetic?'/es/metodologia':'/es/book'}>{marker.is_genetic?c.next.geneticAction:c.next.action}<ArrowUpRight size={16}/></a></article></section>
    {editing&&<EditReading marker={marker} reading={editing} onClose={()=>setEditing(null)} onSaved={()=>{setNotice(c.edit.saved);setEditing(null);}}/>}
  </div>;
}
