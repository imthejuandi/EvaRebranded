# Visible explanation — design proposal only

**Recommendation: replace the existing “One result. Two ranges.” / “Un resultado. Dos rangos.” caption with one visible explanatory paragraph immediately below the heading, outside the glass.** Keep the incumbent composition and instrument. Do not append another paragraph beneath the short caption: the explanation should occupy that existing editorial role.

## Evidence and applicable design principles

Reviewed the current native v70 EN1366 and ES320 captures, `RangeProofSection.tsx`, `range-proof-section.css`, and `range-proof-copy.ts`. Applied the local Impeccable `reference/layout.md` and `reference/typeset.md`, together with the repository `.impeccable.md`: preserve established identity, group by meaning and proximity, let hierarchy follow the reading task, maintain readable body type, and verify localized wrapping in actual renders. Existing scoped layout and type detector scans both returned `[]`; that does not evaluate a paragraph that has not yet been implemented.

The heading provides the invitation; the new paragraph explains the distinction; the two aligned levels demonstrate it. That is the intended reading order. The instrument should remain the strongest visual object. The paragraph belongs to the paper-backed story column, where it is readable without adding density to the glass.

## Exact proposed treatment

- Replace the current caption text, keeping it as a semantic paragraph after the H2. Desktop: inside the existing left story column. At the current stacked breakpoints: between the heading and the glass. Keep the CTA in its current position.
- Use one compact paragraph, with medical/copy review controlling the terminology. Roughly 35–50 words is a useful guide, not a hard ceiling that can remove the requested mechanism. English and Spanish should communicate the same point naturally; do not force identical word counts or shrink Spanish to fit an English line count.
- Use existing EVA Hanken regular 400 at 16px / 24px, existing muted ink `#50594f`, normal tracking, and a maximum measure of approximately `46ch`, bounded by the available column. Preserve the 16px gap below the heading. Use `text-wrap: pretty` as progressive enhancement; no manual line breaks, truncation, fixed height, or full justification.
- Use no bold, italic, accent color, introductory label, card, rule, or icon in the paragraph by default. The existing italic heading already carries emphasis. The explanation should be read as one coherent thought, not as another display element.
- Preserve the existing story-to-instrument spacing: 16px on phone and 24px at the stacked tablet breakpoint. The paragraph replaces the previous caption; it should not also introduce a new spacer or expand the glass. Native desktop grid alignment can absorb the greater story height without moving the CTA to a new region.

A 35–50-word paragraph will take several lines on desktop and more on a 320px phone. Allow the section to grow by the real text height. Do not keep the instrument artificially near the fold by reducing the 16px body size, squeezing leading, hiding part of the explanation, or flattening its established spacing. Exact line counts require the chosen EN/ES copy rendered in the actual font.

## Reusable judging criteria

1. **Visible explanation:** the distinction is understandable before opening Sources and context. It does not equate every lab reference interval with a long-term-risk target, imply that all in-range results hide disease, or promise quantified outcomes. CMO and copy specialists own the final wording.
2. **One editorial block:** heading then one paragraph then demonstration; no retained micro-caption that duplicates the new prose. The heading remains distinct and the glass remains visually dominant.
3. **Readable localized prose:** inspect EN and ES at 320, 390, 768, and 1366px, plus browser text scaling. Body remains 16/24, with no clipping, collision, forced line breaks, or single-word final line where ordinary copy editing or `pretty` can resolve it. A natural two-word ending is acceptable.
4. **Graphic integrity:** retain the two slender 28px/two-row fields, shared 0–5 scale, 2.9 / 2,9 sample at 58%, lab <3 boundary at 60%, and lower-risk <1 boundary at 20%. Keep the near-cutoff endpoint visible without moving either value. Do not alter dashboard data, duplicate the large result, animate values, or add a universal optimal zone.
5. **Preserved ending:** the removed recommendation/repeat footer and its hairline stay removed. Retain the category scope note, independent lab-variation/no-diagnosis note, source disclosure, and current action.
6. **Honest evidence:** a clean scan, agent approval, native screenshot, or geometry test has a defined scope. None alone constitutes owner acceptance or a human comprehension study. The first new render must be judged for density and hierarchy, not merely for absence of overflow.

## Lessons from the prior iterations

- The owner explicitly wanted actual levels/ranges. The v65/66 relay was intelligible to agents but did not meet that request. Agent consensus cannot override direct owner feedback.
- The shaded-above-threshold treatment could look like a desirable optimal region. Spatial meaning must match the labels; avoid health-score gauges and attractive fills whose meaning is ambiguous.
- Text-only panels and prose-heavy glass underdelivered. The explanation should support the quantitative visual, not replace it or fill its interior.
- Two aligned ranges on one shared numeric domain make the difference visible. Preserve equal scaling, strict cutoff membership, and the same result position in both rows.
- “Use the dashboard levels” meant reusing a specific incumbent visual language. The dot field and ring came from ExecutiveReading’s EvidenceRange family; the shared 0–5 display domain was separately chosen. Reusing styling did not authorize changing dashboard clinical data or adopting independently scaled rows.
- SAVEE informed restraint: fewer dot rows, smaller rings, and editorial spacing. It did not authorize copying external layouts or making the interval so faint that the comparison disappears.
- The owner’s later edits were precise: lab <3, example 2.9, “Lab’s reference range,” and removal of recommendation copy. Carry these forward rather than restoring previously approved alternatives.
- Near-cutoff crowding can be truthful. Extend or layer the boundary optically while retaining exact coordinates; never move the value to manufacture separation.
- Scope and localization matter. “Lower relative risk” is a marker-specific category, not a universal optimal target or total-risk assessment. Preserve Spanish decimal formatting and verify the ordinary axis label alongside the dotted numeral.

## Copy coordination

The copy specialist has been asked to supply the actual EN/ES proposal for this existing caption slot. This document sets the placement and acceptance criteria; it does not authorize implementation or replace medical review. No UI/source edits were made.

### Final mechanism-inclusive proposal — UX PASS

This supersedes the earlier mechanism-free wording. The owner explicitly required the explanation of reference populations versus long-term-risk evidence; saying only that the ranges differ was incomplete.

EN, 41 words by whitespace count:

> Many lab reference ranges describe typical results in selected groups of apparently healthy people. They don’t always identify levels linked to lower long-term risk. EVA explains the difference in plain language and puts your results in context with your health history.

ES, 44 words by whitespace count:

> Muchos rangos de referencia reflejan resultados habituales en grupos seleccionados de personas aparentemente sanas. No siempre indican qué niveles se asocian a menor riesgo a largo plazo. EVA explica la diferencia con claridad y pone tus resultados en contexto con tu historial de salud.

**Design verdict:** PASS for the text-only proposal. Three short sentences form one coherent paragraph: reference-population mechanism, limitation for long-term-risk interpretation, and EVA’s role. The requested explanation is now present without introducing a second editorial block. Use the same caption-replacement placement outside the glass, existing 16/24 regular type, approximately 46ch maximum measure, and no additional emphasis. Retain “Many/Muchos” and “apparently/aparentemente”; removing that scope to save a line would weaken the content. No further copy refinement is needed from design.

The copy specialist reports CMO approval of the exact English wording, with “Many” scoping a general statement rather than claiming Valley’s specific cutoff was derived that way. This design review does not independently establish that medical provenance. Inspect both localized versions at 320px when implementation is authorized; if either needs slightly more height, preserve the meaning and type size. No new UI has been rendered or edited in this proposal review, and no owner acceptance is claimed.
