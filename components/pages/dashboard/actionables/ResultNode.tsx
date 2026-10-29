'use client';

import {useId, useLayoutEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import {deriveResultSignal, formatOptimalRange, formatResultNumber, type MarkerResult} from './result-shape';
import './result-node.css';

export interface ResultNodeProps {
  result?:MarkerResult;
  markerKey:string;
  reportId:string;
  label:string;
  onInspect?:(key:string)=>void;
}

/** A report-bound reading, never a diagnosis. The optional inspect callback is
 * intentionally unused: this tooltip contains information, not nested controls. */
export default function ResultNode({result,markerKey,reportId,label}:ResultNodeProps){
  const id=useId();
  const trigger=useRef<HTMLButtonElement>(null),popup=useRef<HTMLDivElement>(null);
  const showTimer=useRef<number|undefined>(undefined),hideTimer=useRef<number|undefined>(undefined);
  const pointerTrigger=useRef(false),pointerPopup=useRef(false),focused=useRef(false);
  const [transient,setTransient]=useState(false),[pinned,setPinned]=useState(false);
  const [position,setPosition]=useState<{left:number;top:number}|null>(null);
  const open=transient||pinned;
  const matched=result?.reportId===reportId&&result?.key===markerKey&&!!reportId?result:undefined;
  const signal=matched?deriveResultSignal(matched,reportId):null;
  const direction=signal?.direction??'unknown';
  const status=signal?.labelEs??'Resultado no disponible';
  const numeric=matched&&typeof matched.value==='number'&&Number.isFinite(matched.value)?matched.value:null;
  const value=numeric===null?null:formatResultNumber(numeric);
  const unit=matched?.unit?.trim()||null;
  const reportedValue=matched?.reportedValue?.trim()||null;
  const reportedUnit=matched?.reportedUnit?.trim()||null;
  const qualifiedOriginal=!!reportedValue&&/^[<>≤≥]/.test(reportedValue);
  const primaryValue=qualifiedOriginal?reportedValue:value;
  const primaryUnit=qualifiedOriginal?reportedUnit:unit;
  const range=formatOptimalRange(matched);
  const date=matched?.collectionDate??null;
  const icon=direction==='high'?'↑':direction==='low'?'↓':direction==='optimal'?'·':'—';
  function clearTimers(){window.clearTimeout(showTimer.current);window.clearTimeout(hideTimer.current);}
  function dismiss(){clearTimers();pointerPopup.current=false;setPinned(false);setTransient(false);setPosition(null);}
  function requestOpen(){window.clearTimeout(hideTimer.current);window.clearTimeout(showTimer.current);showTimer.current=window.setTimeout(()=>setTransient(true),120);}
  function requestClose(){window.clearTimeout(showTimer.current);window.clearTimeout(hideTimer.current);hideTimer.current=window.setTimeout(()=>{if(!pointerTrigger.current&&!pointerPopup.current&&!focused.current)setTransient(false);},150);}

  useLayoutEffect(()=>()=>clearTimers(),[]);
  // A changed report invalidates an open reading immediately.
  useLayoutEffect(()=>{dismiss();},[reportId,markerKey]);
  useLayoutEffect(()=>{
    if(!open)return;
    const place=()=>{
      if(!trigger.current||!popup.current)return;
      const anchor=trigger.current.getBoundingClientRect(),box=popup.current.getBoundingClientRect();
      const viewport=window.visualViewport,originX=viewport?.offsetLeft??0,originY=viewport?.offsetTop??0;
      const width=viewport?.width??window.innerWidth,height=viewport?.height??window.innerHeight;
      const left=Math.max(originX+12,Math.min(anchor.left+anchor.width/2-box.width/2,originX+width-box.width-12));
      const above=anchor.top-box.height-10;
      const preferred=above>=originY+12?above:anchor.bottom+10;
      const top=Math.max(originY+12,Math.min(preferred,originY+height-box.height-12));
      setPosition(previous=>previous?.left===left&&previous?.top===top?previous:{left,top});
    };
    const escape=(event:KeyboardEvent)=>{if(event.key==='Escape'){event.preventDefault();dismiss();}};
    const outside=(event:PointerEvent)=>{if(event.target instanceof Node&&!trigger.current?.contains(event.target)&&!popup.current?.contains(event.target))dismiss();};
    place();const observer=new ResizeObserver(place);if(popup.current)observer.observe(popup.current);if(trigger.current)observer.observe(trigger.current);
    window.addEventListener('resize',place);window.addEventListener('scroll',place,true);
    window.visualViewport?.addEventListener('resize',place);window.visualViewport?.addEventListener('scroll',place);
    document.addEventListener('keydown',escape);document.addEventListener('pointerdown',outside);
    return()=>{observer.disconnect();window.removeEventListener('resize',place);window.removeEventListener('scroll',place,true);window.visualViewport?.removeEventListener('resize',place);window.visualViewport?.removeEventListener('scroll',place);document.removeEventListener('keydown',escape);document.removeEventListener('pointerdown',outside);};
  },[open]);

  return <><button ref={trigger} className="eva-result-trigger" type="button" data-signal={direction} data-open={open} data-pinned={pinned} aria-label={`${label}: ${status}. Mostrar resultado`} aria-describedby={open?id:undefined}
    onPointerEnter={event=>{if(event.pointerType==='touch')return;pointerTrigger.current=true;requestOpen();}}
    onPointerLeave={()=>{pointerTrigger.current=false;requestClose();}}
    onFocus={()=>{focused.current=true;requestOpen();}}
    onBlur={()=>{focused.current=false;requestClose();}}
    onClick={()=>{trigger.current?.focus({preventScroll:true});if(pinned)dismiss();else{clearTimers();setTransient(false);setPinned(true);}}}>
      <span className="eva-result-trigger-label">{label}</span><span className="eva-result-glyph" aria-hidden="true">{icon}</span>
    </button>{open&&createPortal(<div ref={popup} id={id} role="tooltip" className="eva-result-popover" data-signal={direction} data-pinned={pinned} style={{left:position?.left??12,top:position?.top??12,visibility:position?'visible':'hidden'}}
      onPointerEnter={()=>{pointerPopup.current=true;window.clearTimeout(hideTimer.current);}}
      onPointerLeave={()=>{pointerPopup.current=false;requestClose();}}>
      <div className="eva-result-topline"><span>RESULTADO DEL INFORME</span><span aria-hidden="true">{icon}</span></div>
      <p className="eva-result-label">{label}</p>
      <p className="eva-result-value">{primaryValue??'No disponible'}{primaryValue&&<span>{primaryUnit??'Unidad no disponible'}</span>}</p>
      <p className="eva-result-status">{status}</p>
      <dl className="eva-result-context">{qualifiedOriginal&&<div><dt>Valor normalizado</dt><dd>{value??'No disponible'} · {unit??'Unidad no disponible'}</dd></div>}{!qualifiedOriginal&&(reportedValue||reportedUnit)&&<div><dt>Lectura original</dt><dd>{reportedValue??'Valor no disponible'} · {reportedUnit??'Unidad no disponible'}</dd></div>}<div><dt>Intervalo óptimo</dt><dd>{range}</dd></div><div><dt>Fecha de la muestra</dt><dd>{date?<time dateTime={date}>{date}</time>:'No disponible'}</dd></div></dl>
      <p className="eva-result-hint">{pinned?'Vuelve a pulsar el punto o pulsa Esc para cerrar.':'Pulsa el punto para mantener la lectura.'}</p>
    </div>,document.body)}</>;
}
