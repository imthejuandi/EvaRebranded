'use client';

import {useState} from 'react';
import type {LabsHistoryResult} from '../../../lib/labs/backend-history-reader';
import type {Locale} from '../../../lib/preview/model';
import {BiomarkerHistory} from './BiomarkerHistory';
import {historyDate} from '../../../lib/labs/biomarker-history';

/** Consume only the authenticated server reader. This component never reads PreviewProvider or browser storage. */
export function LiveLabsResults({result,locale='es'}:{result:LabsHistoryResult;locale?:Locale}) {
  const [selected,setSelected]=useState('');
  if(result.status!=='ready')return <section data-results-state={result.status}><h2>{locale==='es'?'Tus resultados':'Your results'}</h2><p>{locale==='es'?'La lectura no está disponible en esta sesión.':'This reading is not available in this session.'}</p></section>;
  const {snapshot}=result;
  const markers=snapshot.observations.filter(p=>p.reportId===snapshot.reportId);
  const marker=markers.find(p=>p.key===selected)??markers[0];
  const narrative=snapshot.summary[locale]??snapshot.summary.en;
  return <section className="page-labs" data-results-state="ready" data-report-id={snapshot.reportId}>
    <h2>{locale==='es'?'Tus resultados, con perspectiva.':'Your results, in perspective.'}</h2><p>{historyDate(snapshot.collectionDate,locale)}</p>
    {marker&&<><label className="labs-focus-select"><span>{locale==='es'?'Biomarcador':'Biomarker'}</span><select value={marker.key} onChange={event=>setSelected(event.target.value)}>{markers.map(item=><option key={item.key} value={item.key}>{item.name}</option>)}</select></label><article className="labs-focus-capsule eva-glass eva-glass-lilac"><h3>{marker.name}</h3><BiomarkerHistory key={snapshot.reportId+marker.key} observations={snapshot.observations} markerKey={marker.key} asOf={snapshot.collectionDate} reportId={snapshot.reportId} locale={locale}/></article></>}
    <section className="labs-narrative"><h3>{locale==='es'?'Qué cuenta este informe.':'What this report says.'}</h3>{narrative?<div lang={snapshot.summary[locale]?locale:'en'}>{narrative.split(/\n+/).filter(Boolean).map((p,i)=><p key={i}>{p}</p>)}</div>:<p>{locale==='es'?'La interpretación aún no está disponible.':'The interpretation is not available yet.'}</p>}</section>
  </section>;
}
