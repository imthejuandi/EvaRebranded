# EVA — System 03.5: Body Signal

An isolated design assessment. The live EVA website and GitHub application were not changed.

## Development
Node 24; `npm install`, `npm run dev -- --port 3017`. `npm run build` exports static files with Vinext. `npm run check:delivery` checks the actual exported routes, core content and all 60 product images.

`npm run motion:studio` opens the registered Remotion landscape and portrait compositions. The site embeds the same EvaFilm component with a paused Remotion Player. Native scroll selects frames 0–840. The design lab exposes the same timeline with a slider.

## Reusable pieces
- `components/story/EvaFilm.tsx`: frame-authored scene transformations and product sequence.
- `components/story/ScrollStory.tsx`: native scroll controller, semantic narrative, chapter controls and reduced motion.
- `components/story/Editorial.tsx`: method, founder and factual Tasso+ image.
- `components/story/DesignLab.tsx`: frame inspector, art comparison and visual system.
- `lib/design.ts` and `app/globals.css`: design tokens and reusable page rules.
- `public/art`: artwork, SAVEE reference images and verified product frames.
- `public/review`: acceptance protocol, evidence and provenance.

## Sources
Sofi Health and Clearwater inform spatial transitions and editorial scale. Two real 21st.dev CLI retrievals supplied Zoom Parallax (efferd, 5967) and Horizontal Scroll Gallery (pulkitxm, 20139); their measured patterns were adapted into Remotion rather than installed as unrelated components.

Higgsfield generated the runner and stretch artwork with the actual SAVEE 06/08/09 images as references (4 credits estimated in total). The device sequence is extracted from the previous Higgsfield product turn based on official Tasso+ imagery. It is an artistic product study, not a device-use tutorial or a CAD model. Official product and in-use references: https://www.tassoinc.com/tasso-plus and https://www.tassoinc.com/.

## Recovery
Version 02 remains at https://eva-system-02.jdlagop.chatgpt.site/ with its source archives and all 27 SAVEE references. Version 01 remains at https://eva-instrument-study.jdlagop.chatgpt.site/ and https://eva-instrument-landing.jdlagop.chatgpt.site/. The /history route links each version. This project is a separate Sites project and Git repository.

## Refinement 03.1
The opening now uses an athletic runner and an independent ambient running loop. `GlowMotion` is the reusable source-led image/video component, with controls in `GlowMotionSpecimen` and its palette/mask in `glowMotionStyle`. Remotion continues to drive all spatial scene transitions. The timeline inspector uses the refined still for repeatable comparisons. `/review/glow-motion.md` documents reuse and behavior. The accepted 03.0 source is downloadable from `/archive/eva-03-original.zip`; its original artwork stays at `/art/runner.jpg`.

## 03.2 · Analog Signal

The accepted runner remains. `AnalogType` adds square character cells to the hero’s serif silhouette. `SignalFilm` and `SignalPassage` add a separate 361-frame scroll passage with fixed dot registration (15 → 90 → TÚ). `/system#analog-signal` contains the reusable specimen and timeline. See `public/review/analog-signal.md`. The complete accepted 03.1 source is in `/archive/eva-03-1-glow-motion.zip` and tagged `eva-03-1-glow-motion`.

## 03.3 · Motion refinement and Solar Grain

Hero flowers removed; runner exits right. The device uses its official white-backed photograph, a fixed center and a smooth in-plane turn, with multiply blending into the cream section. The original scattered board animation is restored, with 624 fixed lamps on a staggered calculator grid and visible gaps between circles. The current 216/280/216 lit-dot counts double the previous refinement. Scene changes use adjacent upward translations; the former circular reveals, product expansion and final opening wipe are removed. EVA wordmarks use weight300. `LifestylePassage` and `/system#solar-grain` add the coastal post-run image and document its treatment. `SolarMotion` adds a stationary-camera walking clip with source-authored trailing glow, pause controls, offscreen suspension and a still alternative. The full03.2 source is retained in `/archive/eva-03-2-analog-signal.zip`.


## 03.4 · Complete landing content

Imported the substantive Spanish landing content from evahealth.es into the accepted design. New editorial context, five specimen comparisons, the four-step method, biological-age example, full founder statement, quarterly offer and complete business navigation. `DotNumber` reuses the staggered lamp language for data readouts; `BiomarkerGallery` recreates the supplied glass interface with five selectable specimens, four illustrative quarterly readings and three views. Native buttons support keyboard operation. See `/review/content-import.md` for exact mapping and source discrepancies. Run `npm run check:content` after building. The complete preceding03.3 source remains in `/archive/eva-03-3-movement.zip`.

## Soft Glass refinement

Reusable biomarker console in `components/story/BiomarkerGallery.tsx` and `app/biomarker-glass.css`. Exact supplied references are preserved under `public/art/reference-biomarker-glass-*.avif`. The fourth reading reproduces public EVA examples; prior readings are explicitly illustrative. See `/review/biomarker-glass.md` for material, interaction and responsive rules. The content-only checkpoint is tagged `eva-03-4-content-import`; its component archive is linked from history.

## 03.5 · Body Signal

The supplied SAVEE video is recreated as a frame-driven luminous lattice in `BodySignalFilm`. It introduces “Interpretamos las señales de tu cuerpo” and resolves directly into the original dot sequence. `body-signal.ts` keeps every lamp registered, drives smooth radius fields and preserves every original data frame after270. The landing uses631frames over400svh with direct chapter controls. The original Analog Signal remains in the design lab beside the new reusable specimen. See `/review/body-signal.md`. Run `npm run check:body-signal` and `npm run check:analog`.
