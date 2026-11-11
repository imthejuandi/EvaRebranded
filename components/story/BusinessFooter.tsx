'use client';

import {EvaWordmark} from '@/components/story/EvaWordmark';
import {businessLinks} from '@/lib/landing-content';
import {Switch} from '@/components/ui/switch';
import {LanguageSwitch, useSiteLanguage} from '@/components/site/SiteLanguage';
import {closingCopy} from '@/lib/site-content/closing-copy';

export function BusinessFooter({calm, onCalmChange}: {calm: boolean; onCalmChange: (value: boolean) => void}) {
  const {t, href, locale} = useSiteLanguage();
  const c = closingCopy[locale].footer;
  return <footer className="business-footer" id="site-footer" aria-label="EVA">
    <div className="footer-brand"><EvaWordmark/><p>{t('Conoce tu cuerpo.')}<br/>{t('Vive a tu ritmo.')}</p><a href={businessLinks.email}>hello@evahealth.es</a></div>
    <nav aria-label={t('Información de EVA')}><a href={href(businessLinks.method)}>{t('Cómo funciona')}</a><a href={href(businessLinks.science)}>{t('Ciencia')}</a><a href={href(businessLinks.pricing)}>{t('Precios')}</a><a href={href(businessLinks.about)}>{t('Nosotros')}</a><a href={href(businessLinks.blog)}>{t('Blog')}</a><a href={href('/es/contact')}>{t('Contacto')}</a><a href="/es/dashboard" hrefLang="es" data-footer-private>{c.privatePreview}</a><LanguageSwitch className="site-language-switch"/></nav>
    <nav aria-label={t('Información legal')}><a href={href(businessLinks.privacy)} hrefLang={locale}>{t('Política de privacidad')}</a><a href={href(businessLinks.terms)} hrefLang={locale}>{t('Términos del servicio')}</a><a href={href(businessLinks.cookies)} hrefLang={locale}>{t('Política de cookies')}</a></nav>
    <p className="site-language-note footer-private-note">{c.note}</p>
    <div className="footer-base"><p>Copyright 2026 EVA Health · Madrid</p><nav className="footer-design-links" aria-label={c.designLabel}><a href="/system" hrefLang="es">{t('El sistema')}</a><a href="/history" hrefLang="es">{t('Archivo')}</a></nav><div className="motion-choice"><label htmlFor="motion-mode">{t('Reducir movimiento')}</label><Switch id="motion-mode" aria-label={t('Reducir movimiento')} checked={calm} onCheckedChange={onCalmChange}/></div></div>
  </footer>;
}
