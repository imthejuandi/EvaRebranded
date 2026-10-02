# EVA design context

This is an independent design study, not the production EVA business site or app.

Use ink #0b1010, warm paper #f3f0e8, amber #e9a067, the approved soft-glow imagery, and existing analog lettering. The official EVA artwork supplies its exact geometry and spacing.

The user selected the supplied Sterling Gate kinetic navigation on 2026-09-12. It replaces the compact frosted dropdown with a layered side panel, staggered links, a rotating close control, and ambient shapes. Preserve the four business destinations and EN in the page header. The existing dot-letter effect remains on link interactions. Use Base UI for dialog behavior and scoped GSAP timelines, with reduced motion, keyboard access, and no idle animation loop.

The hero now reads Conoce tu salud, with salud in the existing AnalogType treatment. Preserve the runner and scene transitions. Do not introduce stock imagery. Previous source versions remain recoverable.

The 03.28 refinement makes Conoce tu a smaller regular-weight introduction, loosens its tracking and brings salud closer. Menu lettering uses a finer, coverage-weighted dot grid so counters, accents and edges remain recognizable.

03.29 supersedes the previous headline placement: Conoce tu sits high left; a smaller analog salud anchors the lower right. Keep the center open for the runner. The paper-colored HeroKitCta replaces the old hero supporting paragraph, with a semibold invitation and lighter kit detail and price. Keep this real signup link outside the decorative Remotion film; it fades with the hero and becomes hidden and inert before the next chapter. Preserve equivalent poster and reduced-motion layouts.

03.30: the kit CTA is a compact 12.5rem × 2.75rem minimum control (200 × 44px at default size), about a quarter of its previous desktop area. Keep all three text elements; primary is 0.875rem/600, details are 0.6875rem/400. It stays compact on mobile. Remove the elevated shadow. The desktop supporting sentence is 18px regular and muted; the heading and runner lead. On short phones, salud can sit 40px lower while retaining 31px clearance above the button. Mouse hover and press feedback are subtle; respect reduced motion.

03.31 supersedes the earlier unequal headline sizes. The user explicitly selected both matching width and letter height. HeroIntro measures the analog serif word and fits the longer sans-serif phrase to its ink bounds. Both use the same responsive frame, preserving opposite corners. Keep the head clear with a protected mobile zone below the introduction and consistent static/animated runner framing. The compact CTA and dotted effect are unchanged.

03.32 supersedes the exact-dimension request: the user wants natural glyph proportions and equal overall visual weight. HeroIntro uses regular Arial at 24% of the analog frame width, with -0.035em tracking. No horizontal or vertical letter deformation, no textLength, and no canvas measurement are used. Keep the opposite-corner composition and protected runner-head space.

03.33: the user explicitly authorizes Impeccable and requests a complete reassessment of hero placement and visual weight. Follow .impeccable.md for confirmed context. Use Hanken Grotesk for solid hero lettering and its compact CTA. Preserve the original serif AnalogType effect and official EVA logo. The desktop copy and CTA form one left-aligned group; salud sits lower-right, with the runner between. Mobile places the action directly beneath salud, sharing its right edge. Do not force glyph dimensions. Local font assets and license are in public/fonts.

03.34: center the runner frame at 50% in both axes. On compact phones, size it to preserve the clear zone below Conoce tu. Move salud and the action nearer to the lower controls: the phone CTA ends 12px above the controls, with 16px after the analog frame. Desktop moves the copy and CTA together into the lower-left region and lowers salud on the right. Preserve type size, natural proportions and motion.


## Dashboard consolidation · 2026-09-21

JD's 21 September 2026 selection is **B / Anillo ring and raised glass orb, the paper executive summary, and C / Campo actionables**, integrated as the dashboard's reusable brand language. B retains the earlier Precisión metric hierarchy. Score-dot A / Constelación, C / Pétalos and D / Topografía remain studies; actionable C / Campo is selected. Earlier “B study only / score-dot decision pending” entries are superseded history.

Use self-hosted Hanken Grotesk, official EVA artwork, warm paper, sage/lilac/peach surfaces, precise technical labels and organic halftone fields. The primary reading uses a raised glass dome, shallow plinth, fixed rim light, restrained optical edge diffusion and coarse warm-white glowing dot digits. Keep a fixed darker center behind the data. Reuse these material principles purposefully without making every surface glass.

Draw the EVA Score arc as explicit SVG geometry from 12 o'clock to its exact `score / 100 × 360°` endpoint, with two half-arcs at 100 and no arc when unavailable. Preserve the dark under-stroke, bright core and endpoint marker at small sizes. The two fluid sheets run at **24.347826s / 32.173913s** (15% faster than the prior 28s / 37s), pause offscreen or in hidden tabs, and become still with reduced motion. Decorative cover layers are pointer-inert. Uniformly fit complete labels and readings inside circularly safe mobile slots; retain independent touch regions, accessible numeric text and provenance controls.

Compare biological age with actual completed chronological years only from valid DOB and the verified estimate reference date. Otherwise show comparison unavailable. Ring shape encodes only supplied optimal/above/below/unclassified marker status; point size, area and report membership do not establish score contribution, weight or severity. Keep the label “Biomarcadores de este informe” unless persisted calculation traces establish a narrower input set.

The paper narrative keeps all source paragraphs and caveats, with verified exact biomarker-name emphasis capped at two per paragraph and six total. Campo preserves recommendation wording, exact source values/units/intervals and a title/count control with side arrows and a full-list disclosure. Support empty, one and arbitrary action counts, with keyboard/focus/tap equivalents and no auto-advance.

EVA Score, narrative, biomarker ring and recommendations share one selected available report. Biological age remains an independently scoped rolling profile estimate with its own source and reference date; report selection does not reassign it to that report. Existing consent, ownership, stale/foreign data and unavailable-state guards remain. Prepared readers and adapters define a backend-ready boundary: explicit synthetic preview data is not a live patient connection. Local integration and design approval do not establish public deployment.

The material work is original EVA code informed by retained SAVEE images and the 21st.dev Radial Orbital Timeline interaction concept. Video references were inspected as stills; no original motion is claimed. Quota-blocked or metadata-only components were not imported. See [dashboard language](../docs/dashboard-language-2026-09-21.md) and [selection/provenance record](../../../outputs/dashboard-product-consolidation-2026-09-21/BRANDING.md) for source evidence, tokens, boundaries and preserved history.
