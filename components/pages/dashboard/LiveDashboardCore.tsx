import type {DashboardReadResult,DashboardReadStatus} from '@/lib/dashboard/backend-contract';
import {dashboardMetricReadout} from '@/lib/dashboard/backend-readout';
import {HealthSignature} from './HealthSignature';

const states:Record<DashboardReadStatus,[string,string]>={
 unconfigured:['La conexión aún no está configurada.','Esta vista necesita la configuración pública de Supabase del proyecto EVA y una sesión válida en este entorno. No se muestran datos de ejemplo como resultados reales.'],
 unauthenticated:['Necesitas una sesión de EVA.','No hay una sesión válida en este entorno. El acceso de la vista previa usa datos de ejemplo y no autentica una cuenta real.'],
 profile_missing:['Tu perfil no está disponible.','No podemos recuperar un perfil asociado a esta sesión.'],
 onboarding_required:['Completa tu perfil para continuar.','El perfil todavía tiene pasos pendientes en EVA.'],
 consent_required:['Revisa tu consentimiento.','No se muestran resultados sin el consentimiento registrado para tratar los datos de salud.'],
 access_required:['Revisa el acceso de tu cuenta.','Esta lectura requiere el acceso correspondiente de EVA.'],
 no_ready_report:['Tu lectura todavía no está disponible.','Se mostrará cuando tengas un informe listo.'],
 unavailable:['No pudimos recuperar tu lectura.','Inténtalo de nuevo más tarde. No sustituimos una respuesta fallida por resultados de ejemplo.'],
 invalid_data:['No podemos mostrar esta lectura.','La respuesta no tiene la información necesaria para presentar los resultados con su procedencia.'],
};

/** Server-rendered source text until the new summary design is approved. */
export function LiveDashboardCore({result}:{result:DashboardReadResult}) {
 if(result.status!=='ready'){
   const [title,description]=states[result.status];
   return <section className="live-state" data-backend-state={result.status}><p>MI EVA / CONEXIÓN</p><h1>{title}</h1><p>{description}</p><a href="/es/dashboard">Volver al diseño con datos de ejemplo →</a><a href="https://www.evahealth.es/es/dashboard">Abrir mi cuenta en EVA →</a></section>;
 }
 const {snapshot}=result;
 const data=dashboardMetricReadout(snapshot);
 const date=new Intl.DateTimeFormat('es',{dateStyle:'long',timeZone:'UTC'}).format(new Date(snapshot.report.collectionDate));
 const narrative=snapshot.summary.es??snapshot.summary.en;
 const language=snapshot.summary.es?'es':'en';
 const sourceHref=`https://www.evahealth.es/es/labs?result=${encodeURIComponent(snapshot.report.id)}`;
 const display=(value:unknown)=>value===null||value===undefined?'No consta':String(value);
 return <div data-backend-state="ready" data-backend-report={snapshot.report.id}>
   <h1 className="live-greeting">{snapshot.profile.firstName?`Hola, ${snapshot.profile.firstName}.`:'Tu lectura de EVA.'}</h1>
   {snapshot.pending.length>0&&<p className="live-pending">Tienes {snapshot.pending.length===1?'una muestra pendiente':'muestras pendientes'} de contexto. Esta es tu última lectura disponible.</p>}
   <HealthSignature {...data} source="backend" reportHref={sourceHref}/>
   <section id="dashboard-reading" className="live-source-reading" aria-labelledby="live-source-title"><p className="live-eyebrow">INFORME DEL {date.toLocaleUpperCase('es')}</p><h2 id="live-source-title">La lectura de tu informe.</h2>{narrative?<><div lang={language}>{narrative.split(/\n\s*\n/).map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div>{language==='en'&&<p>Este texto está disponible en inglés.</p>}</>:<p>Este informe todavía no incluye un resumen.</p>}<a href={sourceHref}>Ver el informe en EVA →</a></section>
   <details className="live-method" id="dashboard-estimate-method"><summary>Método y procedencia</summary><p>La edad del perfil puede reunir varias muestras. EVA Score y este resumen pertenecen al informe del {date}.</p><dl><div><dt>Método de edad del perfil</dt><dd>{display(snapshot.profile.current_ba_method)}</dd></div><div><dt>Informes incluidos</dt><dd>{display(snapshot.profile.current_ba_n_labs_averaged)}</dd></div><div><dt>Ventana en meses</dt><dd>{display(snapshot.profile.current_ba_window_months)}</dd></div><div><dt>Biomarcadores usados en la edad del perfil</dt><dd>{display(snapshot.profile.current_ba_n_markers_used)}</dd></div><div><dt>Último cálculo de la edad del perfil</dt><dd>{snapshot.profile.current_ba_computed_at?new Intl.DateTimeFormat('es',{dateStyle:'long',timeZone:'UTC'}).format(new Date(snapshot.profile.current_ba_computed_at)):'No consta'}</dd></div><div><dt>Método de edad de este informe</dt><dd>{display(snapshot.report.bio_age_method)}</dd></div><div><dt>Biomarcadores usados en la edad del informe</dt><dd>{display(snapshot.report.bio_age_n_markers)}</dd></div></dl></details>
 </div>;
}
