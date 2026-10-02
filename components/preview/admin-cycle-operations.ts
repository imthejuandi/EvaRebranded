// Mirrors the pinned production cycle action contract; runs only against synthetic rows.
export const cycleStates = {awaiting_fulfillment:'Por preparar',kit_assigned:'Kit asignado',shipped:'Enviado',error:'Requiere revisión',order_sent:'Orden enviada',completed:'Completado',cancelled:'Cancelado'} as const;
export type CycleStatus = keyof typeof cycleStates;
export type CycleAction = 'assign_kit'|'ship'|'reopen'|'cancel';
export type CyclePayload = {cycleId:string;action:CycleAction;kitLabelCode?:string;trackingNumber?:string;trackingUrl?:string};
export type DemoCycle = {id:string;name:string;status:CycleStatus;version:number;dueDate:string;kitLabelCode:string|null;trackingNumber:string|null;profileReadiness:{ready:boolean;missing:string[]};panelConfigured:boolean};
const transitions:Record<CycleAction,{from:CycleStatus[];to:CycleStatus}> = {
 assign_kit:{from:['awaiting_fulfillment'],to:'kit_assigned'},ship:{from:['kit_assigned'],to:'shipped'},reopen:{from:['kit_assigned','error'],to:'awaiting_fulfillment'},cancel:{from:['awaiting_fulfillment','kit_assigned','shipped','error'],to:'cancelled'},
};
export const cycleActionLabels:Record<CycleAction,string>={assign_kit:'Asignar kit',ship:'Registrar envío',reopen:'Reabrir preparación',cancel:'Cancelar ciclo'};
export const actionsForCycle=(status:CycleStatus)=>(Object.keys(transitions) as CycleAction[]).filter(action=>transitions[action].from.includes(status));
export function createDemoCycles():DemoCycle[]{return [
 {id:'00000000-0000-4000-8000-000000000001',name:'Ejemplo A · Por preparar',status:'awaiting_fulfillment',version:1,dueDate:'2026-09-23',kitLabelCode:null,trackingNumber:null,profileReadiness:{ready:true,missing:[]},panelConfigured:true},
 {id:'00000000-0000-4000-8000-000000000002',name:'Ejemplo B · Identidad pendiente',status:'kit_assigned',version:1,dueDate:'2026-09-24',kitLabelCode:'DEMO-KIT-B',trackingNumber:null,profileReadiness:{ready:false,missing:['Documento de identidad','Fecha de nacimiento']},panelConfigured:true},
 {id:'00000000-0000-4000-8000-000000000003',name:'Ejemplo C · Panel pendiente',status:'kit_assigned',version:1,dueDate:'2026-09-25',kitLabelCode:'DEMO-KIT-C',trackingNumber:null,profileReadiness:{ready:true,missing:[]},panelConfigured:false},
 {id:'00000000-0000-4000-8000-000000000004',name:'Ejemplo D · Incidencia',status:'error',version:1,dueDate:'2026-09-22',kitLabelCode:'DEMO-KIT-D',trackingNumber:null,profileReadiness:{ready:true,missing:[]},panelConfigured:true},
 {id:'00000000-0000-4000-8000-000000000005',name:'Ejemplo E · Completado',status:'completed',version:1,dueDate:'2026-09-10',kitLabelCode:'DEMO-KIT-E',trackingNumber:'DEMO-TRACK-E',profileReadiness:{ready:true,missing:[]},panelConfigured:true},
];}
export function cyclePayload(cycleId:string,action:CycleAction,fields:{kitLabelCode?:string;trackingNumber?:string;trackingUrl?:string}={}):CyclePayload{
 if(!/^[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i.test(cycleId))throw Error('Elige un ciclo válido.');
 if(!transitions[action])throw Error('Acción desconocida.');
 const payload:CyclePayload={cycleId,action};
 for(const key of ['kitLabelCode','trackingNumber','trackingUrl'] as const){const value=fields[key]?.trim();if(value)payload[key]=value;}
 if(action==='assign_kit'&&(!payload.kitLabelCode||payload.kitLabelCode.length<3||payload.kitLabelCode.length>64))throw Error('La etiqueta debe tener entre 3 y 64 caracteres.');
 if(action==='ship'&&(!payload.trackingNumber||payload.trackingNumber.length<4||payload.trackingNumber.length>64))throw Error('El seguimiento debe tener entre 4 y 64 caracteres.');
 if(payload.trackingUrl){let url:URL;try{url=new URL(payload.trackingUrl)}catch{throw Error('Revisa el enlace de seguimiento.')}if(!['https:','http:'].includes(url.protocol)||payload.trackingUrl.length>500)throw Error('Usa un enlace de seguimiento web válido.');}
 return payload;
}
export function applyCycleAction(cycles:DemoCycle[],payload:CyclePayload,expectedVersion:number):DemoCycle[]{
 const cycle=cycles.find(item=>item.id===payload.cycleId);if(!cycle)throw Error('El ciclo ya no está disponible.');
 if(cycle.version!==expectedVersion)throw Error('El ciclo cambió. Revisa su estado antes de repetir la acción.');
 cyclePayload(payload.cycleId,payload.action,payload);
 if(!transitions[payload.action].from.includes(cycle.status))throw Error('Esta acción ya no está permitida en el estado actual.');
 if(payload.action==='assign_kit'&&cycles.some(item=>item.id!==cycle.id&&item.kitLabelCode===payload.kitLabelCode))throw Error('La etiqueta ya está asignada a otro ciclo.');
 if(payload.action==='ship'&&!cycle.profileReadiness.ready)throw Error(`Identidad pendiente: ${cycle.profileReadiness.missing.join(', ')}. La persona debe completar su perfil.`);
 if(payload.action==='ship'&&!cycle.panelConfigured)throw Error('El panel no tiene códigos de laboratorio configurados. No se puede registrar el envío.');
 return cycles.map(item=>item.id!==cycle.id?item:{...item,status:transitions[payload.action].to,version:item.version+1,kitLabelCode:payload.action==='assign_kit'?payload.kitLabelCode!:payload.action==='reopen'?null:item.kitLabelCode,trackingNumber:payload.action==='ship'?payload.trackingNumber!:item.trackingNumber});
}
export function simulateBridgePass(fail=false){return fail?{ok:false as const,error:'No se completó la pasada de ejemplo. Puedes volver a intentarlo.'}:{ok:true as const,summary:{uploaded:1,acks:1,orus:0,errors:[] as string[],ms:24}};}
