# v69 UX direction — slimmer dotted levels, SAVEE informed

## Decision

Keep v68's two quantitative dotted levels and make the **graphic itself visibly slimmer**: two dot rows instead of four, a 28px plotting slot instead of 48px, and a 14px ring instead of 20px. Preserve the common 0–5 scale, sample at 64%, lower-category end at 20%, lab end at 100%, all medical wording, 14px labels and 16px/24px body.

This is an Impeccable scoped refinement of the incumbent dashboard-derived pattern, not a new visual concept. Applied local layout/typeset/craft principles: preserve identity, let important relationships lead, distinguish tight related groups from larger separations, retain role typography, and judge actual rendering rather than detector scores. Slimming must reduce optical bulk without turning meaningful intervals into barely visible decoration.

## Public references actually inspected

I used the web tool to open the supplied SAVEE pages, then public HTTPS page/OG-preview retrieval where the web tool could not display them. I visually inspected the retrieved static previews. No login, private account, collection save or other write was used. Images inform principles only; none is imported into EVA.

| Public source | What was visibly inspected | Useful principle / boundary |
|---|---|---|
| https://savee.com/i/0wo95_h/ | Black circular-dot silhouette on a white field; public video poster frame | Sparse circular marks can define a clear shape. Only a still was inspected; no motion claim. |
| https://savee.com/i/N9DVbyn/ | Black square-cell capsule on muted warm ground; public video poster frame | Consistent cell rhythm and restrained two-tone contrast create an analog object. Do not copy its square-cell silhouette or imply video motion was reviewed. |
| https://savee.com/i/8qTYqaa/ | Translucent device tiles with white dotted numerical readings and delicate small controls | Keep luminous data precise and light against material depth. Useful companion to EVA's existing glass; no new glass asset is needed. |
| https://savee.com/i/bsOpHzA/ | Dark finance cards with narrow colored microcharts and quiet labels; public 420px preview | Thin data marks can remain distinct when contrast and hierarchy are controlled. Do not adopt finance red/green severity colors or the card grid. |
| https://savee.com/i/-LoagDG/ | Vitrium Opus poster with oversized condensed lettering, a car and a diagonal refractive glass form | Inspected, but not selected as the range-strip model. Its forceful display lettering and dramatic diagonal lens are inappropriate for this compact instrument. |
| https://savee.com/i/H49aDXP/ | Root-retrieved public Fey preview, which I also viewed: restrained dark interface with tiny line charts and fine controls | Strongest proportion cue: quiet micro-instrumentation with clear hierarchy rather than thick bands. The angled thumbnail limits exact typography/interaction assessment. |
| https://savee.com/i/e8DLcrz/ | Root-retrieved public Aurora mobile editorial collage, which I also viewed | Strong hierarchy and deliberate grouping at phone sizes. Preserve EVA's Hanken/Georgia; do not copy the reference's condensed type or dense poster layout. |

The Jamie Syke board index and public board page at https://savee.com/jamiesyke/boards/futuristic-ui-inspiration/ were accessible as metadata, including the board title and save count; the public web output did not expose the saved image grid. I do **not** claim to have visually inspected that full board. The original web-tool opens failed for the first three legacy IDs; direct public HTTPS returned 200 and exposed their OG thumbnails, which were then viewed. The old -LoagDG CDN thumbnail returned 403; its current public-page OG preview was accessible and inspected instead. These are access-method limits, not evidence of unseen motion or full-resolution artwork.

## Exact slim specification

- Keep **55 columns**, the same horizontal extent, same exact numeric endpoints and same scalar sample location. Change **4 rows → 2 rows**.
- Set the plot slot to **28px high**. Put row centres at **y=11 and y=17**: 6px vertical pitch, shared centre y=14. This creates an approximately 9px optical dot ribbon instead of the current roughly 24px field.
- Use included-dot radius **1.5px** and excluded-dot radius **0.7px**. Warm-white opacity **0.8 inside / 0.28 outside** is a suitable initial balance on the existing glass. Verify the real phone image and contrast; do not lower opacity simply to make it feel more refined.
- Use exact endpoint strokes from **y=5 to y=23**, 1px wide, at approximately **0.45 opacity**. They should frame a slim measuring ribbon, not dominate like fence posts. Keep strict <1/<5 semantics and exclude the terminal dot centred exactly at 5.
- Set the sample ring to **14px diameter**, 1px warm-white outline, dark backing and **4px centre dot**, centred at y=14. Preserve one simple ring; no halo, double rim or pulse. The point remains clear on the quiet outside field and the bright laboratory field.
- Keep the ordinary bold 3.2/3,2 scale label at the same 64% x-position. Keep one shared axis and no duplicate integer 3 collision.
- Retain the current **16px between level groups**, the relation of labels above/conclusions below, and the existing readable footer. The two plot-slot reductions alone reclaim **40px** of panel height. Do not mechanically shrink every gap: a thinner graphic needs enough editorial space around its labels to look intentional.
- Keep the header numeral, glass hue/rim/noise, section composition and all copy unchanged. The user's request concerns slimness and aesthetic refinement of the levels; it does not authorize a new type system or less clinical scope.

## Why this is visibly slimmer without losing the comparison

The two-row ribbon halves the vertical mark count and the 14px ring reduces marker diameter by 30%. The first-fifth category remains roughly eleven bright columns wide, while the full laboratory reference remains fifty-four bright columns. On a 320px phone, the horizontal rhythm and 1.5px included-dot radius retain readable presence; only unnecessary vertical mass is removed. The bright/dim contrast still draws actual spans, not a generic hairline.

With 55 columns × 2 rows, strict membership should produce **108 bright lab dots / 22 bright lower-category dots out of 110 per row-field**. Exact endpoint strokes and scale labels, rather than discrete dot rounding, remain the mathematical authority.

## Render acceptance

Compare actual v69 against native v68 at EN desktop and ES 320/390/768. It should immediately look slimmer and more deliberate while the two range lengths and same sample are equally apparent. Ensure the ring remains legible, lower-category bright dots do not fade into glass, conclusions stay associated with their sample, and the smaller plot does not collapse label/point spacing. Verify exact 0–5 geometry, text bounds, text/graphic contrast, static/calm/no-JavaScript completeness and the four sources.

No new animation is proposed. No SAVEE imagery, layout, private data or unseen motion should be claimed as implemented. This recommendation is based on inspected public still previews and the established EVA instrument.
