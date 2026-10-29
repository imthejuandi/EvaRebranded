/** An illustrative direction display, never a physiological model or clinical severity scale. */
export interface FieldProfile {phase:number;spread:number;twist:number;roundness:number}
export interface FieldState {profile:FieldProfile;signals:readonly number[]}
export interface FieldPoint {x:number;y:number;radius:number;alpha:number}
const profiles:Record<string,FieldProfile>={
 nutrition:{phase:0,spread:.31,twist:1.8,roundness:1},
 exercise:{phase:.8,spread:.34,twist:2.65,roundness:.84},
 lifestyle:{phase:1.6,spread:.35,twist:1.1,roundness:1.25},
 medical:{phase:2.4,spread:.29,twist:3.0,roundness:.94},
 supplement:{phase:.6,spread:.29,twist:1.5,roundness:1.1},
 monitoring:{phase:2,spread:.32,twist:2.2,roundness:1},
};
export function profileForCategory(category:string):FieldProfile{return {...(profiles[category]??profiles.lifestyle)}}
export function signalBand(index:number,total:number):number{return (index+1)/(total+1)}
export function fieldPoint(u:number,v:number,state:FieldState):FieldPoint{
 const {phase,spread,twist,roundness}=state.profile;
 const edge=Math.pow(Math.max(0,Math.sin(v*Math.PI)),roundness),a=u*Math.PI*2,rotation=phase*.7+v*twist;
 const face=.5+.5*Math.cos(a+rotation);
 let deformation=0;
 const length=state.signals.length;
 for(let i=0;i<length;i++){
  const difference=v-signalBand(i,length);
  // Fixed lift/dip per result; values in incomparable units are never averaged.
  const width=Math.min(.16,.65/(length+1));
  deformation+=(state.signals[i]||0)*Math.exp(-(difference*difference)/(2*width*width));
 }
 const displacement=Math.max(-1,Math.min(1,deformation));
 return {x:.49+(spread+.075*Math.sin(v*5+phase))*Math.cos(a+rotation)*edge+.06*Math.sin(v*6+phase),
  y:.16+.68*v+.035*Math.sin(a*2+phase)*edge-.10*displacement*(.38+.62*face)*edge,
  radius:(.45+1.25*face)*edge+.22,alpha:.12+.70*face};
}
export function morphPoint(a:FieldPoint,b:FieldPoint,t:number):FieldPoint{return{x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t,radius:a.radius+(b.radius-a.radius)*t,alpha:a.alpha+(b.alpha-a.alpha)*t}}
export function fieldPoints(state:FieldState,mobile:boolean):FieldPoint[]{
 const rows=35,columns=mobile?36:56,points:FieldPoint[]=[];
 for(let y=0;y<rows;y++)for(let x=0;x<columns;x++)points.push(fieldPoint(x/(columns-1),y/(rows-1),state));
 return points;
}
