// Reused from landing BiomarkerGallery. Comma supports localized decimal values.
'use client';
import {useEffect,useMemo,useRef,useState} from 'react';

const glyphs:Record<string,string[]>={
 '0':['01110','10001','10011','10101','11001','10001','01110'],
 '1':['00100','01100','00100','00100','00100','00100','01110'],
 '2':['01110','10001','00001','00010','00100','01000','11111'],
 '3':['11110','00001','00001','01110','00001','00001','11110'],
 '4':['00010','00110','01010','10010','11111','00010','00010'],
 '5':['11111','10000','10000','11110','00001','00001','11110'],
 '6':['01110','10000','10000','11110','10001','10001','01110'],
 '7':['11111','00001','00010','00100','01000','01000','01000'],
 '8':['01110','10001','10001','01110','10001','10001','01110'],
 '9':['01110','10001','10001','01111','00001','00001','01110'],
 '.':['0','0','0','0','0','0','1'],
 ',':['0','0','0','0','0','1','1'],
 '-':['000','000','000','111','000','000','000'],
};
const circle=(x:number,y:number,r:number)=>`M${x-r},${y}a${r},${r} 0 1,0 ${r*2},0a${r},${r} 0 1,0 ${-r*2},0`;

// Same staggered eight-lamp cell as Analog Signal. Paths keep large readouts inexpensive.
export function DotNumber({value,calm=false,active=true,className='',density='fine'}:{value:string;calm?:boolean;active?:boolean;className?:string;density?:'fine'|'coarse'}){
 const root=useRef<SVGSVGElement>(null);const [step,setStep]=useState(8);
 const shape=useMemo(()=>{let left=0;const lamps:{x:number;y:number;on:boolean}[]=[];
  for(const char of value){const glyph=glyphs[char]??glyphs['-'];glyph.forEach((row,y)=>[...row].forEach((v,x)=>{if(density==='coarse')lamps.push({x:left+x,y,on:v==='1'});else for(const dx of [-.25,.25])for(const dy of [-.25,.25])for(const d of [-.125,.125])lamps.push({x:left+x+dx+d,y:y+dy+d,on:v==='1'});}));left+=glyph[0].length+1;}
  return{lamps,width:left,background:lamps.map(p=>circle(p.x,p.y,.022)).join('')};
 },[value,density]);
 useEffect(()=>{if(calm||!active||matchMedia('(prefers-reduced-motion: reduce)').matches){setStep(8);return;}
  const el=root.current;if(!el)return;let raf=0;let started=false;setStep(0);
  const observer=new IntersectionObserver(([entry])=>{if(!entry.isIntersecting||started)return;started=true;let start:number|undefined;
   const tick=(time:number)=>{start??=time;const next=Math.min(8,Math.floor((time-start)/75));setStep(next);if(next<8)raf=requestAnimationFrame(tick);};raf=requestAnimationFrame(tick);observer.disconnect();
  },{threshold:.4});observer.observe(el);return()=>{observer.disconnect();cancelAnimationFrame(raf)};
 },[value,calm,active]);
 const lit=shape.lamps.filter((p,i)=>p.on&&(step===8||step/8>((i*7)%17)/16));
 return <svg ref={root} className={'dot-number '+className} viewBox={`-1 -1 ${shape.width+1} 8`} role="img" aria-label={value} data-dot-number={value} data-dot-step={step}>
  <path d={shape.background} fill="currentColor" opacity=".2"/>
  <path d={lit.map(p=>circle(p.x,p.y,density==='coarse'?.23:.13)).join('')} fill="currentColor"/>
 </svg>;
}
