'use client';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { useState } from 'react';
import { ArrowUpRight, ArrowRight, ArrowDown, FileText } from 'lucide-react';
import { ActionLink } from '@/components/site/Primitives';
import SampleToRecord, { ResultCapsule } from './SampleToRecord';
export const methodCopy = { es: {
        eyebrow: 'Cómo funciona',
        title: 'Una muestra. Toda una historia.',
        intro: 'Recogida de muestra en casa, análisis en laboratorio y tus resultados en un mismo lugar.',
        stageTitle: 'De tu casa a tus resultados.',
        stageIntro: 'Tú recoges la muestra. El laboratorio la analiza. EVA reúne los resultados para que puedas consultarlos.',
        stages: [
            { id: 'recogida', short: 'Recogida', place: 'En casa', title: 'Prepara tu muestra.', body: 'El kit incluye el dispositivo y sus instrucciones de recogida. Sigue las indicaciones del kit para cada paso.', detail: 'El dispositivo Tasso+ recoge la muestra. Esta ilustración explica el recorrido; las instrucciones de uso están en el kit.' },
            { id: 'envio', short: 'Envío', place: 'Camino al laboratorio', title: 'Tu muestra sigue su camino.', body: 'Prepara la muestra con el material de retorno y sigue las indicaciones de envío incluidas en el kit.', detail: 'La recogida de muestra en casa y el análisis en laboratorio son pasos distintos.' },
            { id: 'laboratorio', short: 'Laboratorio', place: 'Análisis de la muestra', title: 'Primero, una medición.', body: 'El laboratorio analiza la muestra y obtiene los valores de tus biomarcadores. Cada resultado tiene una unidad y un informe de origen.', detail: 'La fecha de la muestra, la unidad y el intervalo de referencia acompañan al resultado.' },
            { id: 'resultados', short: 'Resultados', place: 'En tu cuenta EVA', title: 'Ahora puedes consultarlo.', body: 'Abre tu informe, explora cada biomarcador y encuentra la información que ayuda a entenderlo.', detail: 'EVA ofrece información educativa. No sustituye un diagnóstico ni la valoración de un profesional de salud.' },
        ],
        reportTitle: 'Abre tu informe. Encuentra el detalle.',
        reportIntro: 'Pasa del conjunto a cada biomarcador y vuelve a su informe de origen.',
        views: [
            { id: 'informe', label: 'El informe', title: 'Todo empieza en un documento.', body: 'Los resultados conservan su fuente. La fecha de la muestra y el laboratorio de origen te ayudan a reconocer qué informe estás mirando.', cta: 'Explorar el informe de ejemplo', href: '/es/labs/demo-junio' },
            { id: 'biomarcador', label: 'El biomarcador', title: 'Un valor, junto a lo que lo explica.', body: 'Consulta la fecha, la unidad y el intervalo de referencia de cada resultado. Un valor fuera del intervalo no establece, por sí solo, un diagnóstico.', cta: 'Cómo entender un resultado', href: '/es/science' },
            { id: 'conversacion', label: 'La conversación', title: 'Haz espacio para tus preguntas.', body: 'Explora una conversación de ejemplo sobre tus resultados. EVA AI ofrece información educativa; no sustituye una consulta con un profesional de salud.', cta: 'Explorar EVA AI', href: '/es/eva-ai?report=demo-junio' },
        ],
        cadenceTitle: 'Vuelve a mirar con el tiempo.',
        cadenceBody: 'Las distintas fechas te ayudan a observar cambios. Un cambio, por sí solo, no explica su causa.',
        comparisons: [
            { label: 'Primera muestra', title: 'Un punto de partida.', body: 'Un primer informe registra un momento. Todavía no hay una serie con la que comparar.' },
            { label: 'Segunda muestra', title: 'Dos fechas, una comparación.', body: 'Antes de comparar valores, revisa que correspondan al mismo biomarcador y que sus unidades sean compatibles.' },
            { label: 'Tercera muestra', title: 'Más momentos para observar.', body: 'La fecha y las circunstancias de cada muestra ayudan a revisar las diferencias entre informes.' },
            { label: 'Cuarta muestra', title: 'Tu historial sigue abierto.', body: 'Los cambios no siguen una dirección obligatoria. Conserva cada informe y consulta tus dudas con un profesional de salud.' },
        ],
        finalTitle: 'Tus resultados también pueden ser el comienzo.',
        finalBody: 'Explora cómo reunir un informe que ya tienes. O elige un plan para empezar con una nueva recogida de muestra.',
        imageAlt: 'Una pausa después de nadar, entre luz cálida y sombras azules',
    } };
const copy = methodCopy.es;
function ReportExample() {
    const __site = useSiteLanguage();
    const [view, setView] = useState(0);
    const selected = copy.views[view];
    return <section className="method-report-section" aria-labelledby="method-report-heading">
    <div className="eva-inner">
      <div className="method-section-heading"><h2 id="method-report-heading">{__site.t(copy.reportTitle)}</h2><p>{__site.t(copy.reportIntro)}</p></div>
      <div className="method-report-layout">
        <div className="method-report-visual">
          <div className="method-example-label"><span>{__site.t("Ejemplo de organizaci\u00F3n")}</span><span>{__site.t("EVA / 001")}</span></div>
          {__site.t(view === 0 ? <div className="method-report-document"><FileText size={29} strokeWidth={1.1} aria-hidden="true"/><h3>{__site.t("Tu informe")}</h3><p>{__site.t("Fecha de la muestra \u00B7 Fuente")}</p><div className="method-document-columns"><span>{__site.t("Biomarcador")}</span><span>{__site.t("Resultado")}</span></div>{__site.t(['Valor y unidad', 'Intervalo de referencia', 'Informe de origen'].map((label, index) => <div className="method-document-row" key={label}><span>{__site.t("0")}{__site.t(index + 1)}</span><span>{__site.t(label)}</span><ArrowUpRight size={15} aria-hidden="true"/></div>))}<span className="method-document-foot">{__site.t("El documento al que siempre puedes volver.")}</span></div> : view === 1 ? <ResultCapsule /> : <div className="method-conversation"><p className="method-chat-question">{__site.t("\u00BFQu\u00E9 me cuenta un biomarcador?")}</p><div className="method-chat-answer"><span>{__site.t("EVA AI \u00B7 Ejemplo")}</span><p>{__site.t("Un valor es una pieza de informaci\u00F3n. Su unidad, la fecha de la muestra y el intervalo de referencia ayudan a entenderlo.")}</p><a href={__site.href("/es/labs/demo-junio")}><FileText size={16} aria-hidden="true"/>{__site.t("Ver un informe de ejemplo")}</a></div></div>)}
          <p className="method-figure-note">{__site.t("Esquema educativo. No muestra resultados personales.")}</p>
        </div>
        <div className="method-report-reading">
          <div className="method-report-tabs" role="group" aria-label={__site.t("Explorar el informe")}>{__site.t(copy.views.map((item, index) => <button type="button" key={item.id} onClick={() => setView(index)} aria-pressed={view === index}><span>{__site.t("0")}{__site.t(index + 1)}</span>{__site.t(item.label)}<ArrowRight size={16} aria-hidden="true"/></button>))}</div>
          <div className="method-view-copy" aria-live="polite"><h3>{__site.t(selected.title)}</h3><p>{__site.t(selected.body)}</p><a className="eva-text-link" href={__site.href(selected.href)}>{__site.t(selected.cta)}<ArrowUpRight size={17} aria-hidden="true"/></a></div>
          <a className="method-science-link" href={__site.href("/es/science")}>{__site.t("M\u00E1s sobre c\u00F3mo leer tus resultados")}<ArrowUpRight size={15} aria-hidden="true"/></a>
        </div>
      </div>
    </div>
  </section>;
}
function CompareOverTime() {
    const __site = useSiteLanguage();
    const [selected, setSelected] = useState(0);
    return <section className="eva-inner method-comparison" aria-labelledby="method-comparison-heading">
    <div className="method-comparison-heading"><h2 id="method-comparison-heading">{__site.t(copy.cadenceTitle)}</h2><p>{__site.t(copy.cadenceBody)}</p></div>
    <div className="method-time-ledger">
      <div className="method-time-controls" role="group" aria-label={__site.t("Momentos de un historial de ejemplo")}>{__site.t(copy.comparisons.map((item, index) => <button type="button" key={item.label} aria-pressed={selected === index} onClick={() => setSelected(index)}><span className="method-time-point" aria-hidden="true"/><span className="method-time-date">{__site.t("Fecha ")}{__site.t(index + 1)}</span><span>{__site.t(item.label)}</span></button>))}</div>
      <div className="method-time-detail" aria-live="polite"><span className="method-time-index">{__site.t("0")}{__site.t(selected + 1)}</span><div><h3>{__site.t(copy.comparisons[selected].title)}</h3><p>{__site.t(copy.comparisons[selected].body)}</p></div></div>
      <p className="method-figure-note">{__site.t("Secuencia ilustrativa. Cada punto representa una muestra; no una mejora ni una fecha programada.")}</p>
    </div>
  </section>;
}
export default function MethodPage() {
    const __site = useSiteLanguage();
    return <div className="page-method">
    <section className="eva-inner method-intro" aria-labelledby="method-heading">
      <div className="method-intro-copy"><p className="method-page-label">{__site.t(copy.eyebrow)}</p><h1 id="method-heading">{__site.t(copy.title)}</h1><p className="method-intro-description">{__site.t(copy.intro)}</p><div className="method-intro-actions"><a href={__site.href("#method-journey-heading")} className="eva-button">{__site.t("Ver el recorrido")}<ArrowDown size={17} aria-hidden="true"/></a><a href={__site.href("/es/pricing")} className="eva-text-link">{__site.t("Ver planes")}<ArrowUpRight size={17} aria-hidden="true"/></a></div></div>
      <figure className="method-opening-photo"><img src="/art/editorial/method-morning-table-1200.webp" srcSet="/art/editorial/method-morning-table-640.webp 640w, /art/editorial/method-morning-table-1200.webp 1200w" sizes="(max-width: 760px) 100vw, 62vw" width="1200" height="900" alt={__site.t("Un momento en casa, con una mesa preparada para hacer espacio al cuidado personal")} fetchPriority="high" decoding="async"/><figcaption><span>{__site.t("01 / EN TU D\u00CDA")}</span><span>{__site.t("El cuidado empieza aqu\u00ED.")}</span></figcaption></figure>
      <div className="method-intro-trail" aria-label={__site.t("Recogida, env\u00EDo, laboratorio, resultados")}><span>{__site.t("Una muestra.")}</span><span className="method-trail-line" aria-hidden="true"/><span>{__site.t("Un informe al que volver.")}</span></div>
    </section>
    <section className="eva-inner method-journey" aria-labelledby="method-journey-heading"><div className="method-section-heading"><h2 id="method-journey-heading">{__site.t(copy.stageTitle)}</h2><p>{__site.t(copy.stageIntro)}</p></div><SampleToRecord stages={copy.stages}/></section>
    <ReportExample />
    <CompareOverTime />
    <section className="eva-inner method-final" aria-labelledby="method-final-heading">
      <figure className="method-final-image"><img src="/art/editorial/after-swim-1200.webp" srcSet="/art/editorial/after-swim-600.webp 600w, /art/editorial/after-swim-1200.webp 1200w" sizes="(max-width: 760px) calc(100vw - 40px), 48vw" alt={__site.t(copy.imageAlt)} loading="lazy" decoding="async" width="1200" height="1607"/><figcaption>{__site.t("La vida sigue. T\u00FA tambi\u00E9n.")}</figcaption></figure>
      <div className="method-final-copy"><h2 id="method-final-heading">{__site.t(copy.finalTitle)}</h2><p>{__site.t(copy.finalBody)}</p><ActionLink href={__site.href("/es/upload")}>{__site.t("Explorar con un informe")}</ActionLink><a className="eva-text-link" href={__site.href("/es/pricing")}>{__site.t("Prefiero empezar con un kit")}<ArrowUpRight size={17} aria-hidden="true"/></a><a className="method-specialty-link" href={__site.href("/es/pricing#pricing-specialty-heading")}>{__site.t("Explorar perfiles especializados")}<ArrowUpRight size={15} aria-hidden="true"/></a></div>
    </section>
  </div>;
}
