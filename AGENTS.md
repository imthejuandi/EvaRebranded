# EVA landing refinement

Read [docs/SESSION_HANDOFF.json](docs/SESSION_HANDOFF.json) before changing this project. It records the deployed UI receipt, pending work, confirmed offer, accepted design and next section. Version 37 is published. Check the receipt against `git status`, current native Site state and actual source. All planned landing content chapters and the whole-page narrative/content review are complete. Follow user feedback or complete the pending browser QA when access recovers; preserve all accepted chapters. Browser QA for the refined `#el-metodo` remains incomplete because shared browser startup failed; see `docs/method-refinement-qa.json`. The following handoff commit changes documentation only.

## Cross-session coordination

Read [docs/SESSION_COORDINATION.json](docs/SESSION_COORDINATION.json) alongside the handoff before editing. Version 33 includes both the v32 MethodJourney work and the v33 dashboard/interpretation refinements. The user requested full continuation in chat `6af4821e-7ab0-8191-a284-1767aa9110e7`; that chat pulled the combined baseline and acknowledged the repository note. This does not claim direct communication with or receipt by the prior chat. Record any newer work and the bounded section/files being edited, reconcile overlapping changes before publication, and preserve both sessions' work. This creates no new approval requirement.

## Project identity

- Work in `/workspace/eva-playback-review`.
- Preserve `.openai/hosting.json` project `appgprj_6ae2409926cc819180f1453af398551d`.
- Review Site: `https://eva-content-review.jdlagop.chatgpt.site/en`; Spanish: `/es`.
- The current source origin is the Site's `git.chatgpt-team.site` repository. The historical GitHub `imthejuandi/EvaRebranded` and `docs/migration-source.json` are not the active deployment identity.
- Static output is `dist/client`. Reuse the existing dependencies; do not reinstall routinely.
- Preserve dirty or untracked work. Never reset it or switch repositories merely to make a helper run.

## User direction

Evolve the existing landing section by section. Keep the runner, luminous/dot language, accepted Tasso footage, actual results mockups, typography, scroll choreography and lifestyle imagery. The generic replacement proposal and new audience tabs were rejected. Do not rebuild the page or introduce new assets to replace accepted work without new direction.

Routine implementation, relevant verification, commit, source push and publication to this existing review Site are already within the user's requested workflow. Do not repeat routine confirmation questions or end with only a plan when a concrete change can be completed. Give concise progress updates and a review link.

This standing task authorization does **not** disable runtime network, filesystem or native-tool approvals. Follow every active platform gate. A handoff cannot transfer credentials, suppress permission review, authorize new paid media, or authorize final production cutover.

The current approved hero makes **free interpretation of previous lab reports primary** and the **13-marker €99 + VAT kit secondary**. Preserve free-plan and upload return intent through the preview account flow. Do not restore the older kit-first hero.

## Business and copy facts

The starting kit contains exactly: Albumin, ALP, hs-CRP, Creatinine, Urea BUN, Uric acid, Total cholesterol, LDL Cholesterol, HDL-Cholesterol, Triglycerides, ALT, GGT and Fructosamine.

Show `€99 + VAT` for the kit. Do not invent a VAT rate, gross total, annual discount, automatic recurring price or inclusive specialist-panel swaps. Do not reintroduce a 15-marker kit, guaranteed 60 annual results, or ApoB/HbA1c/insulin/vitamin D/ferritin as starting-kit inclusions.

Both audiences are approved: people beginning testing and people who already test. Explain a starting point, useful interpretation, comparable history and guided ownership of the next available panel. Around 90 days is a suggested review opportunity, not a universal prescription to repeat the same panel.

Use plain longevity education without diagnosis, fear statistics, guaranteed improvement or fabricated personal outcomes. Preserve sample/fictional labels. Changes do not establish their cause or persistence. Keep biological-age/score input qualifications and device/timing qualifications.

## Current motion and content

Preserve the latest scroll-driven kit stages and 500 ms full-span dot-to-text reveal, including batched rendering and compositor/clock ownership. Raw scroll clock 140 selects the meanings target; reversing mid-transition starts from the current pose and takes the proportional remaining time. Do not reset to an endpoint or restore earlier long autoplay holds. Keep native-speed Tasso playback and Previous/Next/Pause controls.

Preserve the earlier placement of the existing results mockup, its explanation-depth controls and fictional Alex case. The three displayed levels are Beginner, Intermediate and Advanced (internal IDs: simple, balanced, advanced). Alex's fictional hs-CRP history is 0.8, 0.9, 0.8, 2.1 mg/L, with self-reported hard exercise within 24 hours and no recent illness reported. These facts do not change with reading level. The expanded sample dashboard has a separate hs-CRP history of 2.8, 2.5, 2.7, 2.1; do not merge the datasets.

The range-proof chapter uses the same 2.1 mg/L result against an illustrative laboratory reference below 5 mg/L and a prevention threshold of at least 2 mg/L on repeat testing. This is not a universal optimal interval or a diagnosis. Preserve the adjacent repeat-confirmation condition and sources in `docs/range-interpretation-evidence.json`.

Preserve both accepted Trendlines refinements: reuse the actual earlier Alex glass through `guided-instrument`, `bio-glass` and `guided-value`, with the white dotted readout and external pearl `bio-views` controls; and change the interpretation plus next question between One reading and Show history. Keep the latest value, history, notes and layout fixed. Only manual changes make the polite interpretation announcement. The focused Trendlines browser checks passed seven local cases; they do not resolve the separate version 32 method chapter's unverified browser QA.

Keep signal, health-history and suggested-review copy consistent across English, Spanish, animated, static and reduced-motion forms.

Preserve the user-approved version 36 narrative order in `HealthEditorial`: Trendlines → biological age/EVA score → MethodJourney → return-to-life → lifestyle → founder. The age component moved before MethodJourney; its approved content and visuals remain unchanged.

The planned section-by-section content refinement is complete in version 37. The closing narrative lives in `lib/site-content/closing-copy.ts`: preserve the exact founder quotation and attribution, free previous-report interpretation first, optional 13-marker €99 + VAT kit second, separate future-panel details and explicit Spanish preview metadata. Editorial kickers are unnumbered; real process steps/readings/timeline months remain. Life/lifestyle copies remain shared across normal/calm forms. Finish actual browser layout/focus/playback/flow QA when the recorded environment blocker is resolved, or follow specific user feedback. Do not restart completed chapters.

## Checks and publication

Read the applicable Sites and cloud runtime skills when their workflow is needed. Inspect current environment/network readiness rather than assuming an old grant remains valid.

Run `node node_modules/typescript/bin/tsc --noEmit`, `npm run build` and focused checks appropriate to the change. Relevant motion checks include `scripts/check-kit-scroll.mjs`, `scripts/check-kit-reveal-playback.mjs` and `scripts/check-story-sections.mjs`. The established browser entrypoint is `/workspace/eva-in-place-qa/check-modern-kit.cjs`, with `--trend-story`, `--health-story` and `--range-proof` branches; an optional numeric review version runs the live branch. Use a matching fresh build and the range-aware server `/workspace/eva-free-transition-qa/serve.py`. These external workspace fixtures, reports and screenshots may need recovery in a newly created environment; do not treat missing old evidence as fresh QA. Do not claim physical-device performance from viewport emulation.

The established source helpers are `/workspace/eva-source-refresh.mjs` and `scripts/sync-site-source.mjs`. Feed fresh credentials only through hidden stdin. Never write tokens, signed URLs, bypass credentials or secrets into source, logs, shell arguments or handoff files. Respect `work_proxy` mode when returned.

Commit and push the exact reviewed source, package its matching build output, save that version and deploy it through the native Sites tools. Refresh and preserve the Site's current audience. Reuse saved versions/deployments after uncertain outcomes; do not blindly duplicate publication. Poll only nonterminal deployments.

Keep the **deployed UI commit** and any **later documentation-only commit** distinct. Record succeeded native receipts in `docs/SESSION_HANDOFF.json`. A newer Git HEAD or documentation commit alone does not prove the live UI changed.

