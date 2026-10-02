'use client';

import {useEffect,useRef} from 'react';
import {fieldPoints,morphPoint,profileForCategory,type FieldPoint,type FieldState} from './field-geometry';
interface Props{category:string;signals:readonly number[];color:string}
function rgb(color:string){return[color.slice(1,3),color.slice(3,5),color.slice(5,7)].map(n=>parseInt(n,16))}
export default function DataDotField({category,signals,color}:Props){
 const canvas=useRef<HTMLCanvasElement>(null);const current=useRef<FieldPoint[]>([]);const currentColor=useRef(rgb(color));
 const signature=signals.join(',');
 useEffect(()=>{
  const node=canvas.current,context=node?.getContext('2d');if(!node||!context)return;
  const state:FieldState={profile:profileForCategory(category),signals};
  let width=0,height=0,mobile=false,frame=0,begin=0,start:FieldPoint[]=[],target:FieldPoint[]=[];const motion=matchMedia('(prefers-reduced-motion: reduce)');
  const destinationColor=rgb(color),startColor=[...currentColor.current];
  const draw=(points:FieldPoint[],tone:number[])=>{context.clearRect(0,0,width,height);context.fillStyle=`rgb(${tone.map(Math.round).join(',')})`;for(const p of points){context.globalAlpha=p.alpha;context.beginPath();context.arc(p.x*width,p.y*height,p.radius*(mobile?.84:1.07),0,Math.PI*2);context.fill()}context.globalAlpha=1;node.dataset.frames=String(Number(node.dataset.frames||0)+1)};
  const settle=()=>{cancelAnimationFrame(frame);current.current=target;currentColor.current=destinationColor;draw(target,destinationColor);node.dataset.settled='true'};
  const resize=(initial=false)=>{cancelAnimationFrame(frame);const bounds=node.getBoundingClientRect();width=bounds.width;height=bounds.height;mobile=width<400;const dpr=Math.min(devicePixelRatio,1.5);node.width=Math.round(width*dpr);node.height=Math.round(height*dpr);context.setTransform(dpr,0,0,dpr,0,0);target=fieldPoints(state,mobile);node.dataset.dots=String(target.length);if(!initial)settle()};
  const tick=(time:number)=>{if(!begin)begin=time;const t=Math.min(1,(time-begin)/760),ease=1-Math.pow(1-t,3);const points=target.map((p,i)=>morphPoint(start[i],p,ease));const tone=destinationColor.map((c,i)=>startColor[i]+(c-startColor[i])*ease);current.current=points;currentColor.current=tone;draw(points,tone);if(t<1&&!motion.matches&&!document.hidden)frame=requestAnimationFrame(tick);else settle()};
  const oldPoints=current.current;resize(true);
  start=oldPoints.length===target.length?oldPoints:fieldPoints({profile:profileForCategory(category),signals:signals.map(()=>0)},mobile);
  if(!motion.matches&&!document.hidden){current.current=start;draw(start,startColor);node.dataset.settled='false';frame=requestAnimationFrame(tick)}else settle()
  // ResizeObserver's initial delivery must not cancel the entry; only actual size changes do.
  const observer=new ResizeObserver(()=>{const b=node.getBoundingClientRect();if(Math.abs(b.width-width)>.5||Math.abs(b.height-height)>.5)resize()});observer.observe(node);
  const visibility=()=>{if(document.hidden)settle()};motion.addEventListener('change',settle);document.addEventListener('visibilitychange',visibility);
  return()=>{cancelAnimationFrame(frame);observer.disconnect();motion.removeEventListener('change',settle);document.removeEventListener('visibilitychange',visibility)};
 },[category,signature,color]);
 return <canvas ref={canvas} aria-hidden="true" className="campo-dots" data-data-shape="true"/>;
}
