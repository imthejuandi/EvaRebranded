'use client';

import {useEffect,useRef} from 'react';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {businessLinks} from '@/lib/landing-content';
import {flowHref} from '@/lib/preview/policy';
import {rangeProofCopy} from '@/lib/site-content/range-proof-copy';
import {Arrow} from './Arrow';
import {DotNumber} from './DotNumber';
import './range-proof-section.css';

/** One unchanged result, its illustrative report interval, and a qualified prevention reading. */
export function RangeProofSection({calm=false}: {calm?:boolean}) {
  const {locale,href}=useSiteLanguage(), c=rangeProofCopy[locale];
  const root=useRef<HTMLElement>(null), prevention=useRef<HTMLDivElement>(null);
  const uploadHref=flowHref(businessLinks.signup,{plan:'free',returnTo:businessLinks.upload,reportId:null,invalidPlan:false});
  const number=locale==='es'?'2,1':'2.1';

  useEffect(()=>{
    const element=root.current, trigger=prevention.current;
    if(!element||!trigger)return;
    const preference=matchMedia('(prefers-reduced-motion: reduce)');
    let finished=false;
    const animations:Animation[]=[];
    const finish=()=>{
      finished=true;
      for(const animation of animations)animation.cancel();
      element.dataset.rangeEntryState='complete';
    };
    if(calm||preference.matches||!('IntersectionObserver' in window)||typeof element.animate!=='function'){finish();return;}
    element.dataset.rangeEntryState='ready';
    const observer=new IntersectionObserver(entries=>{
      if(!entries.some(entry=>entry.isIntersecting)||finished)return;
      observer.disconnect();
      if(preference.matches||document.hidden){finish();return;}
      element.dataset.rangeEntryState='playing';
      const band=element.querySelector<HTMLElement>('[data-range-prevention-band]');
      if(band)animations.push(band.animate([{opacity:.2,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0)'}],{duration:500,easing:'cubic-bezier(.22,1,.36,1)'}));
      animations.push(trigger.animate([{transform:'translateY(10px)'},{transform:'translateY(0)'}],{duration:500,easing:'cubic-bezier(.22,1,.36,1)'}));
      void Promise.all(animations.map(animation=>animation.finished)).then(()=>{if(!finished){finished=true;element.dataset.rangeEntryState='complete';}}).catch(()=>{});
    },{threshold:.2});
    observer.observe(trigger);
    const visibility=()=>{if(document.hidden&&element.dataset.rangeEntryState==='playing')finish();};
    const reduced=()=>{if(preference.matches){observer.disconnect();finish();}};
    element.addEventListener('focusin',finish);
    document.addEventListener('visibilitychange',visibility);
    preference.addEventListener('change',reduced);
    return()=>{observer.disconnect();for(const animation of animations)animation.cancel();element.removeEventListener('focusin',finish);document.removeEventListener('visibilitychange',visibility);preference.removeEventListener('change',reduced);};
  },[calm,locale]);

  return <section ref={root} className="range-proof" id="otra-lectura" aria-labelledby="range-proof-title" data-range-proof data-range-entry-state="complete" data-range-entry-duration-ms="500">
    <div className="section-kicker"><span>{c.kicker}</span></div>
    <div className="range-proof-layout">
      <div className="range-proof-story">
        <h2 id="range-proof-title">{c.heading[0]}<br/><em>{c.heading[1]}</em></h2>
        <div className="range-proof-actions">
          <a className="range-proof-primary" href={href(uploadHref)} data-range-upload><span><strong>{c.primary}</strong><small>{c.primarySubtitle}</small></span><Arrow/></a>
        </div>
      </div>
      <div className="range-proof-evidence">
        <div className="range-proof-instrument bio-glass">
          <header className="range-proof-readout">
            <div><p className="range-proof-example">{c.exampleLabel}</p><h3>hs-CRP</h3><p className="range-proof-marker-name">{c.markerLabel}</p></div>
            <p className="range-proof-value" data-range-value="2.1"><span className="sr-only">{number} mg/L</span><span aria-hidden="true"><DotNumber value={number} density="coarse" calm active={false}/><small>mg/L</small></span></p>
          </header>
          <div className="range-proof-plot" data-range-axis-min="0" data-range-axis-max="5" aria-hidden="true">
            <div className="range-proof-lane-labels"><span>{c.lab.label}</span><span>{c.prevention.label}</span></div>
            <div className="range-proof-lanes">
              <div className="range-proof-lane range-proof-lab-lane"><span data-range-lab-band/></div>
              <div className="range-proof-lane range-proof-prevention-lane"><span data-range-prevention-band/><i className="range-proof-threshold"/></div>
              <span className="range-proof-fixed-marker" data-range-marker/>
              <div className="range-proof-axis">{[0,1,2,3,4,5].map(tick=><span key={tick}>{tick}</span>)}</div>
            </div>
          </div>
          <div className="range-proof-readings">
            <div className="range-proof-reading" data-range-reading="lab">
              <p className="range-proof-reading-label">{c.lab.label}<span>{c.lab.threshold}</span></p>
              <h4>{c.lab.interpretation}</h4>
            </div>
            <div ref={prevention} className="range-proof-reading range-proof-prevention" data-range-reading="prevention">
              <p className="range-proof-reading-label">{c.prevention.label}<span>{c.prevention.threshold}</span></p>
              <h4>{c.prevention.interpretation}</h4>
            </div>
          </div>
        </div>
        <p className="range-proof-context">{c.qualifier}</p>
        <details className="range-proof-details">
          <summary>{c.detailsLabel}</summary>
          <div className="range-proof-detail-body">
            <p className="range-proof-lead">{c.lead}</p>
            <p><strong>{c.lab.label}. </strong>{c.lab.detail}</p>
            <p><strong>{c.prevention.label}. </strong>{c.prevention.detail}</p>
            <p>{c.context}</p>
            <div className="range-proof-sources"><p>{c.sourceLabel}</p>{c.sources.map(source=><a key={source.href} href={source.href} target="_blank" rel="noreferrer" data-range-source>{source.label}</a>)}</div>
            <a className="range-proof-method" href={href(businessLinks.science)} data-range-method>{c.methodLink}<Arrow/></a>
          </div>
        </details>
      </div>
    </div>
  </section>;
}
