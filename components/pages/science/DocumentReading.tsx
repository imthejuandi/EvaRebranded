'use client';

import {useState} from 'react';
import OpticalReading from './OpticalReading';
import {sampleMarkers, dateLabel, createFixture, numberLabel} from '@/lib/preview/fixtures';

const marker = sampleMarkers.find(item => item.key === 'apob')!;
const report = createFixture().reports.find(item => item.id === 'demo-junio')!;
export const readingFields = [
  {id:'value', label:'El valor', source:'Resultado', value:numberLabel(marker.value), question:'¿Qué se midió?', explanation:'El nombre identifica el biomarcador. La cifra pertenece a esa medición y a ese informe; por sí sola no describe toda tu salud.'},
  {id:'unit', label:'La unidad', source:'Unidad', value:marker.unit, question:'¿Cómo se expresa?', explanation:'Valor y unidad se leen juntos. Antes de comparar dos resultados, revisa que correspondan al mismo biomarcador y que sus unidades sean compatibles.'},
  {id:'reference', label:'La referencia', source:'Referencia', value:'No incluida en este esquema', question:'¿Con qué se compara?', explanation:'La referencia procede del informe. Si falta, la ausencia sigue visible: no se sustituye por un objetivo supuesto ni se clasifica la cifra solo por su aspecto.'},
  {id:'source', label:'Fecha y fuente', source:'Fecha de la muestra', value:dateLabel(report.date), question:'¿De cuándo es y de dónde viene?', explanation:'La fecha sitúa la muestra en el tiempo. El documento de origen permite volver al dato. Una fecha ausente no se reemplaza con la de hoy.'},
] as const;

/** One factual identity, two presentations. Motion highlights the correspondence;
 * no intermediate numeric values, inferred reference or clinical classification. */
export default function DocumentReading() {
  const [selected, setSelected] = useState(0);
  const active = readingFields[selected];
  return <section className="science-document-story eva-inner" aria-labelledby="science-title">
    <header className="science-document-intro"><div><p className="eva-kicker">LA CIENCIA DE EVA</p><h1 id="science-title">Una cifra.<br/><em>Lo que la explica.</em></h1></div><div><p>El valor es una parte. Su unidad, su referencia y su origen completan la lectura.</p><a className="science-text-link" href="#science-document-stage">Sigue el dato <span aria-hidden="true">↓</span></a></div></header>
    <OpticalReading fields={readingFields}/>
    <div className="science-trace-controls" role="group" aria-label="Seguir un campo del informe">{readingFields.map((field, index) => <button key={field.id} type="button" onClick={() => setSelected(index)} aria-pressed={selected === index} aria-controls="science-document-stage science-field-explanation"><span>0{index + 1}</span>{field.label}</button>)}</div>
    <div className="science-document-stage" id="science-document-stage" data-selected={active.id}>
      <figure className="science-source-document"><header><span>01 / EL DOCUMENTO</span><p>Informe de ejemplo</p><h2>Apolipoproteína B</h2><small>Datos ficticios · EVA / 01</small></header><dl>{readingFields.map((field, index) => <div key={field.id} data-selected={selected === index}><dt>{field.source}</dt><dd>{field.value}</dd></div>)}</dl><figcaption><a href="/es/labs/demo-junio">Abrir el informe de ejemplo ↗</a></figcaption></figure>
      <div className="science-field-bridge" aria-hidden="true"><span>EL MISMO DATO</span><svg viewBox="0 0 100 400" preserveAspectRatio="none"><defs><linearGradient id="science-trace-ink"><stop stopColor="#bd7964"/><stop offset="1" stopColor="#8f789a"/></linearGradient></defs>{readingFields.map((field,index) => <path key={field.id} d={`M0 ${index * 100 + 50} C38 ${index * 100 + 50},62 ${index * 100 + 50},100 ${index * 100 + 50}`} stroke="#84718933" fill="none"/>)}<path key={active.id} className="science-active-path" pathLength="1" d={`M0 ${selected * 100 + 50} C38 ${selected * 100 + 50},62 ${selected * 100 + 50},100 ${selected * 100 + 50}`} stroke="url(#science-trace-ink)" strokeWidth="2" fill="none"/><circle cx="95" cy={selected * 100 + 50} r="4" fill="#796080"/></svg></div>
      <figure className="science-reading-record eva-glass"><header><span>02 / TU LECTURA</span><p>El dato conserva su contexto.</p><h2>{marker.name}</h2><small>Ejemplo educativo</small></header><dl>{readingFields.map((field,index) => <div key={field.id} data-selected={selected === index}><dt>{field.label}</dt><dd>{field.id === 'value' ? <strong>{field.value}</strong> : field.value}{field.id === 'source' && <a href="/es/labs/demo-junio">Informe de origen ↗</a>}</dd></div>)}</dl><figcaption>Sin intervalo clínico ni clasificación de salud.</figcaption></figure>
    </div>
    <div className="science-field-explanation" id="science-field-explanation" aria-live="polite" aria-atomic="true"><span>0{selected + 1} / {active.label}</span><h2>{active.question}</h2><p>{active.explanation}</p></div>
    <p className="science-trace-note">Las dos vistas presentan el mismo ejemplo. No son resultados personales. <a href="#science-reading-notes">Leer las cuatro claves ↓</a></p>
    <div className="science-reading-notes" id="science-reading-notes">{readingFields.map(field => <details key={field.id}><summary>{field.label}<span aria-hidden="true">+</span></summary><p>{field.explanation}</p></details>)}</div>
  </section>;
}
