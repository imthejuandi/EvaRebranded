'use client';

import {useEffect, useMemo, useRef, useState} from 'react';
import {useSiteLanguage} from './SiteLanguage';
import {EvaWordmark} from '@/components/story/EvaWordmark';
import {TassoFilmProcess, TassoFilmSummary} from '@/components/story/TassoFilmProcess';
import {TassoFilmTranscript} from '@/components/story/TassoFilmTranscript';
import {createStoryScrollDriver} from '@/lib/story-scroll-driver';
import {tassoHomeCopy} from '@/lib/site-content/tasso-home-copy';
import './tasso-scroll-review.css';

type Variant = 'clean' | 'labelled';
const stops = [.16, .51, .72] as const;

function ReviewArrow() {
  return <svg className="tasso-review-arrow" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" focusable="false"><path d="M3 13 13 3M4 3h9v9"/></svg>;
}

export function TassoScrollReview({initialVariant = 'clean'}: {initialVariant?: Variant}) {
  const {locale, href} = useSiteLanguage();
  const copy = tassoHomeCopy[locale];
  const [variant, setVariant] = useState<Variant>(initialVariant);
  const [calm, setCalm] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const driver = useMemo(() => createStoryScrollDriver(280), []);

  useEffect(() => {
    const read = () => setVariant(new URLSearchParams(location.search).get('version') === 'labelled' ? 'labelled' : 'clean');
    read();
    window.addEventListener('popstate', read);
    return () => window.removeEventListener('popstate', read);
  }, []);

  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setCalm(media.matches);
    update();
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (calm || !section.current || !stage.current) return;
    let raf = 0, top = 0, span = 1, previousStep = -1;
    const update = () => {
      raf = 0;
      if (document.hidden || !section.current) return;
      const p = Math.max(0, Math.min(1, (window.scrollY - top) / span));
      driver.setFrame(280 + p * 185);
      section.current.dataset.scrollProgress = p.toFixed(5);
      const next = p < .35 ? 0 : p < .67 ? 1 : 2;
      if (next !== previousStep) {previousStep = next; setActiveStep(next);}
    };
    const schedule = () => {if (!raf) raf = requestAnimationFrame(update);};
    const measure = () => {
      if (!section.current || !stage.current) return;
      top = section.current.getBoundingClientRect().top + window.scrollY;
      span = Math.max(1, section.current.offsetHeight - stage.current.clientHeight);
      schedule();
    };
    const observer = new ResizeObserver(measure);
    observer.observe(section.current); observer.observe(stage.current);
    window.addEventListener('scroll', schedule, {passive: true});
    document.addEventListener('visibilitychange', schedule);
    measure();
    return () => {observer.disconnect(); cancelAnimationFrame(raf); window.removeEventListener('scroll', schedule); document.removeEventListener('visibilitychange', schedule);};
  }, [calm, driver]);

  const choose = (next: Variant) => {
    setVariant(next);
    const url = new URL(window.location.href);
    url.searchParams.set('version', next);
    history.replaceState(null, '', url.pathname + url.search + url.hash);
  };
  const jump = (index: number) => {
    if (!section.current || !stage.current) return;
    window.scrollTo({top: section.current.getBoundingClientRect().top + window.scrollY
      + (section.current.offsetHeight - stage.current.clientHeight) * stops[index], behavior: 'instant'});
  };
  const other = locale === 'en' ? 'es' : 'en';

  return <main className="tasso-scroll-review" data-review-variant={variant}>
    <header className="tasso-review-header">
      <EvaWordmark/>
      <div className="tasso-review-treatments" role="group" aria-label={locale === 'en' ? 'Caption treatment' : 'Versión de los textos'}>
        <button type="button" aria-pressed={variant === 'clean'} onClick={() => choose('clean')}>{locale === 'en' ? 'Clean' : 'Minimal'}</button>
        <button type="button" aria-pressed={variant === 'labelled'} onClick={() => choose('labelled')}>{locale === 'en' ? 'Original labels' : 'Rótulos originales'}</button>
      </div>
      <div className="tasso-review-links"><a href={`/${other}/review/tasso-scroll?version=${variant}`} hrefLang={other}>{other.toUpperCase()}</a><a className="tasso-review-home" href={href('/')}>{locale === 'en' ? 'Homepage' : 'Inicio'}<ReviewArrow/></a></div>
    </header>
    {calm ? <div className="tasso-review-calm"><TassoFilmSummary/></div> : <>
      <section ref={section} className="tasso-review-journey" aria-label={copy.kicker}>
        <div ref={stage} className="tasso-review-stage">
          <div className="tasso-review-film" aria-hidden="true"><TassoFilmProcess frame={280} scrollDriver={driver} variant={variant}/></div>
          <nav className="tasso-review-step-nav" aria-label={locale === 'en' ? 'Explore the three steps' : 'Explora los tres pasos'}>
            {copy.steps.map((step, index) => <button type="button" key={step.id} aria-current={activeStep === index ? 'step' : undefined} onClick={() => jump(index)}><span>{String(index + 1).padStart(2, '0')}</span>{step.short}</button>)}
          </nav>
        </div>
        <div className="sr-only"><TassoFilmTranscript/></div>
      </section>
      <div className="tasso-review-after"><p>{locale === 'en' ? 'One small step. A clearer picture of you.' : 'Un pequeño gesto. Una visión más clara de ti.'}</p><a href={href('/')}>{locale === 'en' ? 'See it on the homepage' : 'Verlo en la página de inicio'}<ReviewArrow/></a></div>
    </>}
  </main>;
}
