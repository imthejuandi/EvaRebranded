import {livingLamp} from './living-lamp.ts';
import {analogGlyphs} from './analog-motion.ts';
export const HALFTONE_COLS=55,HALFTONE_ROWS=41,HALFTONE_PITCH=.2;
export const HALFTONE_VIEWBOX='-.22 -.22 11.24 8.44';
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const sites=Array.from({length:HALFTONE_COLS*HALFTONE_ROWS},(_,i)=>({x:(i%HALFTONE_COLS)*HALFTONE_PITCH,y:Math.floor(i/HALFTONE_COLS)*HALFTONE_PITCH}));
export const halftoneMasks=['15','90','TÚ'].map(word=>sites.map((_,i)=>{
 const col=i%HALFTONE_COLS,row=Math.floor(i/HALFTONE_COLS),letterIndex=Math.floor(col/30),local=col-letterIndex*30;
 if(letterIndex>1||local>=25)return false;
 if(row<6)return word[letterIndex]==='Ú'&&row>=1&&row<=4&&local>=15&&local<20;
 return analogGlyphs[word[letterIndex]][Math.floor((row-6)/5)]?.[Math.floor(local/5)]==='1';
}));
/** Glyph membership is independent of the living lamp material. */
export function halftonePhase(frame:number){
 const f=Math.max(0,Math.min(360,frame));
 return f<160?clamp((f-55)/80):1+clamp((f-215)/80);
}
export function halftoneMaskAt(phase:number,index:number){
 const from=Math.min(1,Math.floor(phase)),to=Math.min(2,from+1),step=Math.floor((phase-from)*8)/8;
 const switched=step>=1||step>((index*7)%17)/16;
 return halftoneMasks[switched?to:from][index];
}
export function halftoneState(frame:number){
 const f=Math.max(0,Math.min(360,frame)),phase=halftonePhase(f);
 const points=sites.map((p,i)=>{
  const lamp=livingLamp(i%HALFTONE_COLS,Math.floor(i/HALFTONE_COLS),f);
  return {...p,r:halftoneMaskAt(phase,i)?HALFTONE_PITCH*lamp.radius:0};
 });
 return {chapter:phase<.5?0:phase<1.5?1:2,points};
}
