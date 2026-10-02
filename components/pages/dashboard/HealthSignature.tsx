'use client';

import {useEffect, useId, useRef, useState} from 'react';
import type {Locale} from '../../../lib/preview/model';
import type {DashboardMarker} from './dashboard-reading';
import {signatureReadouts, type SignatureReport} from './health-signature-motion';
import type {DashboardReportResult} from '../../../lib/dashboard/backend-contract';
import {ScoreOrb} from './score-orb/ScoreOrb';
import {backendReportOrbMarkers, chronologicalAgeAt, referenceCalendarDate, reportOrbMarkers} from './score-orb/orb-model';
import './health-signature.css';

const copy = {
  es: {
    title: 'Tu firma biológica.', label: 'UNA LECTURA, MUCHAS SEÑALES', sample: 'Ejemplo', reading: '01 / TU LECTURA',
    score: 'EVA Score', age: 'Edad biológica', estimated: 'estimada', years: 'años', unavailable: 'No disponible', locked: 'Con tu plan EVA',
    report: 'Informe', markers: 'biomarcadores', areas: 'áreas de salud', explore: 'Explorar mi lectura', note: 'Dos estimaciones complementarias',
    source: 'Ver informe', details: 'Método y procedencia', plans: 'Explorar planes', reportEstimate: 'De este informe', profileEstimate: 'Estimación actual de tu perfil', computed: 'Calculada el', grade: 'Grado',
    meaning: 'Ver significado', ring: 'El arco interior representa EVA Score', ageInfo: 'Ver origen y método de la edad biológica', scoreInfo: 'Ver origen y método de EVA Score', close: 'Cerrar explicación',
    ageExplanation: 'La edad biológica es una estimación expresada en años. Consulta el método y las muestras que la respaldan.',
    scoreExplanation: 'La longitud del arco interior representa EVA Score en una escala de 1 a 100. No representa un porcentaje de salud ni una probabilidad.',
    ageMissing: 'Esta lectura no tiene una estimación de edad biológica disponible.', scoreMissing: 'Este informe no tiene un EVA Score disponible. El arco queda vacío.',
  },
  en: {
    title: 'Your biological signature.', label: 'ONE READING, MANY SIGNALS', sample: 'Example', reading: '01 / YOUR READING',
    score: 'EVA Score', age: 'Biological age', estimated: 'estimated', years: 'years', unavailable: 'Unavailable', locked: 'With your EVA plan',
    report: 'Report', markers: 'biomarkers', areas: 'health areas', explore: 'Explore my reading', note: 'Two complementary estimates',
    source: 'View report', details: 'Method and provenance', plans: 'Explore plans', reportEstimate: 'From this report', profileEstimate: 'Current profile estimate', computed: 'Calculated on', grade: 'Grade',
    meaning: 'View meaning', ring: 'The inner arc represents EVA Score', ageInfo: 'View the source and method for biological age', scoreInfo: 'View the source and method for EVA Score', close: 'Close explanation',
    ageExplanation: 'Biological age is an estimate expressed in years. Review the method and samples behind it.',
    scoreExplanation: 'The length of the inner arc represents EVA Score on a scale of 1 to 100. It is not a percentage of health or a probability.',
    ageMissing: 'This reading has no biological age estimate available.', scoreMissing: 'This report has no EVA Score available. The arc remains empty.',
  },
};

function Arrow({down = false}: {down?: boolean}) {
  return <svg viewBox="0 0 24 24" aria-hidden="true" style={down ? {transform: 'rotate(90deg)'} : undefined}><path d="M4 12h15m-6-6 6 6-6 6" fill="none" stroke="currentColor" strokeWidth="1.3"/></svg>;
}

export interface HealthSignatureProps {
  report: SignatureReport;
  paid: boolean;
  profile: Parameters<typeof signatureReadouts>[2] & {dateOfBirth?: string | null};
  markers?: DashboardMarker[];
  reportResults?: readonly DashboardReportResult[];
  locale?: Locale;
  source?: 'preview' | 'backend';
  reportHref?: string;
  /** Only supply a verified reference date for the selected biological-age estimate.
   * A profile calculation timestamp is not its included-sample reference date. */
  ageReferenceDate?: string | null;
}

/** Anillo B: independent estimates inside a report-owned biomarker field. */
export function HealthSignature({report, paid, profile, markers, reportResults, locale = 'es', source = 'preview', reportHref, ageReferenceDate}: HealthSignatureProps) {
  const id = useId(), lastTrigger = useRef<HTMLButtonElement | null>(null);
  const [detail, setDetail] = useState<'age' | 'score' | null>(null);
  useEffect(() => {
    if (!detail) return;
    // Safari can leave pointer focus outside the trigger; Escape still dismisses this disclosure.
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      setDetail(null);
      lastTrigger.current?.focus({preventScroll: true});
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [detail]);
  const text = copy[locale], values = signatureReadouts(report, paid, profile);
  const reportMarkers = reportResults !== undefined
    ? backendReportOrbMarkers(reportResults, report.id, values.readable)
    : reportOrbMarkers(markers ?? [], report.markerKeys, values.readable);
  // Preview categories are display metadata only; result values and states stay source-owned.
  const categoriesByKey = new Map((markers ?? []).map(marker => [marker.key, marker.category]));
  const orbMarkers = source === 'preview'
    ? reportMarkers.map(marker => ({...marker, category: categoriesByKey.get(marker.key) ?? marker.category}))
    : reportMarkers;
  const categories = Array.from(new Set(orbMarkers.map(marker => marker.category).filter(Boolean)));
  const chronologicalAge = values.age !== null
    ? chronologicalAgeAt(profile.dateOfBirth, referenceCalendarDate(ageReferenceDate)) : null;
  const formatDate = (value: string) => new Intl.DateTimeFormat(locale, {day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC'}).format(new Date(value));
  const date = Number.isFinite(Date.parse(report.date)) ? formatDate(report.date) : '';
  const computedDate = values.ageComputedAt ? formatDate(values.ageComputedAt) : '';
  const unavailable = !paid && values.readable ? text.locked : text.unavailable;
  const ageSource = values.ageSource === 'profile' ? text.profileEstimate : text.reportEstimate;
  const openDetail = (kind: 'age' | 'score', trigger: HTMLButtonElement) => {
    lastTrigger.current = trigger;
    setDetail(current => current === kind ? null : kind);
  };
  const closeDetail = () => {setDetail(null); lastTrigger.current?.focus({preventScroll: true});};
  const methodLink = <a href="#dashboard-estimate-method" onClick={() => {
    const disclosure = document.getElementById('dashboard-estimate-method');
    if (disclosure instanceof HTMLDetailsElement) disclosure.open = true;
  }}>{text.details}<Arrow/></a>;

  return <section id="dashboard-signature" className="health-signature" aria-labelledby={`${id}-title`} data-signature-design="anillo" data-signature-source={source} data-signature-report={values.readable ? report.id : undefined}>
    <div className="health-signature-heading"><div><p>{text.label}</p><h2 id={`${id}-title`}>{text.title}</h2></div>{source === 'preview' && <span className="health-signature-example">{text.sample}</span>}</div>
    <div className="health-signature-device">
      <div className="health-signature-device-top"><span>{text.reading}</span><span>{text.report}{values.readable && date && <> · {date}</>}</span></div>
      <ScoreOrb key={values.readable ? report.id : 'unavailable'} markers={orbMarkers} age={values.age} score={values.score} chronologicalAge={chronologicalAge} locale={locale} unavailable={unavailable} detail={detail} detailId={`${id}-detail`} onExplain={openDetail} onMarkerSelect={() => setDetail(null)}/>
      <div className="health-signature-legend">
        <div><i aria-hidden="true"/><div><span>{text.age} {text.estimated}</span>{values.ageSource && <p className="health-signature-provenance" data-age-source={values.ageSource}>{ageSource}{computedDate && <> · {text.computed} {computedDate}</>}{values.ageSource === 'report' && date && <> · {date}</>}</p>}</div><button type="button" onClick={event => openDetail('age', event.currentTarget)} aria-label={text.ageInfo} aria-controls={`${id}-detail`} aria-expanded={detail === 'age'}><span aria-hidden="true">i</span></button></div>
        <div><i aria-hidden="true"/><div><span>{text.ring}</span>{values.score !== null && <p className="health-signature-provenance">{text.reportEstimate}{date && <> · {date}</>}{values.grade && <> · {text.grade}: {values.grade}</>}</p>}</div><button type="button" onClick={event => openDetail('score', event.currentTarget)} aria-label={text.scoreInfo} aria-controls={`${id}-detail`} aria-expanded={detail === 'score'}><span aria-hidden="true">i</span></button></div>
      </div>
      <div className="health-signature-device-bottom">{(markers !== undefined || reportResults !== undefined) && <p>{values.readable ? <><strong>{orbMarkers.length}</strong> {text.markers}{categories.length > 0 && <><span> / </span><strong>{categories.length}</strong> {text.areas}</>}</> : text.unavailable}</p>}{values.readable && <a href={reportHref ?? `/${locale}/labs/${report.id}`}>{text.source}<Arrow/></a>}</div>
    </div>
    <div id={`${id}-detail`} className="health-signature-detail" hidden={detail === null}>
      {detail && <><div><h3>{detail === 'age' ? `${text.age} ${text.estimated}` : text.score}</h3><p>{detail === 'age' ? values.age !== null ? text.ageExplanation : values.allowed ? text.ageMissing : unavailable : values.score !== null ? text.scoreExplanation : values.allowed ? text.scoreMissing : unavailable}</p>{methodLink}</div><button type="button" onClick={closeDetail} aria-label={text.close}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" fill="none" stroke="currentColor" strokeWidth="1.3"/></svg></button></>}
    </div>
    <div className="health-signature-footer"><div><p>{text.note}</p>{methodLink}</div><a className="health-signature-explore" href={values.readable ? paid ? '#dashboard-reading' : `/${locale}/pricing` : `/${locale}/labs`}>{!paid && values.readable ? text.plans : text.explore}<Arrow down={paid}/></a></div>
  </section>;
}
