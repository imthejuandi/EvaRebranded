'use client';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { businessLinks } from '@/lib/landing-content';
import { Arrow } from './Arrow';
/** A real link outside the decorative, pointer-disabled Remotion film. */
export function HeroKitCta() {
    const __site = useSiteLanguage();
    return <a className="hero-kit-cta" href={__site.href(businessLinks.signup + '?plan=quarterly')} title={__site.t("Suscripción trimestral · 99 €")}>
  <span className="hero-kit-copy"><strong className="hero-kit-title">{__site.t("Desbloquea tu salud")}</strong><span className="hero-kit-details"><span>{__site.t("pide tu primer kit")}</span><span className="hero-kit-price">{__site.t("99 € / trimestre")}</span></span></span>
  <Arrow />
 </a>;
}
