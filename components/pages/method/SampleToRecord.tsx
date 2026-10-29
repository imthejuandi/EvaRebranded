'use client';
import {useSiteLanguage} from '@/components/site/SiteLanguage';
import MethodJourneyScene from './MethodJourneyScene';
export type SampleStage = {
    id: string;
    short: string;
    place: string;
    title: string;
    body: string;
    detail: string;
};
/** Educational placeholders are deliberate: no reviewed numeric fixture has been supplied. */
export function ResultCapsule() {
    const __site = useSiteLanguage();
    return <div className="method-result-capsule">
    <div className="method-capsule-top"><span>{__site.t("Biomarcador")}</span><span>{__site.t("Ejemplo")}</span></div>
    <p className="method-capsule-name">{__site.t("Tu resultado")}</p>
    <div className="method-capsule-value"><strong>{__site.t("Valor")}</strong><span>{__site.t("unidad")}</span></div>
    <div className="method-capsule-reference"><span>{__site.t("Intervalo de referencia")}</span><span>{__site.t("Seg\u00FAn el informe")}</span></div>
    <dl className="method-capsule-source"><div><dt>{__site.t("Fecha de la muestra")}</dt><dd>{__site.t("La de tu informe")}</dd></div><div><dt>{__site.t("Fuente")}</dt><dd>{__site.t("Laboratorio de origen")}</dd></div></dl>
  </div>;
}
export default function SampleToRecord({ stages }: {
    stages: readonly SampleStage[];
}) {
    const __site = useSiteLanguage();
    return <MethodJourneyScene stages={stages}/>;
}
