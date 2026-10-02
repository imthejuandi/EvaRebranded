'use client';

import {useId,useState} from 'react';
import type {Report,Literacy,Locale} from '@/lib/preview/model';
import {selectReportNarrative,selectReportActions} from '../dashboard/dashboard-reading';

const copy={es:{eyebrow:'LA LECTURA COMPLETA',title:'Qué cuenta este informe.',level:'Nivel de explicación',levels:{simple:'Esencial',balanced:'Con contexto',advanced:'En detalle'},missing:'La interpretación de este informe todavía no está disponible.',stale:'Los datos cambiaron. La interpretación de este informe necesita actualizarse.',pending:'La interpretación está en preparación.',error:'No se pudo preparar la interpretación.',sample:'Lectura editorial de ejemplo · datos ficticios',context:'El contexto guardado acompaña a la muestra; no se ha usado para generar esta lectura de ejemplo.',actions:'Pasos que acompañan a esta lectura',related:'Ver biomarcador relacionado',language:'Texto disponible en inglés'},en:{eyebrow:'THE COMPLETE READING',title:'What this report says.',level:'Explanation level',levels:{simple:'Essential',balanced:'With context',advanced:'In detail'},missing:'This report’s interpretation is not available yet.',stale:'The data changed. This report needs a new interpretation.',pending:'The interpretation is being prepared.',error:'The interpretation could not be prepared.',sample:'Editorial example · fictional data',context:'Saved context accompanies the sample; it has not been used to generate this example reading.',actions:'Steps accompanying this reading',related:'See related biomarker',language:'Text available in English'}} as const;
/** A report folio uses its own prose and actions, with no dashboard hero or generic substitute. */
export function ReportNarrative({report,literacy,locale='es'}:{report:Report;literacy:Literacy;locale?:Locale}){
 const [level,setLevel]=useState(literacy),id=useId(),c=copy[locale];
 const narrative=selectReportNarrative(report,locale,level),actions=selectReportActions(report);
 return <section className="labs-narrative" aria-labelledby={id} data-report-id={report.id} data-report-version={report.version??1} data-narrative-state={narrative.state}>
 <div className="labs-narrative-heading"><div><p className="eva-kicker">{c.eyebrow}</p><h2 id={id}>{c.title}</h2></div><label><span>{c.level}</span><select value={level} onChange={event=>setLevel(event.target.value as Literacy)}>{(['simple','balanced','advanced'] as const).map(value=><option value={value} key={value}>{c.levels[value]}</option>)}</select></label></div>
 <div className="labs-narrative-body">{narrative.text?narrative.text.split(/\n+/).map((paragraph,i)=><p key={i}>{paragraph}</p>):<p className="labs-narrative-empty">{c[narrative.state==='ready'?'missing':narrative.state]}</p>}</div>
 <p className="labs-narrative-caption">{c.sample}{narrative.text&&narrative.language!==locale?` · ${c.language}`:''}</p>
 {narrative.text&&!narrative.contextApplied&&<p className="labs-narrative-context">{c.context}</p>}
 {actions.length>0&&<details className="labs-narrative-actions"><summary>{c.actions}<span aria-hidden="true">+</span></summary><ol>{actions.map(action=><li key={action.id} data-action-report={action.lab_result_id}><strong>{locale==='es'?action.title_es:action.title}</strong><p>{locale==='es'?action.description_es:action.description}</p><div>{action.related_biomarker_keys.filter(key=>report.markerKeys.includes(key)).map(key=><a href={`/es/biomarker/${encodeURIComponent(key)}?report=${encodeURIComponent(report.id)}`} key={key} aria-label={`${c.related}: ${key}`}>{key}</a>)}</div></li>)}</ol></details>}
 </section>;
}
