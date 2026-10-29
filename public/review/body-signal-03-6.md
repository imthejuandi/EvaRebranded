# Body Signal / EVA 03.6

The supplied SAVEE video remains at `/art/reference-body-signal.mp4`. Stationary lamps grow into coherent luminous islands, then resolve into rounded halftone type. This abstract field introduces “Interpretamos las señales de tu cuerpo” at `/#una-senal`. It is illustrative and represents no person's measurements.

The screen keeps exactly the same dimensions from the first frame through the last. Its 58×42 grid contains 2,436 stationary sites. Frames 0–165 animate the organic light field. Frames 165–270 contract each lamp toward its own halftone target. At frame270 the display reads15; subsequent chapters show90 andTÚ. The original scattered eight-step lamp switching is retained. There is no whole-word fade, travelling particle effect, circular reveal, or change in screen proportions.

## Halftone typography

Rounded numeral silhouettes are sampled into portable coverage masks by `scripts/sample-halftone.py`. Only coverage values are shipped; no font download is required at runtime. Edge coverage shapes the letterforms. A broad optical falloff varies dot size within the strokes. The largest diameter stays below87% of the grid pitch, preserving visible separation. The original equal-dot calculator remains available in `SignalFilm` and `AnalogSpecimen` for comparison.

- `lib/halftone-motion.ts`: stationary grid, varied radii, stepped changes.
- `lib/body-signal.ts`: deterministic organic field and continuous resolution.
- `BodySignalFilm`: full-size screen, moving text and optical bloom.
- `SignalPassage`: native scroll maps400svh onto631 frames, with four direct chapter controls.
- `HalftoneNumber`: static counterpart for reduced motion.
- `BodySignalSpecimen`: frame inspector at `/system#body-signal`.

All motion is frame-driven and reversible. Reduced motion retains the interpretation heading, settled halftone15 and business facts. Existing Soft Glass data and interactions remain unchanged.

## Tasso Glow

The official product photograph is the geometry reference for `/art/tasso-plus-glow-v1.png`. Built-in image generation applies the runner's coral, apricot and lilac optical light. A cream background and feathered mask blend the still into paper. The product keeps its orientation and moves only vertically: eight-pixel amplitude,150-frame period. This movement follows the scroll frame. Prompts and image provenance are in `/review/tasso-glow-provenance.json`.

## Preservation and verification

03.5's source and assets are retained at `/archive/eva-03-5-body-signal.zip`, with earlier archives separately linked from `/history`. The previous motion guide is `/review/body-signal-03-5.md`.

`check:body-signal` exercises all631 frames, exact grid registration, smooth resolution, varied radii and gaps, mixed endpoint lamps during transitions, backward reconstruction, and bounded product hover. `check:analog` preserves the legacy sequence checks. Content, delivery, TypeScript, and emoji scans supplement rendered desktop and mobile reviews. Live UI interaction checks were unavailable while the Mac was locked; deterministic Chrome composition renders remain available.
