# v70 candidate UX preflight

**Verdict: approve this candidate for native verification.** The precise owner edits fit the existing slim instrument. No further design change is needed before checking the native render.

Inspected the rendered candidate images `candidate-en-1366-section.png`, `candidate-es-320-section.png`, and `candidate-es-768-section.png` in this directory. This is an expert visual assessment of those captures, not owner acceptance or a human usability study.

## Requested changes and visual result

The example reads 2.9 / 2,9 mg/L. The upper row now reads “Lab’s reference range” with <3 mg/L; the second row retains the scoped lower relative cardiovascular-risk category with <1 mg/L. Both share the visible 0–5 scale. The upper bright span visibly ends shortly to the right of the sample, while the lower bright span ends well to its left. This preserves the actual range comparison that the owner requested, including the truthful proximity of 2.9 to 3.

The lab endpoint is legible at 320px despite the ring overlapping its middle. Its extended top and bottom portions remain visible at the true cutoff, and the sample core remains clean. This is a successful optical treatment: it distinguishes the nearby cutoff without moving the sample, lengthening the interval, or adding a second symbol that could be mistaken for another result. At desktop and tablet the separation is easier to see. The exact positions and SVG extent are implementation facts supplied by root; the screenshots independently support their intended visual reading.

The slim two-row dot fields and small rings retain the incumbent dashboard visual family. The bright interval and faint continuing field still communicate different lengths. The warm white marks, restrained glass, and editorial heading remain coherent; this is a bounded refinement of v69 rather than a new concept.

## Spacing, copy, and mobile

Removing the entire review/repeat footer, including its hairline, improves the panel’s ending. The category scope note now closes the glass naturally, with enough bottom padding and no vacant footer-shaped space. The independent lab-variation/no-diagnosis note, sources disclosure, and upload action remain outside the panel.

At 320px the lab label wraps to two lines without colliding with <3 mg/L. Both conclusions remain readable. The category note wraps comfortably, all content stays inside the glass, and the shorter panel has a clearer visual rhythm. At 768px the broad instrument uses the available width appropriately. The desktop composition remains balanced between the heading/action and the glass.

The dotted decimal remains subtler than ordinary typesetting, an existing property of this display face. The clear localized 2,9 axis label provides a second unambiguous reading. It is not a blocker in these captures.

## Scope and remaining verification

The clinical provenance of <3 is reported as confirmed by root/CMO against the Valley source; this UX review does not independently validate that literature. The ordinary text still avoids a universal “optimal” claim and distinguishes this hs-CRP category from overall risk.

Native geometry, text bounds, contrast, localization, and no-JavaScript checks remain the final implementation gate. No UI edits were made for this review. Do not restore the removed recommendation/footer or introduce additional ornament to resolve the intentional near-cutoff overlap.
