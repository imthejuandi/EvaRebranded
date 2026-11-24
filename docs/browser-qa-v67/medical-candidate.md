# v67 quantitative candidate: medical visual/source review

Verdict: **PASS — no blocking medical-semantic issue in the inspected candidate.** Agent medical evidence/semantics review only; not human clinician approval, patient-specific advice, or real-user research. This review made no application source edits.

## Evidence inspected

Actual candidate images: English 1366 px, Spanish 390 px and Spanish 320 px. Current RangeProofSection.tsx, range-proof-section.css and range-proof-copy.ts. The freshly verified numeric evidence is documented in medical.md in this directory.

## Mathematical and factual findings

The code derives positions from a shared linear 0–6 mg/L domain. Both tracks have the same inner horizontal margins and scale positions. The 3.2 example is at 53.333333% on each track; the lab band ends at 83.333333% (5), and the lower-relative-risk band at 16.666667% (1). The rendered images show these alignments, with 3.2 slightly right of the 3 tick, within the lab reference and outside the lower-relative-risk category.

The threshold labels preserve strict <5 and <1. Dashed boundaries plus explicit inequality labels are sufficient to convey the open upper endpoints at this chart’s resolution; bands are not labelled ≤5 or ≤1. Units are visible with the sample and each threshold. The source locale-formats the example and labels it Example / Ejemplo.

The European >2 review condition remains separate from the AHA <1 category. It has no filled band and explicitly says if persistent / si persiste. The next action says to repeat when well and review overall heart/cardiovascular risk if still elevated. Neither source nor image assumes that this one result establishes persistence.

All four relevant source links remain: CDC assay reference, AHA hs-CRP categories, ESC/EAS risk modifier and ERFC prospective evidence. The disclosure explains the full <1, 1–3, >3 category framework, clinical confounders, no diagnosis and no universal treatment target.

## Visual clinical interpretation

The chart now makes a real numerical comparison, as requested by the owner. It shows a broad laboratory-reference interval and a narrower lower-relative-risk category. This is materially different from the rejected >2 desirable-looking band: no region above 2 is presented as favorable.

The pale sage <1 band reads as a favorable category. That implication is clinically supportable only within the explicitly shown **relative cardiovascular-risk category based on hs-CRP**. The directly visible category/not-overall-risk note and direct relative-risk labels make that scope available without opening Sources and context. I do not interpret the final closed view as asserting that everyone below 1 is healthy or that 1 is a universal treatment target. This does not justify renaming it “optimal,” “safe,” or “prevention goal” elsewhere.

Both sample cursor segments align at the same value and do not cross label text. “Within reference” / “Dentro de la referencia” stays within the terminal scoped to this laboratory. “Outside this category” / “Fuera de esta categoría” avoids assigning high overall risk to the example or implying that every value above 1 belongs to the same risk category. Remaining unfilled portions have no disease labels or warning-red fill.

The white cursor, numerical value and threshold labels do not animate toward a target. The component is static and reports zero entrance duration. The two cursors represent the same sample, not a measured history. The category qualification, persistence condition, overall-risk action and lab variability/no-diagnosis note are readable in all three inspected images.

## Nonblocking copy consistency improvement

The disclosure lead retains the older comparison description, “A lab reference and a prevention threshold answer different questions.” It remains broadly true of the content but no longer precisely names the two pictured tracks. Prefer:

- EN: “A lab reference and an hs-CRP risk category answer different questions.”
- ES: “Una referencia de laboratorio y una categoría de riesgo según la hs-CRP responden a preguntas distintas.”

This is a scoped clarity improvement, not a medical blocker or request for an additional paragraph. If applied alone, it does not alter the numerical or visual verdict; refresh the copy hash in the final evidence record.

## Source SHA-256 at review

| File | SHA-256 |
|---|---|
| components/story/RangeProofSection.tsx | a1bce7fe01636fa9e3ef3b2babbc200b8efa9d83e83b7572d69b760faf65f93d |
| components/story/range-proof-section.css | 3fdcf0dcae07160e2bc1132dd5479d0abe1958f1a2c9b61e135d99f9ad44f4d3 |
| lib/site-content/range-proof-copy.ts | 0f80ef5d72867273f554b0dc79eddee866f7407e9c6c3b1402422dc223086595 |

## Screenshot SHA-256

| Image | SHA-256 |
|---|---|
| candidate-en-1366-section.png | 206080e619e43aa6e048ec49df5466d86de8cc1bd5deb4ac3e87b26002e4596d |
| candidate-es-390-section.png | b71e957da3c7391661bc73a7c8d20b3a971774575139fef75988559b4ed748e1 |
| candidate-es-320-section.png | 87d72f187d4ebb52292b46748bbcafa48a071f23c886ebcf92d2ca76ce1e6546 |

This gate is limited to the listed source and image evidence. It is not proof of deployment, keyboard behavior, computed colour contrast, physical-device performance or comprehension by actual users. Native deployed checks and independent visual/cold-reader review remain separate gates.
