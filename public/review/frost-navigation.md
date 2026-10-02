# Frost / Analog Ink — 03.26

The existing navigation destinations are retained. Desktop links sit in a restrained translucent surface; at 900px and below, Menú opens a warm frosted panel with a fine light edge. The backdrop blur is fixed at 40px; only the panel opacity and an eight-pixel entrance movement animate. A solid paper fallback is provided when backdrop filtering is unavailable or reduced transparency is requested.

## Letter behavior

`DotMorphLabel` samples the displayed typeface into a cached grid. Each source fragment resolves into a round dot at the same position, with a staggered left-to-right scan. It never changes the word's layout or swaps font families. Small coverage differences vary dot sizes. The effect takes 420ms forward and 320ms back; changing direction resumes from the current progress. Rendering stops at each endpoint. Only interaction starts animation; there is no ongoing shimmer or idle particle loop.

The original HTML text retains the accessible name. The canvas is decorative. Keyboard focus uses the same dot treatment and keeps a separate focus outline. Pointer selection does not intercept or delay the link. The open Menú trigger stays dotted until it closes. Reduced motion preserves solid letters; forced-colors mode uses native text. Enlarged labels can wrap and retain native lettering when multiple lines are needed.

## Dropdown behavior

The installed Base UI Popover primitive provides dismissal, focus return, and portal positioning. Native anchors preserve normal browser behavior. Escape and outside interaction close the panel. One tap activates a destination on touch screens. The panel scrolls internally if its content exceeds the available height. Resizing to desktop closes the small-screen popup.

## Review

A bounded local Chrome check covers partial and complete morphs, mid-animation reversal, stable link geometry, idle rendering, 320px and 390px containment, keyboard focus and Escape, outside dismissal, one-tap links, reduced motion, and enlarged text. Screenshots and the final browser record are kept in the project workspace. This does not claim a physical-phone FPS measurement.

## Recovery

The approved still and previous navigation are retained in `/archive/eva-03-20-solar-still.zip`. Restore over 03.19 using its included rename/deletion instructions. All earlier downloadable archives remain available. No business content, claims, links, or existing artwork were changed for this navigation update.

## Compact refinement / 03.22

Square corners on the dropdown, trigger and desktop surface. The dropdown is capped at 300px with 52px rows. Every dropdown destination, including English, uses the same 1.25rem Georgia type. Every desktop destination, including EN, uses 14px lettering. The previous rounded design is recoverable through `/archive/eva-03-21-frost-navigation.zip`. Motion and link behavior are unchanged.

## Technical refinement / 03.23

245px square panel with four 44px destination rows. All dropdown categories use the same 0.9375rem system monospace stack; desktop categories use the same stack at 14px. The heading and language row are removed. EN now appears independently in the page header beside Empieza. Menú is the compact trigger, which also closes the panel. Escape, outside dismissal and the reversible dot effect remain. Previous state: `/archive/eva-03-22-square-menu.zip`.

The four destination titles are centered within their rows. The numerical prefixes and trailing hover markers are removed.


## Material and selection / 03.24

References inspected on SAVEE and in the 21st.dev catalog on 2026-09-11:

- [ONTO — Science, saved by Nelson](https://savee.com/i/giyIFqU/): quiet pale menu, open space between items and a soft selection surface. The generous spacing is adapted to EVA’s existing compact dimensions; its rounded shape and unequal type scale are not carried over.
- [Fluid Dropdown by Kousthubha Yadiyala](https://21st.dev/@koustubhayadiyala36/components/fluid-dropdown): coherent selection movement within a compact dropdown. EVA keeps its installed Base UI primitive and ordinary navigation links. No component code or dependency was imported.

245 × 190px remains the normal phone panel size. All four rows remain 44px tall, centered, with the same 15px system monospace font. The horizontal dividers are removed. Warm translucent material, a fine rim and a directional highlight soften the square frame. Fixed 36px backdrop blur keeps the page visible as color rather than competing text. The trigger sits 12px above the popup.

One decorative highlight tracks pointer entry or keyboard focus between destinations. Geometry is measured only on an active-item change or resize. CSS transitions move it; there is no idle animation loop. The existing 420/320ms reversible dot morph is preserved. Reduced motion disables the new movement, forced colors suppress the decoration, and enlarged text retains native wrap-safe lettering.

Local in-app browser review: 390px and 320px contained panels, 1440px desktop review, centered equal-size labels, keyboard selection/highlight, partial dot morph and reversal, Escape with collapsed trigger, and outside dismissal. Existing links and the header language control are preserved. This review is not a physical-phone performance test. Previous source is recoverable with `/archive/eva-03-23-technical-menu.zip`, applied over 03.22.


## Stronger frost and bold type / 03.25

The dropdown gradient is now 91–95% opaque, with fixed 40px backdrop blur and 0.45 saturation. This retains a faint hint of the page while substantially reducing color and shape interference. The blur remains static. All destination labels and the Menú trigger use font weight 700; the dot renderer already samples the computed font weight, so its glyph source is bold as well. Category font sizes, square 245 × 190px dimensions, centered layout, light tracking and finite reversible motion are preserved. The EVA logo is unaffected.

Local in-app browser checks: four 15px/700 phone labels, four 14px/700 desktop labels; 390px visual comparison; 320px contained panel with separated header controls; completed dot morph at 1.000 with animation stopped; keyboard focus and Escape. The prior version is saved in `/archive/eva-03-24-refined-navigation.zip`, applied over 03.23.


## Narrower proportions / 03.26

The dropdown is narrowed from 245px to 180px, reducing unused space beside its centered labels. Its four 44px rows, 190px total height, 15px bold type, strong frost and reversible dot effect are unchanged. The previous width is preserved in `/archive/eva-03-25-bold-frost.zip`, applied over 03.24.
