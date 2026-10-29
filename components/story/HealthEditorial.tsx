'use client';
import {HomeUnderstanding} from '@/components/site/RestoredContent';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { Arrow } from './Arrow';
import { businessLinks } from '@/lib/landing-content';
import { DotNumber } from './DotNumber';
import { BiomarkerGallery } from './BiomarkerGallery';
import { LifestylePassage } from './LifestylePassage';
import { MethodJourney } from './MethodJourney';
export function HealthEditorial({ calm = false }: {
    calm?: boolean;
}) {
    const __site = useSiteLanguage();
    return <>
 <section className="context-passage" id="una-perspectiva" aria-labelledby="context-title">
  <div className="section-kicker"><span>{__site.t("01 / UNA MIRADA M\u00C1S AMPLIA")}</span><a href={__site.href(businessLinks.science)}>{__site.t("LA CIENCIA DE EVA")}</a></div>
  <div className="context-grid"><h2 id="context-title">{__site.t("Tu salud tiene")}<br /><em>{__site.t("una historia.")}</em></h2><div className="context-copy"><p>{__site.t("Los biomarcadores son indicadores medibles de tu cuerpo. Una anal\u00EDtica muestra sus valores en un momento concreto.")}</p><p>{__site.t("Con EVA, los vuelves a medir cada 90 d\u00EDas. As\u00ED puedes comparar tus resultados y ponerlos en relaci\u00F3n con tus h\u00E1bitos y c\u00F3mo te encuentras.")}</p><a className="text-link" href={__site.href(businessLinks.science)}>{__site.t("C\u00F3mo interpreta EVA los resultados ")}</a></div></div>
  <div className="annual-reading"><div className="annual-number"><DotNumber value="60" calm={calm}/><p>{__site.t("resultados de biomarcadores al a\u00F1o")}</p></div><div className="annual-rhythm"><p><b>{__site.t("15 biomarcadores.")}</b><br />{__site.t("Cuatro lecturas al a\u00F1o.")}</p><div className="quarter-track" aria-label={__site.t("Cuatro lecturas, una cada tres meses")}>{__site.t(['01', '04', '07', '10'].map((m, i) => <div key={m}><span className="quarter-dots" aria-hidden="true">{__site.t(Array.from({ length: 15 }, (_, j) => <i key={j}/>))}</span><span>{__site.t("MES ")}{__site.t(m)}</span><small>{__site.t(i === 0 ? 'Tu punto de partida' : 'Tu siguiente lectura')}</small></div>))}</div></div></div>
 </section>
 <HomeUnderstanding />
 <MethodJourney calm={calm}/>
 <BiomarkerGallery calm={calm}/>
 <section className="range-clarity" aria-label={__site.t("C\u00F3mo leer los rangos")}><p>{__site.t("Un intervalo de referencia describe los valores que usa el laboratorio. Los rangos de EVA aportan otra perspectiva para explorar tus resultados junto con su evoluci\u00F3n y tu contexto; no sustituyen una valoraci\u00F3n profesional.")}</p><a href={__site.href("/es/science")}>{__site.t("Entender los rangos de EVA")}</a></section>
 <LifestylePassage calm={calm}/>
 <section className="age-passage" id="tu-evolucion" aria-labelledby="age-title"><div className="section-kicker"><span>{__site.t("04 / TU EVOLUCI\u00D3N")}</span><span>{__site.t("UNA NUEVA LECTURA CADA TRIMESTRE")}</span></div><div className="age-heading"><h2 id="age-title">{__site.t("Tu edad cuenta")}<br /><em>{__site.t("una parte.")}</em></h2><div><p>{__site.t("Adem\u00E1s de los valores de cada biomarcador, EVA presenta una edad biol\u00F3gica estimada y una puntuaci\u00F3n de longevidad.")}</p><p>{__site.t("Son dos lecturas distintas. Puedes observar su evoluci\u00F3n entre trimestres junto al resto de tus resultados.")}</p></div></div><div className="age-readings"><div><p>{__site.t("EDAD CRONOL\u00D3GICA")}</p><DotNumber value="34" calm={calm}/><span>{__site.t("a\u00F1os")}</span></div><div className="age-connector" aria-hidden="true"><Arrow /></div><div><p>{__site.t("EDAD BIOL\u00D3GICA ESTIMADA")}</p><DotNumber value="29" calm={calm}/><span>{__site.t("a\u00F1os")}</span></div></div><div className="age-foot"><p><span>{__site.t("\u22125")}</span>{__site.t(" a\u00F1os de diferencia")}<br />{__site.t("entre las edades de este ejemplo.")}</p><p className="illustration-note">{__site.t("Ejemplo ilustrativo, no una predicci\u00F3n de tu resultado. La edad biol\u00F3gica es una estimaci\u00F3n y es distinta de tu puntuaci\u00F3n de longevidad.")}</p></div></section>
 <section className="manifesto full-founder" id="nuestra-historia"><p className="eyebrow">{__site.t("05 / UNA IDEA MUY PERSONAL")}</p><blockquote>{__site.t("\u00ABEVA es el servicio que deseaba tener cuando comenc\u00E9 mi propio camino de salud preventiva: uno que no solo te entrega datos, sino que te ense\u00F1a lo que significan ")}<em>{__site.t("y qu\u00E9 hacer al respecto.\u00BB")}</em></blockquote><div className="founder"><span>{__site.t("Juan Diego Lago")}<br /><small>{__site.t("Fundador y CEO, EVA Health")}</small></span><a className="text-link" href={__site.href(businessLinks.about)}>{__site.t("Nuestra historia")}</a></div></section>
 </>;
}
