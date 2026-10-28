'use client';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { SolarMotion } from './SolarMotion';
export function LifestylePassage({ calm = false }: {
    calm?: boolean;
}) { const __site = useSiteLanguage(); return <section id="lo-que-te-mueve" className="lifestyle-passage" aria-labelledby="lifestyle-title"><figure className="solar-grain"><SolarMotion calm={calm}/><figcaption><span>{__site.t("AIRE LIBRE.")}</span><span>{__site.t("BUENA COMPA\u00D1\u00CDA.")}</span></figcaption></figure><div className="lifestyle-copy"><p className="eyebrow">{__site.t("LO QUE HACE QUE MEREZCA LA PENA")}</p><h2 id="lifestyle-title">{__site.t("Lo que")}<br />{__site.t("te mueve.")}<br /><em>{__site.t("Y con qui\u00E9n.")}</em></h2><p>{__site.t("Salir a correr. Alargar el paseo.")}<br />{__site.t("Encontrar tiempo para los tuyos.")}</p><p>{__site.t("Cuidarte forma parte")}<br />{__site.t("de esa vida que disfrutas.")}</p><span className="lifestyle-mark" aria-hidden="true">{__site.t("eva")}</span></div></section>; }
