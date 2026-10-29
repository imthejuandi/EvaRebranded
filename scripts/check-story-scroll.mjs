import assert from 'node:assert/strict';
import {interpolate} from 'remotion';
import {storyMotion} from '../lib/story-motion.ts';
import {productHover} from '../lib/product-motion.ts';
import {createStoryScrollDriver,storyScrollFrame,createStoryScrollPainter,paintStoryScrollFrame,refreshStoryScrollTargets} from '../lib/story-scroll-driver.ts';

const close=(actual,expected,label)=>assert(Math.abs(actual-expected)<1e-8,`${label}: ${actual} !== ${expected}`);
const extrapolate={extrapolateLeft:'clamp',extrapolateRight:'clamp'};
const originalRange=(f,a,b,x,y)=>interpolate(f,[a,b],[x,y],extrapolate);
// This reference retains EvaFilm's original Remotion interpolation, independent
// of the driver's arithmetic and its DOM serialization.
function original(f,w,h,overflow){
 const m=storyMotion(f),travel=originalRange(f,45,190,0,1);
 return {
  frame:f,scene:f<230?'Vivir':f<490?'Conocer':f<715?'Entender':'Seguir',
  humanY:m.humanY*h,productY:m.productY*h,insightY:m.insightY*h,lifeY:m.lifeY*h,
  humanVisible:Math.abs(m.humanY)<1,productVisible:Math.abs(m.productY)<1,
  insightVisible:Math.abs(m.insightY)<1,lifeVisible:Math.abs(m.lifeY)<1,
  runnerX:travel*w*1.05,runnerScale:1+travel*.08,runnerPromoted:f<200,
  introX:originalRange(f,45,160,0,-w*1.05),saludX:originalRange(f,45,160,0,w*1.05),
  supportOpacity:originalRange(f,20,100,1,0),productHover:productHover(f),
  insightX:-originalRange(f,590,635,0,overflow),
  returnScale:originalRange(f,710,840,1.18,1),returnTitleY:originalRange(f,735,800,60,0),
 };
}
const frames=new Set(Array.from({length:3921},(_,index)=>index/4));
for(const boundary of [20,45,80,100,130,160,190,200,230,280,465,490,555,590,600,635,710,715,735,800,840]){
 for(const offset of [-.001,0,.001])frames.add(boundary+offset);
}
const sizes=[[320,720,340],[390,844,420],[1440,900,1332],[1920,1080,1780]];
for(const [width,height,overflow] of sizes)for(const frame of frames){
 const expected=original(frame,width,height,overflow),actual=storyScrollFrame(frame,width,height,overflow);
 for(const [key,value] of Object.entries(expected)){
  if(typeof value==='number')close(actual[key],value,`${key} at ${frame}, ${width}×${height}`);
  else assert.equal(actual[key],value,`${key} at ${frame}`);
 }
}

const driver=createStoryScrollDriver(),events=[];
const unsubscribe=driver.subscribe(frame=>events.push(frame));
assert.equal(driver.current,0);driver.setFrame(12.375);driver.setFrame(12.375);
assert.equal(driver.current,12.375,'Fractional scroll frames are not quantized');
assert.deepEqual(events,[12.375],'Duplicate frame writes do not notify subscribers');
driver.setFrame(Number.NaN);driver.setFrame(Number.POSITIVE_INFINITY);
assert.equal(driver.current,12.375,'Invalid positions cannot poison the clock');
unsubscribe();unsubscribe();driver.setFrame(490);
assert.deepEqual(events,[12.375],'Unsubscribe removes the callback and is idempotent');
driver.setFrame(-10);assert.equal(driver.current,0);
driver.setFrame(1200);assert.equal(driver.current,980);
assert.equal(createStoryScrollDriver(40.5).current,40.5);
const changing=createStoryScrollDriver(),lateFrames=[];let removeLate;
changing.subscribe(()=>{removeLate??=changing.subscribe(frame=>lateFrames.push(frame))});
changing.setFrame(1);assert.deepEqual(lateFrames,[],'New subscribers wait for the next update instead of extending the current dispatch');
changing.setFrame(2);assert.deepEqual(lateFrames,[2]);removeLate();

function element(dataset){
 return {dataset,style:{translate:'legacy',scale:'legacy'},
  getBoundingClientRect(){throw new Error('Scroll paint must not read layout')},
  get clientWidth(){throw new Error('Scroll paint must not read width')},
  get clientHeight(){throw new Error('Scroll paint must not read height')},
 };
}
const targets={};
for(const name of ['human','product-scene','insight-scene','return-to-life','runner-plane','product','insight-track'])targets[name]=element({layer:name});
targets.intro=element({heroIntro:''});targets.salud=element({analogType:'salud.'});targets['hero-support']=element({heroSupport:''});
targets['return-image']=element({motion:'return-image'});targets['return-title']=element({motion:'return-title'});
let queryCount=0;
const root={dataset:{},querySelectorAll(selector){
 queryCount++;
 assert(selector.includes('[data-hero-intro]')&&selector.includes('[data-analog-type="salud."]')&&selector.includes('[data-hero-support]'),'Cache binds the actual existing hero nodes');
 return Object.values(targets);
}};
const paint=createStoryScrollPainter(root);
assert.equal(queryCount,1);
for(const f of [0,45,130,190,200,230,280,325,465,490,555,590,610,635,715,750,800,840,980]){
 const [w,h,overflow]=sizes[1],expected=original(f,w,h,overflow);paint(f,w,h,overflow);
 for(const [name,position,visible] of [['human','humanY','humanVisible'],['product-scene','productY','productVisible'],['insight-scene','insightY','insightVisible'],['return-to-life','lifeY','lifeVisible']]){
  assert.equal(targets[name].style.transform,`translate3d(0, ${expected[position]}px, 0)`);
  assert.equal(targets[name].style.translate,'none','Legacy individual transforms cannot double the movement');
  assert.equal(targets[name].style.visibility,expected[visible]?'visible':'hidden');
  assert.equal(targets[name].style.willChange,expected[visible]?'transform':'auto','Offscreen scenes release promotion');
 }
 assert.equal(targets['runner-plane'].style.transform,`translate3d(calc(-50% + ${expected.runnerX}px), 0, 0) scale(${expected.runnerScale})`);
 assert.equal(targets['runner-plane'].style.scale,'none','Runner scale is applied exactly once');
 assert.equal(targets['runner-plane'].style.willChange,expected.runnerPromoted?'transform':'auto');
 assert.equal(targets.intro.style.transform,`translate3d(${expected.introX}px, 0, 0)`);
 assert.equal(targets.salud.style.transform,`translate3d(${expected.saludX}px, 0, 0)`);
 assert.equal(targets['hero-support'].style.opacity,String(expected.supportOpacity));
 assert.equal(targets.product.style.transform,`translate3d(-50%, calc(-50% + ${expected.productHover}px), 0)`);
 assert.equal(targets['insight-track'].style.transform,`translate3d(${expected.insightX}px, 0, 0)`);
 assert.equal(targets['return-image'].style.transform,`scale(${expected.returnScale})`);
 assert.equal(targets['return-image'].style.scale,'none','Return image scale is applied exactly once');
 assert.equal(targets['return-title'].style.transform,`translate3d(0, ${expected.returnTitleY}px, 0)`);
 assert.equal(root.dataset.renderedFrame,String(f));assert.equal(root.dataset.scene,expected.scene);
}
assert.equal(queryCount,1,'Every scroll paint reuses cached targets without selector queries');
targets['return-image']=element({motion:'return-image'});paint.refresh();paint(840,390,844,420);
assert.equal(queryCount,2);assert.equal(targets['return-image'].style.transform,'scale(1)','Explicit refresh binds newly inserted image nodes');
paintStoryScrollFrame(root,325,390,844,420);const bound=queryCount;
paintStoryScrollFrame(root,610,390,844,420);assert.equal(queryCount,bound,'Convenience painter is cached per root');
refreshStoryScrollTargets(root);assert.equal(queryCount,bound+1);

console.log(`Story scroll passed: ${frames.size*sizes.length} sampled parity cases against Remotion, exact transform/visibility handoff, fractional driver notifications and cleanup, cached DOM targets, no paint-time geometry reads. Browser compositing still requires visual verification.`);
