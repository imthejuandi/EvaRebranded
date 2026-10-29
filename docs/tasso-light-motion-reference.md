# Light into Insight: real dashboard motion reference

Source inspection and primary-reference research for the selected Light into Insight direction. This work did not run a browser, build, modify the app, or generate a replacement interface.

## Existing dashboard motion

The actual `/es/dashboard` route renders `DashboardPage` → `HealthSignature` → `ScoreOrb` / `SelectedDial`.

| Existing behavior | Source | What a recording can truthfully show |
| --- | --- | --- |
| Initial biomarker-field settlement, 960ms | `score-orb/ReportRing.tsx` | The existing ring comes into position; record it only if startup and fonts can be captured cleanly. |
| Marker selection changes emphasis over 260ms | `score-orb/ReportRing.tsx`, `ScoreOrb.tsx` | The selected result remains clear while unrelated ring points recede. This changes selection, not measurements. |
| Two slow, visible-only glass-color motions, approximately 24s and 32s | `GlassFluid.tsx`, `selected-dial.css` | Real ambient motion in the existing central signature; no injected particles or fictional score animation is needed. |
| Actual marker detail panel | `ScoreOrb.tsx` | A clicked marker shows its name, real fixture value/unit, interval status, and report interval. |
| Category filter, capsule selection, and `Evolución` / `Rangos` / `Lectura` views | `DashboardPage.tsx` | An optional lower-dashboard recording can show an actual health-area filter and actual range/explanation view. |
| Narrative depth and evidence/context tabs | `ReportSummary.tsx`, `ExecutiveReading.tsx` | Real report prose and interface transitions, if a longer demonstration is needed. |

There is no health-area tab control inside the signature itself. Do not invent one. Area filtering belongs to the existing lower biomarker gallery.

## Capture conditions

Use a new isolated browser context, with normal motion enabled for this recording, fixed desktop dimensions, stable zoom, and the current app source. Keep the mouse away from biomarker buttons during the neutral hold: mouse hover itself opens a result. Wait for fonts, hydration, and `#dashboard-signature[data-signature-report="demo-junio"]`. The default scenario contains fictional example data: Alex, 12 June 2026, 15 markers across seven categories, biological age 29, EVA Score 82. Preserve Spanish UI and visible `Ejemplo` status; an adjacent English caption may identify it as the actual Spanish app preview.

Do not rewrite the DOM, change values, hide inconvenient medical labels, manufacture English interface copy, or use a generated screen/tablet. Browser recorder output may be trimmed, cropped, and encoded without changing the UI content. Root should visually inspect the recording and its poster before integration.

## Recommended continuous recording: 8–10 seconds

Frame the complete signature and room for its detail panel. A slightly taller capture can be fitted within the webpage's bounded scene viewport. Preserve enough of the actual heading/date/example labeling to identify the product. Keep one camera/crop throughout this short recording.

| Time | Real interaction | Result |
| --- | --- | --- |
| 0–1.5s | No selection; pointer on a neutral margin | Actual signature and native ambient glass motion. The initial ring entrance is optional, not required. |
| 1.5–2s | Click `.score-orb-node[data-marker="apob"]`, then move pointer to a neutral margin | Ring emphasis settles over 260ms; actual ApoB result opens. |
| 2–4s | Hold | ApoB 78 mg/dL and its report classification remain readable. |
| 4–4.5s | Click `.score-orb-node[data-marker="hscrp"]`, then neutral pointer | Selection changes to the existing hsCRP result, not a new measurement. |
| 4.5–6.5s | Hold | hsCRP 2,1 mg/L and above-interval status remain readable. |
| 6.5–7s | Click `.score-orb-result button[aria-label="Cerrar resultado"]`, then neutral pointer | Detail closes and the neutral ring returns. |
| 7–9s | Hold the actual signature | A calm outgoing frame, with age 29 and EVA Score 82 unchanged throughout. |

Useful exact observation selectors:

```text
#dashboard-signature
#dashboard-signature[data-signature-report="demo-junio"]
canvas.score-orb-ring[data-settled="true"]
.dial-fluid[data-motion="running"]
.selected-dial[data-age="29"][data-score="82"]
.score-orb-node[data-marker="apob"]
.score-orb-node[data-marker="hscrp"]
.score-orb-result:not([hidden])
.score-orb-result button[aria-label="Cerrar resultado"]
```

The close handler restores keyboard focus safely, but move the pointer away after clicking so hover does not immediately reveal another marker. End on a stable frame and hold it rather than looping: the native ambient-motion phases will not be identical at both ends. When the webpage scrubs the recording, frozen/reversed frames remain a captured demonstration of the real app, not changing live medical data.

## Optional second capture: actual health-area view

If a broader interface demonstration is needed, record a separate, deliberate move to `#dashboard-biomarkers`. Existing selectors:

```text
#dashboard-biomarkers .dashboard-category-filters
#dashboard-biomarkers .dashboard-marker-capsule[aria-label^="ApoB:"]
#dashboard-biomarkers .dashboard-glass-views
#dashboard-biomarkers .dashboard-capsule-range
```

Within the category-filter group, click the real `Cardiovascular` button; select the ApoB capsule; then click `Rangos` inside `.dashboard-glass-views`. This shows the existing range track and explanation. Do not fabricate an animated improvement/trend between June and March: the fixture's June report is a kit sample and March is an upload, and the app intentionally requires matching origins and units for comparisons.

## Official Apple references and application to EVA

No Apple product-page URL was found in the repository's current `docs`, `public/review`, `lib`, `components`, or `app` references. Existing local visual references are SAVEE, particularly the focused instrument and frosted-data references in `ExecutiveReading.tsx`.

Official primary references checked:

- [Apple AirPods Pro product page](https://www.apple.com/airpods-pro/) presents the hardware first, then closer feature views paired with short explanations. Use it for disciplined product-to-benefit pacing, not for copied imagery or claims.
- [Apple MacBook Air product page](https://www.apple.com/macbook-air/) connects the recognizable product with genuine on-screen use cases. For EVA, the payoff should similarly be the existing dashboard in motion, rather than an invented report.
- [Apple WWDC25: What’s new in Safari and WebKit](https://developer.apple.com/videos/play/wwdc2025/233/), animation chapter, explicitly explains scroll/view timelines, bounded animation ranges, reversal on upward scroll, time to read after motion settles, and reduced-motion treatment. This is the verified technical reference; the product pages were inspected through their text/asset structure here, not visually audited frame by frame.

Applied choreography: use one continuous scroll coordinate and persistent visual stage; give the collection-to-return-to-dashboard handoff clear spatial continuity; finish movement before the primary copy's reading hold; preserve a usable static treatment for reduced motion. The dashboard recording should arrive as the real outcome of the sample journey, expand into a stable readable view, demonstrate one actual interaction, then hold. Avoid unrelated cards appearing and disappearing between each chapter. These are EVA recommendations informed by the references, not assertions about Apple's internal implementation.
