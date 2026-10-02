export const SIGNAL_DURATION=361;
export const signalStops=[0,160,340];
export const signalLabels=['15 biomarcadores','Cada 90 días','Tu vida, con contexto'];
export const analogGlyphs:Record<string,string[]>={
 '1':['00100','01100','00100','00100','00100','00100','01110'],
 '5':['11111','10000','10000','11110','00001','00001','11110'],
 '9':['01110','10001','10001','01111','00001','00001','01110'],
 '0':['01110','10001','10011','10101','11001','10001','01110'],
 'T':['11111','00100','00100','00100','00100','00100','00100'],
 'Ú':['10001','10001','10001','10001','10001','10001','01110'],
};
export const signalWords=['15','90','TÚ'];
type DotPosition={x:number;y:number};
// Subdivide the original cells while preserving their readable glyph footprint.
const pair=({x,y}:DotPosition):DotPosition[]=>[{x:x-.25,y},{x:x+.25,y}];
// The previous calculator board uses four lamps per original cell.
const verticalPair=({x,y}:DotPosition):DotPosition[]=>[{x,y:y-.25},{x,y:y+.25}];
// Double density in both directions without doubling again in either axis.
// The staggered lattice preserves the previous stroke weight and visible circular gaps.
const densePair=({x,y}:DotPosition):DotPosition[]=>[{x:x-.125,y:y-.125},{x:x+.125,y:y+.125}];
export function pointsForWord(word:string){const points:DotPosition[]=[];[...word].forEach((letter,l)=>{analogGlyphs[letter].forEach((row,y)=>[...row].forEach((value,x)=>{if(value==='1')points.push({x:x+l*6,y:y+1})}));if(letter==='Ú')points.push({x:l*6+3,y:-.4})});return points.flatMap(pair).flatMap(verticalPair).flatMap(densePair)}
const forms=signalWords.map(pointsForWord);
const masks=forms.map(points=>new Set(points.map(p=>`${p.x},${p.y}`)));
const grid=[...Array.from({length:77},(_,i)=>({x:i%11,y:Math.floor(i/11)+1})),{x:9,y:-.4}].flatMap(pair).flatMap(verticalPair).flatMap(densePair);
const clamp=(n:number)=>Math.max(0,Math.min(1,n));
export function signalState(frame:number){
 const f=Math.max(0,Math.min(SIGNAL_DURATION-1,frame));
 const phase=f<160?clamp((f-55)/80):1+clamp((f-215)/80);
 const from=Math.min(1,Math.floor(phase)),to=Math.min(2,from+1),raw=phase-from;
 const step=Math.floor(raw*8)/8;
 // The original eight-step, scattered on/off transition; every lamp stays registered.
 const points=grid.map((p,i)=>{
  const useNext=step>=1||step>((i*7)%17)/16;
  const on=masks[useNext?to:from].has(`${p.x},${p.y}`);
  return {...p,r:on?.13:0};
 });
 return {phase,chapter:phase<.5?0:phase<1.5?1:2,points};
}
