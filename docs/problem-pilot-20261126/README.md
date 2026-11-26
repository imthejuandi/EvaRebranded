# EVA practical-problem pilot

**Ready for private owner review.** The candidate adds one plain paragraph about understanding a change in lab results, then shows the intact fictional Alex example before collection and kit details. The existing healthy-question section stays first below the hero. The later optional dashboard stays in its original place. Five product files changed.

This is a local exact-build candidate, not a republished Site. The existing EVA Content Review remains at version 70. Managed preview startup failed, so there is no hosted candidate URL. Installed Chromium rendered the pinned production artifacts; no replacement server was started. The rejected private entry variant was not used as the baseline or updated.

## Look at the result

- [English desktop: paragraph, Alex and collection boundary](evidence/candidate/en-1366-normal-join.png)
- [Spanish phone 390: paragraph, Alex and collection boundary](evidence/candidate/es-390-normal-join.png)
- [Spanish phone 320](evidence/candidate/es-320-normal-join.png) · [Spanish reduced-motion phone](evidence/candidate/es-390-reduced-join.png)
- [Original English hero](evidence/baseline/en-1366-normal-hero-after.png) · [Candidate English hero](evidence/candidate/en-1366-normal-hero-after.png)
- [Matched first-scroll frame index](reader-sequences.md), including every intervening screen and equal viewing distance.

## Exact revisions and tests

| Revision | Result |
| --- | --- |
| Original Content Review v70: `58bac762100a18c440b38429dee95f4663194e2d` | Source/archive pinned before edits. Native EN/ES HTML was byte-identical to the extracted release build. Baseline browser: 12 core + 12 fallback cases pass; the requested earlier practical-example order is absent. |
| First candidate: `fef06dc31f6e6618961c989f9942b4540bf17e3d` | New order renders, but shortening the later gallery makes chapter-position reporting advance too early.12 core and 2 direct-gallery assertions expose the regression. It was not waived. |
| Final candidate: `6e0769f41434e8cc574a3b5fa87332d1ecf44a73` | 12 bilingual normal/reduced profiles, 12 keyboard/media/no-JS/hash profiles, 2 Tasso/kit/signup supplements,2 accessibility-region checks and 31 cross-build comparisons pass. One targeted correction round. |

The correction restores the results chapter's state while the short gallery remains visible, then yields naturally to the following section. It does not change the hero's animation, labels, focus/keyboard exceptions, controls or destinations. The original wordmark, chart values and clinical copy remain protected. [Exact final patch](candidate.patch) · [First patch](first-candidate.patch) · [Correction patch](correction.patch) · [Source guard](final-source-diff-tests.json)

Precise hero behavior was compared with v70: the normal entrance waits for its existing runner cue; original Tab/Escape/direct-focus access exceptions remain; reduced motion, blocked media and no JavaScript retain their fallback. Free and quarterly signup hrefs remain exactly localized as before. Alex remains fictional 2.1 mg/L with 0.8/0.9/0.8/2.1 history. The separate range stays 2.9 against <3 and <1. [Independent technical verdict](evidence/technical-review.md) · [Before/final comparison](evidence/comparison-report.json)

The new paragraph uses EVA Hanken 400 at 16px/24px, with 16px before Alex. English desktop wraps to 2 lines; Spanish 320 to 4 lines. No overflow or new font/media asset was introduced. The independent Impeccable review is part of the technical verdict.

## Customer understanding, separately assessed

A fresh Astra-medium reader saw 14 neutral matched images, with no brief, skills, expected takeaway, variant identity or author verdict. The observation files were hashed before a separate Sol-medium reviewer scored them. The new sequence made changed-result interpretation and the fictional example concrete before collection in both EN and ES. The baseline already conveyed general tracking: **no improvement is claimed for that broader awareness.**

This is one AI screenshot reading, not customer research. It does not isolate the separate effects of copy and placement. [Unprimed observations](reader-observations.md) · [Frozen receipt](reader-phase1-receipt.json) · [Subsequent scoring](reader-scoring.md) · [Masked frame key](reader-key.json)

## Process and audit trail

The plan critic first received the dated owner records and original source identity without the author's interpretation. It independently protected the original hero/access paths and excluded immediate-button and panel-chooser proposals. It then prevented moving the whole gallery and required a fair first-scroll comparison. Browser QA caught a separate height-dependent chapter-reporting defect after the compact-only move. [Phase 1 scope result](plan-scope-observation.md) · [Plan critique](plan-critique.md) · [Response](plan-response.md) · [Correction review](plan-correction-review.md)

One integrator owned product files. Actual models/efforts, substitutions and all primary/follow-up dispatched prompts are retained. Frontend Design was unavailable; installed Impeccable supplied layout/type guidance. No separate clinical review was commissioned because no health claim changed. [Frozen contract](brief-frozen.md) · [Dispatch register](dispatch-register.json) · [Exact prompts](prompts/) · [Copy options](copy-options.md) · [Visual direction](visual-direction.md) · [Execution notes](execution-notes.md)

**One process recommendation:** run one representative baseline/candidate browser profile with applicable fallbacks before expanding the full matrix. It would have exposed the repeated harness assumptions and chapter defect earlier; the full final matrix remains the verification gate. [Independent retrospective](process-retrospective.md)

The supplied master-workflow v1 and EVA preview-review v3 bundles and ledger remain byte-identical to their staged hashes. No skill change was made from this pilot. [Run manifest](run-manifest.json)

The complete raw workspace captures remain at `/workspace/eva-in-place-qa/problem-pilot-20261126`; curated paired captures and all first/final JSON/manifests/scripts are checked in under `evidence/`. Hosted/managed candidate preview, physical devices, human customer comprehension, medical/backend validation and paid-kit launch readiness remain unverified and outside this pilot.
