/** The hero is always backed by this opaque ink while the runner exits. */
export const RUNNER_INK='#0b1010';
export const RUNNER_EDGE={opaque:.36,transparent:.73} as const;
export const RUNNER_MASK=`radial-gradient(ellipse,black ${RUNNER_EDGE.opaque*100}%,transparent ${RUNNER_EDGE.transparent*100}%)`;
export const RUNNER_INK_OVERLAY=`radial-gradient(ellipse,transparent ${RUNNER_EDGE.opaque*100}%,${RUNNER_INK} ${RUNNER_EDGE.transparent*100}%)`;

/** Settled text is painted once; tracking geometry continues with decoded video. */
export function setRunnerStyle(element:HTMLElement|SVGElement,property:'opacity'|'strokeDashoffset',value:string){
 if(element.style[property]!==value)element.style[property]=value;
}
