import '@/app/globals.css';
import '@/app/hero-entrance.css';
import '@/app/signal-autoplay.css';
import '@/components/pages/profile/profile.css';
import '@/components/pages/about/about.css';
import '@/components/pages/upload/upload.css';
import '@/components/pages/assistant/assistant.css';
import '@/app/site-preview.css';
import '@/app/app-preview.css';
import '@/components/pages/book/book.css';
import '@/components/pages/biomarker/biomarker.css';
import '@/app/operations-preview.css';
import '@/components/pages/dashboard/dashboard.css';
import '@/app/onboarding-preview.css';
import '@/components/pages/labs/labs.css';
import '@/app/editorial-preview.css';
import '@/components/pages/method/method.css';
import '@/app/document-preview.css';
import '@/components/pages/science/science.css';
import '@/app/access-preview.css';
import '@/components/pages/pricing/pricing.css';
import '@/app/site-language.css';
import type {ReactNode} from 'react';
import {SiteLanguageProvider} from './SiteLanguage';
import type {SiteLocale} from '@/lib/site-language';

export function SiteDocument({locale,children}:{locale:SiteLocale;children:ReactNode}) {
 return <html lang={locale}><head><link rel="preload" href="/fonts/hanken-grotesk-regular.woff" as="font" type="font/woff" crossOrigin="anonymous"/></head><body><SiteLanguageProvider locale={locale}>{children}</SiteLanguageProvider></body></html>;
}
