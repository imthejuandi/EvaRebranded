'use client';

import {useEffect,useRef,useState,type FormEvent} from 'react';
import {usePreview} from '@/components/preview/PreviewProvider';
import {applyKitExtraction,canRegisterExtraction,cycleStatusLabel,localDateTime,parseLocalExtraction,sameActivationRevision,validateKitExtraction} from './kit-activation';

/** A useful service receipt, not a progress simulation: only the draw timestamp is editable. */
export default function KitActivation(){
 const {state,update,request}=usePreview();const cycle=state.kitCycle;
 const [value,setValue]=useState(''),[editing,setEditing]=useState(false),[busy,setBusy]=useState(false),[error,setError]=useState(''),[notice,setNotice]=useState(''),[timezone,setTimezone]=useState('zona local del dispositivo'),[orderWarning,setOrderWarning]=useState(false);
 const latest=useRef(state),sequence=useRef(0),failed=useRef(false);latest.current=state;
 useEffect(()=>{sequence.current+=1;failed.current=false;setEditing(false);setBusy(false);setError('');setNotice('');setValue(localDateTime(cycle?.extractionAt||Date.now()));setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone||'zona local del dispositivo');return()=>{sequence.current+=1}},[cycle?.id,cycle?.status,state.scenario,state.session]);
 if(!cycle)return null;
 const allowed=canRegisterExtraction(cycle.status)&&state.session&&state.profile.healthConsent;
 const formatInstant=(value:string)=>Number.isFinite(Date.parse(value))?new Intl.DateTimeFormat('es',{dateStyle:'medium',timeStyle:'short'}).format(new Date(value)):'Fecha no disponible';
 const due=cycle.dueDate&&/^\d{4}-\d{2}-\d{2}$/.test(cycle.dueDate)?new Intl.DateTimeFormat('es',{dateStyle:'medium',timeZone:'UTC'}).format(new Date(cycle.dueDate+'T12:00:00Z')):null;
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(busy||!cycle||!allowed)return;
  const extractionAt=parseLocalExtraction(value);const validation=extractionAt?validateKitExtraction(cycle,extractionAt):'Indica una fecha y una hora válidas.';
  if(validation||!extractionAt){setError(validation||'Revisa la fecha.');return}
  const expected={...cycle},token=++sequence.current;setBusy(true);setError('');setNotice('');
  try{
   const result=await request('kit.activate',{cycleId:cycle.id,extractionAt,simulated:true,simulateError:state.scenario==='error'&&!failed.current});
   if(token!==sequence.current)return;
   const current=latest.current;
   if(!current.session||!current.profile.healthConsent||!sameActivationRevision(current.kitCycle,expected)){setError('El kit cambió mientras guardabas. Revisa su estado antes de volver a intentarlo.');return}
   if(!result.ok){failed.current=true;setError('No se pudo guardar la fecha de ejemplo. Conservamos tu edición para reintentar.');return}
   if(!applyKitExtraction(current.kitCycle,expected,extractionAt)){setError('La fecha o la etapa ya no permiten este cambio. Revisa los datos.');return}
   update(snapshot=>{if(!snapshot.session||!snapshot.profile.healthConsent)return snapshot;const next=applyKitExtraction(snapshot.kitCycle,expected,extractionAt);return next?{...snapshot,kitCycle:next,lastAction:'Fecha de extracción guardada en el ejemplo.'}:snapshot});
   setEditing(false);setNotice(orderWarning?'Fecha guardada en el ejemplo. El aviso al laboratorio queda pendiente en esta simulación.':'Fecha guardada en el ejemplo. No se ha enviado ningún aviso ni modificado el estado del kit.');
  }catch{if(token===sequence.current){failed.current=true;setError('No se pudo guardar la fecha de ejemplo. Conservamos tu edición para reintentar.')}}finally{if(token===sequence.current)setBusy(false)}
 }
 return <section className="book-cycle-evidence" aria-labelledby="book-cycle-title">
  <div className="book-cycle-heading"><div><p className="book-eyebrow">CICLO DE EJEMPLO</p><h2 id="book-cycle-title">Los datos de esta muestra.</h2></div><span className="book-cycle-id">{cycle.id}</span></div>
  <dl className="book-cycle-facts"><div><dt>Estado guardado</dt><dd>{cycleStatusLabel(cycle.status)}</dd></div><div><dt>Fecha prevista del ciclo</dt><dd>{due||'Sin fecha disponible'}</dd></div><div><dt>Seguimiento del envío</dt><dd>{cycle.trackingCode||'Sin código disponible'}</dd></div><div><dt>Extracción registrada</dt><dd>{cycle.extractionAt?<time dateTime={cycle.extractionAt}>{formatInstant(cycle.extractionAt)}</time>:'Aún sin registrar'}</dd></div></dl>
  <p className="book-cycle-note">Datos ficticios · Las horas se muestran en {timezone}. El código de seguimiento es de ejemplo; no enlaza con un envío real.</p>
  {allowed?cycle.extractionAt&&!editing?<button className="book-activation-correct" type="button" onClick={()=>{setValue(localDateTime(cycle.extractionAt!));setEditing(true);setError('');setNotice('')}}>Corregir fecha y hora</button>:<form className="book-activation-form" onSubmit={submit} noValidate aria-busy={busy}>
   <div><h3>{cycle.extractionAt?'Corrige la fecha de extracción.':'Registra la fecha de extracción.'}</h3><p>Indica cuándo se recogió la muestra de ejemplo. Guardar esta fecha no avanza la etapa del kit.</p></div>
   <label className="eva-field">Fecha y hora de la extracción<input name="extractionAt" type="datetime-local" value={value} min={localDateTime(Date.now()-30*86400000)} max={localDateTime(Date.now()+3600000)} disabled={busy} required aria-invalid={Boolean(error)} aria-describedby="book-extraction-help" onChange={event=>{setValue(event.target.value);setError('')}}/><small id="book-extraction-help">Hora local: {timezone}. Últimos 30 días; hasta una hora por delante del momento actual.</small></label>
   <div className="book-activation-actions"><button className="eva-button" disabled={busy}>{busy?'Guardando…':error?'Reintentar registro':'Guardar fecha de ejemplo'}</button>{cycle.extractionAt&&<button className="book-activation-correct" type="button" disabled={busy} onClick={()=>{setEditing(false);setError('')}}>Cancelar corrección</button>}</div>
   <details className="book-activation-scenario"><summary>Explorar un aviso pendiente</summary><label><input type="checkbox" checked={orderWarning} disabled={busy} onChange={event=>setOrderWarning(event.target.checked)}/>Simular que la fecha se guarda y el aviso al laboratorio queda pendiente.</label></details>
  </form>:<p className="book-cycle-note">{!state.profile.healthConsent?<a href="/es/profile#consentimientos">Revisa el permiso para datos de salud antes de registrar una extracción.</a>:'La fecha solo puede registrarse o corregirse mientras el ciclo admite esta acción. El estado guardado se conserva.'}</p>}
  {error&&<p className="book-activation-feedback is-error" role="alert">{error}</p>}{notice&&<p className="book-activation-feedback" role="status">{notice}</p>}
 </section>;
}
