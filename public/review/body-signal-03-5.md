# Body Signal / EVA 03.5

The uploaded SAVEE reference is an 8-second, 720×924, 30fps video. It shows stationary white lamps on black. Neighboring lamps swell into connected luminous islands and contract to pinpricks through a continuous organic field. The supplied file is retained unchanged at `/art/reference-body-signal.mp4`.

## Placement and direction

Body Signal introduces the existing “De los datos. A tu vida.” passage at `/#una-senal`, with “Interpretamos las señales de tu cuerpo.” It uses EVA's ink background and warm paper light. The artwork is abstract and illustrative; it represents no person's measurements. It neither adds clinical thresholds nor changes any biomarker values.

The first 165 frames contain a deterministic moving spatial field. Frames 165–270 contract the bloom and resolve each lamp toward its original 15 mask. The board widens during this transition; centers change with the board's proportions while the drawn lamps remain circular. The existing accent sites stay dark during the abstract opening. From frame 270 onward, the original 361-frame sequence is preserved exactly: 15, 90, TÚ, including the original separated circles and scattered eight-step on/off behavior.

## Component

- `lib/body-signal.ts`: frame-only spatial field, bounded radii, exact handoff to `signalState`.
- `BodySignalFilm`: Remotion composition with optical bloom, warm light, moving typography and circular lamps.
- `SignalPassage`: native scroll maps 400svh to 631 frames. Four ordinary chapter buttons provide direct access.
- `BodySignalSpecimen`: reusable example with a frame slider at `/system#body-signal`.
- Existing `SignalFilm` and `AnalogSpecimen` remain available in the design lab.

No independent animation timer, particle simulation, random state, circular reveal or background video is required. Reverse scrolling reproduces the same image. Reduced motion provides the interpretation heading, a settled dotted 15 and the original business facts.

## Bounded review

One reference analysis, one implementation, one independent review, then targeted corrections. Corrected the mobile title container, short-phone field spacing, excessive merged-light coverage, detached accent glow and elliptical lamps. Inspected Remotion stills at 1440×900, 390×844 and 320×568, including the transition midpoint and fully resolved 15. Browser interaction verification was unavailable because the Mac was locked; this is distinct from the completed frame rendering and code checks.

`npm run check:body-signal` checks all 631 frames for finite radii, deterministic reversal and fixed model positions, coherent neighboring lamps, open dark channels, bounded per-frame radius changes and exact equivalence with every original data frame. `npm run check:analog` retains the original density and individual switching tests. The static content and delivery checks remain part of final validation.

The previous complete 03.4 source and assets remain downloadable at `/archive/eva-03-4-soft-glass.zip`; older archives remain separately linked. The full earlier history also remains in recovery bundles and tags.
