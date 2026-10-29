# Tasso film directions — visual review

## Brief and gate

The original three-step version remains available for comparison. Three **new** image-to-video directions are being evaluated: Studio Precision, Morning At Home, and Light Into Insight. This is a new visual-review cycle with at most three loops.

The earlier CSS/photograph story is not the quality threshold for this brief. A new direction must show deliberate cinematic movement within its subject and materials. A dissolve or digital zoom over still images alone does not meet the requested new film treatment.

## Acceptance criteria

1. **Cinematic substance:** coherent camera movement, lighting or material action that reveals something useful; a stable composition with controlled focus and restrained pacing. No arbitrary orbit, morphing object, decorative particles, synthetic sheen or looping wobble.
2. **Product fidelity:** recognizable white Tasso housing, coral actuator and plausible lower connector/tube. Geometry remains stable throughout the shot. No extra buttons, changing logos, bending plastic, spontaneous tube changes or fabricated blood-filling effect.
3. **Human accuracy:** credible anatomy, natural contact and correct upper-arm placement on a seated adult with the collection arm relaxed down. Attached tube points down. No extra fingers, skin merging, impossible hand movement or physically misleading demonstration. A conceptual shot must not masquerade as complete device instructions.
4. **Business clarity:** home delivery/collection → protected prepaid return → results in context. Show the capped sample inside a closed/sealed protective carrier before the outer return envelope; never mail a naked tube or the entire used device. Result artwork must not fabricate personal values or diagnoses. The two-working-day promise remains qualified by laboratory receipt in page copy.
5. **Editorial control:** typography belongs to the webpage or a deliberately authored overlay, not distorted generated lettering. Each concept has a distinct visual idea while staying within EVA’s restrained brand. It should feel intentional and useful, not like a generic AI health advertisement.
6. **Review-page integrity:** the original is clearly labeled and retained; all three new directions are separately labeled and playable. Poster, playback, loading/error fallback, responsive layout and reduced-motion behavior are clear. A missing or failed render is reported as missing, not counted as a finished film.

## Review method

Inspect actual generated frames across each clip, including intermediate motion states and the final frame. Review real playback or the root-provided browser recording where available. Inspect the comparison page at desktop and phone sizes. Technical delivery checks supplement this visual judgment; they do not establish realism or motion quality by themselves.

## Status

Final decision: **PASS for the four-way review comparison**, after two media-review loops and the completed browser acceptance checks. The original remains available and unchanged while the three new film directions are reviewed.

Still-image preflight: the judge inspected all nine new stills. Product placement and downward tubes are credible; return samples are capped and visibly protected; report surfaces contain no invented medical results. The three directions are visually distinct. Morning collection is more posed/direct-to-camera than the intended quiet documentary tone; animation should keep its expression restrained. Hand-free return stills must not be animated with autonomous package movement or a nonexistent pre-positioned hand. Packaging form factors remain illustrative concepts rather than verified photographs of EVA's exact supplied kit. This preflight permits I2V work; it does not establish video stability or final production readiness.

| Direction | Motion and cinematic clarity | Device/anatomy fidelity | Return and results accuracy | Decision |
| --- | --- | --- | --- | --- |
| Studio Precision | Controlled product camera movement, convincing protective-carrier insertion, restrained report scene | Stable in five sampled frames per clip | Protected return; no fabricated results | PASS for comparison; strongest recommendation |
| Morning At Home | Natural breathing/gaze, clear packing/sealing action, quiet final reading hold | Device remains attached, tube down; credible hands | Corrected insight keeps a stable nontext graphic | PASS for comparison after Loop 2 |
| Light Into Insight | Distinct low-key lighting, product camera movement and grounded packing action | Stable in sampled frames | Protected sample, no invented results; incidental label print could be cleaner | PASS for comparison |

### First actual-motion batch

Sampled `studio-return`, `studio-insight`, and `morning-collect` at 0.1, 1.2, 2.5, 3.8 and 4.8 seconds from the real generated clips. Studio return shows a natural hand entering, gripping the outside of the sealed carrier, inserting the whole protected sample into the envelope, then withdrawing. Studio insight has camera/parallax and a small plausible paper-edge movement without generated medical text. Morning collection has blink, breathing and a glance toward the device; the device remains anchored and its attached tube stays down in the sampled frames. All three clear the initial motion gate. Morning retains a more posed advertising tone than the other directions, which remains a creative distinction for comparison.

The sampled web delivery for Studio return is silent H.264, 1912×1080, 24fps, 5.04 seconds.

### Complete initial motion review — one correction

The judge inspected the same five time samples across all nine real generated clips (45 frames total). Studio collection and Light collection retain the white housing, coral actuator and attached downward tube under camera movement. Morning return demonstrates the protected pouch entering the envelope and the outer flap being closed. Light return likewise moves the whole protected package with a natural hand. Insight shots retain real material/camera movement, rather than webpage zooms standing in for video.

One actual render defect requires correction: `morning-insight` starts with a neutral graphic screen but creates tiny AI-generated paragraphs at approximately 1.2 seconds and retains them through the later samples. This violates the intended invariant, nontext report surface. Regenerate only that clip with no scrolling or screen-content change; retain the natural subject/camera movement. The other eight clips clear the sampled anatomy, geometry, action and medical-outcome gate.

Creative preference: Studio Precision is the clearest, most controlled direction for the product explanation. Morning is approachable but more posed/advertising-like. Light is the strongest atmospheric alternative; its incidental vial-label pseudo-print merits prop finishing if selected for a final hero, rather than being mistaken for verified kit labeling.

### Loop 2 — all three media candidates pass

The corrected Morning insight was independently inspected at the same five sample times in `/workspace/eva-film-media/frames/morning-insight-loop2`. Its tablet surface remains the same neutral graphic, with no spontaneous paragraphs or fabricated medical information. Hands, tablet and anatomy remain stable. This is now a very quiet reading hold with minimal motion, suitable as the closing beat after the direction's more active collection and return shots. It should not be described as a dramatic camera shot.

All three complete film directions now pass the sampled media-candidate gate. Two review loops were used, with no third media regeneration required. Studio Precision remains the strongest recommendation for clear product communication; the alternatives provide approachable lifestyle and low-key atmospheric choices.

### Comparison page — PASS

The judge-authored `scripts/check-film-options.py` was executed by the root against the fresh export. All four cases passed: English desktop 1440×900, English phone 390×844, Spanish phone 390×844, and English reduced-motion phone. Evidence: `/workspace/eva-film-page-review/loop-1/browser-report.json`.

The checks verified four separate options and all 12 ready scene entries, correct scene/video/poster/caption mapping, laboratory-receipt timing, no initial autoplay, manual play/pause, scene selection, cross-option pause, and a normally timed complete three-clip Studio sequence with actual end-event auto-advance. There were no tested page errors, horizontal overflow or film-error states. The judge independently inspected the desktop Studio player and representative English-phone, Spanish-phone and reduced-motion player captures; footage remains framed clearly with native controls at each size.

**Publication decision: ready for the separate comparison page.** All three newly generated directions are genuine moving-image candidates, and the original is retained as its own fourth option. This does not select or automatically replace the current homepage treatment. No third media-review loop is required.

Sampling five moments per clip is a bounded visual inspection, not a claim to have examined every decoded frame or tested clinical operations. Browser coverage is Chromium with phone emulation; it does not claim every physical device/browser. Packaging and incidental labels are concept props rather than verified final EVA kit specifications. If a direction is selected for the final hero, exact production props and that selected film's final edit can be refined without presenting invented medical data.
