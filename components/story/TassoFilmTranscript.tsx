'use client';

import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {tassoHomeCopy} from '@/lib/site-content/tasso-home-copy';

/** The film's full explanation remains available outside its visual-only canvas. */
export function TassoFilmTranscript() {
  const {locale} = useSiteLanguage();
  const copy = tassoHomeCopy[locale];
  return <section aria-label={copy.kicker}>
    <h2>{copy.heading.join(' ')}</h2>
    <ol>{copy.steps.map(step => <li key={step.id}><h3>{step.title}</h3><p>{step.long}</p></li>)}</ol>
    <p>{copy.instructions}</p>
  </section>;
}
