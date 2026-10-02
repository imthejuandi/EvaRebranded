# Mobile runner rendering

The mobile hero keeps the same live running motion and scroll choreography. The original desktop media and other GlowMotion artwork retain their existing rendering.

## Reduced workload

| Work | Original | Mobile path |
| --- | --- | --- |
| Video dimensions | 864 × 1080 | 576 × 720 |
| Decoded pixels per frame | 933,120 | 414,720 |
| Download | 909,659 bytes | 482,026 bytes |
| Frame rate / duration | 24 fps / 5 seconds | Identical |
| Settled tracking DOM writes per frame | 45 | 10 |

The derivative has 55.6% fewer decoded pixels and 47.0% fewer bytes. It retains all 120 frame presentation timestamps and durations, the exact 4:5 source aspect, and every reviewed tracking pose. It adds no crop, frame interpolation or color treatment. The remaining ten tracking writes keep the leader paths, anchors, label positions and diagnostic media time live; settled opacity/dash values no longer receive redundant writes.

The hero's mobile video is no longer alpha-masked. A static inverse radial gradient overlays its opaque ink backing: transparent through 36%, then #0b1010 at 73%. This produces the same edge color as the original 36–73% alpha mask over that fixed backing. It avoids requiring a masked live-video group. The covered poster becomes hidden after native playback is ready and returns for reduced-motion/error fallback. Only TrackedRunner opts into this mode; other artwork keeps its alpha mask. Label shadows are retained.

For scale, at a 390 × 844 CSS viewport the runner occupies about 351 × 591 CSS pixels. At device pixel ratio 3, one RGBA backing surface at that size would be about 1.87 million pixels / 7.12 MiB. This is an estimate of potential surface size, not a measured browser layer count or GPU allocation.

## Asset provenance

- Original: `public/art/runner-athletic-loop.mp4`, preserved unchanged.
- Original SHA-256: `0030e13e31609cfcfc3ed00a6b4286bd13a7d16cce925daa9549ac9bf9e9e656`.
- Mobile: `public/art/runner-athletic-mobile.mp4`.
- Mobile SHA-256: `62db0db33ecd6fbff2792198e1b606b582be5b2c45a18f8008b70057727b1bc8`.
- Encoding: H.264/yuv420p, Lanczos resize, CRF 20, same frame timestamps, fast-start MP4, no audio.

Exact command, using the installed Remotion encoder:

```sh
env DYLD_LIBRARY_PATH=./node_modules/@remotion/compositor-darwin-arm64 node_modules/@remotion/compositor-darwin-arm64/ffmpeg -hide_banner -loglevel error -i public/art/runner-athletic-loop.mp4 -map 0:v:0 -vf scale=576:720:flags=lanczos -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -fps_mode passthrough -an -movflags +faststart public/art/runner-athletic-mobile.mp4
```

## Verification

`node scripts/check-runner-media.mjs` checks actual encoded dimensions, frame count, frame timestamps/durations, unchanged tracker geometry over all 120 poses, gradient equivalence and the production draw loop's before/after DOM-write workload. It verifies mobile/native opt-in for the overlay. These are workload and fidelity checks; physical-phone frame rate is not measured. Browser QA must also cover startup, live rightward exit, reverse scrolling, pause/resume, reduced motion and poster fallback.
