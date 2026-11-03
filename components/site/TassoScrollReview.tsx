'use client';

import {useEffect, useState} from 'react';
import {useSiteLanguage} from './SiteLanguage';
import {EvaWordmark} from '@/components/story/EvaWordmark';
import {TassoFilmSummary} from '@/components/story/TassoFilmProcess';
import {TassoVideoProcess} from '@/components/story/TassoVideoProcess';
import './tasso-scroll-review.css';

type Variant = 'clean' | 'labelled';
function ReviewArrow() {
  return <svg className="tasso-review-arrow" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true" focusable="false"><path d="M3 13 13 3M4 3h9v9"/></svg>;
}

export function TassoScrollReview({initialVariant = 'clean'}: {initialVariant?: Variant}) {
  const {locale, href} = useSiteLanguage();
  const [variant, setVariant] = useState<Variant>(initialVariant);
  const [calm, setCalm] = useState(false);
  useEffect(() => {
    const read = () => setVariant(new URLSearchParams(location.search).get('version') === 'labelled' ? 'labelled' : 'clean');
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const motion = () => setCalm(media.matches);
    read(); motion();
    window.addEventListener('popstate', read);
    media.addEventListener('change', motion);
    return () => {window.removeEventListener('popstate', read); media.removeEventListener('change', motion);};
  }, []);
  const choose = (next: Variant) => {
    setVariant(next);
    const url = new URL(window.location.href);
    url.searchParams.set('version', next);
    history.replaceState(null, '', url.pathname + url.search + url.hash);
  };
  const other = locale === 'en' ? 'es' : 'en';
  return <main className="tasso-scroll-review tasso-playback-review" data-review-variant={variant}>
    <header className="tasso-review-header">
      <EvaWordmark/>
      <div className="tasso-review-treatments" role="group" aria-label={locale === 'en' ? 'Caption treatment' : 'Versión de los textos'}>
        <button type="button" aria-pressed={variant === 'clean'} onClick={() => choose('clean')}>{locale === 'en' ? 'Clean' : 'Minimal'}</button>
        <button type="button" aria-pressed={variant === 'labelled'} onClick={() => choose('labelled')}>{locale === 'en' ? 'Original labels' : 'Rótulos originales'}</button>
      </div>
      <div className="tasso-review-links"><a href={`/${other}/review/tasso-scroll?version=${variant}`} hrefLang={other}>{other.toUpperCase()}</a><a className="tasso-review-home" href={href('/')}>{locale === 'en' ? 'Homepage' : 'Inicio'}<ReviewArrow/></a></div>
    </header>
    {calm ? <div className="tasso-review-calm"><TassoFilmSummary/></div> : <div className="tasso-review-stage"><TassoVideoProcess variant={variant}/></div>}
    <div className="tasso-review-after"><p>{locale === 'en' ? 'One small step. A clearer picture of you.' : 'Un pequeño gesto. Una visión más clara de ti.'}</p><a href={href('/')}>{locale === 'en' ? 'See it on the homepage' : 'Verlo en la página de inicio'}<ReviewArrow/></a></div>
  </main>;
}
