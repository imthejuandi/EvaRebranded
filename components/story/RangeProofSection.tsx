'use client';

import type {CSSProperties} from 'react';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import {businessLinks} from '@/lib/landing-content';
import {flowHref} from '@/lib/preview/policy';
import {rangeProofCopy,rangeProofExample} from '@/lib/site-content/range-proof-copy';
import {Arrow} from './Arrow';
import {DotNumber} from './DotNumber';
import './range-proof-section.css';

/** The dashboard's EvidenceRange dot field, on the comparison's one fixed scale. */
function DashboardRangeLevel({end,value,min,max}:{end:number;value:number;min:number;max:number}) {
  const at=(number:number)=>(number-min)/(max-min)*100;
  return <div className="range-proof-track" data-range-level-end={end} aria-hidden="true">
    <svg className="range-proof-dashboard-level" width="100%" height="48" data-range-dot-field>
      {Array.from({length:55},(_,column)=>Array.from({length:4},(_,row)=>{
        const position=column/54, inside=min+position*(max-min)<end;
        return <circle key={`${column}-${row}`} cx={`${position*100}%`} cy={17+row*7} r={inside?1.7:.8} fill="currentColor" opacity={inside?.62:.22} data-range-dot-column={column} data-range-in-range={inside}/>;
      }))}
      <line x1="0%" x2="0%" y1="8" y2="46" stroke="currentColor" strokeWidth=".7" opacity=".4"/>
      <line x1={`${at(end)}%`} x2={`${at(end)}%`} y1="8" y2="46" stroke="currentColor" strokeWidth=".7" opacity=".4" data-range-boundary={end}/>
    </svg>
    <span className="range-proof-point" data-range-sample={value}/>
  </div>;
}

/** The same measured level against two explicitly labelled, equally scaled intervals. */
export function RangeProofSection({calm=false}: {calm?:boolean}) {
  const {locale,href}=useSiteLanguage(), c=rangeProofCopy[locale];
  const uploadHref=flowHref(businessLinks.signup,{plan:'free',returnTo:businessLinks.upload,reportId:null,invalidPlan:false});
  const sample=rangeProofExample;
  const number=new Intl.NumberFormat(locale,{minimumFractionDigits:1,maximumFractionDigits:1}).format(sample.value);
  const position=(value:number)=>`${(value-sample.axisMin)/(sample.axisMax-sample.axisMin)*100}%`;
  const coordinates={'--range-sample':position(sample.value),'--range-lab-end':position(sample.labUpper),'--range-lower-risk-end':position(sample.lowerRiskUpper)} as CSSProperties;
  const chartDescription=locale==='es'
    ? `Dos bandas en la misma escala lineal de ${sample.axisMin} a ${sample.axisMax} mg/L. La referencia de este laboratorio es inferior a ${sample.labUpper}; la categoría de menor riesgo cardiovascular relativo según hs-CRP es inferior a ${sample.lowerRiskUpper}. El mismo ejemplo de ${number} está dentro de la referencia del laboratorio y fuera de la categoría de menor riesgo. Esta categoría no indica tu riesgo global ni es un objetivo óptimo universal. Más de ${sample.preventionLower} si persiste es un motivo de revisión separado, no una banda óptima.`
    : `Two bands on the same linear ${sample.axisMin} to ${sample.axisMax} mg/L scale. This laboratory reference is below ${sample.labUpper}; the lower relative cardiovascular-risk hs-CRP category is below ${sample.lowerRiskUpper}. The same ${number} example is inside the lab reference and outside the lower-risk category. This category does not indicate your overall risk or a universal optimal target. Above ${sample.preventionLower} if persistent is a separate review trigger, not an optimal band.`;

  return <section className="range-proof" id="otra-lectura" aria-labelledby="range-proof-title" data-range-proof data-range-entry-state="complete" data-range-entry-duration-ms="0">
    <div className="range-proof-layout">
      <div className="range-proof-story">
        <h2 id="range-proof-title">{c.heading[0]}<br/><em>{c.heading[1]}</em></h2>
        <p className="range-proof-caption">{c.unchangedLabel}</p>
      </div>
      <div className="range-proof-evidence">
        <div className="range-proof-instrument bio-glass">
          <figure className="range-proof-plot" aria-describedby="range-proof-graphic-description" data-range-graphic="dashboard-dot-levels" data-range-marker style={coordinates}>
            <p className="sr-only" id="range-proof-graphic-description">{chartDescription}</p>
            <header className="range-proof-readout">
              <div><h3>hs-CRP <span className="range-proof-example">{c.exampleLabel}</span></h3><p className="range-proof-marker-name">{c.markerLabel}</p></div>
              <p className="range-proof-value" data-range-value={sample.value}><span className="sr-only">{number} mg/L</span><span aria-hidden="true"><DotNumber value={number} density="coarse" calm={calm} active={false}/><small>mg/L</small></span></p>
            </header>
            <div className="range-proof-levels" data-range-axis-min={sample.axisMin} data-range-axis-max={sample.axisMax}>
              <div className="range-proof-level" data-range-reading="lab" role="group" aria-label={c.lab.label}>
                <div className="range-proof-level-label"><h4>{c.lab.label}</h4><p className="range-proof-cutoff" data-range-reference-value={sample.labUpper}>{'<'}{sample.labUpper} <small>{sample.unit}</small></p></div>
                <DashboardRangeLevel end={sample.labUpper} value={sample.value} min={sample.axisMin} max={sample.axisMax}/>
                <p className="range-proof-level-meaning">{c.lab.interpretation}</p>
              </div>
              <div className="range-proof-level" data-range-reading="lower-risk" role="group" aria-label={c.lowerRisk.label}>
                <div className="range-proof-level-label"><h4>{c.lowerRisk.label}</h4><p className="range-proof-cutoff" data-range-lower-risk-value={sample.lowerRiskUpper}>{'<'}{sample.lowerRiskUpper} <small>{sample.unit}</small></p></div>
                <DashboardRangeLevel end={sample.lowerRiskUpper} value={sample.value} min={sample.axisMin} max={sample.axisMax}/>
                <p className="range-proof-level-meaning">{c.lowerRisk.interpretation}</p>
              </div>
              <div className="range-proof-scale" aria-hidden="true">{Array.from({length:sample.axisMax-sample.axisMin+1},(_,index)=>index+sample.axisMin).filter(value=>Math.abs(value-sample.value)>=.5).map(value=><span key={value} style={{left:position(value)}}>{value}</span>)}<span className="range-proof-scale-result" style={{left:position(sample.value)}} data-range-scale-result>{number}</span></div>
            </div>
            <p className="range-proof-category-note">{c.categoryNote}</p>
            <figcaption className="range-proof-takeaway"><strong data-range-review-value={sample.preventionLower}>{c.reviewLabel}{': >'}{sample.preventionLower} {sample.unit}</strong><span>{c.takeaway}</span></figcaption>
          </figure>
        </div>
        <p className="range-proof-context">{c.qualifier}</p>
        <details className="range-proof-details">
          <summary><span>{c.detailsLabel}</span><Arrow direction="down"/></summary>
          <div className="range-proof-detail-body">
            <p className="range-proof-lead">{c.lead}</p>
            <p>{c.lab.detail}</p>
            <p>{c.lowerRisk.detail}</p>
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
