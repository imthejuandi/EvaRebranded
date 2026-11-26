'use client';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
/** The supplied EVA artwork, including its original spacing and registered mark. */
export function EvaWordmark() {
    const __site = useSiteLanguage();
    return <a className="wordmark" href={__site.href("/")} aria-label={__site.t("EVA, inicio")}><span className="wordmark-art" aria-hidden="true" data-wordmark-revision="682fac5978cbae0973318e139fcb6dda60925f30e762ea190cce27fe7ad9977f"/></a>;
}
