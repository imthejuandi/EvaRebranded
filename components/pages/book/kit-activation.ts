/** Mirrors the owned-cycle timestamp contract at original POST /api/cycles/activate.
 * Source: eva-health@0ee2c7745a9417428a9e08db0a0e53c6047473f3.
 * Pure preview logic; never dispatches a laboratory order or changes lifecycle status.
 */
export interface ActivationCycle {id:string;status:string;extractionAt?:string|null;version?:number}
export const activatableStatuses=['shipped','order_sent','order_accepted','activated'] as const;
export function canRegisterExtraction(status:string){return (activatableStatuses as readonly string[]).includes(status)}
export function localDateTime(instant:number|string){
 const date=new Date(instant);if(!Number.isFinite(date.getTime()))return '';
 const pad=(value:number)=>String(value).padStart(2,'0');
 return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
export function parseLocalExtraction(value:string):string|null {
 const match=/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value);if(!match)return null;
 const [,year,month,day,hour,minute]=match.map(Number);
 const date=new Date(year,month-1,day,hour,minute);
 // Reject normalized impossible dates and local DST gaps rather than silently changing them.
 if(date.getFullYear()!==year||date.getMonth()!==month-1||date.getDate()!==day||date.getHours()!==hour||date.getMinutes()!==minute)return null;
 return date.toISOString();
}
export function validateKitExtraction(cycle:ActivationCycle|undefined,extractionAt:string,now=Date.now()):string|null {
 if(!cycle||!canRegisterExtraction(cycle.status))return 'Esta etapa del kit no permite registrar o corregir la extracción.';
 const value=Date.parse(extractionAt);
 if(!Number.isFinite(value))return 'Indica una fecha y una hora válidas.';
 if(value>now+60*60*1000)return 'La fecha no puede superar en más de una hora el momento actual.';
 if(value<now-30*86400000)return 'La fecha debe estar dentro de los últimos 30 días.';
 return null;
}
export function sameActivationRevision(current:ActivationCycle|undefined,expected:ActivationCycle){
 return Boolean(current&&current.id===expected.id&&current.status===expected.status&&(current.version??1)===(expected.version??1)&&(current.extractionAt??null)===(expected.extractionAt??null));
}
export function applyKitExtraction<T extends ActivationCycle>(current:T|undefined,expected:ActivationCycle,extractionAt:string,now=Date.now()):T|undefined {
 if(!sameActivationRevision(current,expected)||validateKitExtraction(current,extractionAt,now))return undefined;
 return {...current!,extractionAt,version:(current!.version??1)+1};
}
export function cycleStep(status:string,fallback:number){
 const steps:Record<string,number>={scheduled:0,kit_assigned:0,shipped:1,order_sent:1,order_accepted:1,activated:2,sample_received:3,processing:3,completed:4,ready:4};
 return steps[status]??fallback;
}
export function cycleStatusLabel(status:string){
 const labels:Record<string,string>={scheduled:'Programado',kit_assigned:'Kit asignado',shipped:'Enviado',order_sent:'Orden enviada al laboratorio',order_accepted:'Orden aceptada por el laboratorio',activated:'Extracción registrada',sample_received:'Muestra recibida',processing:'En proceso',completed:'Completado',ready:'Informe disponible',cancelled:'Cancelado'};
 return labels[status]||'Estado pendiente de confirmar';
}
