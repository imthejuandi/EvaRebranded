# Glow Motion — EVA component

## Intent
Communicate vitality through an adult endurance athlete moving naturally, with the optical language of SAVEE: amber light, blue/lilac edges, soft defocus, directional bloom and fine grain. The human subject and sportswear should remain recognizable. This is an art-direction choice, not a claim that appearance establishes a person's health.

## Reuse
`GlowMotion` accepts `poster`, optional `video`, `enabled`, `active`, `alt`, `mask`, `className`, `style`, `inComposition` and `onPlaybackBlocked`. Set `inComposition` only inside a Remotion composition; standalone use defaults to a native image. Its container must have a defined height or aspect ratio. The source asset carries the glow, blur and grain; do not substitute an ordinary photo with a heavy CSS blur. Use the supplied elliptical edge mask against #0b1010.

## Motion contract
Native ambient playback is silent, inline and loops forward. Keep the instance mounted during scroll so the gait does not restart. Pause offscreen, when the page is hidden, when `active` or `enabled` is false, or when reduced motion is requested. A visible pause control accompanies the landing-page loop. Show the poster if media playback is unavailable.

Scroll still controls the Remotion frame, scene positions and chapter transitions. The ambient gait is intentionally time-based following the user's refinement request. In the timeline inspector, ambient motion is disabled by default for repeatable still comparisons. Remotion Studio and server renders use frame-synchronized Html5Video; client-side rendering uses the poster.

## Quality gates
Verify the athlete reads as an active runner in normal kit; inspect natural forward gait and loop seam; confirm no camera drift or sharp background rectangle; keep the original chromatic bloom and grain; test pause/resume, offscreen pause, reduced motion, mobile framing, and unchanged scroll geometry.

Original 03.0 assets and source remain recoverable in the archive. This refinement changes the opening runner and creates the reusable component; the remaining EVA story keeps its accepted structure.
