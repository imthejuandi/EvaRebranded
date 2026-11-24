# Candidate 2 medical semantics gate

Verdict: PASS for the current source and the three inspected candidate images. No blocking medical-semantic finding. This is an agent evidence/visual-semantics review, not human clinician signoff, real-user research, or a guarantee of universal comprehension. No application source was edited during this review.

## What was reviewed

- Actual candidate 2 section screenshots: English 1366 px; Spanish 390 px and 320 px.
- Current RangeProofSection.tsx, range-proof-section.css and range-proof-copy.ts.
- Previously reviewed clinical truth retained from v64 clinical-source-signoff-v64.json, medical-spec.json and the v65 brief. This review did not re-fetch the unchanged primary literature.

## Visual meaning

One dominant, labelled hs-CRP example feeds two labelled comparison terminals. The connector represents the same sample going to two questions. It does not encode concentration, elapsed time, risk magnitude or a treatment destination. There is no ruler, scaled arc, filled zone, enclosing interval or goal marker. No area above 2 reads as optimal in the inspected images.

The lab terminal remains neutral; the amber terminal and adjacent conditional wording call attention to a review consideration. The colour is not applied to a numeric span or an optimal area. The large 3.2 sample is not labelled dangerous, healthy or a diagnosis. Removing the interior separator makes the two branch destinations clearer without merging them into a range.

The scoped short lab copy is acceptable: “This lab’s reference” / “Referencia de este laboratorio” directly accompanies “Below the limit” / “Por debajo del límite.” The laboratory scope remains visible, rather than relying on the source disclosure. All three inspected closed views keep “if persistent” / “si persiste” immediately beside >2, and keep repeat-when-well plus overall-risk guidance readable. The no-diagnosis and laboratory-variation note is also visible.

## Source truth gate

- Fixed independent example remains 3.2 mg/L, locale-formatted in the component, explicitly Example / Ejemplo. No history is introduced.
- Laboratory cutoff remains strict <5 mg/L and scoped to this documented adult assay reference.
- Review cutoff remains strict >2 mg/L, not ≥2 or 2+. The threshold itself is not described as an optimal target.
- Persistence is a condition of review, not something established by the one result.
- Next step remains repeat the test when well; if still raised, review overall heart/cardiovascular risk. No universal interval or automatic treatment is prescribed.
- Disclosure retains health history, other risk factors, possible inflammatory causes, clinical stability, no diagnosis and no universal treatment target.
- CDC, ESC/EAS and ERFC source links remain intact.
- Accessible explanation explicitly excludes an optimal target and diagnosis.
- Source entrance animation changes only connector opacity for 500 ms; it does not change values, thresholds or risk status. This statement is source inspection, not a separate live-motion test.

## Source SHA-256

| File | SHA-256 |
|---|---|
| components/story/RangeProofSection.tsx | 472520713a714af522fe42318674bbbd1f4a446ea5d363b23e4673700757441c |
| components/story/range-proof-section.css | a8a21c84f6931e4bb5ece73ae4ce1ff453462c47726d97e636cd78ccc92407fa |
| lib/site-content/range-proof-copy.ts | e7951f4fbc6b1f9a2e6bf52a7dee1a4639dffa2adc7df40763554aa2448f1e4a |

## Inspected screenshot SHA-256

| Image | SHA-256 |
|---|---|
| candidate-en-1366-section.png | af2058efd01bb2d0f59632653eb0ab2a40898ad79236216cb6019475434c4bef |
| candidate-es-390-section.png | 3fa61c6d9d210d7916109d5d00f349a6d2ede30bab82918f9333f24899f6dc58 |
| candidate-es-320-section.png | 6d8ddc73650e42902f05bb066801a97e141ce739f609fa61a9a458257b9afe94 |

This gate applies to the listed candidate evidence. Native deployment, other viewport captures, keyboard behavior, computed contrast and actual-motion checks remain with their respective QA reviewers.
