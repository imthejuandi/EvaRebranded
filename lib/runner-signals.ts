import tracks from './runner-tracking.json';

export type RunnerSignal = 'head' | 'stomach' | 'knee';
export type SignalLanguage = 'es' | 'en';
export const runnerSignals: RunnerSignal[] = ['head', 'stomach', 'knee'];
export const signalStart = {head: 36, stomach: 50, knee: 64};
// The final label and leader have finished unfolding at this point.
export const signalsSettledAt = (signalStart.knee + 23) / 24;
export const runnerSignalCopy = {
 es: {head: {name:'LDL',status:'Colesterol «malo»'}, stomach:{name:'Fructosamina',status:'Glucosa'}, knee:{name:'hs-CRP',status:'Inflamación'}},
 en: {head: {name:'LDL',status:'“Bad” cholesterol'}, stomach:{name:'Fructosamine',status:'Blood sugar'}, knee:{name:'hs-CRP',status:'Inflammation'}},
} as const;

/** Reviewed source points, mapped through the video's actual object-fit: cover. */
export function runnerPoint(time:number,key:RunnerSignal,width:number,height:number){
 const frame=((time*24)%120+120)%120,lo=Math.floor(frame),hi=(lo+1)%120;
 const a=tracks[lo][key],b=tracks[hi][key],fraction=frame-lo;
 const scale=Math.max(width/432,height/540);
 return [(a[0]+(b[0]-a[0])*fraction)*scale+(width-432*scale)/2,
  (a[1]+(b[1]-a[1])*fraction)*scale+(height-540*scale)/2] as const;
}

export function signalProgress(age:number,start:number,end:number){
 const t=Math.max(0,Math.min(1,(age-start)/(end-start)));
 return 1-Math.pow(1-t,3);
}
