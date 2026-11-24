# Medical semantics initial review

Role: medical evidence/semantics agent; this is not human clinician approval or user research. Reviewed the retrofuturist brief, v64 clinical signoff and medical spec, current RangeProofSection/copy/CSS, AGENTS.md and incumbent design guidance. No application source edited.

## Recommended semantic approach

Use one luminous sample readout feeding two distinct comparator terminals. Branches mean “the same sample is asked two questions”; they do not map concentration, time, risk magnitude or a desirable interval. Each terminal names its question and carries a plain-language verdict. Keep the sample visually dominant; cutoffs are quieter reference labels. Use warm white for the lab comparison and a restrained amber cue attached specifically to the conditional review text. An open, labelled connector may establish shared provenance; never draw a closed enclosure between 2 and 5.

A pair of measurement scales remains unsafe here even without fill: spatially placing 3.2 between 2 and 5 can reproduce the rejected desirable-window reading. A dial can imply a desired needle position. A comparator/branch instrument can be graphical without making a range.

## Required cues

- One unambiguous fixed example: hs-CRP 3.2 mg/L / 3,2 mg/L; visible Example / Ejemplo.
- Show the distinct cutoff semantics explicitly: this laboratory reference is <5 mg/L; the European review modifier is >2 mg/L **if persistent**. Preserve strict >, never ≥ or 2+.
- Make “if persistent / si persiste” part of the review terminal, with equal readable status; do not leave it only in a legend, footer, tooltip or source disclosure.
- Name heart/cardiovascular risk in visible review wording or its immediate action. “Review” alone does not tell a newcomer what is being reviewed.
- The lab verdict must remain scoped to this lab. A neutral status is appropriate; a green pass/check/healthy badge is not.
- Show “Repeat when well. If still raised, review overall heart risk.” in the closed view. This single result does not establish persistence.
- Keep lab variability/no-diagnosis visible, and health history/inflammation/confounder context in the disclosure. Preserve three source links.
- If amber is used, attach it to the review action/conditional trigger, not the span >2 or the sample as a disease-severity status.

## Forbidden cues / blocking failures

- Any continuous band, filled arc, bracketed window, glow enclosure, target bullseye, needle destination or ticks that make >2 or 2–5 appear desirable/optimal.
- Green “safe” below 2 or below 5; red “disease” at 3.2; a traffic-light scale or severity animation.
- Two independently glowing sample values that imply separate tests or repeat measurements.
- Arrows that imply reducing 3.2 to 2 is a universal treatment goal, or that crossing 2 causes disease.
- Labels “normal heart-risk range,” “optimal,” “healthy,” “safe,” or “high cardiovascular risk” assigned to this example.
- A disclaimer used to rescue misleading geometry. Closed-view first impression must carry the correct meaning.

## Exact copy improvements

Suggested terminal labels and verdicts, with threshold labels kept separate:

| Role | English | Spanish |
|---|---|---|
| Lab question | Lab reference | Referencia del laboratorio |
| Lab cutoff | <5 mg/L | <5 mg/L |
| Lab verdict | Below this lab’s limit. | Por debajo del límite de este laboratorio. |
| Review question | Heart-risk review | Revisión del riesgo cardiovascular |
| Review cutoff | >2 mg/L if persistent | >2 mg/L si persiste |
| Review verdict | Above the cutoff. Review if it persists. | Supera el umbral. Revisar si persiste. |
| Action | Repeat when well. If still raised, review overall heart risk. | Repite cuando estés bien. Si sigue elevado, valora el riesgo cardiovascular global. |

Do not duplicate the conditional phrase unnecessarily if the cutoff and verdict share one clearly labelled terminal. The existing verdict “Above the review threshold” / “Supera el umbral de revisión” is factual when directly grouped with the visible conditional cutoff. Prefer “risk-review threshold” / “umbral de revisión del riesgo” over “prevention threshold” / “umbral preventivo” in the disclosure lead; the latter can sound like a universal prevention target. The present repeat/action wording is medically suitable and does not need expansion.

## Truth boundary

The current source facts are internally consistent with the retained clinical evidence: adult assay <5; ESC/EAS persistent >2; repeat when stable/well; consider overall risk. Historical axis coordinates are not medical requirements. No fresh primary-source verification was required for this unchanged evidence set, and this note does not claim it. Final visual approval is pending actual candidate screenshots; no graphic can be guaranteed against every possible reading solely from source semantics.
