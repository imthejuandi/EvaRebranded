# EVA entry clarity: bilingual copy and claim review

**Final implemented candidate supersedes the initial proposal below.** See `copy-final-review.md`: exact root bridge and compact metadata reviewed against actual renders, PASS, no required wording fixes. The heading/semicolon bridge and longer CTA metadata in this initial proposal are not the final UI.

Reviewed 26 November 2026. Bounded private candidate: `/workspace/eva-entry-preview`, branch `preview/entry-clarity-20261126`, baseline `cdc71e6`. No UI source edits, publication or merge performed by this reviewer.

Inputs read: `AGENTS.md`, `docs/AGENT_REVIEW_WORKFLOW.md`, `docs/SESSION_HANDOFF.json`, `docs/SESSION_COORDINATION.json`, `ScrollStory`, `HeroKitCta`, `BiomarkerGallery`, `HealthEditorial`, `BiologicalAgeSection`, `BusinessOffer`, `RestoredContent`, current pricing copy, `report-understanding` and `closing-copy`. Latest owner direction in the delegated brief supersedes older conflicting launch-feature and placement instructions. Source-level copy review only; final rendered geometry and interactions are **NOT VERIFIED** here.

Communication goal: let a new visitor understand that EVA explains blood test results and helps compare readings, then choose free report interpretation or paid panel selection.

## Exact preferred copy

| Surface | English | Spanish (Spain) |
| --- | --- | --- |
| Hero support: one short sentence, 11 words per language | EVA explains your blood test results and helps you track changes. | EVA explica tus analíticas y te ayuda a seguir los cambios. |
| Bridge heading immediately before the existing Alex example | Make sense of your results. | Entiende tus resultados. |
| Bridge body: one concise sentence, 20 English words | Lab reports give you results, but understanding them and seeing changes can be difficult; EVA puts comparable readings in context. | Las analíticas dan resultados, pero entenderlos y ver cambios puede costar; EVA pone las lecturas comparables en contexto. |
| First-screen primary CTA | Start for free | Empieza gratis |
| Primary scope line | Upload a PDF or photo | Sube un PDF o una foto |
| First-screen secondary CTA, linked directly to pricing panel selection | Choose a panel | Elige un panel |
| Secondary scope line | At-home and full-panel options | Opciones en casa y panel completo |
| Free report score qualification, visible beside the score benefit | EVA Score is available when your reports contain enough compatible data. | EVA Score está disponible si tus informes contienen suficientes datos compatibles. |
| Compact score feature label, paired with the complete qualification above | EVA Score, when enough data is available | EVA Score, si hay datos suficientes |

Keep the established analog headline, Hanken, original runner entrance and scroll behavior, compact side-by-side CTA treatment, and exact official `/art/eva-official-logo.png` asset. Do not type a replacement logo. The free CTA continues the free report upload route and preserves PDF/photo intent. The paid CTA goes to selectable panels, without a free-signup detour. Do not reintroduce the hero five-upload count or a separate terms row.

## Panel separation

| Surface | English | Spanish |
| --- | --- | --- |
| Standard home panel label | Standard at-home panel | Panel estándar en casa |
| Standard inclusion note | 13 biomarkers. ApoB is not included. | 13 biomarcadores. No incluye ApoB. |
| Enhanced home panel label | Enhanced at-home panel | Panel ampliado en casa |
| Enhanced inclusion note | Includes ApoB. Check all included biomarkers and terms before choosing. | Incluye ApoB. Consulta todos sus biomarcadores y condiciones antes de elegir. |
| Enhanced unconfirmed terms | Price, timing and availability to be confirmed. | Precio, plazos y disponibilidad por confirmar. |
| Enhanced detail action | View enhanced panel | Ver panel ampliado |
| Separate full-panel label | Full laboratory panel | Panel completo en laboratorio |
| Full-panel qualification | Confirm the panel contents and terms before booking. | Confirma los biomarcadores y las condiciones antes de reservar. |
| Illustrative gallery caption, retaining marker-count distinction | Illustrative report · Some markers are outside the standard 13-marker panel. ApoB is included in the enhanced at-home panel. | Informe ilustrativo · Algunos marcadores no están en el panel estándar de 13. El panel ampliado en casa incluye ApoB. |

The enhanced panel has one confirmed inclusion in this brief: ApoB. Do not infer that it is the standard panel plus ApoB, assign a marker count, price or cadence, or list other contents. Standard documented quarterly terms remain €99 + VAT per quarter, cancel anytime, with the established 13 named biomarkers. The existing separately documented €499 one-time laboratory option may retain its sourced terms; this review establishes no additional full-panel contents, turnaround or availability. An unpriced enhanced option may expose details or selection intent without implying that a real purchase is currently available.

## Required claim removals and substitutions

| Affected source/surface | Finding | Smallest bounded correction |
| --- | --- | --- |
| `HealthEditorial` → `BiologicalAgeSection` | The prominent age/score chapter presents a launch feature that the owner now wants hidden. | Omit that launch-promise section in this preview. Do not use the age34→29 illustration or “−5 years” as a benefit claim. Keep conditional EVA Score wording where free interpretation is described. |
| Pricing comparison interpretation rows | Existing `Edad biológica estimada` and `EVA AI` rows advertise deferred features. | Remove both rows from affected pricing output, rather than renaming them “included” or “coming soon.” |
| Pricing `report.detail` | Existing final sentence says EVA AI supplies educational explanations. | Retain only: EN “Readings can be compared without attributing a change to a particular habit.” / ES “Las lecturas se pueden comparar sin atribuir un cambio a un hábito concreto.” |
| Pricing → `OfferUnderstanding` free article | Existing copy discusses biological-age availability and inconsistent original free-plan scope. | Replace with the exact conditional EVA Score qualification above. |
| Pricing → `OfferUnderstanding` laboratory article | Existing copy exposes conflicting 40+/165+ archival counts as a product description. | Use the separate full laboratory panel label and confirm-scope wording above; no invented count or contents. |
| Pricing → `OfferUnderstanding` sample-to-report essay | Existing copy promises two working days after laboratory receipt. | EN “Shipping and analysis times will be confirmed before purchase.” / ES “Los plazos de envío y análisis se confirmarán antes de contratar.” |
| `BusinessOffer` paid action | Current quarterly action goes straight to quarterly signup. | For the new choose-a-panel entry, lead to pricing panel selection. Keep the standard offer’s documented terms where it is specifically named. |
| `BiomarkerGallery` caption | Generic “some markers outside the 13” warning does not identify the now-confirmed ApoB option. | Use the caption above; retain all other fictional/sample disclosures. |
| Other launch-facing copy newly brought into scope | AI/age promises can survive in inherited components or English dictionaries. | Inspect actual rendered landing/pricing text; hide affected promises rather than relying on a source-string search alone. General legal disclosures of AI processing are not feature promises and do not need deletion. |

Preserve Alex's fictional latest hs-CRP result of 2.1 mg/L and its existing history/context. Moving the existing example before the kit walkthrough does not authorize changing its data, interpretation levels or controls. The separate range proof remains 2.9 mg/L (ES 2,9), laboratory reference strictly <3 mg/L, AHA lower relative-risk category strictly <1 mg/L on its accepted shared scale. These examples are distinct.

No new efficacy, diagnostic, disease-prevention or universal-optimum claim is introduced. Comparing readings does not establish cause, persistence or a diagnosis. Do not repeat the rejected assertion that laboratory reference intervals average an unhealthy population. Do not imply every report can produce a score.

## Review verdict and independent check

Preferred copy: **PASS** for concise health/wellness marketing, English cadence, Spain Spanish and claim restraint. The bridge expressly names the difficulty, then explains EVA's value through context for comparable readings. This is a functional product statement, not a medical outcome claim; no new medical threshold or efficacy assertion requires a new evidence source.

Independent reviewer `/root/entry_copy/language_claim_check` reviewed the exact hero, single-sentence bridge, CTA labels and score qualification. Verdict: medically restrained and idiomatic EN/ES; paid metadata must lead to genuinely selectable panels without implying unconfirmed availability. The reviewer independently identified the pricing age/AI rows and AI `report.detail` sentence for removal. Their initial two-sentence bridge was corrected to the one-sentence version above before final selection.

Meaning check: the visitor learns that receiving lab values is different from understanding them, and that EVA explains and compares compatible readings. The Alex example demonstrates contextual interpretation; it does not prove a diagnosis, a cause of change or guaranteed health improvement. This is an agent clarity review, not human usability research or clinician approval.

Final rendered EN/ES desktop/mobile text, compact CTA wrapping, panel-selection paths, reduced-motion parity and feature-claim absence require review on the exact implementation candidate. **NOT VERIFIED** until the root provides renders.
