'use client';

import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {useEffect, useRef} from 'react';
import {reportStudyUrl, reportUnderstanding} from '@/lib/site-content/report-understanding';
import {Arrow} from './Arrow';
import {DotNumber} from './DotNumber';
import {HeroKitCta} from './HeroKitCta';
import './report-understanding.css';

export const reportChapterId = 'entender-tus-analisis';

export function DiscoverProblem() {
  const {locale} = useSiteLanguage();
  return <a href={`#${reportChapterId}`} className="report-discovery-link" data-discover-problem>
    {reportUnderstanding[locale].discover}<Arrow direction="down"/>
  </a>;
}

export function ReportUnderstanding({calm}: {calm: boolean}) {
  const {locale} = useSiteLanguage();
  const copy = reportUnderstanding[locale];
  const section = useRef<HTMLElement>(null);
  useEffect(() => {
    const chapter = section.current;
    if (!chapter || calm || chapter.dataset.ruleEntered || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      chapter.dataset.ruleEntered = 'true';
      observer.disconnect();
    });
    observer.observe(chapter);
    return () => observer.disconnect();
  }, [calm]);

  return <section ref={section} id={reportChapterId} className="report-understanding" data-problem-chapter data-calm={calm}
    aria-labelledby="report-understanding-title" tabIndex={-1}>
    <div className="report-spread">
      <h2 id="report-understanding-title">{copy.heading[0]} <em>{copy.heading[1]}</em></h2>
      <div className="report-study">
        <p className="report-finding">
          <span className="report-study-intro">{copy.studyIntro}</span>{' '}
          <span className="report-stat">{copy.article && <span className="report-article">{copy.article}</span>}
            <span aria-hidden="true" className="report-dotted-stat"><DotNumber value="49" calm active={false}/><span>%</span></span>
            <span className="sr-only">{copy.percent}</span>
          </span>{' '}
          <span className="report-study-text">{copy.finding}</span>
        </p>
        <p className="report-study-context">{copy.context}</p>
        <a className="report-study-source" href={reportStudyUrl} aria-label={copy.source}>JMIR, 2014</a>
      </div>
      <div className="report-next">
        <p className="report-bridge">{copy.bridge}</p>
        <div data-problem-choices><HeroKitCta/></div>
      </div>
    </div>
  </section>;
}
