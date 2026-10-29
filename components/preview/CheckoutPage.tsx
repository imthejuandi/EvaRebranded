'use client';
import {useEffect,useState} from 'react';
import {usePreview} from './PreviewProvider';
import {AppPageHeader,AsyncState} from './AppPrimitives';
import {ActionLink} from '@/components/site/Primitives';
import {flowHref,readFlowIntent,type FlowIntent} from '@/lib/preview/policy';
import type {MemberPlan} from '@/lib/preview/model';

/** Original checkout accepts three paid intents; annual changes billing, not sampling cadence. */
export function checkoutChoice(plan:MemberPlan|null){
 if(plan==='quarterly')return {label:'EVA Trimestral',title:'Una muestra cada trimestre.',price:'99',billing:'Por trimestre · renovación trimestral ilustrativa.',recurring:true};
 if(plan==='annual')return {label:'EVA Anual',title:'Una muestra cada trimestre. Un pago al año.',price:'396',billing:'Por año · facturación y renovación anual ilustrativas.',recurring:true};
 if(plan==='full_panel')return {label:'Panel en laboratorio',title:'Una visita al laboratorio.',price:'499',billing:'Pago único · sin renovación automática.',recurring:false};
 return null;
}

export default function CheckoutPage(){
 const{state,update,request,hydrated}=usePreview();
 const[intent,setIntent]=useState<FlowIntent>({plan:null,returnTo:'/es/dashboard',reportId:null,invalidPlan:false});
 const[loaded,setLoaded]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(''),[done,setDone]=useState(false),[cancelled,setCancelled]=useState(false),[fail,setFail]=useState(false);
 useEffect(()=>{const q=new URLSearchParams(location.search);setIntent(readFlowIntent(q));setCancelled(q.get('cancelled')==='true');setFail(q.get('state')==='error');setLoaded(true)},[]);
 const plan=intent.plan;
 const choice=checkoutChoice(plan);
 async function confirm(){
  if(!hydrated||!state.session||busy||!plan||plan==='free'||intent.invalidPlan)return;
  setBusy(true);setError('');const r=await request('checkout.create',{plan,locale:'es',simulateError:fail});setBusy(false);setFail(false);
  if(!r.ok){setError(r.message);return}
  // This is the only purchase-flow transition that grants preview paid access.
  update({plan,subscriptionStatus:'active',kitStep:0,kitReportId:null,kitCycle:plan==='full_panel'?undefined:{id:'demo-cycle-purchase',status:'scheduled',dueDate:null,trackingCode:null,extractionAt:null,version:1,reportId:null}});setDone(true);
 }
 const checkoutReturn=flowHref('/es/checkout/resume',intent);
 const loginHref=flowHref('/es/login',{...intent,returnTo:checkoutReturn});
 const returnPath=new URL(intent.returnTo,'https://eva.invalid').pathname;
 const continuation=intent.returnTo!=='/es/dashboard'&&!['/es/checkout/resume','/es/checkout-resume'].includes(returnPath)?intent.returnTo:'/es/book';
 return <div className="page-checkout"><AppPageHeader eyebrow="Tu elección" title={done?'La simulación está lista.':'Revisa tu opción.'} description="Precios y servicios de ejemplo. No se realizan cargos ni reservas."/>
  {!hydrated||!loaded?<AsyncState message="Preparando tu elección…"/>:!choice||!plan||plan==='free'||intent.invalidPlan?<AsyncState error message="Selecciona una opción válida para continuar. Tu cuenta mantiene su acceso actual."><ActionLink href="/es/pricing">Comparar opciones</ActionLink></AsyncState>:!state.session?<AsyncState message="Inicia una sesión de ejemplo para conservar tu elección."><ActionLink href={loginHref}>Iniciar sesión</ActionLink></AsyncState>:<div className="checkout-layout">
   <article className="checkout-summary"><p className="eva-kicker">{choice.label}</p><h2>{choice.title}</h2><p className="checkout-price">{choice.price}<span>€</span></p><p>{choice.billing}</p>{plan==='annual'&&<p>La facturación anual conserva la recogida trimestral. El importe es provisional en este ejemplo y no supone un descuento.</p>}<ul>{(choice.recurring?['Panel de ejemplo de 15 biomarcadores.','Recogida de muestra en casa con Tasso+.','Análisis en laboratorio.','Kit y envío de ida y vuelta.','Informe con valores, unidades y fecha.']:['Extracción en un laboratorio asociado.','Alcance del panel pendiente de confirmación.','Informe con valores, unidades y fecha.']).map(v=><li key={v}>{v}</li>)}</ul><p className="eva-note">La composición del panel, las funciones y las condiciones comerciales finales están pendientes de confirmación.</p></article>
   <div className="checkout-confirm">{done?<div role="status"><p className="eva-kicker">Simulación completa</p><h2>Continúa con el ejemplo.</h2><p>No se ha realizado ningún cargo ni pedido. El acceso de pago está activo solo en esta demostración.</p><ActionLink href={continuation}>{continuation==='/es/book'?'Ver el seguimiento de ejemplo':'Volver a lo que estabas viendo'}</ActionLink></div>:<><h2>Todo en un mismo lugar.</h2>{cancelled&&<AsyncState message="La confirmación se interrumpió. Tu elección sigue aquí para que puedas retomarla."/>}<p>Esta vista previa permite explorar la confirmación y el seguimiento sin pedir datos de tarjeta.</p>{choice.recurring&&<div className="checkout-address"><span>Dirección de ejemplo</span><p>{state.profile.address||'Añade una dirección desde tu perfil.'}<br/>{state.profile.postalCode} · {state.profile.city}</p><a className="eva-text-link" href="/es/profile#direccion">Revisar dirección</a></div>}<p className="eva-note">{choice.recurring?'Revisa las condiciones de renovación y cancelación antes de contratar.':'Confirma el alcance y la disponibilidad del panel antes de contratar.'} <a href="/es/legal/terms">Ver condiciones</a></p>{error&&<AsyncState error message={error}/>}<button disabled={busy} className="eva-button" onClick={confirm}>{busy?'Preparando…':error?'Volver a intentar':'Simular confirmación del plan'}</button><a className="eva-text-link" href="/es/pricing">Volver a comparar opciones</a></>}</div>
  </div>}
 </div>;
}
