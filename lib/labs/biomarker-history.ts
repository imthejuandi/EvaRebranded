import type {Locale, ServerZone} from '../preview/model';

/** Canonical values and persisted prose from one authorized report. */
export interface BiomarkerObservation {
  reportId: string; key: string; name: string; date: string; value: number | null;
  unit: string | null; source: string | null; zone: ServerZone | null;
  interpretation: {es: string | null; en: string | null};
  comparator?: '<' | '>' | null;
}
export type HistoryDirection = 'up' | 'down' | 'unchanged' | 'mixed' | 'insufficient';
export interface BiomarkerHistoryModel {
  points: BiomarkerObservation[]; records: BiomarkerObservation[]; latest: BiomarkerObservation | null;
  start: string | null; end: string | null; cutoff: string | null;
  direction: HistoryDirection; change: number | null; recentChange: number | null;
  excludedUnits: number; mixedSources: boolean;
}
export const validHistoryDate = (value: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(value)
  && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0,10) === value;
export function yearBefore(date: string): string {
  const [year,month,day] = date.split('-').map(Number);
  const lastDay = new Date(Date.UTC(year-1,month,0)).getUTCDate();
  return new Date(Date.UTC(year-1,month-1,Math.min(day,lastDay))).toISOString().slice(0,10);
}
const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

/** View extent is the actual observations, capped at a calendar year ending at this marker's latest sample.
 * Report selection is an as-of boundary: a past report never acquires later measurements. */
export function biomarkerHistory(observations: readonly BiomarkerObservation[], key: string, asOf: string, selectedReportId?: string): BiomarkerHistoryModel {
  const empty: BiomarkerHistoryModel = {points:[],records:[],latest:null,start:null,end:null,cutoff:null,direction:'insufficient',change:null,recentChange:null,excludedUnits:0,mixedSources:false};
  if (!validHistoryDate(asOf)) return empty;
  const candidates = observations.filter(p => p.key === key && validHistoryDate(p.date) && p.date <= asOf)
    .sort((a,b) => a.date.localeCompare(b.date) || (a.reportId === selectedReportId ? 1 : b.reportId === selectedReportId ? -1 : a.reportId.localeCompare(b.reportId)));
  // An ambiguous duplicate must not become an arbitrary or repeated lab observation.
  const identities = new Map<string,number>();
  candidates.forEach(p => identities.set(p.reportId,(identities.get(p.reportId) ?? 0)+1));
  const rows = candidates.filter(p => identities.get(p.reportId) === 1);
  const latest = rows.at(-1) ?? null;
  if (!latest) return empty;
  const cutoff = yearBefore(latest.date);
  const window = rows.filter(p => p.date >= cutoff);
  const currentComparable = finite(latest.value) && !latest.comparator && Boolean(latest.unit?.trim());
  const unit = latest.unit?.trim() || [...window].reverse().find(p => finite(p.value) && !p.comparator && p.unit?.trim())?.unit;
  const points = window.filter(p => finite(p.value) && !p.comparator && Boolean(unit) && p.unit === unit);
  const excludedUnits = window.filter(p => finite(p.value) && p.unit !== unit).length;
  const distinctDates = new Set(points.map(p => p.date)).size;
  // Multiple samples on one day cannot establish temporal order within that day.
  const unambiguousDates = distinctDates === points.length;
  const deltas = points.slice(1).map((p,i) => Number((p.value! - points[i].value!).toPrecision(12)));
  const hasUp = deltas.some(d => d > 0), hasDown = deltas.some(d => d < 0);
  const direction: HistoryDirection = !currentComparable || distinctDates < 2 || !unambiguousDates ? 'insufficient'
    : hasUp && hasDown ? 'mixed' : hasUp ? 'up' : hasDown ? 'down' : 'unchanged';
  return {points,records:window,latest,start:points[0]?.date ?? null,end:points.at(-1)?.date ?? null,cutoff,direction,
    change:direction === 'insufficient' ? null : Number((latest.value!-points[0].value!).toPrecision(12)),
    recentChange:direction === 'insufficient' ? null : deltas.at(-1) ?? null,excludedUnits,
    mixedSources:new Set(points.map(p=>p.source)).size > 1};
}

export const historyCopy = {
  es:{title:'Tu evolución',unit:'Unidad',last:'Última lectura',change:'Cambio en el período',latestChange:'Desde la anterior',single:'Hace falta otra fecha con un valor comparable para ver la evolución.',missing:'Esta muestra no tiene un valor numérico comparable.',oneDate:'Las muestras de este día no permiten ordenar una tendencia.',max:'Hasta un año desde la última muestra',table:'Ver las lecturas',date:'Fecha',value:'Resultado',source:'Origen',unknown:'No consta',sample:'Kit',upload:'Analítica subida',meaning:'Qué significa en tu lectura',pending:'La interpretación de esta lectura aún no está disponible.',note:'La dirección del cambio no indica por sí sola una mejora. Se conservan las unidades y el origen; el laboratorio y el método también importan.',units:'Hay lecturas con otras unidades que no se mezclan en esta gráfica.',directions:{up:'En ascenso',down:'En descenso',unchanged:'Sin cambio registrado',mixed:'Con variaciones',insufficient:'Una primera referencia'},two:{up:'Sube entre las dos muestras',down:'Baja entre las dos muestras',unchanged:'Mismo valor en ambas muestras',mixed:'Con variaciones',insufficient:'Una primera referencia'}},
  en:{title:'Your evolution',unit:'Unit',last:'Latest reading',change:'Change over this period',latestChange:'Since the previous reading',single:'Another date with a comparable value is needed to show evolution.',missing:'This sample has no comparable numeric value.',oneDate:'Samples from the same day cannot establish a trend order.',max:'Up to one year from the latest sample',table:'View readings',date:'Date',value:'Result',source:'Source',unknown:'Not recorded',sample:'Kit',upload:'Uploaded report',meaning:'What it means in this reading',pending:'The interpretation for this reading is not available yet.',note:'The direction of change alone does not mean improvement. Units and source are preserved; the laboratory and method also matter.',units:'Readings with other units are not mixed into this chart.',directions:{up:'Rising',down:'Falling',unchanged:'No recorded change',mixed:'Fluctuating',insufficient:'A first reference'},two:{up:'Higher between the two samples',down:'Lower between the two samples',unchanged:'Same value in both samples',mixed:'Fluctuating',insufficient:'A first reference'}},
} as const;
export const historyNumber = (value: number, locale: Locale) => new Intl.NumberFormat(locale,{maximumFractionDigits:4}).format(value);
export const historyDate = (value: string, locale: Locale) => new Intl.DateTimeFormat(locale,{day:'numeric',month:'short',year:'numeric',timeZone:'UTC'}).format(new Date(value));
export function historyDirectionLabel(model: BiomarkerHistoryModel, locale: Locale) {
  return (model.points.length === 2 ? historyCopy[locale].two : historyCopy[locale].directions)[model.direction];
}

/** Descriptive observation only. Clinical meaning is the separately persisted backend interpretation. */
export function historySentence(model: BiomarkerHistoryModel, locale: Locale): string | null {
  const {latest,start,end,change} = model;
  if (!latest || !start || !end || change === null || latest.value === null) return null;
  const first = model.points[0], num = (v:number) => historyNumber(v,locale);
  const movement = model.direction === 'mixed' ? (locale === 'es' ? 'Los valores han variado en ambas direcciones.' : 'Values have moved in both directions.') : '';
  const status = {optimal:['dentro del intervalo del informe','within the report interval'],above_optimal:['por encima del intervalo del informe','above the report interval'],below_optimal:['por debajo del intervalo del informe','below the report interval'],critical_low:['marcado como crítico bajo en el informe','flagged as critical low in the report'],critical_high:['marcado como crítico alto en el informe','flagged as critical high in the report'],unclassified:['sin clasificación en el informe','unclassified in the report']}[latest.zone ?? 'unclassified'][locale==='es'?0:1];
  return locale === 'es'
    ? `${latest.name} pasó de ${num(first.value!)} a ${num(latest.value)} ${latest.unit} entre el ${historyDate(start,locale)} y el ${historyDate(end,locale)}. ${movement} El último resultado está ${status}.`.replace(/\s+/g,' ')
    : `${latest.name} went from ${num(first.value!)} to ${num(latest.value)} ${latest.unit} between ${historyDate(start,locale)} and ${historyDate(end,locale)}. ${movement} The latest result is ${status}.`.replace(/\s+/g,' ');
}
