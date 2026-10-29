'use client';
import {useEffect,useState,useRef} from 'react';
import {usePreview} from './PreviewProvider';
import {AsyncState,AppPageHeader,EmptyState,ConfirmationDialog,SourceTag} from './AppPrimitives';
import {ActionLink} from '@/components/site/Primitives';
import ReportEditor from './ReportEditor';
import {dateLabel} from '@/lib/preview/fixtures';
import {archiveReport,restoreReport} from './archive-policy';
import './archive-workbench.css';

export default function ArchivePage(){
 const{state,update,request,hydrated}=usePreview();
 const origin=useRef<HTMLButtonElement|null>(null),actionOrigin=useRef<HTMLButtonElement|null>(null),failed=useRef(false);
 const[selected,setSelected]=useState<string|null>(null),[filter,setFilter]=useState('active'),[query,setQuery]=useState(''),[target,setTarget]=useState<{id:string;action:'archive'|'restore'}|null>(null),[busy,setBusy]=useState(false),[note,setNote]=useState(''),[error,setError]=useState(false);
 useEffect(()=>{setSelected(new URLSearchParams(location.search).get('lab'))},[]);
 const selectedReport=state.reports.find(r=>r.id===selected&&r.status!=='archived');
 const targetReport=state.reports.find(report=>report.id===target?.id);
 const rows=state.reports.filter(r=>(filter==='archived'?r.status==='archived':r.status!=='archived')&&`${r.name} ${r.id} ${r.date}`.toLocaleLowerCase('es').includes(query.trim().toLocaleLowerCase('es'))).sort((a,b)=>b.date.localeCompare(a.date));
 function closeDialog(){setTarget(null);requestAnimationFrame(()=>actionOrigin.current?.focus())}
 async function archive(){
  if(!target||busy)return;const change=target;setBusy(true);setNote('');setError(false);
  try{const result=await request('report.archive',{reportId:change.id,action:change.action,simulateError:state.scenario==='error'&&!failed.current});if(!result.ok)throw Error(result.message);
   update(s=>({...s,reports:s.reports.map(r=>r.id===change.id?(change.action==='archive'?archiveReport(r):restoreReport(r)):r)}));
   if(selected===change.id)setSelected(null);
   setNote(change.action==='archive'?'Informe de ejemplo archivado. Sus valores se conservan y puedes restaurarlo.':'Informe de ejemplo restaurado con su estado anterior.');closeDialog();
  }catch{failed.current=true;setError(true);setNote('No se pudo guardar el cambio. El informe conserva su estado. Puedes volver a intentarlo.');closeDialog()}finally{setBusy(false)}
 }
 if(!hydrated)return <AsyncState message="Cargando tus informes…"/>;
 if(!state.session||state.deletionStatus==='completed')return <EmptyState title="Entra para ver tus informes." description="Tus informes aparecen dentro de tu sesión de ejemplo."><ActionLink href={`/es/login?redirect=${encodeURIComponent('/es/labs/manage'+(selected?'?lab='+encodeURIComponent(selected):''))}`}>Iniciar sesión</ActionLink></EmptyState>;
 if(!state.profile.healthConsent)return <EmptyState title="Tus resultados están ocultos." description="Revisa el permiso para mostrar datos de salud en tu perfil."><ActionLink href="/es/profile#consentimientos">Revisar permisos</ActionLink></EmptyState>;
 return <div className="page-archive"><AppPageHeader eyebrow="Resultados" title="Tus informes." description="Consulta sus fechas, revisa los datos y organiza tu archivo." action={<ActionLink href="/es/upload">Añadir resultados</ActionLink>}/>
  <div className="archive-tools"><div role="group" aria-label="Estado del archivo"><button aria-pressed={filter==='active'} onClick={()=>setFilter('active')}>Activos <span>{state.reports.filter(r=>r.status!=='archived').length}</span></button><button aria-pressed={filter==='archived'} onClick={()=>setFilter('archived')}>Archivados <span>{state.reports.filter(r=>r.status==='archived').length}</span></button></div><label className="eva-field">Buscar un informe<input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Nombre, referencia o fecha"/></label></div>
  <p className="archive-explanation">Archivar conserva el informe y permite restaurarlo. Para eliminar un informe activo, abre «Revisar datos» y confirma la eliminación.</p>
  {note&&<p role={error?'alert':'status'} className={error?'archive-feedback is-error':'archive-feedback'}>{note}</p>}
  {selected&&!selectedReport&&<p className="archive-feedback">{state.reports.some(r=>r.id===selected)?'Este informe está archivado. Restáuralo para revisar sus datos.':'El informe seleccionado ya no está disponible.'}</p>}
  {!rows.length?<EmptyState title={query?'No hay coincidencias.':filter==='archived'?'Tu archivo está vacío.':'Todavía no tienes informes activos.'} description={query?'Prueba con otro nombre, referencia o fecha.':filter==='archived'?'Los informes que archives aparecerán aquí y podrás restaurarlos.':'Añade un informe o consulta los que hayas archivado.'}>{query?<button className="eva-button" onClick={()=>setQuery('')}>Limpiar búsqueda</button>:filter==='active'?<ActionLink href="/es/upload">Añadir resultados</ActionLink>:null}</EmptyState>:<div className="archive-records">{rows.map(r=><article key={r.id} data-selected={selected===r.id}><div className="archive-title"><p>{dateLabel(r.date)}</p><h2>{r.name}</h2><SourceTag>{r.source==='kit'?'Muestra del kit':'Documento añadido'}</SourceTag><small>{r.id}</small></div><div className="archive-status"><p>{({ready:'Disponible',processing:'En proceso',pending_context:'Necesita contexto',error:'Revisar extracción',archived:'Archivado'})[r.status]}</p><span>{r.markerKeys.length} biomarcadores</span></div><div className="archive-actions">{r.status!=='archived'&&<><a className="eva-text-link" href={`/es/labs/${r.id}`}>Abrir informe</a><button className="eva-text-link" aria-label={`Revisar datos de ${r.name}`} aria-expanded={selected===r.id} aria-controls={`report-editor-${r.id}`} onClick={e=>{origin.current=e.currentTarget;setSelected(r.id)}}>Revisar datos</button></>}<button className="eva-text-link" disabled={busy} onClick={event=>{actionOrigin.current=event.currentTarget;setTarget({id:r.id,action:r.status==='archived'?'restore':'archive'})}}>{r.status==='archived'?'Restaurar':'Archivar'}</button></div></article>)}</div>}
  {selectedReport&&<ReportEditor key={selectedReport.id} report={selectedReport} onClose={()=>{setSelected(null);origin.current?.focus()}}/>}
  {target&&targetReport&&<ConfirmationDialog title={target.action==='restore'?'¿Restaurar este informe?':'¿Archivar este informe?'} description={`${targetReport.name}. ${target.action==='restore'?'Volverá a tus informes activos conservando el estado anterior al archivo.':'Sus datos se conservan. Podrás encontrarlo en Archivados y restaurarlo.'} Este cambio afecta solo a la demostración.`} onCancel={closeDialog} onConfirm={archive} busy={busy} confirmLabel={target.action==='restore'?'Restaurar ejemplo':'Archivar ejemplo'}/>}
 </div>;
}
