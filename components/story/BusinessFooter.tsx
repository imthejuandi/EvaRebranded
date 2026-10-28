'use client';

import {EvaWordmark} from '@/components/story/EvaWordmark';
import {businessLinks} from '@/lib/landing-content';
import {Switch} from '@/components/ui/switch';
import {LanguageSwitch, useSiteLanguage} from '@/components/site/SiteLanguage';

export function BusinessFooter({calm, onCalmChange}: {calm: boolean; onCalmChange: (value: boolean) => void}) {
  const {t, href, locale} = useSiteLanguage();
  return <footer className="business-footer">
    <div className="footer-brand"><EvaWordmark/><p>{t('Conoce tu cuerpo.')}<br/>{t('Vive a tu ritmo.')}</p><a href={businessLinks.email}>hello@evahealth.es</a></div>
    <nav aria-label={t('Información de EVA')}><a href={href(businessLinks.method)}>{t('Cómo funciona')}</a><a href={href(businessLinks.science)}>{t('Ciencia')}</a><a href={href(businessLinks.pricing)}>{t('Precios')}</a><a href={href(businessLinks.about)}>{t('Nosotros')}</a><a href={href(businessLinks.blog)}>{t('Blog')}</a><a href={href('/es/contact')}>{t('Contacto')}</a><a href="/es/dashboard" hrefLang="es">{t('Mi EVA')}</a><LanguageSwitch className="site-language-switch"/></nav>
    <nav aria-label={t('Información legal')}><a href={businessLinks.privacy} hrefLang="es">{t('Política de privacidad')}</a><a href={businessLinks.terms} hrefLang="es">{t('Términos del servicio')}</a><a href={businessLinks.cookies} hrefLang="es">{t('Política de cookies')}</a></nav>
    {locale === 'en' && <p className="site-language-note">The account preview, methodology, legal documents, and design archives are currently in Spanish.</p>}
    <div className="footer-base"><p>Copyright 2026 EVA Health · Madrid</p><div><a href="/system" hrefLang="es">{t('El sistema')}</a><a href="/history" hrefLang="es">{t('Archivo')}</a></div><div className="motion-choice"><label htmlFor="motion-mode">{t('Reducir movimiento')}</label><Switch id="motion-mode" checked={calm} onCheckedChange={onCalmChange}/></div></div>
  </footer>;
}
