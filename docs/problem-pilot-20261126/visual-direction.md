# Visual direction for the practical problem and Alex

Upstream design advice from gpt-6.2-astra at high effort, based on original `58bac762`. I used EVA Preview Review v3, Master Workflow v1 and installed Impeccable 4.9 layout/typeset guidance. Frontend Design was unavailable. The existing EVA components and CSS supplied the design reference. The frozen brief and supplied Impeccable context receipt provided the owner context for this scoped review.

## Placement and hierarchy

Mount the practical paragraph and `GuidedResultStory` together immediately after `ReportUnderstanding`, before collection. Use one `section.biomarker-lab.results-problem` with `aria-labelledby="markers-title"`, an existing `.bio-layout` child, the paragraph, then Alex. The existing `h2#markers-title` names the example in both locales. The ONS source, free action and allowance finish the preceding region. Both sections already use the same paper colour, so the preceding section’s bottom padding and the smaller paragraph-to-Alex gap carry the change of subject. Keep the fictional label visibly paired with hs-CRP inside the glass.

At the original `#biomarcadores` position after range proof, use the existing dashboard summary’s localized `<strong>` as its region name through a local ID and `aria-labelledby`. This yields “Explore sample dashboard” or “Explora el panel de ejemplo” even when the disclosure is closed. Keep the chapter destination on this section. Lookups for that specific gallery should use its ID because both paper sections use the `.biomarker-lab` styling class.

## Selected copy and expected geometry

| Locale | Lead selected by the copy reviewer |
| --- | --- |
| EN | It can be hard to make sense of a change in your lab results, even when you have the earlier numbers in front of you. |
| ES | Puede costar entender qué significa un cambio en los resultados de tus análisis, incluso si tienes las cifras anteriores delante. |

Set the scoped paragraph in `EVA Hanken` 400, inherited ink `#0b1010` on paper `#f3f0e8`, `var(--proof-body-size)` at 16px with `var(--proof-body-leading)` at 1.5. A maximum measure of 62ch, natural wrapping, and zero block-start margin suit both sentences. Leave `var(--proof-space-related)` (16px) below it. Reuse the 1200px maximum `.bio-layout` width and 24px outer block spacing. These sentences fit ordinary prose treatment and need no forced line breaks or added emphasis. Actual wrapping depends on the loaded face and viewport.

- At 1366px the paragraph starts on the guided heading’s left edge. The existing heading at 44px and the right-hand result glass follow together. Keep the result, picker and localized free-upload action in their current grid.
- At 320px and 390px, inset the lead by the same 8px as `.guided-feature-heading` inside the 16px mobile gutter. Expect natural additional lines above the 34px heading and the existing single-column order. Allow the full paragraph height in both languages; the picker, fictional label, readout and action must remain available. The intermediate 701–1050px layout already stacks the glass below the heading/picker row.
- Leave the paragraph in ordinary document flow and pass the existing `calm` and localized free-upload target into `GuidedResultStory`. Its own focus/entrance behavior and disclosure state belong to the existing component. The paragraph remains readable while the glass enters.

## Evidence boundary

The source review covered `ScrollStory.tsx`, `ReportUnderstanding.tsx`, `GuidedResultStory.tsx`, `BiomarkerGallery.tsx`, the localized copy, `proof-system.css`, `guided-result-story.css`, `report-understanding.css` and `app/biomarker-glass.css`. Declarations support the measurements above. On the integrated render the independent technical reviewer should confirm both languages’ paragraph alignment and measured gap, the separation from the ONS block, absence of clipping at 320px, local accessible names and Alex visibility on normal scroll and reduced motion. This upstream review produced no browser or comprehension verdict.
