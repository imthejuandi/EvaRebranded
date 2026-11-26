'use client';

import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {businessLinks} from '@/lib/landing-content';
import {flowHref} from '@/lib/preview/policy';
import {resultsProblemCopy} from '@/lib/site-content/results-problem-copy';
import {GuidedResultStory} from './GuidedResultStory';

export function ResultsProblem({calm = false}: {calm?: boolean}) {
  const {locale, href} = useSiteLanguage();
  const uploadHref = flowHref(businessLinks.signup, {plan: 'free', returnTo: businessLinks.upload, reportId: null, invalidPlan: false});

  return <section id="entender-los-resultados" className="biomarker-lab results-problem" aria-labelledby="markers-title">
    <div className="bio-layout">
      <p className="results-problem-lead">{resultsProblemCopy[locale]}</p>
      <GuidedResultStory calm={calm} uploadHref={href(uploadHref)}/>
    </div>
  </section>;
}
