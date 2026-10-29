import assert from 'node:assert/strict';
import {storyCompositorKeyframes,installStoryScrollCompositor} from '../lib/story-scroll-compositor.ts';
import {storyScrollFrame,createStoryScrollPainter} from '../lib/story-scroll-driver.ts';

const close=(a,b,label)=>assert(Math.abs(a-b)<1e-8,`${label}: ${a} versus ${b}`);
const failures=[];
const check=(name,run)=>{try{run();console.log(`PASS ${name}`)}catch(error){failures.push({name,error});console.error(`FAIL ${name}: ${error.message}`)}};
const expectedProperties=s=>({
 '[data-layer="human"]':['transform',`translate3d(0, ${s.humanY}px, 0)`],
 '[data-layer="product-scene"]':['transform',`translate3d(0, ${s.productY}px, 0)`],
 '[data-layer="insight-scene"]':['transform',`translate3d(0, ${s.insightY}px, 0)`],
 '[data-layer="return-to-life"]':['transform',`translate3d(0, ${s.lifeY}px, 0)`],
 '[data-layer="runner-plane"]':['transform',`translate3d(calc(-50% + ${s.runnerX}px), 0, 0) scale(${s.runnerScale})`],
 '[data-hero-intro]':['transform',`translate3d(${s.introX}px, 0, 0)`],
 '[data-analog-type="salud."]':['transform',`translate3d(${s.saludX}px, 0, 0)`],
 '[data-hero-support]':['opacity',String(s.supportOpacity)],
 '[data-layer="insight-track"]':['transform',`translate3d(${s.insightX}px, 0, 0)`],
 '[data-motion="return-image"]':['transform',`scale(${s.returnScale})`],
 '[data-motion="return-title"]':['transform',`translate3d(0, ${s.returnTitleY}px, 0)`],
});
const numberPattern=/-?(?:\d*\.)?\d+(?:e[+-]?\d+)?/gi;
const numbers=css=>String(css).match(numberPattern).map(Number);
const skeleton=css=>String(css).replace(numberPattern,'#');
function sampledNumbers(keyframes,property,frame){
 const progress=Math.max(0,Math.min(1,frame/980));
 let end=keyframes.findIndex(key=>key.offset>=progress);if(end<0)end=keyframes.length-1;
 const b=keyframes[end],a=keyframes[Math.max(0,end-1)];
 const fraction=a.offset===b.offset?0:(progress-a.offset)/(b.offset-a.offset);
 const low=numbers(a[property]),high=numbers(b[property]);
 assert.equal(skeleton(a[property]),skeleton(b[property]),'Transform lists keep matching functions/units for linear interpolation');
 return low.map((value,index)=>value+(high[index]-value)*fraction);
}
const frames=new Set([-10,1000,...Array.from({length:3921},(_,i)=>i/4)]);
for(const boundary of [20,45,90,100,130,160,190,200,230,280,465,490,555,590,635,710,715,735,800,840])for(const delta of [-.001,0,.001])frames.add(boundary+delta);
check('Piecewise keyframes match the existing scroll choreography across viewport geometries',()=>{
 for(const [width,height,overflow] of [[320,720,0],[390,844,420],[440,956,832],[700,900,700],[1440,900,1332]]){
  const definitions=storyCompositorKeyframes(width,height,overflow);
  assert.equal(definitions.length,11,'Every intended native scroll layer has exactly one definition');
  assert.equal(new Set(definitions.map(d=>d.selector)).size,11,'No element receives conflicting animation definitions');
  for(const definition of definitions){
   close(definition.keyframes[0].offset,0,'Timeline starts at the beginning');
   close(definition.keyframes.at(-1).offset,1,'Timeline reaches the end');
   for(let i=1;i<definition.keyframes.length;i++)assert(definition.keyframes[i].offset>definition.keyframes[i-1].offset,'Offsets increase strictly');
   for(const frame of frames){
    const [property,expected]=expectedProperties(storyScrollFrame(frame,width,height,overflow))[definition.selector];
    assert.equal(definition.property,property);
    const actual=sampledNumbers(definition.keyframes,property,frame),want=numbers(expected);
    assert.equal(actual.length,want.length);
    actual.forEach((value,index)=>close(value,want[index],`${definition.selector} component${index} at frame${frame}, viewport${width}×${height}`));
   }
  }
 }
});

const geometry={width:440,height:956,overflow:832,top:143.25,span:7900.5};
function fixture(settings={}){
 const animations=[],writes=[],targets=[],initial=new Map();let timelineCount=0,animateCount=0;
 const make=(selector,dataset)=>{
  const values={transform:'translateY(3px)',translate:'2px 4px',scale:'1.01',visibility:'hidden',willChange:'opacity',opacity:'.8'};
  const element={selector,dataset:{...dataset},style:new Proxy(values,{set(object,key,value){writes.push({element,key,value});object[key]=value;return true}}),
  animate(keyframes,options){
    animateCount++;
    if(settings.failAt===animateCount)throw new Error('animate unavailable');
    const range=value=>settings.ignoreRanges?'normal':settings.rangeForm==='unit'?{value:parseFloat(value),unit:'px'}:settings.rangeForm==='offset'?{offset:{value:parseFloat(value),unit:'px'}}:value;
    const animation={keyframes,options,timeline:settings.wrongTimelineAt===animateCount?{}:options.timeline,
     rangeStart:range(options.rangeStart),rangeEnd:range(options.rangeEnd),
     canceled:0,cancel(){this.canceled++},effect:{getTiming:()=>({duration:options.duration})}};
    animations.push(animation);return animation;
   },getBoundingClientRect(){throw new Error('Painting must not read layout')},
  };
  initial.set(element,{style:{...values},dataset:{...dataset}});targets.push(element);return element;
 };
 for(const definition of storyCompositorKeyframes(440,956,832)){
  const selector=definition.selector;let dataset={};
  const layer=selector.match(/data-layer="([^"]+)"/),motion=selector.match(/data-motion="([^"]+)"/);
  if(layer)dataset.layer=layer[1];else if(motion)dataset.motion=motion[1];
  else if(selector.includes('data-hero-intro'))dataset.heroIntro='';
  else if(selector.includes('data-analog-type'))dataset.analogType='salud.';
  else dataset.heroSupport='';
  make(selector,dataset);
 }
 const product=make('[data-layer="product"]',{layer:'product'}),cta=make('.hero-kit-slot',{});
 const root={dataset:{},querySelector:selector=>targets.find(el=>el.selector===selector)||null,querySelectorAll:()=>targets.filter(el=>el!==cta)};
 const journey={querySelector:selector=>selector==='.hero-kit-slot'?cta:null};
 class Timeline{constructor(options){timelineCount++;if(settings.throwTimeline)throw new Error('ScrollTimeline constructor rejected');this.options=options;}}
 const source={};
 const globals={window:{ScrollTimeline:settings.noTimeline?undefined:Timeline},CSS:{supports:(property)=>settings.unsupported!==property},document:{scrollingElement:settings.noSource?null:source},matchMedia:()=>({matches:!!settings.reduced})};
 const previous=new Map(Object.keys(globals).map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
 for(const [key,value] of Object.entries(globals))Object.defineProperty(globalThis,key,{value,writable:true,configurable:true});
 const restore=()=>{for(const [key,descriptor] of previous){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key]}};
 const unchanged=()=>{for(const element of targets){assert.deepEqual({...element.style},initial.get(element).style,`Style rollback for ${element.selector}`);assert.deepEqual(element.dataset,initial.get(element).dataset,`Ownership rollback for ${element.selector}`)}};
 return{root,journey,source,targets,product,cta,animations,writes,restore,unchanged,get timelineCount(){return timelineCount},get animateCount(){return animateCount}};
}
function withFixture(settings,run){const f=fixture(settings);try{run(f)}finally{f.restore()}}
check('Unsupported browsers, reduced motion and desktop remain on the untouched JS fallback',()=>{
 for(const settings of [{noTimeline:true},{unsupported:'animation-timeline'},{unsupported:'animation-range-start'},{reduced:true},{noSource:true}])withFixture(settings,f=>{
  assert.equal(installStoryScrollCompositor(f.root,f.journey,geometry),null);assert.equal(f.animateCount,0);f.unchanged();
 });
 for(const changed of [{width:701},{span:0},{span:-1}])withFixture({},f=>{
  assert.equal(installStoryScrollCompositor(f.root,f.journey,{...geometry,...changed}),null);assert.equal(f.animateCount,0);f.unchanged();
 });
});
check('Native ownership uses exact document-pixel ranges and avoids every scroll-time transform write',()=>withFixture({},f=>{
 const compositor=installStoryScrollCompositor(f.root,f.journey,geometry);assert(compositor);assert.equal(compositor.owned.size,12);
 for(const animation of f.animations){
  assert.equal(animation.options.rangeStart,'143.25px');assert.equal(animation.options.rangeEnd,'8043.75px');
  assert.equal(animation.options.fill,'both');assert.equal(animation.options.easing,'linear');assert.equal(animation.options.duration,'auto');
  assert.equal(animation.timeline.options.source,f.source);assert.equal(animation.timeline.options.axis,'y');
 }
 const cta=f.animations.at(-1);
 for(const frame of [0,20,45,90,130,980]){
  const fade=Math.max(0,Math.min(1,(frame-20)/70));
  close(sampledNumbers(cta.keyframes,'opacity',frame)[0],1-fade,'CTA fade parity');
  close(sampledNumbers(cta.keyframes,'transform',frame)[0],fade*14,'CTA movement parity');
 }
 const paint=createStoryScrollPainter(f.root,compositor.owned);f.writes.length=0;
 for(let frame=0;frame<=980;frame+=7.25)paint(frame,440,956,832);
 assert.equal(f.writes.filter(write=>compositor.owned.has(write.element)&&['transform','translate','scale','opacity'].includes(write.key)).length,0,'Compositor-owned properties are never rewritten by the per-scroll painter');
 assert(f.writes.some(write=>write.element===f.product&&write.key==='transform'),'The independent product hover still uses its JS fallback');
 compositor.dispose();assert.equal(compositor.owned.size,0);assert(f.animations.every(animation=>animation.canceled>=1),'All native animations canceled at disposal');
 f.writes.length=0;paint(400,440,956,832);
 assert(f.writes.some(write=>write.element.selector==='[data-layer="human"]'&&write.key==='transform'),'Cleared ownership lets the original painter resume');
}));
check('A throwing ScrollTimeline constructor returns a clean fallback',()=>withFixture({throwTimeline:true},f=>{
 assert.equal(installStoryScrollCompositor(f.root,f.journey,geometry),null);assert.equal(f.animateCount,0);f.unchanged();
}));
check('A mid-install animate failure cancels partial effects and restores original styles',()=>withFixture({failAt:4},f=>{
 assert.equal(installStoryScrollCompositor(f.root,f.journey,geometry),null);assert.equal(f.animations.length,3);assert(f.animations.every(a=>a.canceled>=1));f.unchanged();
}));
check('A browser ignoring the timeline cancels every started effect and restores original styles',()=>withFixture({wrongTimelineAt:3},f=>{
 assert.equal(installStoryScrollCompositor(f.root,f.journey,geometry),null);assert.equal(f.animations.length,3);assert(f.animations.every(a=>a.canceled>=1));f.unchanged();
}));
check('A partial implementation ignoring attachment ranges stays on the JS fallback',()=>withFixture({ignoreRanges:true},f=>{
 assert.equal(installStoryScrollCompositor(f.root,f.journey,geometry),null);assert(f.animations.every(a=>a.canceled>=1));f.unchanged();
}));
check('Pixel-range validation accepts string, CSS unit and nested offset representations',()=>{
 for(const rangeForm of ['string','unit','offset'])withFixture({rangeForm},f=>{
  const compositor=installStoryScrollCompositor(f.root,f.journey,geometry);assert(compositor,`${rangeForm} retains native ownership`);assert.equal(compositor.owned.size,12);compositor.dispose();f.unchanged();
 });
});
check('Successful disposal restores the inline styles present before enhancement',()=>withFixture({},f=>{
 const compositor=installStoryScrollCompositor(f.root,f.journey,geometry);assert(compositor);compositor.dispose();compositor.dispose();f.unchanged();
}));
if(failures.length){console.error(`\n${failures.length} compositor checks failed.`);process.exitCode=1}
else console.log(`Story compositor passed: ${frames.size*5*11} property/frame parity samples, pixel-range attachment, property ownership and clean fallback/disposal. Mocked API checks do not measure Safari rendering or phone FPS.`);
