# Mobile scroll revision — 13 September 2026

Trigger: the approved runner exit looked smooth on desktop but stuttered on an iPhone 16 Pro Max in Safari. Preserve the approved entrance, rightward exit, tracking, scene choreography and ten-second signal sequence.

## Change

On viewports up to 700px, feature-detected ScrollTimeline animations now own the story's interpolated transforms and opacity. Pixel attachment ranges match the sticky journey's document position and measured span. All authored interpolation breakpoints are retained. JavaScript still controls accessibility, chapter state, media lifecycle and the small product hover; it no longer rewrites properties owned by the browser's scroll timeline.

An unsupported or partial implementation falls back atomically to the existing scroll painter. Constructor errors, ignored timeline/ranges and mid-install errors cancel partial animations and restore original inline styles. Reduced motion and desktop keep their existing paths.

The video, edge treatment and tracking reductions are documented in [runner-mobile-media.md](runner-mobile-media.md).

## Evidence

- TypeScript compilation passes.
- `check-story-compositor.mjs`: 217,965 property/frame parity samples across five geometries; zero scroll-time transform/opacity writes on owned nodes; exact pixel ranges; complete failure and disposal cleanup.
- `check-story-scroll.mjs`: 15,852 samples against the authored Remotion choreography.
- Runner media: 55.6% fewer decoded pixels; 47.0% fewer download bytes; all 120 timestamps and tracking poses retained. Settled tracking writes: 45 to 10 per decoded frame.
- Local browser at 440 × 956 reports `compositor-timeline`, the 576 × 720 source and `opaque-overlay`. At scroll frame 83.636, runner translation is -74.899px with scale 1.02132; at frame 191.212, runner translation is 264px with scale 1.08. These match the original choreography. The inline runner transform remains unchanged while the computed transform advances with scrolling.
- The Tasso image reports decoded before its scene arrives. Forward and reverse chapter navigation, pause and resume were checked visually.

These are browser behavior and workload checks, not measurements from the user's physical iPhone. No physical-device frame-rate claim is made. SVG tracking shadows remain to preserve the current treatment; if device testing still identifies a bottleneck, a bounded mobile-only shadow comparison is the next experiment.

## References

- [WebKit: scroll-driven animations](https://webkit.org/blog/17101/a-guide-to-scroll-driven-animations-with-just-css/)
- [MDN: Element.animate attachment ranges](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate)
- [Chrome: scroll-animation performance case study](https://developer.chrome.com/blog/scroll-animation-performance-case-study)

## History

The pre-change source remains in Git at `968f14dc20694f93a6be430b455ef58c6d31cef3`, also saved as Sites version 45. The main homepage retains the approved headline. On 14 September, JD clarified that font alternatives must stay in a separate local environment until selected. The typography route and its font assets were therefore removed from the public build, while all mobile changes were retained. The study is preserved in the sibling `eva-typography-review` checkout, served locally on port 3044.
