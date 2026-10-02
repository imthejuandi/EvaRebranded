'use client';

import MethodJourneyScene from './MethodJourneyScene';
export type SampleStage = {id: string; short: string; place: string; title: string; body: string; detail: string};
/** Educational placeholders are deliberate: no reviewed numeric fixture has been supplied. */
export function ResultCapsule() {
  return <div className="method-result-capsule">
    <div className="method-capsule-top"><span>Biomarcador</span><span>Ejemplo</span></div>
    <p className="method-capsule-name">Tu resultado</p>
    <div className="method-capsule-value"><strong>Valor</strong><span>unidad</span></div>
    <div className="method-capsule-reference"><span>Intervalo de referencia</span><span>Según el informe</span></div>
    <dl className="method-capsule-source"><div><dt>Fecha de la muestra</dt><dd>La de tu informe</dd></div><div><dt>Fuente</dt><dd>Laboratorio de origen</dd></div></dl>
  </div>;
}

export default function SampleToRecord({stages}: {stages: readonly SampleStage[]}) {
  return <MethodJourneyScene stages={stages}/>;
}
