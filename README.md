# EVA Rebranded Website

The working source for EVA’s rebranded website lives in [imthejuandi/EvaRebranded](https://github.com/imthejuandi/EvaRebranded), on `main`. It includes the bilingual landing, approved media, application preview, design history, integration references and browser QA evidence.

The current review is **version 49**, UI commit `0f02d6a4a6832cd8bcd00550a85e78a23453097b`. [Free report format and three-specialist review](docs/report-format-qa.json). A free account includes five report uploads in total. Reports are unlimited while the home-kit subscription is active or for one year from purchase of the separate €499 clinical panel. The clinical panel is a one-time purchase and requires no subscription. [Upload allowance QA](docs/upload-allowance-qa.json) · [Quarterly home kit](docs/quarterly-home-kit-qa.json) · [Runner timing](docs/runner-2-5-second-entrance-qa.json). [Original consolidation verification](docs/github-workspace-verification.json) records the earlier fresh-checkout checks.

- Review: [English](https://eva-content-review.jdlagop.chatgpt.site/en?review=49) · [Español](https://eva-content-review.jdlagop.chatgpt.site/es?review=49).
- Continue the remaining work: [Launch handoff](docs/LAUNCH_HANDOFF.md).
- Project rules and evidence: [AGENTS.md](AGENTS.md), [session handoff](docs/SESSION_HANDOFF.json) and [upload allowance QA](docs/upload-allowance-qa.json).

**Production cutover is on hold.** This source synchronization does not connect the rebrand to `evahealth.es`, change DNS or activate production services. Application screens use browser-local fictional data. Commercial, legal and integration details remain before launch.

## Work online or locally

Open [GitHub Codespaces](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=1401130727). The development container uses Node 24 and installs the locked dependencies. Run `npm run dev -- --port 3000` and open the forwarded **3000** port; its initial visibility is private.

For local development:

```sh
nvm use
npm ci
npm run dev -- --port 3000
```

The project uses React 19, Vinext, Tailwind CSS and Remotion. `package-lock.json` pins dependencies. No production secrets are needed for the static review.

## Build and verify

```sh
node node_modules/typescript/bin/tsc --noEmit
npm run build
node scripts/check-english.mjs
node scripts/check-method.mjs
```

The build exports 113 routes to `dist/client`. Run `python3 scripts/serve-review.py` and open `http://127.0.0.1:4175/en` or `/es` to inspect that output.

[Browser QA instructions](scripts/browser-qa/README.md) accompany the evidence for [version 38’s complete landing/preview-flow checks](docs/final-browser-qa.json), [version 39’s format checks](docs/format-spacing-qa.json), [version 40’s dashboard cuts](docs/dashboard-conciseness-qa.json), [version 41’s manual Trend explanation](docs/trend-manual-qa.json) and [version 42’s Impeccable type/layout pass](docs/impeccable-typography-qa.json) and [version 43’s Trend emphasis](docs/trend-emphasis-qa.json). Older `check:content`, `check:delivery` and import-era expectations include superseded copy; consult the handoff and relevant section checks before using them as release gates.

## Source and publishing

GitHub `main` is the consolidated rebrand workspace. The existing [review Site](https://eva-content-review.jdlagop.chatgpt.site) retains its own source repository and publication receipts. `.openai/hosting.json` identifies that review project; it is not a binding to `evahealth.es`. A Git push saves source; review-site publication uses the separate Sites save/deploy workflow.

Keep GitHub and the review source synchronized. Preserve the review-project identity and record the deployed UI commit separately from documentation commits. Do not introduce production deployment automation or a custom-domain cutover while the launch hold remains in place.

The original version 6 import is preserved in [migration-source.json](docs/migration-source.json) and [migration-validation.md](docs/migration-validation.md). These describe historical provenance; the current handoff and native release receipts identify the approved version.
