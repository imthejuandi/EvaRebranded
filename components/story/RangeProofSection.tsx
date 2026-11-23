'use client';

import {useEffect,useRef,type CSSProperties} from 'react';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {businessLinks} from '@/lib/landing-content';
import {flowHref} from '@/lib/preview/policy';
import {rangeProofCopy,rangeProofExample} from '@/lib/site-content/range-proof-copy';
import {Arrow} from './Arrow';
import {DotNumber} from './DotNumber';
import './range-proof-section.css';

/** One unchanged result, its illustrative report interval, and a qualified prevention reading. */
export function RangeProofSection({calm=false}: {calm?:boolean}) {
  const {locale,href}=useSiteLanguage(), c=rangeProofCopy[locale];
  const root=useRef<HTMLElement>(null), prevention=useRef<HTMLDivElement>(null);
  const uploadHref=flowHref(businessLinks.signup,{plan:'free',returnTo:businessLinks.upload,reportId:null,invalidPlan:false});
  const sample=rangeProofExample;
  const number=new Intl.NumberFormat(locale,{minimumFractionDigits:1,maximumFractionDigits:1}).format(sample.value);
  const percent=(value:number)=>(value-sample.axisMin)/(sample.axisMax-sample.axisMin)*100;
  const graphicStyle={
    '--range-reading-position':`${percent(sample.value)}%`,
    '--range-lab-end':`${percent(sample.labUpper)}%`,
    '--range-prevention-start':`${percent(sample.preventionLower)}%`,
    '--range-overlap-width':`${percent(sample.labUpper)-percent(sample.preventionLower)}%`,
  } as CSSProperties;
  const chartDescription=locale==='es'
    ? `El mismo ejemplo de hs-CRP de ${number} mg/L está por debajo de la referencia del laboratorio de 5 y por encima del umbral de revisión de riesgo de 2 si persiste. La zona compartida entre 2 y 5 muestra que ambas interpretaciones pueden ser ciertas; no representa una probabilidad de enfermedad.`
    : `The same ${number} mg/L hs-CRP example is below the laboratory reference of 5 and above the risk-review threshold of 2 if persistent. The shared area between 2 and 5 shows that both interpretations can apply; it is not a disease probability.`;

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
    <div className="range-proof-layout">
      <div className="range-proof-story">
        <h2 id="range-proof-title">{c.heading[0]}<br/><em>{c.heading[1]}</em></h2>
        <p className="range-proof-caption">{c.unchangedLabel}</p>
      </div>
      <div className="range-proof-evidence">
        <div className="range-proof-instrument bio-glass">
          <header className="range-proof-readout">
            <div><h3>hs-CRP</h3><p className="range-proof-marker-name">{c.markerLabel}</p><p className="range-proof-example">{c.exampleLabel}</p></div>
            <p className="range-proof-value" data-range-value={sample.value}><span className="sr-only">{number} mg/L</span><span aria-hidden="true"><DotNumber value={number} density="coarse" calm active={false}/><small>mg/L</small></span></p>
          </header>
          <figure className="range-proof-plot" style={graphicStyle} aria-describedby="range-proof-graphic-description" data-range-axis-min={sample.axisMin} data-range-axis-max={sample.axisMax} data-range-marker>
            <p className="sr-only" id="range-proof-graphic-description">{chartDescription}</p>
            <div className="range-proof-window">
              <div className="range-proof-overlap" data-range-overlap aria-hidden="true"/>
              <div className="range-proof-readings">
                <div className="range-proof-reading" data-range-reading="lab">
                  <p className="range-proof-reading-label">{c.lab.label}<span>{c.lab.threshold}</span></p>
                  <div className="range-proof-lane range-proof-lab-lane" aria-hidden="true"><span data-range-lab-band/><i className="range-proof-lab-boundary"/><i className="range-proof-fixed-point"/></div>
                </div>
                <div ref={prevention} className="range-proof-reading range-proof-prevention" data-range-reading="prevention">
                  <p className="range-proof-reading-label">{c.prevention.label}<span>{c.prevention.threshold}</span></p>
                  <div className="range-proof-lane range-proof-prevention-lane" aria-hidden="true"><span data-range-prevention-band/><i className="range-proof-threshold"/><i className="range-proof-fixed-point"/></div>
                </div>
              </div>
            </div>
            <div className="range-proof-axis" aria-hidden="true">{Array.from({length:sample.axisMax-sample.axisMin+1},(_,i)=>sample.axisMin+i).map(tick=><span key={tick}>{tick}</span>)}</div>
            <figcaption className="range-proof-takeaway"><strong>{c.takeawayLead}</strong>{' '}{c.takeaway}</figcaption>
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
