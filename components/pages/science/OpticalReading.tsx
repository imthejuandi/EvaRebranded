'use client';
import {useEffect, useRef, useState} from 'react';
import {ArrowDownRight} from 'lucide-react';
import {closestStoryChapter} from '@/components/engagement/SourceStory';
import './optical-reading.css';

type Field = {id:string; label:string; value:string; question:string; explanation:string};
const clamp = (value:number) => Math.max(0,Math.min(1,value));
const ease = (value:number) => {const t=clamp(value); return t*t*(3-2*t);};
/** A bounded optical surface, then four source bands. This is explanatory artwork,
 * never a distribution, clinical interval, trajectory or personal measurement. */
export function drawOpticalField(context:CanvasRenderingContext2D,width:number,height:number,progress:number) {
  context.clearRect(0,0,width,height);
  const scale=Math.min(width/820,height/690),cx=width*.51,cy=height*.47;
  const separate=ease((progress-.15)/.66),angle=(-25+separate*25)*Math.PI/180;
  const cosine=Math.cos(angle),sine=Math.sin(angle);
  const cols=74,rows=46;
  for(let row=0;row<rows;row++) for(let col=0;col<cols;col++) {
    const x=(col/(cols-1)-.5)*640,y=(row/(rows-1)-.5)*420;
    const edgeX=Math.max(0,Math.abs(x)-112),distance=Math.hypot(edgeX,y)/210;
    if(distance>1) continue;
    const band=Math.min(3,Math.floor(row/rows*4));
    const bandLocal=(row%12-5.5)*3.8;
    const targetX=x*1.03+(band%2?20:-20),targetY=(band-1.5)*122+bandLocal;
    const px=x*cosine-y*sine,py=x*sine+y*cosine;
    const drift=Math.sin(col*.16+row*.11+progress*4)*13*Math.sin(separate*Math.PI);
    const finalX=px+(targetX-px)*separate,finalY=py+(targetY-py)*separate+drift;
    const shell=Math.sqrt(Math.max(0,1-distance*distance));
    const ridge=.5+.5*Math.sin((x*.014+y*.024)+progress*3.5);
    const noise=((col*17+row*29)%23)/23;
    const radius=(.5+shell*2.5+ridge*.65)*(1-separate*.35)*scale;
    const violet=clamp((x+320)/640+.18*Math.sin(y*.016));
    const red=Math.round(192-violet*51+ridge*18),green=Math.round(119+violet*5+ridge*24),blue=Math.round(96+violet*74+ridge*19);
    context.fillStyle=`rgba(${red},${green},${blue},${(.24+shell*.61+noise*.11)*(1-separate*.78)})`;
    context.beginPath();context.arc(cx+finalX*scale,cy+finalY*scale,radius,0,Math.PI*2);context.fill();
  }
  const scan=progress*1.7%1;
  context.strokeStyle=`rgba(119,85,117,${.22*(1-separate)})`;context.lineWidth=.8;
  context.beginPath();context.moveTo(cx-345*scale,cy+(-240+scan*480)*scale);context.lineTo(cx+345*scale,cy+(-240+scan*480)*scale);context.stroke();
}

export default function OpticalReading({fields}: {fields:readonly Field[]}) {
  const root=useRef<HTMLElement>(null),stage=useRef<HTMLDivElement>(null),canvas=useRef<HTMLCanvasElement>(null);
  const [enhanced,setEnhanced]=useState(false),[active,setActive]=useState(0);
  useEffect(()=>{
    const media=matchMedia('(prefers-reduced-motion: no-preference)');
    const sync=()=>setEnhanced(media.matches);sync();media.addEventListener('change',sync);
    return()=>media.removeEventListener('change',sync);
  },[]);
  useEffect(()=>{
    if(!canvas.current||!root.current||!stage.current) return;
    const element=canvas.current,context=element.getContext('2d');if(!context) return;
    let scheduled=0,width=0,height=0,last=-1;
    const paint=()=>{
      scheduled=0;if(document.hidden||!root.current||!stage.current) return;
      const box=root.current.getBoundingClientRect();
      if(enhanced&&(box.bottom<0||box.top>innerHeight)) return;
      const top=Number.parseFloat(getComputedStyle(stage.current).top)||0;
      const progress=enhanced?clamp((top-box.top)/Math.max(1,box.height-stage.current.clientHeight)):1;
      if(progress===last) return;last=progress;
      drawOpticalField(context,width,height,progress);
      stage.current.style.setProperty('--optical-open',String(ease((progress-.16)/.64)));
      stage.current.style.setProperty('--optical-opacity',String(ease((progress-.13)/.24)));
      stage.current.style.setProperty('--optical-progress',String(progress));
      stage.current.dataset.opticalProgress=progress.toFixed(3);
      setActive(closestStoryChapter(progress,[0,1/3,2/3,1]));
    };
    const schedule=()=>{if(!scheduled)scheduled=requestAnimationFrame(paint);};
    const measure=()=>{
      const bounds=element.getBoundingClientRect();width=bounds.width;height=bounds.height;
      const dpr=Math.min(devicePixelRatio||1,1.5);element.width=Math.round(width*dpr);element.height=Math.round(height*dpr);context.setTransform(dpr,0,0,dpr,0,0);last=-1;schedule();
    };
    const observer=new ResizeObserver(measure);observer.observe(element);measure();
    window.addEventListener('scroll',schedule,{passive:true});document.addEventListener('visibilitychange',schedule);
    return()=>{observer.disconnect();cancelAnimationFrame(scheduled);window.removeEventListener('scroll',schedule);document.removeEventListener('visibilitychange',schedule);};
  },[enhanced]);
  function go(index:number){
    if(!root.current||!stage.current)return;
    const top=Number.parseFloat(getComputedStyle(stage.current).top)||0;
    window.scrollTo({top:root.current.getBoundingClientRect().top+scrollY-top+(root.current.offsetHeight-stage.current.clientHeight)*index/3,behavior:enhanced?'smooth':'instant'});
  }
  return <section ref={root} className="science-optical" data-enhanced={enhanced} aria-label="Las cuatro partes de una lectura">
    <div ref={stage} className="science-optical-stage">
      <div className="science-optical-meta"><span>OBSERVAR / DAR CONTEXTO</span><span>0{active+1} — 04</span></div>
      <div className="science-optical-copy"><p className="science-optical-overline">Una cifra no viaja sola.</p><h2>{enhanced?fields[active].question:'El contexto completa la lectura.'}</h2><p>{enhanced?fields[active].explanation:'El valor, la unidad, la referencia y la fuente son partes distintas de una misma lectura. Conserva cada una junto al resultado.'}</p><a href="#science-document-stage">Volver al documento <ArrowDownRight size={15} strokeWidth={1.35} aria-hidden="true"/></a></div>
      <div className="science-optical-visual" aria-hidden="true"><canvas ref={canvas}/><div className="science-optical-bands">{fields.map((field,index)=><div key={field.id} className="science-optical-band" data-active={index===active} style={{'--band-index':index} as React.CSSProperties}><span>0{index+1} / {field.label}</span><strong>{field.value}</strong></div>)}</div><span className="science-optical-caption">LA MISMA MEDICIÓN / CUATRO CLAVES</span></div>
      {enhanced?<nav className="science-optical-navigation" aria-label="Explorar las claves de una lectura">{fields.map((field,index)=><button key={field.id} type="button" aria-current={active===index?'step':undefined} onClick={()=>go(index)}><span>0{index+1}</span>{field.label}</button>)}</nav>:<p className="science-optical-static-note">Esquema educativo · Datos ficticios</p>}
      <div className="science-optical-progress" aria-hidden="true"><i/></div>
    </div>
  </section>;
}
