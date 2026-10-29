'use client';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { Arrow } from './Arrow';
import { useState } from 'react';
import { specimens } from '@/lib/landing-content';
import { DotNumber } from './DotNumber';
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
    const [selected, setSelected] = useState(0), [reading, setReading] = useState(3), [view, setView] = useState<typeof views[number]>('Evolución'), [expanded, setExpanded] = useState(false);
    const item = specimens[selected], values = history[selected], value = values[reading], numbers = values.map(Number), low = Math.min(...numbers), high = Math.max(...numbers);
    const points = numbers.map((v, i) => ({ x: 32 + i * 145.3, y: 166 - (v - low) / (high - low || 1) * 106 })), point = points[reading];
    const max = Math.max(item.standard[1], item.eva[1], Number(value)) * 1.1;
    return <section id="biomarcadores" className={'biomarker-lab' + (calm ? ' bio-calm' : '')} aria-labelledby="markers-title" data-biomarker-view={view}>
  <div className="section-kicker"><span>{__site.t("03 / LO QUE CUENTAN TUS DATOS")}</span><span>{__site.t("UNA LECTURA CON CONTEXTO")}</span></div>
  <div className="bio-layout">
   <div className="bio-intro"><p className="eyebrow">{__site.t("TUS CIFRAS, CON OTRA PERSPECTIVA")}</p><h2 id="markers-title">{__site.t("Conocerte.")}<br />{__site.t("Y ver c\u00F3mo")}<br /><em>{__site.t("cambias.")}</em></h2><p>{__site.t("Tus resultados, reunidos para que puedas compararlos.")}</p><p>{__site.t("Explora cinco ejemplos. Cambia de lectura para ver su evoluci\u00F3n y compara los intervalos de referencia con los rangos de EVA.")}</p><span className="bio-demo-label"><i />{__site.t(" Demostraci\u00F3n con datos ilustrativos")}</span></div>
   <div className="bio-console" aria-label={__site.t("Demostraci\u00F3n de la interfaz de biomarcadores EVA")}>
    <div className="bio-console-head"><a href={__site.href("#una-perspectiva")} className="bio-round" aria-label={__site.t("Volver a la perspectiva de salud")}><Arrow direction="up-left"/></a><span>{__site.t("Tu salud, en perspectiva")}</span><details className="bio-info"><summary aria-label={__site.t("Acerca de esta demostraci\u00F3n")}>{__site.t("i")}</summary><p>{__site.t("Esta demostraci\u00F3n re\u00FAne cuatro lecturas trimestrales ilustrativas. No corresponde a una persona ni anticipa tus resultados.")}</p></details></div>
    <div className="bio-views" role="group" aria-label={__site.t("Vista del biomarcador")}>{__site.t(views.map(v => <button key={v} aria-pressed={view === v} onClick={() => setView(v)}>{__site.t(v)}</button>))}</div>
    <div className="bio-main bio-glass">
     <div className="bio-main-heading"><div><h3>{__site.t(item.name)}</h3><p>{__site.t(item.detail)}</p></div><span>{__site.t("0")}{__site.t(selected + 1)}{__site.t(" / 05")}</span></div>
     <div className="bio-main-body" key={view + selected}>
      {__site.t(view === 'Evolución' && <div className="bio-chart"><p className="bio-chart-value"><span>{__site.t(value)}</span> {__site.t(item.unit)}</p><svg viewBox="0 0 500 224" role="img" aria-label={__site.t(`${item.name}. Recorrido ilustrativo: ${values.join(', ')} ${item.unit}. Lectura ${reading + 1} seleccionada.`)}><path d="M24 174H476" stroke="currentColor" strokeOpacity=".2" strokeDasharray="1 5"/><path d={curve(points)} fill="none" stroke="currentColor" strokeWidth="1.6"/><path d={`M${point.x} ${point.y}V196`} fill="none" stroke="currentColor" strokeOpacity=".55" strokeDasharray="1 5"/><circle cx={point.x} cy={point.y} r="19" fill="currentColor" fillOpacity=".12" stroke="currentColor" strokeOpacity=".45"/><circle cx={point.x} cy={point.y} r="3.2" fill="currentColor"/></svg></div>)}
      {__site.t(view === 'Rangos' && <div className="bio-range-view"><p className="bio-range-value">{__site.t(value)} <span>{__site.t(item.unit)}</span></p>{__site.t([{ label: 'Intervalo de referencia', range: item.standard }, { label: 'Rango de longevidad EVA', range: item.eva }].map(row => <div className="bio-range-row" key={row.label}><p>{__site.t(row.label)}<span>{__site.t(row.range.join('–'))} {__site.t(item.unit)}</span></p><div aria-hidden="true"><i style={{ left: row.range[0] / max * 100 + '%', width: (row.range[1] - row.range[0]) / max * 100 + '%' }}/><b style={{ left: Number(value) / max * 100 + '%' }}/></div></div>))}</div>)}
      {__site.t(view === 'Lectura' && <div className="bio-focus-reading"><DotNumber value={value} calm={calm} density="coarse"/><span>{__site.t(item.unit)}</span><p>{__site.t("Lectura 0")}{__site.t(reading + 1)}{__site.t(" \u00B7 ")}{__site.t(item.name)}</p></div>)}
     </div>
     <div className="bio-reading-points" role="group" aria-label={__site.t("Lecturas trimestrales")}>{__site.t(values.map((v, i) => <button key={i} aria-pressed={reading === i} aria-label={__site.t(`Lectura ${i + 1}: ${v} ${item.unit}`)} onClick={() => setReading(i)}><span>{__site.t("0")}{__site.t(i + 1)}</span></button>))}</div>
     <div className="bio-period"><button aria-label={__site.t("Lectura anterior")} disabled={reading === 0} onClick={() => setReading(r => Math.max(0, r - 1))}><Arrow direction="left"/></button><span>{__site.t("Lectura 0")}{__site.t(reading + 1)} <i>{__site.t("\u00B7")}</i>{__site.t(" Recorrido ilustrativo")}</span><button aria-label={__site.t("Siguiente lectura")} disabled={reading === 3} onClick={() => setReading(r => Math.min(3, r + 1))}><Arrow /></button></div>
    </div>
    <div className="bio-tiles" role="group" aria-label={__site.t("Selecciona un biomarcador")}>{__site.t(specimens.map((marker, i) => <button key={marker.name} data-biomarker-tile={marker.name} className={'bio-tile bio-glass bio-tone-' + i} aria-pressed={selected === i} aria-label={__site.t(`${marker.name}: ${history[i][reading]} ${marker.unit}`)} onClick={() => setSelected(i)}><span className="bio-tile-name">{__site.t(shortNames[i])}</span><div className="bio-tile-value"><DotNumber value={history[i][reading]} calm={calm} density="coarse"/></div><div className="bio-tile-meta"><span>{__site.t(marker.unit)}</span><span className="bio-tile-period">{__site.t("L")}{__site.t(reading + 1)}</span></div></button>))}<button className="bio-all-ranges" aria-expanded={expanded} aria-controls="bio-range-index" onClick={() => setExpanded(v => !v)}><span aria-hidden="true">{__site.t(expanded ? '−' : '+')}</span><span>{__site.t(expanded ? 'Cerrar tabla' : 'Ver los cinco biomarcadores')}</span></button></div>
    <div id="bio-range-index" hidden={!expanded} className="bio-range-index"><div className="bio-table-scroll" tabIndex={0} role="region" aria-label={__site.t("Tabla de intervalos de los cinco biomarcadores")}><table><caption>{__site.t("Lectura 04 \u00B7 Valores ilustrativos")}</caption><thead><tr><th scope="col">{__site.t("Biomarcador")}</th><th scope="col">{__site.t("Valor")}</th><th scope="col">{__site.t("Referencia")}</th><th scope="col">{__site.t("EVA")}</th></tr></thead><tbody>{__site.t(specimens.map(marker => <tr key={marker.name}><th scope="row">{__site.t(marker.name)}<small>{__site.t(marker.unit)}</small></th><td>{__site.t(marker.value)}</td><td>{__site.t(marker.standard.join('–'))}</td><td>{__site.t(marker.eva.join('–'))}</td></tr>))}</tbody></table></div></div>
    <div className="bio-console-foot"><span>{__site.t("eva")}</span><p>{__site.t("Tus resultados.")}<br />{__site.t("A lo largo del tiempo.")}</p></div>
   </div>
  </div>
  <p className="illustration-note">{__site.t("Datos y recorrido ilustrativos. Los intervalos mostrados no son una recomendaci\u00F3n individual; su interpretaci\u00F3n depende del contexto de cada persona.")}</p>
 </section>;
}
