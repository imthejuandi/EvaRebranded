# v69 independent Impeccable initial direction

Reviewed `.impeccable.md`, local Impeccable layout/typeset guidance, `RangeProofSection.tsx`, `range-proof-section.css`, and the native v68 EN 1366 / ES 320 / ES 768 captures. This is a source-and-image critique before implementation; no detector was run.

## Diagnosis

v68 is recognizably the dashboard's dotted instrument and preserves the meaningful difference between its intervals. But four tightly stacked dot rows in a 48px field look like two broad perforated strips, especially at 320 where the dots merge into a dense fabric. The 20px ring reads as a heavy target pasted over each ribbon. The dots now compete with the dotted 3.2 header instead of supporting it. The lower outside field is also extremely faint, so the second ring can look detached. A slimmer treatment should reduce visual mass without making the range boundary or sample depend on a barely visible texture.

## Bounded design proposal

- Retain the existing 55-column dashboard-derived grid, but reduce the matrix to **two rows** with about 5–6px vertical centre spacing, inside a **24–28px-high** plot box. Use restrained round dots: approximately 1.3–1.5px radius inside the interval and 0.7–0.8px outside, then tune from actual phone renders. Two rows should feel like a thin luminous ribbon, not a field or heavy band. Dot placement remains derived from the existing scale and strict numeric comparison; preserve the exact endpoint line rather than rounding it to a dot column.
- Give out-of-range dots enough visibility to suggest a continuing calibrated domain. If the dim field still disappears on native 320, lift its opacity slightly or add a fine, low-contrast baseline underneath both rows from 0 to 5. The latter denotes the shared axis only; it must not be bright enough to read as another range. Bright interval dots must remain clearly distinguishable from the rest.
- Replace the 20px ring with an authored **12–14px outlined circle**, 1px warm-white rim and approximately 3–4px centre point. Give it a dark local backing, centre it precisely on the ribbon, and keep the same 64% x in both rows. The ring should identify the measured example, not look like a large target or an interactive handle. Inspect at 1× and 320: do not shrink until the centre vanishes.
- Keep the whole scale common at 0–5, the lab interval at 100%, the lower-risk interval at 20%, and the sample at 64%. Preserve the bold 3.2 / 3,2 axis identifier at that exact x, avoiding collision with integer 3. Both direct row labels, strict `<5` and `<1`, explanations, hs-CRP caveat and separate conditional review remain visible. No new medical implication or colour zone.

## Type and spacing

Keep Hanken 400/600 and Georgia italic, ≥14px labels and 16px/24px body. Keep the readout unmistakably primary and retain the generous header-to-first-row breathing room. Give the row label and thin ribbon a small 4–8px relationship, then a 4–8px relationship to its conclusion; preserve 16–20px between distinct comparison groups. When the plot box loses ~20px, spend part of that space on clearer grouping instead of compressing all text into a tight list. The footer's existing hairline and 16px separation should remain; it is a different instruction, not a third interval. At 320 allow Spanish labels to wrap and keep cutoff values legible; no fixed-height clipping or scale changes. At 768 retain the wide stacked outer layout.

## Render acceptance

At desktop and 320/390, the dotted interval widths and aligned sample must survive the squint test, while the field should read materially thinner than v68. Verify that both boundaries, the lower ring and 3.2 axis identity remain legible on the actual dark glass, and that no text or point overlaps at supported widths. Retain no-JS and calm/reduced-motion static geometry. Painted contrast and medical/cold-reader reviews are separate gates; no clean detector or screenshot alone establishes comprehension.
