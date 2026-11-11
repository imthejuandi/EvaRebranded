'use client';

import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {biologicalAgeCopy} from '@/lib/site-content/biological-age-copy';
import {businessLinks} from '@/lib/landing-content';
import {Arrow} from './Arrow';
import {DotNumber} from './DotNumber';
import './biological-age-section.css';

/** Keeps the original age illustration while distinguishing the two derived measures. */
export function BiologicalAgeSection({calm=false}: {calm?:boolean}) {
  const {locale,href}=useSiteLanguage(), c=biologicalAgeCopy[locale];

  return <section className="age-passage age-story" id="tu-evolucion" aria-labelledby="age-title" data-age-story>
    <div className="section-kicker">
      <span>{c.kicker}</span>
      <span className="age-availability" data-age-availability>{c.availability}</span>
    </div>
    <div className="age-heading">
      <h2 id="age-title">{c.headline[0]}<br/><em>{c.headline[1]}</em></h2>
      <div className="age-story-copy">
        <p className="age-story-intro">{c.intro}</p>
        <dl className="age-definitions">
          {c.definitions.map(definition=><div key={definition.id} data-age-measure={definition.id}>
            <dt>{definition.label}</dt>
            <dd>{definition.description}</dd>
          </div>)}
        </dl>
        <a className="age-method-link" href={href(`${businessLinks.science}#dos-lecturas`)} data-age-method-link>
          <span>{c.link}</span><Arrow/>
        </a>
      </div>
    </div>
    <div className="age-example" role="group" aria-label={c.exampleLabel} aria-describedby="age-illustration" data-age-example>
      <div className="age-readings">
        <div><p>{c.chronologicalLabel}</p><DotNumber value="34" calm={calm}/><span>{c.years}</span></div>
        <div className="age-connector" aria-hidden="true"><Arrow/></div>
        <div><p>{c.estimatedLabel}</p><DotNumber value="29" calm={calm}/><span>{c.years}</span></div>
      </div>
      <div className="age-foot">
        <p className="age-example-difference" data-age-difference><span>−5 <small>{c.years}</small></span>{c.differenceCaption}</p>
        <p className="illustration-note" id="age-illustration">{c.note}</p>
      </div>
    </div>
  </section>;
}
