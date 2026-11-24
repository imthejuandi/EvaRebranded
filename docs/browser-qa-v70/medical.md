# v70 requested example change: medical evidence check

**Approved for implementation: example 2.9 mg/L, lab reference <3 mg/L, unchanged AHA lower-relative-risk category <1 mg/L, and removal of the full visible review/repeat footer.** This is agent medical evidence/semantics review, not human clinician approval or individualized advice. No application source edits were made. Render review remains pending.

## Verified primary laboratory source

**The Valley Health System public laboratory test catalog**, test code **CRPHS**, “C-Reactive Protein, High Sensitivity (hs-CRP), Serum.” Performing laboratory: **The Valley Hospital**. Under “Reference Values” the catalog explicitly states **<3.0 mg/L**. This exact strict operator was verified by opening the page directly on 2026-11-24; the relevant extracted page lines are 85–91. The catalog is hosted on Mayo’s testcatalog platform, but the performing laboratory and the reference value belong to The Valley Hospital, so do not describe this as a general Mayo Clinic cutoff.

URL: https://valleyhealth.testcatalog.org/show/CRPHS-1

No fallback fictional cutoff is necessary. This is a real documented laboratory example. The page does not establish that all laboratories use <3, that the reference is a universal optimum, or that a result below it determines overall cardiovascular risk.

## Exact minimum source/copy changes

- Requested English track label: **Lab’s reference range**. Spanish: **Rango de referencia del laboratorio**.
- Threshold: **<3 mg/L**. Sample: **2.9 mg/L** / **2,9 mg/L**, labelled Example / Ejemplo.
- Replace the old CDC <5 source link and label with **Lab reference: Valley Hospital** / **Referencia del laboratorio: Valley Hospital**, linking to the catalog above.
- EN lab detail: **“This example uses The Valley Hospital’s published hs-CRP reference below 3 mg/L. Laboratory limits may differ.”**
- ES lab detail: **“Este ejemplo usa la referencia de hs-CRP publicada por The Valley Hospital, inferior a 3 mg/L. Los límites pueden variar entre laboratorios.”**
- Keep the existing visible lab-variation/no-diagnosis note, the AHA <1 relative-risk-category label and the visible category/not-overall-risk note.
- Keep the existing full AHA category explanation in the disclosure: lower <1, average 1–3, higher >3 mg/L. That is a relative cardiovascular-risk framework, distinct from the selected laboratory’s reference limit.

Do not leave a statement that CDC documents the new <3 limit. CDC documented the prior <5 example; that citation is not support for this revision.

## Interpretation and exact boundaries

2.9 is below this laboratory’s strict 3 mg/L upper reference and above the strict <1 lower-relative-risk category. In the retained AHA framework, 2.9 belongs to the 1–3 **average relative-risk category**. “Outside this category” remains appropriate for the lower-risk track; do not relabel 2.9 as high overall risk or high relative risk.

At exactly 3 mg/L, the chosen laboratory’s strict <3 reference excludes the value while the AHA 1–3 category includes it. That difference is legitimate because these labels describe different systems. Do not silently change either operator to make them identical.

On the existing shared 0–5 display domain, the sample is at **58%**, the lab boundary at **60%**, and the <1 category end at **20%**. The sample is only 2% of plot width below the lab boundary. The render must preserve both actual positions; a circular marker may overlap the thin boundary visually, but its centre must remain at 2.9 and the explicit threshold label must remain legible. Do not artificially shift the marker or lab boundary to imply greater separation.

## Removing the recommendation footer

Removing the full visible “Review if persistent” and repeat/overall-risk recommendation block is medically acceptable for this scoped educational comparison. The closed view’s claim becomes comparison of a lab reference with a relative-risk category; it does not need to prescribe a next step.

Existing scientific context can stay in the disclosure without recreating the removed recommendation. A concise non-actionable sentence is:

- EN: **“A single reading does not establish persistent elevation. Illness, infection or injury can affect hs-CRP.”**
- ES: **“Una sola lectura no confirma una elevación persistente. Una enfermedad, una infección o una lesión pueden influir en la hs-CRP.”**

If the ESC/EAS >2 mg/L fact is retained in the disclosure, retain its persistence condition and overall-risk context. Example: “The ESC/EAS framework considers persistently elevated hs-CRP >2 mg/L alongside overall cardiovascular risk; one reading does not establish persistence.” The ESC/EAS citation remains meaningful if that factual paragraph remains. Do not keep an orphan >2 risk label without its condition. No universal treatment goal, diagnosis or fixed retest interval should be introduced.

## Source-selection notes

Other authoritative sources commonly publish 0–3 or ≤3 mg/L (including Michigan and ARUP); those were not used to justify a strict <3 display. Scripps’ 2022 platform comparison contains an exact <3 interval, but explicitly for its old Siemens platform, so it was not selected as a current source. The Valley Hospital catalog supplies the exact requested strict reference directly, without rebranding the AHA category boundary as a lab range.
