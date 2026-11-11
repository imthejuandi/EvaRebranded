# EVA review-site browser checks

Run from the repository checkout in a managed environment with Playwright and `/usr/bin/chromium` available. These runners use the inherited HTTP(S) proxy and normal TLS trust. They do not install a browser or start a local preview server.

The default target is the published EVA review Site. Check native Sites metadata first: the `review` query is a cache-busting label, not a deployment pin.

```bash
EVA_REVIEW_VERSION=38 node scripts/browser-qa/layout.cjs
EVA_REVIEW_VERSION=38 node scripts/browser-qa/story-sections.cjs
EVA_REVIEW_VERSION=38 node scripts/browser-qa/footer-hit-targets.cjs
EVA_REVIEW_VERSION=38 node scripts/browser-qa/entry-flows.cjs
EVA_REVIEW_VERSION=38 node scripts/browser-qa/core-landing.cjs
```

The managed workspace conventions are `/workspace/eva-playback-review` for source and `/workspace/eva-in-place-qa` for generated reports/screenshots. Inspect each runner before using a different workspace. Run one page per runner at a time; close all owned browser contexts when finished.

Entry-flow checks block non-GET/HEAD/OPTIONS network requests, use fictional browser-local preview state, stop at upload without a file, and stop at kit checkout before confirmation. Never run them against a real account or payment workflow without reviewing their scope.

Version 38 passed evidence is in `docs/browser-qa-v38/`; the consolidated scope, fixes and limits are in `docs/final-browser-qa.json`. These tests use emulated viewports and make no physical-phone frame-rate or production-backend claim.
