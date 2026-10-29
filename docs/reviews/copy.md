# EVA — full-site copy review

Reviewed 12 September 2026 against the integrated source at `/private/tmp/eva-system-03`, the fresh public source crawl and the audited functional app contract. This is a source/content review, with semantic-document verification and targeted rendered-component tests; it is not a clinical validation or a separate browser visual audit. Root owns the integrated desktop/mobile walkthrough.

## Result

The story now follows a coherent sequence: understand what EVA does, distinguish home sample collection from laboratory analysis, choose an appropriate starting point, bring results into context, and return to everyday life. The public site remains aspirational; the app gives concrete next actions, honest missing-data states and explicit sample-only outcomes. The app uses “valor”, “unidad”, “fecha” and “contexto” consistently instead of presenting an isolated score as a diagnosis.

All material cross-page copy/behavior mismatches identified in this pass have been corrected in the integrated source. Eleven verification checks are true in `copy-checks.json`. A small set of final orthographic/product-copy substitutions is prepared in `copy-fixes.json`; it excludes legal documents, source quotations and design edits. No new feature, testimonial, efficacy claim, plan count, shipping date, wearable metric or clinical interpretation was invented during review.

## Scope by route

| Route / surface | Copy assessment |
|---|---|
| `/` accepted landing | Core business story retained: Tasso+ collection at home; laboratory analysis; 15 markers every 90 days; ranges/context; estimated biological age and longevity score as different concepts; founder; 99 €/quarter; free upload starting point; links to expanded site. User-approved hero CTA remains “99€ por Kit”; recurring cadence is explicit in offer and checkout. The former 165+ panel phrase is only in an unused legacy component, not the rendered landing. |
| `/es/how-it-works` | Distinct collection → dispatch → laboratory → contextual reading sequence. Five-zone explanation is educational; unclassified state is not silently assigned a zone. Twenty-six-marker/seven-system interface demo is distinguished from the 15-marker kit. Specialized and one-time options stay separate. |
| `/es/science` | Laboratory interval versus EVA range, estimated age versus score, catalog versus kit, seven derived metrics and daily-device context are separated. Example values are labeled. No causal correlation or universal range claim was introduced. |
| `/es/pricing` | Quarterly 99 €, 15 markers, shipping, 499 € one-time laboratory option, six specialized panels, all comparison groups and 11 categorized FAQs retained. Cancellation applies at the end of the billed period. The contradictory “unlimited free upload” promise was removed from product copy; free upload remains. |
| `/es/about` | Madrid origin, mission, founder background, source quotation, four principles and open roles retained. Final small positive-lifestyle rephrase is offered for the prevention principle; it does not change the quotation. |
| `/es/contact` | General/investment/partnership/press/support intents; source mail addresses and team link; honest simulated form outcome. Specialized-panel prefill now maps identifiers into Spanish. |
| `/es/blog` | Coming-soon editorial surface, no fabricated article library. Example notice prevents a false mailing-list confirmation. |
| `/es/beta` | Explicit practice access code and simulated waitlist; no real enrollment claim. |
| `/es/metodologia`, `/es/metodologia/completa` | Source methodology content preserved with table of contents and source links. No new calculation is performed by these documentation views. |
| Legal privacy, terms, cookies | Body text preserved exactly after semantic normalization; no paraphrase of legal obligations in imported documents. |
| Login/signup/callback/recovery/reset | Password, magic link and Google demo outcomes are differentiated. Required health/terms/adult acknowledgements and optional marketing remain separate. Signup now persists health/marketing choices into Profile. Recovery now proceeds through the valid reset demonstration, then login. |
| Onboarding | Four stages: introduction, profile context, explanation level, first route. Spanish-first; explicit sample data; 15/99 quarterly and 499 one-time choices. Profile now preserves the onboarding `other` sex value instead of showing an empty select. |
| Checkout resume | No card request or real payment claim. Quarterly renewal and one-time panel remain distinct. Completion now says “Ver mi panel” for Full Panel and “Ir a mi kit” for quarterly. Address deep link is `#direccion`. |
| Dashboard | Latest report, age/score availability, illustrative classifications, next action, dated capsule selection, wearable absence and kit state are legible concepts. No missing figure is represented as zero. |
| Labs / report folio | Selected report identity and provenance, no-data/pending/context/error states, unit-sensitive comparisons, search/filter, sample export and contextual next actions. Latest resolver no longer fills unknown-report data with June fixtures. |
| Biomarker detail | Date, unit, interval and source accompany the value; history is from owned available reports. Single/missing/unknown states and edited-unit limitations are stated. No invented continuous measurements. |
| Upload / report context | Explicit sample or metadata-only document flow; human review; pending/processing/ready distinction; context version tied to a report. “Guardar” never implies a real clinical analysis. Canonical Spanish context option keys are preserved; remaining label accents are in the final substitution file. |
| Report archive / editor | Correct archive/restore/delete consequences, report-scoped changes and estimates invalidation. Consent/session gates now agree with Profile’s promise that withdrawal hides results. |
| EVA AI | Independent consent and entitlement, prepared educational responses, selected-report evidence, source values and no-causation text. No simulated answer is described as a fresh clinical assessment. |
| Mi kit / booking | A plan and status screen, not a fabricated appointment calendar. No invented delivery date. Quarterly kit and one-time lab option remain distinct; future professional consultations stay upcoming. |
| Profile | Identity, language depth, device permission/replacement/revoke, address, billing state, Spanish-held English, independent notification/marketing/health/AI choices, sample export and sign-out. All simulated mutations state their practical effect. |
| Deletion status | Request is distinct from completion; session-only demo receipt; pending/manual-review/completed states; explicit no-real-deletion outcome. Real-account receipt tokens are rejected by the preview. |
| Internal operations | Restricted demo role, separate internal wording and fictional people/records. Processing states are now Spanish, and failed operations do not claim a successful mutation. |

## Corrections verified during review

1. **Signup choices now match settings.** `AccessPage` carries explicit health and optional marketing flags through password/magic/Google completion into Profile. The error correctly calls the three required controls “casillas”, not three processing consents.
2. **Recovery now demonstrates recovery.** Forgot-password confirmation opens the valid reset example with the return path. Reset completion goes back to login. Google completion no longer promises an email link.
3. **One-time purchase language stays one-time.** Full Panel confirmation opens its panel details; quarterly opens the kit. Profile/Book do not turn Full Panel into a recurring subscription.
4. **Free upload copy no longer contradicts its limit.** Pricing retains free access without an unlimited promise while the audited app/preview uses five free uploads.
5. **Privacy consequence is consistent.** Archive and ReportEditor now gate session, consent and deletion state before report values render, matching Dashboard/Labs/Biomarker/Profile.
6. **Spanish forms keep their context.** Contact prefills translated specialty labels; Profile recognizes the `other` onboarding value; Admin displays translated processing states.
7. **A missing result stays missing.** Labs’ report resolver now uses June values only for `demo-junio`, March history only for `demo-marzo`, and explicit report values for uploads; unknown provenance remains unavailable.

These are source-verified corrections. `copy-checks.json` records the eleven assertions. Package-level tests separately cover value/unit/provenance and identity/receipt validation; root’s final browser scenarios remain the behavioral acceptance evidence.

## Exact document check

Compared the original `<main>` text after removing only duplicate H1/media/control/script/style nodes with the integrated document HTML:

| Document | Result |
|---|---|
| Privacy | Exact normalized body text: 4,120 characters |
| Terms | Exact normalized body text: 3,506 characters |
| Cookies | Exact normalized body text: 2,063 characters |
| Short methodology | Exact normalized body text: 3,306 characters |
| Complete methodology | Same content; one whitespace difference only: `> 2x` becomes `>2x` during HTML normalization. No number, word or symbol changed. |

Legal body paragraphs and clauses were not edited by the copy specialist. The imported titles/layout and page introductions are outside the legal body.

## Preserved source conflicts — before a connected commercial launch

These are source inconsistencies already documented in the parity matrix, not new claims to resolve by design preference:

- **Full Panel composition:** source surfaces variously say 40+, 80+, 120+ and catalog 165+. The preview consistently presents a 499 € one-time laboratory panel with scope to confirm. It does not attach 165+ to that purchase.
- **Free upload entitlement:** marketing says unlimited; the current app has a five-upload gate. Product copy now promises free entry, not unlimited quota. Confirm the commercial entitlement before connection.
- **Estimate access:** free marketing language and app paid gates differ. Estimates remain conditional on both available data and access; the preview never computes a missing score.
- **Clinical wording:** the source contains “diagnóstico”, “asistente clínico” and “closer to center is healthier” in places. Rewritten UX uses educational interpretation and context; exact methodology/legal documents remain source text.

## English preparation and stopping rule

Spanish is the only enabled locale. Page packages expose Spanish copy catalogs and backend identifiers are separate from labels. Shared locale helpers and fallback behavior exist. Some root-authored utility routes still use inline Spanish; those need extraction when English is commissioned, not machine translation activated now. The preview does not claim an English release is finished.

Apply the remaining safe label substitutions once, run the affected route smoke checks, and stop. No further stylistic redesign is required by this copy review. Reopen only for a new contradiction, broken state or explicit user feedback.
