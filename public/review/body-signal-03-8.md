# Body Signal / EVA03.8

A single living dot field fills the screen, including behind the words on mobile. The numbers emerge by guiding the brightness of those same dots. There is no switch from a soft field to a sharp numeral layer: every lamp keeps its position, radius function, uninterrupted clock and visual material throughout all631 frames.

## One material

`lib/living-lamp.ts` defines the shared, spatially coherent radius and light variation. It knows nothing about the number mask or reveal progress. `lib/body-signal.ts` adds glyph guidance to lamp energy. The angular bitmap only determines which existing lights gain intensity; it never creates a second set of lamps or replaces their radii. The current continues to move inside and outside the numerals.

`BodySignalFilm` uses one persistent halo and the same sharp core rendering at all times.16 intensity groups share a single halo filter. Compact path coordinates limit SVG overhead. No renderer condition changes at frame270. The initial field, emerging number and established number all retain separated halftone dots.

The reference remains `/art/reference-body-signal.mp4`. Existing5×7 analog silhouettes retain their stepped shoulders, counters and slashed zero.15/90/TÚ retain675/875/670 glyph sites. Later number changes preserve the individual-lamp stepped switching.

## Mobile coverage and legibility

Every mobile lamp has a visible radius and a minimum brightness, including those behind titles, captions and controls. The text veil dims intensity instead of removing dots or shrinking their radius. A small local text shadow protects letter edges. Glyph guidance remains independent of the broad dimming so the complete numeral remains readable.

Reduced motion uses `HalftoneNumber` with the same lamp material and settled15. The reusable specimen and frame inspector remain at `/system#body-signal`. All business content, Soft Glass, Tasso Glow, runner and lifestyle imagery remain unchanged.

## Bounded review

`check:body-signal` checks all631 frames for exact registered positions, the same radius/clock function regardless of glyph membership, uninterrupted material across269/270, full-viewport coverage, visible lamps behind mobile text, bounded text-area brightness, clear glyph/background intensity contrast and deterministic backward reconstruction. Existing analog, content, delivery, TypeScript and build checks remain in the validation set.

Desktop and compact-mobile opening, midpoint and established15 renders were reviewed. The first pass revealed the broad copy veil also dimmed parts of the numeral; the glyph energy bias now preserves complete strokes. An independent review identified a faint lower5 on320px; the common minimum radius was raised across the whole field, preserving one material. Frame rendering is distinct from live UI or assistive-technology testing.

03.7's complete source and assets remain at `/archive/eva-03-7-living-display.zip`; its guide is `/review/body-signal-03-7.md`. Earlier versions remain separately downloadable from `/history`.
