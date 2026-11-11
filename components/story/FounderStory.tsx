'use client';

import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {businessLinks} from '@/lib/landing-content';
import {closingCopy} from '@/lib/site-content/closing-copy';

/** Preserve the attributed founder statement while connecting the closing chapters. */
export function FounderStory() {
  const {locale, href} = useSiteLanguage();
  const c = closingCopy[locale].founder;

  return <section className="manifesto full-founder" id="nuestra-historia" aria-labelledby="founder-title">
    <h2 className="eyebrow" id="founder-title">{c.kicker}</h2>
    <blockquote>{c.quote[0]}<em>{c.quote[1]}</em></blockquote>
    <div className="founder">
      <span>{c.name}<br/><small>{c.role}</small></span>
      <a className="text-link" href={href(businessLinks.about)}>{c.link}</a>
    </div>
  </section>;
}
