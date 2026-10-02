const progress=(frame:number,start:number,end:number)=>Math.max(0,Math.min(1,(frame-start)/(end-start)));

// Adjacent full-height scenes travel together, with no masks or expanding shapes.
export function storyMotion(frame:number){
 const product=progress(frame,130,280),insight=progress(frame,465,555),life=progress(frame,715,800);
 return {
  humanY:-product,
  productY:1-product-insight,
  insightY:1-insight-life,
  lifeY:1-life,
  lightAt:(viewportY:number)=>viewportY>=1-product&&viewportY<1-life,
 };
}
