import type {Operation,PreviewResult} from './model';
import {accountDeletionPayload} from './policy';
/** Replace this transport at integration. Components never call production services. */
export interface EvaTransport {execute(operation:Operation,payload?:Record<string,unknown>):Promise<PreviewResult>}
export const previewTransport:EvaTransport={async execute(operation,payload){await new Promise(resolve=>setTimeout(resolve,420));if(operation==='data.delete'&&!accountDeletionPayload(String(payload?.confirmation??'')))return{ok:false,simulated:true,operation,message:'Confirma la eliminación con DELETE_MY_ACCOUNT.'};if(payload?.simulateError)return{ok:false,simulated:true,operation,message:'No se pudo completar la simulación. Puedes volver a intentarlo.'};return{ok:true,simulated:true,operation,...(operation==='data.delete'?{deleted:true as const}:{}),message:operation==='data.delete'?'Eliminación de ejemplo completada.':'Cambio guardado solo en esta vista previa.'}}};
export const backendBindings:Record<Operation,string>={
 'auth.login':'Supabase auth.signInWithPassword / signInWithOtp → safe redirect',
 'auth.signup':'Supabase auth.signUp + independent consent metadata',
 'auth.recover':'Supabase auth.resetPasswordForEmail',
 'auth.reset':'Supabase auth.updateUser after recovery session validation',
 'profile.save':'profiles own-user identity update (first_name, last_name, second_surname); PATCH /api/profile/address shipping and validated id_document_type/id_document_number pair',
 'consent.save':'Versioned consent persistence for health / AI / wearable processing',
 'upload.extract':'POST /api/lab-results/extract — files multipart, max 10 files / 15MB each / 40MB total; PDF PNG JPEG WEBP HEIC HEIF; cumulative total_uploads_used quota',
 'report.save':'Reviewed biomarker values → result save → processing state',
 'report.context':'Owned report context persistence → recomputation',
 'report.delete':'DELETE /api/lab-results/:id; owned report and dependent values, explicit confirmation',
 'report.archive':'Owned results archive/delete with confirmation and dependent cleanup',
 'marker.edit':'Owned report marker edit with unit/value validation and recalculation',
 'checkout.create':'Server checkout/session with configured Stripe price + authenticated intent',
 'billing.portal':'Server customer-owned Stripe billing portal session',
 'chat.send':'POST /api/ai/chat — existing owned-session + entitlement-checked text SSE; adapt delta/completion to preview events; request recovery is not implemented by the source route',
 'chat.stop':'Abort stream and reconcile saved message; preserve partial response',
 'wearable.import':'Consented ZIP/XML import≤100MB with replacing-history confirmation',
 'wearable.disconnect':'Owned connection disconnect and consent/data retention semantics',
 'data.export':'GET /api/gdpr/export — authenticated JSON attachment; no expiring-link job',
 'data.delete':'POST /api/gdpr/delete {confirmation: DELETE_MY_ACCOUNT} → {deleted:true}; synchronous account deletion, external cleanup best effort; no receipt/status endpoint',
 'admin.update':'Admin role + MFA + server authorization + audit trail',
 'contact.submit':'Validated contact form/notification transport',
 'kit.activate':'POST /api/cycles/activate {cycleId,extractionAt} — owned shipped/order_sent/order_accepted/activated cycle; saves extraction time, does not advance status'
};
export {safeReturnPath as safeReturn} from './policy';
