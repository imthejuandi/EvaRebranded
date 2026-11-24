# Rendered explanation preview — final copy review

**Verdict: PASS for copy, marketing language and EN/ES parity on this exact preview. No wording revision required.**

## Artifacts reviewed

- Current AGENTS.md, docs/AGENT_REVIEW_WORKFLOW.md, docs/normal-explanation-proposal.md and native70 range baseline.
- Preview source in `/workspace/eva-normal-explanation-preview`: the three candidate files are RangeProofSection.tsx, range-proof-section.css and range-proof-copy.ts.
- Actual `en-1366-section.png`, `es-1366-section.png`, `es-390-section.png` and `es-320-section.png` in this preview directory.
- `render-report.json`, base commit `788cae34151ece3ba592d2de9f2dad8c3a4c3289`.

This was a preview-only production build rendered through browser request fulfillment. It was not a live publication. I made no UI/source edits.

## Exact-copy verification

Independently compared the saved proposal's EN/ES blockquotes with the actual paragraph text extracted in all nine render-report profiles. **Nine exact matches; no omissions, substitutions or duplicated sentences.**

The preview source adds only the approved `explanation` field in each language. The component renders it in place of the old caption. The associated style changes the measure from 34ch to 46ch and applies natural text wrapping. Existing numeric facts, labels, graphic and source detail remain intact.

## Marketing and explanation judgment

The visible paragraph now provides the missing chain: what many reference ranges describe → why that does not always identify lower-long-term-risk levels → EVA's plain-language interpretation and health-history context. The heading's promise is supported before the visitor reaches Sources and context.

All necessary qualifications survive the rendering: **Many / Muchos**, **apparently healthy / aparentemente sanas**, **don’t always / no siempre**, and the associative **linked / se asocian**. It neither describes an unhealthy population average nor claims that every laboratory reference is derived by the same method. It does not assert that Valley Hospital's particular <3 limit has a documented population derivation.

EVA's stated benefit remains interpretive. It does not promise an optimal target, lower disease risk, guaranteed improvement or disease prediction. The separate visible hs-CRP-category/not-overall-risk note continues to limit the example appropriately.

## English and Spanish as rendered

English has a clear three-sentence progression and reads naturally on desktop. Spanish preserves the same claim strength, selected-group mechanism and product benefit. **“A un menor riesgo”**, **“en lenguaje sencillo”** and **“historial de salud”** are natural in this context; no translation repair is needed.

The paragraph is readable outside the glass at regular 16px/24px. It occupies five lines in EN1366, six in ES1366, seven in ES390 and nine in ES320. The nine-line phone paragraph is more substantial than the former caption, but each sentence performs necessary explanatory work. Natural scrolling is preferable to deleting the mechanism or shrinking the type. No forced line break or additional paragraph is needed for this copy candidate.

## Preserved comparison

The independently labelled **2.9 / 2,9 mg/L** example remains inside **Lab’s reference range <3 mg/L** and outside the **<1 mg/L lower-relative-risk category**, on the same 0–5 display scale. The full recommendation footer remains absent. The free interpretation action remains unchanged. This review proposes no changes to dashboard/Alex data or other chapters.

## Limits

This is a specialist review of preview images and extracted text, not owner acceptance, human comprehension research, clinician approval or verification of a live deployment. The broader keyboard/reflow/contrast results are reported by the preview runner; my independent contribution is actual image reading, proposal-to-render text comparison, cadence, benefit and translation review.
