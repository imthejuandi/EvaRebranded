# Native 67 final medical review

**PASS. No blocking medical-semantic finding in the inspected native screenshots and matching source.** This is agent medical evidence/visual-semantics review, not human clinician signoff, actual-user research or individualized medical advice. No application source edits were made.

Reviewed actual English 1366 px and Spanish 390/320 px section captures provided by the native QA run. Local Git HEAD is the reported deployed UI commit `438fc1087bc39130b3c6145064ed02ff8a088cc3`; the working tree was clean at review. Native deployment receipts remain the parent QA record’s responsibility; this review itself inspected supplied native screenshots and local source.

## Final meaning

The visible graph correctly compares the same 3.2 mg/L example with this laboratory’s reference <5 and the AHA lower relative cardiovascular-risk hs-CRP category <1. Both bands use the same 0–6 scale. Source calculation places the sample at 53.333333%, the lab boundary at 83.333333% and the lower-risk boundary at 16.666667%. The images agree with those relative positions. No >2 interval is filled or presented as desirable.

The new 3.2 / 3,2 label sits directly beneath the aligned sample cursors, improving the connection between the readout and plot. The nearby integer 3 label is omitted to avoid collision; this does not change the continuous linear scale or misrepresent spacing. The two cursor segments do not imply two measurements or a trend.

The pale sage <1 band denotes the explicitly labelled lower **relative** category, with an immediately visible note that this category does not indicate overall risk. The sample is labelled outside that category, not high overall risk or diseased. There is no universal optimal/treatment-goal label. A favorable implication for a lower-relative-risk category is justified by the retained AHA evidence; it must not be reframed as guaranteed health.

The updated footer explicitly says “Review if persistent: >2 mg/L” / “Revisar si persiste: >2 mg/L.” This retains the strict European >2 boundary and the necessary persistence condition while naming the meaning of the separate cutoff. Repeat-when-well and review-overall-risk action remains legible with sources closed. Laboratory variability and no-diagnosis qualification remain visible.

The revised disclosure lead now precisely names the laboratory-reference versus hs-CRP-category comparison. Source details retain the full AHA <1, 1–3, >3 framework, the separate persistent >2 European risk modifier, other inflammatory causes, health-history/overall-risk context and no universal treatment target. All four source URLs are retained. The accessible graphic explanation describes the same scoped meaning. No new history, risk percentage, diagnosis, causal claim, repeat interval or treatment instruction was introduced.

## Evidence boundaries

The numeric medical evidence was freshly checked in medical.md; this final pass verifies its implementation and visible native meaning rather than re-fetching unchanged literature. This pass does not independently test keyboard behavior, computed contrast, other viewports or physical-device performance. Agent interpretation cannot guarantee every visitor’s comprehension.

## Source SHA-256

| File | SHA-256 |
|---|---|
| components/story/RangeProofSection.tsx | 955c6d9a523b4716fa1f742deec49a53e5f6d5a620676d2bc57542301673ea06 |
| components/story/range-proof-section.css | 5c13ca61d1701fc1e56db92cac2ec515448170e5abca1d111dcb8ddf6a69f4ec |
| lib/site-content/range-proof-copy.ts | 8a0278b01a868b7a2f72c68e54004123d70bf4b90146cf0361ba73df6bfb2768 |

## Native screenshot SHA-256

| Image | SHA-256 |
|---|---|
| actual-en-1366-section.png | 3ce3af59d5e0418f692ac7bd3df9306923872df05c7e44e616a85b7d113ee60b |
| actual-es-390-section.png | 79f1a9c98f25788d17ce542b308799e73e39e6082037dc8c08ec1059bf6a9780 |
| actual-es-320-section.png | dc8e9f20c6dec7b384450ce11f7fe90e9ab7ec5b4271a99b4b58d4cc993bbb55 |
