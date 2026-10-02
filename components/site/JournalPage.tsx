'use client';

import {useId, useState, type FormEvent} from 'react';
import {ArrowUpRight} from 'lucide-react';
import './journal-reading-desk.css';

export const journalCopy = {es: {
  title: 'Ideas para cuidarte, a tu manera.',
  intro: 'Estamos preparando el Journal de EVA: un espacio para aprender sobre tus resultados y hacer nuevas preguntas.',
  routes: [
    {id: 'resultado', label: 'Entender un resultado', question: '¿Qué me dice este valor?', body: 'La unidad, la fecha y las referencias que acompañan a un biomarcador.', destination: 'Ciencia', href: '/es/science'},
    {id: 'tiempo', label: 'Mirar distintas fechas', question: '¿Qué cambia con el tiempo?', body: 'Una muestra es un momento. Explora qué aporta volver a mirar.', destination: 'Cómo funciona', href: '/es/how-it-works#method-comparison-heading'},
    {id: 'metodo', label: 'Examinar el método', question: '¿De dónde viene una estimación?', body: 'Los datos, el método y los límites de una explicación. Documentación en revisión.', destination: 'Metodología', href: '/es/metodologia'},
  ],
  formTitle: 'El Journal está en preparación.',
  formIntro: 'Todavía no hay artículos publicados aquí. Mientras tanto, estas páginas de EVA son un buen lugar para empezar.',
  email: 'Correo electrónico de ejemplo',
  action: 'Probar aviso de publicación',
  sent: 'Así se vería la confirmación. No se ha registrado una suscripción ni enviado ningún correo.',
  note: 'Este formulario es una demostración. Usa un correo de ejemplo; no se guarda ni se envía un aviso real.',
}};

/** Original paper studies: an identified value, two separate records, and method notes. */
function ReadingIllustration({topic}: {topic: string}) {
  const id = useId().replaceAll(':', '');
  return <svg viewBox="0 0 520 460" className={`journal-paper-study journal-paper-${topic}`} aria-hidden="true" focusable="false">
    <defs><pattern id={`${id}-grain`} width="8" height="8" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".55" fill="#51494e" opacity=".18"/></pattern><linearGradient id={`${id}-paper`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fffdf7"/><stop offset="1" stopColor="#e9e2d9"/></linearGradient></defs>
    <rect width="520" height="460" rx="2" fill="#ddd8d0"/><rect width="520" height="460" fill={`url(#${id}-grain)`}/>
    {topic === 'resultado' ? <>
      <path d="M137 87 407 108 383 389 113 368Z" fill="#655453" opacity=".1"/>
      <g className="journal-paper-primary" transform="rotate(-4 253 222)"><rect x="110" y="64" width="291" height="305" fill={`url(#${id}-paper)`}/><path d="M134 103H373" stroke="#4e4748" strokeOpacity=".22"/><text x="134" y="93" fontSize="12" fill="#665e5c">Un dato, con sus detalles</text><text x="134" y="157" fontSize="24" fill="#393238">HbA1c</text><text x="130" y="248" fontSize="87" letterSpacing="-4" fill="#393238">5,2</text><text x="276" y="244" fontSize="28" fill="#625968">%</text><path d="M136 273H373" stroke="#4e4748" strokeOpacity=".2"/><text x="136" y="303" fontSize="12" fill="#665e5c">12 junio 2026</text><text x="136" y="324" fontSize="11" fill="#665e5c">Dato ficticio · No es una valoración</text></g>
      <g className="journal-paper-annotation"><rect x="309" y="211" width="147" height="58" rx="3" fill="#b9b2c8"/><text x="326" y="236" fontSize="12" fill="#322d3d">La unidad también</text><text x="326" y="253" fontSize="12" fill="#322d3d">forma parte del dato.</text><path d="M309 240H294" stroke="#524359" strokeDasharray="2 3"/></g>
    </> : topic === 'tiempo' ? <>
      <g className="journal-paper-primary" transform="rotate(-7 202 182)"><rect x="77" y="77" width="258" height="254" fill="#c9b8b5"/><text x="98" y="113" fontSize="12" fill="#524445">Una muestra</text><text x="96" y="167" fontSize="37" fill="#3f3237">12 marzo</text><path d="M99 191H307M99 222H277M99 237H244" stroke="#655258" strokeOpacity=".4"/><text x="99" y="283" fontSize="12" fill="#524445">Fecha · Unidad · Origen</text></g>
      <g className="journal-paper-annotation" transform="rotate(5 331 268)"><rect x="205" y="147" width="246" height="249" fill={`url(#${id}-paper)`}/><text x="226" y="185" fontSize="12" fill="#665e5c">Otra muestra</text><text x="224" y="239" fontSize="37" fill="#3f3237">12 junio</text><path d="M227 263H422M227 294H390M227 309H350" stroke="#655258" strokeOpacity=".35"/><text x="227" y="353" fontSize="12" fill="#665e5c">¿Son comparables?</text><circle cx="418" cy="349" r="10" fill="none" stroke="#746c82" strokeDasharray="1 3"/></g>
    </> : <>
      <g className="journal-paper-primary" transform="rotate(-5 257 228)"><path d="M104 75H378V371H104Z" fill="#b6b1c3"/><rect x="132" y="61" width="262" height="301" fill={`url(#${id}-paper)`}/><path d="M160 82V343" stroke="#c79489" strokeOpacity=".6"/><text x="184" y="108" fontSize="12" fill="#665e5c">Notas sobre una estimación</text><text x="183" y="169" fontSize="29" fill="#3f3237">Datos.</text><text x="183" y="214" fontSize="29" fill="#3f3237">Método.</text><text x="183" y="259" fontSize="29" fill="#3f3237">Límites.</text><path d="M184 294H365" stroke="#6b636a" strokeOpacity=".25"/><text x="184" y="323" fontSize="11" fill="#665e5c">Documentación en revisión</text><path d="M132 88H145M132 116H145M132 144H145M132 172H145M132 200H145M132 228H145M132 256H145M132 284H145M132 312H145M132 340H145" stroke="#6c6265" strokeWidth="3" strokeLinecap="round"/></g>
      <g className="journal-paper-annotation"><path d="M316 323 451 298 459 342 324 367Z" fill="#d99f8d"/><text x="332" y="342" fontSize="12" fill="#4d3837" transform="rotate(-10 332 342)">Mirar cómo se llega.</text></g>
    </>}
  </svg>;
}

export default function JournalPage() {
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');
  const [selected, setSelected] = useState('resultado');
  const copy = journalCopy.es;
  function submit(event: FormEvent<HTMLFormElement>) { event.preventDefault(); setSent(true); }
  return <div className="page-journal journal-notebook"><div className="eva-inner">
    <div className="journal-desk-mast"><span>El Journal de EVA</span><span>En preparación</span></div>
    <header className="journal-desk-opening"><div className="journal-desk-heading"><h1>{copy.title}</h1><p>{copy.intro}</p></div><figure className="journal-human-note"><img src="/art/editorial/after-cycling-600.webp" alt="Una pausa después de pedalear, compartiendo un vaso de agua" width="600" height="448" decoding="async" fetchPriority="high"/><figcaption>Una pausa. Una buena pregunta.</figcaption></figure></header>
    <section className="journal-desk" aria-labelledby="journal-reading-heading" data-journal-reading-desk>
      <div className="journal-desk-intro"><h2 id="journal-reading-heading">Empieza por una pregunta.</h2><p>Tres páginas de EVA que ya puedes explorar.</p></div>
      <div className="journal-desk-spread"><figure className="journal-selected-study" aria-hidden="true"><ReadingIllustration key={selected} topic={selected}/><figcaption>El detalle cambia lo que ves.</figcaption></figure>
        <ul className="journal-question-index">{copy.routes.map(item=><li key={item.id}><a href={item.href} className={selected===item.id?'is-previewed':undefined} onFocus={()=>setSelected(item.id)} onPointerEnter={event=>{if(event.pointerType!=='touch')setSelected(item.id)}}><span className="journal-mobile-study"><ReadingIllustration topic={item.id}/></span><div className="journal-question-copy"><span className="journal-question-label">{item.label}</span><h3>{item.question}</h3><p>{item.body}</p><span className="journal-question-destination">{item.destination}<ArrowUpRight size={18} aria-hidden="true"/></span></div></a></li>)}</ul>
      </div>
    </section>
    <section className="journal-notice" aria-labelledby="journal-preview-heading"><div><p className="journal-notice-label">Un espacio que está por llegar</p><h2 id="journal-preview-heading">{copy.formTitle}</h2><p>{copy.formIntro}</p></div><form onSubmit={submit} className="journal-interest-form"><label className="eva-field">{copy.email}<input type="email" name="email" value={email} onChange={event=>{setEmail(event.target.value);setSent(false)}} required placeholder="alex@ejemplo.com" autoComplete="off" aria-describedby="journal-preview-note"/></label><button className="eva-button" disabled={sent}>{sent?'Ejemplo completado':copy.action}<ArrowUpRight size={16} aria-hidden="true"/></button><p className="editorial-form-note" id="journal-preview-note">{copy.note}</p>{sent&&<p role="status" className="journal-preview-result">{copy.sent}</p>}</form></section>
  </div></div>;
}
