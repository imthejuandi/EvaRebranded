'use client';

import ReportSummary from './ReportSummary';
import {useId, useRef, useState, type KeyboardEvent} from 'react';
import {dateLabel, numberLabel} from '@/lib/preview/fixtures';
import type {PreviewState, Report, Locale, Literacy} from '@/lib/preview/model';
import {dashboardMarkerHistory, evidenceRangeGeometry, selectMarkerInterpretation, zoneLabels, type DashboardMarker, type ExecutiveStory, type StoryEvidence} from './dashboard-reading';

/** SAVEE App EVA UI: xMeroxU (focused instrument), 8qTYqaa and vod3XjT (frosted, rounded data).
 * Original implementation: selections connect narrative, dated evidence and report-owned interpretation.
 * No decorative idle loop, no shared axis across markers, no borrowed marketing hero animation.
 */
export const executiveCopy = {
 es: {eyebrow:'LA HISTORIA DE TU INFORME',title:'Las piezas, juntas.',tabs:['Los datos','Perspectiva','Tu contexto'],tabLabel:'Explorar la lectura de tu informe',level:'Nivel de explicación',levels:{simple:'Esencial',balanced:'Con contexto',advanced:'En detalle'},whole:'Lectura del conjunto',expand:'Leer la lectura completa',collapse:'Cerrar lectura completa',source:{kit:'Muestra del kit',upload:'Analítica subida'},version:'Versión',sample:'Lectura editorial · datos ficticios',missing:'La interpretación de este informe todavía no está disponible.',stale:'Los datos cambiaron. Esta lectura necesita una nueva interpretación.',pending:'La interpretación se está preparando.',error:'No se pudo completar esta interpretación.',unavailable:'Sin interpretación disponible para este biomarcador.',evidence:'DETALLE QUE SOSTIENE LA LECTURA',selected:'Biomarcador de la lectura',explain:'Lo que aporta este resultado',definition:'Qué mide',open:'Explorar este biomarcador',all:'Ver todos los biomarcadores',interval:'Intervalo ilustrativo',noRange:'El informe no aporta un intervalo comparable.',language:'Texto disponible en inglés',contextTitle:'El día de la muestra.',contextNote:'Estas respuestas pertenecen a esta muestra. El contexto guardado no se ha usado para generar esta lectura de ejemplo.',contextApplied:'Contexto asociado a esta interpretación.',contextNone:'No hay un contexto confirmado para esta muestra.',unknown:'No consta',skipped:'Se omitió esta respuesta',recorded:'Registrado',illness:'Enfermedad cerca de la muestra',fasting:'Ayuno',workout:'Último ejercicio',yes:'Sí, registrado',no:'No, registrado',contextLink:'Ver el contexto guardado',perspective:'Cada lectura tiene su fecha.',comparisonEmpty:'Este informe no tiene una lectura anterior comparable.',comparisonNote:'Solo se comparan fechas anteriores del mismo tipo de origen y unidad. Kit o subida no identifica el laboratorio ni el método; la comparación es ilustrativa. Un cambio numérico no indica por sí solo una mejora.',previous:'Lectura anterior',current:'Esta lectura',archive:'Abrir el archivo',critical:'La clasificación del informe señala un valor crítico. Revisa el resultado completo; no se reduce a una puntuación general.',actions:'De la lectura al siguiente paso.',actionsNote:'Acciones editoriales de ejemplo, vinculadas a este informe.',actionsEmpty:'Este informe no tiene acciones disponibles.',actionLink:'Ver el dato relacionado',meaning:'TU RESULTADO, EXPLICADO',value:'En este informe',facts:'Conservamos el valor y la clasificación del informe. Los intervalos de esta vista son ilustrativos.'},
 en: {eyebrow:'THE STORY OF YOUR REPORT',title:'The pieces, together.',tabs:['Evidence','Perspective','Your context'],tabLabel:'Explore your report reading',level:'Explanation level',levels:{simple:'Essential',balanced:'With context',advanced:'In detail'},whole:'The whole picture',expand:'Read the complete interpretation',collapse:'Close complete interpretation',source:{kit:'Kit sample',upload:'Uploaded lab report'},version:'Version',sample:'Editorial reading · fictional data',missing:'This report’s interpretation is not available yet.',stale:'The data changed. This reading needs a new interpretation.',pending:'The interpretation is being prepared.',error:'This interpretation could not be completed.',unavailable:'No interpretation is available for this biomarker.',evidence:'THE EVIDENCE BEHIND THE READING',selected:'Biomarker in this reading',explain:'What this result contributes',definition:'What it measures',open:'Explore this biomarker',all:'See every biomarker',interval:'Illustrative interval',noRange:'The report has no comparable interval.',language:'Text available in English',contextTitle:'The day of the sample.',contextNote:'These answers belong to this sample. Saved context has not been used to generate this example reading.',contextApplied:'Context associated with this interpretation.',contextNone:'There is no confirmed context for this sample.',unknown:'Unknown',skipped:'This answer was skipped',recorded:'Recorded',illness:'Illness near the sample date',fasting:'Fasting',workout:'Last exercise',yes:'Yes, recorded',no:'No, recorded',contextLink:'View saved context',perspective:'Every reading has its date.',comparisonEmpty:'This report has no earlier comparable reading.',comparisonNote:'Only earlier dates with the same source type and unit are compared. Kit or upload does not identify a laboratory or method; this comparison is illustrative. Numerical change alone does not establish improvement.',previous:'Earlier reading',current:'This reading',archive:'Open the archive',critical:'The report classifies a result as critical. Review the full result; it is not reduced to an overall score.',actions:'From reading to the next step.',actionsNote:'Editorial example actions, linked to this report.',actionsEmpty:'This report has no available actions.',actionLink:'See the related result',meaning:'YOUR RESULT, EXPLAINED',value:'In this report',facts:'We preserve the report’s value and classification. Intervals in this preview are illustrative.'},
} as const;

function Arrow(){return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12h14m-5-5 5 5-5 5" stroke="currentColor" strokeWidth="1.4"/></svg>;}
const markerHref=(reportId:string,key:string)=>`/es/biomarker/${encodeURIComponent(key)}?report=${encodeURIComponent(reportId)}`;

function EvidenceRange({evidence,locale}:{evidence:StoryEvidence;locale:Locale}){
 const geometry=evidenceRangeGeometry(evidence),copy=executiveCopy[locale];
 if(!geometry||!evidence.range)return <p className="reading-instrument-range-note">{copy.noRange}</p>;
 const x=(ratio:number)=>14+ratio*332;
 return <div className="reading-instrument-range"><svg viewBox="0 0 360 58" aria-hidden="true">
  {Array.from({length:55},(_,column)=>Array.from({length:4},(_,row)=>{
   const position=column/54,inside=position>=geometry.intervalStart&&position<=geometry.intervalEnd;
   return <circle key={`${column}-${row}`} cx={x(position)} cy={17+row*7} r={inside?1.7:.8} fill="currentColor" opacity={inside?.62:.22}/>;
  }))}
  <path d={`M${x(geometry.intervalStart)} 8V46M${x(geometry.intervalEnd)} 8V46`} stroke="currentColor" strokeWidth=".7" opacity=".4"/>
  <g className="reading-measure-point"><circle cx={x(geometry.value)} cy="27.5" r="10" fill="var(--reading-face)" stroke="currentColor"/><circle cx={x(geometry.value)} cy="27.5" r="3" fill="currentColor"/></g>
 </svg><p><span>{copy.interval}</span><strong>{numberLabel(evidence.range[0])}–{numberLabel(evidence.range[1])} {evidence.unit}</strong></p></div>;
}

function EvidenceInstrument({story,locale,literacy}:{story:ExecutiveStory;locale:Locale;literacy:Literacy}){
 const options=story.available,copy=executiveCopy[locale];
 const [key,setKey]=useState(story.priorities[0]?.key??options[0]?.key);
 const item=options.find(item=>item.key===key)??options[0];
 if(!item)return <p className="reading-empty">{copy.missing}</p>;
 const interpretation=selectMarkerInterpretation(story.report,item.key,locale,literacy);
 return <div className="reading-instrument" data-zone={item.zone}>
  <div className="reading-instrument-top"><p>{copy.evidence}</p><label className="reading-marker-select"><span className="dashboard-visually-hidden">{copy.selected}</span><select value={item.key} onChange={event=>setKey(event.target.value)}>{options.map(option=><option key={option.key} value={option.key}>{option.name}</option>)}</select></label></div>
  <div className="reading-instrument-face" key={item.key}><div className="reading-instrument-label"><h3>{item.name}</h3><span>{item.category}</span></div><p className="reading-instrument-value">{numberLabel(item.value!)}<span>{item.unit}</span></p><p className="reading-instrument-zone" data-zone={item.zone}><i aria-hidden="true"/>{zoneLabels[locale][item.zone]}</p><EvidenceRange evidence={item} locale={locale}/></div>
  <div className="reading-instrument-explanation" key={`${item.key}-${literacy}`}><p className="dashboard-mini-label">{copy.explain}</p><p data-marker-interpretation={item.key} data-interpretation-state={interpretation.state}>{interpretation.text??copy.unavailable}</p><a href={markerHref(story.reportId,item.key)}>{copy.open}<Arrow/></a></div>
 </div>;
}

export function contextValue(raw:unknown,locale:Locale='es'){
 const c=executiveCopy[locale];
 if(raw===undefined||raw===null||raw===''||raw==='unknown'||raw==='unsure')return c.unknown;
 if(raw==='skipped'||raw==='skip')return c.skipped;
 if(raw===true||raw==='true'||raw==='yes')return c.yes;
 if(raw===false||raw==='false'||raw==='no')return c.no;
 const labels:Record<string,[string,string]>={eight_to_twelve:['Entre 8 y 12 horas','8–12 hours'],twelve_plus:['Más de 12 horas','Over 12 hours'],under_8h:['Menos de 8 horas','Under 8 hours'],not_fasted:['Sin ayuno','Not fasting'],none:['Sin ejercicio registrado','No exercise recorded'],light_under_24h:['Ligero, últimas 24 horas','Light, past 24 hours'],hard_under_24h:['Intenso, últimas 24 horas','Intense, past 24 hours'],hard_24_to_48h:['Intenso, hace 24–48 horas','Intense, 24–48 hours ago']};
 return labels[String(raw)]?.[locale==='es'?0:1]??String(raw);
}
function ContextPanel({story,locale}:{story:ExecutiveStory;locale:Locale}){
 const c=executiveCopy[locale],values=story.context?.transient;
 const rows=[['currently_ill',c.illness],['fasted',c.fasting],['last_workout',c.workout]];
 return <div className="reading-context"><p className="dashboard-mini-label">{c.tabs[2]}</p><h3>{c.contextTitle}</h3><p>{story.contextConfirmed?story.narrative.contextApplied?c.contextApplied:c.contextNote:c.contextNone}</p><dl>{rows.map(([key,label])=><div key={key}><dt>{label}</dt><dd>{contextValue(values?.skipped==='true'?'skipped':values?.[key],locale)}</dd></div>)}</dl><a href={`/es/labs/${encodeURIComponent(story.reportId)}/context`}>{c.contextLink}<Arrow/></a></div>;
}
function Perspective({story,locale}:{story:ExecutiveStory;locale:Locale}){
 const c=executiveCopy[locale];
 return <div className="reading-perspective"><p className="dashboard-mini-label">{c.tabs[1]}</p><h3>{c.perspective}</h3>{story.comparable.length?<div>{story.comparable.slice(0,3).map(item=><div className="reading-comparison" key={item.key}><h4>{item.name}</h4><p><span><small>{dateLabel(item.comparison!.date)}</small>{numberLabel(item.comparison!.value)}</span><Arrow/><span><small>{dateLabel(story.date)}</small>{numberLabel(item.value!)}</span><em>{item.unit}</em></p></div>)}</div>:<p className="reading-no-comparison">{c.comparisonEmpty}</p>}<p className="reading-fineprint">{c.comparisonNote}</p><a href="/es/labs/manage">{c.archive}<Arrow/></a></div>;
}

export function ExecutiveReading({story,locale='es',literacy='balanced'}:{story:ExecutiveStory;locale?:Locale;literacy?:Literacy}){
 const [chapter,setChapter]=useState(0),[level,setLevel]=useState<Literacy>(literacy);
 const tabs=useRef<(HTMLButtonElement|null)[]>([]),id=useId().replaceAll(':',''),c=executiveCopy[locale];
 function changeWithKeys(event:KeyboardEvent<HTMLButtonElement>,index:number){
  const next=event.key==='ArrowRight'?(index+1)%3:event.key==='ArrowLeft'?(index+2)%3:event.key==='Home'?0:event.key==='End'?2:null;
  if(next===null)return;event.preventDefault();setChapter(next);tabs.current[next]?.focus({preventScroll:true});
 }
 return <><ReportSummary story={story} locale={locale} level={level} onLevel={setLevel}/>
  <details className="dashboard-reading-details"><summary>{locale==='es'?'Datos, perspectiva y contexto':'Evidence, perspective and context'}<span aria-hidden="true">+</span></summary>
   <div className="reading-evidence"><div className="executive-tabs" role="tablist" aria-label={c.tabLabel}><i className="executive-tab-indicator" aria-hidden="true" style={{transform:`translateX(${chapter*100}%)`}}/>{c.tabs.map((label,index)=><button type="button" key={label} role="tab" id={`${id}-tab-${index}`} aria-selected={chapter===index} aria-controls={`${id}-panel-${index}`} tabIndex={chapter===index?0:-1} onClick={()=>setChapter(index)} onKeyDown={event=>changeWithKeys(event,index)} ref={element=>{tabs.current[index]=element}}>{label}</button>)}</div>
    {c.tabs.map((_,index)=><div className="reading-evidence-panel" role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={chapter!==index} key={index} tabIndex={0}>{index===0?<EvidenceInstrument story={story} locale={locale} literacy={level}/>:index===1?<Perspective story={story} locale={locale}/>:<ContextPanel story={story} locale={locale}/>}</div>)}
   </div>
  </details></>;
}

export function ReportActions({story,locale='es'}:{story:ExecutiveStory;locale?:Locale}){
 const c=executiveCopy[locale],id=useId();
 return <section className="reading-actions" aria-labelledby={id}><div className="dashboard-section-heading"><div><p className="dashboard-mini-label">{c.sample}</p><h2 id={id}>{c.actions}</h2><p>{c.actionsNote}</p></div></div>{story.actions.length?<ol>{story.actions.map(action=><li key={action.id} data-action-report={action.lab_result_id}><span aria-hidden="true">{String(action.priority).padStart(2,'0')}</span><div><h3>{locale==='es'?action.title_es:action.title}</h3><p>{locale==='es'?action.description_es:action.description}</p><div className="reading-action-links">{action.related_biomarker_keys.filter(key=>story.evidence.some(item=>item.key===key)).map(key=><a key={key} href={markerHref(story.reportId,key)}>{story.evidence.find(item=>item.key===key)?.name}<Arrow/></a>)}</div></div></li>)}</ol>:<p className="reading-empty">{c.actionsEmpty}</p>}</section>;
}

/** Definition and generated interpretation stay separate; both follow the selected report. */
export function BiomarkerExplanation({marker,report,state}:{marker:DashboardMarker;report:Report;state:PreviewState}){
 const c=executiveCopy.es,id=useId(),interpretation=selectMarkerInterpretation(report,marker.key,'es',state.profile.literacy);
 const previous=dashboardMarkerHistory(state,report,marker).filter(item=>item.report.date<report.date).at(-1);
 return <section className="dashboard-marker-explanation" aria-labelledby={`${id}-title`} data-report-id={report.id}><p className="dashboard-mini-label">{c.meaning}</p><h3 id={`${id}-title`}>{marker.name}, en esta lectura.</h3><p className="dashboard-explanation-description" data-marker-interpretation={marker.key} data-interpretation-state={interpretation.state}>{interpretation.text??(interpretation.state==='stale'?c.stale:c.unavailable)}</p><details className="reading-definition"><summary>{c.definition}</summary><p>{marker.description}</p></details><dl><div><dt>{c.value}</dt><dd><strong>{Number.isFinite(marker.value)?numberLabel(marker.value):'No disponible'} {marker.unit}</strong><span>{zoneLabels.es[marker.zone]} · {dateLabel(report.date)}</span></dd></div><div><dt>{c.interval}</dt><dd>{marker.rangeComparable?<strong>{numberLabel(marker.range[0])}–{numberLabel(marker.range[1])} {marker.unit}</strong>:c.noRange}</dd></div></dl>{previous&&<p className="dashboard-explanation-previous">{c.previous}: {numberLabel(previous.marker.value)} {marker.unit} · {dateLabel(previous.report.date)}.</p>}<a href={markerHref(report.id,marker.key)}>{c.open}<Arrow/></a></section>;
}
