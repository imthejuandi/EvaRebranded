import type {Report} from '../../../../lib/preview/model';
import {selectReportActions} from '../dashboard-reading';
import type {MarkerResult} from './result-shape';
/** Adapt only this report's persisted rows. Catalog values and legacy fixtures
 * cannot fill absent rows or classify a source that has no zone. */
export function reportActionables(report:Report,labels:Readonly<Record<string,string>>={}){
 const results:Record<string,MarkerResult>={};
 for(const key of report.markerKeys){
  const row=report.markerValues?.[key];if(!row)continue;
  results[key]={key,label:labels[key]??key,reportId:report.id,
   value:Number.isFinite(row.value)?row.value:null,unit:row.unit?.trim()||null,
   zone:row.zone??null,optimalLow:row.optimal_low??null,optimalHigh:row.optimal_high??null,
   collectionDate:report.date,reportedValue:row.reported_value==null?null:String(row.reported_value),reportedUnit:row.reported_unit??null};
 }
 return {actions:selectReportActions(report),results};
}
