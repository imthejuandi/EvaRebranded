'use client';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {lifestyleCopy} from '@/lib/site-content/lifestyle-copy';
import { SolarMotion } from './SolarMotion';
export function LifestylePassage({ calm = false }: {
    calm?: boolean;
}) {
    const {locale} = useSiteLanguage();
    const copy = lifestyleCopy[locale];
    return <section id="lo-que-te-mueve" className="lifestyle-passage" aria-labelledby="lifestyle-title">
      <figure className="solar-grain">
        <SolarMotion calm={calm}/>
        <figcaption><span>{copy.captions[0]}</span><span>{copy.captions[1]}</span></figcaption>
      </figure>
      <div className="lifestyle-copy">
        <p className="eyebrow">{copy.kicker}</p>
        <h2 id="lifestyle-title">{copy.heading[0]}<br/>{copy.heading[1]}<br/><em>{copy.heading[2]}</em></h2>
        {copy.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        <span className="lifestyle-mark" aria-hidden="true">eva</span>
      </div>
    </section>;
}
