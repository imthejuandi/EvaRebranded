# EVA front-end redesign plan

Planning baseline: accepted local EVA 03.35, inspected 12 September 2026. This is a design and implementation contract, not an assertion that the original site's complete inventory has been audited. Root owns that inventory and must finalize the route roster before dispatch. No website source was changed for this plan.

## What is established

The design describes preventive health as a positive, recurring part of ordinary life. Its contrast is between precise information and expressive, tactile imagery: ink and warm paper; human activity in coral, amber and violet light; optical softness; sharp data; analog dots. The landing's runner, diagonal headline and tracking signals are accepted, specific compositions. Preserve them on the landing. Extend their visual grammar to other pages without repeating the same runner, pouch, graph or dot-number sequence.

Actual source is authoritative over historical summaries. `lib/design.ts` still describes earlier typography. The current hero uses Hanken Grotesk; the official logo is artwork; the method currently uses the accepted natural-skin still, not the old branded video. Current navigation is the full kinetic panel, not the superseded narrow frosted dropdown.

## Shared contract

| Layer | Fixed rule | Permitted variation |
|---|---|---|
| Canvas | Ink `#0b1010`, warm paper `#f3f0e8`; paper text `#171b18` | Alternate by narrative purpose. Lilac stays inside images and data surfaces, never the default page background. |
| Accent | Amber `#e9a067`; subtle sage `#b9bdae` | Warm/cool optical pools inside bounded art. Status must also have a label and never depend on hue alone. |
| Type | Official EVA image/mask in native proportions; solid Hanken 400/600 for new headline and UI work; existing landing text retained | Georgia italic for a short human aside. Analog lettering for one meaningful word or datum, not paragraphs. Technical labels use an explicit shared small-label token. No forced glyph stretching. |
| Scale | New page H1 `clamp(48px,7vw,104px)`, section title `clamp(36px,4.8vw,72px)`, body 17–18px/1.55–1.65, UI 14–16px/1.4 | Short mobile H1 can be 42px. Body measure 55–65 characters. Meta 11–12px only for genuinely secondary content. Solid and analog letterforms balance optically, not by equal boxes. |
| Spacing | 48px desktop / 24px phone gutters; 8px base rhythm; section space 80–120px desktop, 56–80px mobile | Content max 1440px; legal/article text max 720px. Grids can be asymmetric. Shared alignment lines and proximity must remain clear. |
| Material | Flat paper for reading/actions; fine dividing lines; optical glass only for information specimens | Glass may use colored pools, static grain and an inset rim. Keep text and chart marks sharp and comfortably inset. No universal glossy card wrapper. |
| Shape | Square or near-square action/editorial surfaces; capsules reserved for measurements and selection | Data shells can be generously rounded; do not turn every section into matching cards. |
| Action | One dominant task per section; compact solid fill or clear underlined link; 44px minimum hit target | CTA typography 14–16px semibold, detail regular. Existing landing's 200×44 CTA stays accepted. New transactional forms may use width appropriate to their task. |
| State | All controls define hover, focus, pressed/selected, loading, error and disabled as applicable | Pointer hover is optional enhancement; keyboard and touch must expose the same function. Errors appear beside the relevant field. |
| Art | Baked-in peach/coral glow, violet/blue shadow, visible fine grain, believable human anatomy and activity | New scenes and crops per page. Product identity comes from genuine supplied Tasso+ references. Do not regenerate the logo or use rejected device-placement footage. |

Consolidate a small token module and shared page shell before parallel page work. Do not globally rewrite the accepted landing CSS as a side effect. New page CSS should be scoped; document proposed token additions centrally before using them.

## Motion contract

1. A page gets one principal animated explanation, chosen because it clarifies the page's purpose. Supporting interactions remain quiet. A long Remotion scroll film is not the default inner-page template.
2. Scroll-linked scene transitions use connected translation, not circular wipes. Motion reverses correctly with native scroll. Labels settle long enough to read; content never requires chasing a moving target.
3. Brief UI responses use 160–240ms; editorial entrances use roughly 450–800ms; explanatory diagrams complete in 2–4.2 seconds, then hold. Avoid permanent decorative oscillation behind reading copy.
4. Use SVG or ordinary DOM for finite diagrams. Use the existing shader/canvas approach only where many dots are essential. Keep important text in HTML. Do not add a new animation framework or a Remotion player per card.
5. Lazy-load offscreen media, mount only selected interactive artwork, stop animation when hidden/offscreen, and respect reduced motion with a complete static composition. Provide posters, explicit replay where useful, and video pause controls.
6. New animations must not compete with the landing's existing runner tracking, Body Signal field or coastal walk. Those are visual signatures with specific narrative jobs.

## Proposed page-specific directions

The original-site sweep may change this roster. Preserve real URLs, content hierarchy and actual user journeys; do not invent inaccessible app features.

| Page family / likely route | Purpose and structure | Distinct art or interaction | Primary next step |
|---|---|---|---|
| Landing `/` / locale root | Approved story; reconcile source parity and factual exceptions | Keep the accepted runner/signals, Body Signal, glass specimens and existing sequence. Only add genuinely missing content. | Choose a kit / free upload |
| How it works `/how-it-works` | A practical service journey: before, collection, laboratory, understanding, repeat; FAQs near the relevant step | A vertical editorial timeline with a new sample-to-lab-to-reading graphic. Short advancing light paths reveal a clear chain. Do not reuse the landing's four-tab graphic or pouch still as its hero. | Start / see plans |
| Science `/science` | Explain what is measured, evidence, reference versus interpretation, biological-age limitations; expandable sources | An original reference-window instrument: a constant sample marker viewed through changing transparent ranges; halftone density suggests uncertainty, never a claim of improvement. Paper editorial page with a single ink demonstration. | Explore method / plan |
| Pricing `/pricing` | Fast comparison of the actual offerings, inclusions, payment cadence, cancellation and questions | An editorial pricing ledger with one clear featured plan, crisp comparison rows and a restrained four-reading cadence strip. No fake discount, unsupported savings, rolling numbers or invented plan. | Exact plan destination |
| About `/about` | Founder, motivation, approach and genuine team/partner facts | A new photographic essay with asymmetric portrait/candid crops in Solar Glow; a restrained sequence of text excerpts, not a reused running hero. Use supplied real founder identity only. | Method / contact / start |
| Blog `/blog` | The audited source is coming soon; communicate that honestly | A concise editorial holding page with a unique optical image treatment and a useful return/service link. Do not invent an article catalog, categories, authors or article routes. | Relevant service page |
| Signup / login / other public access screens | Preserve the original sequence, field purposes, validation and destination | A restrained paper form with a narrow ink editorial rail on wide screens; a small static signal motif may connect the brand. Keep motion away from inputs. | Existing authorized flow |
| Upload `/upload` | The source is gated: preserve login and return-to before intake | After demo access, a purpose-built document intake surface with clear file/processing/success/error states. An original dot-to-column diagram explains conversion without pretending a demo has processed a real file. | Access, then intake |
| Privacy / terms / cookies | Complete policy access, versions and section navigation | Common paper legal template, clear contents, readable hierarchy; no decorative film or display-dot legal text. | Return / contact |

Every page brief must name its own hero concept, one principal visual, its relationship to the content, and what it deliberately does not repeat from adjacent pages. Original diagrams are preferred to stock icon grids. Similarity in material and typography is desirable; identity of artwork and layout is not.

## Architecture and ownership

- Root owns routing, locale behavior, shared shell/navigation/footer, business link map, source manifest, media registry and final integration. Page agents do not independently alter shared navigation, tokens, dependencies or deployment configuration.
- Keep content separate from presentation with locale-ready keys and source URLs. Distinguish verbatim source facts, paraphrased explanation and clearly labeled illustrative UI data.
- Add internal redesigned route links only when those pages exist. Preserve intended external transactions until their actual public flow and endpoints are understood. Do not manufacture successful signup/upload/payment behavior.
- Suggested structure: `components/site/` shared shell/primitives; `components/pages/<page>/` owned page compositions; `lib/site-content/` reviewed content; `app/<route>/page.tsx` thin routes; `public/art/<page>/` unique output assets. Root selects exact locale scheme after audit.
- Each page agent owns only its route, page component, scoped CSS and allocated art directory. Deliver a source mapping, responsive captures and interaction checklist with the implementation.

## Stages and agent choreography

1. **Sweep and preserve:** root inventories every public route, locale variant, navigation/footer link, CTA, form, article and legal page. Record purpose, exact information, states and connections. Snapshot accepted design and media/history before changes. Flag access barriers and contradictory claims.
2. **Planning gate:** design specialist (this plan), copy specialist and art/motion specialist each review the sweep. Agree the shared contract and a short brief per page. Root decides route grouping and real versus illustrative interactions. Do not start page coding from guessed content.
3. **Foundation:** root implements shared shell/tokens/content interfaces and one representative inner-page skeleton. Verify mobile header/menu, localization path and source landing unchanged. Freeze interfaces for page agents.
4. **Parallel page waves:** assign a dedicated agent to each distinct page. With four active slots including root, run up to three bounded page jobs, or two page agents plus one active specialist when art work needs collaboration. Preserve agent identity for follow-up. Typical wave A: method/science/pricing; wave B: about/blog holding page; wave C: public forms/legal pages. Inventory decides actual groups.
5. **Independent review wave:** design, copy and motion/art specialists inspect all new pages, separately and in combination. They return concrete findings by page with evidence, not a numerical taste score. Use the available slots to run these reviewers in parallel after builders finish; then return corrections to each owning page agent.
6. **Integration and finite refinement:** root reviews every page and journey, applies shared fixes, assigns at most two focused correction passes for actual failures. Stop when the gates pass; user taste remains revisable. Do not extend into indefinite regeneration.
7. **Delivery:** root performs final route crawl, responsive/keyboard/reduced-motion checks, confirms original content coverage and documents deliberate exceptions. Keep a restoration checkpoint and change ledger. Publish only the verified completed experience through the established deployment path, then verify the public URLs.

## Required review gates

**Content:** every inventoried section/fact has a new location or an explicit reason for omission. Prices, panel counts, units, eligibility, cadences, citations, legal content and CTA destinations match the audited source. Do not silently erase discrepancies or invent clinical certainty. Prior import deliberately withheld unsupported 95%/€1.1T claims, qualified biological age and avoided contradictory directional specimen labels; recheck those decisions against the fresh sweep.

**Design:** inspect real desktop 1440×900, tablet 768×1024 and phone 390×844 plus compact 320×568. No overlap, horizontal overflow or clipped labels; body text is readable; information padding is generous; controls have visible focus and touch targets. Each page has a distinct composition and meaningful image/diagram while still clearly belonging to EVA. No emoji, floral filler, duplicated landing hero or invented device shape.

**Copy/story:** page introduction tells the reader where they are and why it matters; section order answers the next natural question; each CTA describes a real next step. Preventive health feels constructive and calm. Distinguish collection, lab analysis, interpretation and ongoing comparison. Preserve the founder's attribution and exact legal/clinical qualifications.

**Motion/art:** review beginning, midpoint and resting state; scroll backward; stop scrolling; pause video; leave/reenter viewport; use reduced motion. Motion must explain or support attention, never obstruct reading or demand excessive scrolling. Every new media asset has a clear provenance, optimized delivery and static alternative.

**Functional:** every internal route resolves; nav, back/forward, anchor links and language counterparts are correct; no false form-success states; controls are keyboard accessible; substantive content remains in static HTML. Test actual interactions and build/typecheck; do not rely on screenshot-only approval.

**Performance:** compare initial payload and interaction cost against accepted 03.35; no silent addition of a full animation bundle to every inner route, no above-fold download of offscreen videos, no timers running offscreen. Capture browser performance observations at phone dimensions and label them emulation, not real-device proof.

## Relevant baseline evidence

`components/story/ScrollStory.tsx`, `TrackedRunner.tsx`, `HeroIntro.tsx`, `HeroKitCta.tsx`, `MethodJourney.tsx`, `MethodPouchStill.tsx`, `BiomarkerGallery.tsx`; `lib/hero-layout.ts`, `story-motion.ts`, `runner-signals.ts`, `landing-content.ts`; actual styles in `globals.css`, `hero-kit.css`, `biomarker-glass.css`, `kinetic-navigation.css`, `method-journey.css`; review notes `protocol.md`, `content-import.md`, `storyline.md`, `runner-signals.md`, `hero-hierarchy-critique.md`, `03-19-method-journey.md`, `biomarker-glass-03-10.md`, `kinetic-navigation.md`.

Skill applied: `design:design-system`, for token coverage, component states, versioning and composable extensions. User's explicit request for distinct page artwork takes precedence over generic consistency advice.

## Confirmed scope extension — customer application

Root has now confirmed the whole public website **and the customer webapp**, Spanish first and English-ready. This phase is an interactive preview using sample data. Account, analysis, AI, booking, subscription and data-management touchpoints must be represented and documented, but no production backend is connected. This confirmation supersedes the earlier provisional assumption that signup and upload might remain external links. Keep the original route intent and return path inside the preview, while recording the production integration contract separately.

Source application inspected for structure and content only: clean `/Users/jdl/eva-health`, baseline `b803676`. `app_sweep` additionally reports newer `f68f955` route/state changes, including report deep links and deletion receipts; root must pin the final functional baseline. `app_sweep` owns the complete route/state inventory and delivers `route-map.md` plus `app-content-contract.json`. Preserve that inventory's functional distinctions; do not inherit its constellation, orb or old dashboard styling.

### App shell

The app is a working health journal, visually related to the expressive website but optimized for repeated reading and action. Use warm paper for primary work surfaces, an ink navigation rail, and selected colored glass instruments. Avoid a miniature marketing landing on every screen.

- Desktop shell: 232px ink rail, official wordmark, six visible primary entries where the inventory supports them (overview, analyses, upload, booking, EVA assistant, profile). Current location has a clear rule/label treatment, not perpetual dot animation. Content area has a compact 72px utility header, breadcrumb where needed, one page title and one primary action. Maximum content width 1320px, normal gutters 40px.
- Tablet: compact rail or drawer when the reading area would become too narrow; do not shrink data text to retain desktop columns. Phone: compact top bar and at most five bottom destinations, with remaining routes reachable from a labelled overflow/profile entry. Reserve safe-area padding and at least 44px touch targets. Detail and multistep pages retain an obvious back/close route with existing return intent.
- App typography: Hanken 400/600; page H1 36–48px desktop / 28–34px mobile; section title 24–30px; body 16px/1.55; compact data labels 12–13px. Use tabular numbers in comparative rows. One larger analog readout can mark a meaningful summary, but all dense tables and units use solid type. Dot animation must never delay reading an important result.
- App controls: input height 48px, label above, helper/error below; rectangular or modest 12–16px rounding. Data capsules can use the accepted luminous rim and larger radii. A form, table, quote and graph should not share the same capsule wrapper merely for consistency.
- Utility navigation and language controls remain still. Public header, app sidebar and form progress are different components sharing brand type, logo and tokens. Menu hover may borrow the legible dot morph only at sufficiently large type; never transform every data label on hover.
- A small persistent label says **“Vista previa · datos de ejemplo”** / **“Preview · sample data”**. This must be visible enough to distinguish simulated results and actions without occupying the page hierarchy. Demo-state selectors belong in an optional review drawer, not ordinary user task copy.

### Screen-specific design briefs

| Route / screen | Purpose and content priority | New composition / interaction |
|---|---|---|
| `dashboard` | Orient the member: latest reading, current collection/processing state, useful next action, biomarker summary, actions and wearable context where available | A horizontally composed **daily reading**: one broad translucent score instrument beside a short next-action ledger; below, a segmented results strip and a compact agenda. No landing runner, age-pair layout, orb or constellation. A brief band of halftone points settles into the summary when data is ready. Empty/pending members receive a useful next-step composition instead of fake metrics. |
| `labs` / `labs/[id]` | Understand a selected analysis; select report/date, search and filter by category/status, open a biomarker, read scores/interpretation and suggested steps | A **results folio** with a date spine and a dense, readable marker index. A selected result expands into an inline glass panel beside the list on desktop and beneath the row on mobile. Keep comparison labels, units, provenance, pending context and clinical caveats. Preserve the result deep link, archive/upload/kit links and selected date. Do not paste the landing's five-tile console. |
| `labs/manage` | Manage analysis records separately from reading results: inspect source, current status and permitted archive/delete actions | A **sample archive** built as chronological rows with small paper specimen thumbnails, processing/status chips and a clear action menu. Selection opens a focused record drawer. Preserve confirmations and cancellation for destructive actions; in preview they alter sample fixtures only. No decorative graphs where record metadata communicates better. |
| `labs/[id]/context` | Confirm/update durable patient context and day-of-draw context for an existing report, without repeating biomarker review | A **context sheet** with a persistent compact report identity card, two explicit question groups and an honest completion rail. Durable context includes medications, supplements, conditions, lifestyle and hormonal context; draw context includes fasting, exercise, illness, cycle, time, sleep and hydration as inventoried. Show why the information is requested and existing consent/skip/defer options. After demo completion, return to that same report's interpretation state. Soft glow can illuminate the small report card; questions stay flat and crisp. |
| `biomarker/[key]` | Explain one result with current value/unit/status, range meaning, history, definition, interpretation, sources and wearable context | A **measurement instrument**: wide horizontal interval ruler with halftone range texture, exact marker and an adjacent solid numeric readout. A separate history strip below has distinct point geometry and selectable dates. Historical value edits retain their original validation and sample-only confirmation. Keep next-kit versus one-time genetic options distinct. No reuse of the landing's rounded chart. Support missing/single reading, out-of-range and unknown-unit cases; never imply a favorable trend from a decorative trajectory. |
| `upload` (four steps) | Choose a report, review extraction, supply context and confirm according to audited flow | A **document workbench** with a real four-stage progress header. Side-by-side sample document and extracted fields on desktop; clear sequential stack on mobile. One finite dots-to-column animation can explain processing. Include validation, unsupported/empty files, processing, extraction failure, review corrections and pending-context outcomes. Mark processing as simulated; no fake claims that a real uploaded record was analyzed. |
| `book` | A plan/status screen, not a scheduling calendar: show free/active/past-due/cancelled membership, kit progress, shipping context and specialty options | A **kit itinerary** using a clear progress track, delivery/address panel and plan actions dictated by source behavior. Represent checkout, billing portal and specialty quote requests as explicit demo actions; preserve future-physician content without inventing appointment scheduling. A new abstract packaging contour or static original kit study may accompany the route; avoid the landing's pouch person or hovering product. |
| `eva-ai` | Ask about sample results; make evidence/context and limitations visible; preserve paid/free distinction | A **reading conversation** on paper: clear message column, anchored composer and an optional contextual result drawer. Assistant messages may cite sample biomarker chips linked to detail routes. No glowing chatbot orb or endless typing. Include suggested starters, scripted response, thinking, error/retry, reset/history and free paywall states; carry the original AI disclaimer. |
| `profile` / `privacy/deletion` | Preserve all nine source settings sections: identity, literacy tier, devices, shipping, communications, account/data settings and support; show deletion status/receipt in its own route | An **account folio** with a section index and short flat settings panels. Device summaries may be soft-glass badges; core fields remain neutral. Preserve literacy's effect on wording rather than the clinical reading, wearable consent/modal, notifications, subscription portal and distinct export/delete confirmations. The deletion receipt is an austere paper state with clear status and recovery/help path, not a celebration or ordinary settings toast. |
| `onboarding` (four steps) | Collect initial identity, health-literacy/context and path choices while preserving consent and return intent | A focused **welcome sequence** with one question group per view and a small visual progress composition, not a marketing hero. Stage-specific abstract light fragments assemble into a quiet complete form by the end. No motion over inputs; retain back/edit, skip where present, errors and selected path handoff. |
| Login / signup / forgot / reset | Access and recovery with original fields, validation, consent and redirect intent | A shared **access template**, with one slim atmospheric art rail on desktop and an uncluttered paper form. Distinct headings/outcomes for each task. Demo login selects a fictional member state; recovery and reset expose simulated outcomes. Do not send email, create credentials or imply actual authentication. |
| `checkout-resume` | Restore interrupted purchase intention and preserve the selected offer/return path | A compact **resume sheet** with exact plan summary, next action and cancelled/unavailable states. Demo progression moves to its scripted next route; payment details are not collected. |
| `beta` | Preserve the source beta invitation/form and result/error behavior | A concise public editorial form with one unique optical still or abstract printed signal; separate from account signup. Preview submission has an explicit simulated confirmation and does not subscribe anyone. |
| Admin: booking / result entry / processing log | Operational preview of real tabs/states, only if included by root's final route scope | A dense **operations desk**, intentionally lower in visual drama. Consistent tokens, strong table contrast, state filters, record detail and form feedback. Keep entry/review/progress screens distinct. Any approval, result edit or dispatch mutation operates on sample fixtures only. Admin requires its own explicit review rather than appearing as a customer navigation item. |

### Shared app primitives, with controlled variation

Root should define `AppShell`, `AppPageHeader`, `StatusIndicator`, `ResultValue`, `SourceTag`, `FieldGroup`, `StepProgress`, `EmptyState`, `AsyncState`, `ConfirmationDialog` and `PreviewNotice`. These are behavioral/semantic contracts. Each page still owns its principal composition. The accepted capsule's color, grain and inset light become a `GlassInstrument` material, not one mandatory chart or universal card.

Result status semantics come from the source contract. Preserve the distinct optimal/attention/action/unknown labels and whether a value is estimated, measured or missing. Use a dedicated small status mark plus text; glow color is atmosphere, not a second hidden clinical classification. Base fixture values must be coherent across dashboard, labs, biomarker details and chat references.

### Interactive-preview contract

- Root creates one sample-domain store and documented adapters. Page agents call that interface; no agent writes ad hoc network requests or independent fake users/results. Each adapter identifies the eventual production operation, inputs, response shape, loading/error states and responsible backend route/service.
- Provide named fixtures: free/new member, paid/no results, kit in progress, report processing, pending context, report ready, failed extraction and empty history. Preserve the source's real state distinctions; fixtures are not claims about current users.
- Route transitions retain selected report, biomarker, plan, locale and return-to destination. URL state should support deep links where the source does. Review controls can reset scenarios reproducibly.
- The preview can demonstrate save, upload, book, chat and confirmation, but the result copy must explicitly identify simulation. Do not submit to production, purchase, send email, create accounts, ingest health data, connect devices or perform export/deletion on a real account.
- Spanish content is complete first. Every new visible string, form error, loading state, status, aria-label and date/number formatter must support locale keys. English-ready means the structure and string coverage are correct; it does not mean leaving half-translated UI in an English route. Root decides whether the phase includes full English copy or a reviewed readiness inventory.

### Revised implementation waves

After the shared public/app foundations and domain fixtures are agreed, route ownership expands into bounded packages. A dedicated page agent can return for another screen after its prior page is reviewed, but every route gets an explicit brief and named owner.

1. Public method/science/pricing first while root freezes app-shell and fixture interfaces.
2. App dashboard, labs and biomarker detail together: these establish the reading primitives and coherent sample data. Review them as a connected task before propagating the material.
3. Upload, report context and archive management together: verify the full intake-to-report chain and its error states.
4. Booking, profile and EVA assistant together: verify entitlement, context and account links.
5. Onboarding/access, checkout-resume/beta and remaining public editorial/legal pages in bounded subsequent waves.
6. Admin gets a separate package if included, using the operational contract rather than a customer-page clone.

Dedicated design, copy and motion/art reviewers evaluate every route package. Use the three available worker slots in successive implementation/review waves, rather than attempting to run all page specialists simultaneously. Root owns integration and prioritizes corrections shared across screens before page-local polish.

### Additional app acceptance gates

Run the connected journeys, not just isolated screenshots: public CTA → signup → onboarding → chosen path; upload → field review → context → processing → labs → biomarker; paid booking → shipping/status; profile literacy/locale → updated presentation; free assistant → paywall; pending report → context → correct report return; simulated error → retry/cancel. Check that every demo state is reachable and reversible through the review fixtures.

Design review additionally checks scan time, data alignment, exact units/labels, internal capsule padding, table/list density, task focus, unambiguous current location and mobile keyboard/composer behavior. Copy review checks consent, source qualifications, simulated-vs-real outcomes and error recovery. Motion review rejects transitions that hide results or cause values to appear changed by animation. No app route needs an autoplay lifestyle video to pass the EVA brand test.
