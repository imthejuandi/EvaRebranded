import {livingLamp,lampSeed} from './living-lamp.ts';
import {halftoneMaskAt,HALFTONE_COLS,HALFTONE_ROWS} from './halftone-motion.ts';
import {signalLabels} from './analog-motion.ts';
export const BODY_RESOLVE_START=165,BODY_RESOLVE_END=390;
// Hold each complete reading longer while the same field clock keeps moving.
export const BODY_NUMBER_DURATION=831;
export const BODY_SIGNAL_DURATION=BODY_RESOLVE_END+BODY_NUMBER_DURATION;
export const bodySignalStops=[0,BODY_RESOLVE_END,BODY_RESOLVE_END+420,BODY_RESOLVE_END+750];
export function bodyNumberPhase(frame:number){
 const f=Math.max(0,frame-BODY_RESOLVE_END);
 return f<540?Math.max(0,Math.min(1,(f-200)/110)):1+Math.max(0,Math.min(1,(f-540)/110));
}
export const bodySignalLabels=['Tu cuerpo',...signalLabels];
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const smooth=(n:number)=>{const t=clamp(n);return t*t*(3-2*t)};
const quietSpot=(x:number,y:number,cx:number,cy:number,sx:number,sy:number)=>smooth((Math.hypot((x-cx)/sx,(y-cy)/sy)-.9)/.65);
export const bodyTitleTravel=(frame:number)=>smooth((frame-(BODY_RESOLVE_END-100))/100);
export function bodySignalChapter(frame:number){const phase=bodyNumberPhase(frame);return frame<BODY_RESOLVE_END?0:phase<.5?1:phase<1.5?2:3}
export function bodySignalLayout(width:number,height:number){
 const mobile=width<700,availableWidth=width*(mobile?.91:.54);
 const fieldHeight=mobile?Math.min(height*.33,height-216-height*.34):height*.73;
 const pitch=Math.min(availableWidth/(HALFTONE_COLS+2),fieldHeight/(HALFTONE_ROWS+2));
 const left=(mobile?width*.045:width*.45)+(availableWidth-HALFTONE_COLS*pitch)/2;
 const top=height*(mobile?.34:.15)+(fieldHeight-HALFTONE_ROWS*pitch)/2;
 return {width,height,mobile,pitch,left,top};
}
export function bodyLampGuidance(progress:number,col:number,row:number){
 const delay=.12*clamp(row/(HALFTONE_ROWS-1))+.06*lampSeed(col,row);
 return smooth((progress-delay)/(1-delay));
}
type Site={x:number;y:number;col:number;row:number;maskIndex:number;quiet:number;seed:number;delay:number;orbLight:number};
const cache=new Map<string,{layout:ReturnType<typeof bodySignalLayout>;sites:Site[]}>();
function screen(width:number,height:number){
 const key=`${width}/${height}`,cached=cache.get(key);if(cached)return cached;
 const layout=bodySignalLayout(width,height),{mobile,pitch,left,top}=layout,sites:Site[]=[];
 for(let row=Math.floor(-top/pitch)-1;row<=Math.ceil((height-top)/pitch)+1;row++)for(let col=Math.floor(-left/pitch)-1;col<=Math.ceil((width-left)/pitch)+1;col++){
  const x=left+col*pitch,y=top+row*pitch;
  const introFont=mobile?Math.min(width*.109,height*.059):width*.047;
  const titleHeight=introFont*3.18;
  const title=quietSpot(x,y,mobile?width*.5:48+width*.215,height*(mobile?.15:.26)+titleHeight/2,width*(mobile?.75:.36),titleHeight*.9);
  const caption=quietSpot(x,y,mobile?width*.5:210,mobile?height-155:height*.7,width*(mobile?.8:.3),mobile?95:120);
  const kicker=quietSpot(x,y,width*.5,mobile?55:70,width*.85,26);
  const controls=quietSpot(x,y,width*.5,height-38,width*.9,35);
  const quiet=title*caption*kicker*controls;
  const seed=lampSeed(col,row),delay=.12*clamp(row/(HALFTONE_ROWS-1))+.06*seed;
  const orbRadius=Math.min(width*(mobile?.49:.27),height*.3);
  const distance=Math.hypot((x-width*(mobile?.5:.73))/orbRadius,(y-height*.48)/orbRadius);
  const orbLight=smooth((1.12-distance)/.4)*Math.sqrt(Math.max(0,1-Math.min(1,distance*.82)**2));
  sites.push({x,y,col,row,seed,delay,maskIndex:col>=0&&col<HALFTONE_COLS&&row>=0&&row<HALFTONE_ROWS?row*HALFTONE_COLS+col:-1,quiet,orbLight});
 }
 if(cache.size>5)cache.clear();const result={layout,sites};cache.set(key,result);return result;
}
/** Gradual light guidance reveals numerals inside the continuous living field. */
export function bodySignalState(frame:number,width=1440,height=900,options:{materialFrame?:number;orb?:number}={}){
 const f=Math.max(0,Math.min(BODY_SIGNAL_DURATION-1,frame));
 const materialFrame=options.materialFrame??f,orb=clamp(options.orb??0);
 const progress=clamp((f-BODY_RESOLVE_START)/(BODY_RESOLVE_END-BODY_RESOLVE_START)),resolve=smooth(progress);
 const {sites,layout}=screen(width,height),{pitch}=layout;
 const phase=bodyNumberPhase(f);
 const points=sites.map(p=>{
  const lamp=livingLamp(p.col,p.row,materialFrame,p.seed);
  const on=p.maskIndex>=0&&halftoneMaskAt(phase,p.maskIndex);
  // A soft downward drift with fine lamp variation; one easing curve per lamp.
  const local=smooth((progress-p.delay)/(1-p.delay));
  // Glyphs are an energy bias inside this field, not a second image or radius target.
  const bias=on?.84:(.035-.77*lamp.light);
  // The text veil dims light instead of removing lamps, including behind mobile letters.
  const veil=.2+.8*p.quiet;
  const glyphEnergy=clamp(lamp.light*veil+local*bias*(on?1:veil));
  const orbEnergy=clamp((lamp.light*(.08+.92*p.orbLight)+.16*p.orbLight)*veil);
  const energy=glyphEnergy*(1-orb)+orbEnergy*orb;
  const floor=layout.mobile?.14:.10;
  const opacity=floor+(1-floor)*energy;
  return {x:p.x,y:p.y,r:pitch*lamp.radius,opacity,on};
 });
 return {frame:f,materialFrame,orb,resolve,chapter:bodySignalChapter(f),phase:f<BODY_RESOLVE_START?'body' as const:f<BODY_RESOLVE_END?'interpret' as const:'data' as const,points,layout};
}
