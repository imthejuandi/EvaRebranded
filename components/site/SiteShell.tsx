'use client';

import {useState, type ReactNode} from 'react';
import {usePathname} from 'next/navigation';
import {ArrowUpRight} from 'lucide-react';
import {EvaWordmark} from '@/components/story/EvaWordmark';
import {LanguageSwitch, useSiteLanguage} from './SiteLanguage';

const navigation = [['Cómo funciona', 'how-it-works'], ['Ciencia', 'science'], ['Precios', 'pricing'], ['Nosotros', 'about']];

export function SiteShell({children}: {children: ReactNode}) {
  const {t, href, locale} = useSiteLanguage();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const links = navigation.map(([label, path]) => <a key={path} href={href(`/es/${path}`)} aria-current={pathname === href(`/es/${path}`) ? 'page' : undefined}>{t(label)}</a>);
  return <div className="eva-site">
    <a className="skip" href="#contenido">{t('Saltar al contenido')}</a>
    <header className="eva-site-header">
      <EvaWordmark/>
      <nav aria-label={t('Navegación principal')}>{links}</nav>
      <div className="eva-header-actions">
        <LanguageSwitch className="site-language-switch"/>
        <a href={href("/es/login")} hrefLang={locale}>{t('Mi EVA')}</a>
        <a className="eva-header-kit" href={href("/es/signup?plan=quarterly")} hrefLang={locale}>{t('Pide tu kit')}<ArrowUpRight size={16} strokeWidth={1.4} aria-hidden="true"/></a>
        <button aria-expanded={open} aria-controls="inner-menu" onClick={() => setOpen(!open)} className="eva-mobile-menu">{t(open ? 'Cerrar' : 'Menú')}</button>
      </div>
    </header>
    {open && <nav id="inner-menu" className="eva-mobile-nav" aria-label={t('Menú móvil')}>{links}</nav>}
    <main id="contenido">{children}</main>
    <footer className="eva-site-footer">
      <div><EvaWordmark/><p>{t('Conocer. Entender.')}<br/>{t('Volver a la vida.')}</p><a href="mailto:hello@evahealth.es">hello@evahealth.es</a><LanguageSwitch className="site-language-switch"/></div>
      <nav aria-label={t('Descubre EVA')}>{links}<a href={href('/es/blog')}>{t('Journal')}</a><a href={href('/es/contact')}>{t('Contacto')}</a></nav>
      <nav aria-label={t('Documentación')}><a href={href("/es/metodologia")} hrefLang={locale}>{t('Metodología')}</a><a href={href("/es/legal/privacy")} hrefLang={locale}>{t('Privacidad')}</a><a href={href("/es/legal/terms")} hrefLang={locale}>{t('Términos')}</a><a href={href("/es/legal/cookies")} hrefLang={locale}>{t('Cookies')}</a><a href="/history" hrefLang="es">{t('Archivo de versiones')}</a></nav>
      <p>© 2026 EVA Health · {locale === 'en' ? 'New website preview' : 'Vista previa del nuevo sitio'}{locale === 'en' && <span className="site-language-note">The private app preview and design archives are currently in Spanish. Account entry and public documents are available in English.</span>}</p>
    </footer>
  </div>;
}
