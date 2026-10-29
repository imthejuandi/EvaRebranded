# Tasso options: continuous scroll choreography

This revision supersedes the video-player presentation of all four options. Keep the original plus Studio Precision, Morning at Home and Light into Insight. Each becomes a continuous three-step scroll sequence. Existing generated clips supply the first two frame sequences; step 3 uses the actual captured EVA dashboard. No new generation or media spend is required.

## Actual dashboard inspected

Creative inspected both `/workspace/eva-dashboard-reference/dashboard-overview.png` and `dashboard-signature.png`, plus `docs/tasso-dashboard-reference.md`.

The real interface has warm-paper chrome, an ink sidebar, `Tu firma biológica.`, an `Ejemplo` badge, and a green circular biomarker signature. Its example values are biological age 29 and EVA Score 82. The circular field, labels and source-owned typography are what make it recognizable as EVA. This is stronger and more credible than a generated results sheet or imagined computer screen.

Root owns the final crop after inspecting the capture. Preferred creative treatment is the signature section including its real heading, `Ejemplo` badge and full circular field; wider application chrome is an alternative if root prefers it. Hide the floating review dock before the final capture so it does not become part of the product demonstration. A tighter crop may omit lower explanatory legend material but must not cut off the circular field or remove the example context. Preserve screenshot aspect ratio with `object-fit: contain`.

The screenshot stays Spanish, including on the English site; do not translate, regenerate, repaint, recolor or replace its existing UI text or numbers. Use a short English/Spanish caption to explain its context. Do not place it in a newly generated laptop or bend it with a large perspective transform.

## Rhythm

Aim for about **320svh per option**: a single sticky viewport plus about 2.2 viewport heights of travel. This is enough to read three actions without an unnecessarily long scroll tunnel. Preserve native wheel, touch, keyboard and reverse scrolling. No scroll interception, playhead timer, autonomous loop or video player controls.

Use normalized native scroll progress `p` from 0 to 1. The exact implementation may adjust ranges to avoid cramped text on compact screens, but the order and stable reading holds are fixed.

| Progress | Composition | Reading/motion intent |
| --- | --- | --- |
| 0.00–0.33 | Collect at home | First clip's extracted frames advance slowly with scroll. The real device remains on the upper arm, tube down. All short collection/preparation copy is readable, with a useful held last pose before the return. |
| 0.33–0.39 | Collect → Return | Soft overlapping dissolve between two whole coherent photographs, not a hard cut or a morph of the device into an envelope. Use at most 8–12px of settling travel. The outgoing image remains until the incoming frame is ready. |
| 0.39–0.64 | Protected prepaid return | Second clip's extracted frames advance with scroll, then hold the protected sample/envelope. The sample is capped and sealed inside its protective carrier before the prepaid envelope. Never animate the used Tasso device into the return materials. |
| 0.64–0.72 | Return → Actual dashboard | The envelope scene settles. A quiet surface-matched dissolve reveals the actual dashboard capture. The image is a distinct new view, not an envelope transforming into an interface. Preserve a continuously occupied visual stage while both layers overlap. |
| 0.72–0.82 | Dashboard reveal | Genuine screenshot comes from 98% to 100% scale with, at most, an 8px settling move. Keep the title and example badge within the frame. No animated scores, invented data, pseudo-interactions or changing values. |
| 0.82–1.00 | Understand, held | Dashboard is sharp and still long enough to read. The result title, benefit and two-working-day laboratory-receipt timing remain visible together. Scrolling out continues naturally to the next page content. |

Short and long copy from the existing process script remains factual. Do not swap essential instructions in a narrow, fleeting scroll range. Caption transitions may be soft but must not overlap into illegible double text. At a stopped scroll position the composition must be stable.

## The four finishes

**Original.** Retain its authentic-device/illustrated-return aesthetic for the first two steps. At the results transition the quiet report illustration gives way to the same real dashboard capture used by the new directions. This is the updated baseline, not an old player beside new scroll scenes.

**Studio Precision.** Keep the ivory world and tactile photographic surface. The sealed return envelope gently resolves to the genuine warm-paper dashboard, with a small grounded shadow and generous margin. Nothing spins or floats. The difference comes from precision of material, crop and motion.

**Morning at Home.** Keep the natural kitchen ritual for collection and return. At step 3 let the table photograph dissolve into a clean warm-paper surround containing the real dashboard image. Do not map the screenshot onto the old generated laptop screen. The result is the real product view, clear and legible, following the familiar at-home action.

**Light into Insight.** Keep the ink surround and controlled amber material light for steps 1 and 2. Reveal the unchanged real dashboard on the same ink mat through a slightly longer soft overlap. Let the actual green signature be the only new color event. Do not apply amber tint to the UI or add neon, particles, light beams inside the body, holograms or synthetic screen graphics.

## Shared copy and image context

The three existing short step titles still work:

| English | Spanish |
| --- | --- |
| Collect at home. | Recoge tu muestra en casa. |
| Send your sample back. | Devuelve tu muestra. |
| Understand your results. | Comprende tus resultados. |

The third-step timing remains **2 working days from laboratory receipt.** / **2 días laborables desde la recepción en laboratorio.** It must not appear without the receipt qualifier. Benefit: **Biomarkers explained. A clearer picture over time.** / **Biomarcadores explicados. Una visión más clara en el tiempo.**

Screenshot context caption: **EVA app preview · Example data · Interface shown in Spanish.** / **Vista previa de la app EVA · Datos de ejemplo · Interfaz en español.** The `Ejemplo` marker in the real image is retained where practical, with this adjacent caption maintaining context on small screens.

Suggested alt text: **The actual EVA dashboard, showing the biological signature with example biomarker data in Spanish.** / **El panel real de EVA con la firma biológica y datos de biomarcadores de ejemplo en español.**

## Responsive, fallback and reverse paths

- Desktop may place copy beside the large image; phone places compact art above the active step copy. Reduce image height before cutting essential text. Every receipt qualifier and instruction line stays inside the readable viewport, including short phones.
- Reduced motion presents all three steps and their factual text as a static, visible sequence, using collection and return stills plus the same real dashboard image. No frame advancement, sticky trap, zoom or dissolve is needed. A page-load preference change must remain usable.
- Image loading failure keeps the last complete frame or a poster; never reveal a blank white/black flash while seeking a new frame. Readable step text and dashboard context survive media failure.
- A single deterministic progress mapping means reverse scrolling returns from the real dashboard through the protected envelope to the collection pose. It does not restart a clip, jump to a random frame or continue an independent animation after scroll stops.
- All three steps have semantic ordered-list content outside any `aria-hidden` canvas/film layer. Option navigation and step shortcuts may move native scroll; they must not reintroduce a player metaphor.

## Judge checks

Review all four complete scroll versions, not just the first/last stills. Confirm continuous forward/reverse movement, no hard cuts or blank loading transitions, readable stable holds, correct physical collection/return, no remaining generated results view, genuine dashboard color/geometry and example labeling, EN/ES receipt timing, compact-phone layout and the complete reduced-motion alternative. Any actual dashboard crop change returns to root for visual approval rather than a new generated asset.
