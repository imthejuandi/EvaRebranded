# Migration validation

The migration imports EVA — Website & App Review, version 6, source commit `f0d2bfef004a1d5f2d3225fa3772afa326f69368` into a new independent repository.

Verified during preparation:

- 578 original application, asset, and supporting source files are byte-identical to the recovered source. Only package identity, development instructions, ignored local files, and the original deployment binding changed; new development setup and provenance files were added.
- The package manifest and lockfile retain the original dependency versions and agree on the new project name.
- `npm ci` completed using Node 24.
- `npm run build` passed and exported the site.
- `npm run check:preview` passed all 13 checks across 55 exported pages, including internal links, anchors, preview fixtures, and mock operation boundaries.
- `python3 scripts/check-history.py public/archive` verified 11 historical manifest archives and 1,763 original files losslessly.

Two inherited content checks fail on existing cancellation-copy expectations: `check:delivery` expects `Cancela` in the root HTML, and `check:content` reports missing `cancellation` information. Application source is byte-identical to the original, so these are preserved source issues, not migration changes. Resolve the intended cancellation copy during design review before using those checks as production release gates.

The original Sites deployment binding was removed from this workspace. No deployment, domain switch, backend connection, or change to the current production frontend was performed.

The GitHub destination is [imthejuandi/EvaRebranded](https://github.com/imthejuandi/EvaRebranded), created by the owner and accessible to the connected GitHub app. The owner-created repository is public. Development setup links point to this repository; its private Codespaces preview remains separate from the current frontend.
