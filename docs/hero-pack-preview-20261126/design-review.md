# Hero standard-pack review — design and reveal interaction

26 November2026. Reviewer: entry_design. Read-only role; UI implementation is owned by the parent. Scope is `/workspace/eva-entry-preview` and its existing owner-only private preview. The canonical checkout, public native70, original explanation preview, runner media and clinical examples are outside this iteration.

## Current authority and method

Read the newly supplied `.agents/skills/eva-preview-review/SKILL.md`, its `references/decision-ledger.md` and `docs/hero-pack-review-brief.md`. Applied that workflow with the previously loaded local Impeccable layout/typeset guidance. The newest owner direction supersedes the earlier first-paint CTA decision and the earlier review's PASS: **normal-motion actions must wait for the original opening-complete callback**. The original runner, eva® artwork, Hanken, analog headline, compact44px controls and current composition remain visual authority.

## Minimal source architecture

1. Remove `data-hero-immediate` only from the existing `data-hero-reveal="action"` wrapper. Leave immediate navigation and playback/chapter controls separate.
2. Hide that wrapper with `visibility:hidden` while the main entrance state is `pending` or `watching`. Existing opacity and pointer-blocking rules remain. Visibility removes ordinary descendants from painting, hit testing, Tab/Shift+Tab and direct focus without introducing SSR `inert`, `aria-hidden` or `tabIndex` state that could trap the no-JavaScript fallback.
3. Preserve the original `onSignalsReady → reveal` callback. At `reveal`, removing the hidden-state selector lets the existing short arrive animation run. Do not add a timer or initialize `skip`; do not alter RunnerArrival, TrackedRunner, EvaFilm or timing constants.
4. Add `visibility:visible!important` to the existing reduced-motion and no-JavaScript reveal overrides. Existing media-failure and scroll/hash/Escape skips return actions to their normal visible state. Verify real fallback triggers rather than manually assigning a successful state.
5. Keep the hero summary inside the same reveal wrapper. The sentence and two actions are one offer group. A separately visible mobile sentence below an empty hidden row would weaken the existing composition; preserving the wrapper gives all three one coherent entrance and retains established spacing.

## Counterexample audit

- Existing `:focus-within` and `:has(:focus-visible)` rules set opacity, transform, animation and pointer events, but do not set visibility. Therefore focusing immediate navigation cannot make an action under `visibility:hidden` focusable or paint it. Do not add visibility to those escape rules.
- No current hero anchor or summary style sets `visibility:visible` on a descendant. Audit future overrides: descendants can explicitly override inherited visibility. A hidden wrapper is sufficient only while descendants retain inheritance.
- Do not rely on opacity or pointer events alone; both permit keyboard focus. Do not set `display:none`, which would alter geometry and interfere with the existing group reveal.
- The original `reveal` phase may make the group keyboard-focusable during its short fade; the opening-complete callback has already fired at that point. The brief gates access until that callback, rather than adding a new animation-completion clock.
- Reduced motion initially mounts the normal hero before the effect selects the calm form. The media-query visibility override must work during that initial `pending` frame too.
- No-JavaScript initial DOM remains `pending`; its inline style must explicitly restore visibility in addition to the old opacity/transform/pointer override. No client-only property should be required to unlock the anchors.
- Blocked video, unavailable arrival canvas and the existing startup fail-open already call `skipEntry`. Preserve those paths and their clocks unchanged. Normal keyboard focus must not call skipEntry merely to reach navigation.

## Paid copy and destination

Use the approved compact two-role meaning: `Start with the pack` / `Empieza con el pack`, with the localized€99+VAT quarterly price in the existing13px metadata line. Keep14px/18px Hanken600 labels,13px/16px Hanken400 metadata and the one44px horizontal row. The existing paid column is174px at320, with162px of available text width after border/padding; render the final exact price line rather than assuming it fits. No third line, smaller type or extra hero action.

The paid destination is the existing localized `signup?plan=quarterly` standard intent. It must visibly show the13-marker,€99+VAT quarterly subscription and cancellation terms. The free anchor retains its free-upload return intent. No chooser is needed before the standard offer.

## Other panels in the later offer details

Keep the existing later `.offer-panel-details` area. Put the comparison anchor inline in its prose, with inherited16px type, a restrained underline and no Arrow/button treatment. Existing `.upload-offer a` styles force flex layout, a rule, padding and minimum height; the inline variant needs a narrow explicit override (`display:inline`, no border/padding, `min-height:auto`, inherited font). Preserve visible keyboard focus. Do not add a third hero choice or redesign pricing.

## Verification status

Source-direction verdict: **PASS direction; rendering and interactions NOT VERIFIED**. Required final evidence is normal pre/post states plus reduced-motion, real no-media and no-JavaScript behavior, in ES/EN at320/390/1366. Before completion, direct focus must fail and Tab/Shift+Tab must skip both actions even while navigation is focused. After callback/reveal, both must be visible, focusable and hit-testable. Preserve source equality for the runner files and verify the accepted opening still runs. Review final copy fit, destination terms and quiet later inline link on that same candidate.

No candidate visual PASS is claimed yet. The previous immediate-action screenshots are historical evidence of an explicitly superseded direction.

## Independent source counterexamples

A separate read-only motion reviewer confirmed that the visibility approach is sound for the current descendants and focus CSS, and identified two remaining ScrollStory edges:

- The initial effect still treats `entrance.current?.contains(document.activeElement)` as a skip reason. Navigation can be focused before hydration/effects, so this can reveal actions early despite the CSS gate. Remove that focus-based skip condition to satisfy “focusing navigation must not reveal them early.” Reduced motion, hash/scroll restoration and media fail-open remain valid independent paths.
- Escape currently calls skipEntry without actual scrolling. Under a strict callback-only ordinary-display rule, remove that key skip; otherwise record it explicitly as an intentional skip exception. This is a source/criterion reconciliation, not a runner-timing change.

Also checked consumers of shared paid copy: SiteShell uses `entryPreviewCopy.buy`. If the label becomes “Start with the pack,” its destination must follow that standard intent rather than retaining the earlier chooser link. The parent was notified before implementation.

## Applied source and initial rendered evidence

The parent's final diff follows the visibility-wrapper architecture, includes reduced/no-JavaScript visibility overrides, removes initial focus-based and key-only skips, preserves real scroll/hash/media skips, and routes hero/SiteShell/later standard actions to quarterly signup. Exact RunnerArrival, TrackedRunner, EvaFilm and timing hashes match HEAD. The later other-panel anchor has a scoped inline treatment without an arrow or button surface.

Created `render.cjs` in this evidence directory at the parent's request. It reuses production-build local-file byte-range fulfillment, blocks network mutations and external reads, records actual entrance transitions, and does not modify application timers or animation state. It covers12 EN/ES×320/390/1366×normal/reduced profiles plus6 no-JavaScript and6 real runner-media-abort cases. Checks include early direct focus, nav→Tab→Shift+Tab→Escape, post-reveal focus/hit testing,44px row fit and type roles, actual free/quarterly signup clicks, quiet later-panel destination and hydrated selector switching, original artwork hash, Alex2.1 and separate range2.9 regression.

Initial six EN profiles passed. Normal callback transitions occurred approximately2309–2320ms after the first decoded frame. The EN320 before/after captures show actions hidden initially and the approved pack meaning after the original opening. Paid signup visibly states13 biomarkers,€99+VAT per quarter and cancel anytime. The later-panel capture is understated underlined text with no button/arrow. ES and fallback checks are still running; this is not the final verdict.

## First complete attempt and correction

Attempt1 passed all12 normal/reduced profiles and all6 real media-abort cases, but all6 no-JavaScript cases exposed a genuine source blocker: visible actions retained `pointer-events:none`, so every sampled hit test failed. The new pending/watching selector includes `:not([data-hero-immediate])`, making its important pointer declaration more specific than the original noscript descendant override. The parent strengthened the no-JavaScript selector and matched the reduced-motion override specificity, then rebuilt. No test requirement was relaxed. Attempt1's report, log, harness and screenshots are preserved in `attempt1/`.

A focused run on the rebuilt candidate (`nojs-recheck-report.json`) passed all6 EN/ES320/390/1366 cases: actions visible, hit-testable and directly focusable while the SSR entrance remains pending, and actual paid clicks reach quarterly signup. No page errors, missing files or network writes occurred; owned browsers were closed.

The apparent low contrast in the first pricing screenshots was a capture of the existing200ms background transition while text color had already changed. The final harness now waits350ms and measures settled computed foreground/background contrast in each selector cell for enhanced and standard states before capturing. This changes instrumentation, not product CSS. A final full24-case run on the rebuilt source is in progress.

## Final rendered and interaction verdict — PASS

`render-report.json` passes all24 cases on the final rebuilt source:12 EN/ES×320/390/1366×normal/reduced profiles,6 no-JavaScript cases and6 real media-abort cases. An additional focused6-case no-JavaScript run in `nojs-recheck-report.json` records and reasserts the state after focus is blurred, before the screenshot: both actions remain visible, opacity chains stay usable, and all three sampled hit points on both actions pass in every viewport. This resolves the judge's transient screenshot concern with direct post-blur evidence. No application timer or animation state was mutated.

Normal opening gates pass before and after navigation focus, actual Tab/Shift+Tab and Escape. Direct focus on either hidden action fails; neither is a hit target. The existing callback reveals the action group approximately2297–2321ms after the first decoded frame in the six tested normal profiles. Video playbackRate remains1. The exact RunnerArrival, TrackedRunner, EvaFilm and timing source hashes match HEAD. Reduced motion is immediately usable; real aborted runner requests trigger the existing skip fallback; no-JavaScript keeps usable actions while the SSR state remains pending.

The compact row remains44px throughout. Hanken600 labels are14px/18px, Hanken400 metadata13px/16px, each one line. At320 the paid Spanish label is approximately129px wide and its quarterly price line123px, within the174px control. Normal and calm summary remains16px/24px. Inspected EN/ES320 and desktop before/after renders retain original runner/head clearance, low action composition, analog lettering and eva® artwork. The no-JavaScript solid-serif fallback is existing source behavior; these checks establish accessible actions, not full animated visual parity.

Actual free clicks retain free-plan upload return intent. Actual paid clicks reach localized quarterly signup, visibly showing13 biomarkers,€99+VAT per quarter and cancel-anytime terms, without a chooser. The later other-panel anchor is inline underlined text without Arrow/button treatment and reaches the enhanced selector. Hydrated standard/enhanced switching passes; settled selector contrast is at least15.29:1 (selected16.83:1). Final ES320 enhanced and desktop captures are legible after the existing transition settles; no pricing CSS change was required.

Regression checks preserve fictional Alex2.1, separate range2.9/lab3/lower1, bridge adjacency, exactly two hero actions, no public AI/biological-age promise in affected landing content, and the original wordmark SHA. Both final reports record no page errors, missing files or network mutations and all owned browsers closed.

Final source identifiers recorded in the full report: ScrollStory SHA256 `2055a840c52f4645c1f8a3c698d962e6839e7914e3aa222e93014259a383c09f`; hero-entrance.css SHA256 `8f86489066bf988ea76dcc1d76edf595ef81dbffc29f64e8b09723369a1d268d`. The report includes hashes for all other affected reviewed source.

**No required design or reveal-interaction fixes remain in this bounded candidate.** This PASS is for showing the owner-only preview. It does not establish owner acceptance, physical-device performance, live backend/account/purchase behavior or production-release approval.
