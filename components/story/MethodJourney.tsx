'use client';
import {starterSubscription} from '@/lib/site-content/starter-subscription';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { businessLinks, methodSteps } from '@/lib/landing-content';
import { flowHref } from '@/lib/preview/policy';
import { MethodGraphs } from './MethodGraphs';
import { MethodPouchStill } from './MethodPouchStill';
// Retain the accepted home photograph and optical studies as illustrative material.
const chapters = ['Empieza', 'Entiende', 'Compara', 'Elige'];
const captions = [
    ['OPCIÓN DEL KIT', 'RECOGIDA EN CASA'],
    ['EJEMPLO DEL KIT', '13 BIOMARCADORES'],
    ['INFORME E HISTORIAL', 'AÑADE TU CONTEXTO'],
    ['TU PRÓXIMO ENFOQUE', 'ELIGE CON ORIENTACIÓN'],
];
function JourneyArrow({ back = false }: {
    back?: boolean;
}) {
    return <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true" focusable="false" style={back ? { transform: 'rotate(180deg)' } : undefined}><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.35"/></svg>;
}
function MethodArtwork({ step, calm }: {
    step: number;
    calm: boolean;
}) {
    const __site = useSiteLanguage();
    const stage = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false), [cycle, setCycle] = useState(0);
    useEffect(() => {
        const element = stage.current;
        if (!element)
            return;
        let intersects = false;
        const sync = () => setVisible(intersects && document.visibilityState === 'visible');
        const observer = new IntersectionObserver(([entry]) => { intersects = entry.isIntersecting; sync(); }, { threshold: .12 });
        observer.observe(element);
        document.addEventListener('visibilitychange', sync);
        return () => { observer.disconnect(); document.removeEventListener('visibilitychange', sync); };
    }, []);
    return <div ref={stage} className="method-new-art" data-method-artwork={step === 0 ? 'home-ritual' : ['', 'signal-strands', 'context-lens', 'history-trace'][step]}>
    <div className="method-art-window">
      {__site.t(step === 0 ? <MethodPouchStill calm={calm}/> : <MethodGraphs kind={step === 1 ? 'results' : step === 2 ? 'context' : 'evolution'} active visible={visible} calm={calm} cycle={cycle}/>)}
    </div>
    {__site.t(!calm && step !== 0 && <button className="method-replay" type="button" onClick={() => setCycle(value => value + 1)} aria-label={__site.t("Repetir la animaci\u00F3n de este paso")}>{__site.t("Ver de nuevo ")}<JourneyArrow /></button>)}
  </div>;
}
export function MethodJourney({ calm = false }: {
    calm?: boolean;
}) {
    const __site = useSiteLanguage();
    const [active, setActive] = useState(0);
    const [hasChanged, setHasChanged] = useState(false);
    const tabs = useRef<Array<HTMLButtonElement | null>>([]);
    const headings = useRef<Array<HTMLHeadingElement | null>>([]);
    const focusHeading = useRef(false);
    const uploadHref = flowHref(businessLinks.signup, {plan: 'free', returnTo: businessLinks.upload, reportId: null, invalidPlan: false});
    useEffect(() => {
        if (focusHeading.current) {
            focusHeading.current = false;
            headings.current[active]?.focus();
        }
    }, [active]);
    function selectStep(index: number, focus: 'tab' | 'heading' | false = false) {
        const next = Math.max(0, Math.min(methodSteps.length - 1, index));
        if (next !== active) {
            focusHeading.current = focus === 'heading';
            setHasChanged(true);
            setActive(next);
        }
        if (focus === 'tab')
            tabs.current[next]?.focus();
    }
    function handleKey(event: KeyboardEvent<HTMLButtonElement>, index: number) {
        let next: number;
        if (event.key === 'ArrowRight')
            next = (index + 1) % methodSteps.length;
        else if (event.key === 'ArrowLeft')
            next = (index + methodSteps.length - 1) % methodSteps.length;
        else if (event.key === 'Home')
            next = 0;
        else if (event.key === 'End')
            next = methodSteps.length - 1;
        else
            return;
        event.preventDefault();
        selectStep(next, 'tab');
    }
    return <section className={'method-journey' + (calm ? ' method-journey-calm' : '') + (hasChanged ? ' method-has-changed' : '')} id="el-metodo" aria-labelledby="routine-title">
    <div className="section-kicker"><span>{__site.t("EL MÉTODO")}</span><span>{__site.t("UN MOMENTO PARA TI.")}</span></div>
    <div className="method-heading">
      <h2 id="routine-title">{__site.t("Tus próximos pasos.")}<br /><em>{__site.t("A tu ritmo.")}</em></h2>
      <p>{__site.t("Empieza con una analítica previa o con tu primer kit. Entiende tus resultados y decide qué explorar después, con orientación.")}</p>
    </div>

    <div className="method-chapters" role="tablist" aria-label={__site.t("Los cuatro pasos de EVA")} aria-orientation="horizontal">
      {__site.t(methodSteps.map((step, index) => <button key={index} ref={node => { tabs.current[index] = node; }} id={`method-tab-${index}`} role="tab" type="button" aria-selected={active === index} aria-controls={`method-panel-${index}`} aria-label={__site.t(`Paso ${index + 1}, ${chapters[index]}: ${step.title}`)} tabIndex={active === index ? 0 : -1} onClick={() => selectStep(index)} onKeyDown={event => handleKey(event, index)}><span className="method-chapter-index">{__site.t("0")}{__site.t(index + 1)}</span><span>{__site.t(chapters[index])}</span><i aria-hidden="true"/></button>))}
    </div>

    {__site.t(methodSteps.map((step, index) => <div key={index} className="method-panel" id={`method-panel-${index}`} role="tabpanel" aria-labelledby={`method-tab-${index}`} hidden={active !== index} tabIndex={0}>
        <div className="method-page-number" aria-hidden="true"><span className="method-ordinal">{__site.t("0")}{__site.t(index + 1)}</span><span>{__site.t("/ 04")}</span></div>
        <div className="method-chapter-body"><h3 ref={node => { headings.current[index] = node; }} tabIndex={-1}>{__site.t(step.title)}</h3><p>{__site.t(step.copy)}</p>
          {index === 0 && <div className="method-entry-actions">
            <a href={__site.href(uploadHref)} data-method-upload>{__site.t("Interpretar mis analíticas gratis")}<JourneyArrow/></a>
            <a href={__site.href(businessLinks.signup + '?plan=quarterly')} data-method-kit><span>{starterSubscription[__site.locale].kitAction}<small>{starterSubscription[__site.locale].summary} {starterSubscription[__site.locale].cancelAnytime}</small></span><JourneyArrow/></a>
          </div>}
        </div>
      <figure className={`method-figure method-figure-${index}`}>
        <div className="method-figure-stage">{__site.t(active === index && <MethodArtwork step={index} calm={calm}/>)}</div>
        <figcaption><span>{__site.t(captions[index][0])}</span><span>{__site.t(captions[index][1])}</span></figcaption>
        <p className="method-illustration-note">{__site.t(index === 0 ? 'Escena editorial de la opción del kit.' : index === 2 ? 'Esquema ilustrativo, sin umbrales clínicos.' : 'Representación ilustrativa.')}</p>
      </figure>
        <div className="method-paging" role="group" aria-label={__site.t("Recorrer los pasos")}>
          <button type="button" aria-label={__site.t("Paso anterior")} disabled={index === 0} onClick={() => selectStep(index - 1, 'heading')}><JourneyArrow back/><span>{__site.t("Anterior")}</span></button>
          <button type="button" aria-label={__site.t("Siguiente paso")} disabled={index === methodSteps.length - 1} onClick={() => selectStep(index + 1, 'heading')}><span>{__site.t("Siguiente")}</span><JourneyArrow /></button>
        </div>
        <a className="method-detail-link" href={__site.href(businessLinks.method)}>{__site.t("As\u00ED funciona EVA ")}<JourneyArrow /></a>
    </div>))}
  </section>;
}
