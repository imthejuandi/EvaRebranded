'use client';

import {EditorialReveal} from '@/components/engagement/EditorialReveal';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {businessLinks} from '@/lib/landing-content';
import {healthStoryCopy} from '@/lib/site-content/health-story-copy';
import {Arrow} from './Arrow';
import {DotNumber} from './DotNumber';
import './health-story-section.css';

/** The existing paper chapter: comparable readings, draw-day context, then a review rhythm. */
export function HealthStorySection({calm=false}: {calm?:boolean}) {
  const {locale,href}=useSiteLanguage(), c=healthStoryCopy[locale];

  return <EditorialReveal as="section" id="una-perspectiva" className="context-passage health-story" aria-labelledby="context-title" data-health-story duration={.55} offset={12}>
    <div className="section-kicker">
      <span>{c.kicker}</span>
      <a href={href(businessLinks.science)}>{c.scienceLabel}</a>
    </div>
    <div className="context-grid">
      <h2 id="context-title" data-editorial-reveal>{c.heading[0]}<br/><em>{c.heading[1]}</em></h2>
      <div className="health-story-reading">
        <p className="health-story-lead" data-editorial-reveal>{c.lead}</p>
        <div className="health-story-insights">
          {c.insights.map(insight=><div className="health-story-insight" key={insight.id} data-health-insight={insight.id} data-editorial-reveal>
            <h3>{insight.title}</h3>
            <p>{insight.body}</p>
          </div>)}
        </div>
        <a className="health-story-method" href={href(`${businessLinks.science}#science-comparison-title`)} data-health-method-link><span>{c.methodLink}</span><Arrow/></a>
      </div>
    </div>
    <div className="health-rhythm" id="revision-trimestral" aria-labelledby="health-rhythm-title" data-review-rhythm>
      <div className="health-rhythm-number" data-editorial-reveal>
        <DotNumber value="90" calm={calm}/>
        <p>{c.rhythm.numberLabel}</p>
      </div>
      <div className="health-rhythm-heading" data-editorial-reveal>
        <h3 id="health-rhythm-title">{c.rhythm.heading[0]}<br/><em>{c.rhythm.heading[1]}</em></h3>
        <p>{c.rhythm.intro}</p>
      </div>
      <div className="health-rhythm-timeline">
        <span className="health-rhythm-line" data-editorial-line aria-hidden="true"/>
        <ol className="health-rhythm-points" aria-label={locale==='es'?'Un ritmo orientativo de revisión':'A suggested review rhythm'}>
          {c.rhythm.points.map(point=><li key={point.month} data-review-month={point.month} data-editorial-reveal>
            <span className="health-rhythm-point" aria-hidden="true"/>
            <p className="health-rhythm-month">{locale==='es'?'MES':'MONTH'} {point.month}</p>
            <h4>{point.title}</h4>
            <p className="health-rhythm-detail">{point.body}</p>
          </li>)}
        </ol>
      </div>
    </div>
  </EditorialReveal>;
}
