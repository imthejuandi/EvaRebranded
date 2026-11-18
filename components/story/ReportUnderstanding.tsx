'use client';

import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {businessLinks} from '@/lib/landing-content';
import {flowHref} from '@/lib/preview/policy';
import {reportUnderstanding} from '@/lib/site-content/report-understanding';
import {uploadAllowance} from '@/lib/site-content/upload-allowance';
import './report-understanding.css';

export const reportChapterId = 'entender-tus-analisis';

function DotImpression({percent}: {percent: number}) {
  return <svg className="report-impression" viewBox="0 0 100 100" aria-hidden="true" focusable="false">
    {Array.from({length: 100}, (_, index) => (
      <circle key={index} cx={5 + (index % 10) * 10} cy={5 + Math.floor(index / 10) * 10}
        r={index < percent ? 3.7 : 2.2} className={index < percent ? 'report-marked-dot' : undefined}/>
    ))}
  </svg>;
}

export function ReportUnderstanding({calm}: {calm: boolean}) {
  const {locale, href} = useSiteLanguage();
  const copy = reportUnderstanding[locale];
  const uploadHref = flowHref(businessLinks.signup, {plan: 'free', returnTo: businessLinks.upload, reportId: null, invalidPlan: false});

  return <section id={reportChapterId} className="report-understanding" data-problem-chapter data-calm={calm}
    aria-labelledby="report-understanding-title" tabIndex={-1}>
    <div className="report-poster">
      <h2 id="report-understanding-title">{copy.heading[0]} <em>{copy.heading[1]}</em></h2>
      <div className="report-evidence">
        <p className="report-lead">{copy.lead}</p>
        <ul className="report-findings">
          {copy.statistics.map(stat => <li key={stat.value} data-statement-fact>
            <p className="report-finding">
              <span className="report-value">{stat.value.slice(0, -1)}<span>%</span></span>{' '}
              <span className="report-description">{stat.text}{' '}
                <a href={stat.sourceHref} aria-label={stat.sourceDescription} data-statement-source>{stat.sourceLabel}</a>
              </span>
            </p>
            <DotImpression percent={parseInt(stat.value, 10)}/>
          </li>)}
        </ul>
        <p className="report-source-context">{copy.sourceContext}</p>
      </div>
      <div className="report-close" data-problem-choices>
        <p className="report-explanation">{copy.explanation}</p>
        <div className="report-action-group">
          <a className="report-free-action" data-problem-free data-statement-free href={href(uploadHref)} aria-describedby="report-free-allowance">
            {copy.action}
          </a>
          <p id="report-free-allowance" className="report-free-allowance">{uploadAllowance[locale].freeShort}</p>
        </div>
      </div>
    </div>
  </section>;
}
