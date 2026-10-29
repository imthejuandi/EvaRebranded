'use client';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import { useId, useState, type CSSProperties } from 'react';
import { EditorialReveal } from '@/components/engagement/EditorialReveal';
export type PlanId = 'free' | 'quarterly' | 'full';
type Inclusion = 'markers' | 'delivery' | 'report';
type ServiceEvent = {
    kind: 'uploaded_record' | 'home_collection' | 'laboratory_collection';
    month: number;
    label: string;
};
// Relative months describe the service rhythm, never an appointment or annual purchase.
export function serviceEvents(plan: PlanId): ServiceEvent[] {
    if (plan === 'free')
        return [{ kind: 'uploaded_record', month: 0, label: 'Tu informe' }];
    if (plan === 'full')
        return [{ kind: 'laboratory_collection', month: 0, label: 'Una visita al laboratorio' }];
    return [0, 3, 6, 9].map((month, index) => ({ kind: 'home_collection', month, label: index === 0 ? 'Primera muestra' : `A los ${month} meses` }));
}
function ServiceSymbol({ kind }: {
    kind: ServiceEvent['kind'];
}) {
    const __site = useSiteLanguage();
    return <svg viewBox="0 0 80 96" fill="none" aria-hidden="true">
    {__site.t(kind === 'uploaded_record' ? <><path d="M17 9h31l15 16v63H17z"/><path d="M48 9v17h15M27 42h25M27 52h25M27 62h16"/><circle cx="28" cy="76" r="2"/></> : kind === 'laboratory_collection' ? <><path d="M26 12h28M31 12v39L17 77q-4 9 7 9h32q11 0 7-9L49 51V12M27 64h26"/><path d="M36 29h9M36 39h9"/><circle cx="35" cy="74" r="2"/><circle cx="47" cy="78" r="2"/></> : <><rect x="12" y="22" width="56" height="62" rx="6"/><path d="M12 38h56M32 22v16M48 22v16"/><rect x="25" y="52" width="30" height="17" rx="3"/><path d="M34 60h12M40 55v10"/></>)}
  </svg>;
}
export default function ServiceCalendar({ plan, quarter, onQuarterChange, markers }: {
    plan: PlanId;
    quarter: number;
    onQuarterChange: (quarter: number) => void;
    markers: {
        code: string;
        name: string;
    }[];
}) {
    const __site = useSiteLanguage();
    const [expanded, setExpanded] = useState<Inclusion | null>(null);
    const id = useId();
    const events = serviceEvents(plan);
    const selected = events[plan === 'quarterly' ? quarter : 0];
    const tabs: {
        id: Inclusion;
        label: string;
        value: string;
    }[] = plan === 'quarterly'
        ? [{ id: 'markers', label: 'Panel de ejemplo', value: '15 biomarcadores' }, { id: 'delivery', label: 'Recogida y retorno', value: 'En casa' }, { id: 'report', label: 'Tus resultados', value: 'En un informe' }]
        : plan === 'free'
            ? [{ id: 'markers', label: 'Valores disponibles', value: 'Los de tu informe' }, { id: 'delivery', label: 'Cómo empezar', value: 'Un documento' }, { id: 'report', label: 'Tus resultados', value: 'Con su fuente' }]
            : [{ id: 'markers', label: 'Panel en laboratorio', value: 'Alcance a confirmar' }, { id: 'delivery', label: 'Tipo de recogida', value: 'Una extracción' }, { id: 'report', label: 'Tus resultados', value: 'En un informe' }];
    return <EditorialReveal className={`service-calendar service-calendar--${plan}`} style={{ '--service-quarter': quarter } as CSSProperties}>
    <div className="service-calendar-heading"><h3 data-editorial-reveal>{__site.t(plan === 'quarterly' ? 'Un ritmo para volver a comparar.' : plan === 'free' ? 'Empieza por lo que ya tienes.' : 'Una visita. Un nuevo informe.')}</h3><span>{__site.t(plan === 'quarterly' ? 'Cadencia ilustrativa' : 'Un solo punto de partida')}</span></div>
    <div className="service-calendar-events" role="group" aria-label={__site.t(plan === 'quarterly' ? 'Elige una recogida del calendario ilustrativo' : 'Servicio de la opción seleccionada')}>
      {__site.t(plan === 'quarterly' && <span className="service-selection-track" aria-hidden="true"/>)}
      {__site.t(events.map((event, index) => {
            const content = <><span className="service-event-month">{__site.t(plan === 'quarterly' ? `Mes ${String(event.month).padStart(2, '0')}` : plan === 'free' ? 'Documento existente' : 'Visita única')}</span><ServiceSymbol kind={event.kind}/><span className="service-event-title">{__site.t(event.label)}</span><span className="service-event-detail">{__site.t(plan === 'quarterly' ? 'Recogida en casa' : plan === 'free' ? 'Resultados con fecha y origen' : 'Extracción en laboratorio')}</span>{__site.t(plan === 'quarterly' && <span className="service-event-state">{__site.t(quarter === index ? 'Seleccionada' : 'Ver detalle')}<span aria-hidden="true">{__site.t(quarter === index ? '−' : '+')}</span></span>)}</>;
            return plan === 'quarterly' ? <button type="button" key={event.month} aria-pressed={quarter === index} onClick={() => onQuarterChange(index)} className="service-event" data-editorial-reveal>{__site.t(content)}</button> : <div key={event.kind} className="service-event service-event-single" data-editorial-reveal>{__site.t(content)}</div>;
        }))}
    </div>
    <div className="service-calendar-caption"><p>{__site.t(plan === 'quarterly' ? 'Cuatro momentos separados por tres meses. El calendario explica la frecuencia; las fechas se coordinan por separado.' : plan === 'free' ? 'Explora los valores de un informe que ya tienes y conserva su fecha y procedencia.' : 'Consulta el panel disponible y los detalles de la visita antes de elegir esta opción.')}</p>{__site.t(plan === 'quarterly' && <div className="service-calendar-arrows"><button type="button" aria-label={__site.t("Recogida anterior")} disabled={quarter === 0} onClick={() => onQuarterChange(quarter - 1)}>{__site.t("\u2190")}</button><button type="button" aria-label={__site.t("Siguiente recogida")} disabled={quarter === 3} onClick={() => onQuarterChange(quarter + 1)}>{__site.t("\u2192")}</button></div>)}</div>
    <div className="service-inclusion-lens">
      <div className="service-lens-heading"><span>{__site.t("Dentro de esta opci\u00F3n")}</span><EditorialReveal as="span" className="service-lens-selection" aria-live="polite" replayKey={selected.label} offset={8} duration={.38}>{__site.t(selected.label)}</EditorialReveal></div>
      <div className="service-inclusion-controls">{__site.t(tabs.map(tab => <button type="button" key={tab.id} aria-expanded={expanded === tab.id} aria-controls={`${id}-${tab.id}`} onClick={() => setExpanded(expanded === tab.id ? null : tab.id)}><small>{__site.t(tab.label)}</small><span>{__site.t(tab.value)}</span><b aria-hidden="true">{__site.t(expanded === tab.id ? '−' : '+')}</b></button>))}</div>
      {__site.t(tabs.map(tab => <div key={tab.id} id={`${id}-${tab.id}`} className="service-inclusion-content" hidden={expanded !== tab.id}>
        {__site.t(tab.id === 'markers' ? (plan === 'quarterly' ? <><p>{__site.t("Panel ilustrativo de 15 biomarcadores. La composici\u00F3n final est\u00E1 pendiente de confirmaci\u00F3n.")}</p><ul className="service-marker-names">{__site.t(markers.map(marker => <li key={marker.code}>{__site.t(marker.name)}</li>))}</ul></> : <p>{__site.t(plan === 'free' ? 'Los valores disponibles dependen del documento que añadas. En esta vista previa puedes recorrer un informe de ejemplo.' : 'El alcance y la disponibilidad del panel se confirman antes de reservar.')}</p>) : tab.id === 'delivery' ? <p>{__site.t(plan === 'quarterly' ? 'La opción ilustrada incluye el kit y el envío de ida y vuelta. La muestra se recoge en casa siguiendo las instrucciones del dispositivo y se analiza en laboratorio.' : plan === 'free' ? 'Añade un documento desde tu cuenta. La demostración permite revisar cómo se organizan sus resultados.' : 'La muestra se obtiene mediante una extracción en un laboratorio asociado. Esta vista previa no reserva una cita.')}</p> : <><p>{__site.t("Un informe re\u00FAne los valores, las unidades, la fecha y el laboratorio de origen.")}</p><a href={__site.href("/es/labs/demo-junio")}>{__site.t("Explorar el informe de junio \u00B7 ejemplo")}</a></>)}
      </div>))}
    </div>
  </EditorialReveal>;
}
