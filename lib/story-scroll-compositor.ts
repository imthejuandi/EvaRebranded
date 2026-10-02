import {storyScrollFrame} from './story-scroll-driver.ts';

const END=980;
const stops=[0,20,45,90,100,130,160,190,280,465,555,590,635,710,715,735,800,840,END];
type Geometry={width:number;height:number;overflow:number;top:number;span:number};
type Definition={selector:string;property:'transform'|'opacity';value:(state:ReturnType<typeof storyScrollFrame>)=>string};
const definitions:Definition[]=[
 {selector:'[data-layer="human"]',property:'transform',value:s=>`translate3d(0, ${s.humanY}px, 0)`},
 {selector:'[data-layer="product-scene"]',property:'transform',value:s=>`translate3d(0, ${s.productY}px, 0)`},
 {selector:'[data-layer="insight-scene"]',property:'transform',value:s=>`translate3d(0, ${s.insightY}px, 0)`},
 {selector:'[data-layer="return-to-life"]',property:'transform',value:s=>`translate3d(0, ${s.lifeY}px, 0)`},
 {selector:'[data-layer="runner-plane"]',property:'transform',value:s=>`translate3d(calc(-50% + ${s.runnerX}px), 0, 0) scale(${s.runnerScale})`},
 {selector:'[data-hero-intro]',property:'transform',value:s=>`translate3d(${s.introX}px, 0, 0)`},
 {selector:'[data-analog-type="salud."]',property:'transform',value:s=>`translate3d(${s.saludX}px, 0, 0)`},
 {selector:'[data-hero-support]',property:'opacity',value:s=>String(s.supportOpacity)},
 {selector:'[data-layer="insight-track"]',property:'transform',value:s=>`translate3d(${s.insightX}px, 0, 0)`},
 {selector:'[data-motion="return-image"]',property:'transform',value:s=>`scale(${s.returnScale})`},
 {selector:'[data-motion="return-title"]',property:'transform',value:s=>`translate3d(0, ${s.returnTitleY}px, 0)`},
];

/** All interpolation breakpoints are explicit: no scroll-event sampling or easing lag. */
export function storyCompositorKeyframes(width:number,height:number,overflow:number){
 return definitions.map(definition=>({...definition,keyframes:stops.map(frame=>({
  offset:frame/END,[definition.property]:definition.value(storyScrollFrame(frame,width,height,overflow)),
 }))}));
}

type ScrollConstructor=new(options:{source:Element;axis:'y'})=>AnimationTimeline;
type ScrollAnimationOptions=KeyframeAnimationOptions&{rangeStart:string;rangeEnd:string};
type ScrollAnimation=Animation&{rangeStart:unknown;rangeEnd:unknown};
export type StoryCompositor={owned:ReadonlySet<HTMLElement>;dispose:()=>void};
const pixels=(value:unknown):number|null=>{
 if(typeof value==='string'&&/^-?[\d.]+px$/.test(value))return parseFloat(value);
 if(value&&typeof value==='object'){
  const item=value as {unit?:string;value?:number;offset?:unknown};
  if(item.unit==='px'&&typeof item.value==='number')return item.value;
  if(item.offset!==undefined)return pixels(item.offset);
 }
 return null;
};

/** Progressive enhancement for mobile browsers with native scroll timelines.
 * Length-based attachment ranges match the existing sticky stage, including svh
 * on phones whose browser controls resize the visual viewport during a swipe.
 */
export function installStoryScrollCompositor(root:HTMLElement,journey:HTMLElement,geometry:Geometry):StoryCompositor|null{
 const Timeline=(window as unknown as {ScrollTimeline?:ScrollConstructor}).ScrollTimeline;
 if(geometry.width>700||!Timeline||!CSS.supports('animation-timeline','scroll()')||!CSS.supports('animation-range-start','1px')||matchMedia('(prefers-reduced-motion: reduce)').matches)return null;
 const source=document.scrollingElement;
 if(!source||geometry.span<=0)return null;
 const owned=new Set<HTMLElement>(),animations:Animation[]=[];
 const snapshots=new Map<HTMLElement,{translate:string;scale:string;visibility:string;willChange:string}>();
 const dispose=()=>{for(const animation of animations)animation.cancel();for(const element of owned){delete element.dataset.scrollCompositor;Object.assign(element.style,snapshots.get(element))}owned.clear()};
 try{
 const timeline=new Timeline({source,axis:'y'});
 const options:ScrollAnimationOptions={duration:'auto',fill:'both',easing:'linear',timeline,rangeStart:`${geometry.top}px`,rangeEnd:`${geometry.top+geometry.span}px`};
 const claim=(element:HTMLElement,keyframes:Keyframe[],property:'transform'|'opacity')=>{
  const animation=element.animate(keyframes,options) as ScrollAnimation;animations.push(animation);
  // Older partial implementations must use the complete JS fallback, not play
  // this as an ordinary time-based animation after ignoring the timeline.
  if(animation.timeline!==timeline||pixels(animation.rangeStart)!==geometry.top||pixels(animation.rangeEnd)!==geometry.top+geometry.span)throw new Error('Scroll timeline unavailable');
  snapshots.set(element,{translate:element.style.translate,scale:element.style.scale,visibility:element.style.visibility,willChange:element.style.willChange});
  owned.add(element);element.dataset.scrollCompositor='true';
  if(property==='transform'){element.style.translate='none';element.style.scale='none'}
  element.style.visibility='visible';element.style.willChange=property;
 };
  for(const definition of storyCompositorKeyframes(geometry.width,geometry.height,geometry.overflow)){
   const element=root.querySelector<HTMLElement>(definition.selector);
   if(element)claim(element,definition.keyframes,definition.property);
  }
  const cta=journey.querySelector<HTMLElement>('.hero-kit-slot');
  if(cta)claim(cta,[0,20,90,END].map(frame=>{const fade=Math.max(0,Math.min(1,(frame-20)/70));return{offset:frame/END,opacity:1-fade,transform:`translateY(${fade*14}px)`}}),'transform');
  return{owned,dispose};
 }catch{dispose();return null}
}
