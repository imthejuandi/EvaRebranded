'use client';

import {createContext, useContext, useEffect, useMemo, useState, type ReactNode} from 'react';
import {usePathname} from 'next/navigation';
import {alternatePublicHref, publicHref, translatePublicText, type SiteLocale} from '@/lib/site-language';

const SiteLanguageContext = createContext<SiteLocale>('es');

export function SiteLanguageProvider({locale, children}: {locale: SiteLocale; children: ReactNode}) {
  return <SiteLanguageContext.Provider value={locale}>{children}</SiteLanguageContext.Provider>;
}

export function useSiteLanguage() {
  const locale = useContext(SiteLanguageContext);
  return useMemo(() => ({locale, t: <T,>(value: T): T => translatePublicText(value, locale), href: (value: string) => publicHref(value, locale)}), [locale]);
}

export function LanguageSwitch({className = 'header-language'}: {className?: string}) {
  const {locale} = useSiteLanguage();
  const pathname = usePathname() || '/';
  const [suffix, setSuffix] = useState('');
  useEffect(() => {
    const update = () => setSuffix(location.search + location.hash);
    update();
    window.addEventListener('hashchange', update);
    window.addEventListener('popstate', update);
    return () => {window.removeEventListener('hashchange', update); window.removeEventListener('popstate', update);};
  }, [pathname]);
  const other = locale === 'es' ? 'en' : 'es';
  return <a className={className} href={alternatePublicHref(pathname + suffix, locale)} hrefLang={other} lang={other} aria-label={other === 'en' ? 'Switch to English' : 'Cambiar a español'}>{other.toUpperCase()}</a>;
}
