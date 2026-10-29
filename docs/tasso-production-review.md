# Tasso process production review

## Acceptance criteria established before implementation

This review concerns the existing homepage product scene headed “One small step” / “Un pequeño gesto”. A new detached text section alone does not satisfy the request. The animated scene must explain the service in three legible beats, with an equivalent readable presentation when motion is reduced.

1. **Business comprehension.** A viewer can identify home delivery and collection, a prepaid sample return, and results in two working days **after laboratory receipt**. Delivery time is not included in that two-day promise. The benefit is clear health insights, without invented clinical results.
2. **Device accuracy.** Images and actions match the manufacturer guidance verified by the research agent. No invented device mechanics, wrong body placement, device reuse, loose unprotected sample in an envelope, or unsupported “needle-free” / “painless” claim. A marketing overview must direct people to their supplied instructions for the complete procedure.
3. **Visual quality.** Product geometry remains authentic. The story uses deliberate framing, restrained typography and smooth transitions. Each beat presents a coherent composition at rest; arbitrary particles, unrelated stock clips and generated medical handling cannot substitute for clarity.
4. **Scroll behavior.** Forward and backward scrolling produces deterministic, readable stages. No trapped scrolling, blank transitions, abrupt jumps, clipped copy, overlapping adjacent scenes or navigation conflicts. Steps have enough stable space to be understood.
5. **Responsive readability.** Check desktop at 1440px and 1024px and phones at 390px and 320px. Essential text and timing qualifiers fit within the visible scene and remain clear over imagery. No horizontal document overflow.
6. **Accessible equivalent.** EN and ES contain the same essential facts. Reduced motion exposes all three steps without needing an animation. Decorative imagery is hidden appropriately; meaningful imagery is described. Existing page keyboard navigation still works, and hidden scene controls cannot capture focus.
7. **Implementation quality.** Existing runner and scene handoffs continue to work. Motion follows the existing scroll clock without a second time-based animation competing with scroll. Assets are bounded and sized, and the scene does not continuously rerender unrelated page content.

## Verification method

Review the final research and creative script, then run the actual static export in Chromium. Inspect rendered keyframes and adjacent-scene transitions in both directions. Save screenshots and measured visible text bounds. Exercise reduced motion and compare EN/ES factual content. A source-code or timing assertion alone is not a visual pass.

The reusable browser check is `scripts/check-tasso-process.py`; evidence will be saved outside the repository in `/workspace/eva-tasso-review`.

## Loop status

### Loop 1 — correction required

The root agent executed the judge-authored Chromium check against the fresh 107-route export. All nine automated cases passed: EN 1440×900, 1024×768, 390×844, 320×640; ES 1440×900, 390×844, 320×640; and EN/ES reduced-motion presentations. No tested runtime errors, document overflow, viewport-clipped step paragraphs, or paragraph/caption collisions were reported. Forward and reverse scroll were exercised.

The judge independently inspected the three desktop scenes and all three ES compact scenes in `/workspace/eva-tasso-review/loop-1`. Desktop delivery/collection, protected return, and contextual results are coherent, restrained and legible. The return illustration visibly contains a capped, labeled sample inside protection before the prepaid outer envelope. Results do not fabricate measurements or diagnoses; the two-working-day promise is visibly qualified by laboratory receipt.

One visual issue blocks an unconditional production pass: in `es-compact-440.png`, the report illustration exceeds its allotted art area. Its upper edge intrudes beneath the shared “gesto.” heading, and its lower note meets the “03 / COMPRENDE” step label. The essential results copy and timing remain readable, but the composition is visibly crowded. Automated paragraph bounds missed this because report lettering uses spans.

Correction routed to executor: reduce only the compact report illustration, preserving the essential copy, so it holds between the shared heading and step label with clear space. Root will expand the bounds check to report spans. Loop 2 should repeat EN/ES compact and a representative wider phone case if the CSS breakpoint is shared. No factual or desktop redesign is requested.

### Loop 2 — PASS

The executor scaled only the decorative report on short phone viewports. The root reran EN compact 320×640, ES compact 320×640, and ES phone 390×844 against the rebuilt export. All three passed, including the added check comparing the actual rendered report rectangle with the shared heading and active step-copy rectangles.

The judge independently inspected all three new results screenshots. The report now sits below the common heading and above the step label on both compact layouts. The essential results explanation, “2 working days” / “2 días laborables”, and laboratory-receipt qualifier remain readable. The taller phone retains its original generous report composition. Desktop, collection, return and reduced-motion presentations were outside this narrow CSS correction and retain their Loop 1 verification.

**Decision: PASS for the requested three-step marketing animation and publication in the separate review site.** No further correction loop is needed. Two of the maximum three loops were used.

## Evidence and scope

- Loop 1: `/workspace/eva-tasso-review/loop-1/browser-report.json`, nine successful browser cases; judge inspected the desktop sequence, laptop results, EN/ES phone results, all ES compact shots, reverse scroll, neighboring-scene handoff and reduced-motion presentations.
- Loop 2: `/workspace/eva-tasso-review/loop-2/browser-report.json`, three successful focused regression cases; judge inspected `en-compact-440.png`, `es-compact-440.png`, and `es-phone-440.png`.
- Physical-use accuracy was compared with `tasso-process-research.md` and the current manufacturer instructions linked there. The official product photograph is sourced; the retained real in-use photograph is visually consistent with those instructions, while its exact original online URL remains unverified.
- The current EVA turnaround and prepaid-return model are owner-provided business facts. This browser review does not test laboratory operations or validate a guaranteed turnaround. The animation remains an overview and directs users to the instructions supplied with their kit.
- Browser coverage is Chromium with desktop and mobile viewport emulation, including reduced motion. It is not a claim to have tested every physical device or browser engine.

The user authorized at most three total review loops. Corrections will be routed to the research, creative or execution agent responsible. Remaining issues after Loop 3 must be reported rather than silently approved.
