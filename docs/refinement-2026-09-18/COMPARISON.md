# EVA original source → redesign: what can connect, what cannot yet

Audit source: `imthejuandi/eva-health` at `0ee2c7745a9417428a9e08db0a0e53c6047473f3`, inspected through the GitHub integration. This verifies source capabilities, not the exact version deployed at evahealth.es. All redesigned interactions use fictional preview data; no production backend has been connected.

| Area | Original business source | Earlier redesigned preview | Refinement / connection decision |
|---|---|---|---|
| Whole-panel executive story | Generated Spanish/English narrative for each report | Counts and generic templates | Restore report-owned prose as the primary story. Existing backend can supply it; new presentation/model mapping required. |
| Meaning of each biomarker | Generated result-specific interpretation plus separate static clinical notes | Generic catalogue text, sometimes shown as the result explanation | Preserve both as distinct content. Report, dashboard and marker detail must use the same selected report. |
| What to do next | Generated prioritized actions, related biomarker keys and action status | Static profile/chat links | Reuse original action records, grouped by owning report. Preview actions are clearly fictional. |
| hsCRP illness question | Structured `currently_ill` is collected for the sample | Hardcoded question; confirmed context implied understanding | Display recorded answers and unknowns accurately. **New backend work:** the inspected generator/chat do not consume the saved sample context. A recorded illness is not an established explanation for hsCRP. |
| Richer dated recent-illness history | Boolean current illness; no reviewed onset/resolution event contract | Suggested recent-infection wording | A dated event model and interpretation revision policy would be additional backend work. No such service is claimed here. |
| Critical/missing results | Six server zones, reference/optimal bounds, reported and normalized units | Simplified four states and catalogue ranges | Preserve original zone and units. A missing interval or interpretation remains visibly unavailable. |
| Ready versus pending report | Most recent ready panel remains available while another sample is processing | Latest pending report could hide the available reading | Restore separate ready and pending selections; verify report identity, dates and revisions in tests. |
| Literacy/language | Three server materialized tiers; ES/EN fields | Frontend detail levels | Prepare original tier mapping and bilingual fields. Spanish launches first; no connected rewrite service is implied by the local selector. |
| Wearables and estimates | Dated wearable observations, rolling/per-report estimates with source metadata | Mostly connection flags and illustrative numbers | Preserve typed dated observations and missing states; show illustrative estimates honestly. Production algorithm validation and exact estimate provenance remain integration/release work, not a claim established by design. |
| Checkout | Quarterly, annual and one-off full panel | Annual absent | Restore annual intent and its original illustrative price; keep quarterly sampling distinct from annual billing. No payment session is created. |
| Profile and shipping | Separate surname and paired identity-document fields | Identifiers absent | Restore the input/data shapes and shipping readiness checks. No personal identifiers are required for the example. |
| Upload | Profile prerequisites, cumulative quota, 10 files, 15MB/file, 40MB total, supported formats | Different limits and quota logic | Align validation with the inspected source. Preview still uses a fictional document rather than parsing personal uploads. |
| Kit | Cycle identity, due/tracking fields, extraction registration/correction | Five visual steps only | Add the original timestamp action, without falsely advancing the lifecycle or claiming the laboratory order was dispatched. |
| Admin | Kit assignment/shipping/reopen/cancel, readiness guards, bridge synchronization | Legacy queue only | Add a synthetic cycle desk and failure/retry states. Local gate is not production authorization. |
| Beta/contact | Password gate and waitlist; direct contact email service | Simplified gate and simulated forms | Restore corresponding demo flows and exact service shapes. No emails, subscriptions or cookies are sent. |
| Account deletion | Synchronous authenticated deletion response; best-effort ancillary cleanup | Implied asynchronous receipt/status API | Remove the invented connected receipt workflow and describe the real response. Any future asynchronous recovery workflow requires backend work. |
| EVA AI | Authenticated paid chat, history, SSE at `/api/ai/chat` | Proposed richer request/recovery port | Correct the existing endpoint mapping. Rich typed recovery events remain a proposed adapter contract, not an existing API. |

Detailed source citations, limitations and evidence:
- `../dashboard-comparison-2026-09-18/production-backend-audit.md`
- `utility-contract-audit.md`
- `utility-source-evidence.json`

## What the requested creative tools actually contributed

| Tool | Verified direct access and actual use | Implemented destination |
|---|---|---|
| SAVEE | Direct board reads and image viewing. Specific references are retained in `journal-contact-savee.json`, the dashboard notes and creative briefs. Used for composition, glass material, image color/texture and editorial hierarchy. No SAVEE photograph was copied as a new EVA asset. | Dashboard evidence instrument, Journal reading desk, Contact composition and image direction. |
| 21st.dev | Official authenticated CLI search and direct code retrieval. Aceternity StickyScroll result952 supplied the closest-breakpoint reducer, content mapping and sticky composition. Attribution and licence retained. | `SourceStory`, actually imported by Method; native scrolling, direct chapter controls and readable mobile/static scenes. |
| Higgsfield | Four completed new image jobs, visually inspected and optimized into responsive WebP derivatives. Exact prompts, jobs and hashes in `image-provenance.json`. | Morning table for Method; service still life for Pricing; everyday notebook for About; correspondence gesture for Contact. |
| Remotion | Real `SamplePassport` React composition/Player, with new chapter-controlled artwork, pause/scrub and offscreen/static behavior. | Method's continuous sample identity story. It is a controllable illustration, not purported footage of a laboratory. |

The approved homepage remains the style reference. This refinement is local until separately delivered and verified on a public URL. Implementation is not acceptance: the executable report, independent design/copy/motion reviews and remaining findings determine completion.
