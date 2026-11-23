# Range-proof refinement — version 62

Native release 62 serves UI source `5675df1aaa4332b86deb34eb509b3ddd9fcc84ac`. Eight fresh English/Spanish desktop, phone, tablet and reduced-motion profiles passed the focused range-proof checks. The current report is `final-v62.json`; its captures are prefixed `final-`. `baseline-v60.json` and `baseline-` captures are actual native 60 evidence, not current-layout proof. Temporary DOM/CSS previews are excluded.

`final-comparison-v62.json` uses the same visible-text-node extraction for both releases. It includes the caption, CTA and visual axis labels; it excludes screen-reader duplicates and closed details. Whole-view, explanatory-prose, glass-height and full-section changes remain separate. No exact-width tablet or reduced-motion geometry baseline was captured; the comparison identifies that limit.

The prompt/review loop is recorded in `judge-rubric.json` and `review-iterations.json`. Terse wording, redundant question/answer copy, a narrow chart and an inside-glass bridge were revised after critique. The original 25% word heuristic was explicitly replaced before final measurement with a combined text/phone-density criterion to retain the useful explanatory bridge. This is agent editorial review and browser verification, not human user research.

All results use viewport emulation; they do not establish physical-device performance. No real account, health upload, purchase or mutating network request was made. The wider landing and full entry suites were not rerun for 62. No new no-JavaScript visual-parity claim is made. The managed local-preview service timed out; final proof is the succeeded native 62 deployment and actual-site checks.

## Re-run the focused check

The tracked `range-review.cjs` and `compare-final.cjs` preserve the exact judge harnesses. In the managed checkout with installed Playwright, system Chromium and the inherited proxy:

```bash
node docs/browser-qa-v62/range-review.cjs 62 final
node docs/browser-qa-v62/compare-final.cjs 62 final
```

Argument 1 is the verified current native version; argument 2 is the mode. `baseline` selects five baseline profiles and historical chart assertions; `actual` or `final` selects eight current profiles. The review query does not pin a release. Verify native Sites metadata before running and do not rerun `60 baseline` against the current deployment as if it were historical 60.

The retained harness paths are `/workspace/eva-playback-review/package.json` and `/workspace/eva-in-place-qa/range-concise-v61`; output keeps that original workspace name. A different checkout must adapt those explicit path constants. Reports/captures are written outside Git. Comparison needs the original `baseline-v60.json` in that output directory; the tracked baseline here is the preserved actual 60 measurement, not a new capture. The harness blocks mutating network methods and closes its browser.
