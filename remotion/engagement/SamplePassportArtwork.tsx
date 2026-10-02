export const PASSPORT_FPS = 30;
export const PASSPORT_FRAMES = 270;
export const PASSPORT_STOPS = [0, 68, 135, 202] as const;
export const PASSPORT_LABELS = ['Recogida', 'Envío', 'Laboratorio', 'Resultados'] as const;
/** Linear keyframes kept independent of Remotion for the lightweight static fallback. */
function tween(frame: number, stops: number[], values: number[]) {
  if (frame <= stops[0]) return values[0];
  if (frame >= stops[stops.length - 1]) return values[values.length - 1];
  const index = stops.findIndex((stop, i) => i > 0 && frame <= stop);
  const progress = (frame - stops[index - 1]) / (stops[index] - stops[index - 1]);
  return values[index - 1] + (values[index] - values[index - 1]) * progress;
}

/** Original frame-driven artwork: one record persists as its physical context changes. */
export function SamplePassportArtwork({frame = 269}: {frame?: number}) {
  const phase = Math.min(3, Math.floor(frame / 67.5));
  const focus = (index: number) => index === 0
    ? tween(frame, [0, 42, 67], [1, 1, 0])
    : tween(frame, [index * 67.5 - 13, index * 67.5 + 8, (index + 1) * 67.5 - 20, (index + 1) * 67.5], [0, 1, 1, index === 3 ? 1 : 0]);
  const progress = tween(frame, [0, 252], [0, 1]);
  const identityX = tween(frame, [28, 88, 154, 220], [40, 236, 199, 188]);
  const identityY = tween(frame, [28, 88, 154, 220], [473, 344, 398, 405]);
  return <svg viewBox="0 0 720 640" role="presentation" aria-hidden="true" style={{display: 'block', width: '100%', height: '100%'}}>
    <defs>
      <linearGradient id="passport-glass" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#efded2"/><stop offset=".45" stopColor="#f6f1e8"/><stop offset="1" stopColor="#c4b9d0"/></linearGradient>
      <linearGradient id="passport-line"><stop stopColor="#bea1b5"/><stop offset="1" stopColor="#df9070"/></linearGradient>
      <radialGradient id="passport-optical-violet"><stop stopColor="#b7aacb" stopOpacity=".42"/><stop offset=".58" stopColor="#c8bfd6" stopOpacity=".22"/><stop offset="1" stopColor="#c8bfd6" stopOpacity="0"/></radialGradient>
      <radialGradient id="passport-optical-coral"><stop stopColor="#d99170" stopOpacity=".22"/><stop offset="1" stopColor="#d99170" stopOpacity="0"/></radialGradient>
      <pattern id="passport-paper" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r=".42" fill="#352a36" opacity=".09"/></pattern>
    </defs>
    <rect width="720" height="640" rx="6" fill="#eae6dd"/>
    <rect width="720" height="640" rx="6" fill="url(#passport-paper)"/>
    <ellipse cx={385 - progress * 35} cy="259" rx="272" ry="205" fill="url(#passport-optical-violet)"/>
    <ellipse cx={259 + progress * 45} cy="351" rx="207" ry="130" fill="url(#passport-optical-coral)"/>
    <text x="40" y="43" fill="#55564f" fontSize="13" letterSpacing="2" fontFamily="monospace">UNA MUESTRA / UN RECORRIDO</text>
    <text x="680" y="43" textAnchor="end" fill="#55564f" fontSize="13" fontFamily="monospace">0{phase + 1} — 04</text>
    <path d="M40 70H680M40 513H680" stroke="#302d3424"/>

    <g opacity={focus(0)} style={{translate: `${tween(frame, [35, 70], [0, -42])}px 0px`}}>
      <image href="/art/tasso-plus-product.jpg" x="170" y="90" width="380" height="340" preserveAspectRatio="xMidYMid meet" style={{mixBlendMode: 'multiply'}}/>
      <text x="360" y="455" textAnchor="middle" fill="#292b28" fontSize="20">Tasso+ · Recogida en casa</text>
    </g>

    <g opacity={focus(1)} style={{translate: `0px ${tween(frame, [54, 86], [20, 0])}px`}}>
      <rect x="210" y="129" width="300" height="295" rx="8" fill="#f7f4ed" stroke="#a9a69c"/>
      <path d="M210 150H510M210 164H510" stroke="#c9c4b7"/>
      <text x="238" y="214" fill="#292b28" fontSize="30">Tu muestra</text>
      <text x="238" y="242" fill="#68635f" fontSize="17">Camino al laboratorio</text>
      <rect x="235" y="278" width="250" height="108" fill="#e9e5db"/>
      <path d="M252 331H453M435 313L453 331L435 349" stroke="#514d54" strokeWidth="1.5"/>
      <text x="360" y="462" textAnchor="middle" fill="#595650" fontSize="17">Material de retorno · Ilustración</text>
    </g>

    <g opacity={focus(2)} style={{translate: `0px ${tween(frame, [122, 154], [22, 0])}px`}}>
      <rect x="167" y="112" width="386" height="342" rx="3" fill="#f9f7f1" stroke="#c7c2b7"/>
      <text x="199" y="157" fill="#323530" fontSize="26">Registro de laboratorio</text>
      <text x="199" y="187" fill="#6d6b63" fontSize="15">La medición conserva su origen.</text>
      {[['Biomarcador', 'Identificado'], ['Medición', 'Valor + unidad'], ['Fuente', 'Laboratorio']].map(([name, value], i) => <g key={name} opacity={tween(frame, [132 + i * 7, 145 + i * 7], [0, 1])}><path d={`M199 ${222 + i * 51}H521`} stroke="#c8c4b9"/><text x="199" y={252 + i * 51} fill="#62635c" fontSize="16">{name}</text><text x="521" y={252 + i * 51} textAnchor="end" fill="#30332e" fontSize="17">{value}</text></g>)}
    </g>

    <g opacity={focus(3)} style={{translate: `0px ${tween(frame, [189, 219], [26, 0])}px`}}>
      <rect x="145" y="108" width="430" height="352" rx="54" fill="url(#passport-glass)" stroke="#fffdf5" strokeWidth="2"/>
      <rect x="158" y="121" width="404" height="326" rx="43" fill="none" stroke="#ffffff8c"/>
      <text x="188" y="167" fill="#625465" fontSize="14" letterSpacing="1.3">EL RESULTADO / EN CONTEXTO</text>
      <text x="188" y="231" fill="#34313a" fontSize="36">Tu biomarcador</text>
      <text x="188" y="313" fill="#35313a" fontSize="60" letterSpacing="-2">Valor</text><text x="352" y="313" fill="#605867" fontSize="22">+ unidad</text>
      <path d="M188 350H532" stroke="#78677e66"/>
      <text x="188" y="385" fill="#554c5b" fontSize="17">Fecha · Referencia · Informe</text>

    </g>

    <g style={{translate:`${identityX}px ${identityY}px`}}>
      <rect width="132" height="30" rx="15" fill="#343530"/>
      <text x="66" y="20" textAnchor="middle" fontFamily="monospace" fontSize="12" fill="#f3f0e8">EVA / 001</text>
    </g>
    <text x="40" y="560" fill="#65645e" fontSize="16">Una identidad que acompaña al registro.</text>
    <path d="M40 598H680" stroke="#33332927" strokeWidth="2"/>
    <path d={`M40 598H${40 + progress * 640}`} stroke="url(#passport-line)" strokeWidth="3"/>
    {[40, 253, 467, 680].map((x, i) => <circle key={x} cx={x} cy="598" r={i === phase ? 6 : 3} fill={i <= phase ? '#655268' : '#b6b1a7'}/>)}
  </svg>;
}
