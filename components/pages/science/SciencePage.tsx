'use client';

import {ActionLink, Note} from '@/components/site/Primitives';
import {categories, derivedMetrics} from './science-content';
import {sampleMarkers, createFixture, dateLabel, numberLabel} from '@/lib/preview/fixtures';
import DocumentReading from './DocumentReading';

export const scienceCopy = {
  es: {
    eyebrow: 'LA CIENCIA DE EVA',
    title: 'Entiende lo que estás mirando.',
    intro: 'Qué mide un biomarcador, cómo se presenta su resultado y qué información ayuda a leerlo.',
    lenses: [
      {id: 'measurement', label: 'Valor y unidad', question: '¿Qué se midió?', text: 'El nombre identifica el biomarcador. El valor y la unidad se leen juntos: la unidad indica cómo se expresa la medición.', detail: 'Antes de comparar dos resultados, revisa que correspondan al mismo biomarcador y que sus unidades sean compatibles.', caption: 'Valor y unidad forman una sola medición.'},
      {id: 'reference', label: 'Referencia', question: '¿Con qué se compara?', text: 'El intervalo de referencia acompaña al resultado en su informe de laboratorio. Para entenderlo, necesitas esa referencia concreta.', detail: 'Si el informe no incluye un intervalo, el dato queda sin referencia. No se completa con un objetivo supuesto ni se clasifica solo por su valor.', caption: 'La referencia procede del informe, no del aspecto del gráfico.'},
      {id: 'source', label: 'Fecha y fuente', question: '¿De cuándo es y de dónde viene?', text: 'La fecha de la muestra sitúa el resultado en el tiempo. El informe de origen permite volver al dato y revisar cómo se presentó.', detail: 'Una fecha ausente no se reemplaza con la de hoy. Si solo hay un resultado, aún no hay una evolución que mostrar.', caption: 'La fecha y el informe acompañan siempre al resultado.'},
    ],
  },
} as const;
const example = sampleMarkers.find(marker => marker.key === 'apob')!;
const comparisonReports = createFixture().reports.slice().sort((a,b) => a.date.localeCompare(b.date));
function ComparisonNotes() {
  return <section className="science-comparison science-complete-comparison eva-inner" aria-labelledby="science-comparison-title">
    <div><p className="eva-kicker">EL TIEMPO TAMBIÉN IMPORTA</p><h2 id="science-comparison-title">Dos fechas.<br/>Dos registros completos.</h2><p className="science-body">La fecha no viaja sola: conserva también la unidad y el origen de cada resultado.</p><p className="science-body">Estos ejemplos tienen distintos tipos de origen. Los mostramos por separado, sin unirlos como una evolución comparable.</p></div>
    <figure className="science-comparison-figure"><div className="science-document-pair">{comparisonReports.map((report,index) => <a href={`/es/labs/${report.id}`} className="science-paper-record" key={report.id}><span>0{index + 1} / DATOS FICTICIOS</span><h3>{dateLabel(report.date)}</h3><p className="science-comparison-number">{numberLabel(report.id === 'demo-marzo' ? example.history[1] : example.value)} <small>{example.unit}</small></p><dl><div><dt>Biomarcador</dt><dd>{example.name}</dd></div><div><dt>Tipo de origen</dt><dd>{report.source === 'kit' ? 'Muestra del kit' : 'Analítica subida'}</dd></div><div><dt>Referencia</dt><dd>No incluida aquí</dd></div></dl><span className="science-compare-open">Ver informe ↗</span></a>)}</div><figcaption>Un cambio numérico no explica su causa ni demuestra una mejora. Confirma también el laboratorio, el método y las condiciones de cada muestra.</figcaption></figure>
  </section>;
}

function Catalogue() {
  return <section id="catalogo" className="science-catalogue eva-inner" aria-labelledby="science-catalogue-title">
    <div className="science-section-heading"><div><p className="eva-kicker">EXPLORA LOS BIOMARCADORES</p><h2 id="science-catalogue-title">Un cuerpo.<br/>Muchos puntos de vista.</h2></div><p className="science-body">Explora qué información reúne cada grupo de biomarcadores. Esta guía es educativa; la lista de cada plan se consulta por separado.</p></div>
    <div className="science-category-list">{categories.map((category, index) => <details className="science-category" key={category.id}><summary><span className="science-category-index">{String(index + 1).padStart(2, '0')}</span><h3>{category.name}</h3><span className="science-category-count">{category.markers.length} <span>ejemplos</span></span><span className="science-details-mark" aria-hidden="true">+</span></summary><div className="science-category-content"><p>Biomarcadores y pruebas de este grupo</p><ul>{category.markers.map(marker => <li key={marker}>{marker}</li>)}</ul></div></details>)}</div>
    <div className="science-catalogue-foot"><p>Algunas señales aparecen en más de un grupo. Los ejemplos no indican qué incluye un kit.</p><ActionLink href="/es/pricing" secondary>Consultar los planes</ActionLink></div>
  </section>;
}

function EvidenceNotes() {
  return <section className="science-evidence eva-inner" aria-labelledby="science-evidence-title">
    <div className="science-section-heading"><div><p className="eva-kicker">DATOS, MÉTODOS Y LÍMITES</p><h2 id="science-evidence-title">Qué significa<br/>una estimación.</h2></div><p className="science-body">Un modelo reúne varios datos en una estimación. Para entenderla, también necesitas conocer su método y sus límites.</p></div>
    <ol className="science-model-process">
      <li><span className="science-model-symbol science-observed" aria-hidden="true"/><span className="science-step-index">01 / DATOS</span><h3>Lo que se ha medido</h3><p>Resultados con sus unidades, fechas y fuentes. La información ausente sigue marcada como ausente.</p></li>
      <li><span className="science-model-symbol science-derived-symbol" aria-hidden="true"/><span className="science-step-index">02 / MÉTODO</span><h3>Cómo se relaciona</h3><p>Una fórmula o modelo combina los datos según unas reglas. Importan su versión y los datos para los que se estudió.</p></li>
      <li><span className="science-model-symbol science-unavailable" aria-hidden="true"/><span className="science-step-index">03 / ESTIMACIÓN</span><h3>Qué puede explicar</h3><p>El resultado necesita una explicación de su alcance. Si faltan datos necesarios, no se completa con una cifra inventada.</p></li>
    </ol>
    <details className="science-evidence-detail"><summary>Qué revisar antes de interpretar un modelo <span aria-hidden="true">+</span></summary><div><p>Qué intenta estimar, qué datos necesita, cómo trata los datos ausentes y en qué población se ha evaluado.</p><p>Una estimación no equivale a una medición directa. La evidencia de un método y la evaluación de una implementación concreta son preguntas distintas.</p></div></details>
    <div className="science-derived-layout"><div><h3>Cuando se relacionan<br/>varios resultados.</h3><p className="science-body">Las métricas derivadas combinan mediciones. No son pruebas adicionales y no todas se calculan con los mismos datos.</p><Note>Aquí puedes conocer sus nombres y propósito. No calculamos resultados personales ni mostramos objetivos clínicos.</Note></div><div className="science-metrics">{derivedMetrics.map(metric => <details key={metric.name}><summary>{metric.name}<span aria-hidden="true">+</span></summary><p>{metric.description}</p></details>)}</div></div>
    <div className="science-evidence-links"><ActionLink href="/es/metodologia" secondary>Consultar la metodología</ActionLink><a className="science-text-link" href="/es/metodologia/completa">Leer el documento completo <span aria-hidden="true">↗</span></a></div>
  </section>;
}

export default function SciencePage() {
  return <div className="page-science">
    <DocumentReading/>
    <nav className="science-chapter-nav eva-inner" aria-label="En esta página"><a href="#catalogo">Biomarcadores <span aria-hidden="true">↓</span></a><a href="#science-evidence-title">Métodos y límites <span aria-hidden="true">↓</span></a><a href="/es/how-it-works">Cómo funciona EVA <span aria-hidden="true">↗</span></a></nav>
    <ComparisonNotes/>
    <Catalogue/>
    <EvidenceNotes/>
    <section className="science-context eva-inner" aria-labelledby="science-context-title"><p className="eva-kicker">ENTRE DOS MUESTRAS</p><div><h2 id="science-context-title">También cuenta<br/>lo que pasa entre ellas.</h2><div><p className="science-body">El descanso, la actividad y las condiciones de recogida pueden aportar información para conversar sobre tus resultados.</p><p className="science-body">Los registros de un dispositivo y los resultados de laboratorio son fuentes distintas. Verlos juntos no demuestra que una señal cause otra.</p><p className="science-context-note">La demostración de EVA permite explorar este contexto; no representa una conexión activa con tus dispositivos.</p></div></div></section>
    <section className="science-close" aria-labelledby="science-close-title"><div className="eva-inner"><p className="eva-kicker">DE LA EXPLICACIÓN AL INFORME</p><h2 id="science-close-title">Saber más puede empezar<br/>con una buena pregunta.</h2><p>Conoce cómo se organiza un informe de EVA.</p><ActionLink href="/es/labs/demo-junio">Ver un informe de ejemplo</ActionLink></div></section>
  </div>;
}
