# Tasso homepage implementation

Loop 1 implementation of `tasso-cinematic-script.md`, based on `tasso-process-research.md`.

## Tools and material

React, the existing Remotion composition, and the existing native story scroll driver are sufficient. Product and upper-arm views use the retained manufacturer photographs. The return envelope/protected sample is an authored SVG paper illustration; the results sheet is typographic HTML with three biomarker names and no invented measurements. These choices keep the real device, attachment, anatomy and tube orientation intact. No generated procedural footage, new video decoder, Higgsfield generation, SAVEE download, or external runtime service is needed.

## Integration

- `TassoProcess.tsx` replaces the old static contents of `EvaFilm`'s product scene.
- Existing scene entry at frames 130–280, exit from 465, overall 981-frame composition, and 920svh scroll length are retained.
- Three stable beats: home collection to frame 358, prepaid return to 412, and contextual results afterward. Cross dissolves occupy 354–362 and 408–416.
- Product-to-use photo dissolve takes place during 280–294. The collection text remains available throughout the first beat.
- Return illustration shows a capped, labeled sample within a protective carrier. The protected carrier settles 12px into an open envelope, whose flap then closes. This illustrates packing order; it does not reproduce a particular supplied shipping package.
- Motion is driven by the existing scroll position. The component subscribes once and updates bound element opacity/transform directly. There is no React state update per frame, independent animation clock, or perpetual decorative loop. Reverse scrolling reverses the same composition.

## Content and access

Copy is explicitly localized in EN/ES from one shared object, including the two-working-day promise and its adjacent laboratory-receipt qualifier. `TassoProcessSummary` provides the same three-step ordered list outside the film's `aria-hidden` subtree. It is a screen-reader transcript during normal motion and a visible, illustrated sequence when reduced motion is selected. The imagery is decorative within the inaccessible film; the visible static upper-arm photograph has a descriptive alternative.

The collection copy is a high-level service explanation, not a complete IFU. It directs people to the instructions supplied with their kit. No painless, needle-free, immediate-fill, diagnosis, or specific personal-outcome claim is added.

## Review hooks

The visual scene exposes `data-tasso-process`, `data-tasso-step="1|2|3"`, and a diagnostic `data-tasso-active-step`. The transcript exposes `data-tasso-summary` and has three ordered-list items. Representative frames: 320/345 collection, 385 return, and 440 results; transition boundaries 350/365 and 404/419. The judge should check rendered opacity and geometry rather than treating diagnostic attributes as proof.

The root agent owns the production build, browser review, GitHub synchronization, and Sites publication. This document records implementation choices; the judge's report records acceptance and any remaining limits.
