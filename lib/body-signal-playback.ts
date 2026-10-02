import {BODY_SIGNAL_DURATION, bodySignalChapter} from './body-signal.ts';

export const BODY_PLAYBACK_FPS=30;
export const BODY_PLAYBACK_DURATION=301;
export const BODY_MATERIAL_RATE=1.15;
export const bodyPlaybackStops=[0,27,114,201];
export const BODY_ORB_START=279;
// Eight frames retain every analog morph step. Put the saved time into the
// complete readings, preserving the ten-second narrative and flowing material.
const keys=[[0,0],[27,390],[106,590],[114,700],[193,930],[201,1040],[279,1220],[300,1220]];
// The captions hand over at the middle of each numeral morph. Let the visible
// timeline follow those same moments, rather than advancing before its caption.
const chapterFrames=[0,27,110,197,BODY_PLAYBACK_DURATION-1];
export function advanceBodyMaterialFrame(frame:number,elapsedMs:number){
 return frame+Math.max(0,Math.min(elapsedMs,100))*BODY_PLAYBACK_FPS/1000*BODY_MATERIAL_RATE;
}
export function bodyPlaybackProgress(frame:number){
 return chapterFrames.slice(0,-1).map((start,index)=>Math.max(0,Math.min(1,(frame-start)/(chapterFrames[index+1]-start))));
}
export function bodyPlayback(frame:number){
 const f=Math.max(0,Math.min(BODY_PLAYBACK_DURATION-1,frame));
 const index=keys.findIndex((key,i)=>i>0&&f<=key[0]);
 const [a,b]=index<0?[keys[keys.length-2],keys[keys.length-1]]:[keys[index-1],keys[index]];
 const narrative=a[1]+(b[1]-a[1])*(f-a[0])/(b[0]-a[0]);
 const t=Math.max(0,Math.min(1,(f-BODY_ORB_START)/(BODY_PLAYBACK_DURATION-1-BODY_ORB_START)));
 return {narrative:Math.min(BODY_SIGNAL_DURATION-1,narrative),materialFrame:f*BODY_MATERIAL_RATE,orb:t*t*(3-2*t),chapter:bodySignalChapter(narrative)};
}
