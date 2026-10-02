import type {PreviewState, Report, Locale, Literacy} from '../../../lib/preview/model';
import type {BiomarkerObservation} from '../../../lib/labs/biomarker-history';
import {canReadReport} from '../../../lib/preview/policy';
import {selectMarkerInterpretation} from '../dashboard/dashboard-reading';

/** Synthetic report rows only; never substitute catalogue history arrays or invented sample dates. */
export function previewHistoryObservations(state: PreviewState, asOf: Report, literacy: Literacy = state.profile.literacy): BiomarkerObservation[] {
  if (!state.session || state.deletionStatus === 'completed' || !state.profile.healthConsent || !canReadReport(asOf,true)) return [];
  return state.reports.filter(report=>canReadReport(report,true) && report.date <= asOf.date).flatMap(report=>report.markerKeys.flatMap(key=>{
    const value = report.markerValues?.[key];
    if (!value) return [];
    const name = state.markers.find(marker=>marker.key===key)?.name ?? key;
    const prose = (locale:Locale) => selectMarkerInterpretation(report,key,locale,literacy).text;
    return [{reportId:report.id,key,name,date:report.date,value:Number.isFinite(value.value)?value.value:null,unit:value.unit,source:report.source,zone:value.zone ?? null,interpretation:{es:prose('es'),en:prose('en')}}];
  }));
}
