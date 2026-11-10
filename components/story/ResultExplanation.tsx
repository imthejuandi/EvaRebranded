'use client';

import {useEffect, useId, useRef, useState, type CSSProperties} from 'react';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {explanationLevels, resultExplanationCopy, type ExplanationLevel} from '@/lib/site-content/result-explanation-copy';
import explanations from '@/lib/site-content/result-explanations.json';
import './result-explanation.css';

type Variants = Record<ExplanationLevel, string>;
const examples: Record<string, {en: Variants; es: Variants}> = explanations;

/** Authored educational variants: the report value and evidence remain owned by the gallery. */
export function ResultExplanation({marker, value, unit, level, onLevel, calm}: {
  marker: string; value: string; unit: string; level: ExplanationLevel;
  onLevel: (level: ExplanationLevel) => void; calm: boolean;
}) {
  const {locale, t} = useSiteLanguage();
  const c = resultExplanationCopy[locale], text = examples[marker]?.[locale], id = useId();
  const previous = useRef(level);
  const [announcement, setAnnouncement] = useState('');
  useEffect(() => {
    if (previous.current === level) return;
    previous.current = level;
    if (text) setAnnouncement(`${c.levels[level]}. ${text[level]}`);
  }, [level, text, c]);

  return <div className="result-explanation" data-explanation-level={level} data-calm={calm}>
    <p className="result-explanation-value"><span>{t(value)}</span> <small>{unit}</small></p>
    {text ? <>
      <div className="result-depth-label"><span id={id}>{c.label}</span><span>{level === 'advanced' ? c.hint : c.benefits[level]}</span></div>
      <div className="result-depth-control" role="group" aria-labelledby={id} style={{'--explanation-index': explanationLevels.indexOf(level)} as CSSProperties}>
        {explanationLevels.map(depth => <button type="button" key={depth} aria-pressed={level === depth} onClick={() => onLevel(depth)}><span>{c.levels[depth]}</span><small>{c.benefits[depth]}</small></button>)}
      </div>
      <div className="result-prose-stack">{explanationLevels.map(depth => <p key={depth} aria-hidden={level !== depth} data-active={level === depth}>{text[depth]}</p>)}</div>
      <p className="result-explanation-reassurance">{c.reassurance}</p>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</span>
    </> : <p>{c.unavailable}</p>}
  </div>;
}
