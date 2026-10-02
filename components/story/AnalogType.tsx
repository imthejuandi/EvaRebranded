'use client';
import {useEffect,useRef,useState,type CSSProperties} from 'react';

type Cell={x:number;y:number;value:number;seed:number};
type Layers={rectangles:HTMLCanvasElement;letters:HTMLCanvasElement;mask:HTMLCanvasElement;work:HTMLCanvasElement;ratio:number;generation:number;color:string;letterStep:number};
const alphabet='EVAVIDASALUD';

/** The same serif cells and scan, with positioned lettering cached between letter changes. */
export function AnalogType({text,width,height,frame=0,color='#f3f0e8',style}:{text:string;width:number;height:number;frame?:number;color?:string;style?:CSSProperties}){
 const canvas=useRef<HTMLCanvasElement>(null),cells=useRef<Cell[]>([]),columns=useRef<number[]>([]);
 const layers=useRef<Layers|null>(null),generation=useRef(0);
 const [ready,setReady]=useState(false);
 const step=Math.max(2.6,width/104);
 useEffect(()=>{
  const mask=document.createElement('canvas');mask.width=Math.ceil(width);mask.height=Math.ceil(height);
  const ctx=mask.getContext('2d',{willReadFrequently:true});if(!ctx)return;
  let size=height*1.18;ctx.font=`${size}px "Times New Roman", Georgia, serif`;
  size*=Math.min(1,(width-step*2)/ctx.measureText(text).width);
  ctx.font=`${size}px "Times New Roman", Georgia, serif`;ctx.fillStyle='white';ctx.textBaseline='alphabetic';
  const metrics=ctx.measureText(text),actualHeight=metrics.actualBoundingBoxAscent+metrics.actualBoundingBoxDescent;
  ctx.fillText(text,(width-metrics.width)/2,(height-actualHeight)/2+metrics.actualBoundingBoxAscent);
  const data=ctx.getImageData(0,0,mask.width,mask.height).data,next:Cell[]=[],xs:number[]=[];
  for(let x=0;x<width-step;x+=step)xs.push(x);
  for(let y=0,row=0;y<height-step;y+=step,row++)for(let col=0;col<xs.length;col++){
   const x=xs[col];let coverage=0;
   for(const dy of [.25,.5,.75])for(const dx of [.25,.5,.75])coverage+=data[(Math.floor(y+step*dy)*mask.width+Math.floor(x+step*dx))*4+3]/255;
   if(coverage>1.5)next.push({x,y,value:Math.min(1,coverage/4),seed:(col*37+row*71)%101});
  }
  cells.current=next;columns.current=xs;generation.current++;setReady(true);
 },[text,width,height,step]);
 useEffect(()=>{
  const el=canvas.current;if(!el)return;
  const ctx=el.getContext('2d');if(!ctx)return;
  const ratio=Math.min(window.devicePixelRatio||1,2),pixelWidth=Math.ceil(width*ratio),pixelHeight=Math.ceil(height*ratio);
  if(el.width!==pixelWidth||el.height!==pixelHeight){el.width=pixelWidth;el.height=pixelHeight;}
  let cache=layers.current;
  if(!cache){
   const surface=()=>document.createElement('canvas');
   cache=layers.current={rectangles:surface(),letters:surface(),mask:surface(),work:surface(),ratio:0,generation:-1,color:'',letterStep:-1};
  }
  const resize=cache.ratio!==ratio||cache.rectangles.width!==pixelWidth||cache.rectangles.height!==pixelHeight;
  if(resize){
   for(const surface of [cache.rectangles,cache.letters,cache.mask,cache.work]){surface.width=pixelWidth;surface.height=pixelHeight;}
   cache.ratio=ratio;cache.generation=-1;cache.letterStep=-1;
  }
  const rectangles=cache.rectangles.getContext('2d'),letters=cache.letters.getContext('2d'),mask=cache.mask.getContext('2d'),work=cache.work.getContext('2d');
  if(!rectangles||!letters||!mask||!work)return;
  if(cache.generation!==generation.current||cache.color!==color){
   rectangles.setTransform(ratio,0,0,ratio,0,0);rectangles.clearRect(0,0,width,height);rectangles.fillStyle=color;
   for(const cell of cells.current){rectangles.globalAlpha=cell.value;rectangles.fillRect(cell.x,cell.y,step*.87,step*.87);}
   cache.generation=generation.current;cache.color=color;cache.letterStep=-1;
  }
  const letterStep=Math.floor(frame/9);
  if(cache.letterStep!==letterStep){
   letters.setTransform(ratio,0,0,ratio,0,0);letters.clearRect(0,0,width,height);letters.globalAlpha=1;
   letters.fillStyle='#0b1010';letters.font=`${step*.78}px Arial`;letters.textAlign='center';letters.textBaseline='middle';
   for(const cell of cells.current)if(cell.seed%4!==0)letters.fillText(alphabet[(cell.seed+letterStep)%alphabet.length],cell.x+step*.43,cell.y+step*.47);
   cache.letterStep=letterStep;
  }
  const activeCache=cache,scan=(frame*2.6)%(width+80)-40;
  ctx.setTransform(1,0,0,1,0,0);ctx.clearRect(0,0,pixelWidth,pixelHeight);ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
  const compose=(source:HTMLCanvasElement,baseAlpha:number,scanAlpha:number)=>{
   mask.setTransform(1,0,0,1,0,0);mask.clearRect(0,0,pixelWidth,pixelHeight);mask.fillStyle='black';mask.globalCompositeOperation='source-over';
   for(let i=0;i<columns.current.length;i++){
    const x=columns.current[i],next=columns.current[i+1],glow=Math.max(0,1-Math.abs(x-scan)/45);
    // Place mask boundaries inside the empty cell gutters, on physical pixels: no alpha seams.
    const left=i===0?0:Math.round((x-step*.065)*ratio),right=next===undefined?pixelWidth:Math.round((next-step*.065)*ratio);
    mask.globalAlpha=baseAlpha+glow*scanAlpha;mask.fillRect(left,0,right-left,pixelHeight);
   }
   work.setTransform(1,0,0,1,0,0);work.globalAlpha=1;work.globalCompositeOperation='copy';work.drawImage(source,0,0);
   work.globalCompositeOperation='destination-in';work.drawImage(activeCache.mask,0,0);
   ctx.drawImage(activeCache.work,0,0);
  };
  // Preserve the original source-over order and the two independent scan weights.
  compose(cache.rectangles,.83,.17);
  compose(cache.letters,.30,.16);
 },[frame,width,height,step,color,ready,text]);
 return <span data-analog-type={text} data-analog-frame={frame} data-cell-count={ready?cells.current.length:0} aria-hidden="true" style={{display:'block',position:'relative',width,height,...style}}>
  {!ready&&<svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%"><text x="50%" y="75%" textAnchor="middle" textLength={width*.94} lengthAdjust="spacingAndGlyphs" fill={color} fontFamily="Times New Roman, Georgia, serif" fontSize={height}>{text}</text></svg>}
  <canvas ref={canvas} style={{position:'absolute',inset:0,width:'100%',height:'100%',opacity:ready?1:0}}/>
 </span>;
}
