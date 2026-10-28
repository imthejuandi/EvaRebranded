'use client';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { useState } from 'react';
import OpticalReading from './OpticalReading';
import { sampleMarkers, dateLabel, createFixture, numberLabel } from '@/lib/preview/fixtures';
const marker = sampleMarkers.find(item => item.key === 'apob')!;
const report = createFixture().reports.find(item => item.id === 'demo-junio')!;
export const readingFields = [
    { id: 'value', label: 'El valor', source: 'Resultado', value: numberLabel(marker.value), question: '¿Qué se midió?', explanation: 'El nombre identifica el biomarcador. La cifra pertenece a esa medición y a ese informe; por sí sola no describe toda tu salud.' },
    { id: 'unit', label: 'La unidad', source: 'Unidad', value: marker.unit, question: '¿Cómo se expresa?', explanation: 'Valor y unidad se leen juntos. Antes de comparar dos resultados, revisa que correspondan al mismo biomarcador y que sus unidades sean compatibles.' },
    { id: 'reference', label: 'La referencia', source: 'Referencia', value: 'No incluida en este esquema', question: '¿Con qué se compara?', explanation: 'La referencia procede del informe. Si falta, la ausencia sigue visible: no se sustituye por un objetivo supuesto ni se clasifica la cifra solo por su aspecto.' },
    { id: 'source', label: 'Fecha y fuente', source: 'Fecha de la muestra', value: dateLabel(report.date), question: '¿De cuándo es y de dónde viene?', explanation: 'La fecha sitúa la muestra en el tiempo. El documento de origen permite volver al dato. Una fecha ausente no se reemplaza con la de hoy.' },
] as const;
/** One factual identity, two presentations. Motion highlights the correspondence;
 * no intermediate numeric values, inferred reference or clinical classification. */
export default function DocumentReading() {
    const __site = useSiteLanguage();
    const [selected, setSelected] = useState(0);
    const active = readingFields[selected];
    return <section className="science-document-story eva-inner" aria-labelledby="science-title">
    <header className="science-document-intro"><div><p className="eva-kicker">{__site.t("LA CIENCIA DE EVA")}</p><h1 id="science-title">{__site.t("Una cifra.")}<br /><em>{__site.t("Lo que la explica.")}</em></h1></div><div><p>{__site.t("El valor es una parte. Su unidad, su referencia y su origen completan la lectura.")}</p><a className="science-text-link" href={__site.href("#science-document-stage")}>{__site.t("Sigue el dato ")}<span aria-hidden="true">{__site.t("\u2193")}</span></a></div></header>
    <OpticalReading fields={readingFields}/>
    <div className="science-trace-controls" role="group" aria-label={__site.t("Seguir un campo del informe")}>{__site.t(readingFields.map((field, index) => <button key={field.id} type="button" onClick={() => setSelected(index)} aria-pressed={selected === index} aria-controls="science-document-stage science-field-explanation"><span>{__site.t("0")}{__site.t(index + 1)}</span>{__site.t(field.label)}</button>))}</div>
    <div className="science-document-stage" id="science-document-stage" data-selected={active.id}>
      <figure className="science-source-document"><header><span>{__site.t("01 / EL DOCUMENTO")}</span><p>{__site.t("Informe de ejemplo")}</p><h2>{__site.t("Apolipoprote\u00EDna B")}</h2><small>{__site.t("Datos ficticios \u00B7 EVA / 01")}</small></header><dl>{__site.t(readingFields.map((field, index) => <div key={field.id} data-selected={selected === index}><dt>{__site.t(field.source)}</dt><dd>{__site.t(field.value)}</dd></div>))}</dl><figcaption><a href={__site.href("/es/labs/demo-junio")}>{__site.t("Abrir el informe de ejemplo \u2197")}</a></figcaption></figure>
      <div className="science-field-bridge" aria-hidden="true"><span>{__site.t("EL MISMO DATO")}</span><svg viewBox="0 0 100 400" preserveAspectRatio="none"><defs><linearGradient id="science-trace-ink"><stop stopColor="#bd7964"/><stop offset="1" stopColor="#8f789a"/></linearGradient></defs>{__site.t(readingFields.map((field, index) => <path key={field.id} d={`M0 ${index * 100 + 50} C38 ${index * 100 + 50},62 ${index * 100 + 50},100 ${index * 100 + 50}`} stroke="#84718933" fill="none"/>))}<path key={active.id} className="science-active-path" pathLength="1" d={`M0 ${selected * 100 + 50} C38 ${selected * 100 + 50},62 ${selected * 100 + 50},100 ${selected * 100 + 50}`} stroke="url(#science-trace-ink)" strokeWidth="2" fill="none"/><circle cx="95" cy={selected * 100 + 50} r="4" fill="#796080"/></svg></div>
      <figure className="science-reading-record eva-glass"><header><span>{__site.t("02 / TU LECTURA")}</span><p>{__site.t("El dato conserva su contexto.")}</p><h2>{__site.t(marker.name)}</h2><small>{__site.t("Ejemplo educativo")}</small></header><dl>{__site.t(readingFields.map((field, index) => <div key={field.id} data-selected={selected === index}><dt>{__site.t(field.label)}</dt><dd>{__site.t(field.id === 'value' ? <strong>{__site.t(field.value)}</strong> : field.value)}{__site.t(field.id === 'source' && <a href={__site.href("/es/labs/demo-junio")}>{__site.t("Informe de origen \u2197")}</a>)}</dd></div>))}</dl><figcaption>{__site.t("Sin intervalo cl\u00EDnico ni clasificaci\u00F3n de salud.")}</figcaption></figure>
    </div>
    <div className="science-field-explanation" id="science-field-explanation" aria-live="polite" aria-atomic="true"><span>{__site.t("0")}{__site.t(selected + 1)}{__site.t(" / ")}{__site.t(active.label)}</span><h2>{__site.t(active.question)}</h2><p>{__site.t(active.explanation)}</p></div>
    <p className="science-trace-note">{__site.t("Las dos vistas presentan el mismo ejemplo. No son resultados personales. ")}<a href={__site.href("#science-reading-notes")}>{__site.t("Leer las cuatro claves \u2193")}</a></p>
    <div className="science-reading-notes" id="science-reading-notes">{__site.t(readingFields.map(field => <details key={field.id}><summary>{__site.t(field.label)}<span aria-hidden="true">{__site.t("+")}</span></summary><p>{__site.t(field.explanation)}</p></details>))}</div>
  </section>;
}
