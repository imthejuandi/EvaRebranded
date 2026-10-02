'use client';
import {useId,useState} from 'react';
import type {ExecutiveStory} from '../dashboard-reading';
import CampoActions from './CampoActions';
import {reportActionables} from './report-actionables';
import './campo.css';
export default function DashboardActionables({story}:{story:ExecutiveStory}){
 const id=useId();const [selectedId,setSelectedId]=useState(''),[direction,setDirection]=useState<1|-1>(1);
 const labels=Object.fromEntries(story.evidence.map(item=>[item.key,item.name]));
 const {actions,results}=reportActionables(story.report,labels);
 const selected=actions.find(item=>item.id===selectedId)??actions[0];
 const select=(nextId:string)=>{const next=actions.findIndex(item=>item.id===nextId);if(next<0)return;setDirection(next>=actions.findIndex(item=>item.id===selected?.id)?1:-1);setSelectedId(nextId);};
 return <section id="dashboard-actions" className="dashboard-actionables" aria-labelledby={id} data-action-report={story.reportId} data-action-version={story.version}>
  <header className="dashboard-actionables-heading"><div><p className="dashboard-mini-label">03 / TU SIGUIENTE PASO</p><h2 id={id}>De entenderte a cuidarte.</h2></div><p>Acciones editoriales de ejemplo, vinculadas a este informe.</p></header>
  {selected?<CampoActions actions={actions} selectedId={selected.id} onSelect={select} onEvidence={()=>{}} direction={direction} results={results} labels={labels}/>:<p className="dashboard-actionables-empty">Este informe no tiene acciones disponibles.</p>}
 </section>;
}
