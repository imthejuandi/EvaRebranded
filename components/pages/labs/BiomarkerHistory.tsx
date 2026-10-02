'use client';

import {useId,useState} from 'react';
import type {Locale} from '../../../lib/preview/model';
import {biomarkerHistory,historyCopy,historyDate,historyDirectionLabel,historyNumber,historySentence,type BiomarkerObservation} from '../../../lib/labs/biomarker-history';
import './biomarker-history.css';

export function BiomarkerHistory({observations,markerKey,asOf,reportId,locale='es',showInterpretation=true}:{observations:readonly BiomarkerObservation[];markerKey:string;asOf:string;reportId?:string;locale?:Locale;showInterpretation?:boolean}) {
  const id=useId(), [activeId,setActiveId]=useState<string|null>(null);
  const model=biomarkerHistory(observations,markerKey,asOf,reportId), c=historyCopy[locale];
  const {points,latest,start,end}=model;
  const selected=points.find(p=>p.reportId===activeId) ?? points.find(p=>p.reportId===latest?.reportId) ?? points.at(-1);
  const dates=new Set(points.map(p=>p.date)), chart=dates.size>1;
  const values=points.map(p=>p.value!), low=Math.min(...values), high=Math.max(...values), span=high-low || Math.max(Math.abs(high)*.1,1);
  const x=(date:string)=>start&&end&&start!==end?8+(Date.parse(date)-Date.parse(start))/(Date.parse(end)-Date.parse(start))*84:50;
  const y=(value:number)=>high===low?46:20+(high-value)/span*52;
  const source=(value:string|null)=>value==='kit'?c.sample:value==='upload'?c.upload:value??c.unknown;
  const signed=(value:number)=>`${value>0?'+':''}${historyNumber(value,locale)}`;
  const interpretation=latest?.interpretation[locale] ?? latest?.interpretation.en;
  const proseLanguage=latest?.interpretation[locale]?locale:'en';
  return <section className="biomarker-history" aria-labelledby={`${id}-title`} data-history-key={markerKey} data-history-start={start??undefined} data-history-end={end??undefined}>
    <div className="biomarker-history-heading"><h4 id={`${id}-title`}>{c.title}</h4><span>{model.records.length} {locale==='es'?(model.records.length===1?'lectura':'lecturas'):(model.records.length===1?'reading':'readings')}</span></div>
    {chart ? <>
      <div className="biomarker-history-chart" role="group" aria-label={`${latest?.name}: ${c.title}`}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          {[20,46,72].map(v=><line key={v} x1="8" x2="92" y1={v} y2={v} className="history-grid"/>)}
          {dates.size===points.length&&<polyline points={points.map(p=>`${x(p.date)},${y(p.value!)}`).join(' ')} className="history-path"/>}
        </svg>
        {points.map(p=><button key={p.reportId} type="button" style={{left:`${x(p.date)}%`,top:`${y(p.value!)}%`}} className="history-point" data-zone={p.zone} aria-pressed={selected?.reportId===p.reportId} aria-label={`${historyDate(p.date,locale)}: ${historyNumber(p.value!,locale)} ${p.unit} · ${source(p.source)}`} onClick={()=>setActiveId(p.reportId)} onFocus={()=>setActiveId(p.reportId)} onPointerEnter={event=>{if(event.pointerType==='mouse')setActiveId(p.reportId)}}><span/></button>)}
      </div>
      <div className="history-axis"><span>{historyDate(start!,locale)}</span><span>{historyDate(end!,locale)}</span></div>
      {selected&&<div className="history-selected" aria-live="polite"><span>{historyDate(selected.date,locale)}<small>{source(selected.source)}</small></span><strong>{historyNumber(selected.value!,locale)} <small>{selected.unit}</small></strong></div>}
      {model.change!==null&&<><div className="history-direction"><span>{historyDirectionLabel(model,locale)}</span>{model.change!==null&&<strong>{signed(model.change)} <small>{latest?.unit}</small></strong>}</div>
      <p className="history-period-note">{c.change} · {c.max}</p></>}
      {model.direction==='mixed'&&model.recentChange!==null&&<p className="history-period-note">{c.latestChange}: {signed(model.recentChange)} {latest?.unit}</p>}
    </> : <p className="history-empty">{latest?.value===null||latest?.comparator?c.missing:points.length>1?c.oneDate:c.single}</p>}
    {chart&&model.direction==='insufficient'&&<p className="history-period-note">{dates.size!==points.length?c.oneDate:c.missing}</p>}
    {model.excludedUnits>0&&<p className="history-period-note">{c.units}</p>}
    {model.records.length>0&&<details className="history-table"><summary>{c.table}<span aria-hidden="true">+</span></summary><div role="region" aria-label={c.table} tabIndex={0}><table><thead><tr><th>{c.date}</th><th>{c.value}</th><th>{c.source}</th></tr></thead><tbody>{[...model.records].reverse().map(p=><tr key={p.reportId}><td>{historyDate(p.date,locale)}</td><td>{p.comparator}{p.value===null?'—':historyNumber(p.value,locale)} {p.unit}</td><td>{source(p.source)}</td></tr>)}</tbody></table></div></details>}
    {showInterpretation&&<div className="history-meaning"><h4>{c.meaning}</h4>{historySentence(model,locale)&&<p>{historySentence(model,locale)}</p>}{interpretation?<div lang={proseLanguage}>{interpretation.split(/\n+/).filter(Boolean).map((p,i)=><p key={i}>{p}</p>)}</div>:<p>{c.pending}</p>}</div>}
    <p className="history-caveat">{c.note}</p>
  </section>;
}
