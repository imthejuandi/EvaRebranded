# Body Signal / EVA 03.9

A living dot field opens across the entire screen, including behind readable mobile text. Those same lamps form the numerals. Each unused lamp retires during the reveal; once the number settles, only its glyph dots remain visible. The surrounding screen, counters and inter-character gaps are clear.

## One continuous material

`lib/living-lamp.ts` supplies the shared radius and light variation. Numeral guidance never changes a lamp's position, radius function, clock or optical material. `lib/body-signal.ts` retires the entire opacity of each unused lamp with a deterministic, individually offset envelope. This includes the opening visibility floor, so no ghost grid remains. All lamp identities stay in the model for exact reverse scrolling.

`BodySignalFilm` keeps one persistent halo and sharp core throughout all 631 frames. Zero-intensity groups are omitted from its paths. There is no renderer handoff at frame 270, separate numeral layer or radius target. The halftone texture continues to move within the settled numerals.

The reference remains `/art/reference-body-signal.mp4`. Angular 5×7 silhouettes retain stepped shoulders, counters and a slashed zero. Settled 15 / 90 / TÚ contain exactly 675 / 875 / 670 visible lamps. Subsequent number changes preserve the original individual-lamp stepped switching.

## Mobile and reduced motion

The opening field reaches every edge, including behind titles, captions and controls. A soft brightness veil and local text shadow preserve legibility. During resolution, unused lamps retire everywhere; the final numeral stands against a clear background. The shared minimum radius keeps individual dots substantial on compact mobile screens.

Reduced motion retains the static `HalftoneNumber` presentation. The reusable specimen and frame inspector remain at `/system#body-signal`.

## Bounded review

`check:body-signal` checks all 631 frames for stable lamp positions, uninterrupted radius and clock, deterministic reverse reconstruction, and exact zero opacity for every non-glyph lamp after resolution. Endpoint counts are checked at desktop, mobile and compact mobile sizes. Opening mobile visibility and text-area brightness remain bounded. The frame 269/270 boundary is checked for sudden opacity changes.

Desktop opening, midpoint and settled frames, plus a 320×568 settled frame, were rendered and visually reviewed. The field resolves into a clear numeral without leaving a rectangular background or residual dots. Existing analog, content, delivery, TypeScript and build checks are retained. Frame renders are distinct from live UI or assistive-technology testing.

03.8 source and assets remain at `/archive/eva-03-8-continuous-field.zip`; its guide is `/review/body-signal-03-8.md`. Earlier versions remain downloadable from `/history`.
