# Automatic signal passage

The accepted halftone field plays in place when at least 85% of the available viewport shows the scene. It retains the original dot positions, analog glyphs and emergence.

## Timing

- Field and first number emergence: 0.9 seconds.
- Fully formed readings (15, 90, TÚ): 79, 79 and 78 frames (about 2.63, 2.63 and 2.60 seconds).
- Flowing number changes: 8 frames / 0.267 seconds each, retaining every analog mask.
- Final release into the orb: 0.7 seconds.
- Total narrative: 10 seconds from frame 0 to 300 at 30 fps. The same dots continue flowing afterward.

Both numeral transformations are now substantially faster. Their eleven saved frames extend the complete reading holds, while the total remains ten seconds. Eight frames are the shortest transition that can show all nine states of the existing analog mask at 30 fps.

The Remotion narrative clock determines glyph formation; an independent material clock keeps the light moving during the reading holds. The waves run 15% faster throughout the narrative and continuing orb. Both use the same rate, with the last authored material frame handed directly to the ambient clock. At completion the terminal composition is explicit, avoiding dependence on the player displaying its last frame. The same canvas continues the orb at 30 paints per second without React frame updates. It pauses offscreen, in a hidden tab, or with the pause control. The canvas exposes `data-update-ms` for the entire ambient state calculation and paint, rather than GPU submission alone.

The four chapter buttons seek directly and preserve an explicit pause. Each has a fine progress track above its number and label. The fills follow actual player frames and the same chapter handovers as the captions. Direct DOM transforms avoid re-rendering React or the film for each progress update. Pauses, seeks and completion remain synchronized; the tracks stay filled while the final orb flows.

The final “Sigue descubriendo” link appears after the orb settles, leading to the next section (#una-perspectiva). Its arrow makes two small movements, then rests. Reduced motion uses the static explanation and an unanimated continue link.

## Verification

The first ordinary downward wheel/touch arrival receives a gentle 260 ms alignment and a minimum 400 ms acknowledgement. Scrolling resumes once the actual playback frame has advanced, with a 900 ms hard maximum if the player stalls. Passive listeners remember gestures beginning above the section, including touch momentum; blocking listeners exist only during this short arrival. A fling crossing the whole trigger window is caught while at least 40% of the stage remains below the viewport top. Readers already beyond that are never pulled back. Geometry is measured before scrolling, not on every wheel or animation frame.

Direct links, restored positions, keyboard navigation, reduced motion, paused playback and unavailable media bypass the arrival. Upward scrolling and navigation immediately release it. This does not hold visitors for the 10-second sequence. The stage is exactly 100svh, with a short 25svh native sticky runway; all four timeline steps fit on shorter phones, and continued scrolling remains available. Unchanged ResizeObserver dimensions retain the current Player props, so mobile browser chrome does not repeatedly reseek the sequence. Timeline fills also skip unchanged style writes.

`node scripts/check-signal-arrival.mjs` checks wheel/touch momentum including a one-tick window crossing, cached geometry, alignment and minimum/hard-limit timing, observed-frame release, one-time behavior, upward/keyboard escape, pause/failure, direct links, reduced motion, browser-chrome height changes and cleanup. This deterministic event test does not replace real mobile compositor testing.

`node scripts/check-signal-playback.mjs` checks the 10-second total, longer reading holds, every mask in the eight-frame transitions, monotonic narrative timing, timeline/caption alignment, 15% faster waves before and after completion, identical dot coordinates across stages, smooth radii/opacity changes, and matching final/ambient states on desktop and mobile. `node scripts/check-body-signal.mjs` preserves the original authored-film regression checks.

Also verify in the browser: automatic entry, pause/resume, direct chapter selection, continuous terminal orb, completion-only arrow, and pausing after continuing to the next section. Timing checks verify the authored sequence; frame rate still depends on the visitor's device.

Previous source is retained in Git and the prior saved Site version (43).
