# Biomarker history — Results

## Delivered interface

`LabsPage` uses only report-owned example values, never the catalogue's invented history. The glass result capsule contains an interactive timeline, exact dated values, provenance and the selected report's persisted interpretation. Both the timeline and the all-results change view use the same per-marker model.

The window ends at the marker's latest sample on or before the selected report. It includes at most the previous calendar year (inclusive), with a clamped leap-day anniversary. The visible axis spans the numeric observations actually available. Single-date results do not create a trend. Duplicate dates retain all values without an ordered connecting line; the selected report wins same-day display identity. Exact canonical units are required; bounded values (`<`/`>`) remain in the table and cannot become exact deltas. A missing current value does not erase the earlier numerical history.

Direction is a descriptive computation, not a clinical improvement judgment or an invented stability tolerance. Two dates use 'between the two samples'; a series that reverses direction is labelled as varying. The interpretation supplies clinical context independently of this arithmetic.

## Authenticated migration path

The public System04 site remains the explicitly requested fictional preview. No real accounts, credentials or patient data have been added to it.

`readLabsHistoryFromServer(reportId?)` is ready for a dynamic authenticated route and returns `LabsHistoryResult`. It uses the existing user-cookie Supabase client, no-store GET reads, current consent/onboarding/paid-access guards and ownership-scoped ready reports. It does not use an admin key, mutate the backend, persist health data locally, or fall back to fixtures. `LiveLabsResults` consumes this snapshot and reuses exactly the same `BiomarkerHistory` component.

Example dynamic-route wiring during the actual frontend migration:

```tsx
const result = await readLabsHistoryFromServer(reportId);
return <LiveLabsResults result={result} locale="es" />;
```

The authenticated original app layout must continue to protect this route and refresh it after any consent/account change. Do not place this route inside the synthetic PreviewProvider. Do not enable it by merely supplying production credentials to the static preview.

### Existing backend fields verified through GitHub main

- `lab_results`: `id`, `user_id`, `collection_date`, `source`, `status`, `summary_narrative`, `summary_narrative_es`.
- `biomarker_values`: `lab_result_id`, `biomarker_key`, `biomarker_name`, `value`, `unit`, `zone`, `comparator`, `interpretation`, `interpretation_es`.
- Join `lab_results!inner(...)`, scoped to authenticated `user_id`, `status=ready`, `collection_date <= selected report date`.
- Paginated metadata is then trimmed to each biomarker's year. A query error, ambiguous observation identity or safety cap returns an explicit unavailable/invalid state rather than incomplete history masquerading as complete.
- Missing translations remain missing; English fallback is marked with its actual language. Stored prose is rendered as text, not HTML.

### Narrative scope and required backend follow-up

The original `src/lib/ai/generate-master-interpretation.ts` already builds evolution context from up to six ready panels; `apply-tier.ts` persists active language/reading-level interpretations. The new reader consumes these existing active fields unchanged.

That generator does **not** yet guarantee the same one-year window as this graph. It also lacks explicit as-of filtering, canonical-unit/comparator qualification in historical context and a narrative input revision. The response therefore explicitly carries `narrativeScope: 'stored-report'`, not a claim that the prose was generated from this graph.

Before asserting that the clinical narrative is recomputed from precisely this historical window during migration:

1. Apply the same as-of/date, unit and comparator rules to the generator's evolution input.
2. Persist the observation IDs/revisions, interval and generation timestamp used by a narrative.
3. Invalidate/recompute after corrections, additions, removals or archive changes affecting that history, not only changes to the latest panel.
4. Verify clinical interpretation and per-literacy language output using owned test accounts.

Do not automatically call the current regenerate-summary endpoint: it may only rematerialize an existing master, which does not prove refreshed longitudinal inputs. No clinical generator or schema changes were made as part of this preview delivery.

## Verification

- `node lib/labs/biomarker-history.test.mjs`: calendar cutoff, short extents, old reports, numeric directions, qualifiers, units, missing observations, duplicate/same-day reports, consent and safe rendering.
- Existing dashboard reader tests protect access gates and raw-field mapping.
- `node lib/dashboard/backend-sdk.test.mjs`: real pinned SDK, intercepted synthetic HTTP; confirms authenticated ready-report joins and no-store GETs. It is not a test against a real patient's backend.
- `node node_modules/typescript/bin/tsc --noEmit` and production build.
