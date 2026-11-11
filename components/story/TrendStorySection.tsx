'use client';

import {useCallback,useEffect,useRef,useState} from 'react';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {alexStoryCopy,alexStoryReadings} from '@/lib/site-content/alex-story-copy';
import {trendStoryCopy} from '@/lib/site-content/trend-story-copy';
import {businessLinks} from '@/lib/landing-content';
import {Arrow} from './Arrow';
import {DotNumber} from './DotNumber';
import './guided-result-story.css';
import './trend-story-section.css';

type TrendMode='latest'|'history';
const modes=['latest','history'] as const;
const TRANSITION_MS=500;
const points=alexStoryReadings.map((value,index)=>({x:56+index*224,y:236-value/3*204,value}));
const historyPath=points.map((point,index)=>`${index?'L':'M'}${point.x} ${point.y}`).join(' ');
const latest=points[points.length-1];

/** The established Alex case gains temporal evidence without moving its latest reading. */
export function TrendStorySection({calm=false}: {calm?:boolean}) {
  const {locale,href}=useSiteLanguage(), c=trendStoryCopy[locale], alex=alexStoryCopy[locale];
  const [mode,setMode]=useState<TrendMode>('history'),[motionReady,setMotionReady]=useState(false),[phase,setPhase]=useState('complete');
  const [announcement,setAnnouncement]=useState('');
  const plot=useRef<HTMLDivElement>(null), observer=useRef<IntersectionObserver|null>(null);
  const currentMode=useRef<TrendMode>('history'), reduced=useRef(false), autoPending=useRef(true), completion=useRef(0);
  const number=(value:number)=>value.toFixed(1).replace('.',locale==='es'?',':'.');
  const changeMode=useCallback((next:TrendMode,animate=true)=>{
    if(next===currentMode.current)return;
    currentMode.current=next;
    clearTimeout(completion.current);
    setMode(next);
    if(animate&&!reduced.current){setPhase('playing');completion.current=window.setTimeout(()=>setPhase('complete'),TRANSITION_MS);}
    else setPhase('complete');
  },[]);

  useEffect(()=>{
    const element=plot.current;
    if(!element)return;
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    reduced.current=calm||preference.matches;
    const revealComplete=()=>{
      observer.current?.disconnect();
      autoPending.current=false;
      clearTimeout(completion.current);
      setAnnouncement('');
      changeMode('history',false);
      setPhase('complete');
    };
    if(calm||preference.matches||!('IntersectionObserver' in window)){revealComplete();return;}
    setAnnouncement('');
    autoPending.current=true;
    changeMode('latest',false);
    setMotionReady(true);
    setPhase('ready');
    const enter=new IntersectionObserver(entries=>{
      if(!autoPending.current||!entries.some(entry=>entry.isIntersecting&&entry.intersectionRatio>=.55))return;
      enter.disconnect();autoPending.current=false;
      changeMode('history');
    },{threshold:[0,.55],rootMargin:'0px 0px -6% 0px'});
    observer.current=enter;enter.observe(element);
    const preferenceChanged=()=>{reduced.current=calm||preference.matches;if(reduced.current)revealComplete();};
    preference.addEventListener('change',preferenceChanged);
    return()=>{enter.disconnect();observer.current=null;clearTimeout(completion.current);preference.removeEventListener('change',preferenceChanged);};
  },[changeMode,calm]);

  const choose=(next:TrendMode)=>{
    autoPending.current=false;
    observer.current?.disconnect();
    if(next===currentMode.current)return;
    changeMode(next);
    const interpretation=c.interpretations[next];
    setAnnouncement(`${interpretation.label}. ${interpretation.explanation} ${interpretation.question}`);
  };
  const historyVisible=mode==='history';
  return <section className="trend-story" id="por-que-eva" aria-labelledby="por-que-eva-title" data-trend-story data-trend-mode={mode} data-trend-motion-ready={motionReady} data-trend-calm={calm} data-trend-reveal-state={phase} data-trend-transition-ms={TRANSITION_MS}>
    <div className="section-kicker"><span>{c.kicker}</span><span>{alex.eyebrow}</span></div>
    <header className="trend-story-heading"><h2 id="por-que-eva-title">{c.heading[0]}<br/><em>{c.heading[1]}</em></h2><p>{c.lead}</p></header>
    <div className="trend-view-controls bio-views" role="group" aria-label={c.historyLabel}>
      <button type="button" aria-pressed={!historyVisible} aria-controls="trend-story-chart" onClick={()=>choose('latest')} data-trend-control="latest">{c.controls.latest}</button>
      <button type="button" aria-pressed={historyVisible} aria-controls="trend-story-chart" onClick={()=>choose('history')} data-trend-control="history">{c.controls.history}</button>
    </div>
    <div className="trend-instrument guided-instrument bio-glass">
      <div className="trend-instrument-head">
        <div><p className="trend-instrument-kicker">{historyVisible?c.historyLabel:c.latestLabel}</p><h3>hs-CRP</h3><p className="trend-current-reading">{c.latestLabel} · {c.readingLabel} 04</p></div>
        <p className="trend-latest-value guided-value" data-trend-latest-value="2.1"><span className="sr-only">{number(latest.value)} mg/L</span><span aria-hidden="true"><DotNumber value={number(latest.value)} density="coarse" calm active={false}/><small>mg/L</small></span></p>
      </div>
      <div className="trend-evidence-grid">
        <div className="trend-chart-block">
          <div ref={plot} id="trend-story-chart" className="trend-plot" role="img" aria-label={historyVisible?alex.historyLabel:`${c.latestLabel}: hs-CRP ${number(latest.value)} mg/L.`} data-trend-axis-min="0" data-trend-axis-max="3">
            <svg viewBox="0 0 800 260" preserveAspectRatio="none" aria-hidden="true">
              {[0,1,2,3].map(tick=><path key={tick} className="trend-grid-line" d={`M56 ${236-tick*68}H752`} vectorEffect="non-scaling-stroke"/>)}
              <path className="trend-latest-rule" d={`M${latest.x} 18V236`} vectorEffect="non-scaling-stroke"/>
              <path className="trend-history-trace" d={historyPath} vectorEffect="non-scaling-stroke" data-trend-trace/>
            </svg>
            <div className="trend-axis-labels" aria-hidden="true">{[0,1,2,3].map(tick=><span key={tick} style={{top:`${(236-tick*68)/260*100}%`}}>{tick}</span>)}</div>
            {points.slice(0,-1).map((point,index)=><span key={index} className="trend-history-point" style={{left:`${point.x/800*100}%`,top:`${point.y/260*100}%`}} data-trend-prior-point={index+1} data-trend-point-value={point.value} aria-hidden="true"/>)}
            <span className="trend-latest-point" style={{left:`${latest.x/800*100}%`,top:`${latest.y/260*100}%`}} data-trend-latest-point data-trend-point-value={latest.value} aria-hidden="true"/>
          </div>
          <ol className="trend-reading-labels" aria-label={c.historyLabel}>
            {points.map((point,index)=><li key={index} style={{left:`${point.x/800*100}%`}} data-trend-reading={index+1} data-history-reading={index<3} aria-hidden={index<3&&!historyVisible}><span>{c.readingLabel} {String(index+1).padStart(2,'0')}</span><strong>{number(point.value)}</strong></li>)}
          </ol>
          <p className="trend-units">hs-CRP · mg/L</p>
        </div>
        <aside className="trend-context" aria-labelledby="trend-context-title" data-trend-context>
          <p id="trend-context-title">{alex.contextTitle}<span>{alex.contextSource}</span></p>
          <ul>{alex.contextNotes.map(note=><li key={note}>{note}</li>)}</ul>
          <p className="trend-context-limit" data-trend-limit>{alex.limit}</p>
        </aside>
      </div>
      <div className="trend-insight" id="trend-story-interpretation">
        {modes.map(view=>{
          const interpretation=c.interpretations[view];
          return <div key={view} className="trend-interpretation" data-trend-interpretation={view} data-active={view===mode} aria-hidden={view!==mode}>
            <p className="trend-interpretation-label">{interpretation.label}</p>
            <p className="trend-interpretation-copy">{interpretation.explanation}</p>
            <h3 className="trend-interpretation-question">{interpretation.question}</h3>
          </div>;
        })}
      </div>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true" data-trend-announcement>{announcement}</span>
    </div>
    <div className="trend-story-foot"><p data-trend-disclosure>{c.disclosure}</p><a href={href(`${businessLinks.science}#science-comparison-title`)} data-trend-method>{c.methodLink}<Arrow/></a></div>
  </section>;
}
