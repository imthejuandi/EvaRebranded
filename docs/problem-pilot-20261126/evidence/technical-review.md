# Independent technical review

Reviewer gpt-6.2-sol, medium. Applied the supplied Master Workflow v1 and EVA Preview Review v3, plus the installed Impeccable Layout and Typeset exercises. The integrator supplied a frozen brief and context receipt. I used the incumbent EVA code and rendered artifacts as visual authority, with the brief in place of a new structured interview. The integrator owns all product files.

## Identity and reproduction

| Run | UI source | Sorted artifact manifest SHA-256 |
| --- | --- | --- |
| Archived v70 baseline | `58bac762100a18c440b38429dee95f4663194e2d` | `c8ce50122139a10d3c27ab0bf9fe2996f687102df02b5c7eaf56a9548496769e` |
| First candidate | `fef06dc31f6e6618961c989f9942b4540bf17e3d` | See [first render receipt](candidate-first/render-report.json) |
| Corrected candidate | `6e0769f41434e8cc574a3b5fa87332d1ecf44a73` | `ec001ce8f0673a0553cd62241fde38bf89a814c50a1f38205ca715ea1be4c5df` |

The artifact hash covers sorted path and file SHA-256 pairs. The manifests pin each pathname and byte identity. Chromium 156.0.8078.79 loaded exact production artifacts through the established direct fulfillment method. Same-origin asset reads, real HTTP 206 byte ranges and browser-local fictional controls were exercised. All attempts to access external origins or mutate network state were blocked. Browser runs used emulated viewports.

Run `node render.cjs baseline` or `node render.cjs candidate` from this evidence directory. The baseline runner uses extracted pinned v70 files and the saved pre-integration source manifest. The candidate runner uses the current checkout and its matching `dist/client`. `node supplement.cjs baseline` and `node supplement.cjs candidate` exercise Tasso, kit and the two signup destinations, stopping at the forms. `node compare.cjs` compares the completed receipts and writes the matched reader-sequence map.

## First candidate failure and correction

The baseline navigated to chapter four and reported `biomarcadores`. The first candidate aligned the same section at the viewport top but reported `una-senal` across all 12 profiles. Direct gallery hash loads repeated the wrong result in both fallback profiles. At English desktop the closed gallery shrank from 473px to 140px. The signal chapter moved from 472.39px to 140.39px below the top, crossing the 450px midpoint probe. Browser navigation itself remained correct.

The smallest correction preserves the existing resolver unless the following signal chapter wins while a short gallery still has more than 1 CSS pixel below the top edge. It uses current positions, without storing click state or changing layout. Final coverage exercises ordinary chapter buttons, direct deep links, a bare read at the gallery, an ordinary scroll past its bottom, a return into its bounds, and the expanded gallery under the original midpoint behavior. At English desktop the corrected reader selects gallery at a 140.39px bottom, signal when that bottom is −2.61px, gallery again at 112.39px, and the expanded gallery at 687.98px. [First failing run](candidate-first/render-report.json) · [Final browser receipt](candidate/render-report.json)

The initial baseline test had two harness mismatches. The 58% position serialized as `57.99999999999999%`, and an Escape input sent during pending SSR preceded the hydrated listener. Corrected checks retain exact value and cutoff strings, afford 0.01 percentage points for float serialization, and exercise the original key behavior after the page enters `watching`. The no-JavaScript test waits for fonts without requesting an animation callback. The retained [initial baseline attempt](baseline/render-initial.json) records these harness limitations and the interruption of its incomplete tail.

## Impeccable Layout and Typeset

- **Reading order and grouping pass.** The pale opening statement leads into the practical paragraph, which sits 16px above the familiar compact report. On desktop the headline establishes the example while the glass anchors the value and fictional label. On phones the intro, depth selector, report and CTA stack in that sequence. The collection returns to dark at a clear boundary. The later dashboard remains a separate native disclosure. [Desktop join](candidate/en-1366-normal-join.png) · [Spanish reduced phone join](candidate/es-390-reduced-join.png)
- **Type authority, hierarchy and measure pass.** The new paragraph renders in loaded EVA Hanken 400 at 16px with 24px leading. It spans two lines on English desktop and four at Spanish 320px. The narrow Spanish box is 272px wide and its widest text line is 254.95px. The established roman/italic display heading, quiet control label and fictional metadata retain their roles. Computed contrast of the new text against its opaque backing is 16.83:1. No additional font files or variables were introduced. [Computed type and contrast](candidate/supplement-report.json)
- **Adaptation and control pass.** Both languages run at 1366×900, 390×844 and 320×844 with and without reduced motion. All three explanation settings are selected by keyboard with focus restored and the native history disclosure opens independently. Font readiness is checked before measured type. The candidate regions are exposed with distinct, localized accessible names in Chromium. [Main browser receipt](candidate/render-report.json) · [Region lookup](candidate/aria-cross-check.json)
- **Mechanical evidence.** The root's single manual Impeccable detector over the changed UI targets returned an empty result. The later correction changes only the chapter position helper. The visual judgment above uses the corrected artifact. [Detector receipt](impeccable-detect.json)

## Material verdicts

| Criterion | Baseline | Corrected candidate | Evidence |
| --- | --- | --- | --- |
| Source and artifact identity and protected surface | PASS | PASS | Sorted manifests and root's exact diff guard. Five allowlisted product files changed. The hero, runner, original actions and clinical fixtures remain byte-identical where protected. The allowed helper exception is visible in the patch. |
| Practical difficulty and one compact Alex before collection and kit | FAIL | PASS | Baseline serialized and rendered Alex after the kit and independent range. Candidate renders one short difficulty paragraph followed by the original case before both collection and kit. |
| Fictional Alex and separate independent range | PASS | PASS | All keyboard depth states retain 2.1 mg/L and 0.8/0.9/0.8/2.1, self-reported hard exercise within 24 hours and absence of reported recent illness. Independent range retains 2.9, <3 and <1. |
| Type, spacing, keyboard controls and recognized region names | PASS for existing UI | PASS | New paragraph renders in loaded EVA Hanken 400 at 16px/24px in the existing palette. Verified placement, closed details and distinct localized region names. |
| Original hero and actions including fallback | PASS | PASS | Browser verified original entrance callback in ordinary mode, keyboard-triggered skip, art with both localized actions, reduced motion, media abort and no-JavaScript poster. Both signup destinations preserved the exact originally encoded hrefs and rendered the intended account form. |
| Native Tasso, kit and later dashboard destinations | PASS | PASS | Tasso native-speed playback, previous/next and keyboard pause. Kit's 13 markers and reversible 500ms reveal. Separate dashboard series 2.8/2.5/2.7/2.1. Corrected chapter reader and direct hash checks. |
| Matched before/after sequences | PASS | PASS | The first English and Spanish report screens share the same origin and frame budget across builds. Desktop uses 3 frames, budget 1,404px. Phone uses 4 frames, budget 1,974px. Both include the original statement, collection and first kit boundary. |
| Hosted preview and physical device | UNVERIFIED | UNVERIFIED | The fixture uses an extracted production artifact in Chromium. Managed preview startup was unavailable and no physical-device run was performed. |
| Customer comprehension | UNVERIFIED | UNVERIFIED | Technical review establishes visible wording and order. The independent fresh-reader observations are separate from evidence of real customer comprehension. |

The baseline and final candidate each passed 12 primary browser profiles and 12 fallbacks. Both completed two supplemental Tasso/kit/signup profiles. The candidate also passed two computed accessibility-region checks. The comparison across both builds passed all 31 checks. The candidate main run fulfilled 20 video range requests and recorded zero page errors, missing assets or blocked requests. All browser instances closed. The comparison uses a half CSS pixel of browser geometry tolerance and accounts for scroll in document coordinates for offscreen hero art during a direct hash load. [Baseline receipt](baseline/render-report.json) · [Final candidate receipt](candidate/render-report.json) · [Supplement](candidate/supplement-report.json) · [Comparison](comparison-report.json)
