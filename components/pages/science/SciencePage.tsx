'use client';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { ActionLink, Note } from '@/components/site/Primitives';
import { categories, derivedMetrics } from './science-content';
import { sampleMarkers, createFixture, dateLabel, numberLabel } from '@/lib/preview/fixtures';
import DocumentReading from './DocumentReading';
export const scienceCopy = {
    es: {
        eyebrow: 'LA CIENCIA DE EVA',
        title: 'Entiende lo que estás mirando.',
        intro: 'Qué mide un biomarcador, cómo se presenta su resultado y qué información ayuda a leerlo.',
        lenses: [
            { id: 'measurement', label: 'Valor y unidad', question: '¿Qué se midió?', text: 'El nombre identifica el biomarcador. El valor y la unidad se leen juntos: la unidad indica cómo se expresa la medición.', detail: 'Antes de comparar dos resultados, revisa que correspondan al mismo biomarcador y que sus unidades sean compatibles.', caption: 'Valor y unidad forman una sola medición.' },
            { id: 'reference', label: 'Referencia', question: '¿Con qué se compara?', text: 'El intervalo de referencia acompaña al resultado en su informe de laboratorio. Para entenderlo, necesitas esa referencia concreta.', detail: 'Si el informe no incluye un intervalo, el dato queda sin referencia. No se completa con un objetivo supuesto ni se clasifica solo por su valor.', caption: 'La referencia procede del informe, no del aspecto del gráfico.' },
            { id: 'source', label: 'Fecha y fuente', question: '¿De cuándo es y de dónde viene?', text: 'La fecha de la muestra sitúa el resultado en el tiempo. El informe de origen permite volver al dato y revisar cómo se presentó.', detail: 'Una fecha ausente no se reemplaza con la de hoy. Si solo hay un resultado, aún no hay una evolución que mostrar.', caption: 'La fecha y el informe acompañan siempre al resultado.' },
        ],
    },
} as const;
const example = sampleMarkers.find(marker => marker.key === 'apob')!;
const comparisonReports = createFixture().reports.slice().sort((a, b) => a.date.localeCompare(b.date));
function ComparisonNotes() {
    const __site = useSiteLanguage();
    return <section className="science-comparison science-complete-comparison eva-inner" aria-labelledby="science-comparison-title">
    <div><p className="eva-kicker">{__site.t("EL TIEMPO TAMBI\u00C9N IMPORTA")}</p><h2 id="science-comparison-title">{__site.t("Dos fechas.")}<br />{__site.t("Dos registros completos.")}</h2><p className="science-body">{__site.t("La fecha no viaja sola: conserva tambi\u00E9n la unidad y el origen de cada resultado.")}</p><p className="science-body">{__site.t("Estos ejemplos tienen distintos tipos de origen. Los mostramos por separado, sin unirlos como una evoluci\u00F3n comparable.")}</p></div>
    <figure className="science-comparison-figure"><div className="science-document-pair">{__site.t(comparisonReports.map((report, index) => <a href={__site.href(`/es/labs/${report.id}`)} className="science-paper-record" key={report.id}><span>{__site.t("0")}{__site.t(index + 1)}{__site.t(" / DATOS FICTICIOS")}</span><h3>{__site.t(dateLabel(report.date))}</h3><p className="science-comparison-number">{__site.t(numberLabel(report.id === 'demo-marzo' ? example.history[1] : example.value))} <small>{__site.t(example.unit)}</small></p><dl><div><dt>{__site.t("Biomarcador")}</dt><dd>{__site.t(example.name)}</dd></div><div><dt>{__site.t("Tipo de origen")}</dt><dd>{__site.t(report.source === 'kit' ? 'Muestra del kit' : 'Analítica subida')}</dd></div><div><dt>{__site.t("Referencia")}</dt><dd>{__site.t("No incluida aqu\u00ED")}</dd></div></dl><span className="science-compare-open">{__site.t("Ver informe \u2197")}</span></a>))}</div><figcaption>{__site.t("Un cambio num\u00E9rico no explica su causa ni demuestra una mejora. Confirma tambi\u00E9n el laboratorio, el m\u00E9todo y las condiciones de cada muestra.")}</figcaption></figure>
  </section>;
}
function Catalogue() {
    const __site = useSiteLanguage();
    return <section id="catalogo" className="science-catalogue eva-inner" aria-labelledby="science-catalogue-title">
    <div className="science-section-heading"><div><p className="eva-kicker">{__site.t("EXPLORA LOS BIOMARCADORES")}</p><h2 id="science-catalogue-title">{__site.t("Un cuerpo.")}<br />{__site.t("Muchos puntos de vista.")}</h2></div><p className="science-body">{__site.t("Explora qu\u00E9 informaci\u00F3n re\u00FAne cada grupo de biomarcadores. Esta gu\u00EDa es educativa; la lista de cada plan se consulta por separado.")}</p></div>
    <div className="science-category-list">{__site.t(categories.map((category, index) => <details className="science-category" key={category.id}><summary><span className="science-category-index">{__site.t(String(index + 1).padStart(2, '0'))}</span><h3>{__site.t(category.name)}</h3><span className="science-category-count">{__site.t(category.markers.length)} <span>{__site.t("ejemplos")}</span></span><span className="science-details-mark" aria-hidden="true">{__site.t("+")}</span></summary><div className="science-category-content"><p>{__site.t("Biomarcadores y pruebas de este grupo")}</p><ul>{__site.t(category.markers.map(marker => <li key={marker}>{__site.t(marker)}</li>))}</ul></div></details>))}</div>
    <div className="science-catalogue-foot"><p>{__site.t("Algunas se\u00F1ales aparecen en m\u00E1s de un grupo. Los ejemplos no indican qu\u00E9 incluye un kit.")}</p><ActionLink href={__site.href("/es/pricing")} secondary>{__site.t("Consultar los planes")}</ActionLink></div>
  </section>;
}
function EvidenceNotes() {
    const __site = useSiteLanguage();
    return <section className="science-evidence eva-inner" aria-labelledby="science-evidence-title">
    <div className="science-section-heading"><div><p className="eva-kicker">{__site.t("DATOS, M\u00C9TODOS Y L\u00CDMITES")}</p><h2 id="science-evidence-title">{__site.t("Qu\u00E9 significa")}<br />{__site.t("una estimaci\u00F3n.")}</h2></div><p className="science-body">{__site.t("Un modelo re\u00FAne varios datos en una estimaci\u00F3n. Para entenderla, tambi\u00E9n necesitas conocer su m\u00E9todo y sus l\u00EDmites.")}</p></div>
    <ol className="science-model-process">
      <li><span className="science-model-symbol science-observed" aria-hidden="true"/><span className="science-step-index">{__site.t("01 / DATOS")}</span><h3>{__site.t("Lo que se ha medido")}</h3><p>{__site.t("Resultados con sus unidades, fechas y fuentes. La informaci\u00F3n ausente sigue marcada como ausente.")}</p></li>
      <li><span className="science-model-symbol science-derived-symbol" aria-hidden="true"/><span className="science-step-index">{__site.t("02 / M\u00C9TODO")}</span><h3>{__site.t("C\u00F3mo se relaciona")}</h3><p>{__site.t("Una f\u00F3rmula o modelo combina los datos seg\u00FAn unas reglas. Importan su versi\u00F3n y los datos para los que se estudi\u00F3.")}</p></li>
      <li><span className="science-model-symbol science-unavailable" aria-hidden="true"/><span className="science-step-index">{__site.t("03 / ESTIMACI\u00D3N")}</span><h3>{__site.t("Qu\u00E9 puede explicar")}</h3><p>{__site.t("El resultado necesita una explicaci\u00F3n de su alcance. Si faltan datos necesarios, no se completa con una cifra inventada.")}</p></li>
    </ol>
    <details className="science-evidence-detail"><summary>{__site.t("Qu\u00E9 revisar antes de interpretar un modelo ")}<span aria-hidden="true">{__site.t("+")}</span></summary><div><p>{__site.t("Qu\u00E9 intenta estimar, qu\u00E9 datos necesita, c\u00F3mo trata los datos ausentes y en qu\u00E9 poblaci\u00F3n se ha evaluado.")}</p><p>{__site.t("Una estimaci\u00F3n no equivale a una medici\u00F3n directa. La evidencia de un m\u00E9todo y la evaluaci\u00F3n de una implementaci\u00F3n concreta son preguntas distintas.")}</p></div></details>
    <div className="science-derived-layout"><div><h3>{__site.t("Cuando se relacionan")}<br />{__site.t("varios resultados.")}</h3><p className="science-body">{__site.t("Las m\u00E9tricas derivadas combinan mediciones. No son pruebas adicionales y no todas se calculan con los mismos datos.")}</p><Note>{__site.t("Aqu\u00ED puedes conocer sus nombres y prop\u00F3sito. No calculamos resultados personales ni mostramos objetivos cl\u00EDnicos.")}</Note></div><div className="science-metrics">{__site.t(derivedMetrics.map(metric => <details key={metric.name}><summary>{__site.t(metric.name)}<span aria-hidden="true">{__site.t("+")}</span></summary><p>{__site.t(metric.description)}</p></details>))}</div></div>
    <div className="science-evidence-links"><ActionLink href={__site.href("/es/metodologia")} secondary>{__site.t("Consultar la metodolog\u00EDa")}</ActionLink><a className="science-text-link" href={__site.href("/es/metodologia/completa")}>{__site.t("Leer el documento completo ")}<span aria-hidden="true">{__site.t("\u2197")}</span></a></div>
  </section>;
}
export default function SciencePage() {
    const __site = useSiteLanguage();
    return <div className="page-science">
    <DocumentReading />
    <nav className="science-chapter-nav eva-inner" aria-label={__site.t("En esta p\u00E1gina")}><a href={__site.href("#catalogo")}>{__site.t("Biomarcadores ")}<span aria-hidden="true">{__site.t("\u2193")}</span></a><a href={__site.href("#science-evidence-title")}>{__site.t("M\u00E9todos y l\u00EDmites ")}<span aria-hidden="true">{__site.t("\u2193")}</span></a><a href={__site.href("/es/how-it-works")}>{__site.t("C\u00F3mo funciona EVA ")}<span aria-hidden="true">{__site.t("\u2197")}</span></a></nav>
    <ComparisonNotes />
    <Catalogue />
    <EvidenceNotes />
    <section className="science-context eva-inner" aria-labelledby="science-context-title"><p className="eva-kicker">{__site.t("ENTRE DOS MUESTRAS")}</p><div><h2 id="science-context-title">{__site.t("Tambi\u00E9n cuenta")}<br />{__site.t("lo que pasa entre ellas.")}</h2><div><p className="science-body">{__site.t("El descanso, la actividad y las condiciones de recogida pueden aportar informaci\u00F3n para conversar sobre tus resultados.")}</p><p className="science-body">{__site.t("Los registros de un dispositivo y los resultados de laboratorio son fuentes distintas. Verlos juntos no demuestra que una se\u00F1al cause otra.")}</p><p className="science-context-note">{__site.t("La demostraci\u00F3n de EVA permite explorar este contexto; no representa una conexi\u00F3n activa con tus dispositivos.")}</p></div></div></section>
    <section className="science-close" aria-labelledby="science-close-title"><div className="eva-inner"><p className="eva-kicker">{__site.t("DE LA EXPLICACI\u00D3N AL INFORME")}</p><h2 id="science-close-title">{__site.t("Saber m\u00E1s puede empezar")}<br />{__site.t("con una buena pregunta.")}</h2><p>{__site.t("Conoce c\u00F3mo se organiza un informe de EVA.")}</p><ActionLink href={__site.href("/es/labs/demo-junio")}>{__site.t("Ver un informe de ejemplo")}</ActionLink></div></section>
  </div>;
}
