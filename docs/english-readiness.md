# English rollout preparation

This preview launches in Spanish. No partially translated English route is exposed.

Page packages keep Spanish copy in named `*.es` dictionaries. `lib/preview/locale.ts` provides typed locales, shared English/Spanish controls, UTC date/number formatters and explicit Spanish fallback. Run `node scripts/prepare-locale-catalog.mjs` to refresh the stable-key source inventory, source-line references and empty English translation template in `lib/site-content/locales/`.

The inventory covers text nodes and authored multiword strings in new page modules, shared UI, data fixtures and landing content. It intentionally retains source references for inline strings so the English pass can migrate them to reviewed keys. It is a preparation artifact, not a claim that every existing landing component has already been migrated to runtime localization. Legal document HTML remains separately source-owned and needs its complete approved English counterpart.

Before enabling English: translate the pending catalog and remaining inline landing strings; wire page copy selection and locale routes; verify all validation/status/aria labels, units, dates and plan cadence; preserve report/plan/return-to query state across language switching; test longer English labels and menus at 320px; replace disabled language affordances only after complete copy and route review. Keep official logos and clinical marker symbols unchanged. Do not mechanically translate source legal text without review.
