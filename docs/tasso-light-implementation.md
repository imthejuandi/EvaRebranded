# Light into Insight — camera and real app motion

This implementation changes Light only. Original, Studio Precision and Morning at Home keep their media, timing, captions and existing renderer. `TassoFilmOptions` adds one import and a conditional Light render branch; the earlier shared renderer does not bind to the new Light stage.

## Material and source

`LightCinematic.tsx`, `light-cinematic.css` and `lib/tasso-light-motion.ts` implement the creative brief in `tasso-light-cinematic-direction.md`. Root owns `lib/site-content/tasso-light-cinematic.json` and its real assets.

Collection and protected return retain their real rendered source frames. Loop 2 replaces the initial flat paper macro with the photographed envelope cutout `/art/tasso-light/paper-envelope.png`, preserving its physical fold, flap and transparent silhouette. A solid backing exists only within the verified 8% inset to make that inner face fully opaque. A perimeter polygon removes only stray alpha flecks; alpha-aware drop shadow follows the actual envelope. Step 3 uses root's actual browser recording of `/es/dashboard`: real signature motion, ApoB selection, hsCRP selection and closing the panel. Its Spanish text, example age 29/score 82 and actual fixture values are not recreated in HTML or AI imagery.

## One source, two hidden edits

A single opaque canvas draws exactly one source at alpha 1. Scroll moves its source-camera crop around the inspected button/cap anchors. A photographed envelope travels from lower-right towards the lens, covers the entire local viewport, then continues to upper-left. The source changes at .293 and .566, inside full-coverage holds .282–.304 and .554–.578. The backed opaque inner face reaches 1.5 times the viewport diagonal; an inverse-rotation test checks all four viewport corners against that face with a 5% safety margin. `data-paper-inset` identifies the actual backed face, not the wrapper rectangle. The surface is rotated −22°. There are no whole-source alpha blends, stacked dissolving scene images or object morphs.

The move is an intentional physical hidden edit, not a claim that separate source photographs form one uninterrupted live take. Direct keyboard/native-scroll seeks show the requested state immediately; a continuous traversal passes through the covered edit geometry.

## Real interface motion

The actual app capture supplies 192 frames at 24fps. Its manifest landmarks are signature 12, settled ApoB 56, settled hsCRP 124 and closed 184. The scroll mapping traverses the real opening/selection/closing transitions and holds the genuine detail states: ApoB .74–.80, hsCRP .84–.90, final overview .96–1. Loop 2 keeps the entire real desktop plane centered vertically without the prior extreme detail pan or rectangular clipping window. Phone uses two explicitly editorial close-ups from the same genuine frame: signature ROI (340,160,520,530), and result-left ROI (300,858,350,127) only when the real selected panel is open, frames 44–159. No UI is redrawn or reworded. The neutral view shows the genuine signature without an invented empty result card. An adjacent label identifies the phone view as real EVA demo close-ups. This is actual recorded UI movement under scroll control, not screenshot-only zoom or fabricated changing measurements.

## Runtime and access

Light occupies 340svh with one sticky full-viewport ink stage. Native scroll is the only clock; reverse scrolling uses the same mapping. No source decoder, player controls, autoplay timer or per-frame React state is added. A serialized atlas cache retains at most two decoded sheets for this component. Phone collection/return frames decode at 600px, while the actual insight footage decodes at 900px. The latter retains at most two 3600×1500 sheets: 43.2MB of estimated RGBA bitmap storage from their actual decoded dimensions. Actual first posters occupy a source while its corresponding sheet decodes; the next scene is requested before the approach.

Copy sits in a clipped HTML rail, with complete EN/ES collection, protection/return and laboratory-receipt timing. The photographed paper covers the copy during the edit. No paragraphs are superimposed. Keyboard step shortcuts remain native buttons. An ordered-list transcript sits outside the visual canvas. Reduced motion presents three actual static states with all factual copy and no camera, paper pass or frame progression.

## Browser review

The first implementation is a concrete review pass, not an automatic production acceptance. The judge should inspect actual paper material, projected coverage, matched focal points, readable phone framing, real app details, stopped/reverse pixels and unchanged other options. Canvas diagnostics report source and frame only after drawing. The root reports paper geometry and inverse-corner coverage without product-visible debug UI.
