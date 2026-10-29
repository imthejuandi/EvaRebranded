# Tasso scroll comparison review

## Current brief

The four comparison directions now use scroll-controlled three-step animations. They do not use video players or playback controls. Every direction's third step must show the actual dashboard captured from this site's fresh demo `/es/dashboard`, preserving its real interface and demo status rather than generating a replacement report.

This is a new acceptance scope. The earlier film-player pass does not approve this scroll implementation.

## Acceptance gate

- **Scroll owns motion.** Forward and reverse scrolling choose the corresponding scene/frame. At a stopped position, the drawn frame remains stable. No video/audio element, time-based playback, autonomous reveal or media controls are present on the comparison page.
- **Continuous explanation.** Collection, protected prepaid return, and results follow in a coherent three-step sequence. Section entry, scene boundaries and reverse traversal do not produce blank loading canvases, visible flash frames, abrupt image jumps or layered illegible captions.
- **Real dashboard.** All four step-3 presentations use the root-captured actual dashboard asset. Its interface, figures, labels and demo badge are preserved. A generated tablet/report, invented graph or restyled approximation does not satisfy this requirement. The image must be legible enough to recognize the real product, with an honest demo label and bilingual surrounding explanation.
- **Readable controls and semantics.** The selected step has clear text outside the decorative canvas. Keyboard-operable step jumps map to the same scroll positions as ordinary scrolling, retain focus and accurately indicate the selected step. No hidden player controls remain.
- **Responsive and accessible.** Verify EN/ES desktop and phone layouts, no horizontal overflow or clipped essential text. Reduced motion presents three static steps per direction, including the real dashboard, without needing scroll animation to reveal essential content.
- **Bounded delivery.** Frame atlases load with a usable poster/fallback and without decoding the entire image sequence at once. Phone canvases and retained atlas bitmaps use 600px frame output. Browser errors and missing frame/dashboard assets fail the gate.

## Status

## Final decision — PASS

The current scroll-only comparison passes its first scope-specific review loop. Seven fresh Chromium cases passed: EN/ES desktop 1440×900, EN/ES phone 390×844, ES compact phone 320×640, and EN/ES reduced-motion phone. The completed run is recorded at `/workspace/eva-tasso-scroll-review/loop-1/browser-report.json`; its screenshots remain in the same directory. No new test run was necessary after the temporary workspace interruption because the source and completed evidence remained intact.

The browser acceptance verifies actual canvas-pixel changes under forward scroll, a stable frame/pixel hash while stopped, and restoration of the same image on reverse scroll. It also verifies keyboard jumps and retained focus, zero video/audio elements or playback controls, all four real dashboard presentations, a maximum two-entry decoded atlas cache, 600px phone canvas output, loaded-frame/poster fallbacks, no reported browser errors or missing scroll assets, no horizontal overflow, and no essential caption/navigation overlap. Each reduced-motion case exposes all 12 static steps across the four directions without animated canvases.

The judge independently inspected the actual Studio collection, return and dashboard desktop renders; desktop transition positions `.36` and `.68`; English phone and Spanish compact-phone dashboard states; a Spanish phone boundary; an English reduced-motion dashboard state; and the Light desktop dashboard. The step captions remain single and readable at the sampled transitions. Images blend continuously without a blank intermediate scene or hard image cut in the reviewed captures. The four directions remain clearly identified.

The third step shows the real green circular signature from `/es/dashboard`, including the Spanish interface, biological age 29, EVA Score 82, biomarker ring, and visible example context. Its canonical 1296×780 source is pinned by `docs/tasso-dashboard-reference.json` (SHA-256 `c8bf25730c37fb80957cb76096858e0e625b17bbadfe7b937eaa7ca40cce8fde`). Every direction uses that same approved asset, rather than a generated report. Phone presentation contains the full interface with surrounding text identifying it as actual example data and linking to the dashboard.

**Ready to publish to the existing review comparison link.** No correction loop or third-party action remains for this review gate. This approves the comparison experience; it does not choose a direction or replace the current homepage automatically.

## Limits

The browser matrix uses Chromium with phone emulation, not every physical device or browser engine. Boundary and motion samples are bounded observations rather than a claim to have inspected every possible scroll pixel. Atlas memory checks cover the retained two-bitmap cache and phone frame output; compressed source sheets are shared rather than separate lower-bandwidth mobile URLs. The dashboard contains existing demo data, and this review does not validate medical outcomes or laboratory operations.
