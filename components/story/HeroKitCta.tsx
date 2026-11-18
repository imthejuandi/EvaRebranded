'use client';
import {uploadAllowance} from '@/lib/site-content/upload-allowance';
import {starterSubscription} from '@/lib/site-content/starter-subscription';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { businessLinks } from '@/lib/landing-content';
import { flowHref } from '@/lib/preview/policy';
import {useId} from 'react';
/** Accessible entry points outside the decorative, pointer-disabled film. */
export function HeroKitCta() {
    const __site = useSiteLanguage();
    const kit = starterSubscription[__site.locale];
    const termsId = useId();
    const kitLabel = __site.locale === 'es' ? 'Suscríbete al kit' : 'Subscribe to the kit';
    const uploadHref = flowHref(businessLinks.signup, {plan: 'free', returnTo: businessLinks.upload, reportId: null, invalidPlan: false});
    return <div className="hero-start" role="group" aria-label={__site.t("Elige cómo empezar con EVA")}>
      <a className="hero-kit-cta" href={__site.href(uploadHref)} aria-describedby={`${termsId}-free`}>
        {__site.t("Empieza gratis")}
      </a>
      <a className="hero-kit-secondary" href={__site.href(businessLinks.signup + '?plan=quarterly')} aria-describedby={`${termsId}-kit`}>
        {kitLabel}
      </a>
      <p className="hero-start-terms">
        <span id={`${termsId}-free`}>{uploadAllowance[__site.locale].freeShort}</span>
        {' · '}
        <span id={`${termsId}-kit`}>{kit.scope} · {kit.price} {kit.frequency}. {kit.cancelAnytime}</span>
      </p>
    </div>;
}
