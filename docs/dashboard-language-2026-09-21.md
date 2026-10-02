# EVA dashboard language — approved consolidation, 21 September 2026

JD selected the final **B / Anillo ring and raised glass orb**, the **paper executive summary**, and **C / Campo actionables** for the dashboard and its reusable brand language on 21 September 2026. This supersedes the earlier pending score-dot decision. The earlier B / Precisión instrument provides the metric hierarchy; its selected Anillo treatment supplies the ring, glass material and dotted readings. A / Constelación, C / Pétalos and D / Topografía remain separate score-dot studies. C / Campo is the selected actionable pattern and is distinct from score-dot C / Pétalos.

The implementation preview uses explicit synthetic fixtures and keeps the authenticated backend reader prepared for later frontend migration. Design approval, local implementation, live backend connection and verified public deployment are separate states. This document records the approved system; it does not establish a patient connection or publication.

## One reading, three levels

1. **Orient: B / Anillo.** Biological age stays central inside the raised glass orb; the separate EVA Score uses its established 1–100 arc. Both readings use coarse glowing dot digits and appear directly, without a decorative count-up. Each estimate keeps its own method, source and unavailable state. Surrounding marker segments retain report order and the same selected report's biomarkers.
2. **Understand: the paper executive summary.** Every backend paragraph and caveat remains visible in the chosen source variant. Paragraph splitting follows source structure. Emphasis uses verified exact biomarker names only, with at most two per paragraph and six in total. It does not invent advice, reorder clinical priorities or summarize away qualifications. Supporting evidence, perspective and context remain a secondary disclosure.
3. **Act: C / Campo.** A distinct recommendation has its own dot field and source wording. Shape responds to the corresponding source range direction, with an unclassified fallback. A hover, focus or tap reveals the exact lab value, unit and supplied optimal interval. Figure size is an artistic affordance, not a clinical contribution percentage.

## Recommendation navigation

The current actionable title is the main control. A small current/total count describes its position. Side arrows move one actionable; the center opens the full list. Preserve empty, single and arbitrary-length lists; no assumption of exactly four recommendations. Integrated demo count follows its real source fixture (two), while the preserved C study supports broader synthetic count scenarios.

## Data and readiness

The EVA Score, narrative, recommendations and biomarker rows must share the same selected available report. Biological age remains an independently scoped rolling profile estimate with its own source and reference date; selecting a report must not relabel that estimate as belonging to the report. A newer processing report does not silently mix with earlier results. Consent withdrawal, missing metrics, deletion and stale/foreign action data remain gated. Give report-bound summary and actionable siblings distinct identity/key namespaces so switching reports removes the complete previous view. Source numbers and categories are preserved. Prepared adapters and Spanish/English strings are retained for migration; no new backend endpoints or answers to clinical questionnaires are fabricated.

Compare biological age with completed chronological years only when a valid date of birth and verified reference date are available. Use the same date basis as the biological-age estimate; missing, invalid, future or unusable dates yield an unavailable comparison. Never derive real age from a guessed default or the fixture's demo age. Keep the chronological age, signed difference and explanation available as text.

The ring describes **Biomarcadores de este informe**. Supplied optimal/above/below/unclassified status may change a marker group's geometry, with an explicit neutral fallback. Position, displacement, group area, particle count and glow do not encode clinical importance, severity or contribution weights. One report biomarker owns one decorative point group; its particles are not extra observations. Until persisted calculation traces identify actual input membership, do not call every result an input or contributor to either estimate.

## Visual and motion system

Use self-hosted Hanken Grotesk and official EVA artwork. Warm paper, sage, peach and lilac carry the current brand; neutral backgrounds keep measurements readable. Quiet prose contrasts with the action field. The glass treatment is a reusable material for a primary reading, not a requirement to turn every card into an orb.

| Material / behavior | Approved specification |
|---|---|
| Raised glass dome | Circular lens over a shallow plinth; translucent sage/teal body, light upper rim, dark lower edge and a soft cast shadow give depth. Preserve a darker central veil under the readings. |
| Rim light and refraction | Fixed reflections sit above the data. A masked optical annulus is transparent through the center 77%, then adds restrained diffusion toward the perimeter: 0.45px blur / 1.14 saturation, reduced to 0.25px / 1.08 on compact dials. This is a CSS optical approximation, not a physical 3D refraction model. All cover layers are pointer-inert and decorative. |
| Coarse dotted readings | Warm white `#fffdf6`, broad distinct cells, restrained glow; age remains dominant and EVA Score secondary. Exact values remain available to assistive technology and in the metric explanation, independent of the decorative rendering. |
| EVA Score arc | Draw an explicit path from 12 o'clock to the exact score endpoint at `score / 100 × 360°`; use two half-arcs at 100 and no arc for an unavailable score. Use a dark 3.5px under-stroke and bright 1.7px core (3px / 1.5px on compact dials), with a fixed-width track and matching endpoint marker. Do not restore the normalized-circle dash technique that rendered 82 as a full ring at small sizes. |
| Fluid color | Two transform-only sheets under the fixed center veil and rim, at **24.347826s** and **32.173913s**. These are 28/1.15 and 37/1.15: a 15% speed increase, with approved color, opacity and amplitude retained. They are ambient material and never a live health signal. Pause offscreen and in a hidden tab; reduced motion shows a still material. |
| Mobile text fitting | Reserve independent age/score touch regions and chord-safe text slots. Fit each complete label/readout uniformly inside its slot on size changes; do not truncate labels or squash glyph proportions. The circular clip is a final containment guard, not the primary way to hide overflowing text. |

Use bounded entry and selection morphs, capped canvas density and device-pixel ratio, and offscreen suspension. Measurements and controls must remain readable and operable without canvas animation. Preserve keyboard focus, Escape dismissal, touch targets and mobile reflow. Anillo detail selection and Campo hover/focus/tap disclosure have keyboard and touch equivalents; manual action navigation never auto-advances.

## Reference provenance

This is original EVA React/CSS/SVG/canvas work informed by inspected references and JD's subsequent selection. The saved [SAVEE inspection record](../../../outputs/dashboard-score-dots-2026-09-21/REFERENCES.md) documents circular-dot silhouettes (`0wo95_h`), the square-cell MWRC capsule (`N9DVbyn`), and translucent device tiles with white dotted numerals (`8qTYqaa`). Video saves were inspected as still previews; their motion was not verified. No source artwork was imported. Rounded glass and dot typography are material principles, not copied layouts.

The retained 21st.dev Radial Orbital Timeline source informed only the stable center, peripheral selection and detail disclosure. Its continuous orbit, arbitrary energy values and div click targets were not adopted. Later Particle Wave source retrieval was quota-blocked; Wave Text and Waveform were metadata-only references. Do not claim imported components, unseen motion or code from those records. Detailed action provenance is preserved in [the actionable reference record](../../../outputs/dashboard-actions-proposals-2026-09-21/REFERENCES.md).

## Recovery and history

Before-consolidation source files and design context are under `outputs/dashboard-consolidation-2026-09-21/history`. The workspace-root and canonical project branding documents immediately before their Anillo updates are preserved with hashes under `outputs/dashboard-product-consolidation-2026-09-21/history/branding-before-selection`; earlier decisions remain in the canonical `work/eva-creative-implementation/.21st/design.json` and the separate workspace-root `.21st/design.json` as dated history. Previous standalone metric, summary, actionable and A/C/D score-dot studies remain intact. The corrected selected source is `outputs/dashboard-score-dots-2026-09-21/preview`, with the explicit arc and current motion periods recorded in `iteration-11-score-arc/REVIEW.md`. A saved local build and a public deployment are different states.
