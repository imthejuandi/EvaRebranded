export type Locale='es'|'en';
export type Scenario='ready'|'new'|'kit'|'processing'|'context'|'error';
export type MarkerStatus='optimal'|'attention'|'action'|'unknown';
export type ReportStatus='ready'|'processing'|'pending_context'|'error'|'archived';
export type MemberPlan='free'|'quarterly'|'annual'|'full_panel';
export interface Marker {key:string;name:string;category:string;value:number;unit:string;status:MarkerStatus;range:[number,number];domain:[number,number];history:number[];description:string;interpretation:string}
export type Literacy = 'simple'|'balanced'|'advanced';
/** Preserve the production classification; display labels must not replace it. */
export type ServerZone = 'critical_low'|'below_optimal'|'optimal'|'above_optimal'|'critical_high'|'unclassified';
export interface BilingualNarrative {summary_narrative:string|null;summary_narrative_es:string|null}
export interface ReportMarkerValue {
 value:number;unit:string;zone?:ServerZone;
 optimal_low?:number|null;optimal_high?:number|null;normal_low?:number|null;normal_high?:number|null;
 reported_value?:number|null;reported_unit?:string|null;
 interpretation?:string|null;interpretation_es?:string|null;
 interpretationVariants?:Partial<Record<Literacy,{interpretation:string|null;interpretation_es:string|null}>>;
}
export interface ReportActionStep {
 id:string;lab_result_id:string;priority:number;category:string;
 title:string;title_es:string;description:string;description_es:string;
 related_biomarker_keys:string[];status:'pending'|'in_progress'|'completed'|'dismissed';
}
/** Preview provenance is explicit; it is not a claim these metadata fields exist in production. */
export interface ReadingProvenance {
 reportId:string;reportVersion:number;inputSignature:string;
 status:'ready'|'processing'|'stale'|'error';
 literacy:Literacy;contextApplied:boolean;contextVersionId?:string|null;
 origin:'editorial_fixture'|'backend';
}
export interface Report {
 id:string;version?:number;date:string;name:string;source:'kit'|'upload';status:ReportStatus;
 markerKeys:string[];contextComplete:boolean;archivedStatus?:Exclude<ReportStatus,'archived'>;
 biologicalAge?:number|null;longevityScore?:number|null;
 /** Exact optional lab_results provenance fields. Null never implies a known method. */
 biological_age_comprehensive?:number|null;bio_age_method?:string|null;bio_age_n_markers?:number|null;
 bio_age_applied_spanish_calibration?:string[]|null;longevity_grade?:string|null;
 context?:{version?:number;versionId?:string;durable:Record<string,string>;transient:Record<string,string>;confirmedAt:string};
 markerValues?:Record<string,ReportMarkerValue>;
 summary_narrative?:string|null;summary_narrative_es?:string|null;
 narrativeVariants?:Partial<Record<Literacy,BilingualNarrative>>;
 reading?:ReadingProvenance;actionSteps?:ReportActionStep[];
}
export interface RollingBiologicalAge {
 current_ba?:number|null;current_ba_method?:'Comprehensive'|'Reference'|null;
 current_ba_n_labs_averaged?:number|null;current_ba_window_months?:number|null;
 current_ba_n_markers_used?:number|null;current_ba_computed_at?:string|null;
}
export interface Profile extends RollingBiologicalAge {firstName:string;literacy:'simple'|'balanced'|'advanced';birthYear:string;address:string;postalCode:string;city:string;addressLine2?:string;province?:string;country?:string;phone?:string;locale?:Locale;notifications:{email:boolean;results:boolean;reminders:boolean;marketing:boolean};wearableConnected:boolean;healthConsent:boolean;aiConsent:boolean;context?:Record<string,string>;lastName?:string;secondSurname?:string;idDocumentType?:string;idDocumentNumber?:string;patientNumber?:number;dateOfBirth?:string;sex?:string;height?:string;weight?:string}
export interface ChatMessage {id:string;role:'user'|'assistant';text:string;status?:'complete'|'stopped'|'error'}
/** Existing wearable_data fields; preserve each observation's date, origin and missing metrics. */
export interface WearableObservation {date:string;source:string;hrv_ms:number|null;resting_hr_bpm:number|null;sleep_hours:number|null;respiratory_rate:number|null;recovery_score?:number|null;steps:number|null}
export interface KitCycle {id:string;status:string;dueDate?:string|null;trackingCode?:string|null;extractionAt?:string|null;version?:number;reportId?:string|null}
export interface PreviewState {version:1;session:boolean;scenario:Scenario;plan:MemberPlan;subscriptionStatus:'active'|'paused'|'cancelled'|'past_due';profile:Profile;reports:Report[];markers:Marker[];wearableObservations?:WearableObservation[];totalUploadsUsed?:number;kitCycle?:KitCycle;kitStep:number;kitReportId?:string|null;onboarded:boolean;chat:ChatMessage[];deletionStatus:'none'|'requested'|'processing'|'completed';lastAction:string}
export type Operation='auth.login'|'auth.signup'|'auth.recover'|'auth.reset'|'profile.save'|'consent.save'|'upload.extract'|'report.save'|'report.context'|'report.archive'|'report.delete'|'marker.edit'|'checkout.create'|'billing.portal'|'chat.send'|'chat.stop'|'wearable.import'|'wearable.disconnect'|'data.export'|'data.delete'|'admin.update'|'contact.submit'|'kit.activate';
export interface PreviewResult {ok:boolean;simulated:true;operation:Operation;message:string;deleted?:true}
