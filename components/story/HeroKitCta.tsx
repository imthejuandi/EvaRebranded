'use client';
import {starterSubscription} from '@/lib/site-content/starter-subscription';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { businessLinks } from '@/lib/landing-content';
import { flowHref } from '@/lib/preview/policy';
/** Accessible entry points outside the decorative, pointer-disabled film. */
export function HeroKitCta() {
    const __site = useSiteLanguage();
    const kit = starterSubscription[__site.locale];
    const uploadLabel = __site.locale === 'es' ? 'Sube analíticas' : 'Upload labs';
    const kitLabel = __site.locale === 'es' ? 'Suscripción trimestral' : 'Subscribe quarterly';
    const scopeLabel = kit.scope.replace('biomarcadores', 'marcadores').replace('biomarkers', 'markers');
    const uploadHref = flowHref(businessLinks.signup, {plan: 'free', returnTo: businessLinks.upload, reportId: null, invalidPlan: false});
    return <div className="hero-start" role="group" aria-label={__site.t("Elige cómo empezar con EVA")}>
      <a className="hero-kit-cta" href={__site.href(uploadHref)}>
        <span className="hero-action-label">{__site.t('Empieza gratis')}</span>{' '}
        <span className="hero-action-detail">{uploadLabel}</span>
      </a>
      <a className="hero-kit-secondary" href={__site.href(businessLinks.signup + '?plan=quarterly')}>
        <span className="hero-action-label">{kitLabel}</span>{' '}
        <span className="hero-action-detail hero-kit-detail"><span className="hero-kit-scope">{scopeLabel}</span><span className="hero-kit-separator"> · </span><span className="hero-kit-price">{kit.price}</span></span>
      </a>
    </div>;
}
