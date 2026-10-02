'use client';

import {forwardRef,useImperativeHandle,useLayoutEffect,useRef,type CSSProperties} from 'react';

export const RUNNER_ARRIVAL_END=5.5;
export const RUNNER_ARRIVAL_PHOTO_READY=3.5;
export const RUNNER_ARRIVAL_LABEL_OFFSET=2;
const INK='#0b1010',COLS=80,ROWS=100,SOURCE_WIDTH=864,SOURCE_HEIGHT=1080;
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const smooth=(n:number)=>{const t=clamp(n);return t*t*(3-2*t)};
const hash=(n:number)=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};

export type RunnerArrivalRect={x:number;y:number;width:number;height:number};
export type RunnerArrivalHandle={
 /** Called by the existing runner's decoded-frame callback. No second decoder or clock. */
 drawFrame:(video:HTMLVideoElement,elapsedSeconds:number)=>boolean;
};
type Props={width:number;height:number;mediaRect?:RunnerArrivalRect;className?:string;style?:CSSProperties;onReady?:()=>void;onComplete?:()=>void;onError?:()=>void};

/** Black → in-place silhouette dots → live runner → persistent biomarker labels. */
export function runnerArrivalState(time:number){
 const t=Math.max(0,time);
 return {time:t,arrival:smooth((t-.08)/.92),develop:smooth((t-1.65)/1.75),clean:smooth((t-3.15)/.35)};
}

/** Only the live figure can light a dot; transparent/black backing stays empty. */
export function runnerSilhouetteEnergy(peak:number,alpha:number){
 return smooth((peak/255-.13)/.35)*clamp(alpha/255);
}

export function runnerArrivalCrop(rect:RunnerArrivalRect){
 const scale=Math.max(rect.width/SOURCE_WIDTH,rect.height/SOURCE_HEIGHT);
 const width=rect.width/scale,height=rect.height/scale;
 return {x:(SOURCE_WIDTH-width)/2,y:(SOURCE_HEIGHT-height)/2,width,height};
}

/**
 * Direct silhouette renderer. It owns only canvas buffers; the existing live video owns
 * decoding, pause/visibility handling and the clock. The host removes this canvas
 * after its handoff. Until then, the clean photograph continues on every frame.
 */
export const RunnerArrival=forwardRef<RunnerArrivalHandle,Props>(function RunnerArrival({width,height,mediaRect,className,style,onReady,onComplete,onError},ref){
 const canvas=useRef<HTMLCanvasElement>(null);
 const engine=useRef<RunnerArrivalHandle|null>(null);
 const callbacks=useRef({onReady,onComplete,onError});callbacks.current={onReady,onComplete,onError};
 const last=useRef<{video:HTMLVideoElement;elapsed:number}|null>(null);
 const announced=useRef({ready:false,complete:false,error:false});
 const mediaHeight=mediaRect?.height??height*.98;
 const mediaWidth=mediaRect?.width??mediaHeight*.8;
 const mediaX=mediaRect?.x??(width-mediaWidth)/2;
 const mediaY=mediaRect?.y??(height-mediaHeight)/2;

 useImperativeHandle(ref,()=>({drawFrame(video,elapsedSeconds){
  last.current={video,elapsed:elapsedSeconds};
  return engine.current?.drawFrame(video,elapsedSeconds)??false;
 }}),[]);

 useLayoutEffect(()=>{
  const output=canvas.current;if(!output||width<=0||height<=0||mediaWidth<=0||mediaHeight<=0)return;
  const make=(w:number,h:number)=>{const c=document.createElement('canvas');c.width=Math.ceil(w);c.height=Math.ceil(h);return c};
  // The mobile canvas is temporary; native full-resolution video takes over at
  // completion. Reduce source readback by 55.6% without changing the dot lattice.
  const backingWidth=width<=700?576:SOURCE_WIDTH,backingHeight=width<=700?720:SOURCE_HEIGHT;
  const sourceScale=backingWidth/SOURCE_WIDTH;
  const source=make(backingWidth,backingHeight),sample=make(COLS,ROWS),photo=make(width,height),mask=make(width,height);
  const feather=make(backingWidth,backingHeight),vignette=make(width,height);
  const ctx=output.getContext('2d'),sourceCtx=source.getContext('2d',{willReadFrequently:true}),sampleCtx=sample.getContext('2d',{willReadFrequently:true}),photoCtx=photo.getContext('2d'),maskCtx=mask.getContext('2d'),featherCtx=feather.getContext('2d'),vignetteCtx=vignette.getContext('2d');
  if(!ctx||!sourceCtx||!sampleCtx||!photoCtx||!maskCtx||!featherCtx||!vignetteCtx){if(!announced.current.error){announced.current.error=true;callbacks.current.onError?.()}return;}
  output.width=Math.ceil(width);output.height=Math.ceil(height);
  output.dataset.sourcePixels=String(backingWidth*backingHeight);output.dataset.sourceSize=`${backingWidth}x${backingHeight}`;
  ctx.fillStyle=INK;ctx.fillRect(0,0,width,height);
  const rect={x:mediaX,y:mediaY,width:mediaWidth,height:mediaHeight},nativeCrop=runnerArrivalCrop(rect);
  const crop={x:nativeCrop.x*sourceScale,y:nativeCrop.y*sourceScale,width:nativeCrop.width*sourceScale,height:nativeCrop.height*sourceScale};
  const pitch=mediaWidth/COLS,pitchY=mediaHeight/ROWS;
  const points=Array.from({length:COLS*ROWS},(_,i)=>({
   x:(i%COLS+.5)*pitch+mediaX,y:(Math.floor(i/COLS)+.5)*pitchY+mediaY,
   seed:hash(i+11),column:hash(i%COLS+62),
  }));
  // These optical masks are invariant: cache them once, instead of allocating
  // gradients or a full-frame image for every decoded runner frame.
  featherCtx.translate(backingWidth/2,backingHeight/2);featherCtx.scale(backingWidth/2,backingHeight/2);
  const optical=featherCtx.createRadialGradient(0,0,.42,0,0,1.12);
  optical.addColorStop(0,'#fff');optical.addColorStop(.52,'rgba(255,255,255,.94)');optical.addColorStop(1,'transparent');
  featherCtx.fillStyle=optical;featherCtx.fillRect(-1,-1,2,2);
  const edge=vignetteCtx.createRadialGradient(width*.5,height*.5,height*.26,width*.5,height*.5,height*.68);
  edge.addColorStop(0,'#fff');edge.addColorStop(.7,'#fff');edge.addColorStop(1,'transparent');
  vignetteCtx.fillStyle=edge;vignetteCtx.fillRect(0,0,width,height);
  const alpha=Array.from({length:256},(_,peak)=>peak<58?smooth((peak-25)/33):1);
  let disposed=false,failed=false,cachedVideo:HTMLVideoElement|null=null,cachedTime=-1,rgb:Uint8ClampedArray<ArrayBufferLike>|null=null;

  const photograph=(target:CanvasRenderingContext2D)=>target.drawImage(source,crop.x,crop.y,crop.width,crop.height,mediaX,mediaY,mediaWidth,mediaHeight);
  const prepare=(video:HTMLVideoElement)=>{
   if(cachedVideo===video&&cachedTime===video.currentTime){output.dataset.preprocessMs='0.00';return;}
   const started=performance.now();
   sourceCtx.globalCompositeOperation='source-over';sourceCtx.clearRect(0,0,backingWidth,backingHeight);sourceCtx.drawImage(video,0,0,backingWidth,backingHeight);
   // Preserve A's exact near-black backing removal and colored optical trails.
   const pixels=sourceCtx.getImageData(0,0,backingWidth,backingHeight),rgba=pixels.data;
   for(let i=0;i<rgba.length;i+=4){const peak=Math.max(rgba[i],rgba[i+1],rgba[i+2]);if(peak<58)rgba[i+3]=Math.round(rgba[i+3]*alpha[peak]);}
   sourceCtx.putImageData(pixels,0,0);sourceCtx.globalCompositeOperation='destination-in';sourceCtx.drawImage(feather,0,0);sourceCtx.globalCompositeOperation='source-over';
   sampleCtx.clearRect(0,0,COLS,ROWS);sampleCtx.drawImage(source,crop.x,crop.y,crop.width,crop.height,0,0,COLS,ROWS);
   rgb=sampleCtx.getImageData(0,0,COLS,ROWS).data;
   cachedVideo=video;cachedTime=video.currentTime;
   output.dataset.preprocessMs=(performance.now()-started).toFixed(2);
  };

  const drawFrame=(video:HTMLVideoElement,elapsedSeconds:number)=>{
   if(disposed||failed||video.readyState<2||!video.videoWidth)return false;
   const started=performance.now(),s=runnerArrivalState(elapsedSeconds);
   try{
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';ctx.fillStyle=INK;ctx.fillRect(0,0,width,height);
    if(s.arrival>0){
     prepare(video);maskCtx.clearRect(0,0,width,height);
     if(s.develop>0&&s.clean<1){
      maskCtx.fillStyle='#fff';maskCtx.beginPath();
      for(const p of points){
       const local=smooth((s.develop-.18*p.seed-.1*p.y/height)/.72),radius=pitch*.77*local;
       if(radius>.02){maskCtx.moveTo(p.x+radius,p.y);maskCtx.arc(p.x,p.y,radius,0,Math.PI*2);}
      }
      maskCtx.fill();photoCtx.clearRect(0,0,width,height);photograph(photoCtx);
      photoCtx.globalCompositeOperation='destination-in';photoCtx.drawImage(mask,0,0);photoCtx.globalCompositeOperation='source-over';ctx.drawImage(photo,0,0);
     }
     if(s.clean===1)photograph(ctx);
     else if(rgb){
      for(let i=0;i<points.length;i++){
       const p=points[i],r=rgb[i*4],g=rgb[i*4+1],blue=rgb[i*4+2];
       const energy=runnerSilhouetteEnergy(Math.max(r,g,blue),rgb[i*4+3]);
       const scan=.5+.5*Math.sin(p.y/height*11-s.time*3+p.column*4);
       const early=smooth((s.arrival-p.seed*.42)/.58),local=smooth((s.develop-.18*p.seed-.1*p.y/height)/.72);
       const opacity=early*energy*(1-local)*(1-s.clean);if(opacity<.01)continue;
       const radius=pitch*(.11+.30*Math.sqrt(energy))*(.86+.14*scan),warmth=smooth((s.time-1.5)/1.4)*.88;
       const red=Math.round(239+(r-239)*warmth),green=Math.round(238+(g-238)*warmth),bcol=Math.round(221+(blue-221)*warmth);
       ctx.globalAlpha=opacity;ctx.fillStyle=`rgb(${red} ${green} ${bcol})`;ctx.beginPath();ctx.arc(p.x,p.y,radius,0,Math.PI*2);ctx.fill();
      }
     }
     ctx.globalAlpha=1;ctx.globalCompositeOperation='destination-in';ctx.drawImage(vignette,0,0);
     ctx.globalCompositeOperation='destination-over';ctx.fillStyle=INK;ctx.fillRect(0,0,width,height);ctx.globalCompositeOperation='source-over';
    }
    output.dataset.revealTime=s.time.toFixed(3);output.dataset.revealFrame=String(s.time*24);output.dataset.drawMs=(performance.now()-started).toFixed(2);
   }catch{
    failed=true;if(!announced.current.error){announced.current.error=true;callbacks.current.onError?.()}return false;
   }
   if(!announced.current.ready){announced.current.ready=true;callbacks.current.onReady?.()}
   if(s.time>=RUNNER_ARRIVAL_END&&!announced.current.complete){announced.current.complete=true;callbacks.current.onComplete?.()}
   return true;
  };
  engine.current={drawFrame};
  if(last.current)drawFrame(last.current.video,last.current.elapsed);
  return()=>{disposed=true;engine.current=null;cachedVideo=null;rgb=null;for(const buffer of [source,sample,photo,mask,feather,vignette]){buffer.width=1;buffer.height=1;}};
 },[width,height,mediaX,mediaY,mediaWidth,mediaHeight]);

 return <canvas ref={canvas} aria-hidden="true" data-runner-arrival className={className} width={width} height={height} style={{position:'absolute',inset:0,width,height,background:INK,pointerEvents:'none',...style}}/>;
});
