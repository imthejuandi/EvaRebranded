# Dashboard backend migration

Status, 21 September 2026: **ready for authenticated integration; intentionally inactive in the design preview**. JD requested sample data until the actual frontend migration. The `/es/dashboard` preview remains static and uses clearly labeled fixtures. Do not mount the templates or configure a real project in the public design preview merely to show the selected visual design.

## Existing contract

`lib/dashboard/backend-server.ts` creates the original cookie-based, user-scoped Supabase client. `readDashboardCore` verifies the user remotely, then checks the owning profile, onboarding, recorded privacy/health consent, and the original paid-access rule before requesting health fields. It selects the latest ready report while identifying newer pending-context samples separately. It never accepts a caller-supplied user ID or uses an administrator key.

- Biological age: `profiles.current_ba`, otherwise the selected `lab_results.biological_age`. Profile age retains its own calculation date, method, sample count and window.
- EVA Score: the same ready report's `lab_results.longevity_score`; zero and out-of-domain values are unavailable. Grade is shown only if supplied alongside a valid score.
- Summary: that report's `summary_narrative_es`, with its complete English counterpart available as a labeled fallback. No generated replacement or invented summary endpoint.
- `backend-readout.ts` maps the authenticated snapshot into the selected `HealthSignature` component. It does not create a fictitious full profile or copy real information into `PreviewProvider`/localStorage.
- The real report URL is `/es/labs?result=<owned-report-id>`. `/es/labs/<id>` is not a production report-detail route.

Source reverified against `imthejuandi/eva-health` commit `3897bf0e5a69f6d06e52906772a101fc459aca73`. Relevant contracts match the earlier audit. A migration must recheck schema and access logic at its chosen source revision.

## Activation in the real application

1. Reuse EVA's existing authenticated server client/provider where possible. The standalone factory is the reference implementation, not a reason to replace working authentication.
2. Mount `app/es/dashboard/page.tsx` from this folder in the real application, and use the actual shared shell. Its dynamic/no-store declarations are required for per-user health results. The current preview's `output: 'export'` must remain intact until a server-capable migration target is selected.
3. Merge this folder's `proxy.ts` behavior into the host's existing auth proxy; do not overwrite unrelated routing. Preserve refreshed cookies, private/no-store responses and RLS. On a host using the older `middleware` convention, adapt only the convention to that framework version.
4. Supply the existing public project URL and publishable/legacy anon key through the host's environment. The factory rejects service-role/secret keys. Never put credentials in source, fixtures or design artifacts.
5. Retain existing login/onboarding/consent/billing destinations. The reference view does not introduce a second login system. Its unavailable states contain no sample fallback.
6. Verify with an authorized test account in the real host: successful read, no session, expired session, missing consent, unpaid access, no ready report, a newer pending report, independent missing estimates, and sign-out clearing the view. Confirm the actual response is private/no-store. SDK tests with intercepted HTTP are not proof of a live production read.
7. The new editorial summary presentation is awaiting design approval. The reference live renderer displays the complete backend narrative safely as plain text; do not port the separate summary prototype automatically.

## Rule for subsequent dashboard components

Every metric, summary, interpretation, history series and action must declare its existing backend source, ownership, report/date identity, access gates and empty/error behavior. Keep fixture data behind the explicit preview boundary. If the backend lacks a field or operation, record the gap; do not fabricate a working connection or derive a clinical claim in presentation code.

## Verification

Run `node --test lib/dashboard/backend-reader.test.mjs lib/dashboard/backend-sdk.test.mjs components/pages/dashboard/health-signature.test.mjs` from the app. The SDK suite uses pinned real clients against intercepted synthetic HTTP and never contacts a patient project. Full typecheck and preview build are also required. Live authenticated verification is deferred by JD's instruction.
