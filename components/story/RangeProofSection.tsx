'use client';

import {useEffect,useRef} from 'react';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {businessLinks} from '@/lib/landing-content';
import {flowHref} from '@/lib/preview/policy';
import {rangeProofCopy,rangeProofExample} from '@/lib/site-content/range-proof-copy';
import {Arrow} from './Arrow';
import {DotNumber} from './DotNumber';
import './range-proof-section.css';

/** One sample feeds two comparison channels; the routing is not a numeric scale. */
export function RangeProofSection({calm=false}: {calm?:boolean}) {
  const {locale,href}=useSiteLanguage(), c=rangeProofCopy[locale];
  const root=useRef<HTMLElement>(null), routing=useRef<HTMLDivElement>(null);
  const uploadHref=flowHref(businessLinks.signup,{plan:'free',returnTo:businessLinks.upload,reportId:null,invalidPlan:false});
  const sample=rangeProofExample;
  const number=new Intl.NumberFormat(locale,{minimumFractionDigits:1,maximumFractionDigits:1}).format(sample.value);
  const chartDescription=locale==='es'
    ? `El mismo ejemplo de hs-CRP de ${number} mg/L está por debajo de la referencia del laboratorio de 5 y por encima del umbral de revisión de riesgo de 2 si persiste. El 5 es el límite de esta referencia del laboratorio y el 2 es un umbral de revisión si persiste. Estas comparaciones no muestran un objetivo óptimo ni diagnostican una enfermedad.`
    : `The same ${number} mg/L hs-CRP example is below the laboratory reference of 5 and above the risk-review threshold of 2 if persistent. The cutoff at 5 is this laboratory reference limit and the cutoff at 2 prompts review if persistent. These comparisons do not show an optimal target or diagnose disease.`;

  useEffect(()=>{
    const element=root.current, trigger=routing.current;
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
      animations.push(trigger.animate([{opacity:.45},{opacity:1}],{duration:500,easing:'cubic-bezier(.22,1,.36,1)'}));
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
    <div className="range-proof-layout">
      <div className="range-proof-story">
        <h2 id="range-proof-title">{c.heading[0]}<br/><em>{c.heading[1]}</em></h2>
        <p className="range-proof-caption">{c.unchangedLabel}</p>
      </div>
      <div className="range-proof-evidence">
        <div className="range-proof-instrument bio-glass">
          <figure className="range-proof-plot" aria-describedby="range-proof-graphic-description" data-range-graphic="relay" data-range-marker>
            <p className="sr-only" id="range-proof-graphic-description">{chartDescription}</p>
            <div className="range-proof-relay">
              <header className="range-proof-readout">
                <div><h3>hs-CRP <span className="range-proof-example">{c.exampleLabel}</span></h3><p className="range-proof-marker-name">{c.markerLabel}</p></div>
                <p className="range-proof-value" data-range-value={sample.value}><span className="sr-only">{number} mg/L</span><span aria-hidden="true"><DotNumber value={number} density="coarse" calm active={false}/><small>mg/L</small></span></p>
              </header>
              <div ref={routing} className="range-proof-routing" aria-hidden="true">
                <svg className="range-proof-routing-narrow" viewBox="0 0 100 28" preserveAspectRatio="none"><path d="M82 0V14H0V28" vectorEffect="non-scaling-stroke"/></svg>
              </div>
              <div className="range-proof-comparisons">
                <div className="range-proof-comparison" data-range-reading="lab" role="group" aria-label={c.lab.label}>
                  <h4>{c.lab.label}</h4>
                  <p className="range-proof-comparison-value" data-range-reference-value={sample.labUpper}>{'<'}{sample.labUpper} <small>{sample.unit}</small></p>
                  <p className="range-proof-comparison-meaning">{c.lab.interpretation}</p>
                </div>
                <div className="range-proof-comparison" data-range-reading="prevention" role="group" aria-label={c.prevention.label}>
                  <h4>{c.prevention.label}</h4>
                  <p className="range-proof-comparison-value" data-range-review-value={sample.preventionLower}>{'>'}{sample.preventionLower} <small>{sample.unit}</small><span className="range-proof-condition">{c.prevention.condition}</span></p>
                  <p className="range-proof-comparison-meaning">{c.prevention.interpretation}</p>
                </div>
              </div>
            </div>
            <figcaption className="range-proof-takeaway"><strong>{c.takeawayLead}</strong><span>{c.takeaway}</span></figcaption>
          </figure>
        </div>
        <p className="range-proof-context">{c.qualifier}</p>
        <details className="range-proof-details">
          <summary><span>{c.detailsLabel}</span><Arrow direction="down"/></summary>
          <div className="range-proof-detail-body">
            <p className="range-proof-lead">{c.lead}</p>
            <p>{c.lab.detail}</p>
            <p>{c.prevention.detail}</p>
            <p>{c.context}</p>
            <div className="range-proof-sources"><p>{c.sourceLabel}</p>{c.sources.map(source=><a key={source.href} href={source.href} target="_blank" rel="noreferrer" data-range-source>{source.label}</a>)}</div>
            <a className="range-proof-method" href={href(businessLinks.science)} data-range-method>{c.methodLink}<Arrow/></a>
          </div>
        </details>
      </div>
      <div className="range-proof-actions">
        <a className="range-proof-primary" href={href(uploadHref)} data-range-upload><span><strong>{c.primary}</strong><small>{c.primarySubtitle}</small></span><Arrow/></a>
      </div>
    </div>
  </section>;
}
