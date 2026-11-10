'use client';

import {useEffect, useRef, useState} from 'react';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {alexStoryCopy, alexStoryReadings} from '@/lib/site-content/alex-story-copy';
import {explanationLevels, resultExplanationCopy, type ExplanationLevel} from '@/lib/site-content/result-explanation-copy';
import {ExplanationSetting} from './ExplanationSetting';
import {DotNumber} from './DotNumber';
import {Arrow} from './Arrow';
import './guided-result-story.css';

const readings = alexStoryReadings;
const historyPoints = readings.map((value, index) => ({x:16 + index * 448 / 3, y:11 + (2.1 - value) / 1.3 * 48}));
const historyPath = historyPoints.map((point,index) => `${index ? 'L' : 'M'}${point.x} ${point.y}`).join(' ');

/** An external preference station beside an evidence-owned fictional report. */
export function GuidedResultStory({calm=false, uploadHref}: {calm?:boolean; uploadHref:string}) {
  const {locale,t}=useSiteLanguage(), c=alexStoryCopy[locale], labels=resultExplanationCopy[locale];
  const [level,setLevel]=useState<ExplanationLevel>('simple');
  const [entered,setEntered]=useState(false),[motionReady,setMotionReady]=useState(false),[announcement,setAnnouncement]=useState('');
  const root=useRef<HTMLDivElement>(null);
  const number=(value:number)=>locale==='en'?value.toFixed(1):value.toFixed(1).replace('.',',');
  useEffect(()=>{
    if(calm||matchMedia('(prefers-reduced-motion: reduce)').matches){setEntered(true);return;}
    const element=root.current;
    if(!element||!('IntersectionObserver' in window)){setEntered(true);return;}
    setMotionReady(true);
    const observer=new IntersectionObserver(entries=>{if(entries[0].isIntersecting){setEntered(true);observer.disconnect();}},{threshold:.1});
    observer.observe(element);return()=>observer.disconnect();
  },[calm]);
  const choose=(next:ExplanationLevel)=>{if(next===level)return;setLevel(next);setAnnouncement(`${labels.levels[next]}. ${c.paragraphs[next]} ${c.limit}`);};
  return <div ref={root} id="alex-story" className="guided-result-story" data-depth={level} data-entered={entered} data-motion-ready={motionReady} data-calm={calm} onFocusCapture={()=>setEntered(true)}>
    <div className="guided-story-intro">
      <header className="guided-feature-heading"><h2 id="markers-title">{labels.headline[0]}<br/><em>{labels.headline[1]}</em></h2>
      <p className="guided-feature-intro">{labels.intro}</p></header>
      <section className="guided-preference" aria-label={labels.settingEyebrow}>
        <p className="guided-preference-eyebrow"><span aria-hidden="true"/>{labels.settingEyebrow}</p>
        <h3>{labels.settingInvitation}</h3>
        <ExplanationSetting level={level} onLevel={choose}/>
      </section>
      <a className="text-link guided-start" href={uploadHref}><span>{t('Interpreta tus análisis previos')}<br/><small>{t('Empieza gratis')}</small></span><Arrow/></a>
    </div>
    <div className="guided-story-result">
      <div className="guided-instrument bio-glass">
        <span className="guided-light" aria-hidden="true"/>
        <div className="guided-evidence">
          <div className="guided-marker"><p className="guided-case-label">{c.eyebrow}</p><h3>hs-CRP</h3><p>{c.evidence}</p></div>
          <p className="guided-value" data-value="2.1"><span className="sr-only">{number(2.1)} mg/L</span><span aria-hidden="true"><DotNumber value={number(2.1)} density="coarse" calm={calm||!entered}/><small>mg/L</small></span></p>
        </div>
        <div className="guided-prose-stack">{explanationLevels.map(depth=><p key={depth} data-active={depth===level} aria-hidden={depth!==level}>{c.paragraphs[depth]}</p>)}</div>
        <div className="guided-report-context">
          <div className="guided-context"><p><span>{c.contextTitle}</span><small>{c.contextSource}</small></p><ul>{c.contextNotes.map(note=><li key={note}>{note}</li>)}</ul></div>
          <div className="guided-history"><p>{c.history}<span>mg/L</span></p><svg viewBox="0 0 480 70" role="img" aria-label={c.historyLabel} preserveAspectRatio="none"><path d={historyPath} pathLength="1"/>{historyPoints.map((point,index)=><circle key={index} cx={point.x} cy={point.y} r={index===3?4:3}/>)}</svg><div className="guided-history-values">{readings.map((value,index)=><span key={index}><span className="sr-only">{number(value)}</span><span aria-hidden="true"><DotNumber value={number(value)} density="coarse" calm active={false}/></span></span>)}</div></div>
        </div>
        <p className="guided-causal-limit">{c.limit}</p>
        <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">{announcement}</span>
      </div>
      <p className="guided-disclosure">{c.disclosure}</p>
    </div>
  </div>;
}
