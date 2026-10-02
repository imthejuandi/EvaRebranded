'use client';

import {useState} from 'react';
import {ArrowUpRight, ArrowRight, ArrowDown, FileText} from 'lucide-react';
import {ActionLink} from '@/components/site/Primitives';
import SampleToRecord, {ResultCapsule} from './SampleToRecord';

export const methodCopy = {es: {
  eyebrow: 'Cómo funciona',
  title: 'Una muestra. Toda una historia.',
  intro: 'Recogida de muestra en casa, análisis en laboratorio y tus resultados en un mismo lugar.',
  stageTitle: 'De tu casa a tus resultados.',
  stageIntro: 'Tú recoges la muestra. El laboratorio la analiza. EVA reúne los resultados para que puedas consultarlos.',
  stages: [
    {id: 'recogida', short: 'Recogida', place: 'En casa', title: 'Prepara tu muestra.', body: 'El kit incluye el dispositivo y sus instrucciones de recogida. Sigue las indicaciones del kit para cada paso.', detail: 'El dispositivo Tasso+ recoge la muestra. Esta ilustración explica el recorrido; las instrucciones de uso están en el kit.'},
    {id: 'envio', short: 'Envío', place: 'Camino al laboratorio', title: 'Tu muestra sigue su camino.', body: 'Prepara la muestra con el material de retorno y sigue las indicaciones de envío incluidas en el kit.', detail: 'La recogida de muestra en casa y el análisis en laboratorio son pasos distintos.'},
    {id: 'laboratorio', short: 'Laboratorio', place: 'Análisis de la muestra', title: 'Primero, una medición.', body: 'El laboratorio analiza la muestra y obtiene los valores de tus biomarcadores. Cada resultado tiene una unidad y un informe de origen.', detail: 'La fecha de la muestra, la unidad y el intervalo de referencia acompañan al resultado.'},
    {id: 'resultados', short: 'Resultados', place: 'En tu cuenta EVA', title: 'Ahora puedes consultarlo.', body: 'Abre tu informe, explora cada biomarcador y encuentra la información que ayuda a entenderlo.', detail: 'EVA ofrece información educativa. No sustituye un diagnóstico ni la valoración de un profesional de salud.'},
  ],
  reportTitle: 'Abre tu informe. Encuentra el detalle.',
  reportIntro: 'Pasa del conjunto a cada biomarcador y vuelve a su informe de origen.',
  views: [
    {id: 'informe', label: 'El informe', title: 'Todo empieza en un documento.', body: 'Los resultados conservan su fuente. La fecha de la muestra y el laboratorio de origen te ayudan a reconocer qué informe estás mirando.', cta: 'Explorar el informe de ejemplo', href: '/es/labs/demo-junio'},
    {id: 'biomarcador', label: 'El biomarcador', title: 'Un valor, junto a lo que lo explica.', body: 'Consulta la fecha, la unidad y el intervalo de referencia de cada resultado. Un valor fuera del intervalo no establece, por sí solo, un diagnóstico.', cta: 'Cómo entender un resultado', href: '/es/science'},
    {id: 'conversacion', label: 'La conversación', title: 'Haz espacio para tus preguntas.', body: 'Explora una conversación de ejemplo sobre tus resultados. EVA AI ofrece información educativa; no sustituye una consulta con un profesional de salud.', cta: 'Explorar EVA AI', href: '/es/eva-ai?report=demo-junio'},
  ],
  cadenceTitle: 'Vuelve a mirar con el tiempo.',
  cadenceBody: 'Las distintas fechas te ayudan a observar cambios. Un cambio, por sí solo, no explica su causa.',
  comparisons: [
    {label: 'Primera muestra', title: 'Un punto de partida.', body: 'Un primer informe registra un momento. Todavía no hay una serie con la que comparar.'},
    {label: 'Segunda muestra', title: 'Dos fechas, una comparación.', body: 'Antes de comparar valores, revisa que correspondan al mismo biomarcador y que sus unidades sean compatibles.'},
    {label: 'Tercera muestra', title: 'Más momentos para observar.', body: 'La fecha y las circunstancias de cada muestra ayudan a revisar las diferencias entre informes.'},
    {label: 'Cuarta muestra', title: 'Tu historial sigue abierto.', body: 'Los cambios no siguen una dirección obligatoria. Conserva cada informe y consulta tus dudas con un profesional de salud.'},
  ],
  finalTitle: 'Tus resultados también pueden ser el comienzo.',
  finalBody: 'Explora cómo reunir un informe que ya tienes. O elige un plan para empezar con una nueva recogida de muestra.',
  imageAlt: 'Una pausa después de nadar, entre luz cálida y sombras azules',
}};
const copy = methodCopy.es;

function ReportExample() {
  const [view, setView] = useState(0);
  const selected = copy.views[view];
  return <section className="method-report-section" aria-labelledby="method-report-heading">
    <div className="eva-inner">
      <div className="method-section-heading"><h2 id="method-report-heading">{copy.reportTitle}</h2><p>{copy.reportIntro}</p></div>
      <div className="method-report-layout">
        <div className="method-report-visual">
          <div className="method-example-label"><span>Ejemplo de organización</span><span>EVA / 001</span></div>
          {view === 0 ? <div className="method-report-document"><FileText size={29} strokeWidth={1.1} aria-hidden="true"/><h3>Tu informe</h3><p>Fecha de la muestra · Fuente</p><div className="method-document-columns"><span>Biomarcador</span><span>Resultado</span></div>{['Valor y unidad', 'Intervalo de referencia', 'Informe de origen'].map((label, index) => <div className="method-document-row" key={label}><span>0{index + 1}</span><span>{label}</span><ArrowUpRight size={15} aria-hidden="true"/></div>)}<span className="method-document-foot">El documento al que siempre puedes volver.</span></div> : view === 1 ? <ResultCapsule/> : <div className="method-conversation"><p className="method-chat-question">¿Qué me cuenta un biomarcador?</p><div className="method-chat-answer"><span>EVA AI · Ejemplo</span><p>Un valor es una pieza de información. Su unidad, la fecha de la muestra y el intervalo de referencia ayudan a entenderlo.</p><a href="/es/labs/demo-junio"><FileText size={16} aria-hidden="true"/>Ver un informe de ejemplo</a></div></div>}
          <p className="method-figure-note">Esquema educativo. No muestra resultados personales.</p>
        </div>
        <div className="method-report-reading">
          <div className="method-report-tabs" role="group" aria-label="Explorar el informe">{copy.views.map((item, index) => <button type="button" key={item.id} onClick={() => setView(index)} aria-pressed={view === index}><span>0{index + 1}</span>{item.label}<ArrowRight size={16} aria-hidden="true"/></button>)}</div>
          <div className="method-view-copy" aria-live="polite"><h3>{selected.title}</h3><p>{selected.body}</p><a className="eva-text-link" href={selected.href}>{selected.cta}<ArrowUpRight size={17} aria-hidden="true"/></a></div>
          <a className="method-science-link" href="/es/science">Más sobre cómo leer tus resultados<ArrowUpRight size={15} aria-hidden="true"/></a>
        </div>
      </div>
    </div>
  </section>;
}

function CompareOverTime() {
  const [selected, setSelected] = useState(0);
  return <section className="eva-inner method-comparison" aria-labelledby="method-comparison-heading">
    <div className="method-comparison-heading"><h2 id="method-comparison-heading">{copy.cadenceTitle}</h2><p>{copy.cadenceBody}</p></div>
    <div className="method-time-ledger">
      <div className="method-time-controls" role="group" aria-label="Momentos de un historial de ejemplo">{copy.comparisons.map((item, index) => <button type="button" key={item.label} aria-pressed={selected === index} onClick={() => setSelected(index)}><span className="method-time-point" aria-hidden="true"/><span className="method-time-date">Fecha {index + 1}</span><span>{item.label}</span></button>)}</div>
      <div className="method-time-detail" aria-live="polite"><span className="method-time-index">0{selected + 1}</span><div><h3>{copy.comparisons[selected].title}</h3><p>{copy.comparisons[selected].body}</p></div></div>
      <p className="method-figure-note">Secuencia ilustrativa. Cada punto representa una muestra; no una mejora ni una fecha programada.</p>
    </div>
  </section>;
}

export default function MethodPage() {
  return <div className="page-method">
    <section className="eva-inner method-intro" aria-labelledby="method-heading">
      <div className="method-intro-copy"><p className="method-page-label">{copy.eyebrow}</p><h1 id="method-heading">{copy.title}</h1><p className="method-intro-description">{copy.intro}</p><div className="method-intro-actions"><a href="#method-journey-heading" className="eva-button">Ver el recorrido<ArrowDown size={17} aria-hidden="true"/></a><a href="/es/pricing" className="eva-text-link">Ver planes<ArrowUpRight size={17} aria-hidden="true"/></a></div></div>
      <figure className="method-opening-photo"><img src="/art/editorial/method-morning-table-1200.webp" srcSet="/art/editorial/method-morning-table-640.webp 640w, /art/editorial/method-morning-table-1200.webp 1200w" sizes="(max-width: 760px) 100vw, 62vw" width="1200" height="900" alt="Un momento en casa, con una mesa preparada para hacer espacio al cuidado personal" fetchPriority="high" decoding="async"/><figcaption><span>01 / EN TU DÍA</span><span>El cuidado empieza aquí.</span></figcaption></figure>
      <div className="method-intro-trail" aria-label="Recogida, envío, laboratorio, resultados"><span>Una muestra.</span><span className="method-trail-line" aria-hidden="true"/><span>Un informe al que volver.</span></div>
    </section>
    <section className="eva-inner method-journey" aria-labelledby="method-journey-heading"><div className="method-section-heading"><h2 id="method-journey-heading">{copy.stageTitle}</h2><p>{copy.stageIntro}</p></div><SampleToRecord stages={copy.stages}/></section>
    <ReportExample/>
    <CompareOverTime/>
    <section className="eva-inner method-final" aria-labelledby="method-final-heading">
      <figure className="method-final-image"><img src="/art/editorial/after-swim-1200.webp" srcSet="/art/editorial/after-swim-600.webp 600w, /art/editorial/after-swim-1200.webp 1200w" sizes="(max-width: 760px) calc(100vw - 40px), 48vw" alt={copy.imageAlt} loading="lazy" decoding="async" width="1200" height="1607"/><figcaption>La vida sigue. Tú también.</figcaption></figure>
      <div className="method-final-copy"><h2 id="method-final-heading">{copy.finalTitle}</h2><p>{copy.finalBody}</p><ActionLink href="/es/upload">Explorar con un informe</ActionLink><a className="eva-text-link" href="/es/pricing">Prefiero empezar con un kit<ArrowUpRight size={17} aria-hidden="true"/></a><a className="method-specialty-link" href="/es/pricing#pricing-specialty-heading">Explorar perfiles especializados<ArrowUpRight size={15} aria-hidden="true"/></a></div>
    </section>
  </div>;
}
