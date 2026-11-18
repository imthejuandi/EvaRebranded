'use client';
import {uploadAllowance} from '@/lib/site-content/upload-allowance';
import {starterSubscription} from '@/lib/site-content/starter-subscription';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { businessLinks } from '@/lib/landing-content';
import { flowHref } from '@/lib/preview/policy';
import { Arrow } from './Arrow';
/** Accessible entry points outside the decorative, pointer-disabled film. */
export function HeroKitCta() {
    const __site = useSiteLanguage();
    const kit = starterSubscription[__site.locale];
    const uploadHref = flowHref(businessLinks.signup, {plan: 'free', returnTo: businessLinks.upload, reportId: null, invalidPlan: false});
    return <div className="hero-start" role="group" aria-label={__site.t("Elige cómo empezar con EVA")}>
      <a className="hero-kit-cta" href={__site.href(uploadHref)} title={uploadAllowance[__site.locale].free}>
        <span className="hero-kit-copy"><strong className="hero-kit-title">{__site.t("Interpreta tus análisis previos")}</strong><span className="hero-kit-details">{uploadAllowance[__site.locale].freeShort}</span></span>
        <Arrow />
      </a>
      <a className="hero-kit-secondary" href={__site.href(businessLinks.signup + '?plan=quarterly')}>
        <span>{kit.kitAction}</span>
        <small>{kit.scope}<br/><span className="hero-kit-price">{kit.price}</span> {kit.frequency}<br/>{kit.cancelAnytime}</small>
      </a>
    </div>;
}
