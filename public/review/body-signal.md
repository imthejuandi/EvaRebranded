# Body Signal — a continuous living field

One field of lamps fills the screen, including behind readable mobile copy. Angular 15 / 90 / TÚ numerals emerge through brightness guidance; their radius, grain and clock come from those same lamps. The surrounding field remains visible.

Revision 03.13 uses continuous fractional scroll frames, removing the whole-frame snapping that was causing visible steps. The film has 1,221 frames across 675svh. Initial emergence still spans 225 frames, about 1.06 viewport heights. Complete-number holds are 200 / 230 / 180 frames; between-number changes last 110 frames. This extends reading time without speeding up the accepted initial reveal.

The GPU draws each circle and its restrained halo in one point pass, using the same lamp positions, radii and light. There is no full-screen blur or repeated per-frame SVG serialization. A Canvas2D fallback retains the complete geometry if WebGL is unavailable or lost. Both paths are driven by the same Remotion frame; no additional running clock is introduced.

The component retains the model’s fixed lattice cache and viewport-only seeking. In the hero, the runner travels via a composited translate and the analog letters are cached between microletter changes. Native video keeps its own continuous gait.

Checks cover all complete frames, fractional continuity, fixed lamp identities, reverse reconstruction, viewport coverage, text-area brightness and readable glyph contrast. Browser checks use desktop and compact mobile viewports on a Mac; these are not physical-phone measurements.
