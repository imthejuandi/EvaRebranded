'use client';
import {entryPreviewCopy} from '@/lib/site-content/entry-preview-copy';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { businessLinks } from '@/lib/landing-content';
import { flowHref } from '@/lib/preview/policy';
/** Accessible entry points outside the decorative, pointer-disabled film. */
export function HeroKitCta() {
    const __site = useSiteLanguage();
    const c = entryPreviewCopy[__site.locale];
    const uploadHref = flowHref(businessLinks.signup, {plan: 'free', returnTo: businessLinks.upload, reportId: null, invalidPlan: false});
    return <div className="hero-entry-actions">
      <p className="hero-entry-summary" data-entry-summary>{c.hero}</p>
      <div className="hero-start" role="group" aria-label={__site.t("Elige cómo empezar con EVA")}>
      <a className="hero-kit-cta" href={__site.href(uploadHref)} data-entry-free>
        <span className="hero-action-label">{c.free}</span>{' '}
        <span className="hero-action-detail">{c.freeDetail}</span>
      </a>
      <a className="hero-kit-secondary" href={__site.href(businessLinks.signup + '?plan=quarterly')} aria-label={c.buyAccessible} data-entry-buy>
        <span className="hero-action-label">{c.buy}</span>{' '}
        <span className="hero-action-detail">{c.buyDetail}</span>
      </a>
      </div>
    </div>;
}
