import type {PreviewState} from '@/lib/preview/model';
/** An isolated synthetic snapshot, never a request to the real GDPR export endpoint. */
export function createPreviewExport(state:PreviewState,exportedAt=new Date().toISOString()){
 return JSON.parse(JSON.stringify({notice:'EVA · Datos ficticios de la vista previa · No contiene registros clínicos reales',exportedAt,profile:state.profile,reports:state.reports,markers:state.markers,plan:state.plan,subscriptionStatus:state.subscriptionStatus,chat:state.chat,wearableObservations:state.wearableObservations??[],kitCycle:state.kitCycle??null,kitReportId:state.kitReportId??null,totalUploadsUsed:state.totalUploadsUsed??null}));
}
