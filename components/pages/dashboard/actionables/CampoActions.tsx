'use client';

import {useEffect,useRef,type CSSProperties} from 'react';
import {ArrowLeft,ArrowRight,ArrowUpRight,ChevronDown} from 'lucide-react';
import {categoryLabels,markerLabels,type DesignProps,type ActionItem} from './action-model';
import './campo.css';

import DataDotField from './DataDotField';
import ResultNode from './ResultNode';
import {deriveResultSignal,type MarkerResult} from './result-shape';
import {profileForCategory,signalBand,fieldPoint} from './field-geometry';
const categoryColors:Record<string,string>={nutrition:'#bdcbaa',exercise:'#d1bdd6',lifestyle:'#e8bda9',medical:'#b8cbd3'};
interface DataDesignProps extends DesignProps{results?:Readonly<Record<string,MarkerResult>>;labels?:Readonly<Record<string,string>>}
function ActionNavigator({actions,selectedId,onSelect}:{actions:ActionItem[];selectedId:string;onSelect:(id:string)=>void}){
 const container=useRef<HTMLDivElement>(null);
 const disclosure=useRef<HTMLDetailsElement>(null);
 const index=Math.max(0,actions.findIndex(item=>item.id===selectedId));
 const action=actions[index];
 const placeIndex=()=>{
  if(!container.current||!disclosure.current?.open)return;
  const bounds=container.current.getBoundingClientRect();
  const above=Math.max(0,bounds.top-16),below=Math.max(0,innerHeight-bounds.bottom-16);
  const up=above>=Math.min(350,innerHeight*.46)||above>=below;
  container.current.dataset.placement=up?'up':'down';
  container.current.style.setProperty('--campo-index-height',`${Math.min(350,up?above:below)}px`);
 };
 useEffect(()=>{
  const outside=(event:PointerEvent)=>{if(disclosure.current?.open&&!container.current?.contains(event.target as Node))disclosure.current.open=false};
  const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'&&disclosure.current?.open){event.preventDefault();disclosure.current.open=false;disclosure.current.querySelector('summary')?.focus({preventScroll:true})}};
  document.addEventListener('pointerdown',outside);document.addEventListener('keydown',escape);window.addEventListener('resize',placeIndex);window.addEventListener('scroll',placeIndex,{passive:true});
  return()=>{document.removeEventListener('pointerdown',outside);document.removeEventListener('keydown',escape);window.removeEventListener('resize',placeIndex);window.removeEventListener('scroll',placeIndex)};
 },[]);
 if(!action)return null;
 const title=<span className="campo-current-action"><span>ACCIÓN {index+1} / {actions.length}</span><strong>{action.title_es}</strong></span>;
 const move=(offset:number)=>{const next=actions[index+offset];if(!next)return;if(disclosure.current)disclosure.current.open=false;onSelect(next.id)};
 return <div className="campo-action-nav" ref={container} data-single={actions.length===1}>
  {actions.length>1&&<button className="campo-nav-arrow" disabled={index===0} onClick={()=>move(-1)} aria-label="Acción anterior"><ArrowLeft size={19}/></button>}
  {actions.length===1?title:<details className="campo-action-index" ref={disclosure} onToggle={event=>{
  if(!event.currentTarget.open)return;
  placeIndex();
  const list=event.currentTarget.querySelector<HTMLElement>('.campo-index-list');
  const active=list?.querySelector<HTMLElement>('[aria-current="step"]');
  if(list&&active)list.scrollTop=active.offsetTop-(list.clientHeight-active.offsetHeight)/2;
 }}>
  <summary aria-label={`${action.title_es}. Acción ${index+1} de ${actions.length}. Elegir otra acción`}>{title}<ChevronDown size={14} aria-hidden="true"/></summary>
  <nav className="campo-index-list" aria-label="Índice de acciones">
   {actions.map((item,i)=><button key={item.id} aria-current={item.id===selectedId?'step':undefined} onClick={()=>{
    onSelect(item.id);
    if(disclosure.current){disclosure.current.open=false;disclosure.current.querySelector('summary')?.focus({preventScroll:true});}
   }}><span className="campo-index-number">{String(i+1).padStart(2,'0')}</span><span className="campo-index-copy"><span>{categoryLabels[item.category]||item.category}</span><strong>{item.title_es}</strong></span><span className="campo-index-dot" aria-hidden="true"/></button>)}
  </nav>
 </details>}
 {actions.length>1&&<button className="campo-nav-arrow" disabled={index===actions.length-1} onClick={()=>move(1)} aria-label="Siguiente acción"><ArrowRight size={19}/></button>}
 </div>;
}
export default function CampoActions({actions,selectedId,onSelect,direction,results={},labels={}}:DataDesignProps){
 const index=Math.max(0,actions.findIndex(a=>a.id===selectedId));const action=actions[index];if(!action)return null;
 const accent=categoryColors[action.category]??'#bdcbaa';
 const keys=[...new Set(action.related_biomarker_keys)].sort();
 const comparisons=keys.map(key=>deriveResultSignal(results[key]?.key===key?results[key]:undefined,action.lab_result_id));
 const signals=comparisons.map(signal=>signal.displacement);
 const state={profile:profileForCategory(action.category),signals};
 const visualKeys=keys.slice(0,6);
 const positions=visualKeys.map((key,i)=>({key,side:i%2===0?'right':'left',y:visualKeys.length===1?42:18+i*62/Math.max(1,visualKeys.length-1)}));
 return <section className="dashboard-campo" aria-label="Acciones de este informe" data-action-count={actions.length} style={{'--campo-accent':accent,'--campo-travel':`${direction*12}px`} as CSSProperties}>
  <div className="campo-topline"><span>TU LECTURA, EN ACCIÓN</span><span>EXPLORA LAS CONEXIONES <ArrowUpRight size={13}/></span></div>
  <div className="campo-layout">
   <div className="campo-instrument">
    <div className="campo-field" data-category={action.category} data-signals={comparisons.map(x=>x.direction).join(',')}>
     <DataDotField category={action.category} signals={signals} color={accent}/>
     <svg className="campo-connections" viewBox="0 0 600 480" preserveAspectRatio="none" aria-hidden="true" key={action.id}>
      {positions.map(({key,side,y},i)=>{const v=signalBand(i,keys.length),rotation=state.profile.phase*.7+v*state.profile.twist,u=((side==='right'?0:Math.PI)-rotation)/(Math.PI*2);const anchor=fieldPoint(u,v,state);const endX=side==='right'?536:64,endY=y*4.8;return <path key={key} d={`M${anchor.x*600} ${anchor.y*480} C${endX} ${anchor.y*480} ${endX} ${endY} ${endX} ${endY}`}/>})}
     </svg>
     <div className="campo-core-label"><span>ACCIÓN</span><strong>{String(index+1).padStart(2,'0')}</strong><span>DE {String(actions.length).padStart(2,'0')}</span></div>
     {positions.map(({key,side,y})=><div key={`${action.id}-${key}`} className={`campo-result-anchor campo-result-${side}`} style={{top:`${y}%`}} data-marker={key} data-direction={deriveResultSignal(results[key]?.key===key?results[key]:undefined,action.lab_result_id).direction}><ResultNode markerKey={key} reportId={action.lab_result_id} result={results[key]} label={labels[key]||markerLabels[key]||key}/></div>)}
     <div className="campo-axis" aria-hidden="true"><span>+</span><span>+</span></div>
    </div>
    <p className="campo-field-caption">{keys.length?'Toca un biomarcador para ver su resultado.':'Forma por categoría · sin biomarcadores asociados.'}</p>
    {keys.length>0&&<details className="campo-shape-key"><summary>Cómo leer la forma <span aria-hidden="true">+</span></summary><div><span>↑ Sobre el óptimo</span><span>· En rango óptimo</span><span>↓ Bajo el óptimo</span><span>— Sin comparación</span></div><p>Cada pliegue responde a un resultado. La altura indica dirección, no gravedad. Las unidades y los intervalos se leen por separado.</p></details>}
   <ActionNavigator actions={actions} selectedId={action.id} onSelect={onSelect}/>
   </div>
   <div className="campo-reading">
    <div className="campo-reading-label"><span className="campo-lamp"/>{categoryLabels[action.category]||action.category}<span className="campo-reading-count">{index+1} / {actions.length}</span></div>
    <span className="campo-selection-status" role="status" aria-atomic="true">Acción {index+1} de {actions.length}: {action.title_es}</span>
    <article key={action.id} className="campo-action"><h2>{action.title_es}</h2><div className="campo-body">{action.description_es.split('\n\n').map((text,i)=><p key={i}>{text}</p>)}</div></article>
    <div className="campo-evidence"><span>EN TU LECTURA</span>{action.related_biomarker_keys.length?<div>{keys.map(key=><ResultNode key={`${action.id}-${key}`} markerKey={key} reportId={action.lab_result_id} result={results[key]} label={labels[key]||markerLabels[key]||key}/>)}</div>:<p>Sin biomarcadores específicos asociados.</p>}</div>
   </div>
  </div>
 </section>;
}
