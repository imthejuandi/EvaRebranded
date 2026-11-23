# Shared-scale range graphic — version 63

Owner review is open: the amber/shaded region above 2 was interpreted as an optimal range. Native 63 publication and the recorded clinical/functional checks remain real; the agent pass is not owner acceptance. Root is preparing 64.

Native release 63 serves UI source `fae7fd4be2024b5d3de76404a062630d16b298c7`. Eight fresh English/Spanish desktop, phone, tablet and reduced-motion profiles passed. `actual-v63.json`, `actual-` captures and `impeccable-review.json` are actual native 63 proof. `baseline-v62.json` records eight fresh native 62 profiles, with selected `baseline-` captures. Temporary SSR/DOM previews are excluded from native proof.

The CMO agent packet, clinical source signoff and medical contract distinguish this independent labelled 3.2 mg/L example from Alex’s unchanged 2.1 mg/L history. The current graphic uses a 0–6 mg/L display scale, CDC adult-assay reference <5 and ESC/EAS strict >2 if persistent risk modifier. The 2–5 overlap means that both statements can apply; it is not an unhealthy/optimal zone, a disease probability, a personal forecast or CRP causation. The three visible source links cover the assay reference, European guidance and prospective association evidence. CMO review is agent evidence review, not approval by a human clinician.

`actual-comparison-v63.json` reports the same visible-text extraction for both releases, including caption and CTA. Words, explanatory prose, glass height and full-section height are separate. No fixed percentage cut from 62 was required for this richer teaching graphic; any added words and height remain visible. Prompt criteria and real revisions are retained in `judge-rubric.json` and `review-iterations.json`. This is editorial simulation and viewport emulation, not human usability research or physical-device performance.

## Re-run the focused checks

With installed Playwright, system Chromium and the inherited proxy in the managed checkout:

```bash
node docs/browser-qa-v63/graphic-review.cjs 63 actual
node docs/browser-qa-v63/compare-final.cjs 63 actual
```

Argument 1 is the verified current native version and argument 2 is the report mode. Verify native Sites metadata first: the review query does not pin a release. The retained harness uses `/workspace/eva-playback-review/package.json` and writes outside Git to `/workspace/eva-in-place-qa/range-graphic-v63`. A different checkout must adapt these explicit path constants. The output directory needs the medical-spec, medical-contract and historical baseline-v62 files retained here. `baseline-review.cjs 62 baseline` is preserved as the exact baseline harness; do not run it against a newer live deployment and call that a historical 62 capture.

All tests block mutating network requests and close their browser. No real account, health upload or purchase was made. Only this chapter was checked; full landing/entry suites and no-JavaScript visual parity were not rerun. The managed local preview had timed out; final proof is the succeeded native deployment and actual-site checks.
