# EVA Rebranding

Independent workspace for the EVA website rebrand, imported from **EVA — Website & App Review, version 6**. The existing EVA website and application continue to run separately. This repository has no production deployment connection.

## Work online

Open this repository in [GitHub Codespaces](https://github.com/codespaces/new?hide_repo_select=true&ref=main&repo=1401130727). The development container installs the locked dependencies with Node 24.

In its terminal, run:

```sh
npm run dev -- --port 3000
```

Open the forwarded **3000** port to see the website and preview changes. The preview port starts private. Commit and push changes to save them on GitHub.

For Codex, enable `imthejuandi/EvaRebranded` in the connected GitHub repository access, then select it in a Codex environment. If the repository does not appear on mobile, finish that setup in the web version of Codex first.

## Develop locally

```sh
nvm use
npm ci
npm run dev -- --port 3000
```

The site uses React 19, Vinext, Tailwind CSS, and Remotion. Dependencies and versions are preserved from the design preview. Public pages and the interactive app preview use synthetic data; no production secrets are needed to work on the design.

## Verify changes

```sh
npm run build
npm run check:preview
python3 scripts/check-history.py public/archive
```

The static build is written to `dist/client`. The preview check validates internal links and the preview contract across 55 exported pages; the history check validates preserved archives. Both passed during import. Additional motion checks remain under `scripts/`.

The inherited `check:delivery` and `check:content` commands currently fail on cancellation-copy expectations in the imported landing page. The application source was preserved unchanged during migration. See [docs/migration-validation.md](docs/migration-validation.md) before using these older checks as release gates.

## Final frontend switch

Work and review changes here before connecting this design to the existing application. Preserve the real authentication, payment, and health-data services during the eventual integration. The connection boundaries are documented in [docs/backend-connection.md](docs/backend-connection.md) and [integration/dashboard/README.md](integration/dashboard/README.md).

The original Sites deployment binding was removed from this workspace, so it does not target the current design site. Publishing or changing production hosting is a separate step after review.

See [docs/migration-source.json](docs/migration-source.json) for the imported source commit and [docs/design-history.md](docs/design-history.md) for the original design notes.
