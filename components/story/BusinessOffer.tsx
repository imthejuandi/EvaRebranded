'use client';

import {starterSubscription} from '@/lib/site-content/starter-subscription';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {businessLinks} from '@/lib/landing-content';
import {flowHref} from '@/lib/preview/policy';
import {closingCopy} from '@/lib/site-content/closing-copy';
import {entryPreviewCopy} from '@/lib/site-content/entry-preview-copy';
import {Arrow} from './Arrow';

export function BusinessOffer() {
  const {locale, href} = useSiteLanguage();
  const c = closingCopy[locale].offer;
  const kit = starterSubscription[locale];
  const uploadHref = flowHref(businessLinks.signup, {plan: 'free', returnTo: businessLinks.upload, reportId: null, invalidPlan: false});

  return <section id="empezar" className="invitation full-offer" aria-labelledby="offer-title">
    <p className="eyebrow">{c.kicker}</p>
    <div className="offer-heading">
      <h2 id="offer-title">{c.heading[0]}<br/><em>{c.heading[1]}</em></h2>
      <p>{c.lead}</p>
      <div className="offer-report-entry" data-offer-free>
        <h3>{c.free.heading}</h3>
        <p id="free-report-details" className="offer-free-body">{c.free.body}</p>
        <p className="offer-free-body" data-free-score-qualification>{entryPreviewCopy[locale].score}</p>
        <a className="primary" href={href(uploadHref)} aria-describedby="free-report-details" data-offer-upload>{c.free.action}<Arrow/></a>
        <p className="offer-account-note">{c.free.note}</p>
      </div>
    </div>
    <div className="offer" data-offer-kit>
      <h3 className="offer-kit-heading">{c.kit.heading}</h3>
      <div className="offer-price" role="group" aria-label={kit.pricePerQuarter} data-offer-price>
        <span>99</span><div>€<small>{locale === 'en' ? '+ VAT' : '+ IVA'} {kit.frequency}</small></div>
      </div>
      <p>{c.kit.summary}</p>
      <ul>{c.kit.bullets.map(bullet => <li key={bullet}>{bullet}</li>)}</ul>
      <a className="text-link offer-kit-action" href={href(businessLinks.signup + '?plan=quarterly')} data-offer-kit-action>{c.kit.action}<Arrow/></a>
      <p className="offer-cancel-note">{kit.cancelAnytime}</p>
    </div>
    <section className="upload-offer offer-panel-details" id="other-panels" aria-labelledby="other-panels-title">
      <div><h3 id="other-panels-title">{entryPreviewCopy[locale].otherPanelsHeading}</h3><p>{c.details.body}</p></div>
      <p><a className="offer-other-panels-link" href={href(businessLinks.pricing + '?panel=enhanced#elegir-panel')} data-offer-details>{entryPreviewCopy[locale].otherPanels}</a></p>
    </section>
  </section>;
}
