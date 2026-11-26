# Entry clarity — UX/UI and motion review

Date: 26 November 2026. Reviewer: entry_design. Scope: isolated `/workspace/eva-entry-preview`; canonical `/workspace/eva-playback-review` and public native70 are outside this edit scope. This is a read-only design review; no UI files were changed by this reviewer.

## Evidence and method

Applied the local Impeccable skill at `/workspace/eva-design-tools/impeccable/SKILL.md`, specifically `reference/layout.md` and `reference/typeset.md`. Context loaded successfully for `components/story/ScrollStory.tsx`. Its `SCOPED_EXISTING_ALLOWED` directive permits the narrow refinement using current code/assets as authority. This subagent uses the parent's bounded owner brief instead of a separate interview. The launcher reported no PRODUCT.md/DESIGN.md; this is a documentation gap, not permission to redesign. It also reported a newer skill version; no update was run.

Read AGENTS.md, .impeccable.md, the reusable review protocol and current handoff/coordination evidence. Inspected ScrollStory, EvaFilm, HeroKitCta, ReportUnderstanding, GuidedResultStory, BiomarkerGallery, HealthEditorial, hero layout/CSS and scroll painter/compositor. Historical native60 hero screenshots in EN1366, ES390 and ES320 calm confirm incumbent composition only; they are not new candidate evidence. An independent child traced entrance timing without changing source.

## Design direction

The visitor's first path is: understand the free interpretation offer → choose free entry or panel selection → see the concise problem bridge → understand the fictional Alex example → discover the kit process. Keep the runner and analog headline as visual lead, compact actions as the task group, Hanken as solid text and original assets as authority. No replacement mockup, audience tabs, giant CTA cards or new visual system.

## Source findings and smallest changes

1. **Immediate UI / FIX in baseline.** `app/hero-entrance.css` pending/watching selectors hide and pointer-disable every `[data-hero-reveal]`. The reveal animation later fades all of them from zero again. Exempt the existing headline, explanation, navigation, action and controls from both phases. Exempting pending/watching alone produces a second disappearance when `reveal` starts. Keep the arrival canvas itself on its original clock.
2. **Preserve motion / source boundary.** Do not initialize entry to `skip`, force `signalsImmediate`, alter `HERO_ENTRANCE_RATE=2.48`, change RunnerArrival alpha schedules, change TrackedRunner's decoded-media clock, or modify `RUNNER_EXIT_FRAME=200`. The runner's native video playback is separate from its presentation clock. Keep native scroll exits, CTA opacity/14px scroll translation, painter and compositor ownership intact.
3. **Keyboard / FIX in baseline.** `ScrollStory` uses main `onFocusCapture={skipEntry}` and a global key handler that skips on Tab/Enter. Once UI is immediate, ordinary focus should not cancel the accepted runner entrance. Decouple normal focus from arrival cancellation; retain actual scroll/hash restoration, reduced-motion and media-failure fail-open paths. The existing explicit Pause control may still pause footage.
4. **Phone explanation / FIX in baseline.** EvaFilm suppresses hero-support at widths ≤700px and the static CSS hides it too. Merely making the current support visible at `h−236px` collides with the low analog headline. A short external accessible explanation can use the existing empty strip below the 44px actions and above chapter navigation, approximately `top:calc(100svh - 123px)`, 16px/24px, at most two lines at 320px. Confirm the exact localized copy in render; shorten copy rather than shrink type. It can share the action group's established scroll fade. Avoid duplicate desktop support.
5. **Actions / preserve.** Retain the one 44px horizontal row, Hanken600 14px/18px labels and Hanken400 13px/16px metadata. The existing ≤350px 16px action gutters and dedicated secondary width preserve ES320 readability. New buy wording should fit those roles and route to the existing pricing selection; it should not imply that a plan has already been selected.
6. **Bridge and Alex order / FIX in baseline.** Current order is large statistics poster → Tasso → kit → independent ranges → Alex. Place the requested short bridge directly before the existing Alex component, then move that whole Alex/results section ahead of Tasso/kit. Maintain the independent 2.9mg/L range chapter as its own later explanation; Alex remains 2.1mg/L with its original history/context. Do not combine those evidence sets.
7. **Bridge visual placement.** Reuse the warm paper surface, existing page gutter and evidence-column width. Use proximity rather than a new card: a short paragraph (Hanken400 16/24, roughly 52–65ch on desktop, available width on phone), 24px below any existing heading and 24–32px before the Alex introduction. If the bridge has a heading, reuse the existing proof 44px desktop /34px phone role and existing italic accent, not the 80–136px statistics-poster scale. Preserve 8/16/24 rhythm, with 48px outer desktop separation and 32px phone separation as needed after render. Add no extra CTA.
8. **Truthful launch surfaces.** Hide EVA AI and biological-age launch promises in affected entry/pricing surfaces. Keep any score description conditional on available data. Preserve the owner-confirmed existing `eva-official-logo.png`; a filename is not a reason to replace its artwork.

## Candidate verification

| Lens | Current verdict | Evidence / required check |
| --- | --- | --- |
| Incumbent visual identity | PASS for source direction | Existing Hanken, glass, warm paper, dots, runner and compact controls are the authority. |
| Current immediate entry | FIX baseline | Blanket entrance selectors and ordinary focus both control arrival. |
| New hero geometry | NOT VERIFIED | Await exact candidate EN/ES renders at 320/390/1366 in motion and reduced motion. |
| Bridge → Alex → kit reading order | NOT VERIFIED | Source direction above; exact implementation/render pending. |
| 44px control row and translated fit | NOT VERIFIED for candidate | Existing role sizes must be measured after buy-label change. |
| Native footage and entrance timing | NOT VERIFIED for candidate | Preserve clocks in source, then observe first decoded frame and arrival completion; source equality alone is not timing evidence. |
| First-paint usability | NOT VERIFIED | Before arrival completion: opacity1, visibility visible, pointer hit-test on both actions, navigation and Pause; focus must be visible. |
| Mobile explanation | NOT VERIFIED | Both languages must be visible without overlap or clipping; static/reduced view must communicate the same offer. |
| Independent Impeccable scan | NOT VERIFIED | Parent/independent reviewer to scan finished changed files once, then inspect actual rendered type/spacing. |

No candidate visual pass is claimed before the parent's final renders and metrics are reviewed.

## Parent's bounded implementation direction — source proposal review

The parent proposed, before edits: runner → short unboxed one-paragraph bridge → existing Alex/results → existing sourced-statistics ReportUnderstanding → Tasso → kit → separate 2.9mg/L RangeProof → signal/editorial. This preserves the sourced chapter while directly connecting the new bridge to the first concrete explanation example. The bridge does not need a second heading; the existing Alex heading carries the next chapter.

Only offer/actions, navigation and controls become immediate; the large headline retains the original reveal. This is compatible with the requested immediate choice while retaining more of the accepted entrance choreography. Persistent UI must also avoid the later `reveal` keyframes so it does not flash off after approximately 2.27 seconds.

The explanatory sentence sits in an external HeroKitCta wrapper, before the buttons in DOM order. Visually it is above the buttons on desktop (20px separation) and below on phone (8px separation), set at 16px/24px. Existing opening Film/static support is suppressed to avoid duplicates. At 844px tall, phone support would occupy about y713–761 for two lines, with chapter labels beginning near y790. Exact localized wrap and shorter-height rendering remain NOT VERIFIED.

Proposed paid label/metadata are `Choose panel` / `View options` and `Elige un panel` / `Ver opciones`, with the original free pair. These are shorter than the established secondary label/metadata and should fit the retained 44px row without shrinking. Actual geometry remains NOT VERIFIED.

Pre-edit design verdict: **PASS direction, pending render**. No UI source changed by this reviewer.

## Candidate source inspection

The parent's current diff implements the agreed order and one paragraph within BiomarkerGallery, adds `data-hero-immediate` only to persistent UI, preserves headline reveal and leaves RunnerArrival/TrackedRunner/Film clocks unchanged. New labels remain in the established type roles. The wrapper support uses the discussed desktop/phone placement. Source-only direction remains sound.

One concrete source risk was sent back before screenshots: in the calm phone hero, the absolutely positioned `.hero-entry-actions` has left/right insets but also inherits mobile `width:100%`. That can produce a full-viewport-width wrapper starting inside the gutter, with the new summary extending past the right edge. The minimal correction is phone-only `.calm-hero .hero-entry-actions{width:auto}` so the insets determine available width; verify ES320 and ES390 reduced-motion text bounds after the correction. Normal hero's outer slot already computes its available width from insets.

Pricing source was also inspected at the pricing agent's request. It retains existing Hanken (`EvaHanken` via `.eva-site`), original service assets and editorial classes, three paid selectors and a separate free route. No source-only design blocker was found. Render watchpoints: translated selector labels at ES320, `Precio por confirmar` in the established restored-price role, and the 860px comparison table staying inside its keyboard-focusable scrollport.

## Actual candidate render review — first round

Reviewed actual production-built captures in this directory: EN1366 and ES1366 motion first screen; ES320 motion first screen and runner; EN390 motion runner; EN320 calm first screen; ES390 calm first screen and settled runner; ES320 motion/calm Alex; EN1366 motion Alex; ES320/ES390 standard pricing; ES320 enhanced pricing; EN1366 standard pricing; ES320 and EN1366 footer. Also inspected `render-report.json` across all twelve EN/ES ×320/390/1366 ×motion/calm profiles. These are emulated viewports, not physical-device tests.

**PASS — immediate choice and normal-motion hierarchy.** The light free action leads; the outlined panel action stays secondary and immediately available. Both are 44px high with retained 14px labels and 13px metadata. Before the runner appears, the offer sentence and navigation are already visible. At320, actions occupy x16–122 and x130–304; the two-line summary occupies x16–304/y713–761. At390 it occupies x24–366. Normal1366 retains the existing 184px/224px action widths and sentence at x48/y664. The runner, head clearance, dotted lettering and low action composition remain intact in the settled views. The report records visible/non-inert chains and successful hit tests before and after entrance.

**PASS — short bridge and Alex.** The paragraph is unboxed, readable, and adjacent to the retained Alex heading. The first concrete explanation is now ahead of collection/kit. The calm ES320 capture shows the correct settled2.1 value with fictional disclosure. The early motion capture is explicitly not settled numeric evidence; the parent is recapturing it after the existing DotNumber reveal. The later2.9 range proof remains a separate chapter in measured DOM order.

**PASS with capture limitation — paid selector.** In the inspected ES320/390 and EN1366 captures, all three paid options remain distinguishable, translated labels wrap within their cells, and the longer unconfirmed-price label stays readable. The standard and enhanced selected content has clear visual hierarchy. Element captures paint a white fixed skip link over text; this is not accepted as final viewport evidence. The parent will supply an actual selector viewport with focus artifacts removed. The same artifact appears in the ES320 footer element capture; an actual footer viewport is also needed for the final screenshot record.

**FIX — calm summary specificity.** Actual after-mount metrics and calm desktop images show `.calm-hero p` winning over `.hero-entry-summary`: phones become17px/23.8px, desktop20px/28px. The desktop paragraph becomes relative/in-flow, pushing the Spanish buttons to y788 and English to y816 rather than732; the paragraph touches the action row. The smallest fix is a scoped calm summary selector restoring16px/24px and absolute desktop positioning, with a matching phone selector restoring static positioning. The parent has been notified. This is a rendered CSS finding even though the twelve-profile harness currently reports pass.

The prior calm wrapper overflow and Space-key cancellation findings are fixed in the current source. Overall design verdict for this round: **FIX only the calm summary rule, then focused recheck**; normal hero/bridge/selector design does not need redesign.
