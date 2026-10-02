import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {bodySignalState} from '@/lib/body-signal';
import {advanceBodyMaterialFrame} from '@/lib/body-signal-playback';

type SignalState=ReturnType<typeof bodySignalState>;
type Painter={draw:(state:SignalState)=>void;dispose:()=>void};

// Original lamp positions, radius and light, with circle and bloom in one pass.
function lampPainter(canvas:HTMLCanvasElement):Painter|null{
 const gl=canvas.getContext('webgl',{alpha:true,antialias:false,depth:false,stencil:false,premultipliedAlpha:true});
 if(!gl)throw new Error('WebGL unavailable');
 const shader=(type:number,source:string)=>{
  const s=gl.createShader(type);if(!s)throw new Error('Lamp shader unavailable');
  gl.shaderSource(s,source);gl.compileShader(s);
  if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){const reason=gl.getShaderInfoLog(s);gl.deleteShader(s);throw new Error(reason??'Lamp shader unavailable')}
  return s;
 };
 const vertex=shader(gl.VERTEX_SHADER,`
  attribute vec4 lamp;
  uniform vec2 viewport;
  uniform mediump float pixelRatio;
  uniform mediump float halo;
  varying mediump vec3 material;
  void main(){
   gl_Position=vec4(lamp.x/viewport.x*2.0-1.0,1.0-lamp.y/viewport.y*2.0,0.0,1.0);
   float extent=lamp.z+halo*3.0;
   gl_PointSize=extent*2.0*pixelRatio;
   material=vec3(lamp.z,lamp.w,extent);
  }
 `);
 const fragment=shader(gl.FRAGMENT_SHADER,`
  precision mediump float;
  uniform mediump float pixelRatio;
  uniform mediump float halo;
  varying mediump vec3 material;
  void main(){
   float distance=length(gl_PointCoord-vec2(0.5))*material.z*2.0;
   float edge=0.5/pixelRatio;
   float core=1.0-smoothstep(material.x-edge,material.x+edge,distance);
   float spread=material.x*0.6+halo;
   float bloom=0.15*exp(-0.5*distance*distance/(spread*spread));
   float alpha=material.y*core+(1.0-material.y*core)*material.y*bloom;
   gl_FragColor=vec4(vec3(0.952941,0.941176,0.909804)*alpha,alpha);
  }
 `);
 const program=gl.createProgram(),buffer=gl.createBuffer();
 if(!program||!buffer)throw new Error('Lamp surface unavailable');
 gl.attachShader(program,vertex);gl.attachShader(program,fragment);gl.linkProgram(program);
 gl.deleteShader(vertex);gl.deleteShader(fragment);
 if(!gl.getProgramParameter(program,gl.LINK_STATUS)){const reason=gl.getProgramInfoLog(program);gl.deleteProgram(program);gl.deleteBuffer(buffer);throw new Error(reason??'Lamp program unavailable')}
 gl.useProgram(program);gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
 const attribute=gl.getAttribLocation(program,'lamp');
 gl.enableVertexAttribArray(attribute);gl.vertexAttribPointer(attribute,4,gl.FLOAT,false,0,0);
 const viewport=gl.getUniformLocation(program,'viewport'),ratioLocation=gl.getUniformLocation(program,'pixelRatio'),halo=gl.getUniformLocation(program,'halo');
 gl.enable(gl.BLEND);gl.blendFunc(gl.ONE,gl.ONE_MINUS_SRC_ALPHA);
 let values=new Float32Array(0);
 return {
  draw(state){
   const {width,height,pitch}=state.layout,ratio=Math.min(2,window.devicePixelRatio||1);
   const w=Math.round(width*ratio),h=Math.round(height*ratio);
   if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}
   if(values.length!==state.points.length*4){values=new Float32Array(state.points.length*4);gl.bufferData(gl.ARRAY_BUFFER,values.byteLength,gl.DYNAMIC_DRAW)}
   for(let i=0;i<state.points.length;i++){const p=state.points[i],j=i*4;values[j]=p.x;values[j+1]=p.y;values[j+2]=p.r;values[j+3]=p.opacity}
   gl.viewport(0,0,w,h);gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
   gl.uniform2f(viewport,width,height);gl.uniform1f(ratioLocation,ratio);gl.uniform1f(halo,pitch*.2);
   gl.bufferSubData(gl.ARRAY_BUFFER,0,values);gl.drawArrays(gl.POINTS,0,state.points.length);
  },
  dispose(){gl.deleteBuffer(buffer);gl.deleteProgram(program)},
 };
}

function fallbackPainter(canvas:HTMLCanvasElement):Painter{
 const ctx=canvas.getContext('2d');
 return {draw(state){
  if(!ctx)return;
  const {width,height}=state.layout,ratio=Math.min(1.5,window.devicePixelRatio||1);
  const w=Math.round(width*ratio),h=Math.round(height*ratio);
  if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h}
  ctx.setTransform(ratio,0,0,ratio,0,0);ctx.clearRect(0,0,width,height);ctx.fillStyle='#f3f0e8';
  const buckets=Array.from({length:32},()=>[] as SignalState['points']);
  for(const p of state.points)buckets[Math.round(p.opacity*31)].push(p);
  for(let i=1;i<32;i++){
   ctx.globalAlpha=i/31;ctx.beginPath();
   for(const p of buckets[i]){ctx.moveTo(p.x+p.r,p.y);ctx.arc(p.x,p.y,p.r,0,Math.PI*2)}
   ctx.fill();
  }
 },dispose(){}};
}

export function BodySignalCanvas({state,ambient=false,active=true}:{state:SignalState;ambient?:boolean;active?:boolean}){
 const canvas=useRef<HTMLCanvasElement>(null),painter=useRef<Painter|null>(null);
 const [accelerated,setAccelerated]=useState(true),fallbackReason=useRef<string|undefined>(undefined);
 const ambientFrame=useRef(state.materialFrame);
 useLayoutEffect(()=>{
  const el=canvas.current;if(!el)return;
  const lost=(event:Event)=>{event.preventDefault();setAccelerated(false)};
  el.addEventListener('webglcontextlost',lost);
  try{painter.current=accelerated?lampPainter(el):fallbackPainter(el)}catch(error){fallbackReason.current=error instanceof Error?error.message:String(error);painter.current=null}
  if(!painter.current&&accelerated)setAccelerated(false);
  return()=>{el.removeEventListener('webglcontextlost',lost);painter.current?.dispose();painter.current=null};
 },[accelerated]);
 useLayoutEffect(()=>{
  if(ambient)return;
  ambientFrame.current=state.materialFrame;
  const start=performance.now();painter.current?.draw(state);
  if(canvas.current){canvas.current.dataset.drawMs=(performance.now()-start).toFixed(2);delete canvas.current.dataset.ambientFrame}
 },[state,accelerated,ambient]);
 useEffect(()=>{
  if(!ambient)return;
  // The last authored frame and the first ambient frame share one material clock.
  ambientFrame.current=Math.max(state.materialFrame,ambientFrame.current);
  let raf=0,clock=0,nextPaint=0;
  const interval=1000/30;
  const draw=()=>{
   const started=performance.now();
   painter.current?.draw(bodySignalState(state.frame,state.layout.width,state.layout.height,{orb:state.orb,materialFrame:ambientFrame.current}));
   if(canvas.current){canvas.current.dataset.ambientFrame=ambientFrame.current.toFixed(2);canvas.current.dataset.updateMs=(performance.now()-started).toFixed(2);}
  };
  const tick=(now:number)=>{
   raf=0;if(!active||document.hidden)return;
   ambientFrame.current=advanceBodyMaterialFrame(ambientFrame.current,now-clock);clock=now;
   if(now>=nextPaint-.1){draw();nextPaint+=Math.max(1,Math.floor((now-nextPaint)/interval)+1)*interval}
   raf=requestAnimationFrame(tick);
  };
  const sync=()=>{cancelAnimationFrame(raf);raf=0;clock=performance.now();nextPaint=clock+interval;if(active&&!document.hidden)raf=requestAnimationFrame(tick)};
  draw();sync();document.addEventListener('visibilitychange',sync);
  return()=>{cancelAnimationFrame(raf);document.removeEventListener('visibilitychange',sync)};
 },[ambient,active,state,accelerated]);
 return <canvas key={accelerated?'gpu':'fallback'} ref={canvas} data-body-field="full-bleed" data-lamp-material="continuous-halftone" data-renderer={accelerated?'gpu-points':'canvas-fallback'} data-fallback-reason={fallbackReason.current} data-lamp-count={state.points.length} aria-hidden="true" style={{position:'absolute',inset:0,width:'100%',height:'100%',zIndex:0}}/>;
}
