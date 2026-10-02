# Analog Signal

Two complementary treatments, introduced in EVA 03.2 and refined in 03.3.

## Character cells

`AnalogType` renders a serif silhouette sampled onto a square grid. Warm cream tiles carry small deterministic EVA / VIDA / SALUD characters. Keep the macro word readable; this treatment belongs in large display type, never body text, navigation or controls.

Props: `text`, `width`, `height`, optional `frame`, `color`, `style`. It works inside or outside Remotion. A native SVG text fallback is present before the canvas is ready. It is decorative; supply the meaningful text through a semantic heading nearby. The hero already has its accessible h1.

Use a frame supplied by the composition. There is no independent timer or random sequence. Microcharacters advance in nine-frame buckets; a restrained brightness sweep crosses the cells. Freeze the component after it leaves view. Canvas backing storage is resized only when dimensions change.

## Fixed dot display

`SignalFilm` is a 361-frame Remotion composition. In 03.3, it restores the original fixed-grid glyphs and eight-step, scattered lamp switching from 03.2. Each lamp in the previous calculator refinement is now split into two circular lamps on a staggered lattice. This doubles that board again: 216 illuminated dots for 15, 280 for 90 and 216 for TÚ, exactly eight times the initial 03.2 counts. The original glyph silhouette and layout remain, with 624 fixed sites: a staggered body plus an eight-dot accent.

Each lamp has radius 0.13. The nearest-neighbor pitch is approximately 0.3536 units, leaving a visible 0.0936-unit gap between circles. The staggered arrangement preserves approximately 94% of the previous ink coverage. Fixed positions never translate, and each lamp switches directly between on and off. There is no clipping wipe, whole-word fade or moving dot. The three stable positions are 0 (15), 160 (90) and 340 (TÚ).

`SignalPassage` maps native scrolling through three viewport heights onto those frames. It has no autoplay. The visible chapter buttons are an alternative to scrolling. `AnalogSpecimen` exposes the same composition with a frame slider at `/system#analog-signal`.

The global reduced-motion setting replaces the pinned passage with a short, static text section. Initial/server rendering includes a readable fallback. The lettering and circles are hidden from assistive technology; headings and complete information are available as semantic text. Copy stays at least 37px above controls on the tested 320×568 viewport.

## Reference and adaptation

- User-supplied SAY LESS image: serif contours built from cream square tiles containing tiny letters. The supplied reference is retained in this private study at `/art/reference-analog-letters.png`.
- [SAVEE motion reference](https://savee.com/i/uBs8ZE0/), attributed to [Satto Studio](https://x.com/Satto_studio/status/2094148642168832020): black circular dots, fixed registration and fast stepped glyph swapping on white.
- EVA preserves that registered display language while letting the reader set its pace with scroll. The original video is linked as reference rather than included in the landing page.

## Acceptance gates

1. Hero word readable on desktop and phone; runner and soft glow remain visible.
2. Distinct 15, 90 and TÚ states with fixed dot centers, exactly twice the previous refinement’s lit-dot counts (eight times the initial 03.2 counts), and visible gaps between circles.
3. Scroll changes the frame; an idle page holds it. The same frame always has identical dot geometry, in either direction.
4. Short-phone copy and controls do not overlap; no horizontal overflow.
5. Reduced motion shows complete static content. No autoplay added.
6. Previous accepted 03.0, 03.1 and 03.2 source archives remain recoverable.

Bounded loop: one implementation pass, one independent correctness review, corrections for concrete findings, then browser and build checks. Further revision only on a failed gate.
