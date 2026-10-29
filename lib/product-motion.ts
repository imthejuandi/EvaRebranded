/** Five-second breath: a fixed upright product moves only eight pixels vertically. */
export const productHover=(frame:number)=>8*Math.sin((frame-285)*Math.PI*2/150);
