# Independent Impeccable initial review — v64

Reviewed the retrofuturist brief, `.impeccable.md`, `RangeProofSection.tsx`, `range-proof-section.css`, copy, and Impeccable `layout`, `typeset`, and `polish` references. Visual evidence: `docs/browser-qa-v64/actual-en-1366-section.png`, `actual-es-390-section.png`, `actual-es-320-section.png`. This is an initial visual assessment; no detector was run.

## Verdict

**Reject v64 as the final instrument.** It is legible and calm, but its central artifact is a glass panel containing two typographic rows and a paragraph. The owner specifically rejected this loss of graphic. At desktop the dotted readout is isolated in an otherwise empty upper-right corner, while the repeated equations and rules make the lower area look like a table. On phones the equations are repeated text blocks, and the 320px version becomes a tall list with a lot of equal-weight copy. The skin is beautiful, but it is doing all the visual work; removing the glass would expose the absence of an instrument.

## What to retain and correct

- Retain the warm paper, asymmetric desktop story/instrument split, Hanken and Georgia relationship, smoked purple/amber glass, soft rim/noise, and dotted readout. These create EVA's identity and make the simple heading credible.
- Give the readout structural authority: it should be the visibly singular input to both interpretations, not a small number parked away from the comparisons. Avoid repeating 3.2 in multiple equally prominent places; it competes with the dotted original and weakens the 'one result' idea.
- Desktop reading order should be headline → single example result → two different interpretations → next action. Make hierarchy visible even when squinting: instrument geometry should carry the middle step rather than two same-weight text rows.
- In the actual mobile captures, 12px marker/example/unit labels recede too far against textured glass. Raise task-bearing labels to at least 14px and preserve 16px/24px explanatory copy. A compact panel is not a reason to shrink meaningful text. At 320px, prioritize natural wrapping and spacing over a fixed composition.
- The ES 320 action paragraph fills three lines and visually fuses the bold question to the instruction. Separate the action from the comparison field with a small but unmistakable spatial/material break; keep it integrated into the instrument, not a third competing card.
- The 390px and 320px screens show acceptable surrounding breathing room, but the glass interior runs a relentless readout / rule / row / rule / row / rule / paragraph rhythm. Create a stronger contrast between the one result and its two readings, and use separators only where they explain the structure.

## Recommended visual thesis: one input, two reading circuits

Treat the instrument as a **branching comparison circuit**, not a scale. Place the dotted 3.2 mg/L and its example/hs-CRP identification as a single source. From that source, a fine, restrained line branches into two distinct terminals. Each terminal belongs immediately to a clearly named question and compact direct language: below this lab's limit of 5; above the review threshold of 2 **if persistent**. The physical connection is the graphic: it expresses that the *same result* feeds two separate questions. The two endpoint marks indicate distinct comparisons, never position on a shared quantity axis. Amber can identify the conditional review terminal/line, while the lab terminal remains quiet warm white; use the same colour for its label, not a coloured field or alarm.

Desktop: let the source and branch occupy a real central plane, with generous horizontal span and two clearly separated endpoint groups. Preserve an asymmetric silhouette and leave the dotted number as the largest value; use thin optical lines, small purposeful terminals, and substantial negative space to make the construction feel engineered. Use small solid Hanken labels and clear 16px explanations; threshold values can be semibold but must remain subordinate to the dotted result. The result is a diagram, not two outlined cards or a card grid.

Phone: recompose the same source and branching connection into a vertical trunk with two short lateral taps, each adjacent to its interpretation. Do not merely hide the diagram or reduce its type. Make the trunk and taps a legible routing cue rather than a ruler: no evenly spaced ticks, positional scale, arrowheads, zero, or length encoding. Allow Spanish text to wrap beside or beneath the endpoints, with `si persiste` immediately associated with the 2 mg/L review threshold. On 320px use the available panel width for text, keep the linework compact, and allow height to grow naturally.

Keep the next action in a distinct footer band or quiet inset separated by space and a single hairline, with normal text contrast. The action is an instruction, not a third comparison. Any amber mark must mean the conditional review interpretation; avoid a gradient band, filled interval, green zone, pointer destination or high/low severity animation. Every meaning must be visible with motion off. If animated, only reveal/translate the already meaningful assembly briefly; never animate a result counting up or moving along a scale.

## Alternative considered

Two separate miniature rulers would make the cutoffs easy to place but can still read as safe/optimal zones and invite users to compare line length or position. A split-lens or Venn treatment risks suggesting overlapping target ranges. A branch has an explicit non-quantitative semantic purpose: one source, two questions. It should still be tested cold: if the lines read as a gauge or the amber looks like danger, revise the geometry and colour before shipping.

## Aesthetic acceptance test for the next render

At a glance, the viewer should see a distinctive physical instrument with a single luminous result and a meaningful fork, before reading the supporting lines. If the graphic can be removed with no loss of explanation, it is decorative; if the remaining composition is just two ordinary text rows, reject it as visually unambitious. Verify in EN desktop and ES 390/320 captures, then check intermediate width and zoom. Confirm text, focus, disclosure, contrast, actual source/build consistency, and reduced motion separately; a clean mechanical scan is not evidence of a successful composition.
