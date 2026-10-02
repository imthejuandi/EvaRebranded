# Executive reading — 2026-09-18

Supersedes the earlier count-based story. The dashboard now reads report-owned bilingual narrative, per-marker interpretations and actions; keeps latest-ready plus newer-pending separate; preserves six source zones; and shows saved context without claiming it was used by generation.

Implementation, SAVEE references, limitations and verification are recorded in `outputs/eva-refinement-2026-09-18/dashboard-implementation.md` at the workspace root. Run `node --test --test-reporter=tap components/pages/dashboard/dashboard-reading.test.mjs` from this project.

All content remains clearly fictional. Report provenance guards are integration requirements, not a claim of new production backend functionality. Existing stored fixtures are not automatically rewritten; reset the ready scenario to inspect the new sample reading.
