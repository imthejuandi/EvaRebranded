# EVA Soft Glass / Biomarker console

Adapted from the two images supplied by JD on 10 September 2026. Exact reference files are preserved as `/art/reference-biomarker-glass-01.avif` and `/art/reference-biomarker-glass-02.avif`. These are visual references, not photographs or patient data used by the interface.

## Design component

A pale cream instrument body holds a dark, frosted chart and two columns of rounded data tiles. Amber, coral and lilac light pools connect the material to EVA's existing glow photography. A fine grain layer and an inset luminous rim sit above the light field; foreground text, dots and chart remain sharp. White active pills and circular reading selectors reproduce the reference's hierarchy. The hand and phone hardware are omitted so the instrument belongs to the landing itself.

`BiomarkerGallery` owns the selected specimen, reading, view and disclosure. `biomarker-glass.css` owns the material and responsive composition. `DotNumber density="coarse"` supplies separated dots at small sizes. Existing large readouts retain their fine eight-lamp cells and the original scroll-based Analog Signal is unchanged.

## Data and behavior

All five specimen names, values, units and intervals come from EVA's public landing. Reading 04 retains28ng/mL VitaminD,2.1mg/L hs-CRP,11µIU/mL fastinginsulin,98mg/dL ApoB and320ng/mL ferritin. Earlier readings are invented only to demonstrate the UX; the section, chart and information disclosure label them illustrative. They do not represent a person or predicted benefit.

Selecting a specimen updates the chart, range view and focused reading. Four period controls select one shared reading across all five tiles. Previous/next stop at the first/last reading. Three view pills select evolution, original ranges or a large dot display. The plus tile opens the complete original source table, explicitly labeled Reading 04 even when another illustrative reading is selected. No percentage improvement or clinical direction is invented.

## Verification and stopping rule

One implementation, one independent code review, one visual refinement, then targeted checks. Source/state review passed. Desktop 1440×900, tablet 768×1024 and phone 320×568 inspected. Refined the inset edge overlay and stacked the tablet composition to prevent tiny readouts. All five selections, previous/next bounds, quarter synchronization, keyboard Enter, range disclosure and reduced motion verified. No page overflow at 320px; the full interval table has contained horizontal scrolling. In reduced motion the readouts settle and entry movement is disabled. No browser console errors observed.

The content-only checkpoint is tagged `eva-03-4-content-import`; its components are downloadable at `/archive/eva-03-4-content-components.zip`. A full checkpoint source archive is retained in the working project's outputs alongside the new revision.

Delivery archives omit nested copies of earlier ZIP archives; every prior archive remains separately linked in history. Original content and glass commits remain in the recovery bundle and local tags. The delivery commit combines these changes to stay within the source service upload limit.
