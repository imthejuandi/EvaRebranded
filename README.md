# EVA Rebranded Website

The working source for EVA’s rebranded website lives in [imthejuandi/EvaRebranded](https://github.com/imthejuandi/EvaRebranded), on `main`. It includes the bilingual landing, approved media, application preview, design history, integration references and browser QA evidence.

The approved landing baseline is **review version 39**, UI commit `991dd5310f6e1efc1819e76d37db40016adb3cdb`. Later documentation and GitHub synchronization commits preserve that interface. [Fresh-checkout verification](docs/github-workspace-verification.json) records the consolidated source checks.

- Review: [English](https://eva-content-review.jdlagop.chatgpt.site/en?review=39) · [Español](https://eva-content-review.jdlagop.chatgpt.site/es?review=39).
- Continue the remaining work: [Launch handoff](docs/LAUNCH_HANDOFF.md).
- Project rules and evidence: [AGENTS.md](AGENTS.md), [session handoff](docs/SESSION_HANDOFF.json) and [version 39 QA](docs/format-spacing-qa.json).

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

[Browser QA instructions](scripts/browser-qa/README.md) accompany the evidence for [version 38’s complete landing/preview-flow checks](docs/final-browser-qa.json) and [version 39’s focused format checks](docs/format-spacing-qa.json). Older `check:content`, `check:delivery` and import-era expectations include superseded copy; consult the handoff and relevant section checks before using them as release gates.

## Source and publishing

GitHub `main` is the consolidated rebrand workspace. The existing [review Site](https://eva-content-review.jdlagop.chatgpt.site) retains its own source repository and publication receipts. `.openai/hosting.json` identifies that review project; it is not a binding to `evahealth.es`. A Git push saves source; review-site publication uses the separate Sites save/deploy workflow.

Keep GitHub and the review source synchronized. Preserve the review-project identity and record the deployed UI commit separately from documentation commits. Do not introduce production deployment automation or a custom-domain cutover while the launch hold remains in place.

The original version 6 import is preserved in [migration-source.json](docs/migration-source.json) and [migration-validation.md](docs/migration-validation.md). These describe historical provenance; the current handoff and native release receipts identify the approved version.
