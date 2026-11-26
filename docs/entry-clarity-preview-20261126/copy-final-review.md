# EVA entry preview: final copy review

**PASS — no required wording fixes.** Reviewed 26 November 2026 in `/workspace/eva-entry-preview`, branch `preview/entry-clarity-20261126`. This review covers the exact implemented root variant, not the earlier heading/semicolon proposal. No UI edits, merge or publication performed by this reviewer.

The entry and panel copy hashes match the production-built render evidence in `render-report.json`:

- `entry-preview-copy.ts`: `ba335145e67be543343cbde220402d164c0c844b0274e2d6a847491f519906cf`
- `panel-preview-copy.ts`: `fc40920c7676bb835b9bcbceca3f84ca9f4005793ac4081dbec4e61cbd2724d8`

## Exact final entry wording

| Surface | English | Spanish |
| --- | --- | --- |
| Hero | EVA explains your blood test results and helps you track changes. | EVA explica tus analíticas y te ayuda a seguir los cambios. |
| Bridge paragraph directly before existing Alex heading | Lab reports give you results, but understanding them and seeing what’s changed can be difficult. | La analítica te da resultados. Entenderlos y saber qué ha cambiado no siempre es fácil. |
| Primary action / metadata | Start for free / Upload labs | Empieza gratis / Sube analíticas |
| Paid action / metadata | Choose a panel / View options | Elige un panel / Ver opciones |
| Score qualification | EVA Score is available when your reports contain enough compatible data. | EVA Score está disponible si tus informes contienen suficientes datos compatibles. |

Both hero sentences have 11 words. The bridge uses one short paragraph; two short sentences are natural Spanish and retain the English meaning and strength. Omitting an additional bridge heading avoids a second heading immediately before the established Alex heading. The bridge states the problem; EVA’s service is explained in the hero, then demonstrated in the existing result example. Comparability and limits remain in the example’s history/context and interpretation rather than being repeated in this introductory sentence.

The shorter action metadata is accurate and fits the compact controls. PDF/photo guidance is retained in the free upload journey rather than forced into the hero metadata. “Choose a panel” accurately describes the direct pricing-selector destination. It does not promise an unconfirmed enhanced purchase.

## Evidence inspected

Actual screenshot content reviewed:

- `en-1366-motion-runner.png`, `en-320-motion-runner.png`, `es-320-motion-runner.png`
- `en-1366-motion-alex.png`, `es-320-motion-alex.png`
- `en-1366-motion-pricing-standard.png`, `en-1366-motion-pricing-enhanced.png`, `es-320-motion-pricing-enhanced.png`

The displayed hero explanation and both actions are readable and complete in these desktop and narrow-phone views. Spanish uses ordinary Spain wording, without an awkward literal translation. The problem paragraph leads naturally into the Alex example. The screenshot content identifies Alex as fictional and explicitly says recent exercise does not prove causation or persistence.

Source inspected for affected public and linked-report copy: final `entry-preview-copy`, `panel-preview-copy`, `PanelOfferUnderstanding`, `HeroKitCta`, `BiomarkerGallery`, `BusinessOffer`, `HealthEditorial`, `LabsPage` and `AppShell`. The linked report is an intentionally Spanish private preview; this review does not claim an English private-report translation.

## Panel and claim findings

| Item | Verdict and evidence |
| --- | --- |
| Standard / enhanced distinction | PASS. Standard visibly says 13 biomarkers and excludes ApoB. Enhanced visibly includes ApoB, stays separate, and leaves other biomarkers, count, frequency, price, timing and availability unconfirmed. No “standard plus ApoB” assumption appears. |
| Full laboratory panel | PASS. Separate option retains the documented €499 one-time terms; copy requires scope/availability confirmation and introduces no new contents, marker count or turnaround. |
| Free EVA Score | PASS. Marketing and pricing condition availability on sufficient compatible data. The linked fictional report renders available fixture Score without a paid-plan gate, retains the condition, labels the figure as fictional and has a no-data fallback. This is preview behavior, not proof of a live Score-calculation service. |
| Deferred age / AI promises | PASS in the affected output inspected. `BiologicalAgeSection` is unmounted. `HomeUnderstanding` remains because it wraps accepted `TrendStorySection`. Pricing removes age/AI rows and the AI report sentence. Its local offer detail avoids old age/count/two-day promises. Linked `LabsPage` renders no age card or AI action, and shared private navigation has no EVA AI entry. Unused dictionary strings do not constitute visible output. Historical methodology pages remain outside this bounded launch-entry review. |
| Existing evidence | PASS within copy scope. Alex 2.1 mg/L and the separate range proof 2.9 mg/L, strict <3 and <1 remain distinct. No new population-average, disease guarantee, causation, universal optimum or outcome claim was introduced. |

Independent reviewer `/root/entry_copy/language_claim_check` rechecked the **final exact** entry/panel modules and linked-report rendered JSX. Verdict: PASS for idiom, translation parity and claim restraint; no required copy fixes; no residual visible biological-age or EVA AI promise found in that source.

The reader can answer what EVA does, why a report alone can be difficult, and how the fictional example helps explain a reading. The example does not prove a diagnosis, why a value changed, whether it will stay changed or a guaranteed health improvement. This is agent review, not human usability research or clinician approval.

Full typography, contrast, motion, keyboard behavior and all flow checks remain owned by the design/independent QA reviewers. Linked private-report rendering and its free/no-data states were inspected in source here; they were not exercised in a browser by this copy reviewer. No actual device, native deployment or backend service capability is claimed.
