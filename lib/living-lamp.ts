const clamp=(n:number)=>Math.max(0,Math.min(1,n));
const smooth=(n:number)=>{const t=clamp(n);return t*t*(3-2*t)};
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
export const lampSeed=(x:number,y:number)=>{const v=Math.sin(x*127.1+y*311.7+47.23)*43758.5453;return v-Math.floor(v)};
// Integer noise lattice: 144 KiB, lazily filled; out-of-window coordinates use the original hash.
const latticeSeeds=new Float64Array(128*128),latticeFilled=new Uint8Array(128*128);
const latticeSeed=(x:number,y:number)=>{const col=x+64,row=y+64;if(col<0||col>=128||row<0||row>=128)return lampSeed(x,y);const i=row*128+col;if(!latticeFilled[i]){latticeSeeds[i]=lampSeed(x,y);latticeFilled[i]=1}return latticeSeeds[i]};
function noise(x:number,y:number){const ix=Math.floor(x),iy=Math.floor(y),u=smooth(x-ix),v=smooth(y-iy);return mix(mix(latticeSeed(ix,iy),latticeSeed(ix+1,iy),u),mix(latticeSeed(ix,iy+1),latticeSeed(ix+1,iy+1),u),v)}
/** One lamp material and one uninterrupted clock, irrespective of glyph membership. */
export function livingLamp(col:number,row:number,frame:number,seed=lampSeed(col,row)){
 const time=frame/36;
 const x=col*.15+Math.sin(row*.08+time*.33)*.38,y=row*.15+Math.cos(col*.08-time*.26)*.34;
 const field=noise(x+time*.32,y-time*.27)*.7+noise(x*2.1-time*.18,y*2.1+time*.14)*.3;
 const wave=smooth((field-.28)/.48);
 return {radius:(.22+.2*wave)*(.9+.1*seed),light:smooth((field-.35)/.32)};
}
