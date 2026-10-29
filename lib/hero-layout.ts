/** A composed headline and protected image area, shared by the film's first frame. */
export function heroLayout(width:number,height:number){
 const mobile=width<=700;
 const introSize=mobile?Math.max(44,Math.min(width*.16,84)):Math.max(56,Math.min(width*.083,144));
 const introTop=mobile?Math.max(96,height*.135):Math.max(108,Math.min(height*.19,204));
 const introHeight=introSize*1.08;
 const saludWidth=mobile?width*.6:Math.max(220,Math.min(width*.29,520));
 const saludHeight=saludWidth*.4;
 const saludTop=height-(mobile?191:109)-saludHeight;
 // Keep the media centered in both axes. Compact phones need a smaller frame
 // so the source image's head (about 12% from its top) stays below the title.
 const runnerHeight=mobile?Math.max(height*.48,Math.min(height*.72,(height*.5-introTop-introHeight-16)/.38)):height*.82;
 return {
  // Preserve the runner's existing composition; only the natural headline shrinks.
  introSize:introSize*.9,introTop:introTop-(mobile?12:24),introHeight:introHeight*.9,introWidth:introSize*4.6*.9,
  saludWidth,saludHeight,saludTop,
  supportTop:height-216,
  runnerHeight,runnerWidth:mobile?Math.min(width*.9,runnerHeight*1450/1800):width*.31,
  runnerTop:(height-runnerHeight)/2,
 };
}
