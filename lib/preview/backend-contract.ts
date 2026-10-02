import type {ChatMessage,Marker,Profile,Report,ReportActionStep,WearableObservation} from './model';

/** Integration seam. Implement on the server/API boundary; the preview never instantiates it. */
export type CursorPage<T>={items:T[];nextCursor:string|null};
export type ServiceError={code:'unauthorized'|'forbidden'|'not_found'|'conflict'|'quota'|'invalid'|'unavailable';message:string;fieldErrors?:Record<string,string>;retryable:boolean};
export type ServiceResult<T>={ok:true;data:T}|{ok:false;error:ServiceError};
export interface SessionIdentity {userId:string;locale:'es'|'en';onboarded:boolean;entitlements:{rawResults:boolean;interpretation:boolean;assistant:boolean;expiresAt:string|null}}
export interface ContextSnapshot {versionId:string;durable:Record<string,unknown>;transient:Record<string,unknown>;confirmedAt:string}
export interface UploadJob {id:string;reportId:string;status:'queued'|'extracting'|'review'|'failed';retryAfterMs?:number}
export interface ConsentSnapshot {scope:'health'|'ai'|'wearables';accepted:boolean;version:string;revision:number;recordedAt:string|null}
export type ChatEvent={type:'accepted';requestId:string}|{type:'delta';text:string}|{type:'complete';message:ChatMessage}|{type:'error';error:ServiceError};
export interface EvaBackendPort {
 session():Promise<ServiceResult<SessionIdentity|null>>;
 profile():Promise<ServiceResult<Profile>>;
 reports(cursor?:string):Promise<ServiceResult<CursorPage<Report>>>;
 report(id:string):Promise<ServiceResult<{report:Report;markers:Marker[];context:ContextSnapshot|null}>>;
 /** Map source summary_narrative[_es], marker interpretation[_es], six zones and action_steps.
  * Reading provenance is a preview/integration guard, not an existing production endpoint.
  * Preserve the last ready report separately from any new pending submission. */
 dashboardReading?():Promise<ServiceResult<{latestReady:Report|null;latestSubmission:Report|null;actions:ReportActionStep[];wearables:WearableObservation[]}>>;
 markerHistory(key:string):Promise<ServiceResult<Array<{reportId:string;date:string;value:number;unit:string}>>>;
 catalog():Promise<ServiceResult<Array<{key:string;name:string;unit:string;referenceId:string}>>>;
 upload(files:File[],idempotencyKey:string,signal:AbortSignal):Promise<ServiceResult<UploadJob>>;
 uploadStatus(id:string,signal:AbortSignal):Promise<ServiceResult<UploadJob>>;
 consent(scope:ConsentSnapshot['scope']):Promise<ServiceResult<ConsentSnapshot>>;
 saveConsent(value:ConsentSnapshot,expectedRevision:number):Promise<ServiceResult<ConsentSnapshot>>;
 chatHistory(cursor?:string):Promise<ServiceResult<CursorPage<ChatMessage>>>;
 sendChat(input:{requestId:string;message:string},signal:AbortSignal):AsyncIterable<ChatEvent>;
 recoverChat(requestId:string):Promise<ServiceResult<ChatMessage>>;
 /** Existing POST /api/gdpr/delete. No polling receipt/job exists in the audited source. */
 deleteAccount(input:{confirmation:'DELETE_MY_ACCOUNT'}):Promise<ServiceResult<{deleted:true}>>;
 /** Existing GET /api/gdpr/export returns the JSON attachment directly. */
 exportAccount():Promise<ServiceResult<Record<string,unknown>>>;
 /** Existing patient-owned extraction timestamp correction; server validates cycle state. */
 activateKit(input:{cycleId:string;extractionAt:string}):Promise<ServiceResult<{ok:true;extractionAt:string;queuedMessage:string|null;warning?:'order update not queued'}>>;
}

/** Explicit mapping between source profile fields and presentation terminology. */
export const literacyMapping={beginner:'simple',familiar:'balanced',optimizer:'advanced'} as const;
export const integrationRules={
 identifiers:'Replace demo-* static IDs with owned backend UUID routes. Never infer ownership from route access.',
 dates:'Keep collection dates as YYYY-MM-DD; format with locale and UTC to prevent timezone day shifts.',
 values:'Resolve report-local values and source units before ranges; preserve null estimates and unknown classification.',
 state:'Server status and entitlement are authoritative; remove scenario controls and simulated-ready transitions.',
 storage:'Synthetic localStorage is preview-only. Patient data and tokens must not use this store.',
 errors:'Map typed service errors to existing inline/error/retry states without replacing prior confirmed data.',
 files:'The preview only inspects metadata. Actual upload, scanning, retention and consent belong to authenticated services.',
 privacy:'Server ownership, consent version, role/MFA and access controls are required regardless of client UI gates.',
} as const;
