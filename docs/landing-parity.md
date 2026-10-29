# EVA landing content parity — 12 September 2026

Scope: fresh Spanish original landing (`source/landing.html` and `.txt`, fetched from `https://www.evahealth.es/es`) compared with accepted local redesign `/private/tmp/eva-system-03`. This is source/content review, not a claim that the live preview deployment or every interactive state was inspected. The fresh original landing still contains the same substantive offer and narrative as the 10 September snapshot in `outputs/eva-content-import/landing-source.txt`.

## Finding

The redesign retains the principal business information: quarterly €99 offer, 15 biomarkers, home collection, four readings/60 values a year, expanded panel option, five numeric examples, estimated biological age, separate longevity score, founder statement, cancellation, free existing-lab upload and public/legal destinations. It is not a literal copy. Most differences are intentional changes from alarming claims to a constructive lifestyle narrative.

Three corrections are worthwhile before declaring parity complete: make the hero's per-kit price consistent with the quarterly subscription; explicitly explain the two kinds of ranges; restore the choice to explore a different/specialized panel. A fourth issue is inherited from the original site: the full panel has conflicting counts and cannot be silently reconciled by design.

Status vocabulary: **retained** = fact remains; **rephrased** = same purpose stated differently; **missing** = substantive source information not currently expressed; **withheld unsupported** = deliberately omitted claim lacking adequate evidence in the inspected source; **contradiction** = inconsistent source/current wording that requires a documented decision.

## Explicit matrix

| Source information or purpose | Status | Current redesign location / evidence | Action |
|---|---|---|---|
| Preventive health, understand what results mean | Rephrased | `HeroIntro`, `EvaFilm`, `HealthEditorial`: “Conoce tu salud”, context and comparison | Preserve optimistic approach. |
| “Tu laboratorio dice que estás bien. Tu cuerpo sabe más.” | Rephrased | Hero and `#una-perspectiva` emphasize understanding and repeated readings | Do not restore antagonism toward clinicians. |
| 95% of “normal” results hide a deficiency | Withheld unsupported | No customer-facing number; recorded in `public/review/content-import.md` | Continue withholding. Original provides no linked supporting study. |
| Population reference ranges vs EVA longevity interpretation | Partially retained / missing explanation | `BiomarkerGallery` names both ranges and displays their numbers; `HealthEditorial` now explains only snapshots vs repeated readings | Add a short plain-language distinction next to the widget, with source/evidence link. Suggested copy below. |
| €1.1T preventable chronic-disease spending; “WHO 2024” | Withheld unsupported | Source discrepancy record only | Continue withholding; source attribution alone is not verification. |
| Quarterly home collection / each 3 months | Retained | Film, method, annual rhythm, `BusinessOffer` | Keep cadence consistent: quarterly/90 days are narrative equivalents here. |
| €99 per quarter | Retained + contradiction | `BusinessOffer`: “99 € al trimestre”; `HeroKitCta`: “99€ por Kit” | The hero can be read as one-off. Update secondary detail to “99 € / trimestre” without changing the approved CTA hierarchy. Prior per-kit wording was user-requested; record this as a clarity correction, not an unobserved factual change. |
| 15 markers each quarter | Retained | Film, method, offer | No change. |
| Four readings per year, 60 results | Retained | Annual rhythm in `HealthEditorial` | No change; distinguish 60 measurements from 60 distinct biomarkers. |
| Optional full panel 165+ | Retained + source contradiction | `BusinessOffer` retains 165+ as an option distinct from the 15-marker kit | Fresh pricing and method pages instead say 40+ at €499. Do not attach €499 to 165+. Maintain discrepancy ledger; use a neutral “panel más amplio” landing link if root chooses to avoid advertising an unresolved count. |
| “Sin aguja”, “sin clínica”, “sin cita” | Rephrased | “Recogida de muestra en casa con Tasso+”, laboratory analysis | Concrete process replaces ambiguous needle/painless promise. Source method/pricing calls it painless; do not add that guarantee. |
| ApoB, hs-CRP, fasting insulin as examples of base panel | Retained but relocated | All appear in the five-example gallery; current method step 2 no longer lists them | Optional brief “por ejemplo…” in method is useful but not a parity blocker. |
| Five specimens with measured value + unit + clinical and EVA ranges | Retained | `lib/landing-content.ts`, `BiomarkerGallery` table and range view | All five preserved exactly numerically. See verification table below. |
| Vitamin D and ferritin/insulin directional status wording | Rephrased; source contradictions omitted | Numeric comparisons retained; misleading below-optimal labels and “action required” removed | Insulin 11 exceeds displayed 2–5; ferritin 320 exceeds 50–150. Do not reproduce below-optimal labels. Avoid issuing personal advice from examples. |
| Claims that examples are real readings a doctor would call “fine” | Rephrased | “Demostración con datos ilustrativos” | Keep illustrated framing; no identity or provenance validates a real patient story. |
| Four-step method: collect, base panel, longevity interpretation, choose next | Partially retained / missing choice | `MethodJourney`: collect, results, understand, repeat | The quarterly rhythm is clear. Restore “explora un panel especializado” in final step or adjacent plan link; root should preserve distinction between included/quoted options from pricing. |
| Re-test what is improving, explore a new panel, book full extraction | Partially retained | Repeat present in method; full extraction present lower in offer; panel-switch choice absent | Suggested short addition below; no new purchase or calendar behavior. |
| Biological age as a different perspective from chronological age | Rephrased | `#tu-evolucion` | Correctly calls age an estimate rather than a literal measurement of years gained. |
| 34 chronological, 29 biological, −5 example | Retained and qualified | `#tu-evolucion`; illustrative note | Keep all three linked as one example, not promised outcome. |
| Separate longevity score | Retained | Method, age section, offer | Do not equate score with biological age or imply all uploads contain enough data. |
| Full founder statement + Juan Diego Lago, founder/CEO | Retained | `#nuestra-historia` | Wording retains meaning, accents corrected. Keep attribution. |
| Signup CTA | Retained | Header, hero, offer → canonical signup | In redesign preview make transition explicit: preview signup is simulated. |
| Free upload of existing analyses | Retained | `BusinessOffer` upload block | Source upload is login-gated. Do not imply the user can upload/process without an account. |
| No credit card | Rephrased / clarified | Attached to free upload only | Correctly avoids suggesting paid subscription needs no payment. |
| Cancel whenever | Retained | Offer | Pricing/terms clarify cancellation at current billing period end; show detail on pricing/account confirmation. |
| Method, science, pricing, about, blog, contact | Retained | Header/menu/footer business link map | New internal routes should replace these links only once implemented. |
| Privacy, terms, cookies | Retained as destinations | Footer | Full redesign must copy policy bodies exactly; landing needs links rather than policy duplication. |
| English | Retained as original-site link | Header/footer link to `/en` | Current task: Spanish first, English architecture ready. Avoid a control implying translated preview pages exist before they do. |
| Brand location/copyright/contact | Retained | Footer: Madrid, 2026, hello@evahealth.es | No change. |

## Numeric specimen verification

| Marker | Value | Unit | Reference | EVA | Exact match? |
|---|---:|---|---|---|---|
| Vitamina D / 25-OH | 28 | ng/mL | 20–100 | 50–80 | Yes |
| hs-CRP | 2.1 | mg/L | 0–3 | 0–1 | Yes |
| Insulina en ayunas | 11 | µIU/mL | 2–19 | 2–5 | Yes |
| ApoB | 98 | mg/dL | 0–130 | 0–60 | Yes |
| Ferritina | 320 | ng/mL | 30–400 | 50–150 | Yes |

The gallery's earlier three time points are additional design demonstration data, not present in the original. Existing illustration labels correctly identify this. The runner's ApoB/HbA1c “Óptimo” and HsCRP “Fuera de rango” are separately approved illustrative design labels, not measurements of the pictured person or the gallery specimen values. Preserve that distinction when merging content.

## Recommended minimal landing copy corrections

1. Preserve the user-approved hero CTA wording and hierarchy. Add a short adjacent cadence clarification: **“Suscripción trimestral · Una lectura cada 90 días.”** Root may propose changing the secondary price to **“99 € / trimestre”** later, but the parity fix should not silently replace the requested **“99€ por Kit”**.
2. Near the ranges view: **“Un resultado puede leerse desde más de una perspectiva. Compara el intervalo de referencia del laboratorio con los rangos que EVA utiliza para dar contexto a tus resultados.”** Link “Cómo interpreta EVA los resultados” to the redesigned science page. Do not assert the laboratory range is simply based on sick people.
3. Method final step: **“Vuelve a medir tus biomarcadores cada 90 días y compara tus lecturas. También puedes explorar los paneles especializados y las opciones de análisis completo.”** CTA: **“Ver paneles y condiciones”**. Pricing owns the inclusion/cost detail.
4. Existing-lab upload: **“Sube una analítica que ya tengas y explora tus resultados. Crea tu cuenta para empezar.”** Keep **“Gratis. Sin tarjeta de crédito.”** next to this journey only.

## Source contradictions for shared redesign

| Issue | Source evidence | Required treatment |
|---|---|---|
| Expanded panel count | Landing/science 165+; pricing/method 40+ and €499 | Distinguish interpretation catalogue from purchasable panel only if backend/product source confirms that distinction. Until then preserve the conflict in records, avoid inventing a unified product. |
| 26 vs 15 vs 165+ | Method map: 26 markers/seven systems; base subscription:15; science catalogue:165+ | Do not present the 26-node demo as the kit count. |
| Free biological age | Pricing top card “si aplica”; comparison table appears unavailable for free | Prefer conditional eligibility: available when the report includes required data and the actual product allows it; await app contract for gated entitlement. |
| Results in72h / less than a week / less than a minute | Pricing and method use different process promises | Keep timing attached to its exact process, never a general guarantee; await backend/product workflow for timing state. |
| Privacy absolutism | About/terms “never share” vs privacy lists processors and possible Gemini transfer outside EEA | Keep policy verbatim and link it. In new summaries use “Consulta cómo tratamos tus datos”; do not expand an absolute claim beyond the detailed policy. |
| Wearable causal example | Science links HRV drop and cortisol reading as contextual explanation | Reframe as side-by-side context; don't claim causal proof or add personalized health interpretation. |

Applied skill: `design:ux-copy` for action-specific CTA labels, consistent vocabulary, helpful states and localization. No website source files were edited in this audit.
