# EVA 03.4 — landing content import

Source: [the Spanish EVA landing](https://www.evahealth.es/es), retrieved and inspected on 2026-09-10 (Asia/Makassar). The public page and its five-slide offer carousel were read independently. The local source snapshot is retained with the project’s recovery files. The existing EVA website and application were not modified.

## Coverage

| Source information | Treatment in this design |
| --- | --- |
| Preventive health; more context than a “normal” result | Existing optimistic hero and new `#una-perspectiva` editorial passage |
| Population reference ranges versus EVA longevity interpretation | Context copy and `#biomarcadores` comparison gallery |
| €99 quarterly, 15 markers, four readings a year | `#empezar`; annual rhythm also shows 60 data points |
| ApoB, hs-CRP and fasting insulin as base-panel examples | Four-step method |
| Optional 165+ expanded panel | Method and offer; reservation of an additional extraction, with conditions linked |
| Five specimen values, units and both displayed intervals | Five horizontally scrollable cards; values reproduced below |
| Four-step method and 90-day cadence | `#el-metodo`, alongside the official Tasso+ photograph |
| Biological age and separate longevity score | `#tu-evolucion` and method/offer |
| 34 chronological / 29 biological / −5 example | Clearly illustrative dot display; biological age described as an estimate |
| Complete founder statement and attribution | `#nuestra-historia` |
| Signup, free existing-lab upload, cancellation | Offer and navigation; no-card wording is attached to the free upload |
| Method, science, pricing, about, English, blog, contact, privacy, terms, cookies | Canonical business links in navigation and footer |

## Reproduced specimen examples

These are examples from the public landing, not personal health records, newly calculated thresholds or an individual recommendation.

| Marker | Value | Unit | Reference interval | EVA interval on source |
| --- | --- | --- | --- | --- |
| Vitamin D (25-OH) | 28 | ng/mL | 20–100 | 50–80 |
| hs-CRP | 2.1 | mg/L | 0–3 | 0–1 |
| Fasting insulin | 11 | µIU/mL | 2–19 | 2–5 |
| ApoB | 98 | mg/dL | 0–130 | 0–60 |
| Ferritin | 320 | ng/mL | 30–400 | 50–150 |

The source labels insulin 11 and ferritin 320 as “below optimal,” although both exceed its displayed EVA interval. This design preserves the numeric comparison and omits those misleading directional labels, along with “action required” instructions. No new diagnostic interpretation is introduced. Clinical validation of these reference examples is outside this design import.

## Source discrepancies retained for review

- The original hero asserts that **95% of normal results hide a deficiency**. No supporting citation was linked on the landing or its science page. This figure is retained here, rather than presented as verified in the new landing.
- The original rationale cites **€1.1T yearly preventable chronic-disease spending, WHO 2024**. No supporting source was linked. This figure is retained here pending verification. The prevention rationale remains in the editorial text.
- The landing says **165+ markers** for the optional full panel; the [pricing page](https://www.evahealth.es/es/pricing) describes **40+ at €499**. The design follows the requested landing’s 165+ wording and links collection/plan conditions, without attaching €499 to it or claiming it uses the same home kit.
- Literal “needle-free” wording was replaced with concrete collection language: Tasso+, collection at home, analysis in an accredited laboratory. The pricing FAQ describes a micro-array rather than a non-penetrating procedure. No painless guarantee is added.
- No-credit-card wording is shown with the **free upload**, as on the pricing page, rather than suggesting the paid subscription is free.
- The [science page](https://www.evahealth.es/es/science) describes biological age as an estimate. The 34/29 example is not presented as a customer outcome or promised reduction.

## Design and validation loop

Preserve the accepted runner, rightward exit, centered device turn, movement-only scene transitions, 624-lamp Analog Signal and Solar Motion. Extend the same dot language through `DotNumber`; each lamp switches in eight scattered steps when the readout enters view. Large SVG paths avoid mounting a separate DOM node for every lamp. This is an entry sequence, not an independently looping animation. Reduced motion shows settled values.

Bounded loop: one content pass, independent source comparison, corrections for concrete findings, then desktop/phone interaction review and the production build. Gates: all five specimens reachable with pointer and keyboard; complete readable content without animation; no horizontal page overflow; working mobile navigation; accurate business-link destinations; saved previous source.

The 03.3 source is downloadable at `/archive/eva-03-3-movement.zip`. Earlier versions remain in the history page.
