# v70 precise owner edit — UX optical recommendation

Scope: preserve the slim v69 instrument and apply the owner's specified edits only. This is a source-informed recommendation; no application source edits or publication were performed. The medical lead is separately checking the new laboratory-reference provenance.

## Fixed content and geometry

- Independent example: **2.9 / 2,9 mg/L**, not 3.2.
- Laboratory label: **Lab’s reference range**, with the bilingual specialist's corresponding Spanish label.
- Laboratory cutoff: **<3 mg/L**.
- Lower-relative-risk category: **<1 mg/L**, unchanged.
- Display domain remains **0–5 mg/L** on both rows.
- Exact sample coordinate: **58%**. Lab endpoint: **60%**. Lower-category endpoint: **20%**.
- Keep the named **review-if-persistent >2 mg/L** annotation. Remove the requested recommendation prose beneath it; let the resulting footer/panel shrink naturally with no reserved empty space. Do not alter unrelated source access, outer qualification or free-upload action.
- Retain two dot rows, 28px plot slots, 14px ring/4px core, current type sizes, material and grouping.

The upper bright span becomes three times the lower span, rather than five times. Recompute strict dot membership from the actual cutoff: with 55 columns and two rows, <3 lights columns 0–32, or **66 of 110 dots**; <1 remains **22 of 110**. Exact endpoint strokes remain the authority rather than rounded dot counts.

## The near-cutoff overlap is truthful

At a 236px plot width, the sample is only **4.72px** left of the lab endpoint. The 14px sample ring therefore overlaps the boundary's horizontal position. That is a consequence of the real numbers, not a reason to move the marker or change the domain. A large optical gap would falsely suggest the example is farther below the cutoff.

The current endpoint stroke is y=5–23 and the ring is centred at y=14 with a 7px radius. Drawing the ring above the boundary will hide its middle, leaving only short outer portions. Improve those portions rather than altering quantitative coordinates.

## Recommended minimal optical fix

**Keep the lab endpoint at exactly x=60%, draw it behind the ring, and extend that one boundary from y=2 to y=26 within the unchanged 28px plot.** Use the existing thin stroke, with a modest opacity increase to approximately .65 so its protruding top/bottom parts stay visible against the glass.

The ring remains at x=58%, y=14 and keeps its opaque dark face, outline and central core. At the narrow example width, its circular silhouette masks the boundary through the centre, while roughly 6–7px of the taller endpoint remains visible above and below the circle. These aligned pieces make the exact cutoff visible without slicing through the sample core or suggesting a new value.

Keep the ordinary 2.9/2,9 shared-axis label at the marker position. Continue omitting the nearby integer 3 to avoid a crowded label pair; the explicit <3 cutoff above the track identifies the limit. Do not add another floating 3, leader arrow, halo, animation, or badge.

This is a bounded collision treatment for the close sample/limit pair. Other interval boundaries can retain y=5–23; there is no need to redesign the ruler. If root prefers applying the same 24px endpoint height to both upper boundaries for consistency, the data coordinates must still remain exact, but a whole-chart change is not required.

## Rejected fixes

- Moving the sample left or the boundary right creates false numerical distance.
- Shortening the bright interval to avoid the ring changes the stated range.
- Shrinking only the upper sample ring implies two different marker roles and weakens the same-result comparison.
- Drawing the cutoff over the sample's central dot makes the marker harder to identify.
- Changing the common scale to magnify the 0.1 difference would exceed the owner's precise scope and make the two comparisons less directly comparable with v69.

## Render gate

Inspect actual EN desktop and ES 320/390/768 after the edits. The near-cutoff sample should visibly remain within the lab reference while the cutoff itself stays identifiable above/below the ring. Verify actual point and endpoint centre coordinates, not merely bounding-box non-overlap. Confirm strict membership, the 2.9/2,9 label, the unchanged <1 row, no cutoff-label collision, and no blank footer space after the recommendation removal.

This is an optical precision fix within the accepted slim visual system. No new design concept or broader copy compression is proposed.
