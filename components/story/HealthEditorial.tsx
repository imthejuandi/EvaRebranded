'use client';
import {HomeUnderstanding} from '@/components/site/RestoredContent';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { businessLinks } from '@/lib/landing-content';
import { DotNumber } from './DotNumber';
import {BiologicalAgeSection} from './BiologicalAgeSection';
import { LifestylePassage } from './LifestylePassage';
import { MethodJourney } from './MethodJourney';
import {StoryScenePassage} from './StoryScenePassage';
export function HealthEditorial({ calm = false }: {
    calm?: boolean;
}) {
    const __site = useSiteLanguage();
    return <>
 <section className="context-passage" id="una-perspectiva" aria-labelledby="context-title">
  <div className="section-kicker"><span>{__site.t("01 / UNA MIRADA M\u00C1S AMPLIA")}</span><a href={__site.href(businessLinks.science)}>{__site.t("LA CIENCIA DE EVA")}</a></div>
  <div className="context-grid"><h2 id="context-title">{__site.t("Tu salud tiene")}<br /><em>{__site.t("una historia.")}</em></h2><div className="context-copy"><p>{__site.t("Los biomarcadores son indicadores medibles de tu cuerpo. Una anal\u00EDtica muestra sus valores en un momento concreto.")}</p><p>{__site.t("Cada trimestre es una oportunidad para revisar tus resultados y elegir qué medir después. Compara lecturas compatibles y explora los paneles disponibles con nuestra orientación.")}</p><a className="text-link" href={__site.href(businessLinks.science)}>{__site.t("C\u00F3mo interpreta EVA los resultados ")}</a></div></div>
  <div className="annual-reading" id="revision-trimestral"><div className="annual-number"><DotNumber value="90" calm={calm}/><p>{__site.t("días. Un momento para revisar.")}</p></div><div className="annual-rhythm"><p><b>{__site.t("Empieza con 13 marcadores.")}</b><br />{__site.t("Revisa tu próximo paso cada trimestre.")}</p><div className="quarter-track" aria-label={__site.t("Revisiones trimestrales")}>{__site.t(['01', '04', '07', '10'].map((m, i) => <div key={m}><span className="quarter-dots" aria-hidden="true">{__site.t([<i key="review-point"/>])}</span><span>{__site.t("MES ")}{__site.t(m)}</span><small>{__site.t(['Empieza', 'Revisa', 'Elige', 'Vuelve a revisar'][i])}</small></div>))}</div></div></div>
 </section>
 <HomeUnderstanding />
 <MethodJourney calm={calm}/>
 <StoryScenePassage kind="life" calm={calm}/>
 <BiologicalAgeSection calm={calm}/>
 <LifestylePassage calm={calm}/>
 <section className="manifesto full-founder" id="nuestra-historia"><p className="eyebrow">{__site.t("05 / UNA IDEA MUY PERSONAL")}</p><blockquote>{__site.t("\u00ABEVA es el servicio que deseaba tener cuando comenc\u00E9 mi propio camino de salud preventiva: uno que no solo te entrega datos, sino que te ense\u00F1a lo que significan ")}<em>{__site.t("y qu\u00E9 hacer al respecto.\u00BB")}</em></blockquote><div className="founder"><span>{__site.t("Juan Diego Lago")}<br /><small>{__site.t("Fundador y CEO, EVA Health")}</small></span><a className="text-link" href={__site.href(businessLinks.about)}>{__site.t("Nuestra historia")}</a></div></section>
 </>;
}
