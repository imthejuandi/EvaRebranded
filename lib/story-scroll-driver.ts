import {storyMotion} from './story-motion.ts';
import {productHover} from './product-motion.ts';

const LAST_FRAME=980;
const bounded=(frame:number)=>Math.max(0,Math.min(LAST_FRAME,frame));
const range=(frame:number,start:number,end:number,from:number,to:number)=>from+(to-from)*Math.max(0,Math.min(1,(frame-start)/(end-start)));
export type StoryScrollDriver={
 readonly current:number;
 setFrame:(frame:number)=>void;
 subscribe:(listener:(frame:number)=>void)=>()=>void;
};

/** Native scroll owns this clock; subscriptions never create an animation loop. */
export function createStoryScrollDriver(initialFrame=0):StoryScrollDriver{
 let frame=Number.isFinite(initialFrame)?bounded(initialFrame):0;
 const listeners=new Set<(frame:number)=>void>();
 return {
  get current(){return frame},
  setFrame(next){
   if(!Number.isFinite(next))return;
   next=bounded(next);if(next===frame)return;frame=next;
   // A subscription added by a callback starts on the next update.
   const pending=Array.from(listeners);
   for(const listener of pending)if(listeners.has(listener))listener(frame);
  },
  subscribe(listener){listeners.add(listener);return()=>{listeners.delete(listener)}},
 };
}

/** Same range interpolation and scene choreography as the authored EvaFilm. */
export function storyScrollFrame(frame:number,width:number,height:number,insightOverflow:number){
 const f=bounded(frame),motion=storyMotion(f),travel=range(f,45,190,0,1);
 return {
  frame:f,scene:f<230?'Vivir':f<490?'Conocer':f<715?'Entender':'Seguir',
  humanY:motion.humanY*height,productY:motion.productY*height,
  insightY:motion.insightY*height,lifeY:motion.lifeY*height,
  humanVisible:Math.abs(motion.humanY)<1,productVisible:Math.abs(motion.productY)<1,
  insightVisible:Math.abs(motion.insightY)<1,lifeVisible:Math.abs(motion.lifeY)<1,
  runnerX:travel*width*1.05,runnerScale:1+travel*.08,runnerPromoted:f<200,
  introX:range(f,45,160,0,-width*1.05),saludX:range(f,45,160,0,width*1.05),
  supportOpacity:range(f,20,100,1,0),productHover:productHover(f),
  insightX:-range(f,590,635,0,insightOverflow),
  returnScale:range(f,710,840,1.18,1),returnTitleY:range(f,735,800,60,0),
 };
}

type Targets=Record<string,HTMLElement|undefined>;
export type StoryScrollPainter=((frame:number,width:number,height:number,insightOverflow:number)=>void)&{refresh:()=>void};
const cache=new WeakMap<HTMLElement,StoryScrollPainter>();
const bind=(root:HTMLElement)=>{
 const targets:Targets={};
 for(const element of root.querySelectorAll<HTMLElement>('[data-layer], [data-motion], [data-hero-intro], [data-analog-type="salud."], [data-hero-support]')){
  if(element.dataset.layer)targets[element.dataset.layer]=element;
  if(element.dataset.motion)targets[element.dataset.motion]=element;
  if(element.dataset.heroIntro!==undefined)targets.intro=element;
  if(element.dataset.analogType==='salud.')targets.salud=element;
  if(element.dataset.heroSupport!==undefined)targets['hero-support']=element;
 }
 return targets;
};
const style=(element:HTMLElement|undefined,property:'transform'|'translate'|'scale'|'visibility'|'willChange'|'opacity',value:string)=>{
 if(element&&element.style[property]!==value)element.style[property]=value;
};
const transform=(element:HTMLElement|undefined,value:string,resetScale=false)=>{
 style(element,'translate','none');
 if(resetScale)style(element,'scale','none');
 style(element,'transform',value);
};

/** Bind once after mounting; painting reads no geometry and performs no queries. */
export function createStoryScrollPainter(root:HTMLElement,compositorOwned:ReadonlySet<HTMLElement>=new Set()):StoryScrollPainter{
 let targets=bind(root);
 const browserOwns=(element:HTMLElement|undefined)=>!!element&&compositorOwned.has(element);
 const move=(element:HTMLElement|undefined,value:string,resetScale=false)=>{if(!browserOwns(element))transform(element,value,resetScale)};
 const paint=(frame:number,width:number,height:number,insightOverflow:number)=>{
  if(!Number.isFinite(frame)||width<=0||height<=0)return;
  const state=storyScrollFrame(frame,width,height,insightOverflow);
  const scene=(name:string,y:number,visible:boolean)=>{
   const element=targets[name];
   move(element,`translate3d(0, ${y}px, 0)`);
   // Browser-owned scenes remain clipped by the stage. JS visibility changes
   // must not blank an arriving scene while its compositor is already moving.
   style(element,'visibility',browserOwns(element)||visible?'visible':'hidden');
   style(element,'willChange',browserOwns(element)||visible?'transform':'auto');
  };
  scene('human',state.humanY,state.humanVisible);
  scene('product-scene',state.productY,state.productVisible);
  scene('insight-scene',state.insightY,state.insightVisible);
  scene('return-to-life',state.lifeY,state.lifeVisible);
  move(targets['runner-plane'],`translate3d(calc(-50% + ${state.runnerX}px), 0, 0) scale(${state.runnerScale})`,true);
  style(targets['runner-plane'],'willChange',browserOwns(targets['runner-plane'])||state.runnerPromoted?'transform':'auto');
  move(targets.intro,`translate3d(${state.introX}px, 0, 0)`);
  move(targets.salud,`translate3d(${state.saludX}px, 0, 0)`);
  if(!browserOwns(targets['hero-support']))style(targets['hero-support'],'opacity',String(state.supportOpacity));
  transform(targets.product,`translate3d(-50%, calc(-50% + ${state.productHover}px), 0)`);
  if(targets.product)targets.product.dataset.hover=state.productHover.toFixed(3);
  move(targets['insight-track'],`translate3d(${state.insightX}px, 0, 0)`);
  move(targets['return-image'],`scale(${state.returnScale})`,true);
  move(targets['return-title'],`translate3d(0, ${state.returnTitleY}px, 0)`);
  root.dataset.renderedFrame=String(state.frame);root.dataset.scene=state.scene;
 };
 return Object.assign(paint,{refresh:()=>{targets=bind(root)}});
}

/** Convenience entry point with target bindings retained for this DOM root. */
export function paintStoryScrollFrame(root:HTMLElement,frame:number,width:number,height:number,insightOverflow:number){
 let painter=cache.get(root);
 if(!painter){painter=createStoryScrollPainter(root);cache.set(root,painter)}
 painter(frame,width,height,insightOverflow);
}
export function refreshStoryScrollTargets(root:HTMLElement){cache.get(root)?.refresh()}
