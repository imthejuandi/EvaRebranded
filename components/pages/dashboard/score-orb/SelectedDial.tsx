import type {Locale} from '../../../../lib/preview/model';
import {scoreDialGeometry, signatureTicks} from './score-dial';
import {compareAges, ageComparisonLabel} from './orb-model';
import {DotNumber} from './DotNumber';
import {FittedDialLine} from './FittedDialLine';
import {GlassFluid} from './GlassFluid';
import './selected-dial.css';

const copy = {
  es: {age: 'Edad biológica', estimated: 'estimada', years: 'años', year: 'año', unavailable: 'No disponible', noComparison: 'Sin comparación', comparisonUnavailable: 'Comparación no disponible', provenance: 'Ver procedencia', meaning: 'Ver significado', of: 'de'},
  en: {age: 'Biological age', estimated: 'estimated', years: 'years', year: 'year', unavailable: 'Unavailable', noComparison: 'No comparison', comparisonUnavailable: 'Comparison unavailable', provenance: 'View provenance', meaning: 'View meaning', of: 'of'},
};

/** Approved B lens: the displayed readouts and the 100-mark score ruler remain independent. */
export function SelectedDial({age, score, chronologicalAge, showComparison = true, unavailable, locale, detail, detailId, onExplain}: {
  age: number | null; score: number | null; chronologicalAge: number | null; unavailable: string; locale: Locale;
  showComparison?: boolean;
  detail: 'age' | 'score' | null; detailId: string;
  onExplain: (kind: 'age' | 'score', trigger: HTMLButtonElement) => void;
}) {
  const text = copy[locale], geometry = scoreDialGeometry(score), comparison = showComparison ? compareAges(age, chronologicalAge) : null;
  const format = (n: number) => new Intl.NumberFormat(locale, {maximumFractionDigits: 1}).format(n);
  const difference = comparison ? `${comparison.difference < 0 ? '−' : comparison.difference > 0 ? '+' : ''}${format(Math.abs(comparison.difference))} ${Math.abs(comparison.difference) === 1 ? text.year : text.years}` : null;
  const ageLabel = `${text.age} ${text.estimated}: ${age === null ? unavailable : format(age) + ' ' + text.years}.${showComparison ? comparison ? ` ${ageComparisonLabel(comparison, locale)}.` : age !== null ? ` ${text.comparisonUnavailable}.` : '' : ''} ${text.provenance}`;
  return <div className="selected-dial selected-dial--glass" data-material="biomarker-glass" data-age={age ?? 'unavailable'} data-score={score ?? 'unavailable'} data-score-state={geometry ? 'available' : 'unavailable'}>
    <div className="dial-button-plinth" aria-hidden="true"/>
    <div className="selected-dial-face" aria-hidden="true"><GlassFluid/></div>
    <div className="dial-glass-coating" aria-hidden="true"/><div className="dial-edge-optics" aria-hidden="true"/>
    <svg viewBox="0 0 500 500" className="selected-dial-svg" aria-hidden="true">
      <circle className="dial-boundary" cx="250" cy="250" r="224"/>
      <g className="dial-ticks">{signatureTicks.map((tick, index) => <line key={index} {...tick}/>)}</g>
      <circle className="dial-track" cx="250" cy="250" r="205" pathLength="100"/>
      {geometry && <><path className="dial-score-shadow" d={geometry.path}/><path className="dial-score-arc" d={geometry.path} data-score={score}/></>}
      <circle className="dial-inner-line" cx="250" cy="250" r="185"/>
      {geometry && <circle className="dial-score-tip" cx={geometry.x} cy={geometry.y} r="5"/>}
    </svg>
    <div className="dial-content-boundary">
      <button type="button" className="dial-age" onClick={event => onExplain('age', event.currentTarget)} aria-label={ageLabel} aria-controls={detailId} aria-expanded={detail === 'age'}>
        <span><FittedDialLine>{text.age}</FittedDialLine></span>
        <strong>{age !== null ? <span aria-hidden="true"><DotNumber value={format(age)} density="coarse" calm/></span> : '—'}</strong>
        <small className={comparison ? 'dial-age-comparison' : undefined} aria-hidden={!showComparison || undefined}>{showComparison && <FittedDialLine>{age === null ? unavailable : comparison ? <b>{difference}</b> : text.noComparison}</FittedDialLine>}</small>
      </button>
      <button type="button" className="dial-score" onClick={event => onExplain('score', event.currentTarget)} aria-label={`EVA Score: ${score === null ? unavailable : format(score) + ' ' + text.of + ' 100'}. ${text.meaning}`} aria-controls={detailId} aria-expanded={detail === 'score'}>
        <span className="dial-score-readout"><FittedDialLine><span className="dial-score-label">EVA Score</span>{score === null ? <small className="dial-score-unit">{unavailable}</small> : <><strong className="dial-score-value" aria-hidden="true"><DotNumber value={format(score)} density="coarse" calm/></strong><small className="dial-score-unit">/100</small></>}</FittedDialLine></span>
      </button>
    </div>
  </div>;
}
