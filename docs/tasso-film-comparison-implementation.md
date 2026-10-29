# Tasso scroll comparison implementation

This revision replaces every native player with a deterministic native-page-scroll sequence. It retains the original plus Studio Precision, Morning at Home and Light into Insight. No new media generation is required. Existing rendered material supplies image-frame atlases for collection and return; every results step uses the same actual EVA dashboard screenshot.

## Dashboard first

Before implementing the third-step framing, the executor inspected the real `/es/dashboard` reference capture, including its Spanish heading, green circular biomarker field, `Ejemplo` badge and existing example values. The final root-approved crop is `/art/tasso-scroll/eva-dashboard.jpg`, 1296×780. The image is displayed unchanged with `object-fit: contain`, its genuine colors and aspect ratio, and an adjacent EN/ES example-data/Spanish-interface caption. Scroll reveals it from 98% to 100% scale, then holds it. There is no generated tablet, replacement report, invented result, repainted UI or changing score. A link opens the real app preview.

## Files and asset contract

- EN/ES routes remain `/review/tasso-options` and preserve their location when language switches.
- `TassoFilmOptions.tsx` owns semantic layout, step shortcuts, reduced-motion rendering and a single page-scoped native scroll subscription.
- `tasso-film-options.css` scopes the sticky/responsive comparison layout; `tasso-scroll-copy.ts` holds bilingual copy.
- `lib/tasso-scroll-atlas.ts` owns the two-entry bitmap cache and pure scroll/atlas mappings.
- `lib/site-content/tasso-scroll-options.json` is manifest version 2. Root owns the real frame extraction, screenshot capture and readiness values.

Each of four options has two scene records (`collect`, `return`) with `ready`, `poster`, `frameWidth`, `frameHeight`, `fps`, `frameCount`, `columns`, `rows`, `framesPerSheet` and `atlases`. The agreed format is 1200×675 frames, sampled at 12fps, 60 frames per scene, arranged in five 3×4 WebP sheets. The shared `dashboard` record supplies `ready`, `src`, `width` and `height`. The old video manifest is not read by the page.

## Choreography

Each option occupies 380svh, within the requested 350–400svh range, with one sticky viewport. Native progress is `(scrollY - sectionTop) / (sectionHeight - stickyHeight)`, clamped to 0–1. No wheel interception, scrolling lock, autoplay timer, media clock or video/audio element is used.

- 0–.33: collection frames advance, then hold.
- .33–.39: whole-image dissolve to return; collection's last frame remains occupied.
- .39–.64: return frames advance, then hold.
- .64–.72: dissolve to the actual dashboard image.
- .72–.82: dashboard scale settles from 98% to 100%; .82–1 holds it sharp and still.

Only one sharp caption is shown at a time, switching at .36/.68 rather than superimposing paragraphs during the image dissolve. Step buttons jump to .20/.52/.86 with native instant scroll. Reverse scrolling uses exactly the same mapping. Stopped scroll produces no frame advancement.

## Loading and memory

Only the closest visible sticky option requests atlas bitmaps. Near options use native lazy posters. One page-scoped LRU retains at most two decoded sheets globally, closes evicted ImageBitmaps, serializes fetch/decode work and aborts stale requests. At phone widths the atlas is resized during decode to 600px per frame: retained sheets are approximately 9.72MB each, rather than full-resolution 38.88MB each. The cache and requests are disposed on unmount or reduced-motion change. A viewport-mode change also releases the old cache.

If a requested sheet has not decoded, the last complete canvas frame remains visible; a native poster occupies a canvas that has not yet drawn. The page does not clear to a blank frame while loading. A missing/unready asset remains an honest preparation state. The dashboard screenshot is independent of the sprite cache.

## Semantics and reduced motion

All captions are HTML outside the canvas. Each option has three native keyboard-operable step buttons and a semantic ordered-list transcript. The complete process and manufacturer's actual full-instructions link are available below the comparison. The two-working-day statement is always paired with laboratory receipt.

Reduced motion mounts twelve plain static states: collection and return stills plus the real dashboard for each option. It does not create atlas requests, sticky scroll tunnels, zooms, dissolves or player controls. Essential content does not depend on successful drawing.

## Judge hooks

- Option: `[data-film-option]`; sticky viewport: `[data-tasso-scroll-stage]`.
- Canvas: `[data-tasso-atlas-canvas]`; `data-rendered-frame`, `data-rendered-scene` and `data-atlas-src` are assigned only after the actual draw.
- Caption: `[data-tasso-scroll-caption]`; shortcuts: `[data-tasso-jump]` with `aria-pressed`/`aria-current`.
- Screenshot: `img[data-tasso-dashboard]`; static states: `[data-tasso-static-step]` inside `[data-tasso-reduced]`.
- Root diagnostics expose retained bitmap count/bytes without product-visible debug UI.

Root owns builds, browser checks, GitHub and publication. The judge should validate real canvas pixels for forward/reverse/stopped behavior, the actual screenshot source and displayed content, compact layouts and the complete reduced-motion alternative. Diagnostic attributes alone do not prove visual acceptance.
