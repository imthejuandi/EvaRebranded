# EVA hero pack: exact bilingual copy review

**Final rendered-copy verdict: PASS — no required wording fixes.** The exact approved pack wording, quarterly price, free action, paid destination terms and later quiet other-panel text were reviewed against the new EN/ES renders. This is a copy verdict; fallback/contrast findings remain with root and independent design/engineering QA, as recorded below.

Reviewed 26 November 2026 in `/workspace/eva-entry-preview`. Latest owner iteration: preserve the existing runner opening, reveal both actions only when that opening completes, keep free report interpretation, and send the paid standard-pack action directly to its quarterly purchase-preview path. This supersedes the preceding first-paint/chooser proposal.

Applied the exact repository-local skill `.agents/skills/eva-preview-review/SKILL.md` and read its `references/decision-ledger.md`, plus `docs/hero-pack-review-brief.md`. Current `HeroKitCta`, `SiteShell`, `entry-preview-copy`, `starter-subscription` and `closing-copy` were inspected. No UI edits made by this reviewer.

## Preferred exact wording

| Element | English | Spanish (Spain) |
| --- | --- | --- |
| Hero paid label, single line | Start with the pack | Empieza con el pack |
| Hero paid price/frequency subline, single line | €99 + VAT / quarter | 99 € + IVA / trimestre |
| Complete accessible paid name | Start with the €99 + VAT pack. Quarterly subscription. | Empieza con el pack de 99 € + IVA. Suscripción trimestral. |
| Compact SiteShell paid header text | €99 + VAT pack | Pack de 99 € + IVA |
| Header accessible name | Start with the €99 + VAT pack. Quarterly subscription. | Empieza con el pack de 99 € + IVA. Suscripción trimestral. |
| Unchanged free label | Start for free | Empieza gratis |
| Unchanged free subline | Upload labs | Sube analíticas |
| Later quiet inline link | Explore other panels | Ver otros paneles |

Use the same paid intent and complete accessible name for hero and header. The hero’s two visible roles together express the owner’s exact “Start with the €99 + VAT pack” / “Empieza con el pack de 99 € + IVA” meaning, adding the confirmed quarterly frequency. The slash is ordinary price shorthand in both languages. Do not insert another visible line or replace frequency with a vague “from” price. The destination must explicitly retain the quarterly subscription, cancel-anytime terms and standard 13-marker scope.

The compact header variant retains the price and “pack” identity in a short single line. Its surrounding action styling/arrow and complete accessible name supply the start action. Header rendering still requires a fit check; its visibility rules remain owned by design.

## Later other-panel area

The existing `BusinessOffer.details` area already provides the right separate location. No new component or extra hero action is needed. The following exact copy is suitable if updating its heading/action for the new standard-pack lead:

| Element | English | Spanish |
| --- | --- | --- |
| Heading | Other panels. | Otros paneles. |
| Body, existing wording | Other panels have their own scope and pricing. Check the details before choosing. | Otros paneles tienen su propio alcance y precio. Consulta los detalles antes de elegir. |
| Quiet inline action | Explore other panels | Ver otros paneles |

Retaining the existing heading is also acceptable if only the quiet action needs adjustment. Keep the later link visually subordinate and route it to the existing pricing comparison. Do not add prices, marker counts, contents, timing or availability for other panels.

## Meaning, translation and claim verdict

**PASS — no required wording fix to the proposed two-line hero.** A first-time reader can distinguish free interpretation of existing reports from starting the paid pack, can see the price and billing frequency, and reaches the standard offer without an extra panel choice. English “pack” follows the owner’s requested terminology; Spanish “pack” and the price order are natural for Spain. Both languages retain the same paid/subscription meaning.

The paid destination must be `/{locale}/signup?plan=quarterly`, with standard paid intent, rather than free intent or pricing selection. Free retains its existing free-upload return intent. This is a preview route, not a claim that payment or a physical order has been placed.

No new medical or outcome claim is introduced. The standard pack remains 13 biomarkers, excludes ApoB and costs €99 + VAT per quarter, cancel anytime. ApoB remains part of the separate enhanced at-home option. Full laboratory scope and other unconfirmed commercial facts remain unconfirmed. Existing Alex, range proof, eligible EVA Score, official wordmark and hero service explanation remain unchanged.

Independent bilingual/claim reviewer `/root/entry_copy/language_claim_check` read the same skill, ledger and brief and reviewed these exact proposed strings. **PASS, no required wording fixes.** Their qualification: compact header wording works when its direct destination visibly confirms quarterly standard terms; render fit and actual journey still require verification.

## Required rendered recheck

**NOT VERIFIED at this copy-proposal stage:** two single-line text roles within the existing 44px row at 320/390px; header fit; visual and keyboard concealment during the normal opening; reveal on the existing completion callback; reduced-motion/no-media/no-JavaScript behavior; paid/free destination behavior. Root will provide the exact rendered candidate for final copy review. The brief’s existing timing and fallback checks govern this work; this review adds no approval gate.

## Implemented source recheck, before renders

**PASS for exact wording and immediate paid-intent source behavior.** The edited `entry-preview-copy` uses the exact hero label, price subline, accessible name, compact header, and later other-panel heading/link above. `HeroKitCta`, `SiteShell` and the standard `BusinessOffer` action now point to localized `/signup?plan=quarterly`. The later other-panel anchor remains distinct and points to the existing pricing selector; it is not a third hero control.

Both EN/ES signup routes mount `AccessPage`. Its parsed quarterly query selects the quarterly-intent description, using localized `starterSubscription` copy:

- English: “Quarterly subscription”; “13 biomarkers in each kit · €99 + VAT per quarter.”; “Cancel anytime.”
- Spanish: “Suscripción trimestral”; “Kit de 13 biomarcadores · 99 € + IVA por trimestre.”; “Cancela cuando quieras.”

`freeSignup` is false for quarterly intent and also stays false before intent hydration, so the paid destination does not initially display the free-upload offer. There is no pricing chooser at this signup destination. The page explains that this is a fictional interactive preview and that the private example continues in Spanish after access.

The existing downstream onboarding preserves quarterly intent and preselects that path. It still allows the established optional path change before checkout; no new change to that later flow was requested or made. `destinationAfterAccess` and `destinationAfterOnboarding` retain paid intent toward the existing checkout-resume preview. This source review does not simulate account creation, onboarding completion or checkout confirmation.

Rendered fit, reveal/fallback behavior and actual click destinations remain **NOT VERIFIED** by this copy reviewer until the exact new renders are supplied.

Source identity at this check: `entry-preview-copy.ts` SHA-256 `6e4f8ce15785197717f772fd507379bb8e62ec3d2e9268352274f5f0a80e8ad1`; `HeroKitCta.tsx` `179cdf512fd0786ed94217c5516db8ec1afe2c35dff8e134b81a61c45111e7dd`; `AccessPage.tsx` `d7b75d4be04ff2af84402babcda6cf31696c7674dcc73624063f3bb0383310de`.

## Final actual rendered-copy recheck

Reviewed all 12 `*-after.png` hero screenshots: EN/ES × 320/390/1366px × ordinary/reduced motion. The corresponding core profiles in `render-report.json` all pass. The report's entry and hero source hashes match the exact source identity above.

Also directly inspected these representative actual journey screenshots:

- `en-320-motion-{paid-destination,free-destination,other-panels}.png`
- `es-320-motion-{paid-destination,free-destination,other-panels}.png`
- `en-1366-motion-paid-destination.png`
- `es-1366-motion-{paid-destination,free-destination,other-panels}.png`
- `en-320-calm-paid-destination.png`
- `en-1366-motion-other-panels-destination.png`

The independent bilingual reviewer inspected ES320 motion and calm hero, paid/free destinations and other-panel renders, including the enhanced destination. Their final verdict is **PASS, no copy fixes**.

| Copy criterion | Final finding |
| --- | --- |
| Hero pack meaning and fit | PASS. Both languages visibly retain the exact approved start/pack label plus price and quarterly frequency. Each label/subline remains complete in one line within the existing 44px action row, including ES320. No third line or tiny replacement type was needed. |
| Clear free choice | PASS. “Start for free” / “Empieza gratis” stays distinct from the pack. Free signup visibly explains PDF/photo report input and the total five-report allowance. |
| Direct standard paid intent | PASS. The actual paid destination in all 12 core reports is localized `signup?plan=quarterly`. Its visible terms name quarterly subscription, 13 biomarkers, €99 + VAT per quarter and cancel anytime. It does not route through free signup or a pricing chooser. |
| English and Spain Spanish | PASS. The wording is idiomatic and equivalent in intent, price, frequency and commercial strength. The private preview’s Spanish boundary is explained on the entry page. |
| Quiet other-panel route | PASS for copy and hierarchy meaning. Later “Other panels.” / “Otros paneles.” and the underlined inline action remain separate from the hero. The enhanced destination includes ApoB and expressly leaves price, timing and availability unconfirmed. |
| Scope and claims | PASS. No new medical, prevention, optimum, biological-age or AI launch promise appears in the reviewed changes. Standard/enhanced/full distinctions and conditional Score remain preserved. |

A novice can tell that the free route interprets an existing report while the paid route starts the standard quarterly pack. Price cadence is visible before clicking and explicit again at signup. This is an agent clarity review, not human usability research or a claim that a real purchase has been completed.

Two non-copy observations were sent to root for their responsible reviewers: the initial `render-report.json` records failed no-JavaScript hit-target checks (`pointer-events:none`) despite passing 12 core and six media-abort profiles; and the enhanced pricing-destination screenshot shows low-contrast selector text during its state transition. This review does not approve those interaction/contrast criteria or represent the complete task as ready while they are unresolved. Neither observation requires changing the approved wording. Root owns correction and final relevant rechecks.

No account was created, no file uploaded, and no booking/payment confirmation was performed by this reviewer. The official PNG wordmark remains the owner-confirmed asset; no alternative logo was proposed.
