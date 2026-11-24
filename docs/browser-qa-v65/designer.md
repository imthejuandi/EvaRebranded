# EVA range instrument — creative recommendation

I used the brief as the user-input authority for this bounded subagent assignment. I read the full retrofuturist brief, AGENTS.md, .impeccable.md, RangeProofSection.tsx, its CSS and copy, and local Impeccable SKILL.md. `impeccable context --target components/story/RangeProofSection.tsx` returned SCOPED_EXISTING_ALLOWED. Applied reference guidance: layout (topology expresses relationships; structural adaptation), typeset (recognizable roles without extra families), and polish (incumbent materials; semantic colour). No source edits, publication, or claims of human testing.

## Observed incumbent

Viewed actual v64 English 1366, Spanish 320, and Spanish 768 section images. Desktop glass is attractive and compact, but its central body is two equations plus prose. The repeated 3.2 makes three equally literal appearances. The largest dotted sample feels detached at the upper right. Mobile improves reading order but becomes a long report card. At 768 the narrow evidence column and three-line Spanish headline feel constrained. The correction needs relationship geometry, not more decoration. Keep the existing warm/purple glass, rim, grain, paper and headline.

## Three concepts

### A. Comparator relay — recommended

One large dotted sample feeds a visible fork into two labelled comparison channels. The instrument’s graphic is a connection diagram: one input, two questions. A common pearl trace splits into a lab channel and a review channel. Both terminate beside their named comparison. The numeric sample appears once. Threshold numerals use ordinary Hanken, subordinate to the dotted sample.

Meaning: the result has not changed; the interpretation question has. Nothing is positioned on a value axis. There is no enclosed or filled territory that can become a goal. Amber identifies a conditional review cue; it does not encode the result’s degree of risk. This is the strongest physical-instrument direction and the most robust phone adaptation.

### B. Single-row comparison plate

Use a precision etched plate: one sample row crosses two named question columns. A vertical hairline from each column heading ends at its explicit answer, while one horizontal sample rail binds both answers to the same input. The visual grammar is a sparse comparator matrix, not separate cards. Wide: dotted result left, lab answer centre, conditional review right. Phone: one input header with two stacked, indented answer rows; each retains its own labelled terminal.

Meaning: one observation evaluated by two criteria. No numeric positioning or domain. It is extremely readable and feels like laboratory documentation. It has less sculptural presence than A, and at 320 the topology converges toward a styled table; use only if A fails first-read comprehension.

### C. Report plate with a conditional review flag

A fine ruled report plate carries the sole dotted value and its below-lab-limit statement. A narrow amber-edged review slip is visibly attached to that same value through an open bracket, stating >2 mg/L / if persistent, with the repeat action immediately below. On desktop the flag projects to the side within the one glass surface; on phone it attaches beneath the plate. No angled folded corners, badges, or new icons.

Meaning: a result can receive additional context without changing the laboratory observation. Strong editorial hierarchy and a memorable physical document metaphor. Its weakness is that the lab reading can look primary and the review like an optional footnote; A communicates equal legitimacy better.

## A: implementable specification

**Reading path:** hs-CRP + Example → one dotted 3.2 mg/L → visible fork → named lab and review comparisons → repeat when well / review overall risk if still raised. Preserve the existing outer asymmetry and free-upload action. Do not add an eyebrow above the headline.

**Wide instrument (content width at least 520px):** use one glass, 28px inner padding, existing 42px radius. Marker header sits above the instrument body. Body is a CSS grid with a roughly 136px sample bay, a 56px connector bay, and remaining answer column. The sample is vertically centred between the two answer channels; show its unit directly beneath. The two answer channels are stacked with 24px between groups; each is content-sized, not boxed. A 1.5px pearl trace leaves the sample bay, joins one vertical spine, then branches to the exact vertical centres of the two answer groups. CSS grid alignment and pseudo-elements can anchor the lines to their actual content; no fixed SVG y coordinates across translated text. Finish each branch with a short 6px vertical contact stroke. No arrowheads, ticks, animated dots or extra terminals. The two contacts mean ‘comparison endpoint’; their presence is not a pass/fail indicator.

**Each answer:** task label at 14px/20px Hanken 600, then the relevant threshold and plain-language conclusion at 16px/24px. Keep <5 mg/L and >2 mg/L unbroken. The latter’s ‘if persistent’ / ‘si persiste’ must sit immediately beside or directly beneath >2, at 16px, never in the source disclosure or a detached badge. Exact final phrasing belongs to the bilingual copy specialist. Display the lab/review labels visibly; they currently exist mostly as accessible names. Do not print 3.2 again in either branch. The diagram’s shared input supplies that relationship; prose supplies below/above.

**Narrow instrument:** switch based on actual instrument width, not only viewport. At 768px retain a full-width instrument under the heading if a two-column outer layout would leave less than 420px for it; do not squeeze the desktop relay into the current 384px glass. At 320/390 use 18–20px inner padding and 32px radius. Keep the existing marker-left/readout-right top row if it fits; the connector originates beneath the readout, moves once across to a left spine, then branches right to the two stacked answers. Reserve 20px for this spine and 12px between its contact and text; answer width must remain at least 206px at a 320px viewport. Body groups use 16px separation. No side-by-side mini-panels. Let all content grow naturally. No fixed height or hidden overflow. Aim for the Spanish phone glass to stay near the current 390px height, with meaningful geometry replacing repeated equations rather than adding a new chart above them.

**Material and colour:** preserve current bio-glass gradients, grain and rim. Pearl #f6f0e3 remains the dominant value/text colour. Connection trace: pearl at approximately 65% opacity, increased if actual painted contrast is weak. Use warm amber around #f0c48a only for the short review endpoint and its ‘if persistent’ condition; retain white for the whole sample and main review conclusion. Do not colour a long branch or light a background area: that can imply a favourable destination or danger extent. The existing purple and warm reflections remain atmospheric across the whole glass, with no alignment to outcomes. Confirm 4.5:1 for ordinary text after compositing; exact opacity is provisional until rendered. No green or red states.

**Typography:** existing Hanken 400/600 and Georgia headline. Dotted sample around 72–80px high on wide screens, 48–56px phone; maintain the sole dominant numeric reading. Thresholds at 20px/28px at most, ordinary type, never dotted. Labels/task text at least 14px. Body 16px/24px. Example and units may remain 12px metadata. Keep 8/16/24px rhythm. Set text wrapping on the actual text nodes rather than breaking the entire group.

**Action:** one full-width quiet divider below the relay, then the concise repeat/overall-risk sentence at 16px/24px. No connector continues into this action, because a single reading does not establish persistent elevation. Keep lab-variation/no-diagnosis note outside the glass and native source disclosure below.

**Motion:** all labels, numbers and connectors must be visible in the initial frame. Prefer a single 400ms translateY(6px→0) of the complete instrument on entry. Do not animate only the review branch: it would suggest the finding appeared later. No trace drawing, current travelling along wires, pulsing lamp, number counting, risk growth or delayed condition. Static calm/reduced-motion gets exactly the same geometry and information. Removing motion entirely is acceptable; the topology supplies the distinction.

**Accessibility:** the connection geometry is aria-hidden; keep one full textual chart description. DOM order follows sample, lab group, review group, action. Existing figure/group semantics suffice. Every essential relationship also appears in words. Only existing links/details are interactive; terminals and threshold labels do not look pressable.

## First rendered decision gates

1. Blur/squint: one dotted value, then two distinct answer groups, then one next action. If threshold numerals rival the sample, reduce them.
2. Ask an unprimed image reader what the joining line means. It must communicate the same result, not a time series or rising risk.
3. Ask whether any area looks like an ideal range. A yes blocks publication regardless of correct disclaimer text.
4. Check Spanish 320 and 768 specifically. If the fork steals usable text width or makes the glass taller than the explanatory content warrants, simplify to a single bracket with two short contacts rather than shrinking type.
5. Verify the question labels, strict signs, units and persistence condition with sources closed. No final verdict should depend on opening details.

This is a concept/specification recommendation, not approval of an unrendered implementation. The strongest craft choice is the visible shared-input topology; the weakest temptation is to add instrumentation marks that encode no information.
