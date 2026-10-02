# EVA — independent design review

Reviewed 12 September 2026 against the integrated preview in `/private/tmp/eva-system-03`.

**Final source pass: complete.** All five original corrections and the final Labs/deletion reading adjustments are present in the integrated source. No unresolved P1/P2 design finding remains from this bounded review. No further design restructuring is requested. Root’s 320 px browser stress pass remains the last visual gate.

## Assessment

The public pages now have distinct compositions within the accepted EVA language: a process journey, a scientific reference instrument, a pricing ledger and a photographic founder story. The customer app has moved closer to the actual landing widgets: luminous rounded capsules, restrained grain and rims, with neutral forms and navigation around them. That separation works. The remaining issues are primarily reading and interaction issues, rather than a reason to change the approved visual direction.

Keep the warm paper page backgrounds, the amber/sage/lilac data surfaces, the calm solid labels and the larger dotted values. Do not introduce more ornamental motion to the work surfaces. The full app needs reliable reading and clear next actions more than additional landing-page spectacle.

## Scope and confidence

This is a source-based review of the integrated public shell, method, science, pricing, about, contact and document layouts; the app shell, dashboard, labs, biomarker, assistant, upload/context, book, archive/editor, access/checkout, Profile and Deletion layouts. Operations received a structural CSS review only.

My isolated CUA surface returned “No browser is available.” I did not change the root agent's shared viewport or tabs. Consequently, this report does not claim a complete rendered visual/accessibility audit. The root agent's desktop/mobile CUA pass remains the visual acceptance gate. The optional Impeccable CLI was unavailable offline (`ENOTCACHED`), so no detector score is reported.

The root agent reports that Dashboard has been visually reviewed at 1440 × 1000 and 390 × 844: the luminous overview, neutral surroundings, hierarchy and mobile range instrument are coherent, with no observed overflow. This is reported root validation, not a second independent screenshot review. About's final image is the new before-walk scene, replacing the earlier swim proposal; corresponding captions were updated.

## Changes required

The original findings are retained below with their final status so the review records both the issue and its resolution.

### P2 — Give all clinical states, units and comparison dates a readable floor

**Final status: corrected.** Book’s stage ink is now `#515b47`, approximately 6.28:1 on warm paper. Labs state/unit labels have the intended floor; the final appended rule also sets `.labs-change>small` and `.labs-focus-date` to 11 px / 1.4. All are verified in the integrated source.

**Files:** `components/pages/labs/labs.css:152`, `:153`, `:170`; `components/pages/book/book.css:39`, `:106`, `:120`.

Labs has explicit 8–9 px mobile status labels and a 9 px status in its selected-marker capsule. Comparison date text reaches 7 px. Book's kit stage states reach 8 px and use `#98a08b` on warm paper, approximately 2.38:1 contrast. These convey actual status and chronology, so treating them as decorative microtype weakens the user's ability to interpret the larger numbers or itinerary.

Use at least 11 px and 1.4 line height for status, unit and comparison/date labels at every breakpoint. Allow wrapping and grow the row/capsule rather than shrinking the text. For Book's stage states, use an ink with at least 4.5:1 contrast against the actual paper background. Keep tiny typesetting only for nonessential art captions. The Labs owner has completed an appended 11 px / 1.5 floor for summary, row and capsule states and focused range units, with wrapping and larger summary controls; root should recopy the amended `labs.css`. Still verify the comparison date text, which was not named in that completed correction.

**Check:** At 390 and 320 px, confirm that “Óptimo”, “Fuera de rango”, unknown states, units and the previous measurement date remain readable without zoom, with no overlap or clipped pill text.

### P2 — Restore full-size entry text in the context form on mobile

**Final status: corrected.** A final 700 px breakpoint now applies 16 px to all `.page-upload .upload-field` inputs, selects and textareas. It comes after the earlier small-screen rules.

**File:** `components/pages/upload/upload.css:83`, `:160`, `:176`.

The later 16 px mobile input fix targets only `.upload-row-fields` and the custom-name field. Context's medication, supplement and day-of-draw fields still inherit 13 px, falling to 12 px below 360 px. These fields contain user-entered health context and need to be as easy to read as the extracted-result editor.

At the mobile breakpoint, set 16 px for every `.page-upload .upload-field input` and `.page-upload .upload-field select`, after the small-screen overrides. Keep compact labels, but do not compress the editable values. Preserve the existing single-column context layout.

**Check:** Open the context screen at 390 and 320 px; enter a long medication/supplement name and review the day-of-draw selects. The value should remain clearly legible and the row should not force horizontal scrolling.

### P2 — Bring the selected archive editor into view and keyboard focus

**Final status: corrected.** `ReportEditor` now focuses its `tabIndex={-1}` heading and scrolls it into view on report selection; `ArchivePage` retains and restores the originating button on closing. Scrolling uses `auto`, so it does not force animated movement for reduced-motion users.

**Files:** `components/preview/ArchivePage.tsx:8`; `components/preview/ReportEditor.tsx:11`.

“Revisar datos” only changes `selected`; the editor is rendered after the entire list of reports. There is no focus or scroll management for that new panel. With a longer archive, a user can activate the first report and see no visible change because the form appears below the viewport.

Either render the editor directly after the selected report or focus a programmatically focusable editor heading/container and scroll it into view on selection. Respect reduced motion. On closing, restore focus to the originating control. Preserve report identity and all existing data gates.

**Check:** Use an archive with at least six rows. Activate the first report by keyboard and touch. The editor and its report name should become evident immediately; closing should return to the original control.

### P2 — Mark the current public page in the shared navigation

**Final status: corrected.** The shared shell now uses `usePathname` and adds `aria-current="page"` to the matching links; the final shared CSS provides a restrained underline in the desktop/mobile navigation.

**File:** `components/site/SiteShell.tsx:7`.

Every public navigation item has the same appearance and no `aria-current`, even after moving to Ciencia, Precios or Nosotros. The app shell already communicates current location; the public shell should offer the same orientation.

Derive the current path and apply `aria-current="page"` to the matching desktop and mobile link. Use a restrained underline or ink-weight change consistent with the current shell. Do not add a new badge or a decorative animated indicator.

**Check:** Open each of the four public sections directly and through the menu. Exactly one appropriate item should be marked; the marker must remain perceptible on mobile and by keyboard.

### P2 — Keep confirmation content inside short viewports

**Final status: corrected.** The shared dialog now has `max-height:calc(100svh - 40px)`, vertical overflow and contained overscroll. Existing mobile action wrapping remains.

**File:** `app/app-preview.css:1` (`.eva-dialog`).

The shared confirmation panel has no maximum block size or internal scrolling. Its actions already wrap on mobile, which is good, but longer descriptions or a short landscape viewport can still push a decision outside the screen. Page-specific native dialogs already establish a scrolling bound, so the shared primitive should match that behavior.

Add a maximum height based on the small viewport height and safe outer padding, with vertical overflow enabled and contained overscroll. Retain the existing focus behavior and action wrapping.

**Check:** Review the longest confirmation at 390 × 600, at a short landscape viewport, and with browser text zoom. Both confirmation and cancellation must remain reachable.

## Profile and deletion — final addition

Profile extends the actual glass material with an identity capsule and a plan capsule, surrounded by calm, explicit form groups. The eight in-page groups cover the functional source categories without trying to turn every control into a decorative widget. Mobile field text is 16 px, the field grid becomes one column below 380 px, explanation options stack, and the switch control supplies a visible keyboard focus indicator. Save feedback remains attached to its form group; deletion and consent withdrawal have separate, plainly worded decisions. These are consistent with the broader app.

The deletion receipt has a separate low-motion progress composition and readable pending/complete/review meanings. It is accessible after sign-out and is clearly identified as a simulated receipt. It does not use a loading animation as a substitute for the state.

**P2 final adjustment — corrected:** `components/pages/profile/profile.css:112` (`.deletion-reference`) uses `#9aa38c` on `#faf9f1`, approximately 2.49:1. Its font falls to 10 px on mobile. At `:118`, unselected `.deletion-progress li` uses `#879279`, approximately 3.10:1. The reference and process labels should be readable content. Set both to `#637064` (approximately 4.93:1), keep the reference at least 11 px / 1.4 and retain wrapping. The final override at `profile.css:130` now sets the reference to 11 px and both text colors to `#637064`. This is verified in the integrated source; no other new design blockers were found in this source pass.

## Corrections verified in the integrated source during this review

- **Secondary-button hover contrast:** `app/site-preview.css:9` now supplies an explicit light hover background and dark text. This resolves the earlier inherited dark text on dark hover fill (approximately 1.61:1).
- **Contact → open positions:** `components/pages/about/AboutPage.tsx:47` now includes `id="equipo"`, matching the contact-page link.
- **Dashboard clinical label sizes:** the final `dashboard.css` rules now set status, unit and date labels to 11 px / 1.4 and allow the smallest capsules to grow. This correction is present in the integrated source.
- **Dashboard chronology:** the package uses date-proportional x positions and measured points with straight dashed guides rather than equal spacing and smooth invented trajectories. Confirm the latest TSX copy in the root integration.
- **Dashboard dated-report footer:** after a root browser finding, the package footer now opens the currently selected report and uses its marker count. The top overview link deliberately retains the latest report. Strict TypeScript and six-state/data-gate checks pass; root should recopy `DashboardPage.tsx` and verify March → full-report navigation once.
- **Science SVG stability:** generated SVG numeric attributes were rounded deterministically; no hydration-warning suppression was introduced.

## Acceptance gate

Complete the targeted root CUA pass now that the reading corrections are verified: one 320 px stress check; ready, empty and pending report states; keyboard navigation to a report editor and a confirmation. Profile/deletion source review is complete. Recheck only the affected areas after changes, then stop iterating unless new evidence reveals a defect.

The visual direction itself is cohesive enough to carry forward. Preserve the accepted glass and art treatment while fixing the small labels, attention management and navigation state.
