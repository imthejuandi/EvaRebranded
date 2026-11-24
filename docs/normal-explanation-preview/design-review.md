# Visible explanation preview — bounded design review

## Final rendered design verdict — PASS for owner preview

The exact saved explanatory pair has now been rendered and inspected. **No further CSS, placement, or copy-density change is required for this preview.** This supersedes the earlier NOT VERIFIED status for the inspected visual properties; the pre-render guidance below is retained as the review record.

### Exact evidence and scope

Visually inspected `en-1366-section.png`, `es-1366-section.png`, `es-320-section.png`, `es-768-section.png`, and `en-1051-section.png` in this directory. Also read `render-report.json`: base commit `788cae34151ece3ba592d2de9f2dad8c3a4c3289`, with candidate file hashes recorded there. The production-built candidate HTML/CSS/JS was rendered through Playwright local-file request fulfillment after the managed preview timed out. This is a rendered preview, not a published Site or a new native release. No alternate HTTP server or live publication is claimed.

### Actual visual findings

- **Hierarchy and placement PASS.** The paragraph sits naturally beneath the heading on paper. It supplies the reference-population explanation before the example, rather than making the viewer open Sources and context. The glass remains the strongest visual object; the prose has not migrated into it or become a competing card. The reading order is clear.
- **Desktop composition PASS.** EN1366 is five lines; ES1366 is six. The longer story moves the heading up, as expected from the existing grid, and the action remains grouped below the text. Spanish retains its existing three-line heading; no new heading-rule adjustment is needed. The prose and graph balance without forcing identical vertical alignment.
- **1051px grid PASS.** The English paragraph wraps to six lines in the narrower story column. The CTA stays comfortably below it, the glass remains wide enough to explain the two ranges, and neither side feels squeezed or detached. Do not change the breakpoint or alignment to fix a problem that is not visible in this render.
- **ES320 density PASS, with an explicit tradeoff.** The paragraph takes nine lines (216px). It is a substantial addition compared with the old one-line caption, but its 16/24 rhythm remains comfortable and it reads as one bounded explanatory passage. The mechanism, qualification, and EVA benefit remain visible. There is no isolated one-word tail, clipping, or competing emphasis. The longer scroll is justified by the owner's explicit request to explain the point. Do not shorten away the mechanism, reduce type, or fill the glass with this copy to recover the former height.
- **Tablet PASS.** At ES768 the six-line prose measure stays editorially readable, followed by the full-width glass. The deliberate blank paper to the right of the paragraph is preferable to a long full-width prose line. The 24px group spacing connects explanation and illustration without crowding them.
- **Instrument and ending PASS.** The two slender dotted ranges are visibly preserved. The example remains just within the lab cutoff and outside the lower-risk category; the near-cutoff endpoint remains visible around the ring on ES320. The recommendation footer remains absent, with the category note closing the glass. Sources and the action remain distinct below/outside it.

### Supporting checks and limits

The supplied report records nine passing profiles with no overflow failures, Hanken400 at16/24 for the paragraph,46ch maximum measure,16px heading gap,`pretty` wrapping, and6.4:1 paragraph contrast. It also records unchanged28px tracks,14px rings,58% sample positions,60%/20% cutoffs, and66/22 active dots. Focus and keyboard disclosure checks are reported passing. These are supporting measurements; the judgment above comes from the five inspected screenshots.

The report includes a calm profile and a reduced-width200%-reflow proxy. Do not call that proxy browser-chrome zoom or physical-device testing. This review is not independent medical approval, owner acceptance, or human usability research. The separate independent judge should still return its own verdict against all saved criteria. No UI edits or publication were made by this reviewer.


## Earlier pre-render record: guidance PASS; then-unrendered properties NOT VERIFIED

Reviewed current `AGENTS.md`, `docs/AGENT_REVIEW_WORKFLOW.md`, the exact final pair in `docs/normal-explanation-proposal.md`, and current range component/styles. Applied the incumbent Impeccable layout/typeset principles: preserve identity and topology, group explanatory text with its heading, use readable prose measure, allow natural localized height, and judge rendered hierarchy independently of mechanical checks. This phase authorizes a preview only. No publication or UI edits by this reviewer.

The final Spanish pair includes “a un menor riesgo”, “esa diferencia en lenguaje sencillo”, and “tu historial de salud”. Use the saved proposal, not earlier agent-message variants.

## Smallest proposed styling change

Replace the text in the existing `.range-proof-caption` paragraph. Keep its existing 16px heading gap, muted ink, body-size and body-leading tokens. Change its maximum measure from 34ch to 46ch and add `text-wrap: pretty`. Explicit `font-weight:400` and `letter-spacing:normal` are appropriate if needed to guard against inherited global styles; no new font or weight is needed.

Keep a normal block with automatic width, zero bottom margin, and natural height. A 46ch `max-width` is a ceiling, not a fixed width: the existing story column should constrain it on phones. Do not add a 46ch `width`, a minimum width, a fixed height, manual line breaks, text clamping, or a new wrapper card. Do not duplicate the old short caption beneath it. No default strong/emphasis is needed inside the paragraph.

Preserve `.range-proof-layout` and its current breakpoint topology. Desktop retains story/action on the left and evidence on the right; tablet and phone retain story → evidence → action. Preserve the 16px phone and 24px tablet group gaps. The existing CTA, glass dimensions, plot fields, source disclosure, category note, and all numerical positions stay unchanged.

## Current styles that need attention in the render

1. **The existing 34ch maximum would make the new paragraph needlessly narrow.** Update that exact caption rule, rather than layering a second paragraph with separate margins. At 320px the available story width is already about278px, so raising the maximum will not magically make the phone paragraph wider.
2. **Desktop story alignment is `align-self:end` in the first row of a two-row grid.** Longer copy can move the heading upward relative to the glass. That is expected, not proof of a defect. Inspect the combined heading/paragraph/action group at1366 and the1051px transition before adding any offsets. Do not pre-emptively center or top-align everything.
3. **The evidence spans both desktop grid rows.** Copy growth may redistribute the story/action row heights. Check that the action still belongs to the left story and does not collide with it or drift into an obviously detached region. Use the existing grid gap first; no absolute placement or viewport-height compensation.
4. **Phone evidence has negative8px horizontal margins.** Its deliberate wider edge should remain distinct from the paragraph’s text edge. Do not make the explanatory text follow the glass overflow or expand it to the rounded rim to gain a few characters.
5. **Tablet will have a shorter prose measure than the broad glass.** This is a readable editorial column, not an alignment failure. Do not stretch the paragraph across the entire tablet width simply to match the instrument.
6. **The H2 has explicit phrase breaks, max-width limits, and balanced wrapping.** Changing the paragraph must not change those rules. Verify the title after fonts load and in Spanish; avoid solving paragraph height by shrinking the headline.
7. **`pretty` is progressive, not a guaranteed line-count tool.** A natural two-word ending is fine. Do not remove “Many/Muchos”, “apparently/aparentemente”, or the reference-population mechanism to eliminate a short final line. Content truth outranks a cosmetic text edge.
8. **The longer story naturally pushes the instrument down on mobile.** Showing less of it in the first viewport is acceptable if the narrative is clear. Do not shrink16/24 body type, squeeze the28px plot, or hide copy to preserve the old section height.

## Render acceptance gate

Inspect the same exact candidate in EN and ES at320,390,768,1366 and at the1050/1051 breakpoint when practical. The visual reading order should be headline → complete explanation → real comparison. Check the explanatory mechanism is visible without opening disclosure, the paper-backed paragraph feels like one editorial block, and the instrument remains the strongest visual object.

Verify installed Hanken400 at16/24, visible text contrast, paragraph/text bounds, absence of horizontal overflow, and reflow with text enlargement. Confirm the graph remains the v70 two-row dot instrument: common0–5 scale, sample2.9/2,9 at58%, lab<3 at60%, lower category<1 at20%,14px ring/core4 and clear nearby cutoff caps. The recommendation footer must remain absent. Check current action/source functionality if any DOM changes affect them; a text-only paragraph needs no animation.

No averaged aesthetic score can excuse missing mechanism, incorrect medical scope, misleading numeric positions, translation drift, or clipped prose. This reviewer will give a bounded rendered verdict once screenshots are supplied. The independent judge should evaluate the saved criteria separately; no prior agreement should substitute for its own inspection.
