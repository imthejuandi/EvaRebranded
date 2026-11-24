# v68 dashboard-level reuse — copy recommendation

Read-only inspection of the dashboard, fixtures, biomarker detail instrument and landing BiomarkerGallery. No application/source edits.

## Bounded recommendation

**Keep the approved v67 copy.** The owner requested the dashboard's visual level treatment. Reuse its track/fill/point geometry, restrained materials and existing 0–5 display scale; that request does not require renaming the evidence categories or importing a different sample's values. The graphic can look familiar while retaining the approved clinical distinction.

Preserve exactly:

| Role | English | Spanish |
|---|---|---|
| Caption | One result. Two ranges. | Un resultado. Dos rangos. |
| Laboratory label | This lab’s reference | Referencia de este laboratorio |
| Laboratory cutoff | <5 mg/L | <5 mg/L |
| Laboratory status | Within reference. | Dentro de la referencia. |
| Lower-risk label | Lower relative heart risk | Menor riesgo cardiovascular relativo |
| Lower-risk cutoff | <1 mg/L | <1 mg/L |
| Lower-risk status | Outside this category. | Fuera de esta categoría. |
| Category scope | hs-CRP category, not your overall risk. | Categoría según hs-CRP; no indica tu riesgo global. |
| Review annotation | Review if persistent: >2 mg/L | Revisar si persiste: >2 mg/L |

Keep the independent illustrative **3.2 / 3,2 mg/L**, complete repeat-when-well/overall-risk action, laboratory-variation/no-diagnosis note, evidence disclosure, current headline and free-upload CTA.

If the visual display changes to **0–5**, only the numeric scale endpoints need to change. The axis maximum is a display choice, not a new medical limit. Keep **<5** and **<1** visibly strict; do not relabel them `0–5` and `0–1`, which could make the upper endpoints look inclusive.

## Repository findings

- `lib/preview/fixtures.ts`: dashboard sample hsCRP value **2.1 mg/L**, illustrative range **[0,1]**, display domain **[0,5]**. The fixture has its own illustrative history. Its internal `optimal` status is a model classification, not a new clinical claim for the landing example.
- `components/pages/dashboard/DashboardPage.tsx`, `CapsuleRange`: uses the marker's display domain, extended only if the selected value falls outside it; shows a thin track, interval fill, sample pointer and endpoint labels. Vocabulary is **Rango orientativo del ejemplo**, with a note to consult the laboratory interval and personal context.
- `components/pages/dashboard/dashboard-reading.ts`: report-owned classification labels use **Within interval / Dentro del intervalo** and **Above interval / Por encima del intervalo**. These are useful precedents for restrained status language, but the current landing's reference/category statuses are already more specific.
- `components/story/BiomarkerGallery.tsx` and `lib/landing-content.ts`: the landing's expanded public specimen uses hs-CRP **2.1**, **standard [0,3]**, **EVA [0,1]**, with labels **Intervalo de referencia** and **Rango de longevidad EVA**. Its display maximum is calculated from the selected value and specimen endpoints, rather than fixed to 5. It is not the same data model as the independent range proof.
- `components/pages/biomarker/BiomarkerPage.tsx`: the detail instrument labels its interval as illustrative and its axis as a display scale. That distinction supports adopting the dashboard's look without treating its domain as clinical evidence.

## Do not import

1. Do not replace the range proof's documented **<5** laboratory reference with the historical landing specimen's **0–3**.
2. Do not replace its independent **3.2** with dashboard/Alex **2.1**, or combine their histories.
3. Do not rename the AHA **<1** relative-risk category **EVA longevity range / Rango de longevidad EVA**, **Optimal / Óptimo**, or a treatment target. Those repository strings have different provenance and meaning.
4. Do not add the dashboard's generic five-zone or critical-zone labels without sourced hs-CRP cutoffs. No new facts or additional risk categories are needed to fulfill this styling request.
5. Do not edit actual dashboard values, fixture endpoints or labels as part of this bounded landing change.

## Conclusion

This is a visual reuse task. Keep the approved wording and facts; adopt the dashboard's recognisable level treatment and 0–5 display domain. Final images should still show the same point inside this lab's reference and outside the <1 lower-relative-risk category, with >2-if-persistent clearly separated as the review action.
