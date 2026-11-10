'use client';

import {useId} from 'react';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {explanationLevels, resultExplanationCopy, type ExplanationLevel} from '@/lib/site-content/result-explanation-copy';
import './explanation-setting.css';

/** Native picker previews the signup preference; only its selected value is shown. */
export function ExplanationSetting({level, onLevel}: {level: ExplanationLevel; onLevel: (level: ExplanationLevel) => void}) {
  const {locale} = useSiteLanguage(), c = resultExplanationCopy[locale], id = useId();
  return <div className="explanation-setting">
    <div className="explanation-setting-control">
      <label htmlFor={id}><svg viewBox="0 0 20 20" width="16" height="16" aria-hidden="true"><path d="M3 5h14M3 10h14M3 15h14" fill="none" stroke="currentColor"/><path d="M7 3v4M13 8v4M8 13v4" fill="none" stroke="currentColor" strokeWidth="3"/></svg>{c.settingLabel}</label>
      <select id={id} value={level} aria-describedby={id + '-hint'} onChange={event => onLevel(event.currentTarget.value as ExplanationLevel)}>
        {explanationLevels.map(depth => <option key={depth} value={depth}>{c.levels[depth]}</option>)}
      </select><span aria-hidden="true">⌄</span>
    </div>
    <p id={id + '-hint'}>{c.settingHint}</p>
  </div>;
}
