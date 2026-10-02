import type {Marker, PreviewState, Report, ServerZone, Locale, Literacy} from '../../../lib/preview/model';
import {canReadReport, hasPaidAccess, statusForZone, reportInputSignature} from '../../../lib/preview/policy';

export type DashboardMarker = Marker & {rangeComparable: boolean;zone:ServerZone};
const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);

/** Values, units, intervals and classifications belong to the report, including demo reports. */
export function dashboardMarkerForReport(state: Pick<PreviewState,'markers'>, report: Report, key: string): DashboardMarker | undefined {
  if (!report.markerKeys.includes(key)) return undefined;
  const base = state.markers.find(marker => marker.key === key);
  if (!base) return undefined;
  const override = report.markerValues?.[key];
  const raw = override?.value;
  const value = finite(raw) ? raw : Number.NaN;
  const unit = override?.unit ?? '';
  const ownRange=override && finite(override.optimal_low) && finite(override.optimal_high) && override.optimal_high>override.optimal_low ? [override.optimal_low,override.optimal_high] as [number,number] : null;
  const rangeComparable=Boolean(ownRange);
  const zone:ServerZone=!finite(value)?'unclassified':override?.zone??'unclassified';
  return {...base,value,unit,status:statusForZone(zone),range:ownRange??[Number.NaN,Number.NaN],rangeComparable,zone};
}

export function selectDashboardReading(state: PreviewState) {
  const ordered=[...state.reports].filter(report=>report.status!=='archived').sort((a,b)=>b.date.localeCompare(a.date));
  const permitted=Boolean(state.session && state.deletionStatus!=='completed' && state.profile.healthConsent);
  const latestSubmission=permitted?ordered[0]:undefined;
  const latest=permitted?ordered.find(report=>canReadReport(report,true)):undefined;
  const pending=latestSubmission && latestSubmission.id!==latest?.id ? latestSubmission:undefined;
  const ready=Boolean(latest);
  const markers = ready && latest ? latest.markerKeys.map(key => dashboardMarkerForReport(state, latest, key)).filter((marker): marker is DashboardMarker => Boolean(marker)) : [];
  return {latest,latestSubmission,pending,ready,markers,paid:hasPaidAccess(state)};
}

export const zoneLabels:Record<Locale,Record<ServerZone,string>>={
 es:{critical_low:'Crítico · bajo',below_optimal:'Por debajo del intervalo',optimal:'Dentro del intervalo',above_optimal:'Por encima del intervalo',critical_high:'Crítico · alto',unclassified:'Sin clasificación'},
 en:{critical_low:'Critical · low',below_optimal:'Below interval',optimal:'Within interval',above_optimal:'Above interval',critical_high:'Critical · high',unclassified:'Unclassified'},
};
export type NarrativeState='ready'|'missing'|'stale'|'pending'|'error';
function readingState(report:Report):NarrativeState {
 if(!canReadReport(report))return 'pending';
 const reading=report.reading;
 if(!reading)return 'missing';
 if(reading.reportId!==report.id||reading.reportVersion!==(report.version??1)||reading.inputSignature!==reportInputSignature(report)||reading.status==='stale')return 'stale';
 if(reading.status==='error')return 'error';
 return reading.status==='ready'?'ready':'pending';
}
function localText(es:string|null|undefined,en:string|null|undefined,locale:Locale) {
 if(locale==='es'&&es?.trim())return {text:es.trim(),language:'es' as const};
 if(en?.trim())return {text:en.trim(),language:'en' as const};
 return {text:null,language:locale};
}
/** Content is report-owned; missing prose is never replaced by a marker definition. */
export function selectReportNarrative(report:Report,locale:Locale='es',literacy:Literacy='balanced') {
 const state=readingState(report);
 if(state!=='ready')return {state,text:null,language:locale,literacy,contextApplied:false};
 const variant=literacy===report.reading?.literacy?report:report.narrativeVariants?.[literacy];
 const localized=localText(variant?.summary_narrative_es,variant?.summary_narrative,locale);
 return {state:localized.text?'ready' as const:'missing' as const,...localized,literacy,contextApplied:report.reading?.contextApplied===true};
}
export function selectMarkerInterpretation(report:Report,key:string,locale:Locale='es',literacy:Literacy='balanced') {
 const state=readingState(report),value=report.markerValues?.[key];
 if(state!=='ready'||!report.markerKeys.includes(key)||!value)return {state:state==='ready'?'missing' as const:state,text:null,language:locale};
 const variant=literacy===report.reading?.literacy?value:value.interpretationVariants?.[literacy];
 const localized=localText(variant?.interpretation_es,variant?.interpretation,locale);
 return {state:localized.text?'ready' as const:'missing' as const,...localized};
}
export function selectReportActions(report:Report) {
 return readingState(report)==='ready' ? (report.actionSteps??[]).filter(action=>action.lab_result_id===report.id&&(action.status==='pending'||action.status==='in_progress')).sort((a,b)=>a.priority-b.priority):[];
}
/** Raw observations retain dates and missing values; no interpolation or inferred correlation. */
export function selectWearableObservations(state:PreviewState) {
 if(!state.session||state.deletionStatus==='completed'||!state.profile.healthConsent||!state.profile.wearableConnected)return [];
 return (state.wearableObservations??[]).filter(item=>item.source.trim()&&Number.isFinite(Date.parse(item.date))).map(item=>({...item})).sort((a,b)=>a.date.localeCompare(b.date));
}

/** Source and unit must agree; sharing a marker name alone does not establish a trend. */
export function dashboardMarkerHistory(state: PreviewState, report: Report, marker: DashboardMarker) {
  if (!state.session || state.deletionStatus === 'completed' || !state.profile.healthConsent || !canReadReport(report, true)) return [];
  return [...state.reports]
    .filter(item => canReadReport(item, true) && item.source === report.source && Number.isFinite(Date.parse(item.date)) && item.date <= report.date)
    .sort((a, b) => a.date.localeCompare(b.date))
    .flatMap(item => {
      const reading = dashboardMarkerForReport(state, item, marker.key);
      return reading && finite(reading.value) && reading.unit === marker.unit ? [{report: item, marker: reading}] : [];
    });
}

const questions: Record<string, string> = {
  apob: '¿Qué aporta ApoB cuando se lee junto a LDL y los demás lípidos?',
  hscrp: '¿Hubo una infección reciente o ejercicio intenso cerca de la muestra?',
  hba1c: '¿Qué cuenta esta lectura de los últimos meses, junto al resto del panel?',
  insulin: '¿Cómo fue el ayuno y qué otros datos de glucosa incluye el informe?',
  triglycerides: '¿Cómo encaja este valor con el resto de tu perfil lipídico?',
  hdl: '¿Qué información falta para entender el conjunto del perfil cardiovascular?',
  ldl: '¿Qué añade ApoB y tu contexto personal a la lectura de LDL?',
  ferritin: '¿Qué contexto hace falta para interpretar tus reservas de hierro?',
  'vitamin-d': '¿Qué intervalo usa tu laboratorio y cómo se aplica a tu contexto?',
  b12: '¿Qué otros datos ayudan a poner esta cifra en contexto?',
  tsh: '¿Con qué otros datos se está valorando la función tiroidea?',
  alt: '¿Qué ejercicio o medicamentos conviene anotar junto a esta lectura?',
  creatinine: '¿Qué contexto de edad y masa muscular acompaña a este resultado?',
  'uric-acid': '¿Qué información sobre alimentación y función renal acompaña al dato?',
  ggt: '¿Cómo se lee GGT junto con el resto de los datos del hígado?',
};

export function questionForMarker(key: string) {
  return questions[key] ?? '¿Qué contexto y otros resultados necesitas para interpretar este dato?';
}

export interface StoryEvidence {
  key: string;
  name: string;
  category: string;
  description: string;
  question: string;
  value: number | null;
  unit: string;
  status: Marker['status'];
  zone:ServerZone;
  interpretation:ReturnType<typeof selectMarkerInterpretation>;
  range: [number, number] | null;
  comparison: {reportId: string; date: string; value: number; delta: number} | null;
}

/** Independent per-marker scale. Never put different biomarker units on one axis. */
export function evidenceRangeGeometry(evidence: Pick<StoryEvidence, 'value' | 'range'>) {
  if (evidence.value === null || !finite(evidence.value) || !evidence.range || !evidence.range.every(finite) || evidence.range[1] <= evidence.range[0]) return null;
  const lowest = Math.min(0, evidence.value, evidence.range[0]);
  const highest = Math.max(evidence.value, evidence.range[1]);
  const padding = (highest - lowest) * .12;
  const low = lowest < 0 ? lowest - padding : lowest, high = highest + padding;
  const position = (value: number) => (value - low) / (high - low);
  return {low, high, value: position(evidence.value), intervalStart: position(evidence.range[0]), intervalEnd: position(evidence.range[1])};
}

/** A fresh, deterministic reading, not cached AI prose. Identity includes values and report revision. */
export function selectExecutiveStory(state: PreviewState) {
  const {latest: report, ready} = selectDashboardReading(state);
  if (!ready || !report) return null;
  const evidence: StoryEvidence[] = report.markerKeys.map(key => {
    const marker = dashboardMarkerForReport(state, report, key);
    const hasValue = marker && finite(marker.value);
    const previous = marker && hasValue ? dashboardMarkerHistory(state, report, marker).filter(item => item.report.date < report.date).at(-1) : undefined;
    return {
      key, name: marker?.name ?? key, category: marker?.category ?? 'Sin categoría',
      description: marker?.description || 'Todavía no hay una explicación disponible para este biomarcador.',
      question: questionForMarker(key), value: hasValue ? marker.value : null,
      unit: marker?.unit ?? '', status: hasValue ? marker.status : 'unknown',zone:marker?.zone??'unclassified',
      interpretation:selectMarkerInterpretation(report,key,state.profile.locale??'es',state.profile.literacy),
      range: marker?.rangeComparable ? marker.range : null,
      comparison: previous && hasValue ? {reportId: previous.report.id, date: previous.report.date, value: previous.marker.value, delta: Number((marker.value - previous.marker.value).toFixed(4))} : null,
    };
  });
  const attention = evidence.filter(item => item.value !== null && (item.status === 'attention' || item.status === 'action'));
  const available = evidence.filter(item => item.value !== null);
  const unknown = evidence.filter(item => item.status === 'unknown');
  const categories = [...new Set(available.map(item => item.category))];
  const completeCategories = categories.filter(category => {
    const members = evidence.filter(item => item.category === category);
    return members.length > 1 && members.every(item => item.value !== null && item.status === 'optimal');
  });
  const priorities = [...(attention.length ? attention : available)].sort((a,b)=>(a.status==='action'?0:1)-(b.status==='action'?0:1)).slice(0,3);
  const comparable = evidence.filter(item => item.comparison);
  const contextConfirmed = Boolean(report.context?.confirmedAt);
  const narrative=selectReportNarrative(report,state.profile.locale??'es',state.profile.literacy);
  const actions=selectReportActions(report);
  const signature = JSON.stringify([reportInputSignature(report),report.version??1,narrative.text,narrative.state,state.profile.literacy,evidence.map(item=>[item.key,item.value,item.unit,item.zone,item.interpretation.text])]);
  return {reportId:report.id,version:report.version??1,date:report.date,source:report.source,evidence,available,attention,unknown,priorities,comparable,categories,completeCategories,contextConfirmed,signature,narrative,actions,context:report.context??null,report};
}

export type ExecutiveStory = NonNullable<ReturnType<typeof selectExecutiveStory>>;
