'use client';

import {usePreview} from '@/components/preview/PreviewProvider';
import {AppPageHeader,AsyncState} from '@/components/preview/AppPrimitives';
import './deletion.css';

export function ProfileArrow(){return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M4 12h15m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.3"/></svg>}

/** The audited API confirms deletion directly; this page does not invent a job or receipt endpoint. */
export default function DeletionPage(){
 const {state,hydrated}=usePreview();
 const complete=state.deletionStatus==='completed';
 return <div className="page-profile page-deletion"><AppPageHeader eyebrow="PRIVACIDAD / TU CUENTA" title={complete?'El ejemplo se ha eliminado.':'El control de tus datos.'} description="Recorrido de práctica. Ninguna cuenta ni dato personal real se modifica." action={<a className="profile-text-link" href="/">Volver al sitio<ProfileArrow/></a>}/>{!hydrated?<AsyncState message="Preparando la confirmación…"/>:<section className="deletion-receipt" aria-labelledby="deletion-state-title"><div className="deletion-receipt-top"><p className="eva-kicker">SOLO DATOS FICTICIOS</p><span className="deletion-state-label" data-state={complete?'complete':'not-requested'}>{complete?'Completado':'Sin eliminación confirmada'}</span></div><h2 id="deletion-state-title">{complete?'La sesión de ejemplo está cerrada.':'La eliminación se confirma desde tu perfil.'}</h2><p>{complete?'Las lecturas y conversaciones de práctica se han retirado de esta vista previa. Puedes restablecer los datos desde Escenarios para seguir explorando.':'Revisa y confirma la acción en tu perfil. Esta página no inicia solicitudes ni consulta una cola de eliminación.'}</p><p className="profile-small-note">En el servicio actual, la cuenta se elimina al confirmar. La limpieza de servicios externos se intenta después y puede necesitar seguimiento del equipo. No hay un recibo ni un estado pendiente que puedas consultar aquí.</p><div className="profile-inline-actions">{!complete&&<a className="profile-primary" href="/es/profile#datos">Ir a privacidad en mi perfil<ProfileArrow/></a>}<a className="profile-text-link" href="/es/contact">Contactar con EVA<ProfileArrow/></a></div></section>}</div>;
}
