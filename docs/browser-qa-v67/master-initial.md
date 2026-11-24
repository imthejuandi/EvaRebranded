# Master initial direction — actual level comparison v67

## Reset the acceptance criterion

The owner's rejection is decisive. V66's relay communicated shared provenance, but it did not show levels or the actual breadth of the compared ranges. Our previous design passes did not establish owner acceptance and must not be used to defend that mismatch. The new requirement is a real quantitative range comparison. Earlier local bans on axes and bands are superseded for this requested change.

I reread the current component and bilingual copy. This is a proposal for root to implement after the medical lead verifies the newly introduced <1 category. I have not verified that new source independently and do not approve calling it a universal optimal target. No source edits or publication were performed.

## Selected concept: two calibrated range windows, one result

Use two aligned horizontal 0–6 mg/L tracks, with the exact same x-origin, width, tick spacing and direction. The upper track shows the documented laboratory reference from 0 up to 5. The lower track shows the medically verified lower-risk category from 0 up to 1. One fixed white marker at 3.2 crosses both tracks. This makes the requested comparison visible: the sample is within the broad lab reference but to the right of the narrower lower-risk category.

This is not another diagram of two questions. Its lengths and positions encode quantities. At a glance, the lower marked range must be visibly one fifth the breadth of the upper marked range. A viewer should not need the labels to discover that the two spans differ substantially; the labels explain what those spans mean.

### Exact numerical geometry

For plot width W and left edge X:

- Domain 0: X.
- Lower-risk endpoint 1: X + W/6 = 16.6667%.
- Review-context value 2: X + W/3 = 33.3333%, if mentioned in text; do not introduce another filled range.
- Fixed example 3.2: X + 0.533333W = 53.3333%.
- Lab endpoint 5: X + 0.833333W = 83.3333%.
- Display-domain end 6: X + W.

The 6 is a display endpoint, not an assay maximum or health limit. Use a unit label mg/L on the shared scale. At 320px with a 250px plot, the lower band is approximately 42px wide, the upper band 208px, and the sample 133px from the origin. That is enough geometry to read an actual narrow range; do not inset the short range with a minimum width that distorts the ratio.

## Exact visual recommendation

- Preserve one smoked-glass enclosure, warm/purple reflections, Hanken 400/600, existing dotted sample and warm-paper surroundings.
- Keep the hs-CRP/example identification and one dominant dotted 3.2/3,2 mg/L above the plotting area. The graph then fills the usable panel width; do not give half its width to a decorative result bay.
- Each track is a visible, modestly thick range window, approximately 24–28px high on desktop and 20–24px on phone. This is deliberately more substantial than a thin neutral ruler. It must visually show a span, not merely endpoints.
- Draw a subdued full-domain track from 0 to 6. Overlay a warm pearl fill from 0 to <5 in the lab row and a muted pearl/sage fill from 0 to <1 in the lower-risk row. Use enough luminance difference that the short band remains obvious at phone size. Keep the unmarked remainder quiet and uncolored.
- Use precise end caps at 1 and 5, with strict < labels nearby. Do not make the shaded domain extend beyond those endpoints, round it into an ambiguous blob, or draw a glow that changes the apparent interval.
- The sample is a thin white vertical cursor at 3.2 with small matching white intersections on both tracks. It remains in exactly the same x-position in both. Do not move the sample toward the narrow band or color it red. One sample label identifies that line; do not create two equally dominant sample numbers.
- Draw one shared numeric scale below the two tracks: 0, 1, 2, 3, 4, 5, 6. These are real calibration marks, now semantically justified. Stronger endpoint caps at 1/5 may support exact reading; do not add intermediate decorative ticks beyond useful calibration.
- Keep range names outside the colored spans. The <1 span is too narrow for a full label. Place each row name above/adjacent to its track and its numerical cutoff on the opposite side; do not let the 3.2 cursor cross words. On phone, either leave the marker's joining portion absent through label rows while keeping both track intersections exactly aligned, or reserve a clear central cursor lane. Do not obscure labels with a continuous line merely to prove continuity.
- If needed, a brief ordinary-text sample label directly above the cursor can tie it to the dotted readout without repeating 3.2 in each row. Avoid a tooltip, hover dependency or second major badge.

The plot should be the central visual artifact. Do not put the tracks beneath two long explanation paragraphs or make them tiny accessories to another text table.

## Labels and medical truth boundary

The owner's desired 'normal versus optimal' contrast should be answered visually, but newly sourced lower-risk evidence must retain its actual medical meaning. Pending the medical lead's verification, a useful label pair is **Laboratory reference / Referencia del laboratorio** and **Lower cardiovascular-risk category / Categoría de menor riesgo cardiovascular**, with clear <5 and <1 mg/L cutoffs. The bilingual specialist can shorten visible row names while retaining the precise full meaning immediately nearby.

Do not silently rename <1 'optimal for everyone', a treatment goal or proof of cardiovascular safety. A lower-risk category can support the requested narrower favorable-level comparison without inventing that stronger claim. If the verified evidence cannot support <1 in this context, root must revise the specific medical threshold rather than substitute another nonquantitative relay.

The sample's two spoken conclusions can be concise: within this lab's reference; above the lower-risk category. The lower row does not classify every value outside <1 as high risk. Therefore leave 1–6 neutral rather than painting it amber/red.

Retain the European >2-if-persistent threshold as visible review context and the repeat-when-well/overall-risk action. Keep it out of the favorable range fill. Do not add a third competing track or fill the region >2; that is the precise geometric failure rejected in v63. The <1 category and >2 conditional review modifier are different pieces of evidence and must not be collapsed into one threshold.

## Independent stress test of this proposal

- **Does it satisfy the actual owner request?** Yes in principle: real range lengths and one positional sample are drawn on a shared axis. Acceptance now requires the rendered ranges to be visually dominant and unmistakable.
- **Can the old v63 error return?** Yes, if the lower fill is accidentally placed to the right of a cutoff or if a glow encloses the sample. The favorable category must occupy only the leftmost 0–1 segment.
- **Can the bars look like progress bars?** Yes, if the shared scale or sample cursor is omitted. Preserve both; no arrows, percentages or completion language.
- **Can the short band disappear on mobile?** Yes, if it is too transparent or the plot gives excessive width to labels. Preserve a wide plot and a substantial range height, with ordinary labels outside the fill.
- **Can the marker look like a goal?** Yes, if it uses a bullseye, pin or destination arrow. Use a neutral white cursor tied to the explicit example readout; no trajectory or animation toward it.
- **Can the chart overstate risk?** Yes, if sage means universal safe health or the unfilled area means disease. Use the sourced category name and neutral remainder; retain overall-risk context.

## Motion and actual-render gates

All range fills, numerical ticks, cursor positions and labels must be complete at first paint. Prefer no chart animation. A brief material entrance is acceptable; no expanding bars, count-up, moving cursor or threshold sweep. Normal/calm/reduced-motion views must show identical quantities.

The next actual render will be judged first against the owner's request: can a newcomer immediately see the broad laboratory range, the narrower lower-risk range, their exact numerical ends and the same 3.2 result relative to both? Only then judge craft, copy, mobile, contrast and motion. A safe but nongraphical explanation will fail this new brief. A beautiful but medically overstated 'optimal' band will also fail.
