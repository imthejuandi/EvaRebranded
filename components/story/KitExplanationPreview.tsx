'use client';

import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {explanationLevels, resultExplanationCopy} from '@/lib/site-content/result-explanation-copy';
import {Arrow} from './Arrow';
import './result-explanation.css';

/** A brief continuation of the amber index, linking to the full results demonstration. */
export function KitExplanationPreview() {
  const {locale} = useSiteLanguage();
  const c = resultExplanationCopy[locale];
  return <section className="kit-explanation-preview" id="kit-explanation-preview" aria-labelledby="kit-explanation-title">
    <div><h3 id="kit-explanation-title">{c.previewTitle[0]}<br/><em>{c.previewTitle[1]}</em></h3><p>{c.previewBody}</p></div>
    <div className="kit-explanation-action"><p>{explanationLevels.map((level, index) => <span key={level}>{index > 0 && <span aria-hidden="true"> · </span>}{c.levels[level]}</span>)}</p><a href="#alex-story" className="text-link"><span>{c.previewAction}</span><Arrow/></a></div>
  </section>;
}
