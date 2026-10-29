export const bookingStates=[['scheduled','Preparación'],['kit_sent','Kit enviado'],['sample_received','Muestra recibida'],['processing','En proceso'],['completed','Completado'],['cancelled','Cancelado']] as const;
export type BookingStatus=typeof bookingStates[number][0];
export function bookingPayload(bookingId:string,status:BookingStatus){return {action:'booking.update' as const,bookingId,status,simulated:true};}
export function entryPayload(userId:string,entries:{key:string;value:string;unit:string}[]){
 const present=entries.filter(entry=>entry.value.trim());
 if(!present.length)throw Error('Introduce al menos un valor de ejemplo. Los campos vacíos se omiten.');
 if(present.some(entry=>!Number.isFinite(Number(entry.value))||Number(entry.value)<0||!entry.unit.trim()))throw Error('Revisa los valores: usa números iguales o mayores que cero y conserva la unidad.');
 return {action:'results.enter' as const,userId,values:present.map(entry=>({marker:entry.key,value:Number(entry.value),unit:entry.unit})),simulated:true};
}
export function reprocessPayload(reportId:string,reportVersion=1){return {action:'report.reprocess' as const,reportId,expectedVersion:reportVersion,simulated:true};}
export type AdminPayload=ReturnType<typeof bookingPayload>|ReturnType<typeof entryPayload>|ReturnType<typeof reprocessPayload>;
