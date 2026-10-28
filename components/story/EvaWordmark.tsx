'use client';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
/** The supplied EVA artwork, including its original spacing and registered mark. */
export function EvaWordmark() {
    const __site = useSiteLanguage();
    return <a className="wordmark" href={__site.href("/")} aria-label={__site.t("EVA, inicio")}><span className="wordmark-art" aria-hidden="true"/></a>;
}
