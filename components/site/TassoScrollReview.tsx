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

export function TassoScrollReview({initialVariant = 'clean', edition = 'original'}: {initialVariant?: Variant; edition?: 'black' | 'original'}) {
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
  const route = edition === 'black' ? 'tasso-black' : 'tasso-scroll';
  const comparison = edition === 'black' ? 'tasso-scroll' : 'tasso-black';
  return <main className="tasso-scroll-review tasso-playback-review" data-review-variant={variant} data-review-edition={edition}>
    <header className="tasso-review-header">
      <EvaWordmark/>
      <div className="tasso-review-treatments" role="group" aria-label={locale === 'en' ? 'Caption treatment' : 'Versión de los textos'}>
        <button type="button" aria-pressed={variant === 'clean'} onClick={() => choose('clean')}>{locale === 'en' ? 'Clean' : 'Minimal'}</button>
        <button type="button" aria-pressed={variant === 'labelled'} onClick={() => choose('labelled')}>{locale === 'en' ? 'Original labels' : 'Rótulos originales'}</button>
      </div>
      <div className="tasso-review-links"><a href={`/${other}/review/${route}?version=${variant}`} hrefLang={other}>{other.toUpperCase()}</a><a className="tasso-review-home" href={href('/')}>{locale === 'en' ? 'Homepage' : 'Inicio'}<ReviewArrow/></a></div>
    </header>
    {calm ? <div className="tasso-review-calm"><TassoFilmSummary edition={edition}/></div> : <div className="tasso-review-stage"><TassoVideoProcess variant={variant} edition={edition}/></div>}
    <div className="tasso-review-after">{edition === 'black' ? <p className="tasso-review-look-note">{locale === 'en' ? 'Black-background look review. Editing joins at 0:09 and 0:18 still need refining.' : 'Prueba visual con fondo negro. Los empalmes de 0:09 y 0:18 aún necesitan ajustes.'}</p> : null}<p>{locale === 'en' ? 'One small step. A clearer picture of you.' : 'Un pequeño gesto. Una visión más clara de ti.'}</p><nav className="tasso-review-comparison" aria-label={locale === 'en' ? 'Compare film versions' : 'Compara las versiones'}><a href={`/${locale}/review/${comparison}?version=${variant}`}>{edition === 'black' ? (locale === 'en' ? 'Compare with the original' : 'Comparar con el original') : (locale === 'en' ? 'See the black studio option' : 'Ver la versión de estudio en negro')}<ReviewArrow/></a><a href={href('/')}>{locale === 'en' ? 'Homepage' : 'Inicio'}<ReviewArrow/></a></nav></div>
  </main>;
}
