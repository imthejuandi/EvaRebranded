# Pricing panel selection review — 26 November 2026

Candidate: shared isolated `/workspace/eva-entry-preview` worktree. No commit, push, deployment or real service mutation performed by this subtask.

## Scope and file changes

- `components/pages/pricing/PricingPage.tsx`: named panel-entry anchor, query selection and test hooks; separate free upload path; existing three-column selector now standard, enhanced and full; four-option comparison; standard-specific process/terms/biomarker headings; removes biological-age and EVA AI comparison/marketing promises.
- `components/pages/pricing/ServiceCalendar.tsx`: internal panel type shares the preview-only enhanced ID; calendar accepts only the three established service types so no enhanced cadence is invented.
- `components/pages/pricing/ServiceContents.tsx`: enhanced selection uses its own explicit, qualified caption rather than inheriting lab or standard inclusions.
- `components/pages/pricing/pricing.css`: keeps existing layouts and assets; anchor scroll offset, separate free link, appropriately sized unconfirmed-price text, readable three-column labels and scrollable four-option comparison.
- `components/pages/pricing/PanelOfferUnderstanding.tsx` (new): pricing-local replacement for the shared offer component, using the same established editorial classes. Removes unconfirmed biological-age copy, conflicting historical 40+/165+ counts and the unsupported two-day turnaround. Does not edit the shared component.
- `lib/site-content/panel-preview-copy.ts` (new): direct EN/ES panel facts, comparison, conditions and query helpers. No locale JSON edited.

## Route contract

- `/{en|es}/pricing?panel=standard#elegir-panel` enters the existing pricing page at a unique stable selector anchor, with the standard panel selected (internal established ID `quarterly`).
- `panel=enhanced` selects informational enhanced-panel detail; `panel=full` selects the documented laboratory panel. `panel=free` can still show the free selection. Missing/unknown values safely select standard.
- Panel buttons are native `button` controls with `aria-pressed` and `data-panel="standard|enhanced|full"`. The page exposes `data-selected-panel` with the public names.
- Changing panels updates `panel` and `#elegir-panel` using history replacement, preserving other query parameters. A popstate event keeps the language switch URL synchronized.
- Standard action retains existing browser-local `/signup?plan=quarterly` preview. Full retains `/signup?plan=full`, recognized as `full_panel` by existing preview policy.
- Enhanced action is only `#panel-enhanced-details`, an always-rendered informational article. It has no signup, checkout or ordering intent.
- Free action is separate from the paid selector: `/{locale}/signup?plan=free&redirect=%2Fes%2Fupload`, preserving the established private-upload locale boundary and existing free return intent.

## Product facts and assumptions

- Standard at-home: exactly the existing named 13 biomarkers, €99 + VAT per quarter, cancel anytime. ApoB explicitly excluded. Tasso+ and existing two-way shipping terms preserved only for standard.
- Enhanced at-home: ApoB included by latest owner instruction, superseding the older no-ApoB prohibition only for this option. All other biomarkers, count, frequency, price, timing and availability remain to confirm. No inherited standard fee, subscriptions or entitlements are implied.
- Full: distinct laboratory panel with the existing documented €499 one-time, no-subscription service terms; no biomarker count or contents invented. Mapping evidence: `lib/preview/policy.ts` maps `full` to `full_panel`; `components/preview/AccessPage.tsx` names the €499 laboratory panel; `docs/upload-allowance-qa.json` documents one-year uploads and one-time purchase.
- Free: five report uploads total, PDF or photo accepted; EVA Score availability explicitly requires enough compatible data. No AI or biological-age launch feature promised.
- Existing specialty catalogue and other pricing content remain in place. No account creation backend, payments, orders, appointments or integrations were added.

## Verification and review

- Two TypeScript runs completed without errors during bounded implementation; root owns the single final combined-candidate build/type check after other agents finish.
- `git diff --check` passed after the final source edits.
- React best practices skill `c13/react-best-practices` applied: pure locale copy; narrow typed service boundary; cleaned-up popstate listener; semantic controls; no new network calls, heavy dependencies or backend mutations.
- Bilingual copy recommendations from `/root/entry_copy` applied (enhanced scope/conditions, conditional free score, removal of inherited age/count/timing claims). Independent final copy, UX and Impeccable review remains with the root’s assigned reviewers.
- Rendered typography, responsive wrapping, focus, direct-query hydration and link interactions: NOT VERIFIED in this subtask at handoff. Root is building/serving the exact combined candidate and owns the browser evidence. No rendered PASS inferred from source.
