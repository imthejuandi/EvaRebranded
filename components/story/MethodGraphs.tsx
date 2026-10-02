'use client';

import {useId, type CSSProperties} from 'react';

export type MethodGraphKind = 'results' | 'context' | 'evolution';
export const METHOD_GRAPH_DURATION_MS = 4200;

type MethodGraphsProps = {
  kind: MethodGraphKind;
  active: boolean;
  visible: boolean;
  playing?: boolean;
  calm?: boolean;
  cycle?: number;
  className?: string;
};

const descriptions = {
  results: ['Quince biomarcadores, una lectura', 'Quince filamentos luminosos se ordenan en señales individuales. Una representación artística de la lectura de biomarcadores, sin valores clínicos.'],
  context: ['El mismo resultado, dos marcos de referencia', 'El mismo punto se alinea con dos franjas: intervalo de referencia y rangos de EVA. Las franjas muestran cómo se añade contexto a un valor; no representan umbrales clínicos ni evalúan el resultado de una persona.'],
  evolution: ['Un historial que se construye', 'Cuatro lecturas trimestrales forman un recorrido que sube y baja. Representación ilustrativa del seguimiento, sin datos de una persona ni una predicción de mejora.'],
};
const delay = (milliseconds: number): CSSProperties => ({'--mg-delay': `${milliseconds}ms`} as CSSProperties);
const circlePath = (x: number, y: number, r: number) => {
  const n = (value: number) => Number(value.toFixed(2));
  return `M${n(x - r)} ${n(y)}a${n(r)} ${n(r)} 0 1 0 ${n(r * 2)} 0a${n(r)} ${n(r)} 0 1 0 ${n(-r * 2)} 0`;
};

// Original forms: no imported chart, numeral mask, photograph, or previous artwork.
const filaments = Array.from({length: 15}, (_, i) => {
  const start = 164 + i * 20 + Math.sin(i * 2.1) * 24;
  const end = 155 + i * 21;
  const middle = 299 + (i - 7) * 7.5;
  const d = `M72 ${start.toFixed(2)} C166 ${(start - 31).toFixed(2)} 204 ${middle.toFixed(2)} 300 ${middle.toFixed(2)} S430 ${(end + 25).toFixed(2)} 494 ${end}`;
  return {d, start, end, weight: .64 + (Math.sin(i * 1.83) + 1) * .23};
});
const filamentDust = filaments.map(({start}, i) => Array.from({length: 9}, (_, j) => {
  const x = 63 + j * 18.7;
  const y = start + Math.sin(j * .52 + i * .3) * (21 - j * 1.6);
  return circlePath(x, y, .45 + ((i * 5 + j * 7) % 9) / 13);
}).join('')).join('');
const contextRanges = [
  {label: 'Intervalo de referencia', x: 106, width: 364, y: 267, tone: 'reference'},
  {label: 'Rangos de EVA', x: 171, width: 299, y: 405, tone: 'eva'},
].map(range => ({...range, dots: Array.from({length: Math.floor(range.width / 8) * 5}, (_, i) => {
  const columns = Math.floor(range.width / 8), column = i % columns, row = Math.floor(i / columns);
  const edge = Math.min(1, (column + 1) / 4, (columns - column) / 4);
  const radius = (.65 + (2 - Math.abs(row - 2)) * .34 + (i * 7 % 5) * .08) * edge;
  return circlePath(range.x + 5 + column * 8, range.y - 16 + row * 8, radius);
}).join('')}));
const tracePoints = [{x: 86, y: 355}, {x: 229, y: 232}, {x: 372, y: 368}, {x: 511, y: 301}];
const traceSegments = [
  'M86 355C138 355 163 223 229 232',
  'M229 232C293 240 305 378 372 368',
  'M372 368C430 362 456 293 511 301',
];
const traceDust = Array.from({length: 170}, (_, i) => {
  const x = 61 + i * 2.85;
  const y = 305 + Math.sin((x - 65) / 68) * 69 + Math.sin(i * 1.8) * 18;
  return circlePath(x, y, .42 + (i * 7 % 10) / 15);
}).join('');

function Material({id, kind}: {id: string; kind: MethodGraphKind}) {
  return <>
    <defs>
      <radialGradient id={`${id}-warm`}><stop stopColor="#e9b59c" stopOpacity=".65"/><stop offset=".3" stopColor="#b87378" stopOpacity=".38"/><stop offset=".67" stopColor="#8b626f" stopOpacity=".12"/><stop offset="1" stopColor="#8b626f" stopOpacity="0"/></radialGradient>
      <radialGradient id={`${id}-cool`}><stop stopColor="#b4a6d8" stopOpacity=".55"/><stop offset=".36" stopColor="#8e8aae" stopOpacity=".28"/><stop offset=".72" stopColor="#6e8392" stopOpacity=".1"/><stop offset="1" stopColor="#6e8392" stopOpacity="0"/></radialGradient>
      <radialGradient id={`${id}-pearl`}><stop stopColor="#fff4df" stopOpacity=".96"/><stop offset=".14" stopColor="#f7d5bd" stopOpacity=".48"/><stop offset=".46" stopColor="#eaa9ab" stopOpacity=".12"/><stop offset="1" stopColor="#eaa9ab" stopOpacity="0"/></radialGradient>
      <linearGradient id={`${id}-thread`} x1="70" y1="260" x2="505" y2="340" gradientUnits="userSpaceOnUse"><stop stopColor="#bea7cf" stopOpacity=".3"/><stop offset=".45" stopColor="#eddcc8"/><stop offset=".74" stopColor="#efb89b"/><stop offset="1" stopColor="#edcfb5"/></linearGradient>
      <linearGradient id={`${id}-band`}><stop stopColor="#c4a9d7" stopOpacity="0"/><stop offset=".28" stopColor="#aaa2c9" stopOpacity=".46"/><stop offset=".64" stopColor="#e2b0a4" stopOpacity=".6"/><stop offset="1" stopColor="#e3b5a2" stopOpacity="0"/></linearGradient>
      <pattern id={`${id}-grain`} width="23" height="29" patternUnits="userSpaceOnUse"><circle cx="2" cy="5" r=".55" fill="#fff5df"/><circle cx="16" cy="17" r=".42" fill="#e6c2b9"/><circle cx="8" cy="25" r=".63" fill="#090e15"/><circle cx="21" cy="3" r=".5" fill="#0a0e16"/><circle cx="11" cy="11" r=".35" fill="#fff8f0"/></pattern>
    </defs>
    <rect width="600" height="660" fill={kind === 'evolution' ? '#26222b' : kind === 'context' ? '#292832' : '#252b2f'}/>
    <g className="mg-atmosphere">
      <ellipse cx={kind === 'results' ? 368 : 230} cy="343" rx="304" ry="288" fill={`url(#${id}-warm)`}/>
      <ellipse cx={kind === 'evolution' ? 408 : 241} cy="240" rx="310" ry="236" fill={`url(#${id}-cool)`}/>
    </g>
    <rect width="600" height="660" fill={`url(#${id}-grain)`} opacity=".32" pointerEvents="none"/>
  </>;
}

function ResultsGraph({id}: {id: string}) {
  return <>
    <text className="mg-kicker" x="48" y="64">RESULTADOS</text>
    <path d={filamentDust} fill="#f1dbc4" opacity=".29"/>
    {filaments.map(({d, start, end, weight}, i) => <g key={i} style={delay(190 + i * 64)}>
      <path d={d} fill="none" stroke={`url(#${id}-thread)`} strokeWidth="13" opacity=".025"/>
      <path d={d} fill="none" stroke={`url(#${id}-thread)`} strokeWidth="4" opacity=".075"/>
      <path className="mg-draw mg-filament" d={d} pathLength="1" fill="none" stroke={`url(#${id}-thread)`} strokeWidth={weight} strokeLinecap="round"/>
      <circle cx="72" cy={start} r="1.45" fill="#d1bed7" opacity=".65"/>
      <g className="mg-arrive" style={delay(1320 + i * 64)}><circle cx="494" cy={end} r="13" fill={`url(#${id}-pearl)`}/><circle cx="494" cy={end} r={1.6 + i % 3 * .25} fill="#ffe6c8"/></g>
    </g>)}
    <text className="mg-label" x="61" y="479">Muestra</text><text className="mg-label" x="380" y="479">Lecturas</text>
    <text className="mg-summary" x="48" y="527">Quince biomarcadores.</text>
  </>;
}

function ContextGraph({id}: {id: string}) {
  return <>
    <defs>
      <linearGradient id={`${id}-context-reference`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#cfbfe3" stopOpacity="0"/><stop offset=".28" stopColor="#cfbfe3" stopOpacity=".1"/><stop offset=".5" stopColor="#d5c7e5" stopOpacity=".23"/><stop offset=".72" stopColor="#cfbfe3" stopOpacity=".1"/><stop offset="1" stopColor="#cfbfe3" stopOpacity="0"/></linearGradient>
      <linearGradient id={`${id}-context-eva`} x1="0" y1="0" x2="0" y2="1"><stop stopColor="#edb59e" stopOpacity="0"/><stop offset=".28" stopColor="#edb59e" stopOpacity=".13"/><stop offset=".5" stopColor="#f3c2a9" stopOpacity=".3"/><stop offset=".72" stopColor="#edb59e" stopOpacity=".13"/><stop offset="1" stopColor="#edb59e" stopOpacity="0"/></linearGradient>
    </defs>
    <text className="mg-kicker" x="48" y="64">CONTEXTO</text>
    <text className="mg-context-result-label" x="353" y="128" textAnchor="middle">Tu resultado</text>
    <path d="M353 173V430" stroke="#f0dfd0" strokeWidth="1" strokeDasharray="2 7" opacity=".25"/>
    <path className="mg-draw mg-context-axis" d="M353 173V430" pathLength="1" fill="none" stroke="#f5e6d5" strokeWidth="1.05" opacity=".72" style={delay(390)}/>
    <g className="mg-arrive" style={delay(80)}>
      <circle cx="353" cy="163" r="32" fill={`url(#${id}-pearl)`}/>
      <circle cx="353" cy="163" r="5" fill="#fff0d9"/>
    </g>
    {contextRanges.map(({label, x, width, y, tone, dots}, i) => <g key={tone} className={`mg-context-track mg-context-track-${tone}`}>
      <text className="mg-context-track-label" x="62" y={y - 49}>{label}</text>
      <path d={`M62 ${y}H538`} fill="none" stroke="#ddcfda" strokeWidth="1.05" opacity=".28"/>
      <g className="mg-context-reveal" style={delay(340 + i * 1110)}>
        <rect x={x - 14} y={y - 39} width={width + 28} height="78" rx="39" fill={`url(#${id}-context-${tone})`}/>
        <rect className="mg-context-range-line" x={x} y={y - 24} width={width} height="48" rx="24" fill="none" strokeWidth=".8"/>
        <path className="mg-context-range-dots" d={dots}/>
        <path className="mg-context-range-bound" d={`M${x} ${y - 10}V${y + 10}M${x + width} ${y - 10}V${y + 10}`} fill="none" strokeWidth="1.1"/>
      </g>
      <g className="mg-arrive" style={delay(950 + i * 1110)}>
        <circle cx="353" cy={y} r="35" fill={`url(#${id}-pearl)`}/>
        <circle cx="353" cy={y} r="12" fill="#39303a" stroke="#f5e4d2" strokeWidth="1.2"/>
        <circle cx="353" cy={y} r="4.1" fill="#fff0d9"/>
      </g>
    </g>)}
    <g className="mg-arrive" style={delay(2400)}>
      <text className="mg-context-summary" x="48" y="493">El mismo valor.</text>
      <text className="mg-context-summary" x="48" y="535">Más contexto.</text>
    </g>
  </>;
}

function EvolutionGraph({id}: {id: string}) {
  const full = traceSegments.join(' ');
  return <>
    <text className="mg-kicker" x="48" y="64">LECTURAS TRIMESTRALES</text>
    <path d={traceDust} fill="#dcc6dd" opacity=".22"/>
    <path d={full} fill="none" stroke={`url(#${id}-thread)`} strokeWidth="28" opacity=".032"/>
    <path d={full} fill="none" stroke={`url(#${id}-thread)`} strokeWidth="10" opacity=".075"/>
    <path d={full} fill="none" stroke="#e2ced9" strokeWidth=".8" opacity=".2"/>
    {traceSegments.map((d, i) => <path key={d} className="mg-draw mg-trace" d={d} pathLength="1" fill="none" stroke={`url(#${id}-thread)`} strokeWidth="1.5" strokeLinecap="round" style={delay(460 + i * 800)}/>)}
    {tracePoints.map(({x, y}, i) => <g key={i}>
      <path d={`M${x} ${y + 27}V451`} stroke="#e0c9d5" strokeWidth=".65" strokeDasharray="1 7" opacity=".28"/>
      <g className="mg-arrive" style={delay(i === 0 ? 260 : 1080 + (i - 1) * 800)}><circle cx={x} cy={y} r="35" fill={`url(#${id}-pearl)`}/><circle cx={x} cy={y} r="3.2" fill="#ffebd4"/></g>
      <text className="mg-quarter" x={x} y="479" textAnchor="middle">0{i + 1}</text>
    </g>)}
    <path className="mg-arrive" d="M523 303c15 3 27 6 42 5" fill="none" stroke="#efd2ba" strokeWidth="1" strokeDasharray="1 7" opacity=".45" style={delay(3050)}/>
    <text className="mg-summary" x="48" y="527">Cada lectura suma historia.</text>
  </>;
}

/** Root supplies selected/visible/play state. A changed cycle restarts one 4.2-second sequence. */
export function MethodGraphs({kind, active, visible, playing = true, calm = false, cycle = 0, className = ''}: MethodGraphsProps) {
  const id = `method-graph-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const [title, description] = descriptions[kind];
  return <div className={`method-graphs ${className}`} data-method-graph={kind} data-animate={active && !calm} data-running={active && visible && playing && !calm}>
    <svg key={`${kind}-${cycle}`} viewBox="0 0 600 660" role="img" aria-labelledby={`${id}-title ${id}-description`}>
      <title id={`${id}-title`}>{title}</title><desc id={`${id}-description`}>{description}</desc>
      <Material id={id} kind={kind}/>
      {kind === 'results' ? <ResultsGraph id={id}/> : kind === 'context' ? <ContextGraph id={id}/> : <EvolutionGraph id={id}/>}
    </svg>
  </div>;
}
