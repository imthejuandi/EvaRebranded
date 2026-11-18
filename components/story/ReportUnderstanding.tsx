'use client';

import {useEffect, useRef} from 'react';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {businessLinks} from '@/lib/landing-content';
import {flowHref} from '@/lib/preview/policy';
import {alexStoryReadings} from '@/lib/site-content/alex-story-copy';
import {reportUnderstanding} from '@/lib/site-content/report-understanding';
import {uploadAllowance} from '@/lib/site-content/upload-allowance';
import './report-understanding.css';

export const reportChapterId = 'entender-tus-analisis';

export function ReportUnderstanding({calm}: {calm: boolean}) {
  const {locale, href} = useSiteLanguage();
  const copy = reportUnderstanding[locale];
  const section = useRef<HTMLElement>(null);
  const previousReadings = alexStoryReadings.slice(0, -1);
  const currentReading = alexStoryReadings[alexStoryReadings.length - 1];
  const formatReading = (value: number) => locale === 'es' ? value.toFixed(1).replace('.', ',') : value.toFixed(1);
  const uploadHref = flowHref(businessLinks.signup, {plan: 'free', returnTo: businessLinks.upload, reportId: null, invalidPlan: false});

  useEffect(() => {
    const chapter = section.current;
    const proofMark = chapter?.querySelector('.report-proof-mark');
    if (!chapter || !proofMark || calm || chapter.dataset.proofEntered || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      chapter.dataset.proofEntered = 'true';
      observer.disconnect();
    }, {threshold: .5});
    observer.observe(proofMark);
    return () => observer.disconnect();
  }, [calm]);

  return <section ref={section} id={reportChapterId} className="report-understanding" data-problem-chapter data-calm={calm}
    aria-labelledby="report-understanding-title" tabIndex={-1}>
    <div className="report-proof">
      <h2 id="report-understanding-title">{copy.heading[0]} <em>{copy.heading[1]}</em></h2>
      <figure className="report-translation">
        <div className="report-specimen" data-report-specimen>
          <p className="report-example-label">{copy.example}</p>
          <div className="report-assay-line">
            <span className="report-assay">hs-CRP</span>
            <span className="report-assay-leader" aria-hidden="true"/>
            <p className="report-assay-value" data-value="2.1"><span>{formatReading(currentReading)}</span> <small>mg/L</small></p>
          </div>
          <p className="report-prior-readings"><span>{copy.previous}</span> <span>{previousReadings.map(formatReading).join(' · ')} mg/L</span></p>
        </div>
        <span className="report-proof-mark" aria-hidden="true"><span className="report-proof-mark-stem"/><span className="report-proof-mark-arm"/><span className="report-proof-mark-dot"/></span>
        <figcaption className="report-human-reading" data-report-meaning>{copy.reading}</figcaption>
      </figure>
      <div className="report-resolution">
        <p className="report-explanation">{copy.explanation}</p>
        <div className="report-action-group" data-problem-choices>
          <a className="report-free-action" data-problem-free data-statement-free href={href(uploadHref)} aria-describedby="report-free-allowance">{copy.action}</a>
          <p id="report-free-allowance" className="report-free-allowance">{uploadAllowance[locale].freeShort}</p>
        </div>
      </div>
    </div>
  </section>;
}
