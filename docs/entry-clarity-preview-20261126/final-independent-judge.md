# Independent final judgment — EVA entry/panel private preview

**PASS for the bounded rendered private-preview candidate. No mandatory UI or copy fix identified.** Ready to show after the separate native deployment and audience checks. This is not approval to merge, publish publicly, launch a clinical service, or treat agent review as owner acceptance.

Reviewed `/workspace/eva-entry-preview`, branch `preview/entry-clarity-20261126`, frozen source commit `3f5a5013b8db670e43c483226a6d7ba1eb2f484a`, based on `cdc71e660883a41c8b7c0dc696e61cf18b78c740`. The exact reviewed UI snapshot is `1bb46b7dc597bca7990d534a5a78472835f037066c99cbcb59792fb22385146f` across 21 changed source files; all eight source hashes in the completed render report still match. Build manifest: `83661d7674f80011016e39ab8bb467264b2a43e70e44aab9e43ae9df78adaed2` (790 files). Full per-file hashes are in the JSON companion.

I did not author or edit the UI, commit, or call Sites. I read the repository protocol and current bounded brief, inspected source against the baseline, used Impeccable typeset/layout/polish guidance, and visually inspected EN1366 and ES320 in normal and calm states. Other agents’ verdicts were not authority for this decision. A new design interview was unnecessary for this subagent review of a fixed bounded brief.

| Lens | Verdict | Finding |
| --- | --- | --- |
| Medical and product truth | PASS | New bridge is a comprehension problem, not an efficacy or disease claim. Alex remains fictional at 2.1 with history 0.8/0.9/0.8/2.1 and no causal inference. Separate 2.9 mg/L reference proof preserves strict <3 and lower relative-risk <1 on one 0–5 scale. Standard excludes ApoB; enhanced includes it and explicitly leaves other contents, count, price, timing, frequency and availability unconfirmed. Full lab option remains separate at €499 one time. |
| Marketing copy and novice explanation | PASS | Visible hero explains what EVA does. Free upload is the primary action; the secondary opens panel choice. A short visible bridge immediately precedes Alex. The example teaches that history and context help explain a change, while neither its cause nor persistence is established. |
| English and Spanish parity | PASS | EN/ES entry, bridge and panel terms retain the same action, scope and uncertainty. Spanish reads naturally for Spain. ES320 wraps without clipped labels or smaller replacement type. |
| UX, established design and Impeccable typography/spacing | PASS | Own inspection of 32 exact renders: EN1366 and ES320, normal/calm entry, runner, Alex, ranges, selectors, enhanced detail and footer. Existing ink/paper/glass/dots and real imagery remain. Computed hero/bridge are EVA Hanken 400 16/24; action labels 600 14px, metadata 400 13px; actions remain 44px. No collision, viewport overflow or unreadable wrapping observed. ES320 selector is tall but readable. |
| First available screen, hit testing and buy destination | PASS | All 12 profiles show both action links at the earliest CSS/font-ready snapshot while entrance remains pending, with visible/non-inert ancestor chains and three successful hit points per link. Actual buy click reaches locale pricing?panel=standard#elegir-panel with no email/password form. No-JS and keyboard-while-arrival checks pass; focus has a 2px solid outline. |
| Original runner, scroll, kit and example preservation | PASS | Independent git byte comparison confirms RunnerArrival, TrackedRunner, EvaFilm, AnalogType, timing module, Alex data and range component/copy/CSS unchanged from cdc71e6. Additional browser evidence records runner frame 0→120 after scroll, original 13-marker kit forward/reverse and 500ms transition, and fixed Alex 2.1 across explanation control changes. |
| Official asset and preview isolation | PASS | Logo SHA is exactly 682fac5978cbae0973318e139fcb6dda60925f30e762ea190cce27fe7ad9977f. Header/footer use the revision-qualified PNG mask with no typed EVA text in the art span. Public assets have no tracked diff. main remains cdc71e6 and the separate normal-explanation preview remains 39485db. |
| Free Score display condition | PASS | Affected copy states that enough compatible report data is required. Browser-local fixture test shows an existing score for a free account and the insufficient-data fallback after removal; AI and biological-age promises are absent from affected rendered landing/pricing/report surfaces. This is a display/preview check only. |
| Native private deployment and access audience | NOT VERIFIED | No native deployed preview was available to this judge. Local real-browser request fulfillment is not native deployment or owner-only access proof. |
| Real-device performance, physical sampling, clinical and backend readiness | NOT VERIFIED | Viewport emulation and fixture state do not establish first-contentful-paint/network performance, physical-device behavior, sample usability, clinical validation, report extraction/coverage logic or real ordering/payment services. |

The novice takeaway is clear: EVA helps explain prior blood tests and track changes; start with a free upload or inspect the available panels. Alex shows how context and history inform an interpretation. He does not establish what caused the rise, whether it persists, or a diagnosis. The separate 2.9 example remains separate from Alex’s 2.1 history.

The Impeccable detector returned two legacy warnings, not zero findings: unchanged Arial body fallback at `app/globals.css:9` and unchanged lifestyle Helvetica at line 24. Neither is a new Hanken entry-role defect. The rendered hierarchy, spacing and wrapping pass this bounded review. The ES320 three-way selector is tall but remains readable; no mandatory redesign follows from that density.

Browser evidence: 12 main profiles and eight additional checks pass, with no recorded page errors, missing files or mutating network requests. My four extra enhanced-selector viewport captures remove the focused skip-link overlay present in element screenshots and confirm unoccluded EN1366/ES320 normal/calm rendering. All owned browsers are closed.

Native owner-only access, production first-paint/network performance, real devices, physical collection, clinical validation, report extraction and coverage algorithms, and real payment/order services remain **NOT VERIFIED**. The free Score evidence is explicitly an existing fictional fixture plus a no-data fallback.

`main` remains `cdc71e660883a41c8b7c0dc696e61cf18b78c740`; the separate normal-explanation preview remains `39485db042574a40d2a2f814e3b1e466ab2fa7be`. The normal-explanation paragraph was not pulled into this candidate.

Smallest mandatory fix: **none**.

Evidence: `render-report.json`, `additional-report.json`, `preservation.json`, `independent-render-supplement.json`, the 32 inspected screenshots listed in the JSON companion, and direct baseline/source/asset comparisons.


## Post-native fix judgment — PASS

The latest reviewed source is `c3ebcbc2ece50eacaccd5196529dac9990dc8fd2`. Compared with the initial reviewed `3f5a5013b8db670e43c483226a6d7ba1eb2f484a`, only `components/pages/pricing/PricingPage.tsx` changes (5 insertions, 3 deletions). All other 20 reviewed UI source hashes still match. Current source snapshot: `529c740c3e81d672c409613129210cd38189fe88b1c7d18a7820184772481efc`.

I inspected the exact diff, current component, existing `LanguageSwitch` listeners, focused test source/report, and built EN/ES SSR. The built output starts with `data-panel-ready="false"` and all three panel buttons disabled. The mount effect queues the initial query synchronization before enabling the controls. The synthetic `hashchange` updates the language-switch suffix without simulating history navigation; the genuine `popstate` listener remains.

**PASS; no mandatory revision.** The four focused EN/ES320/1366 cases confirm stable enhanced → full → standard selection, preserved panel query in the URL and language link, no page errors and no `_rsc` requests. This is sufficient focused evidence for the bounded fix. Existing layout, wording, typography, media and clinical/product data are unchanged, so the 32 prior visual inspections remain applicable and were not repeated.

The initial local review did not detect the native early-selection race; this addendum supersedes its interaction judgment for the changed selector. Native v2 deployment and actual-native regression verification remain **NOT VERIFIED** pending the lead’s next check. The native v1 receipt and partial checks do not establish v2 success. Physical performance, clinical/backend capability and real payment/order services remain **NOT VERIFIED**.

Evidence: `pricing-readiness.cjs`, `pricing-readiness-qa.json`, current built EN/ES pricing HTML and the exact commit diff. Full current hashes and review detail are in `post_native_fix_review` and `latest_reviewed_candidate` in the JSON companion.


## Final native verification closure — PASS

The final owner-only preview is native **version 2**, UI commit `c3ebcbc2ece50eacaccd5196529dac9990dc8fd2`, private source `ea6884453d0f55e06a5c67771fa290d673f43619`, deployment `appgdep_6b083f3d5cbc819187f76f5e13996984` (**succeeded**). The saved receipt and actual-native report agree on version/source identity.

I inspected `native-qa.json`, `native-final-receipt.json`, `anonymous-access.json`, the native runner/selector harness checks, and four representative final-native screenshots. All five actual-native profiles pass: EN/ES1366 motion, EN/ES320 motion and ES320 calm. Each returns 200, exposes the 44px free/buy actions before the animated arrival completes (or immediately in calm mode), reaches the panel selector without an auth form, retains enhanced selection and the alternate-language panel query, and records no page errors, RSC requests or mutating requests. All ten logo HTTP responses match the exact approved SHA. Owned browsers are closed.

The saved receipt records **owner-only** access, and an unauthenticated GET returns **403** without serving the private page. The lead additionally reports GetSite shows one owner and no external viewers; I inspected the saved receipt and anonymous-denial artifacts rather than making a new Sites call. `main` remains `cdc71e6`, the separate normal-explanation preview remains `39485db`, and the original public review remains version 70.

**PASS — ready for owner review of this deployed private preview; no mandatory fix remains in the bounded scope.** This final closure supersedes the earlier pending-native-v2 status. The original 32-render review and focused readiness addendum retain their exact historical source identities.

Physical-device/production performance, physical sample collection, clinical validation, report extraction and Score coverage algorithms, real backend/payment/order capability and laboratory availability remain **NOT VERIFIED**. This is not owner acceptance, a merge decision or public-launch approval.
