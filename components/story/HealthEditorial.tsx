'use client';
import {HomeUnderstanding} from '@/components/site/RestoredContent';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { businessLinks } from '@/lib/landing-content';
import {HealthStorySection} from './HealthStorySection';
import {BiologicalAgeSection} from './BiologicalAgeSection';
import { LifestylePassage } from './LifestylePassage';
import { MethodJourney } from './MethodJourney';
import {StoryScenePassage} from './StoryScenePassage';
export function HealthEditorial({ calm = false }: {
    calm?: boolean;
}) {
    const __site = useSiteLanguage();
    return <>
 <HealthStorySection calm={calm}/>
 <HomeUnderstanding calm={calm}/>
 <MethodJourney calm={calm}/>
 <StoryScenePassage kind="life" calm={calm}/>
 <BiologicalAgeSection calm={calm}/>
 <LifestylePassage calm={calm}/>
 <section className="manifesto full-founder" id="nuestra-historia"><p className="eyebrow">{__site.t("05 / UNA IDEA MUY PERSONAL")}</p><blockquote>{__site.t("\u00ABEVA es el servicio que deseaba tener cuando comenc\u00E9 mi propio camino de salud preventiva: uno que no solo te entrega datos, sino que te ense\u00F1a lo que significan ")}<em>{__site.t("y qu\u00E9 hacer al respecto.\u00BB")}</em></blockquote><div className="founder"><span>{__site.t("Juan Diego Lago")}<br /><small>{__site.t("Fundador y CEO, EVA Health")}</small></span><a className="text-link" href={__site.href(businessLinks.about)}>{__site.t("Nuestra historia")}</a></div></section>
 </>;
}
