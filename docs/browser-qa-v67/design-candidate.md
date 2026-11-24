# v67 aligned-level candidate — independent design critique

Inspected `candidate-en-1366-section.png`, `candidate-es-390-section.png`, `candidate-es-320-section.png`, and `candidate-es-768-section.png`. These are rendered preflight candidates, not final native images.

## Verdict

**The core requirement is now visibly met; refine before shipping.** The 0–5 and 0–1 fills are immediately different in length, share a consistent axis, and the same vertical mark lies inside the lab reference and outside the lower-risk category. At 320px that difference is still unmistakable. The two interrupted cursor segments line up without obscuring the intervening labels; no right-of-2 shaded band reappears. The incumbent smoked glass and dot numerals survive, and the material reads as an instrument rather than two prose rows.

The key remaining weakness is that the little cursor is **not explicitly identified as the example** in the chart itself. The number in the header is spatially detached, and a cold viewer could reasonably read the two white crosshairs as generic calibration marks rather than the 3.2 result. This is a material communication issue despite correct geometry. Add one compact direct label such as `Example 3.2` / `Ejemplo 3,2` associated with the cursor at one track, or a clear thin visual leader from the single result to the common cursor position. Keep the header's dot number dominant; a small contextual label is a pointer legend, not a second display. Check it at 320 so it does not collide with integer ticks, threshold labels, or conclusions. A continuous line through all copy is not required.

## Batch polish

1. At 320 the panel is tall and the 24px solid tracks feel disproportionately heavy; try 14–16px tracks with identical quantitative width and distinct cutoff markers. This will reduce the visual slab effect and gain a little space while retaining conspicuous 5:1 length contrast. Keep text at the specified 14px label and 16px/24px body floors; don't shrink the chart horizontally.
2. Tighten the generous gap between header and first track and reduce vertical space between each conclusion and the next track by a few pixels. Keep enough clear space around the cursor and its direct identification. The 390 and desktop versions have enough breathing room; avoid mechanically squeezing every viewport.
3. At 320, the lab and lower-risk labels each break into two lines while the right-aligned cutoff drops visually to their second line. That is legible but feels accidental. Top-align each cutoff with its label or put the threshold in a predictable second line on both groups. Maintain the same left and right plot edges; do not increase text density.
4. The green-tinted short segment currently reads as a positive/safe zone, consistent with the requested lower-risk category but potentially stronger than the category's actual claim. Keep its direct “relative” and hs-CRP qualifier visible, use the medical judge's wording, and cold-test whether visitors infer a universal optimal target. If that inference is strong, soften the green toward the existing warm/pale palette without obscuring the visibly short range; do not swap meaning into a disclosure.
5. The axis is useful and its integer labels are legible at the rendered phone sizes. The tiny sample cursor sits between 3 and 4, as it should; make its 3.2 identity explicit rather than adding a crowded eighth axis tick. Keep the dashed endcaps visually precise and distinguishable from the solid sample cursor.

## Strengths and limitations

At 768 the instrument is broad and orderly; at 1366 it has a strong chapter-level role, though the dotted value is smaller than the bars in visual weight. The concise statements and the >2-if-persistent footer have distinct jobs. `Categoría según hs-CRP; no indica tu riesgo global` is important context and should not be cut simply to save height. The footer remains an action, not a third filled zone.

After this batch, inspect native EN/ES at all four sizes, confirm painted contrast across both bar fills and cursor, and request medical and cold-image reviews. Aesthetic inspection alone cannot establish the source's intended lower-risk category or prove a reader understands the chart.
