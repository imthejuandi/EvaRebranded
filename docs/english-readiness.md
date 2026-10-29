# English public website

The public website is available in Spanish and English. English routes cover `/en`, `/en/how-it-works`, `/en/science`, `/en/pricing`, `/en/about`, `/en/blog`, and `/en/contact`.

The page structure, images, animation timing, biomarker symbols, clinical values, euro prices, and service conditions are retained. The English copy uses British English. `lib/site-content/locales/public.en.json` contains the authored public-site translations, including controls, image descriptions, status messages, and animated captions.

`SiteLanguageProvider` selects language from the document layout. Separate route-group layouts produce the correct server-rendered `html lang` without a client-side language flash. Public routes include reciprocal language metadata, and the EN/ES links preserve the current public page, query string, and fragment. Public navigation stays in the selected language.

The account/app preview remains Spanish, as requested for this first pass. Its existing plan, report, and return-path parameters are preserved. The existing Spanish legal and methodology documents remain the source documents; English links label that boundary explicitly. No automatic legal translation or new service/clinical claims are introduced.

Run:

```sh
npm run build
npm run check:english
npm run check:preview
```

`check:english` verifies the seven exported English pages, rendered copy and accessibility labels, reciprocal language links, correct document languages, query/fragment preservation, Spanish-only boundaries, and clinical symbols/decimal notation. The broader preview check covers the public and app route graph.

The legacy application locale preparation in `lib/preview/locale.ts` still enables Spanish only. This is intentional: adding English to the app preview is separate work. Its source inventory and pending English catalogue remain available under `lib/site-content/locales/`.
