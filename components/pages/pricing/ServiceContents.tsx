'use client';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { useState } from 'react';
import type { PlanId } from './ServiceCalendar';
const details = [
    { label: 'En casa', title: 'Un espacio en tu día.', body: 'La recogida de muestra se realiza siguiendo las instrucciones del dispositivo. El kit incluye el envío de vuelta.' },
    { label: 'En el laboratorio', title: 'Una muestra, su análisis.', body: 'El laboratorio analiza la muestra. El panel y las condiciones se confirman antes de contratar.' },
    { label: 'En tu informe', title: 'Los detalles que importan.', body: 'Valor, unidad, fecha y una explicación: información que puedes volver a consultar en tu cuenta.' },
] as const;
/** Conceptual service still life. The photograph is not the commercial kit. */
export default function ServiceContents({ plan }: {
    plan: PlanId;
}) {
    const __site = useSiteLanguage();
    const [detail, setDetail] = useState(0);
    return <div className={`service-contents service-contents--${plan}`} data-testid="service-contents">
    <div className="service-contents-scene">
      <img className="service-still" src="/art/editorial/pricing-service-still-1200.webp" srcSet="/art/editorial/pricing-service-still-640.webp 640w, /art/editorial/pricing-service-still-1200.webp 1024w" sizes="(max-width: 820px) 100vw, 62vw" width="1024" height="688" alt={__site.t("Composici\u00F3n editorial de un sobre de recogida, papel y vidrio sobre piedra iluminada por el sol.")} fetchPriority="high" decoding="async"/>
      <div className="service-document" aria-hidden="true">
        <span className="service-document-eyebrow">{__site.t("EVA / UNA LECTURA")}</span>
        <span className="service-document-title">{__site.t("Cada dato,")}<br />{__site.t("con su origen.")}</span>
        <span className="service-document-rule"/>
        <span className="service-document-row"><span>{__site.t("Valor")}</span><span>{__site.t("Unidad")}</span></span>
        <span className="service-document-row"><span>{__site.t("Fecha")}</span><span>{__site.t("Fuente")}</span></span>
        <span className="service-document-note">{__site.t("DOCUMENTO ILUSTRATIVO")}</span>
      </div>
      <div className="service-lab-card" aria-hidden="true"><span>{__site.t("EN LABORATORIO")}</span><strong>{__site.t("Una visita.")}<br />{__site.t("Tu punto de partida.")}</strong><span>{__site.t("Panel y cita a confirmar.")}</span><i /></div>
      <div className="service-scene-label"><span>{__site.t("La informaci\u00F3n empieza aqu\u00ED.")}</span><span>{__site.t("Ilustraci\u00F3n del servicio")}</span></div>
    </div>
    <div className="service-scene-caption" aria-live="polite">
      <span className="service-scene-index">{__site.t(plan === 'quarterly' ? `0${detail + 1}` : '01')}</span>
      <div><h3>{__site.t(plan === 'quarterly' ? details[detail].title : plan === 'free' ? 'Lo que ya tienes, reunido.' : 'Una extracción en laboratorio.')}</h3><p>{__site.t(plan === 'quarterly' ? details[detail].body : plan === 'free' ? 'Añade una analítica y conserva sus valores junto a la fecha y el documento original.' : 'Explora el alcance del panel y las condiciones de la visita antes de reservar. Esta vista previa no crea una cita.')}</p></div>
    </div>
    {__site.t(plan === 'quarterly' && <div className="service-scene-nav" role="group" aria-label={__site.t("Explora qu\u00E9 incluye el servicio")}>{__site.t(details.map((item, index) => <button key={item.label} type="button" aria-pressed={detail === index} onClick={() => setDetail(index)}><span aria-hidden="true">{__site.t("0")}{__site.t(index + 1)}</span>{__site.t(item.label)}<i aria-hidden="true"/></button>))}</div>)}
  </div>;
}
