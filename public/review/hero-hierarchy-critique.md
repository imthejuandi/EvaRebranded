# Hero hierarchy review — 03.30

Applied guidance: Design Critique (first impression, hierarchy, consistency, touch targets) and Emil’s Design Engineering (responsive controls, purposeful motion, pointer-specific hover and reduced motion). Impeccable was not used.

The runner and diagonal headline should establish the visual identity. The kit CTA should remain easy to find without becoming the largest filled block. The supporting sentence should read as an aside.

| Before | After | Why |
| --- | --- | --- |
| CTA 370 × 90px, full content width on phones | 200 × 44px on desktop and phones | About one quarter of the original desktop area with a 44px minimum tap target |
| Primary text 22px; details 13px/12px | Primary 14px semibold; both details 11px regular | Keep all requested content and emphasize the action within the smaller surface |
| Elevated shadow | Flat paper fill | Reduce competing visual mass while retaining a clearly interactive surface |
| Supporting sentence 22px, bright cream | 18px regular, muted cream, 1.35 line-height | Establish a clearer distinction from the headline |
| Short-phone salud constrained by the former tall CTA | 40px more vertical space available below | Improve separation between the two headline parts, with 31px remaining above the CTA at 320 × 568 |
| Hover feedback on every pointer, no press state | Fine-pointer hover and restrained press feedback | Avoid sticky touch hover and provide immediate feedback; reduced motion is respected |

The main heading size and regular weight are retained after visual review. More reduction there would weaken the established diagonal framing rather than solve the button’s disproportionate weight.

Verified at 1280 × 720, 390 × 844 and 320 × 568. The button measured 200 × 44px; all text remained on the intended two lines, with no overlap or horizontal page overflow. Keyboard focus reached the real CTA with a visible outline. The reduced-motion hero matched the short-phone geometry. Device sizes were emulated, not tested on physical hardware.
