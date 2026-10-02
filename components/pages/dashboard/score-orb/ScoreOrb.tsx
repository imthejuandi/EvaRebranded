'use client';

import {useEffect, useId, useRef, useState} from 'react';
import type {Locale} from '../../../../lib/preview/model';
import {zoneLabels} from '../dashboard-reading';
import {compareAges, statusDirection, type OrbMarker} from './orb-model';
import {reportRingGeometry} from './ring-geometry';
import {ReportRing} from './ReportRing';
import {SelectedDial} from './SelectedDial';
import './score-orb.css';

const symbols = {optimal: '=', above: '↑', below: '↓', unknown: '—'} as const;
const comparisonPreferenceKey = 'eva.age-comparison.visibility.v1';
const privacyCopy = {
  es: {label: 'Mostrar diferencia de edad', hint: 'Ocúltala para compartir la esfera sin revelar tu edad cronológica.'},
  en: {label: 'Show age difference', hint: 'Hide it to share the sphere without revealing your chronological age.'},
};
const copy = {
  es: {markers: 'Biomarcadores del informe', select: 'Selecciona una señal para ver su resultado.', empty: 'Este informe no tiene biomarcadores disponibles.', noComparison: 'Sin comparación', unavailable: 'No disponible', close: 'Cerrar resultado', explanation: 'Las formas indican el estado de los resultados del informe; no sus aportaciones a las estimaciones.', shape: 'Cómo leer la forma', states: ['En intervalo', 'Por encima', 'Por debajo', 'Sin clasificar'], shapes: ['Se alinea', 'Se expande', 'Se recoge', 'Queda abierto']},
  en: {markers: 'Report biomarkers', select: 'Select a signal to see its result.', empty: 'This report has no available biomarkers.', noComparison: 'No comparison', unavailable: 'Unavailable', close: 'Close result', explanation: 'The shapes show the status of report results, not their contributions to the estimates.', shape: 'How to read the shape', states: ['Within interval', 'Above interval', 'Below interval', 'Unclassified'], shapes: ['Aligned', 'Expands', 'Folds inward', 'Open trace']},
};

export function ScoreOrb({markers, age, score, chronologicalAge, locale, unavailable, detail, detailId, onExplain, onMarkerSelect}: {
  markers: readonly OrbMarker[]; age: number | null; score: number | null; chronologicalAge: number | null; locale: Locale; unavailable: string;
  detail: 'age' | 'score' | null; detailId: string;
  onExplain: (kind: 'age' | 'score', trigger: HTMLButtonElement) => void;
  onMarkerSelect: () => void;
}) {
  const id = useId(), lastTrigger = useRef<HTMLButtonElement | HTMLSelectElement | null>(null), ignoreRestoredFocus = useRef(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null), [hoveredKey, setHoveredKey] = useState<string | null>(null);
  // Start concealed so a saved privacy choice never flashes during hydration.
  const [showComparison, setShowComparison] = useState(false), [privacyReady, setPrivacyReady] = useState(false);
  const canCompare = compareAges(age, chronologicalAge) !== null;
  useEffect(() => {
    const readPreference = () => {
      try {setShowComparison(window.localStorage.getItem(comparisonPreferenceKey) !== 'hidden');}
      catch {setShowComparison(false);}
      setPrivacyReady(true);
    };
    readPreference();
    const syncPreference = (event: StorageEvent) => {
      if (event.key === comparisonPreferenceKey || event.key === null) readPreference();
    };
    window.addEventListener('storage', syncPreference);
    return () => window.removeEventListener('storage', syncPreference);
  }, []);
  const toggleComparison = () => {
    const next = !showComparison;
    setShowComparison(next);
    // Store only a display preference, never an age, date or report value.
    try {window.localStorage.setItem(comparisonPreferenceKey, next ? 'visible' : 'hidden');} catch { /* The control still works for this view. */ }
  };
  const selected = markers.find(marker => marker.key === (hoveredKey ?? selectedKey)), activeKey = selected?.key ?? null;
  const text = copy[locale], layout = reportRingGeometry(markers);
  const number = (value: number) => new Intl.NumberFormat(locale, {maximumSignificantDigits: 12}).format(value);
  const display = (marker: OrbMarker) => marker.value === null
    ? marker.reportedValue?.trim() ? `${marker.reportedValue}${marker.reportedUnit ?? marker.unit ? ' ' + (marker.reportedUnit ?? marker.unit) : ''}` : text.unavailable
    : `${number(marker.value)}${marker.unit ? ' ' + marker.unit : ''}`;
  const interval = (marker: OrbMarker) => {
    const low = marker.optimalLow, high = marker.optimalHigh;
    if (!marker.unit || low == null && high == null) return null;
    if (low != null && high != null && low > high) return null;
    return `${low == null ? '≤ ' + number(high!) : high == null ? '≥ ' + number(low) : number(low) + '–' + number(high)} ${marker.unit}`;
  };
  const choose = (key: string | null, trigger: HTMLButtonElement | HTMLSelectElement) => {
    lastTrigger.current = trigger;
    setSelectedKey(current => current === key ? null : key);
    setHoveredKey(null);
    onMarkerSelect();
  };
  const restoreFocus = () => {ignoreRestoredFocus.current = true; lastTrigger.current?.focus({preventScroll: true}); ignoreRestoredFocus.current = false;};
  const close = () => {setSelectedKey(null); setHoveredKey(null); restoreFocus();};
  useEffect(() => {
    if (!selected) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape' || event.defaultPrevented) return;
      setSelectedKey(null); setHoveredKey(null); restoreFocus();
    };
    document.addEventListener('keydown', onEscape);
    return () => document.removeEventListener('keydown', onEscape);
  }, [selected?.key]);
  return <div className="score-orb" data-report-marker-count={markers.length}>
    <div className="score-orb-stage">
      {markers.length > 0 && <svg className="score-orb-guides" viewBox="0 0 1000 1000" aria-hidden="true"><circle cx="500" cy="500" r="395"/>{layout.anchors.map(anchor => <line key={anchor.key} x1={anchor.x * 1000} y1={anchor.y * 1000} x2={anchor.targetX * 1000} y2={anchor.targetY * 1000}/>)}</svg>}
      <ReportRing markers={markers} activeKey={activeKey}/>
      <SelectedDial age={age} score={score} chronologicalAge={chronologicalAge} showComparison={!canCompare || showComparison} locale={locale} unavailable={unavailable} detail={detail} detailId={detailId} onExplain={(kind, trigger) => {setSelectedKey(null); setHoveredKey(null); onExplain(kind, trigger);}}/>
      {markers.length <= 20 && <div className="score-orb-nodes" role="group" aria-label={text.markers}>
        {layout.anchors.map((anchor, index) => {
          const marker = markers[index], direction = statusDirection(marker.zone);
          return <button type="button" key={anchor.key} className="score-orb-node" data-state={direction} data-marker={marker.key} style={{left: `${anchor.x * 100}%`, top: `${anchor.y * 100}%`}}
            aria-pressed={selectedKey === marker.key} aria-controls={`${id}-result`} aria-label={`${marker.name}: ${display(marker)}. ${zoneLabels[locale][marker.zone]}`}
            onClick={event => choose(marker.key, event.currentTarget)}
            onPointerEnter={event => {if (event.pointerType === 'mouse') setHoveredKey(marker.key);}} onPointerLeave={() => setHoveredKey(null)}
            onFocus={event => {if (!ignoreRestoredFocus.current) {lastTrigger.current = event.currentTarget; setHoveredKey(marker.key); onMarkerSelect();}}} onBlur={() => setHoveredKey(null)}>
            <span className="score-orb-node-center" aria-hidden="true">{symbols[direction]}</span><span className="score-orb-node-name" aria-hidden="true">{marker.name}</span>{marker.zone.startsWith('critical') && <span className="score-orb-critical" aria-hidden="true">!</span>}
          </button>;
        })}
      </div>}
    </div>
    {canCompare && <div className="score-orb-privacy">
      <button type="button" role="switch" aria-checked={showComparison} aria-describedby={`${id}-privacy-hint`} disabled={!privacyReady} onClick={toggleComparison}>
        <span>{privacyCopy[locale].label}</span><span className="score-orb-privacy-track" aria-hidden="true"><i/></span>
      </button>
      <p id={`${id}-privacy-hint`}>{privacyCopy[locale].hint}</p>
    </div>}
    <div className="score-orb-caption"><span>{text.markers}</span><p>{markers.length ? text.select : text.empty}</p></div>
    {markers.length > 20 && <label className="score-orb-select">{text.markers}<select value={selected?.key ?? ''} onChange={event => choose(event.target.value || null, event.currentTarget)}><option value="">{text.select}</option>{markers.map(marker => <option key={marker.key} value={marker.key}>{marker.name} · {display(marker)} · {zoneLabels[locale][marker.zone]}</option>)}</select></label>}
    <div id={`${id}-result`} className="score-orb-result" hidden={!selected} aria-live="polite">
      {selected && <><div><span>{selected.category ?? text.markers}</span><strong>{selected.name}</strong><p>{display(selected)}<span> · {zoneLabels[locale][selected.zone]}</span></p>{interval(selected) && <p className="score-orb-result-range">{locale === 'es' ? 'Intervalo del informe' : 'Report interval'} · {interval(selected)}</p>}</div><button type="button" onClick={close} aria-label={text.close}><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17" fill="none" stroke="currentColor" strokeWidth="1.3"/></svg></button></>}
    </div>
    {markers.length > 0 && <><div className="score-orb-shape-key" role="group" aria-label={text.shape}>
      <span><svg viewBox="0 0 34 24" aria-hidden="true"><path d="M2 12H32"/><circle cx="17" cy="12" r="3"/></svg><b>{text.states[0]}</b><small>{text.shapes[0]}</small></span>
      <span><svg viewBox="0 0 34 24" aria-hidden="true"><path d="M2 16H32 M17 16V4m-4 4 4-4 4 4"/><circle cx="17" cy="4" r="2"/></svg><b>{text.states[1]}</b><small>{text.shapes[1]}</small></span>
      <span><svg viewBox="0 0 34 24" aria-hidden="true"><path d="M2 8H32 M17 8V20m-4-4 4 4 4-4"/><circle cx="17" cy="20" r="2"/></svg><b>{text.states[2]}</b><small>{text.shapes[2]}</small></span>
      <span><svg viewBox="0 0 34 24" aria-hidden="true"><path d="M2 12H12m10 0h10" strokeDasharray="2 3"/></svg><b>{text.states[3]}</b><small>{text.shapes[3]}</small></span>
    </div><p className="score-orb-source-note">{text.explanation}</p></>}
  </div>;
}
