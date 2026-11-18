'use client';
import {uploadAllowance} from '@/lib/site-content/upload-allowance';
import {useEffect,useState} from 'react';
import {usePreview} from './PreviewProvider';
import {AppPageHeader,AsyncState} from './AppPrimitives';
import {ActionLink} from '@/components/site/Primitives';
import {flowHref,readFlowIntent,type FlowIntent} from '@/lib/preview/policy';
import {purchasePreviewPlan} from '@/lib/preview/subscription';
import {starterSubscription} from '@/lib/site-content/starter-subscription';
import type {MemberPlan} from '@/lib/preview/model';

const kit = starterSubscription.es;

export function checkoutChoice(plan:MemberPlan|null){
 if(plan==='quarterly')return {label:kit.planName,title:'Tu kit de 13 biomarcadores en casa.',price:'99',billing:kit.cancelAnytime,homeKit:true};
 if(plan==='full_panel')return {label:'Panel en laboratorio',title:'Una visita al laboratorio.',price:'499',billing:'Pago único · sin renovación automática.',homeKit:false};
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
  if(!hydrated||!state.session||busy||!choice||(plan!=='quarterly'&&plan!=='full_panel')||intent.invalidPlan)return;
  setBusy(true);setError('');const r=await request('checkout.create',{plan,locale:'es',simulateError:fail});setBusy(false);setFail(false);
  if(!r.ok){setError(r.message);return}
  // This is the only purchase-flow transition that grants preview paid access.
  update(current=>purchasePreviewPlan(current,plan));setDone(true);
 }
 const checkoutReturn=flowHref('/es/checkout/resume',intent);
 const loginHref=flowHref('/es/login',{...intent,returnTo:checkoutReturn});
 const returnPath=new URL(intent.returnTo,'https://eva.invalid').pathname;
 const continuation=intent.returnTo!=='/es/dashboard'&&!['/es/checkout/resume','/es/checkout-resume'].includes(returnPath)?intent.returnTo:'/es/book';
 return <div className="page-checkout"><AppPageHeader eyebrow="Tu elección" title={done?'La simulación está lista.':'Revisa tu opción.'} description="Precios y servicios de ejemplo. No se realizan cargos ni reservas."/>
  {!hydrated||!loaded?<AsyncState message="Preparando tu elección…"/>:plan==='annual'?<AsyncState message="La opción anual ya no está disponible. Consulta las opciones actuales para elegir cómo continuar."><ActionLink href="/es/pricing">Ver opciones actuales</ActionLink></AsyncState>:!choice||!plan||plan==='free'||intent.invalidPlan?<AsyncState error message="Selecciona una opción válida para continuar. Tu cuenta mantiene su acceso actual."><ActionLink href="/es/pricing">Comparar opciones</ActionLink></AsyncState>:!state.session?<AsyncState message="Inicia una sesión de ejemplo para conservar tu elección."><ActionLink href={loginHref}>Iniciar sesión</ActionLink></AsyncState>:<div className="checkout-layout">
   <article className="checkout-summary"><p className="eva-kicker">{choice.label}</p><h2>{choice.title}</h2><p className="checkout-price">{choice.price}<span>€{plan==='quarterly'&&` + IVA ${kit.frequency}`}</span></p><p>{choice.billing}</p><ul>{(plan==='quarterly'?['Recogida de muestra en casa con Tasso+.','Análisis de 13 biomarcadores en laboratorio.','Resultados explicados junto a los valores, unidades e intervalos del laboratorio.',kit.rationale,uploadAllowance.es.subscribed]:['Extracción en un laboratorio asociado.',uploadAllowance.es.labYear,'Alcance del panel pendiente de confirmación.','Informe con valores, unidades y fecha.']).map(v=><li key={v}>{v}</li>)}</ul><p className="eva-note">{plan==='quarterly'?'La frecuencia de las pruebas depende de tu situación. Puedes comentarla con tu profesional sanitario.':'La composición del panel, las funciones y las condiciones comerciales finales están pendientes de confirmación.'}</p></article>
   <div className="checkout-confirm">{done?<div role="status"><p className="eva-kicker">Simulación completa</p><h2>Continúa con el ejemplo.</h2><p>No se ha realizado ningún cargo ni pedido. El acceso de pago está activo solo en esta demostración.</p><ActionLink href={continuation}>{continuation==='/es/book'?'Ver el seguimiento de ejemplo':'Volver a lo que estabas viendo'}</ActionLink></div>:<><h2>Todo en un mismo lugar.</h2>{cancelled&&<AsyncState message="La confirmación se interrumpió. Tu elección sigue aquí para que puedas retomarla."/>}<p>Esta vista previa permite explorar la confirmación y el seguimiento sin pedir datos de tarjeta.</p>{choice.homeKit&&<div className="checkout-address"><span>Dirección de ejemplo</span><p>{state.profile.address||'Añade una dirección desde tu perfil.'}<br/>{state.profile.postalCode} · {state.profile.city}</p><a className="eva-text-link" href="/es/profile#direccion">Revisar dirección</a></div>}<p className="eva-note">{plan==='quarterly'?`${kit.pricePerQuarter}. ${kit.cancelAnytime}`:'Confirma el alcance y la disponibilidad del panel antes de contratar.'} <a href="/es/legal/terms">Ver condiciones</a></p>{error&&<AsyncState error message={error}/>}<button disabled={busy} className="eva-button" onClick={confirm}>{busy?'Preparando…':error?'Volver a intentar':plan==='quarterly'?'Simular la suscripción':'Simular confirmación del plan'}</button><a className="eva-text-link" href="/es/pricing">Volver a comparar opciones</a></>}</div>
  </div>}
 </div>;
}
