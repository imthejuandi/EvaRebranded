# EVA art and motion review

Review date: 12 September 2026. Reviewer: `app_sweep`.

Scope: read-only review of the implemented preview in `/private/tmp/eva-system-03`. This review checks source, CSS, frame/visibility logic, asset reuse and local media sizes. It does **not** claim browser frame-rate or rendered contrast measurements; root owns the final desktop/mobile browser pass. No Site files were changed by this review.

## Outcome

No P1 art/motion defect was found in the integrated pages reviewed. The new screens generally use finite movement, real controls, static fallbacks and the accepted luminous glass on a neutral background. All five P2 art/motion findings have been resolved in the integrated source. The corrections improve mobile delivery and data clarity while preserving the accepted artistic direction. Browser performance and rendered contrast checks remain assigned to root.

## Findings

### Resolved P2 — Give phones a smaller version of the walking film

- Location: `/private/tmp/eva-system-03/lib/design.ts:5`; consumption in `/private/tmp/eva-system-03/components/story/GlowMotion.tsx:52` and `/private/tmp/eva-system-03/components/story/SolarMotion.tsx:11`.
- Original evidence: `solarLifestyle.video` always points to `post-run-coast-walk-cut.mp4`. The local file is 3,243 KiB (3.17 MiB); there is no viewport-specific video source. `GlowMotion` assigns that source with `preload="auto"` once it enters the 400px warm-up margin, including on phones. The runner video is a much smaller 888 KiB.
- Impact: the largest active editorial asset has the same transfer/decode burden on a phone as on desktop. This matters given the user's repeated feedback about mobile loading and choppiness. The responsive poster is already correct and prevents an empty frame, but does not reduce the video transfer.
- Correction: export a smaller phone rendition from the **same accepted film**, retaining its crop, glow, timing and natural movement; choose its source before assigning `src`. Keep the existing poster, visibility pause, reduced-motion fallback and single-play/replay behavior. Do not regenerate the people or add Tasso to their arms.
- Correction verified in source: `solarLifestyle.mobileVideo` now points to a new 438 KiB rendition, compared with the original 3,243 KiB (86.5% fewer bytes). `GlowMotion` selects it at ≤700px before assigning `src`. The initial reduced/static state avoids a desktop source request before breakpoint resolution. Root reports the same 221 frames, 24fps and 9.208s duration; that metadata was not independently re-measured here.
- Browser acceptance: at phone width a fresh load requests only the mobile MP4; desktop requests the original; offscreen/hidden playback pauses; reduced motion requests no MP4; switching to the first decoded frame preserves the poster crop.

### Resolved P2 — Do not eagerly fetch a photograph that is hidden on mobile

- Location: `/private/tmp/eva-system-03/components/preview/AccessPage.tsx:12`; `/private/tmp/eva-system-03/app/access-preview.css:3`.
- Original evidence: the cycling `<img>` has neither lazy loading nor a media-conditioned source. The art panel is set to `display:none` at ≤700px. A hidden eager image can still be selected and requested by the browser. Candidate sizes are 27 KiB at 600px and 117 KiB at 1200px.
- Impact: login, signup and password recovery can spend image bytes and decode work on art that the mobile visitor never sees.
- Correction: use a desktop-only `<picture>` source with a tiny empty fallback, or mount the art only at the visible breakpoint while reserving its desktop geometry. Add intrinsic width/height and `decoding="async"`. A lazy image is a useful additional safeguard, but media-conditioned source selection is the clearest solution when the image is deliberately absent on phones.
- Correction verified in source: root has replaced the eager image with a desktop-only `<picture>` source at `(min-width: 701px)` and an inline pixel fallback. This resolves the unnecessary mobile image request. Desktop geometry is reserved by the existing panel.
- Browser acceptance: fresh phone load of login and signup requests no cycling image; the desktop art renders without a layout shift.

### Resolved P2 — Let the history chart encode dates, not the index of each sample

- Location: `/private/tmp/eva-system-03/components/pages/dashboard/DashboardPage.tsx:144` (`EvolutionChart`; point and path construction around lines 151–154).
- Original evidence: each point's x coordinate is `56 + index * 408 / (readings.length - 1)`, and adjacent readings are joined by a cubic Bézier. The source dates are available on each report but are not used to space the chart.
- Impact: after a third upload, readings separated by a week and readings separated by months can appear equally spaced. The smooth curve also suggests a shape between measurements that was not measured. The current two dated fixtures and the nearby date buttons remain useful, but the visualization should remain accurate when the preview's upload flow adds a report.
- Correction: map report timestamps to the x axis. Prefer measured points with no joining path, or a subdued straight/dashed guide clearly described as a visual aid. Keep the accepted glass, the dot texture, the selection halo and the separate source/date controls.
- Acceptance: readings on days 0, 7 and 90 place the middle point near the first; one reading stays centered; identical dates are handled without division by zero; no extra intermediate measurements appear.
- Correction verified in the integrated Site: `EvolutionChart` now maps `Date.parse(report.date)` proportionally across the x axis and uses straight point-to-point guides. Coincident dates produce a centered point rather than division by zero. The accepted glass and measured points remain.

### Resolved P2 — Preserve a readable type floor inside the mobile capsules

- Location: `/private/tmp/eva-system-03/components/pages/dashboard/dashboard.css:316` and `:318` (the 470px and 330px container rules); base status rules at `:249` and `:280`.
- Original evidence: the capsule status and unit reach 9px at the normal small-screen container size; the status drops to 8px at the narrowest size. These are meaningful clinical-state labels, not only ornamental captions. They are rendered in white over a textured, luminous gradient.
- Impact: the main number is clear but the distinction between a value being optimal, outside range or unavailable can become harder to read, especially on phones. The bright edge glow makes tiny secondary type less forgiving.
- Correction: keep statuses and units at approximately 11px with a 1.4 line height, permit the state label to wrap, and use a stable dark center behind that text if a visual check finds it crossing a bright hotspot. Expand the capsule vertically if needed rather than shrinking the text. The accepted rounded material and dotted number can remain unchanged.
- Correction verified in integrated CSS: a final scoped rule at `dashboard.css:323` gives capsule units, statuses, selected-state text and dated labels an 11px / 1.4 floor; subsequent sizing permits multiline statuses.
- Browser acceptance: at 320/375/390px and text zoom, complete status labels fit inside the capsule and can be read without relying on dot color; no clipping or overlap appears.

### Resolved P2 — Give About its own principal artwork

- Location: `/private/tmp/eva-system-03/components/pages/about/AboutPage.tsx:33`; existing use in `/private/tmp/eva-system-03/components/pages/method/MethodPage.tsx:173`. Initial review occurred at package level; About is now integrated.
- Original evidence: About's primary image is the exact `after-swim-1200.webp` / `after-swim-600.webp` pair already displayed prominently on Method, with essentially the same portrait framing.
- Impact: the approved image treatment is consistent, but two major public pages acquire the same visual identity. The user's requirement was to carry the style into distinct creative assets rather than reuse the same focal content.
- Correction: make About's opener an original editorial composition using a new print/registration motif around the mission, or choose a genuinely different lifestyle image if an approved one is available. Retain coral/violet grain and candid lifestyle framing. Do not invent a founder portrait or alter the accepted Method image merely to create variation.
- Correction prepared and visually accepted: new candid before-walk image at `outputs/frontend-redesign/assets/before-walk.png` (1744×2336). Higgsfield job `e2a8db7b-8e05-4500-b217-568a65942e02`, GPT Image 2, 3:4, 2k/high, using the same original solar-grain reference. Exactly one generation, no retries or post-generation alterations. Full prompt, media reference, result URL, original hash and visual review are saved in `before-walk-provenance.json`. Verified in the Site: About now uses `before-walk-600.webp` / `before-walk-1200.webp` with matching alt text and the caption “Un pequeño ritual, antes de salir.” Its existing portrait frame fits the new image.
- Acceptance: the two public pages have recognizably different principal compositions while sharing the same type, paper palette and optical treatment. This is a design-quality correction, not a runtime blocker.

## Passing checks and route-specific direction

| Surface | Distinct visual/use of motion | Source review result |
|---|---|---|
| Landing | Approved runner tracking, scroll scenes, living signal field, pouch still, walking film | Native media pauses offscreen and in hidden tabs. Runner tracking uses decoded video callbacks and direct SVG updates; fallback RAF is paused with the media. Scroll animations seek only during scroll/resize, rather than running an idle loop. Existing walking film remains single-play with replay. |
| Shared menu | Glyph-to-dot hover/focus and a finite panel entrance | Dot morph runs only until its target is reached; it reverses from the current state, respects reduced motion and finishes when the document is hidden. Canvas DPR is capped at 2. Menu GSAP timelines are finite and use a static reduced-motion state. |
| How it works | A sample travelling through four distinct lab/reading stages | New 3.8-second Remotion sequence; manual play; `loop={false}`; viewport and hidden-tab pause; player imported only when near/visible and motion is allowed; SVG still for reduced motion and loading. Each stage remains independently readable through the tabs. |
| Science | Range comparator, age topography, score ruler and two-timescale wearable diagram | Mostly static SVG; range input moves its indicator directly. No idle or perpetual timeline. The diagrams explain separate ideas and are not copied from the landing's runner, pouch or biomarker gallery. |
| Pricing | Four rhythm columns and a flowing halftone print | Static SVG with a brief 350ms content change. Reduced-motion rule removes that change. No large external artwork or auto-playing media. |
| Book | Parcel study and a selected itinerary stage | New SVG parcel, rather than a fabricated Tasso model. 700ms one-time arrival; reduced-motion rule disables it. User-selectable stages retain their content indefinitely. |
| Dashboard | Accepted glass summary/capsules, measurement views and a small signal strip | 3.1-second finite scan is viewport/document-visibility paused; reduced motion removes the scan. Capsule view changes settle for 320ms. Capsule numbers are static via `calm`. The source now consumes report-specific overrides. History spacing and type-floor findings were corrected in the integrated Site. |
| Biomarker detail | Wide measurement ruler with halftone range texture, source/date controls and measured history points | Accepted glow material around a new instrument. No continuous timer or cosmetic autoplay. Values remain solid text. Plot contains measured points, not a fabricated trend. No Site correction required from this review. |
| Labs | Report folio, state index, range/change comparison and grouped result rows | Static, functional graph layout. No idle animation or media load. Differences use report readings and do not turn missing values into a decorative curve. |
| EVA AI | Editorial conversation with a separate glass evidence drawer | Simulated reply reveal is finite, stoppable and reduced-motion aware. Partial text is preserved; UI exposes sources independently of the reveal. No orb or background particle loop. The desktop/mobile composer still needs root's keyboard/viewport verification. |
| Access | Shared cycling art across one account-entry family | Reuse is appropriate inside this family and does not repeat the landing figure. Mobile download corrected in source with a desktop-only picture source. |
| Onboarding | Four explicit steps and selected language/context choices | No idle animation or large media. Change in content is direct and does not delay form completion. |
| Checkout, archive, operations | Confirmation/state tables and focused actions | No media or idle visual loops found. Operational screens remain distinct from the public editorial pages. Archive editor remains a clear paper form; its mobile value/unit layout uses two columns, with the biomarker name above. |
| Profile and deletion receipt | Shared glass credential/plan cards, static registration seals, direct settings and a receipt sequence | Final package TSX/CSS reviewed. No idle animation or media. State/field labels are at least 11px; phone text inputs are 16px. Reduced motion removes switch/link transitions. Forms stay on neutral paper. Root integrates after owner’s functional checks. |
| Upload and report context | A document resolving into measured columns; explicit context accordions | 72 transform/opacity dots gather once in 700–898ms during a bounded 950ms sample extraction. Reduced motion shows the final pose directly. Context forms are static and use no decorative timer or large media. |
| About | New candid before-walk editorial photograph, typographic founder story, static registration marks | New artwork visually inspected. Its 850ms viewport-triggered entrance is finite; reduced motion removes it. No generated founder identity, no fake product and no recurring effects. |
| Contact, blog, legal/methodology documents | Letter layout, typographic halftone print, long-form reading | Static editorial treatment. No unnecessary cinematic effects interrupt the reading/form tasks. |

## Artwork and delivery notes

- Personally inspected the new cycling and after-swim 600px stills. Both retain the warm peach skin/clothing, violet/blue shade, visible grain and candid lifestyle framing. Neither depicts a fabricated device or a founder portrait.
- The original two new photographs have different compositions and intentions: shared rest/conversation in account entry; reflective after-swim moment on the method page. A third new photograph now adds a man tying his shoe before a walk, approved for About. No new page reuses the runner, landing pouch still or walk as its principal artwork. The initial About duplication has been replaced with the new approved before-walk artwork; see its provenance above.
- The after-swim image has lazy loading, asynchronous decoding, intrinsic dimensions and a responsive 44 KiB / 244 KiB source pair. Its frame reserves space before loading.
- App glass has a neutral paper page around it, contained blur and a distinct dark center, so the site-wide background is not lilac. The repeated material is intentional; the graph/content inside each page is different.
- Background grain and glow are static CSS/SVG. No new application page introduces a full-screen canvas or recurring art timer.
- Global styles contain historical declarations from earlier iterations. Only rendered routes count as active media cost; unused historical assets on disk are not treated as requests or regressions.

## Final browser acceptance checks for root

1. At 390px, scroll the landing to the walking film, pause/leave it and return; confirm the poster/video crop matches and the existing pause/replay controls remain reachable.
2. At 320px and 390px, inspect Dashboard status/unit text, dated buttons, evidence drawer and the two-column capsules. Check 200% text zoom separately.
3. In a reduced-motion browser, inspect landing, menu and method: complete static content, no empty players, no MP4 request, no concealed content that requires animation.
4. In the method page, play once, leave its viewport, return and select a different stage. It must remain paused until the user starts it again.
5. In EVA AI, open the keyboard on a phone, send a prompt and stop a reply. Composer, Stop and last reply must remain above the bottom navigation; the evidence modal must have usable scroll space.
6. Check actual rendered white-on-glow text contrast at the brightest spots. This source review does not substitute calculated/rendered contrast sampling.

## Final integration coverage

Upload, report context, the updated Labs package and the archive report editor were added and reviewed during the sweep. About was reviewed at package level and its final integrated copy was checked: its photo entrance is an 850ms one-shot, reduced motion removes it, its principle registration marks are static, and its other sections carry no timers. The repeated-image finding is above. Profile and deletion receipt have now been reviewed at final package level (both TSX files plus `page-packages/profile/profile.css`): identity/plan cards use shared glass, decorative seals are static, settings are direct controls, and there is no idle animation or media. Phone input text is 16px; meaningful status/field labels retain an 11px floor. No additional P1/P2 art findings. Root is copying this package after the owner’s functional checks; this review does not claim a browser test of that final copy.
