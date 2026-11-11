type ArrivalState = (time:number)=>{arrival:number;develop:number;clean:number;time?:number};
type Dot = {x:number;y:number;alphaBase:number;radiusBase:number;arrivalDelay:number;seedDelay:number;rowDelay:number;scanRow:number;scanSeed:number};
type Cache = {width:number;height:number;ratio:number;pitch:number;color:string;source:HTMLCanvasElement;photo:HTMLCanvasElement;mask:HTMLCanvasElement;photoCtx:CanvasRenderingContext2D;maskCtx:CanvasRenderingContext2D;dots:Dot[];locals:Float64Array;radii:Float64Array;bucketHeads:Int32Array;bucketNext:Int32Array};
export type KitMeaningArrival = {paint:(progress:number)=>boolean;dispose:()=>void};
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const smooth=(n:number)=>{const p=clamp(n);return p*p*(3-2*p);};
const ALPHA_BUCKETS=64;
const hash=(n:number)=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};

/** Reuses the runner's actual arrival clock on cached subtitle glyphs, never assay names. */
export function installKitMeaningArrival(root:HTMLElement, arrivalState:ArrivalState):KitMeaningArrival|null {
 const index=root.querySelector<HTMLElement>('.kit-marker-index');
 const meanings=Array.from(root.querySelectorAll<HTMLElement>('[data-kit-meaning]'));
 if(!index||meanings.length!==13||matchMedia('(prefers-reduced-motion: reduce)').matches)return null;
 const output=document.createElement('canvas'),ctx=output.getContext('2d');
 if(!ctx)return null;
 output.className='kit-meaning-arrival';output.setAttribute('aria-hidden','true');output.dataset.kitDotReveal='';
 index.appendChild(output);
 const snapshots=meanings.map(el=>({opacity:el.style.opacity,transform:el.style.transform}));
 let cache:Cache|null=null,disposed=false,raf=0,last=0,lastDrawn=-1,builds=0;
 let paintCount=0,totalPaintMs=0,maxPaintMs=0,maxDotFillBatches=0,maxFillBatches=0;
 const recordPaint=(started:number,dotFillBatches:number,maskFillBatches:number)=>{
  const elapsed=performance.now()-started;paintCount++;totalPaintMs+=elapsed;maxPaintMs=Math.max(maxPaintMs,elapsed);
  maxDotFillBatches=Math.max(maxDotFillBatches,dotFillBatches);maxFillBatches=Math.max(maxFillBatches,dotFillBatches+maskFillBatches);
  output.dataset.lastPaintMs=elapsed.toFixed(3);output.dataset.maxPaintMs=maxPaintMs.toFixed(3);output.dataset.totalPaintMs=totalPaintMs.toFixed(3);output.dataset.paintCount=String(paintCount);
  output.dataset.dotFillBatches=String(dotFillBatches);output.dataset.maxDotFillBatches=String(maxDotFillBatches);output.dataset.maxFillBatches=String(maxFillBatches);
 };
 const prepare=()=>{
  if(disposed)return;
  try{
   const bounds=index.getBoundingClientRect(),width=index.clientWidth,height=index.clientHeight;
   if(width<=0||height<=0)return;
   const ratio=Math.min(devicePixelRatio||1,root.clientWidth<=700?1.5:2),make=()=>{const el=document.createElement('canvas');el.width=Math.ceil(width*ratio);el.height=Math.ceil(height*ratio);return el;};
   const source=make(),paint=source.getContext('2d',{willReadFrequently:true});if(!paint)return;
   paint.scale(ratio,ratio);paint.textBaseline='alphabetic';
   let color='#47402f',fontSize=13;
   for(const el of meanings){
    const r=el.getBoundingClientRect(),s=getComputedStyle(el);fontSize=parseFloat(s.fontSize);color=s.color;
    const lineHeight=parseFloat(s.lineHeight)||fontSize*1.35,x=r.left-bounds.left,y=r.top-bounds.top;
    paint.font=`${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;paint.fillStyle=color;
    const measured=paint.measureText('Mg'),ascent=measured.fontBoundingBoxAscent??fontSize*.9,descent=measured.fontBoundingBoxDescent??fontSize*.22;
    const baseline=(lineHeight-ascent-descent)/2+ascent;
    const lines:string[]=[];let line='';
    for(const word of (el.textContent??'').trim().split(/\s+/)){const next=line?line+' '+word:word;if(line&&paint.measureText(next).width>r.width+.2){lines.push(line);line=word;}else line=next;}
    if(line)lines.push(line);
    lines.forEach((text,n)=>paint.fillText(text,x,y+baseline+n*lineHeight));
   }
   const pixels=paint.getImageData(0,0,source.width,source.height).data,pitch=Math.max(2.3,Math.min(3.1,fontSize/4.8)),dots:Dot[]=[];
   for(let y=0,row=0;y<height;y+=pitch,row++)for(let x=0,col=0;x<width;x+=pitch,col++){
    let coverage=0;
    for(const dy of [.2,.5,.8])for(const dx of [.2,.5,.8]){const px=Math.min(source.width-1,Math.floor((x+pitch*dx)*ratio)),py=Math.min(source.height-1,Math.floor((y+pitch*dy)*ratio));coverage+=pixels[(py*source.width+px)*4+3]/255;}
    const energy=coverage/9;if(energy>.035){
     const px=x+pitch*.5,py=y+pitch*.5,seed=hash(row*997+col+11),energyRoot=Math.sqrt(energy);
     dots.push({x:px,y:py,alphaBase:.5+.5*energyRoot,radiusBase:pitch*(.19+.29*energyRoot),arrivalDelay:seed*.42,seedDelay:.18*seed,rowDelay:.1*py/height,scanRow:py/height*11,scanSeed:seed*4});
    }
   }
   if(!dots.length)return;
   const photo=make(),mask=make(),photoCtx=photo.getContext('2d'),maskCtx=mask.getContext('2d');if(!photoCtx||!maskCtx)return;
   cache={width,height,ratio,pitch,color,source,photo,mask,photoCtx,maskCtx,dots,locals:new Float64Array(dots.length),radii:new Float64Array(dots.length),bucketHeads:new Int32Array(ALPHA_BUCKETS),bucketNext:new Int32Array(dots.length)};
   output.width=source.width;output.height=source.height;output.dataset.cacheBuilds=String(++builds);output.dataset.dotCount=String(dots.length);output.dataset.renderer='runner-arrival';output.dataset.pixelRatio=String(ratio);output.dataset.canvasPixels=String(output.width*output.height);
   lastDrawn=-1;draw(last);
  }catch{cache=null;output.dataset.phase='fallback';}
 };
 const draw=(progress:number):boolean=>{
  last=clamp(progress);if(disposed||!cache)return false;if(last===lastDrawn)return true;lastDrawn=last;
  const started=performance.now();
  const {width,height,ratio,pitch,color,source,photo,mask,photoCtx,maskCtx,dots,locals,radii,bucketHeads,bucketNext}=cache,s=arrivalState(last*3.5);
  ctx.setTransform(ratio,0,0,ratio,0,0);ctx.globalAlpha=1;ctx.clearRect(0,0,width,height);
  const clean=last>=.999;
  for(const el of meanings){const opacity=clean?'1':'0';if(el.style.opacity!==opacity)el.style.opacity=opacity;if(el.style.transform!=='none')el.style.transform='none';}
  output.dataset.progress=last.toFixed(4);output.dataset.phase=clean?'clean':s.develop>0?'develop':s.arrival>0?'dots':'idle';
  if(last===0||clean){locals.fill(0);bucketHeads.fill(-1);recordPaint(started,0,0);return true;}
  if(s.develop>0){
   maskCtx.setTransform(ratio,0,0,ratio,0,0);maskCtx.clearRect(0,0,width,height);maskCtx.fillStyle='#fff';maskCtx.beginPath();
   const maskRadius=pitch*.83;
   for(let i=0;i<dots.length;i++){const p=dots[i],local=smooth((s.develop-p.seedDelay-p.rowDelay)/.72),radius=maskRadius*local;locals[i]=local;if(radius>.02){maskCtx.moveTo(p.x+radius,p.y);maskCtx.arc(p.x,p.y,radius,0,Math.PI*2);}}
   maskCtx.fill();photoCtx.setTransform(1,0,0,1,0,0);photoCtx.clearRect(0,0,photo.width,photo.height);photoCtx.drawImage(source,0,0);photoCtx.globalCompositeOperation='destination-in';photoCtx.drawImage(mask,0,0);photoCtx.globalCompositeOperation='source-over';ctx.drawImage(photo,0,0,photo.width,photo.height,0,0,width,height);
  }
  // Keep every circle's original position and continuous radius. Only opacity is
  // grouped (maximum opacity error 1/126), replacing N separate fills with at most 63.
  bucketHeads.fill(-1);const scanTime=last*3.5*3,cleanFade=1-s.clean,developing=s.develop>0;
  for(let i=0;i<dots.length;i++){
   const p=dots[i],local=developing?locals[i]:0,early=smooth((s.arrival-p.arrivalDelay)/.58),alpha=early*p.alphaBase*(1-local)*cleanFade;
   if(alpha<.01)continue;
   const scan=.5+.5*Math.sin(p.scanRow-scanTime+p.scanSeed),bucket=Math.min(ALPHA_BUCKETS-1,Math.max(1,Math.round(alpha*(ALPHA_BUCKETS-1))));
   radii[i]=p.radiusBase*(.9+.1*scan);bucketNext[i]=bucketHeads[bucket];bucketHeads[bucket]=i;
  }
  let dotFillBatches=0;ctx.fillStyle=color;
  for(let bucket=1;bucket<ALPHA_BUCKETS;bucket++){
   if(bucketHeads[bucket]<0)continue;
   ctx.globalAlpha=bucket/(ALPHA_BUCKETS-1);ctx.beginPath();
   for(let i=bucketHeads[bucket];i>=0;i=bucketNext[i]){const p=dots[i],radius=radii[i];ctx.moveTo(p.x+radius,p.y);ctx.arc(p.x,p.y,radius,0,Math.PI*2);}
   ctx.fill();dotFillBatches++;
  }
  recordPaint(started,dotFillBatches,developing?1:0);
  ctx.globalAlpha=1;return true;
 };
 const schedule=()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;prepare();});};
 const observer=new ResizeObserver(schedule);observer.observe(index);
 window.addEventListener('resize',schedule,{passive:true});
 void document.fonts.ready.then(()=>{if(!disposed)schedule();});prepare();
 return {paint(progress){try{return draw(progress);}catch{cache=null;output.style.visibility='hidden';output.dataset.phase='fallback';return false;}},dispose(){disposed=true;cancelAnimationFrame(raf);observer.disconnect();window.removeEventListener('resize',schedule);meanings.forEach((el,n)=>Object.assign(el.style,snapshots[n]));output.remove();cache=null;}};
}
