# v67 quantitative range comparison — proposed copy

Editorial proposal only; no application/source edits. Reviewed current range-proof-copy.ts and AGENTS.md. The owner's newer request for two visible quantitative tracks supersedes the earlier no-axis/relay design constraint. Keep the current headline, sample, free CTA and existing evidence. The graphic must do the comparison; do not add a paragraph explaining a missing visual.

## Medical coordination

The medical specialist confirmed the current official AHA toolkit, page 2: hs-CRP **<1.0 mg/L = lower relative cardiovascular risk**, **1.0–3.0 = average**, **>3.0 = higher**. This is a category based on hs-CRP, not a person's overall risk or a universal optimal/treatment target. Source: https://professional.heart.org/en/-/media/PHD-Files/Education/hsCRP-Toolkit-for-Professionals.pdf?sc_lang=en

The specialist approved the exact lower-track label and visible scope note below. Keep **<1** strict. The separate European **>2 mg/L if persistent** review trigger retains its meaning; it is not the boundary of the lower-risk category.

## Exact preferred visible fields

```ts
en: {
  heading: ['There’s more', 'to “normal.”'], // unchanged
  unchangedLabel: 'One result. Two ranges.',
  markerLabel: 'Inflammation signal', // unchanged
  exampleLabel: 'Example', // unchanged
  lab: {
    label: 'This lab’s reference',
    threshold: '<5 mg/L',
    interpretation: 'Within reference.',
  },
  lowerRisk: {
    label: 'Lower relative heart risk',
    threshold: '<1 mg/L',
    interpretation: 'Outside this category.',
  },
  categoryNote: 'hs-CRP category, not your overall risk.',
  reviewLabel: 'Review if persistent',
  reviewThreshold: '>2 mg/L',
  takeawayLead: 'Next step',
  takeaway: 'Repeat the test when well. If still raised, review overall heart risk.',
  qualifier: 'Lab limits vary. Not a diagnosis.', // unchanged
  detailsLabel: 'Sources and context', // unchanged
  primary: 'Interpret your labs', // unchanged
  primarySubtitle: 'Upload for free', // unchanged
}

es: {
  heading: ['«Normal»', 'no lo cuenta todo.'], // unchanged
  unchangedLabel: 'Un resultado. Dos rangos.',
  markerLabel: 'Señal de inflamación', // unchanged
  exampleLabel: 'Ejemplo', // unchanged
  lab: {
    label: 'Referencia de este laboratorio',
    threshold: '<5 mg/L',
    interpretation: 'Dentro de la referencia.',
  },
  lowerRisk: {
    label: 'Menor riesgo cardiovascular relativo',
    threshold: '<1 mg/L',
    interpretation: 'Fuera de esta categoría.',
  },
  categoryNote: 'Categoría según hs-CRP; no indica tu riesgo global.',
  reviewLabel: 'Revisar si persiste',
  reviewThreshold: '>2 mg/L',
  takeawayLead: 'Siguiente paso',
  takeaway: 'Repite el análisis cuando estés bien. Si sigue elevado, valora el riesgo cardiovascular global.',
  qualifier: 'Los límites varían entre laboratorios. No es un diagnóstico.', // unchanged
  detailsLabel: 'Fuentes y contexto', // unchanged
  primary: 'Interpreta tus analíticas', // unchanged
  primarySubtitle: 'Súbelas gratis', // unchanged
}
```

The lower-track interpretation must be visibly attached to the illustrative **3.2 / 3,2** marker, outside the **<1** band. “Outside this category” then has an explicit referent; it must not float away from the named category. The lab interpretation belongs to the same example on the aligned lab track. The qualifier and category note remain visible, rather than hidden in the source disclosure.

The Spanish lower-track label naturally needs two lines at phone widths. Do not shorten it to “Óptimo”, “Ideal”, “Objetivo”, “Seguro” or an unexplained “Menor”. “Relativo” matters: this is one biomarker's relative-risk classification.

## Disclosure/source additions

Retain the current laboratory, ESC/EAS and ERFC evidence. Add the AHA source above with these exact source labels:

- EN: `hs-CRP categories: AHA`
- ES: `Categorías de hs-CRP: AHA`

Recommended category detail:

- EN: `The AHA describes relative cardiovascular-risk categories based on hs-CRP: lower below 1 mg/L, average from 1 to 3 mg/L, and higher above 3 mg/L. These categories do not determine your overall risk or set a treatment target.`
- ES: `La AHA describe categorías de riesgo cardiovascular relativo según la hs-CRP: menor por debajo de 1 mg/L, medio de 1 a 3 mg/L y mayor por encima de 3 mg/L. Estas categorías no determinan tu riesgo global ni fijan un objetivo de tratamiento.`

Keep the existing causes-of-elevation, repeat-when-clinically-stable and clinical-context timing disclosure, and the ESC/EAS >2-if-persistent detail. The <1 category does not replace that European review trigger.

## Visual/editorial requirements

1. Make **<5** and **<1** prominent labels on genuinely aligned, equally scaled quantitative tracks. The same **3.2** is inside the documented lab reference and outside the lower-relative-risk band. A shared axis may help; two different scales would falsely enlarge/flatten the difference.
2. Name each range on the track. The owner asked for visible levels, so two status badges or another relay would not satisfy the request.
3. Scope the broad track to **this lab**. Do not label all values below 5 universally “normal”, and do not claim the lab's range tells the whole health story.
4. Scope the narrow track to the **hs-CRP relative-risk category**. Do not label it “optimal”, “ideal” or a treatment goal, and do not imply 3.2 determines high overall/personal risk.
5. The **>2 if persistent** annotation is distinct from the **<1** category boundary. Do not draw a third competing “optimal” band or imply every value ≥1 automatically meets the European >2 trigger.
6. Keep the repeat/overall-risk action complete. No fixed interval, treatment implication, severity animation or promised improvement.

## Judgment

This copy supports the visual comparison the owner now requests while making the limits of “optimal” precise. The two numerical ranges should carry the visual emphasis. The minimum scope note explains what the lower band means; it does not excuse an image that implies a universal safe/ideal zone.
