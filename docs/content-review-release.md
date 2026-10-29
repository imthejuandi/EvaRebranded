# EVA content review

This branch is an independent review of the original-content restoration. It builds on `feat/english-public-site`. It does not switch the live EVA production frontend or merge either branch.

## Review destinations

- English: `/en`; Spanish: `/es`.
- Page-by-page review and open decisions: `/en/review` and `/es/review`.
- Original route transcripts, interaction states, and source links: the original-reference links for all 16 route families, in both languages.

## Included

Seven public pages gain curated bilingual explanations using the original proposition, founder story, model distinctions, result zones, formulas, plan scope, service details, and contact channels. All 32 captured source variants and 109 interaction states remain available as historical reference. Preservation in the reference archive is distinct from integrating every sentence into the redesigned narrative.

The five legal and methodology documents have complete Spanish and English bodies, tables of contents, and source references. Account-entry screens are bilingual, including the English upload gate. The private app preview remains Spanish. Forms, authentication, purchases, and device journeys remain simulated.

Desktop runner entrance: the dot/photo canvas now feathers the actual displayed crop at both sides, matching an additional native-video mask. This prevents the left crop boundary from appearing as a vertical cut. The desktop video fades in over 450ms when playback becomes ready. Mobile retains its existing composition and reduced-motion users retain the static presentation.

## Decisions before migration

Resolve original-source conflicts before approving clinical or commercial copy: panel counts and inclusions, score eligibility and required inputs, validation/calibration figures, target ranges, service timing and cancellation terms, device claims, headline statistics, company details, and privacy processors. The review hub lists these questions. Preserved original claims are historical source material, not newly verified facts.

Production authentication, payments, messaging, laboratory integrations, and device connections are separate work. This release does not enable them.

## Verification

The TypeScript check, static export, English coverage checks, content preservation checks, preview route/anchor checks, and runner choreography checks cover this source. Browser evidence is collected separately under `/workspace/eva-review-browser` and `/workspace/eva-runner-review`. Clinical accuracy and current commercial validity require the decisions above.
