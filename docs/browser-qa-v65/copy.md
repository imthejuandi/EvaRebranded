# Range instrument: bilingual copy recommendation

Reviewed the retrofuturist brief, AGENTS.md, existing RangeProofSection.tsx and range-proof-copy.ts. This is an editorial proposal only; no source changes. Preserve the exact current headline, free-upload CTA, source URLs, source facts and longer disclosure content.

## Exact proposed visible fields

```ts
en: {
  heading: ['There’s more', 'to “normal.”'], // unchanged
  unchangedLabel: 'One result. Two questions.',
  markerLabel: 'Inflammation signal', // unchanged
  exampleLabel: 'Example', // unchanged
  lab: {
    label: 'Lab reference',
    threshold: '<5 mg/L',
    interpretation: 'Below this lab’s limit.',
  },
  prevention: {
    label: 'Heart-risk review',
    threshold: '>2 mg/L if persistent',
    condition: 'if persistent',
    interpretation: 'Above the review threshold.',
  },
  takeawayLead: 'Next step',
  takeaway: 'Repeat the test when well. If still raised, review overall heart risk.',
  qualifier: 'Lab limits vary. Not a diagnosis.', // unchanged
  detailsLabel: 'Sources and context', // unchanged
  primary: 'Interpret your labs', // unchanged
  primarySubtitle: 'Upload for free', // unchanged
}

es: {
  heading: ['«Normal»', 'no lo cuenta todo.'], // unchanged
  unchangedLabel: 'Un resultado. Dos preguntas.',
  markerLabel: 'Señal de inflamación', // unchanged
  exampleLabel: 'Ejemplo', // unchanged
  lab: {
    label: 'Referencia del laboratorio', // unchanged
    threshold: '<5 mg/L',
    interpretation: 'Por debajo del límite de este laboratorio.',
  },
  prevention: {
    label: 'Revisión del riesgo cardiovascular',
    threshold: '>2 mg/L si persiste',
    condition: 'si persiste',
    interpretation: 'Supera el umbral de revisión.', // unchanged
  },
  takeawayLead: 'Siguiente paso',
  takeaway: 'Repite el análisis cuando estés bien. Si sigue elevado, valora el riesgo cardiovascular global.',
  qualifier: 'Los límites varían entre laboratorios. No es un diagnóstico.', // unchanged
  detailsLabel: 'Fuentes y contexto', // unchanged
  primary: 'Interpreta tus analíticas', // unchanged
  primarySubtitle: 'Súbelas gratis', // unchanged
}
```

The Spanish review label should wrap naturally onto two lines. It is intentionally explicit: shortening it to “Revisión”, “Prevención” or “Riesgo” makes the two questions harder for beginners to identify. If the selected instrument cannot accommodate it at 14px, change its geometry before shrinking or obscuring the label.

## Placement and minimum semantic content

- Show one dominant illustrative hs-CRP **3.2 mg/L / 3,2 mg/L**, with **Example / Ejemplo** attached. Use the existing sample value and locale formatting.
- Put the two branch labels above/beside their own cutoffs. Keep the spoken below/above interpretation visible: symbols alone are insufficient for a beginner.
- Keep **if persistent / si persiste** immediately beside **>2 mg/L**. It qualifies the review trigger, not an already-established property of this single result. Display it only once per branch; the full `threshold` and separate `condition` are alternate render inputs, not two copies to show together.
- The graphic should connect that one reading to two independently labelled comparisons. The number does not travel toward a goal. The action follows both comparisons.
- The current detail disclosure remains the right home for the adult-assay qualification, other causes of raised hs-CRP, clinical-context timing, risk factors, absence of a universal treatment target and three sources.

## Blocking copy and image pitfalls

1. **No optimal/safe band.** Do not call either side “healthy”, “normal”, “safe”, “ideal” or “optimal”. No graphic should imply those claims without words either.
2. **No persistence claim.** One example cannot establish that the elevation persists. A steady light may label a comparison; it must not imply confirmed persistent inflammation.
3. **No automatic risk diagnosis.** “High cardiovascular risk”, “heart danger”, “needs treatment” and “inflammation disease” are unsupported conclusions here. Amber means this conditional review comparison, not measured severity.
4. **Keep strict cutoffs.** `<5` is this documented lab reference, not a universal ceiling. `>2` is the European conditional review trigger. Do not convert to `≥2`, `2+`, a 2–5 target interval, or an individual risk percentage.
5. **Avoid a math-only wall.** `3.2 < 5` and `3.2 > 2` may support the meaning, but they should not be the whole graphic. Repeating full-size 3.2 three times competes with the one sample.
6. **Avoid vague next steps.** “Track it”, “take control” and “learn more” fail to convey repeat when well, then overall risk if still raised. No fixed repeat interval, medication, guaranteed improvement or causal claim.
7. **Retain local Spanish convention.** `3,2 mg/L`, Spanish question punctuation if any questions are introduced, and natural wrapping. “Repite el análisis” is clearer than a bare “Repite” for newcomers. “Global” conveys overall cardiovascular risk, rather than attributing all risk to hs-CRP.

## Editorial judgment

This reduces duplicated numeric prompts, makes the two kinds of question explicit, and keeps the short action self-contained. No additional headline, eyebrow, diagnostic warning panel or CTA is needed. The real visual work must be performed by the comparator instrument rather than more copy.
