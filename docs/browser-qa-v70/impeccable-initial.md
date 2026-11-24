# v70 independent Impeccable initial assessment

Reviewed the v69 `RangeProofSection.tsx` and `range-proof-section.css` plus the native v69 images. This is a narrow edit to the existing slim dashboard instrument, not a redesign; no detector was run.

## The optical collision

On the unchanged 0–5 scale, 2.9 is at 58% and the strict <3 boundary at 60%. At 320px their centres are only about 4.7px apart, while the existing sample ring is 14px wide. Its dark backing therefore covers part of the boundary; shifting either mark horizontally or changing the axis to make them appear further apart would misrepresent the data.

Use the smallest coordinate-safe correction: **keep the ring centre exactly at 58% and the cutoff exactly at 60%, but make the upper/lower ends of the lab boundary visible beyond the ring's vertical footprint.** For example, render the boundary as two short aligned hairline ticks above and below the ribbon/ring, with sufficient vertical clearance; the core may pass behind the ring. This preserves the exact x coordinate and communicates that the ring lies just inside the boundary without drawing a false horizontal displacement. Keep the lower-risk track's existing ring/boundary treatment unchanged unless a shared component requires consistent tick geometry. Inspect the true 320 native render: the two values are legitimately very close, so the direct text “within reference” and `<3 mg/L` must remain adjacent and unambiguous. Do not shrink the ring or type merely to manufacture separation.

## Typography and composition

Use the owner's exact English label **“Lab’s reference range”**, with its natural localized Spanish counterpart as provided by editorial. Maintain task labels ≥14px and body 16px/24px, Hanken 400/600, Georgia italic and the same dots/glass. The new 2.9 / 2,9 header and axis label must match; suppress the neighboring integer 3 if it collides, as the v69 scale already does with the neighboring sample. At 320, allow the longer lab label to wrap rather than forcing the cutoff or shrinking type.

Remove the entire review/repeat footer and its separator from the visible instrument as requested. Let the glass height collapse naturally; keep the hs-CRP/overall-risk qualifier with the chart and give it a considered 16–20px bottom inset so the last line does not press into the curved rim. Keep context and source access outside the glass readable. No compensating ornament or empty footer is needed.

## Verification

Inspect EN and ES native 320/390/768/1366 at 1× and zoom, particularly the 320 lab ring and cutoff; check their actual painted x coordinates and that the cutoff's visible ticks survive the ring. Verify text bounds, contrast, source links, no-JS/static state and direct comparisons. Confirm medical evidence and any retained context separately: this assessment is about visual hierarchy and does not validate the new lab limit.
