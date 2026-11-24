# v68 dot-field candidate medical review

**PASS. No blocking medical-semantic issue in the inspected candidate.** This is medical evidence/visual-semantics agent review, not human clinician approval or user research. No health backend or patient data was accessed; no application source was edited. No new research was needed for the unchanged clinical facts.

Inspected candidate English 1366 px and Spanish 390/320 px screenshots, current RangeProofSection.tsx/CSS/copy, and the dashboard EvidenceRange source used as the visual reference.

## Actual rendered clinical meaning

Both tracks show a common 0–5 mg/L display domain. The separate, labelled 3.2 mg/L teaching example is plotted at 64% on both. The lower-relative-risk dot interval ends at 20% (<1) and the laboratory reference ends at 100% (<5). The explicit <5 and <1 labels remain visible, and the full-width laboratory reference is distinguishable from the narrow lower-risk category. Zero is the display origin, not a personal goal or a claim of exact-zero assay reporting.

The source bright-dot condition is `min + position * (max - min) < end`. It therefore preserves strict upper endpoints instead of copying the dashboard’s inclusive interval test. The dot at value 5 is dim in the lab track. A thin boundary is placed at exactly 1 even though the finite dot grid has no column precisely at1. Neither discretization changes the visible strict threshold labels or the mathematical interval.

The circular cursors match each other and sit over the explicit 3.2 / 3,2 scale label. They mark the same sample in two questions; they are not a target location, trend or two tests. The relatively bright regions communicate category membership. Above 2 remains unfilled as a distinct desirable region, and the lower track’s dim remainder is not labelled uniformly high risk or diseased.

The lower interval remains labelled lower **relative** cardiovascular risk with an immediately visible hs-CRP-category/not-overall-risk note. The sample verdict is outside this category, avoiding an individual high-overall-risk assertion. The separate footer still says review if persistent: >2 mg/L and then repeat when well, reviewing overall risk if still raised. Lab variability and no-diagnosis notes remain visible. These meanings are readable in all three inspected images.

Existing source disclosure and four references remain unchanged in meaning. There is no introduced optimum, treatment target, fixed retest interval, diagnosis, causal claim or personal-risk percentage. The component’s static measurement does not animate toward any threshold.

## Exact dashboard provenance

The chosen 55-column/four-row dot field, brighter larger interval dots, thin interval boundaries and ringed sample cursor match `components/pages/dashboard/ExecutiveReading.tsx` EvidenceRange. That renderer calls `evidenceRangeGeometry` in dashboard-reading.ts, which independently pads a scale around the value/interval. For fictional 2.1 with interval[0,1], that particular renderer’s computed domain is 0–2.352, not0–5.

The dashboard CapsuleRange in DashboardPage.tsx is the renderer that directly uses the fixture domain[0,5] for hsCRP. Thus the landing legitimately combines EvidenceRange’s dot/cursor style with a common 0–5 domain informed by the dashboard fixture/CapsuleRange. It should not be described as copying EvidenceRange’s numerical geometry. Keeping one shared landing scale is necessary for the valid two-interval comparison.

The fixture’s 2.1 value/history and inclusive [0,1] classification were not copied into this landing. Current working diff names contain no dashboard implementation or fixture files. This review does not change or approve the dashboard’s independent illustrative clinical boundary contract.

## Limits

This gate applies to the listed source and supplied candidate screenshots. Deployment receipt, native checks, computed contrast, keyboard behavior and unreviewed viewport/motion states remain separate QA responsibilities. It is not evidence of comprehension by actual users.

## Source SHA-256

| File | SHA-256 |
|---|---|
| components/story/RangeProofSection.tsx | 4c23a15be6b489a76ba03623be020aac8d60399b5593f370e507c1b7c4c89047 |
| components/story/range-proof-section.css | 6023d510e06070f1388afe70826219c080f8106f4192e75ad1b0e8472097eb89 |
| lib/site-content/range-proof-copy.ts | aac6481de418ffb96881d4eba22bb93aa22d280e779909d31d6ba91542877754 |

## Candidate screenshot SHA-256

| Image | SHA-256 |
|---|---|
| candidate-en-1366-section.png | 9135c973c8211615bb469820335060d8228498e31f6f35315e9e2c090035e655 |
| candidate-es-390-section.png | c8f242bd5d92d50118bbb9cc4b61e17afc303e0fa8520fd4636a939667e26d5a |
| candidate-es-320-section.png | f40896a02211bc332034a1dfe33f64e89fe97783dc1a06656b0e20be6be9e454 |
