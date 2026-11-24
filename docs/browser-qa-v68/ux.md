# UX/UI recommendation — reuse EVA's dashboard levels

## Exact selection

**Reuse `ExecutiveReading.tsx` → `EvidenceRange` as the visual authority.** Carry its 55-column × 4-row dot field, larger/brighter interval dots, fine endpoint strokes and ring-with-core sample cursor into the two aligned v67 comparison rows. Retain v67's actual range comparison, labels, one dotted 3.2 sample, context and action. Use the dashboard hs-CRP fixture's **0–5 display domain**, with explicit recalculation rather than relabelling the old 0–6 graphic.

This directly answers the owner's new request to use levels from the dashboard. Do not invent another rectangular strip, choose a generic thin progress bar, or return to the rejected relay topology.

## Inspection and Impeccable principles applied

Read the current implementations and associated CSS for DashboardPage/CapsuleRange, ExecutiveReading/EvidenceRange, landing BiomarkerGallery/Rangos, and BiomarkerPage/MeasurementInstrument. Inspected the existing dashboard and hs-CRP detail capture from the November 18 audit as historical material evidence; that dashboard capture shows the upper overview, not a freshly exercised ExecutiveReading state. The specific mini-instrument selection is grounded in its current rendered-source geometry. A fresh v68 native screenshot remains the next visual gate.

Applied the local `/workspace/eva-design-tools/impeccable/SKILL.md` with `reference/layout.md`, `reference/typeset.md`, and `reference/craft-floor.md`. The context command was already run in this session and allowed scoped existing refinement. No application source was edited and no detector was run during this read-only selection.

- **Layout:** preserve the established visual world; choose structure from the task. The two same-scale ranges remain the primary comparison, so use two equal-width plots with one shared axis rather than copying a single dashboard card wholesale.
- **Typeset:** preserve authoritative Hanken 400/600 and Georgia roles; reuse the visual pattern without importing the dashboard's 9–12px labels or synthesized 500 weight. Landing task labels remain at least 14px; body remains 16px/24px.
- **Craft:** brief coverage must be findable within seconds. Both the actual range lengths and their dashboard identity must be obvious. Real quantitative geometry earns the dots and endpoint strokes; no added decorative instrumentation is needed. The pinned glass/analog identity remains authoritative.

## Why this incumbent, not the others

| Incumbent | Actual treatment | Decision |
|---|---|---|
| DashboardPage `CapsuleRange` | 5px translucent rounded rail, brighter interval, 3×17px white cursor and quiet halo | Valid dashboard source, but generic and less distinctive. It would look like merely thinning v67's rectangles. Do not select it as the primary redesign. |
| ExecutiveReading `EvidenceRange` | 55×4 dot matrix, r1.7 versus r0.8 interval/background dots, boundary strokes, r10 ring and r3 core | **Select.** This is the unmistakable analog dashboard level language and remains compact enough to repeat for two ranges. |
| Landing BiomarkerGallery `Rangos` | Two rows of 5px rounded rails with vertical markers | Reuse the comparative two-row organization already preserved in v67; do not copy its historical numeric data or labels. |
| BiomarkerPage `MeasurementInstrument` | Tall 106-unit halftone interval above a baseline, 41 tick marks, vertical sample cursor/triangle and ring | Strong sibling precedent, but copying two tall calibrated plates would make this compact landing section unnecessarily large. Do not combine all its tick/triangle motifs with EvidenceRange. |

## Visual reuse specification

1. Replace each solid v67 rectangle with the EvidenceRange dot field. Both rows use the same plot origin, width, column count and vertical construction. Brighter/larger dots show the included interval; smaller/quieter dots show the remaining displayed domain.
2. Start from the actual 55 columns and 4 rows. The source has 7-unit vertical row pitch, inside radius 1.7, outside radius 0.8 and opacities .62/.22. Preserve the relative size/density pattern. Adapt foreground opacity only as needed for the incumbent dark glass and measured visibility; the source mini-instrument normally uses dark ink on a pale face, so its exact color/opacity values are not automatically sufficient on this surface.
3. Use warm-white/pearl interval dots in **both** rows. Differences in numerical extent and explicit labels carry the comparison; no green safe-zone fill is needed. Retain amber only for the conditional review instruction. Do not import the whole dashboard's status-dependent green/critical background.
4. Preserve precise thin endpoint strokes at 0 and each strict upper boundary. Calculate them from numeric positions, not rounded dot indices. The dot density is a texture encoding of the interval; the endpoint stroke and explicit `<` label supply exact boundary semantics.
5. Reuse the dashboard's ring-with-core result silhouette at the exact sample x. Fill the ring's interior with a suitable dark local face so field dots do not obscure the centre. This is a sample marker, not a goal: no pulsation, arrow, hover requirement or movement toward the short interval.
6. Retain one bold 3.2/3,2 label at the shared-axis sample position, with integer 3 omitted if it would collide. Keep 0, 1, 2, 4 and 5 at their real positions. Keep the large dotted header reading as the only dominant value.
7. Keep current labels above each plot and conclusions below, with the hs-CRP/overall-risk qualifier and separate named >2-if-persistent action. The graphic must still visibly show a broad range and a much narrower range; full-width dots of equal prominence would be merely decorative.

At 320px, a 236px-wide plot gives the <1 interval about 47px, enough for roughly 11 brighter columns. Do not shrink the horizontal plotting area to fit a side label column. If the default fixed SVG viewBox makes the circles too small after scaling, preserve circle roundness and adjust the responsive viewBox/field geometry; do not stretch circles into ellipses with an unconsidered `preserveAspectRatio="none"`. Inspect actual phone rendering before changing source radii.

## Numeric match: what to borrow and what not to borrow

The preview fixture stores hs-CRP `range:[0,1]`, `domain:[0,5]`, a separate result of 2.1 and its history. Reusing the 0–5 **display domain** is appropriate; replacing the independent teaching sample or the clinical contract is not.

| Item | v68 position on 0–5 |
|---|---:|
| Origin 0 | 0% |
| Lower-risk strict endpoint 1 | 20% |
| Review threshold 2, retained in text | 40% if it were plotted |
| Independent sample 3.2 | 64% |
| Lab strict endpoint 5 / displayed domain end | 100% |

Do not reuse `evidenceRangeGeometry` unmodified for each row. That helper independently derives its domain from `max(value,rangeHigh)` plus 12% padding; it does **not** use the fixture's 0–5 domain. Calling it separately for the <5 and <1 comparisons would produce two different scales and violate the accepted comparison. Reuse the SVG pattern, with one explicit common domain passed to both rows.

Do not copy the dashboard's inclusive `<= intervalEnd` dot-membership test for the medical category. The landing remains strict `<1` and `<5`; exactly 1 and 5 are excluded. The fixture's inclusive illustrative interval and internal `optimal` names are not the landing's clinical authority. At the full-width lab boundary, keep an exact right-end stroke and clear `<5` label, and do not brighten a terminal dot centered exactly at 5. The graph ending at 5 does not mean that hs-CRP cannot exceed 5.

The landing BiomarkerGallery contains older specimen `standard:[0,3]`, `eva:[0,1]`, and derives a display maximum using ×1.1. Those are not replacements for the freshly sourced <5 assay reference or the common 0–5 display. Do not import its 'Rango de longevidad EVA' label either. Keep the AHA lower-relative-risk category language, laboratory scope, no-overall-risk note, persistent >2 modifier and all four sources.

## Final render decision

The next image must simultaneously pass two tests: it clearly looks like the dashboard's dotted level instrument, and it still clearly draws the two real numeric spans with the same result positioned against both. If the dot field becomes too quiet to show the intervals at 320px, fix the dot-size/luminance distinction rather than bringing back full rectangular slabs or abandoning the numeric comparison.

Keep the plot static. Preserve the current glass, outer layout and readable copy. Scope this change to reuse of the visual level language and common display domain; do not change dashboard fixtures, classifications, example history or the medically verified thresholds.
