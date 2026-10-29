import type {Locale, PreviewState, Report} from '../../../lib/preview/model';
import {canReadReport} from '../../../lib/preview/policy';
import {dashboardMarkerForReport, zoneLabels} from '../dashboard/dashboard-reading';

/** The conversation and its source drawer use the same report-owned values and server zones. */
export function selectAssistantEvidence(state:PreviewState,report:Report|undefined) {
  if(!state.session||state.deletionStatus==='completed'||!report||!canReadReport(report,state.profile.healthConsent))return [];
  return report.markerKeys.flatMap(key=>{
    const marker=dashboardMarkerForReport(state,report,key);
    if(!marker||!Number.isFinite(marker.value))return [];
    return [{reportId:report.id,reportVersion:report.version??1,key,name:marker.name,value:marker.value,unit:marker.unit,status:marker.status,zone:marker.zone,description:marker.description,range:marker.rangeComparable?marker.range:null}];
  });
}

export type AssistantEvidence=ReturnType<typeof selectAssistantEvidence>[number];

export function assistantEvidenceSummary(evidence:AssistantEvidence[],locale:Locale='es') {
  const number=new Intl.NumberFormat(locale==='es'?'es-ES':'en-GB',{maximumFractionDigits:2});
  return evidence.slice(0,2).map(item=>`${item.name}: ${number.format(item.value)} ${item.unit} (${zoneLabels[locale][item.zone]})`).join('; ');
}
