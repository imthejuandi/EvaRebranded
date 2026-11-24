# v68 design — EVA dashboard level instrument

Reviewed the actual implementations: `DashboardPage.tsx` `CapsuleRange` and `dashboard.css` (5px translucent rail, interval overlay and white position indicator); `ExecutiveReading.tsx` `EvidenceRange` (55 columns × 4 rows, larger/brighter dots inside the interval, fine boundaries and an outlined circular measurement point); `BiomarkerGallery.tsx` and `app/biomarker-glass.css` (two range rows, thin rails and a vertical value marker); and `BiomarkerPage.tsx` `MeasurementInstrument` (halftone interval, fine calibrated ticks and a ringed value). Also inspected the existing glass reference image and prior actual landing range captures. The older landing capture is evidence of material, not a medical or numeric reference for this revision.

## Select: ExecutiveReading's dotted evidence ruler

Use **EvidenceRange's 4-row dot-matrix, fine interval boundary and ringed point** as the defining visual treatment, applied to the two-row comparative structure already present in the BiomarkerGallery range view. This is the strongest incumbent: it makes the range itself out of EVA's analog-light language, ties the result to a precise ringed point, and complements `DotNumber` without imitating a generic health bar. CapsuleRange and the landing gallery are faithful but their 5px solid strips would be a much quieter, less distinctive version of v67's rectangles. MeasurementInstrument has beautiful half-tone and calibration but its large filled field and taller plot would crowd two explanations on a phone; its measurement cursor and purposeful ticks remain useful precedents.

## Exact instrument

Retain v67's header, one dotted 3.2 / 3,2 mg/L example, two independently named comparisons, direct conclusions, hs-CRP/overall-risk qualifier, and separate >2-if-persistent action. Preserve the existing glass, rim, purple and amber reflections and surrounding landing layout.

Use two **aligned horizontal dotted fields** on one common illustrative **0–5 mg/L** scale (the same domain as the hs-CRP fixture):

- Lab reference `<5 mg/L`: brighter four-row dotted interval from 0 to the strict boundary at 5. The ringed 3.2 sample lies at **64%** of the width, visibly inside.
- Lower relative cardiovascular risk category `<1 mg/L`: the same four-row field but bright dots only from 0 to the strict boundary at 1 (**20%** of the width); quiet, smaller background dots continue from there to 5. The exact same ringed sample lies at **64%**, visibly outside the brighter interval.
- Neither track receives a coloured fill to the right of a threshold. Both intervals are encoded with the same warm-white dot language; differentiate their meanings with the explicit row names, not green ‘safe’ colour. A category is an association, not an individual diagnosis or treatment target. The endpoint 5 is the *display limit*, not a claim that the biology ends there; communicate the strict `<5` in the label and display its boundary accurately at the edge.

Each row uses a roughly 28–34px high four-row matrix, restrained bright dots in the represented interval and quieter dots outside it. The source uses 55 columns and dot radii 1.7 versus .8; adapt screen geometry so the pattern remains perceptible on a 320px phone without enlarging gaps so far that the short 0–1 interval vanishes. Calculate x positions from the numeric scale, never from a dot count rounded to an approximate boundary. Draw a thin boundary at 1 or 5 and use a **ring with a central point** at the exact sample x, taking the `EvidenceRange`'s focused-instrument silhouette. Keep the ring filled with the local dark glass backing so the dot field cannot obscure its centre. The mark is a result, not a destination. If the ring's footprint obscures the <1 boundary at small widths, adjust diameter or padding, not numerical position.

Align both sample rings with the same 3.2 value on the shared axis; keep a bold `3.2` / `3,2` at its true x to identify the mark, with integer 3 suppressed to avoid collision. Axis endpoints 0 and 5 and useful integer ticks 1, 2, 4 may stay; they should be genuine calibration, not decoration. Use 14px labels and 16px/24px explanatory text; no dashboard source's 9–12px metadata sizes or synthesized 300/500 weights. The visible direct labels `<5 mg/L` and `<1 mg/L` and explanations remain adjacent to each row, so chart interpretation never depends on source disclosure. The matrix can be decorative for assistive technology only if equivalent, precise text and the strict comparisons are already exposed.

## Layout and responsive decisions

Keep labels above each plot, conclusions immediately below. Desktop uses full glass width; about 20–24px between row groups and 16–24px before the separated action footer. At 768 retain the existing stacked outer section with wide glass. At 390/320 let long Spanish labels wrap and keep the plots full width and aligned; the threshold can wrap as a unit but do not move it to a position suggesting an x coordinate. Keep one scale below both plots. Let the panel grow naturally, but reclaim space by replacing v67's 24px blocks and excess air, never by shrinking essential copy. The rings and bright-vs-dim matrix should remain discernible in a static reduced-motion screenshot.

Keep the example visually singular: the large dotted header is the readout; the smaller 3.2 axis label identifies its exact location rather than serving as another result. Use no animated counting, scanning or measured-value motion. An optional ≤500ms whole-panel entrance is acceptable only with all meaning present initially.

## Tests that decide whether this works

- Squint at EN desktop and ES 320: are the *actual* 0–5 and 0–1 lengths instantly different, and can a viewer trace the ring to the sample label? If the brighter field looks like decoration instead of an interval, increase dot/contrast distinction or restore a subtle continuous underlay constrained to exact interval bounds; do not revert to full-width uniform dots.
- A short category should not look like a universal target; ask cold readers what it means and rely on the medical reviewer to verify the lower-relative-risk wording and its source. The threshold >2, only if persistent, remains in text—not an illustrated optimal range.
- Validate exact common-domain geometry, strict cutoff position, text/graphic contrast against the glass, EN/ES 320/390/768/1366 and zoom, focused state, source/build identity, and static/calm/reduced motion. Look at native screenshots, not only source or a detector. 
