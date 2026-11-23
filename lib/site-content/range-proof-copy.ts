/** A separate teaching example; Alex’s result and history remain unchanged. */
export const rangeProofExample = {
  value: 3.2,
  unit: 'mg/L',
  axisMin: 0,
  axisMax: 6,
  labUpper: 5,
  preventionLower: 2,
} as const;

/** Documented assay reference and the European persistent-risk modifier. */
export const rangeProofCopy = {
  en: {
    kicker: 'A DIFFERENT QUESTION',
    heading: ['There’s more', 'to “normal.”'],
    lead: 'A lab reference and a prevention threshold answer different questions.',
    markerLabel: 'Inflammation signal',
    exampleLabel: 'Example',
    unchangedLabel: 'Same result. More context.',
    lab: {
      label: 'Lab reference',
      threshold: '<5 mg/L',
      detail: 'This example uses a documented adult hs-CRP reference below 5 mg/L. Laboratory limits may differ.',
    },
    prevention: {
      label: 'Heart risk review',
      threshold: '>2 mg/L if persistent',
      detail: 'Persistently elevated hs-CRP >2 mg/L can add information about future cardiovascular risk. Review it alongside your health history, other risk factors and possible causes of inflammation. It is not a diagnosis or universal treatment target.',
    },
    takeawayLead: 'Within this lab range,',
    takeaway: 'yet relevant to future heart risk if persistent.',
    qualifier: 'Repeat when well. Lab limits vary. Not a diagnosis.',
    detailsLabel: 'Sources and context',
    context: 'Illness, infection or injury can raise hs-CRP. Confirm persistence when clinically stable; timing depends on your clinical context.',
    sourceLabel: 'THE EVIDENCE',
    sources: [
      {label: 'Lab reference: CDC', href: 'https://wwwn.cdc.gov/nchs/data/nhanes/public/2021/labmethods/HSCRP-L-MET-508.pdf'},
      {label: 'Risk modifier: ESC/EAS', href: 'https://academic.oup.com/eurheartj/article/46/42/4359/8234482'},
      {label: 'Prospective evidence: ERFC', href: 'https://pubmed.ncbi.nlm.nih.gov/20031199/'},
    ],
    primary: 'Interpret your labs',
    primarySubtitle: 'Upload for free',
    methodLink: 'Understand the difference',
  },
  es: {
    kicker: 'UNA MIRADA A LA PREVENCIÓN',
    heading: ['«Normal»', 'no lo cuenta todo.'],
    lead: 'Una referencia de laboratorio y un umbral preventivo responden a preguntas distintas.',
    markerLabel: 'Señal de inflamación',
    exampleLabel: 'Ejemplo',
    unchangedLabel: 'El mismo resultado. Más contexto.',
    lab: {
      label: 'Referencia del laboratorio',
      threshold: '<5 mg/L',
      detail: 'Este ejemplo usa una referencia documentada de hs-CRP para adultos inferior a 5 mg/L. Los límites pueden variar entre laboratorios.',
    },
    prevention: {
      label: 'Revisión del riesgo cardiovascular',
      threshold: '>2 mg/L si persiste',
      detail: 'Una hs-CRP persistentemente elevada >2 mg/L puede aportar información sobre el riesgo cardiovascular futuro. Debe valorarse junto con tu historial de salud, otros factores de riesgo y posibles causas de inflamación. No es un diagnóstico ni un objetivo universal de tratamiento.',
    },
    takeawayLead: 'Dentro de este intervalo,',
    takeaway: 'pero relevante para el riesgo cardiovascular futuro si persiste.',
    qualifier: 'Repetir cuando estés bien. Los límites varían entre laboratorios. No es un diagnóstico.',
    detailsLabel: 'Fuentes y contexto',
    context: 'Una enfermedad, una infección o una lesión pueden elevar la hs-CRP. La persistencia debe confirmarse en situación clínica estable; el momento depende del contexto clínico.',
    sourceLabel: 'LA EVIDENCIA',
    sources: [
      {label: 'Referencia del laboratorio: CDC', href: 'https://wwwn.cdc.gov/nchs/data/nhanes/public/2021/labmethods/HSCRP-L-MET-508.pdf'},
      {label: 'Modificador de riesgo: ESC/EAS', href: 'https://academic.oup.com/eurheartj/article/46/42/4359/8234482'},
      {label: 'Evidencia prospectiva: ERFC', href: 'https://pubmed.ncbi.nlm.nih.gov/20031199/'},
    ],
    primary: 'Interpreta tus analíticas',
    primarySubtitle: 'Súbelas gratis',
    methodLink: 'Entiende la diferencia',
  },
} as const;
