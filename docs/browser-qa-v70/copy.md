# v70 owner edits — exact bilingual copy

Read current range-proof-copy.ts and RangeProofSection.tsx. No source edits. The owner's new instructions supersede the prior <5 / 3.2 example and visible recommendation footer.

## Exact fields

```ts
rangeProofExample.value = 2.9;
rangeProofExample.labUpper = 3;
// Keep axisMin: 0, axisMax: 5, lowerRiskUpper: 1, unit: 'mg/L'.

en.lab = {
  label: 'Lab’s reference range', // exact owner wording
  threshold: '<3 mg/L',
  interpretation: 'Within reference.', // still correct; no change needed
  detail: 'This example uses a documented laboratory hs-CRP reference below 3 mg/L. Laboratory limits may differ.',
};

es.lab = {
  label: 'Rango de referencia del laboratorio',
  threshold: '<3 mg/L',
  interpretation: 'Dentro de la referencia.', // still correct; no change needed
  detail: 'Este ejemplo usa una referencia documentada de hs-CRP del laboratorio inferior a 3 mg/L. Los límites pueden variar entre laboratorios.',
};
```

Spanish **Rango de referencia del laboratorio** is the natural match for the exact requested English label. Let it wrap if needed; do not reduce type size.

Keep lowerRisk.label/threshold/interpretation/detail, categoryNote, heading, unchangedLabel, markerLabel, exampleLabel, qualifier, sources/context summary and the free CTA unchanged. The lower-risk comparison remains **<1 mg/L**, and **2.9 / 2,9** remains outside that category. Do not add a “higher risk” or “high overall risk” status: 2.9 is within the AHA framework's average hs-CRP category, and neither category determines overall risk.

## Remove the recommendation footer

Remove the entire rendered figcaption containing the review-if-persistent line and repeat-test/overall-risk action. Do not replace it with a shorter recommendation, badge or new callout. No empty divider should remain.

The ESC/EAS source may remain as factual context within the existing disclosure. To avoid reintroducing the removed advice as imperative prose, use these exact replacements:

```ts
en.prevention.detail = 'In ESC/EAS guidance, persistently elevated hs-CRP >2 mg/L is a cardiovascular risk modifier considered alongside overall risk. It is not a diagnosis or universal treatment target.';
es.prevention.detail = 'En las guías ESC/EAS, una hs-CRP persistentemente elevada >2 mg/L es un modificador del riesgo cardiovascular que se valora junto con el riesgo global. No es un diagnóstico ni un objetivo universal de tratamiento.';

en.context = 'Illness, infection or injury can raise hs-CRP. One result does not establish the cause or persistence.';
es.context = 'Una enfermedad, una infección o una lesión pueden elevar la hs-CRP. Un solo resultado no confirma la causa ni la persistencia.';
```

The visible categoryNote remains unchanged, including the distinction from overall risk. The laboratory-variation/no-diagnosis note remains visible below the glass.

## Source and accessibility consistency

- Replace the old **CDC adult <5** laboratory source with the medical reviewer's verified **<3** laboratory source. Do not retain the old citation as evidence for the new cutoff. Exact URL/provider is owned by the medical verification; this copy does not assert that CDC's old assay reference changed.
- Preserve the AHA category source and the other applicable evidence. AHA's boundary at 3 is not itself proof that a particular laboratory uses <3 as its reference.
- Localize the single example everywhere as **2.9 mg/L / 2,9 mg/L**, including the principal readout, axis/sample label, data attributes, generated description and any test fixtures specific to this section. Leave Alex/dashboard readings unchanged.
- Update the screen-reader chart description's laboratory reference from 5 to 3 through the sample constants, and remove its sentence about a separate review trigger now absent from the visible figure. Preserve its explanation that the category is not overall risk or a universal optimal target.
- Keep the scale **0–5** as a display domain. Do not alter it to 0–3 merely because the lab cutoff changes, and keep the strict **<3 / <1** signs.

## Verdict

These edits preserve the approved visual distinction with the new independent sample: **2.9 <3**, but **2.9 >1**. Existing within-reference/outside-category statuses are already correct. No further visible prose is needed.
