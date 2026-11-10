'use client';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { businessLinks } from '@/lib/landing-content';
import { flowHref } from '@/lib/preview/policy';
import { Arrow } from './Arrow';
/** Accessible entry points outside the decorative, pointer-disabled film. */
export function HeroKitCta() {
    const __site = useSiteLanguage();
    const uploadHref = flowHref(businessLinks.signup, {plan: 'free', returnTo: businessLinks.upload, reportId: null, invalidPlan: false});
    return <div className="hero-start" role="group" aria-label={__site.t("Elige cómo empezar con EVA")}>
      <a className="hero-kit-cta" href={__site.href(uploadHref)} title={__site.t("Empieza gratis con tus analíticas anteriores")}>
        <span className="hero-kit-copy"><strong className="hero-kit-title">{__site.t("Interpreta tus análisis previos")}</strong><span className="hero-kit-details">{__site.t("Empieza gratis")}</span></span>
        <Arrow />
      </a>
      <a className="hero-kit-secondary" href={__site.href(businessLinks.signup + '?plan=quarterly')} title={__site.t("Kit de 13 biomarcadores en casa · 99 € + IVA")}>
        <span>{__site.t("O pide tu primer kit")}</span>
        <small>{__site.t("13 biomarcadores")}<span aria-hidden="true"> · </span><span className="hero-kit-price">{__site.t("99 € + IVA")}</span></small>
      </a>
    </div>;
}
