'use client';

import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {panelPreviewCopy} from '@/lib/site-content/panel-preview-copy';
import {starterSubscription} from '@/lib/site-content/starter-subscription';
import {uploadAllowance} from '@/lib/site-content/upload-allowance';

/** Keeps pricing’s established editorial layout with the current panel facts. */
export function PanelOfferUnderstanding() {
  const {locale, href} = useSiteLanguage();
  const c = panelPreviewCopy[locale];
  const kit = starterSubscription[locale];
  const standard = c.plans[1], enhanced = c.plans[2], full = c.plans[3];
  return <section id="el-alcance-de-eva" className="restored-chapter" aria-labelledby="el-alcance-de-eva-title"><div className="restored-inner">
    <p className="restored-kicker">{c.offer.kicker}</p><h2 id="el-alcance-de-eva-title">{c.offer.title}</h2>
    <div className="restored-three restored-plan-details">
      <article><span>{kit.price} <small>{kit.frequency}</small></span><h3>{standard.name}</h3><p>{c.offer.standardBody} {uploadAllowance[locale].subscribed}</p><p>{kit.rationale} {kit.cancelAnytime}</p><a className="restored-link" href="#pricing-markers-heading">{c.offer.markerAction}</a></article>
      <article id="panel-enhanced-details"><span>{c.priceToConfirm}</span><h3>{enhanced.name}</h3><p>{enhanced.summary}</p><p>{enhanced.includes[2]} {enhanced.foot}</p></article>
      <article><span>€499</span><h3>{full.name}</h3><p>{full.summary}</p><p>{full.includes[2]} {uploadAllowance[locale].labYear}</p></article>
    </div>
    <div className="restored-essay"><h3>{c.offer.freeTitle}</h3><div><p>{c.offer.freeBody}</p><a className="restored-link" href={href(c.plans[0].href)}>{c.plans[0].action}</a></div></div>
    <div className="restored-essay"><h3>{c.offer.timingTitle}</h3><div><p>{c.offer.timing}</p><a className="restored-link" href={href('/es/legal/terms')}>{c.offer.termsAction}</a></div></div>
  </div></section>;
}
