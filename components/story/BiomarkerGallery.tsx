'use client';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { Arrow } from './Arrow';
import { useState } from 'react';
import {ExplanationSetting} from './ExplanationSetting';
import {alexStoryCopy} from '@/lib/site-content/alex-story-copy';
import {ResultExplanation} from './ResultExplanation';
import {type ExplanationLevel} from '@/lib/site-content/result-explanation-copy';
import { specimens } from '@/lib/landing-content';
import './sample-dashboard-compact.css';
// Only the fourth reading comes from EVA's public examples. Earlier readings are UI demonstration data.
const history = [['22', '25', '24', '28'], ['2.8', '2.5', '2.7', '2.1'], ['13', '12', '12.5', '11'], ['112', '104', '108', '98'], ['360', '344', '351', '320']];
const shortNames = ['Vitamina D', 'hs-CRP', 'Insulina', 'ApoB', 'Ferritina'];
const views = ['Evolución', 'Rangos', 'Lectura'] as const;
type Point = {
    x: number;
    y: number;
};
function curve(points: Point[]) { return points.map((p, i) => { if (!i)
    return `M${p.x},${p.y}`; const a = points[i - 1], before = points[Math.max(0, i - 2)], after = points[Math.min(points.length - 1, i + 1)]; return `C${a.x + (p.x - before.x) / 6},${a.y + (p.y - before.y) / 6} ${p.x - (after.x - a.x) / 6},${p.y - (after.y - a.y) / 6} ${p.x},${p.y}`; }).join(' '); }
export function BiomarkerGallery({ calm = false }: {
    calm?: boolean;
}) {
    const __site = useSiteLanguage();
    const [selected, setSelected] = useState(1), [reading, setReading] = useState(3), [view, setView] = useState<typeof views[number]>('Lectura');
    const [level, setLevel] = useState<ExplanationLevel>('simple');
    const storyCopy = alexStoryCopy[__site.locale];
    const readingLabel = __site.locale === 'en'
        ? `Reading ${String(reading + 1).padStart(2, '0')} of 04`
        : `Lectura ${String(reading + 1).padStart(2, '0')} de 04`;
    const item = specimens[selected], values = history[selected], value = values[reading], numbers = values.map(Number), low = Math.min(...numbers), high = Math.max(...numbers);
    const points = numbers.map((v, i) => ({ x: 32 + i * 145.3, y: 166 - (v - low) / (high - low || 1) * 106 })), point = points[reading];
    const max = Math.max(item.standard[1], item.eva[1], Number(value)) * 1.1;
    return <section id="biomarcadores" className={'biomarker-lab' + (calm ? ' bio-calm' : '')} aria-labelledby="sample-dashboard-title" data-biomarker-view={view}>
  <div className="bio-layout">
   <details className="sample-dashboard"><summary><span><strong id="sample-dashboard-title">{storyCopy.explore}</strong><small>{storyCopy.exploreDetail}</small></span><Arrow direction="down"/></summary>
   <div className="bio-console" aria-label={__site.t("Demostraci\u00F3n de la interfaz de biomarcadores EVA")}>
    <div className="bio-marker-controls" role="group" aria-label={__site.t("Selecciona un biomarcador")}>
     {specimens.map((marker, i) => <button key={marker.name} type="button" data-biomarker-tile={marker.name} className="bio-marker-button" aria-pressed={selected === i} aria-label={__site.t(marker.name)} onClick={() => setSelected(i)}>{__site.t(shortNames[i])}</button>)}
    </div>
    <div className="bio-console-controls">
     <div className="bio-views" role="group" aria-label={__site.t("Vista del biomarcador")}>{views.map(v => <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}>{__site.t(v)}</button>)}</div>
     {view === 'Lectura' && <div className="bio-setting-toolbar"><ExplanationSetting level={level} onLevel={setLevel} showHint={false}/></div>}
    </div>
    <div className="bio-main bio-glass">
     <div className="bio-main-heading"><div><h3>{__site.t(item.name)}</h3><p>{__site.t(item.detail)}</p></div><span>{__site.t("0")}{__site.t(selected + 1)}{__site.t(" / 05")}</span></div>
     <div className="bio-main-body" key={view + selected}>
      {__site.t(view === 'Evolución' && <div className="bio-chart"><p className="bio-chart-value"><span>{__site.t(value)}</span> {__site.t(item.unit)}</p><svg viewBox="0 0 500 224" role="img" aria-label={__site.t(`${item.name}. Recorrido ilustrativo: ${values.join(', ')} ${item.unit}. Lectura ${reading + 1} seleccionada.`)}><path d="M24 174H476" stroke="currentColor" strokeOpacity=".2" strokeDasharray="1 5"/><path d={curve(points)} fill="none" stroke="currentColor" strokeWidth="1.6"/><path d={`M${point.x} ${point.y}V196`} fill="none" stroke="currentColor" strokeOpacity=".55" strokeDasharray="1 5"/><circle cx={point.x} cy={point.y} r="19" fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeOpacity=".45"/><circle cx={point.x} cy={point.y} r="3.2" fill="currentColor"/></svg></div>)}
      {__site.t(view === 'Rangos' && <div className="bio-range-view"><p className="bio-range-value">{__site.t(value)} <span>{__site.t(item.unit)}</span></p>{__site.t([{ label: 'Intervalo de referencia', range: item.standard }, { label: 'Rango de longevidad EVA', range: item.eva }].map(row => <div className="bio-range-row" key={row.label}><p>{__site.t(row.label)}<span>{__site.t(row.range.join('–'))} {__site.t(item.unit)}</span></p><div aria-hidden="true"><i style={{ left: row.range[0] / max * 100 + '%', width: (row.range[1] - row.range[0]) / max * 100 + '%' }}/><b style={{ left: Number(value) / max * 100 + '%' }}/></div></div>))}</div>)}
      {view === 'Lectura' && <ResultExplanation marker={item.name} value={value} unit={item.unit} level={level} calm={calm}/>}
     </div>
     <div className="bio-period"><button type="button" aria-label={__site.t("Lectura anterior")} disabled={reading === 0} onClick={() => setReading(r => Math.max(0, r - 1))}><Arrow direction="left"/></button><span aria-live="polite" aria-atomic="true">{readingLabel}</span><button type="button" aria-label={__site.t("Siguiente lectura")} disabled={reading === 3} onClick={() => setReading(r => Math.min(3, r + 1))}><Arrow /></button></div>
    </div>
    <details className="bio-range-disclosure">
     <summary><span>{__site.locale === 'en' ? 'View all five biomarkers and ranges' : 'Ver los cinco biomarcadores y sus rangos'}</span><Arrow direction="down"/></summary>
     <div id="bio-range-index" className="bio-range-index"><div className="bio-table-scroll" tabIndex={0} role="region" aria-label={__site.t("Tabla de intervalos de los cinco biomarcadores")}><table><caption>{__site.t("Lectura 04 \u00B7 Valores ilustrativos")}</caption><thead><tr><th scope="col">{__site.t("Biomarcador")}</th><th scope="col">{__site.t("Valor")}</th><th scope="col">{__site.t("Referencia")}</th><th scope="col">{__site.t("EVA")}</th></tr></thead><tbody>{specimens.map(marker => <tr key={marker.name}><th scope="row">{__site.t(marker.name)}<small>{__site.t(marker.unit)}</small></th><td>{__site.t(marker.value)}</td><td>{__site.t(marker.standard.join('–'))}</td><td>{__site.t(marker.eva.join('–'))}</td></tr>)}</tbody></table></div></div>
    </details>
   </div>
   <div className="bio-report-caption"><span className="bio-demo-label"><i />{__site.t("Informe ilustrativo · Algunos marcadores no están en el kit de 13.")}</span><p className="illustration-note">{__site.t("Datos y recorrido ilustrativos. Los intervalos mostrados no son una recomendaci\u00F3n individual; su interpretaci\u00F3n depende del contexto de cada persona.")}</p></div>
   </details>
  </div>
 </section>;
}
