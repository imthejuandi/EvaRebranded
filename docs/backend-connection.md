# Connecting the EVA preview

This delivery is an interactive frontend with synthetic data. It is not connected to production and does not create accounts, send email, process health documents, charge cards or delete a real account.

Historical functional reference: EVA app commit `f68f955` plus the working state audited on 12 September 2026. The original public site was captured separately. These references do not establish compatibility with the current production revision.

The approved version 39 landing and its entry flow offer free interpretation of previous reports first, with an optional 13-marker starting kit at **€99 + VAT**. The internal `quarterly` intent identifies that kit in the preview; it is not a confirmed recurring offer. Other commercial pages still need reconciliation before launch. The published review Site and GitHub workspace do not activate production services or switch `evahealth.es`.

## Boundaries already prepared

- `PreviewProvider` is the single sample-state owner; report IDs, selected dates, marker values, consent, plan and user preferences remain coherent across pages.
- `model.ts` defines display-domain types; `backend-contract.ts` defines the typed read/stream boundary and normalization rules.
- `adapter.ts` is the sole simulated mutation transport. Its operation registry names each real service boundary. It currently returns explicitly simulated outcomes only.
- Each page package's handoff records source states, payloads, validation and eventual endpoints. The operation inventory is retained in `docs/backend-route-map.json`.

## Connection sequence

This sequence is preparation for a later authorized integration, not authorization to activate it. Recheck the existing production revision, schema and service contracts before connecting any real account, health document or payment.

1. Replace preview identity with authenticated server session and owned queries. Route guards must preserve a validated local return path, onboarding state and intended plan. Keep credentials out of browser persistence.
2. Normalize source profile literacy (`beginner/familiar/optimizer`) to presentation (`simple/balanced/advanced`), notification field names, exact source units, nullable estimates and status. Use server entitlements, never the sample plan flag, for paid features.
3. Replace static `demo-*` routes with dynamic owned UUID result routes. A missing or not-owned report returns an indistinguishable not-found state. Pending context routes back to that report; processing never renders sample results.
4. Connect upload to the reference catalog, authenticated multipart extraction and idempotent job handling. Poll 202 jobs with bounded retries/cancellation. Review and confirm typed values with a versioned durable context and draw-specific transient context. Deferred context is a pending draft, not a null-context confirmation.
5. Connect report/date/value edits and deletion to the existing owned APIs. Recompute interpretations on the server; do not reuse an old score after an edit or convert units just by changing their labels.
6. Connect checkout and billing to server-created Stripe sessions. Preserve plan/cancellation intent. Book remains kit and membership status, not appointment scheduling. Fulfillment state and dates come from the backend.
7. Connect EVA AI history, cursor pagination, SSE accepted/delta/complete/error, request-ID recovery and abort. Persist server message IDs; retain distinct session, entitlement, health and AI consent gates.
8. Connect profile, notification preferences and versioned wearable consent. Apple Health import requires authority, device/generation/sequence metadata and explicit replacement. Connect private export and asynchronous deletion with the existing receipt/status flow. Admin requires real role checks, MFA and an audit trail.
9. Remove the scenario drawer, synthetic localStorage, scripted responses, demo-ready buttons and mock completion language only after corresponding real states pass integrated tests. Keep a separate development mock adapter for regression tests.

## Decisions to resolve before production

- Enforce the approved report-upload allowance on the server. A free account can upload five reports in total. An active home-kit subscription grants unlimited uploads for its active period. The €499 one-time clinical panel grants unlimited uploads for one year from purchase without a subscription. Store subscription and laboratory-panel access end dates independently, derived from verified server billing and purchase records. The one-time migration for an undated fictional browser fixture applies only to the preview. Test entry, overlap and expiry against the account’s free usage. [Version 48 preview checks](upload-allowance-qa.json)
- Current pricing examples still describe a 15-marker quarterly offer, annual billing and a €499 broader panel. Reconcile them with the approved 13-marker €99 + VAT starting kit; future-panel scope, pricing and billing remain separate decisions. Historical full-panel counts also differ across original pages and are not a confirmed current specification.
- Confirm the VAT-inclusive payable total and kit terms before a real purchase flow relies on them. Do not infer a VAT rate, subscription, annual discount or included specialist-panel swaps from preview IDs or historical copy.
- Historical range policy must come from each result/reference version, including profile context. The sample intervals are illustrative and do not replace clinical rules.
- No production notification, payment, health-data upload, AI inference or account deletion has been exercised by this design preview.

## Verification at connection

Test anonymous/expired sessions, unowned IDs, missing/null data, revoked consent, past-due membership, partial upload/extraction, idempotent retries, unit mismatches, context revisions, interrupted chat, checkout cancellation, wearable replacement conflicts, deletion receipts and admin authorization. Existing preview interactions and source mapping provide the UI states; real service tests remain necessary.
