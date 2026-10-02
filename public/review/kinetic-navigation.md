# EVA Kinetic Navigation — 03.27

Adapted from the user-supplied Sterling Gate kinetic navigation React component. The provided snippet defines GSAP motion and abstract hover shapes but omits the structural stylesheet; the missing styles are scoped in app/kinetic-navigation.css.

Reusable component: components/ui/sterling-gate-kinetic-navigation.tsx. BusinessNavigation supplies EVA's four existing labels and real destinations. Existing React, TypeScript, Tailwind 4, GSAP and Base UI dependencies are reused; no installation or stock imagery is needed.

Three backgrounds slide in from the right at staggered offsets. Link lines rise and straighten; the close mark rotates. A reverse timeline closes the panel. All GSAP selectors are local and no global animation defaults are changed. Existing DotMorphLabel supplies finite, reversible ink-to-dot interaction. Soft circles, waves, a dot field and organic shapes respond to the active destination.

Base UI Dialog owns focus containment, Escape/outside dismissal, scroll locking and focus restoration. GSAP owns only motion; the dialog remains mounted until its reverse timeline completes. Reduced motion resolves the timeline immediately. No looping menu animation, new video, or large media asset is introduced.

The panel is 720px maximum on desktop, full width on narrow screens, and scrolls internally on short viewports. EN and Empieza stay in the regular header. The previous 180px frosted navigation remains recoverable in version 03.26.

## 03.28 — Legibility refinement

The text mask now uses an 18-sample-per-em grid (previously 9.5). Dot radii follow sampled glyph coverage, while almost-empty edge cells are removed. This preserves counters, accents and letter edges. The scan duration and reversible interaction stay unchanged, with no idle animation.
