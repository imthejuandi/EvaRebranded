import type {MemberPlan,PreviewState,Report,ServerZone,MarkerStatus,Profile} from './model';

/** Shared preview policy. These helpers are not production authorization. */
export function normalizePlan(value:unknown):MemberPlan|null {
  if(value==='full'||value==='full_panel')return 'full_panel';
  return value==='free'||value==='quarterly'||value==='annual'?value:null;
}
export type ReportReadiness='missing'|'no_consent'|'archived'|'error'|'pending_context'|'processing'|'empty'|'ready';
export function reportReadiness(report:Pick<Report,'status'|'contextComplete'|'markerKeys'>|undefined,healthConsent=true):ReportReadiness {
  if(!report)return 'missing';
  if(!healthConsent)return 'no_consent';
  if(report.status==='archived')return 'archived';
  if(report.status==='error')return 'error';
  if(!report.contextComplete||report.status==='pending_context')return 'pending_context';
  if(report.status==='processing')return 'processing';
  if(!report.markerKeys.length)return 'empty';
  return 'ready';
}
export function canReadReport(report:Pick<Report,'status'|'contextComplete'|'markerKeys'>|undefined,healthConsent=true){return reportReadiness(report,healthConsent)==='ready';}
/** Fixtures model paid access only while active. No grace period is invented. */
export function hasPaidAccess(state:Pick<PreviewState,'plan'|'subscriptionStatus'>){return (state.plan==='quarterly'||state.plan==='annual'||state.plan==='full_panel')&&state.subscriptionStatus==='active';}
/** Values and source remain intact. Derived values stay unavailable until recomputed. */
export function invalidateReportEstimates(report:Report):Report {
  return {...report,version:(report.version??1)+1,biologicalAge:null,longevityScore:null,status:report.contextComplete?'processing':'pending_context',reading:report.reading?{...report.reading,status:'stale'}:undefined};
}
export function statusForZone(zone:ServerZone):MarkerStatus {
 return zone==='optimal'?'optimal':zone==='unclassified'?'unknown':zone==='critical_low'||zone==='critical_high'?'action':'attention';
}
/** Stable data identity prevents an old narrative accompanying an edited value/date/unit. */
export function reportInputSignature(report:Report):string {
 return JSON.stringify([report.id,report.date,report.source,report.context?.versionId??report.context?.version??null,report.context?.transient??null,report.context?.durable??null,report.context?.confirmedAt??null,
 [...report.markerKeys].sort().map(key=>{const v=report.markerValues?.[key];return[key,v?.value??null,v?.unit??null,v?.zone??null,v?.optimal_low??null,v?.optimal_high??null,v?.normal_low??null,v?.normal_high??null];})]);
}
function unsafeReturnCharacters(value:string){return value.includes('\\')||Array.from(value).some(character=>character.charCodeAt(0)<32);}
export function safeReturnPath(value:string|null|undefined,fallback='/es/dashboard') {
  if(!value||!value.startsWith('/es/')||unsafeReturnCharacters(value)||value.includes('//'))return fallback;
  try{const decoded=decodeURIComponent(value);if(unsafeReturnCharacters(decoded)||decoded.includes('//'))return fallback;const url=new URL(value,'https://eva.invalid');return url.origin==='https://eva.invalid'&&url.pathname.startsWith('/es/')?`${url.pathname}${url.search}${url.hash}`:fallback}catch{return fallback;}
}
export interface FlowIntent {plan:MemberPlan|null;returnTo:string;reportId:string|null;invalidPlan:boolean}
export function readFlowIntent(params:URLSearchParams):FlowIntent {
  const explicitReturn=params.get('redirect')||params.get('next');
  const explicitReport=params.get('report');
  const target=new URL(safeReturnPath(explicitReturn,explicitReport?`/es/labs/${encodeURIComponent(explicitReport)}`:'/es/dashboard'),'https://eva.invalid');
  if(explicitReport&&!target.searchParams.has('report')&&!target.pathname.endsWith('/'+encodeURIComponent(explicitReport)))target.searchParams.set('report',explicitReport);
  const returnTo=`${target.pathname}${target.search}${target.hash}`;
  const nested=target;
  const raw=params.get('plan')??params.get('intent')??(nested.pathname.startsWith('/es/checkout')?(nested.searchParams.get('plan')??nested.searchParams.get('intent')):null);
  const plan=normalizePlan(raw);
  return {plan,returnTo,reportId:params.get('report')||nested.searchParams.get('report'),invalidPlan:raw!==null&&plan===null};
}
export function flowHref(path:string,intent:FlowIntent){
  const url=new URL(path,'https://eva.invalid');
  if(intent.plan)url.searchParams.set('plan',intent.plan);
  url.searchParams.set('redirect',safeReturnPath(intent.returnTo));
  if(intent.reportId)url.searchParams.set('report',intent.reportId);
  if(intent.invalidPlan)url.searchParams.set('plan','invalid');
  return `${url.pathname}${url.search}${url.hash}`;
}
export function checkoutHref(plan:Exclude<MemberPlan,'free'>,returnTo='/es/dashboard',reportId:string|null=null){return flowHref('/es/checkout/resume',{plan,returnTo,reportId,invalidPlan:false});}
export function destinationAfterAccess(intent:FlowIntent){
  if(intent.invalidPlan)return '/es/pricing';
  if(intent.returnTo.startsWith('/es/checkout/')||intent.returnTo.startsWith('/es/onboarding'))return intent.returnTo;
  if(intent.plan&&intent.plan!=='free')return checkoutHref(intent.plan,intent.returnTo,intent.reportId);
  return intent.returnTo;
}

export function destinationAfterOnboarding(intent:FlowIntent,plan:MemberPlan){
  const nested=new URL(intent.returnTo,'https://eva.invalid');
  const returnTo=nested.pathname.startsWith('/es/checkout/')?safeReturnPath(nested.searchParams.get('redirect')||nested.searchParams.get('next')):intent.returnTo;
  const reportId=intent.reportId||nested.searchParams.get('report');
  return plan==='free'?(returnTo==='/es/dashboard'?'/es/upload':returnTo):checkoutHref(plan,returnTo,reportId);
}

/** A kit owns one explicitly linked report. A newer upload must never replace it. */
export function reportForKit(state:Pick<PreviewState,'kitReportId'|'reports'>):Report|undefined {
  if(!state.kitReportId)return undefined;
  return state.reports.find(report=>report.id===state.kitReportId&&report.source==='kit'&&report.status!=='archived');
}


/** Audited original /api/lab-results/extract limits; metadata-only in this preview. */
export const UPLOAD_LIMITS={files:10,perFileBytes:15*1024*1024,totalBytes:40*1024*1024,freeLifetime:5} as const;
export const UPLOAD_ACCEPT='.pdf,.png,.jpg,.jpeg,.webp,.heic,.heif,application/pdf,image/png,image/jpeg,image/jpg,image/webp,image/heic,image/heif';
export type UploadMetadata={name:string;size:number;type:string};
export type UploadValidationError='empty'|'count'|'type'|'file_size'|'total_size'|'empty_file';
export function validateUploadMetadata(files:readonly UploadMetadata[]):UploadValidationError|null {
 if(!files.length)return 'empty';
 if(files.length>UPLOAD_LIMITS.files)return 'count';
 const mime=new Set(['application/pdf','image/png','image/jpeg','image/jpg','image/webp','image/heic','image/heif']);
 const extension=new Set(['pdf','png','jpg','jpeg','webp','heic','heif']);
 let total=0;
 for(const file of files){
  const ext=file.name.split('.').pop()?.toLowerCase()??'';
  if(!mime.has(file.type)&&!((!file.type||file.type==='application/octet-stream')&&extension.has(ext)))return 'type';
  if(!Number.isFinite(file.size)||file.size<=0)return 'empty_file';
  if(file.size>UPLOAD_LIMITS.perFileBytes)return 'file_size';
  total+=file.size;
 }
 return total>UPLOAD_LIMITS.totalBytes?'total_size':null;
}
/** Original counter is cumulative, so deleting a report does not restore a free upload. */
export function uploadQuota(state:Pick<PreviewState,'totalUploadsUsed'|'reports'|'plan'|'subscriptionStatus'>){
 const used=Math.max(0,Math.trunc(state.totalUploadsUsed??state.reports.filter(r=>r.source==='upload').length));
 const remaining=Math.max(0,UPLOAD_LIMITS.freeLifetime-used);
 return {used,remaining,atLimit:!hasPaidAccess(state)&&remaining===0};
}
export function recordConfirmedUpload(state:PreviewState):PreviewState{return {...state,totalUploadsUsed:uploadQuota(state).used+1};}

export const ID_DOCUMENT_TYPES=['DNI','NIF','CIF','NIE','PASAPORTE','CENSO','OTROS','ID','DNI_TUTOR','NIF_TUTOR','NIE_TUTOR'] as const;
export const PATIENT_DOCUMENT_TYPES=['DNI','NIE','PASAPORTE','OTROS'] as const;
export function normalizeDocumentNumber(value:string){return value.toUpperCase().replace(/[\s.-]/g,'');}
export function validateIdentityDocument(type:string|undefined,rawNumber:string|undefined):{ok:true;type:string|null;number:string|null}|{ok:false;error:string}{
 const t=type?.trim()||'',number=normalizeDocumentNumber(rawNumber||'');
 if(!t&&!number)return {ok:true,type:null,number:null};
 if(!(ID_DOCUMENT_TYPES as readonly string[]).includes(t)||!number)return {ok:false,error:'Completa el tipo y el número de documento, o deja ambos vacíos.'};
 const check='TRWAGMYFPDXBNJZSQVHLCKE';let valid=false;
 if(['DNI','NIF','DNI_TUTOR','NIF_TUTOR'].includes(t)){const m=/^(\d{8})([A-Z])$/.exec(number);valid=Boolean(m&&check[Number(m[1])%23]===m[2]);}
 else if(['NIE','NIE_TUTOR'].includes(t)){const m=/^([XYZ])(\d{7})([A-Z])$/.exec(number);valid=Boolean(m&&check[Number(String('XYZ'.indexOf(m[1]))+m[2])%23]===m[3]);}
 else valid=/^[A-Z0-9]{4,20}$/.test(number);
 return valid?{ok:true,type:t,number}:{ok:false,error:t==='DNI'||t==='NIE'?'Revisa el número y la letra de control del documento.':'Usa entre 4 y 20 letras o números.'};
}
/** Source patientReadiness requirements. No second-surname requirement or manufactured identifier. */
export function patientShippingReadiness(profile:Profile){
 const missing:string[]=[];
 if(!profile.patientNumber||profile.patientNumber<=0)missing.push('patient_number');
 if(!profile.firstName.trim())missing.push('first_name');
 if(!profile.lastName?.trim())missing.push('last_name');
 if(!profile.dateOfBirth||!(/^(\d{4})-(\d{2})-(\d{2})/.test(profile.dateOfBirth.trim())||/^(\d{2})\/(\d{2})\/(\d{4})$/.test(profile.dateOfBirth.trim())))missing.push('date_of_birth');
 if(profile.sex!=='male'&&profile.sex!=='female')missing.push('sex');
 if(!(ID_DOCUMENT_TYPES as readonly string[]).includes(profile.idDocumentType??'')||!profile.idDocumentNumber)missing.push('id_document');
 return {ready:missing.length===0,missing};
}
/** Preserve compound first surnames and separately entered second surnames. */
export function profileIdentityPayload(profile:Profile){return {first_name:profile.firstName.trim(),last_name:profile.lastName?.trim()||null,second_surname:profile.secondSurname?.trim()||null,full_name:[profile.firstName,profile.lastName,profile.secondSurname].map(x=>x?.trim()).filter(Boolean).join(' '),date_of_birth:profile.dateOfBirth||null,sex:profile.sex||null,height_cm:profile.height?Number(profile.height.replace(',','.')):null,weight_kg:profile.weight?Number(profile.weight.replace(',','.')):null};}
export function profileShippingPayload(profile:Profile){
 const doc=validateIdentityDocument(profile.idDocumentType,profile.idDocumentNumber);
 if(!doc.ok)throw new Error(doc.error);
 const nullable=(s:string|undefined)=>s?.trim()||null;
 return {address_line1:nullable(profile.address),address_line2:nullable(profile.addressLine2),address_city:nullable(profile.city),address_postal_code:nullable(profile.postalCode),address_province:nullable(profile.province),address_country:nullable(profile.country),phone:nullable(profile.phone),id_document_type:doc.type,id_document_number:doc.number};
}
export const ACCOUNT_DELETE_CONFIRMATION='DELETE_MY_ACCOUNT' as const;
export function accountDeletionPayload(confirmation:string){return confirmation===ACCOUNT_DELETE_CONFIRMATION?{confirmation:ACCOUNT_DELETE_CONFIRMATION}:null;}
export function completePreviewAccountDeletion(state:PreviewState):PreviewState{return {...state,deletionStatus:'completed',session:false,reports:[],markers:[],chat:[],wearableObservations:[],profile:{...state.profile,context:undefined,wearableConnected:false,healthConsent:false,aiConsent:false},lastAction:'Eliminación de ejemplo completada. Ninguna cuenta real se ha eliminado.'};}
