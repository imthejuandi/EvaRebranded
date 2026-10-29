# EVA — process and reading motion

## Sample passport (Method)

- Actual Remotion 4.0.522 composition: `SamplePassportFilm.tsx`, 720 × 640, 30 fps, 270 frames (9 seconds).
- A single example record (`EVA / 001`) persists while the real Tasso+ reference image gives way to the return material, a laboratory record, and the glass result. This illustrates the journey, not specimen handling instructions or device anatomy.
- The current Method page drives that composition by four chapters. On a desktop viewport at least 1000 × 700 with motion allowed, `SourceStory` selects a chapter from document scroll or direct buttons. Its Player runs a finite 48-frame segment (about 1.6 seconds at 30 fps) from the selected chapter stop, then holds. The registered complete composition remains 270 frames / 9 seconds; this is not an uninterrupted 9-second autoplay on the current page.
- Remotion Player is dynamically imported after its figure becomes visible. Offscreen or hidden-document playback pauses. User pause stays paused during scroll away/back. The native range supports seeking inside the active chapter. Chapter playback state is read directly after event listeners attach, including playback started during a chapter change.
- Mobile, short viewports and reduced motion use four readable inline static scenes and the full written explanation, without mounting the Player. The pure `SamplePassportArtwork.tsx` has no Remotion dependency; Player and frame hooks enter through the dynamic runtime only. The wrapper can preserve frames across its own runtime remount, but changing the parent `SourceStory` enhancement mode unmounts the wrapper; parent-level retention must be verified separately.
- 144 particles maximum, no full-screen filter, no CSS animation inside the Remotion composition.

## Intentional scroll use

- Current Method uses `SourceStory`, adapted from the fetched 21st / Aceternity StickyScroll component (result 952), retaining closest-breakpoint selection and sticky composition. It uses passive document scroll and one scheduled frame only when needed, plus manual chapter controls and a follow-scroll toggle. There is no scroll lock and text remains available. Exact retrieved source and license provenance are in `outputs/eva-refinement-2026-09-18/public-story-implementation.md`.
- The older continuous record rail and earlier general 21st timeline research are historical iterations, not the current interaction.

## Science's current document correspondence

- Current `SciencePage` imports `DocumentReading`, not `ReadingField`. Selecting value, unit, reference or source highlights the matching rows in two views and draws a finite 650 ms path between them. The number is never tweened through invented intermediate measurements. Reduced motion removes the path animation and row transitions; mobile retains the fields and controls without requiring the desktop bridge.
- ApoB 78 mg/dL comes from the existing synthetic fixture. The page labels its data as fictitious, does not invent an interval, and links to the June example report. No health classification is generated.
- `ReadingField.tsx` remains the earlier, unused 176-particle reading-lens experiment. Its presence is not evidence of animation on the current page.

## SAVEE reference inspected

- https://savee.com/i/YC6VZQI/ — visually inspected the preserved `public/art/savee-09.jpg` on 2026-09-18. It shows an out-of-focus flower against black: violet/blue translucent-looking lobes, a coral/orange centre and overlapping soft edges. The adaptation preserves the optical separation and restrained coral/violet overlap in two inexpensive radial depth fields behind the passport artwork and in its glass result. It does not reproduce botanical imagery or add a full-screen blur filter.
- https://savee.com/i/XgkYvKC/ — board metadata identifies teenage engineering product/instrument photography, but `savee-04.jpg` is absent from this checkout and the web fetch was inaccessible. This item has **not** been visually inspected and is not claimed as an implementation source.
- https://savee.com/i/uBs8ZE0/ — preserved board metadata identifies the motion reference. The current implementation uses EVA's already-approved halftone/matrix language; no claim is made here to having reviewed a new playback of this remote clip.

## Checks

Scoped oxlint passed for the seven added/edited TypeScript files on 2026-09-18. Full TypeScript `--noEmit` compilation passed. Browser checks are integrated by the lead against the resident review copy.

Follow-up verification: esbuild split-graph check found **zero Remotion modules in the static wrapper graph**, with a separate dynamic runtime entry. A shallow hook harness executing the actual wrapper/runtime passed paused-frame 77 restoration, completed-frame 269 restoration, no automatic replay in either state, stable mount frame while controls update, and explicit replay. These historical wrapper-only source checks do not establish parent SourceStory remount retention and do not replace current browser verification.
