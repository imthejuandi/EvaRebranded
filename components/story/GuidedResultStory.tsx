'use client';

import {useEffect, useId, useRef, useState, type CSSProperties} from 'react';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {alexStoryCopy, alexStoryReadings} from '@/lib/site-content/alex-story-copy';
import {explanationLevels, resultExplanationCopy, type ExplanationLevel} from '@/lib/site-content/result-explanation-copy';
import './guided-result-story.css';

const readings = alexStoryReadings;
const historyPoints = readings.map((value, index) => ({x: 16 + index * 448 / 3, y: 11 + (2.1 - value) / 1.3 * 48}));
const historyPath = historyPoints.map((point, index) => `${index ? 'L' : 'M'}${point.x} ${point.y}`).join(' ');

/** One authored fictional evidence set. Choosing depth never changes the result. */
export function GuidedResultStory({calm = false}: {calm?: boolean}) {
  const {locale} = useSiteLanguage(), c = alexStoryCopy[locale], labels = resultExplanationCopy[locale];
  const [level, setLevel] = useState<ExplanationLevel>('simple');
  const [entered, setEntered] = useState(false), [motionReady, setMotionReady] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const root = useRef<HTMLDivElement>(null), id = useId();

  useEffect(() => {
    if (calm || matchMedia('(prefers-reduced-motion: reduce)').matches) {setEntered(true); return;}
    const element = root.current;
    if (!element || !('IntersectionObserver' in window)) {setEntered(true); return;}
    setMotionReady(true);
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {setEntered(true); observer.disconnect();}
    }, {threshold: .12});
    observer.observe(element);
    return () => observer.disconnect();
  }, [calm]);

  const choose = (next: ExplanationLevel) => {
    if (next === level) return;
    setLevel(next);
    setAnnouncement(`${labels.levels[next]}. ${c.paragraphs[next]} ${c.limit}`);
  };

  return <div ref={root} id="alex-story" className="guided-result-story" data-depth={level} data-context="true" data-entered={entered} data-motion-ready={motionReady} data-calm={calm} onFocusCapture={() => setEntered(true)}>
    <div className="guided-story-intro">
      <p className="guided-story-eyebrow"><span aria-hidden="true"/> {c.eyebrow}</p>
      <h3>{c.title}</h3>
      <p className="guided-story-question">“{c.question}”</p>
      <p className="guided-story-invitation">{c.invitation}</p>
      <p className="guided-story-closing">{c.closing}</p>
    </div>
    <div className="guided-story-result">
      <div className="guided-instrument bio-glass">
        <span className="guided-light" aria-hidden="true"/>
        <div className="guided-evidence">
          <div><h4>hs-CRP</h4><p>{c.evidence}</p></div>
          <p className="guided-value" data-value="2.1"><span>{locale === 'en' ? '2.1' : '2,1'}</span> <small>mg/L</small></p>
        </div>
        <div className="guided-context"><p><span>{c.contextTitle}</span><small>{c.contextSource}</small></p><ul>{c.contextNotes.map(note => <li key={note}>{note}</li>)}</ul></div>
        <div className="guided-history">
          <p>{c.history} <span>mg/L</span></p>
          <svg viewBox="0 0 480 70" role="img" aria-label={c.historyLabel} preserveAspectRatio="none"><path d={historyPath} pathLength="1"/>{historyPoints.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r={index === 3 ? 4 : 3}/>)}</svg>
          <div className="guided-history-values">{readings.map((value, index) => <span key={index}>{locale === 'en' ? value.toFixed(1) : value.toFixed(1).replace('.', ',')}</span>)}</div>
        </div>
        <p className="guided-control-label" id={id}>{labels.label}</p>
        <div className="guided-depth-control" role="group" aria-labelledby={id} style={{'--depth-index': explanationLevels.indexOf(level)} as CSSProperties}>
          {explanationLevels.map(depth => <button type="button" key={depth} aria-pressed={level === depth} onClick={() => choose(depth)}><span>{labels.levels[depth]}</span><small>{c.purposes[depth]}</small></button>)}
        </div>
        <div className="guided-prose-stack">{explanationLevels.map(depth => <p key={depth} data-active={depth === level} aria-hidden={depth !== level}>{c.paragraphs[depth]}</p>)}</div>
        <p className="guided-causal-limit">{c.limit}</p>
        <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</span>
      </div>
      <p className="guided-disclosure">{c.disclosure}</p>
    </div>
  </div>;
}
