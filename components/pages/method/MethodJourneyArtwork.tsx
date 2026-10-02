import {methodSceneState, methodTween} from './method-journey-motion';

const dots = Array.from({length: 25 * 29}, (_, index) => {
  const x = (index % 25) * 24 + 122;
  const y = Math.floor(index / 25) * 20 + 60;
  const distance = Math.hypot((x - 410) / 340, (y - 345) / 345);
  return {x, y, r: Math.max(.5, (1 - distance) * 6.5), opacity: Math.max(.05, 1 - distance)};
});

/** A photo world becomes a physical sample, then a source document and its reading.
 * All marks are process illustrations; no biomarker numbers or health classification. */
export function MethodJourneyArtwork({frame = 0, mobile = false}: {frame?: number; mobile?: boolean}) {
  const s = methodSceneState(frame);
  const move = (stops: number[], values: number[]) => methodTween(frame, stops, values);
  return <svg className="method-world-artwork" viewBox="0 0 850 720" fill="none" aria-hidden="true" data-method-frame={Math.round(frame)}>
    <defs>
      <linearGradient id="method-world-glass" x1=".1" y1="0" x2=".9" y2="1"><stop stopColor="#f7eee6" stopOpacity="1"/><stop offset=".55" stopColor="#c4afce" stopOpacity="1"/><stop offset="1" stopColor="#dfa18b" stopOpacity="1"/></linearGradient>
      <linearGradient id="method-world-paper" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#faf7ed"/><stop offset="1" stopColor="#ddc8b2"/></linearGradient>
      <linearGradient id="method-world-line"><stop stopColor="#a86b55"/><stop offset="1" stopColor="#685878"/></linearGradient>
      <clipPath id="method-world-photo"><rect x="70" y="33" width="700" height="600" rx="300"/></clipPath>
      <pattern id="method-world-grain" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="1" cy="2" r=".55" fill="#5c3c57" opacity=".13"/></pattern>
    </defs>
    <g opacity={.38 - s.morning * .2} transform={`translate(${move([0,120,240,360],[55,-30,35,0])} ${move([0,120,240,360],[0,20,-25,0])}) rotate(${move([0,360],[-22,15])} 425 350)`}>
      {dots.map((dot,index) => <circle key={index} cx={dot.x} cy={dot.y} r={dot.r} opacity={dot.opacity} fill={index % 4 ? '#aa91b5' : '#cc8f72'}/>)}
    </g>
    <g opacity={s.morning} transform={`translate(${move([0,100],[0,-230])} ${move([0,100],[0,-30])}) rotate(${move([0,100],[-8,-24])} 425 350) scale(${move([0,100],[1,.62])})`}>
      <g clipPath="url(#method-world-photo)"><image href="/art/editorial/method-morning-table-1200.webp" x="45" y="5" width="790" height="660" preserveAspectRatio="xMidYMid slice"/><rect x="70" y="33" width="700" height="600" fill="#b693bd" fillOpacity=".08"/><rect x="70" y="33" width="700" height="600" fill="url(#method-world-grain)"/></g>
      <rect x="80" y="43" width="680" height="580" rx="290" stroke="#fff7ea" strokeOpacity=".48"/>
      <path d="M99 371H-2M646 151H843" stroke="#f5e9da" strokeWidth="1.4"/>
      <circle cx="98" cy="371" r="5" fill="#f5e9da"/>
      <text x="425" y="677" textAnchor="middle" fill="#6f5d65" fontFamily="monospace" fontSize="13" letterSpacing="2">EL CUIDADO EMPIEZA EN TU DÍA</text>
    </g>
    <g opacity={s.sample} transform={`translate(${move([30,110,210],[250,0,-200])} ${move([30,110,210],[110,0,-100])}) rotate(${move([30,110,210],[20,-8,-30])} 425 350)`}>
      <rect x="185" y="80" width="480" height="525" rx="44" fill="url(#method-world-glass)" stroke="#fff8ef" strokeWidth="2"/>
      <rect x="201" y="96" width="448" height="493" rx="32" stroke="#fffaf0" strokeOpacity=".5"/>
      <path d="M221 136H629M221 146H629" stroke="#ac94ae" strokeOpacity=".6"/>
      <image href="/art/tasso-plus-product.jpg" x="207" y="166" width="422" height="340" preserveAspectRatio="xMidYMid meet" style={{mixBlendMode:'multiply'}}/>
      <text x="230" y="550" fill="#463945" fontSize="31" letterSpacing="-1">Tu muestra.</text>
      <text x="230" y="579" fill="#6c5868" fontFamily="monospace" fontSize="11" letterSpacing="1">RECOGIDA EN CASA → LABORATORIO</text>
      <g transform="translate(579 467) rotate(8)"><rect width="130" height="66" rx="8" fill="#f7f2e9" stroke="#dbd0c8"/>{Array.from({length:21},(_,i)=><path key={i} d={`M${12+i*5} 13v31`} stroke="#675565" strokeWidth={i%3===0?2.5:1}/>)}<text x="65" y="57" textAnchor="middle" fill="#675565" fontFamily="monospace" fontSize="8">EVA / 001</text></g>
    </g>
    <g opacity={s.lab} transform={`translate(${move([145,230,310],[0,0,140])} ${move([145,183,310],[190,0,-120])}) rotate(${move([145,183,310],[19,5,-13])} 425 350)`}>
      <rect x="143" y="90" width="536" height="534" rx="3" fill="#d8c4d7" transform="rotate(-9 411 350)"/>
      <rect x="163" y="55" width="536" height="566" rx="3" fill="url(#method-world-paper)" stroke="#c2b4b3"/>
      <text x="201" y="111" fill="#77636f" fontFamily="monospace" fontSize="12" letterSpacing="2">LABORATORIO / REGISTRO DE ORIGEN</text>
      <text x="201" y="181" fill="#373333" fontSize="44" letterSpacing="-2">Primero, una medición.</text>
      <path d="M201 218H661" stroke="#bcb0a5"/>
      {['Biomarcador','Valor + unidad','Fecha de la muestra','Informe de origen'].map((label,index)=><g key={label} transform={`translate(${move([146+index*5,176+index*4],[110,0])} 0)`} opacity={move([146+index*5,167+index*4],[0,1])}><text x="201" y={272+index*73} fill="#63565e" fontFamily="monospace" fontSize="12">0{index+1}</text><text x="249" y={274+index*73} fill="#3f393a" fontSize="24">{label}</text><path d={`M201 ${295+index*73}H661`} stroke="#c4b7ac"/></g>)}
      <text x="201" y="586" fill="#77636f" fontSize="12">Cada resultado conserva la información de su fuente.</text>
    </g>
    <g opacity={s.result} transform={`translate(${move([262,360],[100,0])} ${move([262,360],[40,0])})`}>
      <text x="120" y="140" fill="#6e596e" fontFamily="monospace" fontSize="12" letterSpacing="2">DE LA MEDICIÓN A TU LECTURA</text>
      <text x="111" y="221" fill="#3b343b" fontSize={mobile ? 73 : 80} letterSpacing="-4">Tu resultado.</text>
      {['Valor + unidad','Intervalo de referencia','Fecha + informe'].map((label,index)=><g key={label} transform={`translate(${move([270+index*8,345+index*5],[150-index*95,index*21])} ${move([270+index*8,345+index*5],[100-index*45,0])}) rotate(${move([270,360],[(index-1)*15,(index-1)*3])} 425 ${292+index*108})`}><rect x="116" y={254+index*110} width="558" height="96" rx="48" fill="url(#method-world-glass)" stroke="#fff9ef" strokeWidth="2"/><rect x="125" y={263+index*110} width="540" height="78" rx="39" stroke="#fffcf2" strokeOpacity=".42"/><circle cx="160" cy={301+index*110} r="5" fill="#9b788c"/><text x="190" y={310+index*110} fill="#4c3e4b" fontSize="26" letterSpacing="-.4">{label}</text><path d={`M604 ${302+index*110}h20m-8-8 8 8-8 8`} stroke="#785d77"/></g>)}
      <text x="147" y="637" fill="#685768" fontSize="13">Un informe al que siempre puedes volver.</text>
    </g>
    <g transform={`translate(${move([0,120,180,240,360],[495,131,510,530,522])} ${move([0,120,180,240,360],[561,231,610,600,593])}) rotate(${move([0,120,240,360],[0,-8,5,0])})`}>
      <rect width="166" height="46" rx="23" fill="#443c46" stroke="#fcf3e6" strokeOpacity=".55"/>
      <circle cx="22" cy="23" r="4" fill="#d4ab98"/><text x="95" y="29" textAnchor="middle" fill="#fff3e4" fontFamily="monospace" fontSize="13" letterSpacing="1.5">EVA / 001</text>
    </g>
  </svg>;
}
