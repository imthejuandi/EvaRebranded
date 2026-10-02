// Local contract simulation. Never sets the real beta cookie or submits an email.
export type BetaScenario='normal'|'unconfigured'|'failure';
export function betaNext(raw:unknown){
 if(typeof raw!=='string'||!raw.startsWith('/')||raw.startsWith('//')||raw.includes('\\')||/[\r\n]/.test(raw))return '/es/dashboard';
 try{const parsed=new URL(raw,'https://preview.invalid');if(parsed.origin!=='https://preview.invalid'||decodeURIComponent(parsed.pathname).includes('/beta'))return '/es/dashboard';return parsed.pathname+parsed.search+parsed.hash;}catch{return '/es/dashboard';}
}
export function simulateBetaAccess(payload:{password:string;next?:string},scenario:BetaScenario='normal'){
 if(scenario==='unconfigured')return {ok:false as const,status:503,error:'Acceso de ejemplo sin configurar. No se ha abierto ningún acceso.'};
 if(scenario==='failure')return {ok:false as const,status:500,error:'No se pudo comprobar el acceso de ejemplo. Vuelve a intentarlo.'};
 if(payload.password!=='EVA-DEMO')return {ok:false as const,status:401,error:'Contraseña de ejemplo incorrecta. Usa EVA-DEMO.'};
 return {ok:true as const,status:200,next:betaNext(payload.next)};
}
export function simulateBetaSubscribe(payload:{email:string;locale:string},seen:ReadonlySet<string>,fail=false){
 const email=payload.email.trim().toLowerCase(),locale=payload.locale==='en'?'en':'es';
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return {ok:false as const,httpStatus:400,error:'Escribe un correo válido.'};
 if(fail)return {ok:false as const,httpStatus:500,error:'No se pudo completar la inscripción de ejemplo. Tus datos siguen aquí para reintentar.'};
 return {ok:true as const,httpStatus:200,status:seen.has(email)?'duplicate' as const:'subscribed' as const,email,locale};
}
