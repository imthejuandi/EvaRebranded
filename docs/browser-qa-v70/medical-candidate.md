# v70 candidate medical visual/source gate

**PASS — no blocking medical-semantic finding in the inspected source and EN/ES candidate images.** This is agent medical evidence and visual-semantics review, not human clinician approval, patient-specific advice or actual-user research. No application source was edited.

Inspected candidate English 1366 px, Spanish 390 px and Spanish 320 px section screenshots, current component/CSS/copy, and the previously verified Valley Hospital source described in medical.md. No new research was required in this pass.

## Numeric and source consistency

The independent labelled example is now 2.9 mg/L / 2,9 mg/L. The selected hospital reference is strictly <3 mg/L, accurately attributed in the disclosure and source link to The Valley Hospital’s public CRPHS catalog. The former CDC <5 attribution is removed. “Lab’s reference range” exactly matches the requested English label, with natural Spanish wording.

On the common linear 0–5 display scale, the example is at 58%, the laboratory boundary at 60%, and the AHA lower-relative-risk category boundary at 20%. Both sample markers align with the 2.9 / 2,9 axis annotation. The code derives all positions from the same domain and retains the strict bright-dot test value < end.

The laboratory boundary and cursor are close by design: the sample is only 0.1 mg/L below 3. At mobile sizes the ring overlaps part of the thin boundary, but its centre remains left of the boundary and the extended boundary remains visible above/below the ring. The explicit <3 threshold and “Within reference” verdict resolve the intended numerical relationship without moving the measurement. This is not a blocking medical issue.

The sample is correctly outside <1. In the full AHA category framework retained in the disclosure, 2.9 is in the average 1–3 relative-risk category; the interface does not falsely call it high relative risk or high overall risk. At exactly 3, the chosen hospital’s strict reference and AHA category endpoint differ, and neither is silently changed.

## Closed-view meaning

The two dot ribbons compare a laboratory reporting interval with a narrower, explicitly labelled lower relative cardiovascular-risk category. The sample’s first verdict is within the selected lab reference; the second is outside the lower-risk category. The displayed category/not-overall-risk note and lab-variation/no-diagnosis note remain readable in all three views. No interval is called a universal optimum, healthy guarantee or treatment goal.

The full review/repeat recommendation footer is absent, as requested. The removed >2 modifier object, ESC/EAS source and third-trigger accessibility wording are also absent, leaving a coherent two-range comparison. There is no orphan risk trigger or lingering instruction to repeat the test. This removal does not make the remaining educational comparison misleading: it makes no claim that the single measurement proves persistence, establishes overall risk or diagnoses disease.

The disclosure now gives factual context only: illness, infection and injury can raise hs-CRP, and a single measurement cannot establish persistence. The retained three sources match the remaining claims: Valley Hospital for the lab reference, AHA for relative categories, ERFC for prospective association. The accessible description matches the two shown ranges and explicitly excludes a universal optimal target.

## Approval boundaries

This gate approves the stated candidate’s medical factual and visual consistency. It does not establish native deployment, computed colour contrast, keyboard behavior, physical-device performance or actual-user comprehension. Preserve the sample/threshold geometry and the visible category scope through publication.

## Source SHA-256

| File | SHA-256 |
|---|---|
| components/story/RangeProofSection.tsx | a9fab7b5e76617d2d956a4dac1c43e9dd3793f990d5db951f1faad8a972175ff |
| components/story/range-proof-section.css | ccd4e6349e4f2ca605e6d46d5355771fa7ad59c9da5f53bcb0847653d4ad1926 |
| lib/site-content/range-proof-copy.ts | ee7e0466e0291260b2d3721134cab323faffdb54ed9e7567242e01c68fe5c7a0 |

## Candidate screenshot SHA-256

| Image | SHA-256 |
|---|---|
| candidate-en-1366-section.png | 4229382d078741f4f8f19eb4c4ac4f0e21e35351dd3bc808e1d901bd8418507e |
| candidate-es-390-section.png | d2c31d9d4e3b3c2944eb3d44d0638d0ee92f0fad585d20b92396cca69335e541 |
| candidate-es-320-section.png | 615511d79a46febb53168b8281a8165752550104198a52a67ed6c99707c9608e |
