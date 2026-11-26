'use client';
import {PanelOfferUnderstanding} from './PanelOfferUnderstanding';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { useEffect, useState } from 'react';
import {starterSubscription} from '@/lib/site-content/starter-subscription';
import {uploadAllowance} from '@/lib/site-content/upload-allowance';
import {panelPreviewCopy, previewPanelFromQuery, previewPanelQuery} from '@/lib/site-content/panel-preview-copy';
import type {SiteLocale} from '@/lib/site-language';
import {kitInsightCopy} from '@/lib/site-content/kit-insight-copy';
import {sampleMarkers} from '@/lib/preview/fixtures';
import { EditorialReveal } from '@/components/engagement/EditorialReveal';
import ServiceCalendar, { type PlanId } from './ServiceCalendar';
import ServiceContents from './ServiceContents';
import { RhythmTheatre } from './RhythmTheatre';
type FAQCategory = 'pricing' | 'testing' | 'results' | 'data';
function pricingCopyFor(locale: SiteLocale) {
    const uploads = uploadAllowance[locale];
    return {
        eyebrow: 'PRECIOS / TRES FORMAS DE EMPEZAR',
        title: ['Elige cómo', 'quieres empezar.'],
        intro: panelPreviewCopy[locale].intro,
        selectLabel: panelPreviewCopy[locale].selectLabel,
        plans: panelPreviewCopy[locale].plans,
        rhythm: { title: 'Conocer. Comparar. Continuar.', description: 'Una lectura sitúa tu punto de partida. Las siguientes ayudan a observar tu evolución.', labels: ['Primera lectura', 'A los 3 meses', 'A los 6 meses', 'A los 9 meses'], previous: 'Lectura anterior', next: 'Siguiente lectura', unit: 'biomarcadores por lectura', control: 'Explora las cuatro lecturas de un año' },
        comparison: {
            eyebrow: '01 / TODO, LADO A LADO', title: 'El detalle también importa.', description: 'Compara el precio, la frecuencia y lo que incluye cada opción.',
            included: 'Incluido', unavailable: 'No incluido',
            groups: panelPreviewCopy[locale].groups,
            note: panelPreviewCopy[locale].comparisonNote,
        },
        process: { eyebrow: '02 / DE TU CASA A TUS RESULTADOS', title: panelPreviewCopy[locale].standardProcessTitle, steps: [
                { number: '01', title: 'Pide tu kit', body: 'Explora EVA Trimestral y consulta la disponibilidad de envío a tu dirección.', detail: 'ENVÍO INCLUIDO' },
                { number: '02', title: 'Recoge y devuelve', body: 'Recoge la muestra en casa siguiendo las instrucciones de Tasso+. Utiliza el sobre prepagado para enviarla al laboratorio.', detail: 'RECOGIDA EN CASA' },
                { number: '03', title: 'Lee con contexto', body: 'Consulta los valores, las unidades y la fecha de tu informe.', detail: 'ANÁLISIS EN LABORATORIO' },
            ], timing: 'Los plazos de envío y de análisis se confirmarán antes de contratar. Esta vista previa muestra el recorrido de la muestra.', link: 'Ver el método completo' },
        report: { title: ['Los números,', 'en su lugar.'], body: 'Tu informe reúne valores, unidades y contexto. Puedes volver a cada lectura para comparar lo que ha cambiado.', badge: 'INFORME DE EJEMPLO', labels: ['Biomarcador', 'Resultado', 'Lectura de ejemplo'], detail: panelPreviewCopy[locale].reportDetail, action: 'Explorar un informe de ejemplo' },
        specialty: { eyebrow: '05 / CUANDO QUIERAS PROFUNDIZAR', title: 'Una pregunta más concreta.', intro: 'Explora las áreas del catálogo de ejemplo y consulta la disponibilidad, el alcance y el precio de cada panel.', action: 'Solicitar presupuesto', items: [
                { id: 'hormonal', title: 'Hormonal', copy: 'Hormonas sexuales, cortisol y DHEA-S.' },
                { id: 'cardiovascular', title: 'Cardiovascular', copy: 'Subfracciones lipídicas, ApoB, Lp(a) y marcadores inflamatorios.' },
                { id: 'thyroid', title: 'Tiroideo', copy: 'TSH, T3 libre, T4 libre y anticuerpos tiroideos.' },
                { id: 'nutritional', title: 'Nutricional', copy: 'Vitaminas y minerales: B12, folato, hierro, zinc, magnesio y más.' },
                { id: 'inflammatory', title: 'Inflamatorio', copy: 'hs-CRP, IL-6, TNF-α y homocisteína.' },
                { id: 'hepatic', title: 'Hepático', copy: 'ALT, AST, GGT, bilirrubina y albúmina.' },
            ] },
        terms: { eyebrow: '06 / CON LAS CONDICIONES CLARAS', title: 'Tú decides cómo seguir.', items: [
                { title: panelPreviewCopy[locale].standardSubscriptionTitle, body: 'La suscripción se renueva cada tres meses. Puedes cancelarla en cualquier momento para detener las próximas renovaciones.', link: 'Leer las condiciones', href: '/es/legal/terms' },
                { title: 'Tus datos siguen siendo tuyos.', body: 'Puedes solicitar su exportación o eliminación. Consulta cómo se almacenan, quién los procesa y cómo ejercer tus derechos.', link: 'Cómo tratamos tus datos', href: '/es/legal/privacy' },
                { title: panelPreviewCopy[locale].standardTermsTitle, body: 'El precio incluye el análisis de los 13 biomarcadores, el kit de recogida en casa y los envíos de ida y vuelta.', link: 'Volver a comparar', href: '#comparar-planes' },
            ] },
        founder: { quote: 'EVA es el servicio que hubiera querido cuando empecé mi propio camino de salud preventiva: uno que no solo te entrega datos, sino que te enseña qué significan y qué hacer con ellos.', name: 'Juan Diego Lago', role: 'Fundador y CEO', action: 'La historia de EVA' },
        faq: { eyebrow: '07 / ANTES DE EMPEZAR', title: 'Tus preguntas, con espacio.', label: 'Categorías de preguntas frecuentes', categories: [{ id: 'pricing' as FAQCategory, label: 'Precios' }, { id: 'testing' as FAQCategory, label: 'Pruebas' }, { id: 'results' as FAQCategory, label: 'Resultados' }, { id: 'data' as FAQCategory, label: 'Datos y privacidad' }], items: [
                { category: 'pricing', question: '¿Por qué repetir la analítica?', answer: 'La primera lectura establece una referencia personal. El ejercicio reciente o una enfermedad pueden influir en algunos valores. Comparar muestras tomadas en condiciones similares ayuda a distinguir un cambio puntual de una tendencia. La frecuencia adecuada depende del marcador y de tu salud.' },
                { category: 'pricing', question: panelPreviewCopy[locale].standardFaqQuestion, answer: 'Cada trimestre recibes un kit Tasso+ para recoger la muestra en casa. Incluye el análisis de 13 biomarcadores, el envío de ida y vuelta y el informe con tus resultados.' },
                { category: 'pricing', question: panelPreviewCopy[locale].standardCancellationQuestion, answer: 'Puedes cancelar en cualquier momento para detener las próximas renovaciones trimestrales.' },
                { category: 'testing', question: '¿Cómo funciona el kit de recogida en casa?', answer: 'El dispositivo recoge una pequeña muestra de sangre capilar desde el brazo. La información original describe una micro-lanceta y un sistema de vacío, sin jeringa ni extracción venosa. Sigue siempre las instrucciones incluidas con tu dispositivo.' },
                { category: 'testing', question: '¿Cómo envío la muestra al laboratorio?', answer: 'Sigue las instrucciones de retorno incluidas en el kit. Allí encontrarás cómo preparar la muestra y entregarla al transportista.' },
                { category: 'testing', question: '¿Cómo interpreto un resultado señalado?', answer: 'Consulta el informe del laboratorio y sus intervalos de referencia junto a un profesional sanitario. Las etiquetas de esta demostración son ilustrativas. EVA ofrece información educativa y no sustituye el diagnóstico ni la atención de un profesional sanitario.' },
                { category: 'results', question: '¿Cuándo podré ver mis resultados?', answer: 'El plazo de análisis y su fecha de inicio se confirmarán antes de contratar. El recorrido de ejemplo distingue el envío, la recepción en laboratorio y la publicación del informe.' },
                { category: 'results', question: '¿Cuál es la diferencia entre el panel base y uno especializado?', answer: 'El kit inicial mide 13 biomarcadores. Los paneles especializados exploran otras preguntas, como la función tiroidea o los niveles hormonales. Su disponibilidad y precio se consultan por separado.' },
                { category: 'data', question: '¿Cómo puedo consultar o eliminar mis datos?', answer: 'En tu perfil puedes consultar las opciones de exportación y solicitar la eliminación de datos. La Política de Privacidad explica el procedimiento y quién participa en el tratamiento.' },
                { category: 'data', question: '¿Dónde se guardan mis datos?', answer: 'La Política de Privacidad describe almacenamiento en infraestructura de Supabase dentro de la Unión Europea, cifrado en reposo y en tránsito. También explica que determinados tratamientos con IA pueden implicar transferencias fuera del EEE con las garantías indicadas en esa política.' },
                { category: 'data', question: '¿Cuántos informes puedo subir?', answer: [uploads.free, uploads.subscribed, uploads.labYear].join(' ') },
            ] },
        closing: { eyebrow: 'TU SIGUIENTE PASO', title: 'Un primer paso que encaje contigo.', copy: 'Con una analítica que ya tienes o con tu primera lectura de EVA.', primary: 'Elegir EVA Trimestral', secondary: 'Subir una analítica', note: 'Vista previa del recorrido. No se realizan cargos ni reservas.' },
        ui: { choose: 'Ver este plan', comparison: 'Comparar las tres opciones', euro: 'euros', complete: 'Análisis completo', sampleReport: 'Ver ejemplo de informe', rangeNote: 'Ver condiciones del panel', markerGroup: 'Biomarcadores del panel trimestral', selectedQuarter: 'Lectura seleccionada', visualLabel: 'Ritmo de análisis según el plan seleccionado', previous: 'Anterior', next: 'Siguiente', reference: 'Lectura ilustrativa', inPlan: '13 biomarcadores', single: 'Una lectura', uploaded: 'Tus resultados' },
    };
}

export const pricingCopy = {es: pricingCopyFor('es'), en: pricingCopyFor('en')};

// These June fixture values also appear in the linked fictional report.
const reportKeys = ['hscrp', 'triglycerides', 'hdl', 'ldl', 'alt', 'creatinine'];
const reportRows = sampleMarkers.filter(marker => reportKeys.includes(marker.key));

function Arrow({ back = false }: {
    back?: boolean;
}) { const __site = useSiteLanguage(); return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={back ? { transform: 'rotate(180deg)' } : undefined}><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.3"/></svg>; }
export default function PricingPage() {
    const __site = useSiteLanguage();
    const c = pricingCopy[__site.locale];
    const subscription = starterSubscription[__site.locale];
    const panels = panelPreviewCopy[__site.locale];
    const [plan, setPlan] = useState<PlanId>('quarterly'), [quarter, setQuarter] = useState(0), [faqCategory, setFaqCategory] = useState<FAQCategory>('pricing'), [marker, setMarker] = useState(0);
    useEffect(() => {
        const syncPanel = () => {
            setPlan(previewPanelFromQuery(new URLSearchParams(window.location.search).get('panel')));
            setQuarter(0);
        };
        syncPanel();
        window.addEventListener('popstate', syncPanel);
        return () => window.removeEventListener('popstate', syncPanel);
    }, []);
    const choosePanel = (nextPlan: PlanId) => {
        setPlan(nextPlan);
        setQuarter(0);
        const url = new URL(window.location.href);
        url.searchParams.set('panel', previewPanelQuery(nextPlan));
        url.hash = 'elegir-panel';
        window.history.replaceState(window.history.state, '', url);
        window.dispatchEvent(new PopStateEvent('popstate'));
    };
    const current = c.plans.find(item => item.id === plan)!;
    const priceOf = (item: typeof current) => item.price === null ? panels.priceToConfirm : item.id === 'quarterly' ? subscription.price :
        new Intl.NumberFormat(__site.locale, {style: 'currency', currency: 'EUR', maximumFractionDigits: 0}).format(Number(item.price));
    const priceSummary = (item: typeof current) => item.price === null ? panels.priceToConfirm : item.id === 'quarterly' ? subscription.pricePerQuarter :
        [priceOf(item), __site.t(item.cadence)].join(' · ');
    const kit = kitInsightCopy[__site.locale];
    const markerGroup = kit.groups.find(group => group.markers.some(index => index === marker));
    const english = __site.locale === 'en';
    return <div className="page-pricing" data-selected-panel={previewPanelQuery(plan)}>
    <EditorialReveal as="section" className="pricing-hero eva-inner" aria-labelledby="pricing-title">
      <div className="pricing-intro"><p className="eva-kicker">{panels.eyebrow}</p><h1 id="pricing-title" data-editorial-reveal>{__site.t(c.title.join(' '))}</h1><p>{c.intro}</p><a className="pricing-line-link pricing-free-entry" href={__site.href(c.plans[0].href)}>{c.plans[0].action}<Arrow /></a></div>
      <p className="pricing-preview-note">{panels.preview}</p>
      <div id="elegir-panel" className="pricing-plan-selector" role="group" tabIndex={-1} aria-label={__site.t(c.selectLabel)}>{__site.t(c.plans.filter(item => item.id !== 'free').map((item) => <button key={item.id} type="button" data-panel={previewPanelQuery(item.id)} aria-pressed={plan === item.id} onClick={() => choosePanel(item.id)}><span>{__site.t(item.label)}</span><span className="pricing-selector-price">{priceOf(item)}<small>{__site.t(item.cadence)}</small></span><span className="pricing-selector-dot" aria-hidden="true"/></button>))}</div>
      <EditorialReveal className="pricing-selected-plan" replayKey={plan}>
        <div className="pricing-plan-topline"><h2>{__site.t(current.name)}</h2></div>

        <p className={'pricing-selected-price' + (plan === 'quarterly' ? ' pricing-kit-price' : plan === 'enhanced' ? ' pricing-unconfirmed-price' : '')}><span>{priceOf(current)}</span><span>{__site.t(current.cadence)}</span></p>
        <p className="pricing-plan-summary" data-editorial-reveal>{__site.t(current.summary)}</p>
        <a className="pricing-action" href={__site.href(current.href)}>{__site.t(current.action)}<Arrow /></a><p className="pricing-plan-footnote">{plan === 'quarterly' ? subscription.cancelAnytime : __site.t(current.foot)}</p>
        <ul className="pricing-inclusions" data-editorial-reveal>{__site.t(current.includes.map(text => <li key={text}>{__site.t(text)}</li>))}</ul>
        <a className="pricing-line-link pricing-compare-link" href={__site.href("#comparar-planes")}>{panels.comparisonAction}<Arrow /></a>
      </EditorialReveal>
      <ServiceContents plan={plan}/>
    </EditorialReveal>

    <PanelOfferUnderstanding />
    {plan !== 'enhanced' && <RhythmTheatre plan={plan}/>}<section className="pricing-rhythm-section eva-inner" aria-labelledby="pricing-rhythm-heading"><div className="pricing-rhythm-copy"><p className="eva-kicker">{__site.t("A TU RITMO")}</p><h2 id="pricing-rhythm-heading">{plan === 'enhanced' ? panels.enhancedRhythmTitle : __site.t(c.rhythm.title)}</h2><p>{plan === 'enhanced' ? panels.enhancedRhythmBody : __site.t(c.rhythm.description)}</p></div>{plan === 'enhanced' ? <div className="service-calendar"><div className="service-inclusion-lens"><h3>{panels.plans[2].name}</h3><p>{panels.plans[2].summary}</p><p className="pricing-note">{panels.plans[2].foot}</p></div></div> : <ServiceCalendar key={plan} plan={plan} quarter={quarter} onQuarterChange={setQuarter} markers={kit.markers}/>} </section>

    <EditorialReveal as="section" className="pricing-section eva-inner" id="comparar-planes" aria-labelledby="pricing-comparison-heading"><div className="pricing-section-head"><p className="eva-kicker">{__site.t(c.comparison.eyebrow)}</p><div><h2 data-editorial-reveal id="pricing-comparison-heading">{__site.t(c.comparison.title)}</h2><p>{__site.t(c.comparison.description)}</p></div></div><p className="pricing-table-hint">{panels.tableHint}</p><div className="pricing-table-scroll" tabIndex={0} role="region" aria-label={panels.comparisonAction}><table className="pricing-comparison"><caption className="pricing-sr-only">{__site.t(c.comparison.title)}</caption><thead><tr><th scope="col"><span className="pricing-sr-only">{__site.t("Incluye")}</span></th>{__site.t(c.plans.map((item, i) => <th scope="col" key={item.id} className={c.plans[i].id === plan ? 'pricing-featured-col' : ''}>{__site.t(item.name)}<span>{priceSummary(item)}</span></th>))}</tr></thead>{__site.t(c.comparison.groups.map(group => <tbody key={group.title}><tr className="pricing-table-group"><th colSpan={c.plans.length + 1} scope="rowgroup">{__site.t(group.title)}</th></tr>{__site.t(group.rows.map(row => <tr key={row.label}><th scope="row">{__site.t(row.label)}</th>{__site.t(row.cells.map((cell, i) => <td key={i} className={c.plans[i].id === plan ? 'pricing-featured-col' : ''}>{__site.t(typeof cell === 'boolean' ? <><span aria-hidden="true" className={cell ? 'pricing-check' : 'pricing-dash'}>{__site.t(cell ? '✓' : '—')}</span><span className="pricing-sr-only">{__site.t(cell ? c.comparison.included : c.comparison.unavailable)}</span></> : cell)}</td>))}</tr>))}</tbody>))}</table></div><p className="pricing-note">{__site.t(c.comparison.note)}</p></EditorialReveal>

    <EditorialReveal as="section" className="pricing-section pricing-process eva-inner" aria-labelledby="pricing-process-heading"><div className="pricing-section-head"><p className="eva-kicker">{__site.t(c.process.eyebrow)}</p><h2 data-editorial-reveal id="pricing-process-heading">{__site.t(c.process.title)}</h2></div><ol>{__site.t(c.process.steps.map(step => <li key={step.number} data-editorial-reveal><span className="pricing-process-number">{__site.t(step.number)}</span><div><p className="eva-kicker">{__site.t(step.detail)}</p><h3>{__site.t(step.title)}</h3><p>{__site.t(step.body)}</p></div></li>))}</ol><div className="pricing-process-foot"><p className="pricing-note">{__site.t(c.process.timing)}</p><a className="pricing-line-link" href={__site.href("/es/how-it-works")}>{__site.t(c.process.link)}<Arrow /></a></div></EditorialReveal>

    <EditorialReveal as="section" className="pricing-report-section" aria-labelledby="pricing-report-heading">
      <div className="eva-inner pricing-report-layout">
        <div className="pricing-report-copy">
          <p className="eva-kicker">{english ? '03 / READING A RESULT' : '03 / CÓMO LEER UN RESULTADO'}</p>
          <h2 data-editorial-reveal id="pricing-report-heading">{__site.t(c.report.title[0])}<br /><em>{__site.t(c.report.title[1])}</em></h2>
          <p>{__site.t(c.report.body)}</p>
          <p className="pricing-note">{__site.t(c.report.detail)}</p>
          <a className="pricing-line-link" href={__site.href('/es/labs/demo-junio')}>{__site.t(c.report.action)}<Arrow /></a>
        </div>
        <div className="pricing-specimen">
          <div className="pricing-specimen-head">
            <span>{__site.t(c.report.badge)}</span>
            <span>{english ? '12 June 2026' : '12 de junio de 2026'}</span>
          </div>
          <table>
            <thead><tr>{c.report.labels.map(text => <th key={text} scope="col">{__site.t(text)}</th>)}</tr></thead>
            <tbody>{reportRows.map(row => <tr key={row.key}>
              <th scope="row">{__site.t(row.name)}</th>
              <td><strong>{row.value.toLocaleString(__site.locale)}</strong><span>{row.unit}</span></td>
              <td><span className="pricing-status-optimal">{__site.t('Ejemplo')}</span></td>
            </tr>)}</tbody>
          </table>
          <p className="pricing-note">{english ? 'Selected results from the fictional June report.' : 'Selección de resultados del informe ficticio de junio.'}</p>
        </div>
      </div>
    </EditorialReveal>

    <EditorialReveal as="section" className="pricing-section eva-inner" aria-labelledby="pricing-markers-heading">
      <div className="pricing-section-head">
        <p className="eva-kicker">04 / {panels.markers.eyebrow}</p>
        <div><h2 data-editorial-reveal id="pricing-markers-heading">{panels.markers.title}</h2><p>{kit.intro} {panels.markers.note}</p></div>
      </div>
      <div className="pricing-marker-layout">
        <div className="pricing-marker-list" role="group" aria-label={__site.t('Selecciona un biomarcador')}>
          {kit.markers.map((name, index) => <button key={name} type="button" aria-pressed={marker === index} onClick={() => setMarker(index)}>
            <span>{String(index + 1).padStart(2, '0')}</span>{name}<span aria-hidden="true">{marker === index ? '−' : '+'}</span>
          </button>)}
        </div>
        <div className="pricing-marker-reading" aria-live="polite">
          <div className="pricing-marker-lens" aria-hidden="true"><span /><span /><span /></div>
          <p className="eva-kicker">{markerGroup?.label}</p>
          <h3>{kit.markers[marker]}</h3>
          <p>{kit.meanings[marker]}</p>
        </div>
      </div>
    </EditorialReveal>

    <EditorialReveal as="section" className="pricing-specialty-section" aria-labelledby="pricing-specialty-heading"><div className="eva-inner"><div className="pricing-section-head"><p className="eva-kicker">{__site.t(c.specialty.eyebrow)}</p><div><h2 data-editorial-reveal id="pricing-specialty-heading">{__site.t(c.specialty.title)}</h2><p>{__site.t(c.specialty.intro)}</p></div></div><div className="pricing-specialty-list">{__site.t(c.specialty.items.map((item, i) => <article key={item.id}><span className="pricing-specialty-index">{__site.t("0")}{__site.t(i + 1)}</span><h3>{__site.t(item.title)}</h3><p>{__site.t(item.copy)}</p><a href={__site.href(`/es/contact?panel=${item.id}`)} aria-label={__site.t(`${c.specialty.action}: ${item.title}`)}>{__site.t(c.specialty.action)}<Arrow /></a></article>))}</div></div></EditorialReveal>

    <EditorialReveal as="section" className="pricing-section eva-inner" aria-labelledby="pricing-terms-heading"><div className="pricing-section-head"><p className="eva-kicker">{__site.t(c.terms.eyebrow)}</p><h2 data-editorial-reveal id="pricing-terms-heading">{__site.t(c.terms.title)}</h2></div><div className="pricing-promises">{__site.t(c.terms.items.map(item => <article key={item.title}><h3>{__site.t(item.title)}</h3><p>{__site.t(item.body)}</p><a className="pricing-line-link" href={__site.href(item.href)}>{__site.t(item.link)}<Arrow /></a></article>))}</div></EditorialReveal>

    <EditorialReveal as="figure" className="pricing-human-pause eva-inner"><div className="pricing-photo-window" data-editorial-photo><img src="/art/editorial/after-the-morning-1024.webp" srcSet="/art/editorial/after-the-morning-600.webp 600w, /art/editorial/after-the-morning-1024.webp 1024w" sizes="(max-width: 760px) 90vw, 60vw" width="1024" height="688" loading="lazy" alt={__site.t("Dos personas hacen una pausa en casa despu\u00E9s de entrenar, con un vaso de agua y una chaqueta sobre la silla.")}/></div><figcaption><span data-editorial-reveal>{__site.t("Un momento para ti.")}</span><p data-editorial-reveal>{__site.t("Entender tus resultados tambi\u00E9n tiene su lugar entre todo lo dem\u00E1s.")}</p></figcaption></EditorialReveal>

    <EditorialReveal as="section" className="pricing-section pricing-faq eva-inner" aria-labelledby="pricing-faq-heading"><div className="pricing-section-head"><p className="eva-kicker">{__site.t(c.faq.eyebrow)}</p><h2 data-editorial-reveal id="pricing-faq-heading">{__site.t(c.faq.title)}</h2></div><div className="pricing-faq-layout"><div className="pricing-faq-tabs" role="group" aria-label={__site.t(c.faq.label)}>{__site.t(c.faq.categories.map(cat => <button type="button" key={cat.id} aria-pressed={faqCategory === cat.id} onClick={() => setFaqCategory(cat.id)}>{__site.t(cat.label)}<span>{__site.t(String(c.faq.items.filter(item => item.category === cat.id).length).padStart(2, '0'))}</span></button>))}</div><div className="pricing-faq-items">{__site.t(c.faq.categories.map(cat => <div key={cat.id} hidden={faqCategory !== cat.id}>{__site.t(c.faq.items.filter(item => item.category === cat.id).map(item => <details key={item.question}><summary>{__site.t(item.question)}<span aria-hidden="true">{__site.t("+")}</span></summary><div><p>{__site.t(item.answer)}</p>{__site.t(cat.id === 'data' && <a href={__site.href("/es/legal/privacy")} className="pricing-line-link">{__site.t("Pol\u00EDtica de privacidad")}<Arrow /></a>)}</div></details>))}</div>))}</div></div></EditorialReveal>

    <EditorialReveal as="section" className="pricing-closing"><div className="eva-inner"><p className="eva-kicker">{__site.t(c.closing.eyebrow)}</p><h2>{__site.t(c.closing.title)}</h2><p>{__site.t(c.closing.copy)}</p><div className="pricing-closing-actions"><a className="pricing-action" href={__site.href(current.href)}>{__site.t(current.action)}<Arrow /></a><a className="pricing-line-link" href={__site.href("/es/labs/demo-junio")}>{__site.t("Explorar un informe de ejemplo")}<Arrow /></a></div><p className="pricing-note">{priceSummary(current)}. {plan === 'quarterly' && <>{subscription.cancelAnytime} </>}{__site.t(c.closing.note)}</p></div></EditorialReveal>
  </div>;
}
