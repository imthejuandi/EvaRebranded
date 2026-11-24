# v67 candidate — bilingual copy review

Inspected candidate-en-1366-section.png, candidate-es-390-section.png and candidate-es-320-section.png, and read the current RangeProofSection.tsx and range-proof-copy.ts. No source edits.

## Verdict

The requested contrast is now understandable from the closed section: the same illustrative 3.2 / 3,2 is inside the broad laboratory reference and outside the short lower-relative-risk category. The aligned bands and identically positioned sample markers communicate the difference before the visitor reads the action. This is a material visual improvement over the relay, and the words now support a graphic rather than replace one.

The novice-facing equivalent of “normal versus optimal” is conveyed without making a universal optimum claim: **This lab’s reference / Dentro de la referencia** establishes the lab meaning, while **Lower relative heart risk / Menor riesgo cardiovascular relativo** names the separate evidence-based category. Do not change the lower label to “optimal”, “ideal”, “safe” or a treatment goal.

## Necessary clarity correction

The current standalone **>2 mg/L if persistent / >2 mg/L si persiste** introduces a third numerical boundary without telling the reader what that boundary does. A newcomer can reasonably wonder whether it revises either visible band. Name its role directly:

```ts
en.reviewAnnotation = 'Review if persistent: >2 mg/L';
es.reviewAnnotation = 'Revisar si persiste: >2 mg/L';
```

Keep it in the existing action area, separate from the two bands. Keep the full action unchanged. This adds only the missing role; it prevents the third cutoff from confusing the two-range comparison.

Also update the disclosure lead to describe the two categories currently being compared. The existing “prevention threshold / umbral preventivo” lead still describes the superseded lab-versus-review comparison:

```ts
en.lead = 'A lab reference and an hs-CRP risk category answer different questions.';
es.lead = 'Una referencia de laboratorio y una categoría de riesgo según la hs-CRP responden a preguntas distintas.';
```

## Keep as rendered

- Keep **One result. Two ranges. / Un resultado. Dos rangos.** The graphic fulfills that promise.
- Keep the lab-specific label, explicit within/outside status and prominent **<5 / <1**. Together they avoid relying on chart literacy or colour alone.
- Keep the visible **hs-CRP category, not your overall risk / Categoría según hs-CRP; no indica tu riesgo global** note. The narrow pale-green band can otherwise be taken as a universal healthy zone. The note and “relative” label are doing necessary work.
- Keep the entire repeat-when-well, then overall-risk-if-still-raised action. At 320px it occupies several lines but remains readable. Shortening it to “repeat” or “review your risk” would remove the conditions the novice needs.
- Keep laboratory variation/no-diagnosis visible, plus source access and the free CTA.

## Prose weight and limits

No further visible copy reduction is necessary. At 390px the long Spanish lower-risk label fits on one line; at 320px it wraps naturally into two readable lines. The two-line category note and longer action are proportionate to the substantial visual comparison. Preserve readable type rather than compressing these into dense microcopy.

The lower band’s greenish tint still suggests “desirable”, which is consistent with a lower-relative-risk category but can become a target implication if intensified or accompanied by “optimal”. Current visible language limits that reading; it does not establish anyone’s overall risk or prescribe lowering hs-CRP. This is an informed editorial/image review, not real-user comprehension research or owner acceptance.
