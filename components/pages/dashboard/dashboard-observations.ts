import type {PreviewState,Profile,Report,WearableObservation,Locale} from '@/lib/preview/model';
import {canReadReport} from '@/lib/preview/policy';
import {selectWearableObservations} from './dashboard-reading';

export type WearableMetric='sleep_hours'|'hrv_ms'|'resting_hr_bpm'|'respiratory_rate'|'steps'|'recovery_score';
export const wearableMetrics:Record<WearableMetric,{unit:string;es:string;en:string}>={sleep_hours:{unit:'h',es:'Sueño',en:'Sleep'},hrv_ms:{unit:'ms',es:'Variabilidad cardiaca',en:'Heart rate variability'},resting_hr_bpm:{unit:'lpm',es:'Pulso en reposo',en:'Resting heart rate'},respiratory_rate:{unit:'resp/min',es:'Frecuencia respiratoria',en:'Respiratory rate'},steps:{unit:'pasos',es:'Pasos',en:'Steps'},recovery_score:{unit:'/ 100',es:'Recuperación registrada',en:'Recorded recovery'}};
const finite=(value:unknown):value is number=>typeof value==='number'&&Number.isFinite(value);
/** Select observed values only. No interpolation, averaging across sources or inferred scores. */
export function wearableSeries(state:PreviewState,metric:WearableMetric,source='all'){
 return selectWearableObservations(state).filter(row=>source==='all'||row.source===source).map((row,index)=>({id:`${row.date}-${row.source}-${index}`,date:row.date,source:row.source,value:finite(row[metric])?row[metric]!:null}));
}
export function wearableChartPoints(rows:ReturnType<typeof wearableSeries>){
 const dates=rows.map(row=>Date.parse(row.date)),first=Math.min(...dates),last=Math.max(...dates),span=last-first;
 const x=(date:string)=>span===0?50:8+(Date.parse(date)-first)/span*84;
 const values=rows.flatMap(row=>row.value===null?[]:[row.value]);
 if(!values.length)return {points:rows.map(row=>({...row,x:x(row.date),y:null})),low:null,high:null};
 const min=Math.min(...values),max=Math.max(...values),pad=Math.max((max-min)*.2,Math.abs(max)*.025,.1),low=min-pad,high=max+pad;
 return {low,high,points:rows.map(row=>({...row,x:x(row.date),y:row.value===null?null:82-(row.value-low)/(high-low)*64}))};
}
/** The source profile rolling estimator is distinct from report-level estimates. */
export function estimateProvenance(report:Report,profile:Profile){
 const available=canReadReport(report)&&report.reading?.status!=='stale';
 return {reportId:report.id,
  referenceAge:available&&finite(report.biologicalAge)?report.biologicalAge:null,
  comprehensiveAge:available&&finite(report.biological_age_comprehensive)?report.biological_age_comprehensive:null,
  method:available?report.bio_age_method?.trim()||null:null,
  markerCount:available&&finite(report.bio_age_n_markers)?report.bio_age_n_markers:null,
  calibration:available&&Array.isArray(report.bio_age_applied_spanish_calibration)?[...report.bio_age_applied_spanish_calibration]:null,
  grade:available?report.longevity_grade?.trim()||null:null,
  rolling:{value:finite(profile.current_ba)?profile.current_ba:null,method:profile.current_ba_method??null,labs:finite(profile.current_ba_n_labs_averaged)?profile.current_ba_n_labs_averaged:null,months:finite(profile.current_ba_window_months)?profile.current_ba_window_months:null,markers:finite(profile.current_ba_n_markers_used)?profile.current_ba_n_markers_used:null,computedAt:profile.current_ba_computed_at&&Number.isFinite(Date.parse(profile.current_ba_computed_at))?profile.current_ba_computed_at:null}};
}
export function wearableMetricLabel(metric:WearableMetric,locale:Locale){return wearableMetrics[metric][locale];}
export type ObservedWearable=WearableObservation;
