# Light into Insight — cinematic scroll review

**Final decision: PASS for the Light comparison implementation, after three review loops.**

## Scope

Only Light into Insight is being revised. Original, Studio Precision and Morning at Home must retain their existing presentation and behavior. The earlier all-option dissolve review does not approve this stricter Light treatment.

## Visual acceptance gate

1. **No double exposure.** No whole-scene opacity dissolve, ghosted simultaneous images or superimposed interface/arm/envelope frames at transitions. Replacing the dissolve with an unexplained generic slide or an unrelated wipe alone is not enough.
2. **Intentional continuity.** Movement has a clear visual cause: a shared spatial path, material handoff or controlled motif joins collection, protected return and understanding. The viewer should understand the relationship between the steps while objects retain believable identities. Do not morph the medical device into anatomy, packaging or data.
3. **Actual dashboard motion.** Step 3 must visibly develop through multiple distinct, authentic states of the existing dashboard. Translating or scaling one screenshot does not satisfy this request. Do not invent UI, figures, marker results or interactions. Each source state must be traceable to the real demo interface, and the example context stays clear.
4. **Scroll fidelity.** Forward and reverse scroll follow the same choreography; stopping scroll stops the visual state. No video players, time-based playback or uncontrolled loops. Meaningful copy and keyboard step jumps remain readable and usable.
5. **Responsive craft.** Desktop and phone frames have deliberate compositions, smooth boundaries and no clipped or layered copy. The sequence must still explain collection, protected prepaid return and results from laboratory receipt.
6. **Bounded regression.** The other three directions remain unchanged. Reduced motion supplies the essential Light sequence and true dashboard states without requiring the cinematic movement.

## Evidence required

Review actual desktop and phone captures at held states and dense transition positions, plus a short assembled preview of the rendered scroll sequence. Inspect the authentic dashboard source states before accepting their animated use. Numerical frame/scroll tests supplement this judgment; they cannot establish cinematic quality or readability alone.

## Review loops

### Loop 1 — FAIL visual craft

Reviewed the real dashboard source states (signature, ApoB, hsCRP and closed) and rendered scroll captures under `/workspace/eva-light-cinematic-preview`. The authentic UI recording passes the source gate. The implementation does not yet pass the visual gate.

- **Material handoff:** `desktop/0071.jpg` shows a blurry rotated square of paper grain without a recognizable envelope fold or edge. It reads as an unrelated flat wipe. Creative/executor correction: use a photographic envelope silhouette with visible flap, seam and dimensional lighting; establish its identity before it passes the lens. Retain opaque edit coverage using the verified interior of the photograph, excluding transparent margins.
- **Interface framing:** `phone/0092.jpg` shows a small, soft ApoB panel while cutting away most of the signature. The relation between the actual signature and selected result is unclear. Executor correction: keep the real signature and selected panel together in a deliberately framed, adequately resolved view; remove the excessive detail pan and hard portal clipping. The source UI itself must remain unchanged.

The focused browser test in `scripts/check-light-cinematic.py` checks real frame/pixel progression, stop/reverse, opaque photograph inset coverage, keyboard jumps, responsive copy bounds, reduced motion and frozen legacy asset/pixel regressions. Passing those checks alone does not clear these visual failures. Loop 2 must be judged from new actual desktop and phone captures. At most three total review loops are allowed.

### Loop 2 — material and dashboard corrections pass; compact spacing fails

Actual evidence: `/workspace/eva-light-cinematic-preview/loop-2/{desktop,phone}/`, the assembled desktop/phone previews, and `/workspace/eva-light-cinematic-review/loop-2/`. All seven browser cases passed their loaded functional checks. Two cut pairs also produced byte-identical full-stage PNGs immediately before/after their source changes, independently of the inset-geometry test. Original/Studio/Morning retained their approved source hashes, captions and sampled rendered pixels.

Visually inspected desktop approach `0029.jpg`, reveal `0071.jpg`, actual ApoB `0092.jpg`, held return, the phone approach/reveal, and normal/compact phone insight captures. The envelope now has a recognizable flap, paper edge, texture and contact shadow before its lens pass. The generic square source defect is resolved. There is one opaque material handoff rather than ghosted photography. The actual protected sample remains enclosed before the prepaid envelope.

Desktop keeps the full real signature and selected panel together. The normal phone uses two explicitly contextualized editorial close-ups from the same authentic recorded frame: the signature above and enlarged real result below. ApoB and hsCRP visibly change, and their source pixels/numbers remain unchanged. These layouts resolve the missing-orb and unreadable-phone failures.

**Remaining blocking correction:** `es-compact-apob.png` at 320×640 places the `03 / Comprende` eyebrow over the cream result panel at approximately y357–365. Reserve at least 12px between the actual result and that label. Executor owns a compact-only ring-size reduction; larger layouts and other directions must stay unchanged. The final Loop 3 is limited to that correction and the affected compact checks. A raster-versus-copy collision check was added to the reusable test after the earlier process loaded, so the new assertion is required for Loop 3.

### Loop 3 — PASS

Root executed the focused final compact case; the judge inspected both actual 320×640 ApoB and hsCRP captures in `/workspace/eva-light-cinematic-review/loop-3/`. The result ends around y345 and the process eyebrow begins around y357, leaving a clear gap. The signature and selected result remain visible and readable. The raster collision measure is zero for both real result states.

The final report records no issues, real UI frames 56/124, exact stopped/reversed pixel restoration, and byte-identical hidden-edit stage captures. All seven Loop 2 functional cases remain applicable; the final change only reduces the Light ring width on compact screens. Frozen source hashes are checked again before every run. The final decision retains the successful EN/ES desktop, normal phone, reduced-motion and legacy-regression evidence from Loop 2.

### Accepted result and practical limits

- One photographic envelope passes the camera to conceal each source change; there is no whole-scene dissolve or double exposure. The flap/edge is visible before and after macro coverage.
- Step 3 uses the actual recorded dashboard moving through signature, ApoB, hsCRP and closed states. Source recording and delivered UI assets are SHA-pinned in `tasso-light-source-reference.json`. The phone's two views are editorial crops of the same frame, not a newly drawn interface.
- Native scroll drives all frames; stopping and reversing restore the same visual states. Keyboard jumps and three complete reduced-motion steps pass. No video/audio elements or playback controls remain.
- Original, Studio Precision and Morning at Home retain their approved assets, captions and sampled rendered pixels.

The material bridge is an authored photographic composition, not a claim of one uninterrupted physical camera take. Validation uses real Chromium desktop/phone viewport rendering; it does not establish behavior on every physical device or slow network. No unresolved blocking visual defects remain in the reviewed implementation. Publication and any later homepage adoption remain root-owned actions.
