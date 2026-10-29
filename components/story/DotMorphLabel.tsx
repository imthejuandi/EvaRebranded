'use client';
import {useEffect,useRef} from 'react';

type Cell={x:number;y:number;radius:number;delay:number};
type Ink={source:HTMLCanvasElement;cells:Cell[];width:number;height:number;ratio:number;step:number;color:string};
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const smooth=(n:number)=>{const p=clamp(n);return p*p*(3-2*p)};

/** A finite scan breaks the existing glyphs into dots; it reverses from its current position. */
export function DotMorphLabel({children,selected=false}:{children:string;selected?:boolean}){
 const label=useRef<HTMLSpanElement>(null),canvas=useRef<HTMLCanvasElement>(null);
 const selection=useRef(selected),refresh=useRef<(()=>void)|null>(null);
 useEffect(()=>{selection.current=selected;refresh.current?.()},[selected]);
 useEffect(()=>{
  const el=label.current,output=canvas.current,native=el?.querySelector<HTMLElement>('.dot-morph-text');
  const control=el?.closest<HTMLElement>('a,button');
  if(!el||!output||!native||!control)return;
  const ctx=output.getContext('2d');if(!ctx)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)'),fine=matchMedia('(hover: hover) and (pointer: fine)');
  let ink:Ink|null=null,raf=0,value=0,target=0,previous=0,hovered=false,pressed=false,disposed=false;
  const prepare=()=>{
   // Use layout dimensions so the kinetic entrance cannot skew the glyph grid.
   const style=getComputedStyle(native),box={width:parseFloat(style.width),height:parseFloat(style.height)};
   if(!box.width||!box.height)return null;
   const fontSize=parseFloat(style.fontSize),ratio=Math.min(devicePixelRatio||1,2);
   // Enlarged text may wrap; keep native multiline lettering fully readable.
   if(box.height>parseFloat(style.lineHeight)*1.4)return null;
   const width=box.width,height=box.height,step=Math.max(1.25,fontSize/18);
   const source=document.createElement('canvas');source.width=Math.ceil(width*ratio);source.height=Math.ceil(height*ratio);
   const paint=source.getContext('2d',{willReadFrequently:true});if(!paint)return null;
   paint.scale(ratio,ratio);paint.font=`${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
   paint.fillStyle=style.color;paint.textBaseline='alphabetic';
   const metrics=paint.measureText(children);
   const ascent=metrics.fontBoundingBoxAscent??fontSize*.9,descent=metrics.fontBoundingBoxDescent??fontSize*.22;
   paint.fillText(children,0,(height-ascent-descent)/2+ascent);
   const pixels=paint.getImageData(0,0,source.width,source.height).data,cells:Cell[]=[];
   for(let y=0,row=0;y<height;y+=step,row++)for(let x=0,col=0;x<width;x+=step,col++){
    let coverage=0;
    for(const dy of [.2,.5,.8])for(const dx of [.2,.5,.8]){
     const px=Math.min(source.width-1,Math.floor((x+step*dx)*ratio)),py=Math.min(source.height-1,Math.floor((y+step*dy)*ratio));
     coverage+=pixels[(py*source.width+px)*4+3]/255;
    }
    // Coverage shapes the edge dots instead of inflating every partial cell.
    const fill=coverage/9;
    if(fill>.08)cells.push({x,y,radius:step*(.14+.30*Math.sqrt(fill)),delay:x/width*.48+((row*13+col*7)%11)*.003});
   }
   output.width=source.width;output.height=source.height;
   return {source,cells,width,height,ratio,step,color:style.color};
  };
  const draw=()=>{
   if(value===0){el.removeAttribute('data-rendering');el.dataset.morph='0';return}
   if(!ink)ink=prepare();if(!ink){el.removeAttribute('data-rendering');return}
   const {source,cells,width,height,ratio,step,color}=ink;
   ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,width,height);ctx.fillStyle=color;
   for(const cell of cells){
    const p=smooth((value*1.56-cell.delay)/1.02),w=Math.min(step,width-cell.x),h=Math.min(step,height-cell.y);
    // The source fragment and its dot share one grid site and one glyph footprint.
    if(p<1){ctx.globalAlpha=1-p;ctx.drawImage(source,cell.x*ratio,cell.y*ratio,w*ratio,h*ratio,cell.x,cell.y,w,h)}
    if(p>0){ctx.globalAlpha=p;ctx.beginPath();ctx.arc(cell.x+step*.5,cell.y+step*.5,cell.radius,0,Math.PI*2);ctx.fill()}
   }
   ctx.globalAlpha=1;el.dataset.rendering='true';el.dataset.morph=value.toFixed(3);
  };
  const tick=(time:number)=>{
   raf=0;const dt=previous?Math.min(time-previous,40):16;previous=time;
   const duration=target?420:320;value=target?Math.min(target,value+dt/duration):Math.max(target,value-dt/duration);
   draw();if(value!==target)raf=requestAnimationFrame(tick);else el.dataset.animating='false';
  };
  const update=()=>{
   target=hovered||pressed||control.matches(':focus-visible')||selection.current?1:0;
   if(reduced.matches){cancelAnimationFrame(raf);raf=0;value=0;draw();el.dataset.animating='false';return}
   if(target===value||raf)return;
   if(value===0)ink=null;previous=0;el.dataset.animating='true';raf=requestAnimationFrame(tick);
  };
  const enter=()=>{if(fine.matches)hovered=true;update()};
  const leave=()=>{hovered=false;pressed=false;update()};
  const down=()=>{pressed=true;update()};
  const up=()=>{pressed=false;update()};
  const focus=()=>queueMicrotask(()=>{if(!disposed)update()});
  const resize=new ResizeObserver(()=>{ink=null;if(value)draw()});resize.observe(native);
  const visibility=()=>{if(document.hidden){cancelAnimationFrame(raf);raf=0;value=target;draw();el.dataset.animating='false'}};
  control.addEventListener('pointerenter',enter);control.addEventListener('pointerleave',leave);
  control.addEventListener('pointerdown',down);window.addEventListener('pointerup',up);
  control.addEventListener('pointercancel',leave);control.addEventListener('focus',focus);control.addEventListener('blur',focus);
  reduced.addEventListener('change',update);document.addEventListener('visibilitychange',visibility);
  refresh.current=update;update();
  return()=>{disposed=true;refresh.current=null;cancelAnimationFrame(raf);resize.disconnect();control.removeEventListener('pointerenter',enter);control.removeEventListener('pointerleave',leave);control.removeEventListener('pointerdown',down);window.removeEventListener('pointerup',up);control.removeEventListener('pointercancel',leave);control.removeEventListener('focus',focus);control.removeEventListener('blur',focus);reduced.removeEventListener('change',update);document.removeEventListener('visibilitychange',visibility)};
 },[children]);
 return <span className="dot-morph" ref={label}><span className="dot-morph-text">{children}</span><canvas ref={canvas} aria-hidden="true"/></span>;
}
