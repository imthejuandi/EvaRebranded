'use client';
import {starterSubscription} from '@/lib/site-content/starter-subscription';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { businessLinks } from '@/lib/landing-content';
import { flowHref } from '@/lib/preview/policy';
/** Accessible entry points outside the decorative, pointer-disabled film. */
export function HeroKitCta() {
    const __site = useSiteLanguage();
    const kit = starterSubscription[__site.locale];
    const uploadLabel = __site.locale === 'es' ? 'Sube tus analíticas anteriores' : 'Upload your previous labs';
    const quarterLabel = __site.locale === 'es' ? 'trimestre' : 'quarter';
    const uploadHref = flowHref(businessLinks.signup, {plan: 'free', returnTo: businessLinks.upload, reportId: null, invalidPlan: false});
    return <div className="hero-start" role="group" aria-label={__site.t("Elige cómo empezar con EVA")}>
      <a className="hero-kit-cta" href={__site.href(uploadHref)}>
        <span className="hero-action-label">{__site.t('Empieza gratis')}</span>{' '}
        <span className="hero-action-detail">{uploadLabel}</span>
      </a>
      <a className="hero-kit-secondary" href={__site.href(businessLinks.signup + '?plan=quarterly')}>
        <span className="hero-action-label">{kit.kitAction}</span>{' '}
        <span className="hero-action-detail hero-kit-detail">
          <span>{kit.scope}</span>{' '}
          <span>{kit.price} / {quarterLabel}</span>{' '}
          <span>{kit.cancelAnytime}</span>
        </span>
      </a>
    </div>;
}
