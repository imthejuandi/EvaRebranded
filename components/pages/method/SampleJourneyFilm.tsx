import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';

export const JOURNEY_FPS = 30;
export const JOURNEY_FRAMES = 114;
export const JOURNEY_STOPS = [0, 35, 70, 113] as const;
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const dots = Array.from({length: 60}, (_, i) => ({
  x: 72 + (i % 6) * 8,
  y: 218 + Math.floor(i / 6) * 8,
  r: 1.3 + ((i * 7) % 5) * .35,
}));

/** Pure original artwork. It does not depict device anatomy or real specimen handling. */
export function SampleJourneyArtwork({frame = JOURNEY_FRAMES - 1}: {frame?: number}) {
  const p = interpolate(frame, [0, 113], [0, 1], clamp);
  const resolved = interpolate(frame, [80, 113], [0, 1], clamp);
  const column = (index: number) => interpolate(frame, [index * 30 - 6, index * 30 + 16], [.15, 1], clamp);
  const journeyX = 100 + p * 510;
  return <svg viewBox="0 0 720 480" fill="none" role="presentation" aria-hidden="true" className="method-journey-svg">
    <defs>
      <radialGradient id="method-journey-amber"><stop stopColor="#e9a067" stopOpacity=".28"/><stop offset="1" stopColor="#e9a067" stopOpacity="0"/></radialGradient>
      <linearGradient id="method-journey-pane" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#f3f0e8" stopOpacity=".13"/><stop offset="1" stopColor="#b9bdae" stopOpacity=".02"/></linearGradient>
    </defs>
    <ellipse cx={journeyX} cy="250" rx="145" ry="180" fill="url(#method-journey-amber)"/>
    <path d="M46 38h24M46 38v24M674 38h-24M674 38v24M46 442h24M46 442v-24M674 442h-24M674 442v-24" stroke="#f3f0e8" strokeOpacity=".2"/>
    {Array.from({length: 29}, (_, i) => <path key={i} d={`M${78+i*20} 374v${i%5===0?10:4}`} stroke="#f3f0e8" strokeOpacity={i%5===0?.32:.13}/>) }
    <path d="M80 320H636" stroke="#f3f0e8" strokeOpacity=".16"/>
    <path d={`M80 320H${100+p*510}`} stroke="#e9a067" strokeOpacity=".55"/>
    {[100, 270, 440, 610].map((x, i) => <g key={x} opacity={column(i)}>
      <path d={`M${x} 306v28`} stroke="#f3f0e8" strokeOpacity=".65"/>
      <circle cx={x} cy="320" r="3" fill="#f3f0e8"/>
      <rect x={x-48} y={102+(i%2)*20} width="96" height={180-(i%2)*20} rx="2" fill="url(#method-journey-pane)" stroke="#f3f0e8" strokeOpacity=".16"/>
      <path d={`M${x-32} ${122+(i%2)*20}H${x-17}`} stroke="#f3f0e8" strokeOpacity=".65"/>
    </g>)}
    {/* A sample is represented by a bounded field of marks, not an invented product model. */}
    {dots.map((dot, i) => {
      const offset = interpolate(frame, [8+i*.11, 90+i*.15], [0, 1], clamp);
      const toX = 584+(i%5)*11;
      const toY = 169+Math.floor(i/5)*7;
      const bridge = Math.sin(offset*Math.PI) * (i%2===0 ? -20 : 20);
      return <circle key={i} cx={dot.x+(toX-dot.x)*offset} cy={dot.y+(toY-dot.y)*offset+bridge} r={dot.r-(dot.r-1.3)*resolved} fill={i%8===0?'#f3f0e8':'#e9a067'} opacity={.38+(i%4)*.15}/>;
    })}
    <g opacity={column(1)} stroke="#f3f0e8" strokeOpacity=".52">
      <path d="M236 192h68v62h-68zM236 192l34 25 34-25M248 264h44"/>
    </g>
    <g opacity={column(2)} stroke="#b9bdae" strokeOpacity=".8">
      {[0,1,2,3].map(i => <path key={i} d={`M416 ${167+i*20}h48M${424+i*8} ${158+i*20}v18`}/>)}
    </g>
    <g opacity={resolved} stroke="#f3f0e8" strokeOpacity=".55">
      <path d="M581 141h58M581 152h36M581 267h58"/>
    </g>
    <circle cx={journeyX} cy="320" r="6" fill="#0b1010" stroke="#e9a067" strokeWidth="1.5"/>
  </svg>;
}

export default function SampleJourneyFilm() {
  const frame = useCurrentFrame();
  return <AbsoluteFill style={{background: '#0b1010', justifyContent: 'center'}}><SampleJourneyArtwork frame={frame}/></AbsoluteFill>;
}
