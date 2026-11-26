# EVA change review protocol

Owner direction, 24 November 2026: every change must receive specialist review of design, copy, explanation, language and translation, with independent Impeccable review. Carry prior feedback into each iteration. This is a durable project workflow, not a claim that agent models have been permanently trained.

## Reusable master prompt

> You are reviewing a bounded refinement of EVA's existing English/Spanish health website. First read AGENTS.md, docs/SESSION_HANDOFF.json, docs/SESSION_COORDINATION.json, this protocol, the current section's copy/component/style and latest QA. Inspect current native screenshots. Start from the current source, not an earlier proposal. Preserve concurrent work.
>
> Inputs: the owner's exact latest request; section and files; current live UI version/commit; proposed exact EN/ES copy or diff; relevant primary sources and product facts; screenshots or a clear NOT RENDERED label; prior owner feedback and unresolved findings. State which inputs are missing before judging their related fields. Progress on independent work; do not invent evidence.
>
> Establish the section's one communication goal and the customer question it must answer. Use distinct agents for health/wellness marketing copy, UX/UI design using a named applicable skill, and independent Impeccable typography/spacing. For health explanations, also use a CMO evidence reviewer and independent clarity/language reviewers. Roles may cover related lenses, but one agent must not independently approve its own implementation. Use agents proactively; preserve the owner's model preferences when applicable.
>
> CMO: verify every new medical claim against authoritative sources before copy is finalized. Distinguish reference intervals, diagnostic/decision limits and relative-risk categories; preserve units, operators, denominators, population and uncertainty. Do not infer improved outcomes from association, invent a universal longevity optimum, or claim all reference ranges average an unhealthy population. Verify what the cited source actually supports and what is unknown.
>
> Copy: produce one preferred concise version that explains the customer benefit in plain language. A short paragraph must still explain the mechanism needed to understand the section. Essential meaning must be visible, with supporting methods in disclosure. Avoid fear, vague promises, unnecessary jargon and large prose blocks. Do not add a CTA or repeat terms already expressed clearly without a reason.
>
> Clarity: independently paraphrase what the reader learns, what the example proves, what it does not prove and what EVA adds. Can a novice answer those questions from the visible copy alone? Identify ambiguity precisely. An internal simulated reader is not human usability research.
>
> Language/translation: review English cadence and idiomatic Spanish for Spain. Back-translate the proposed meaning; preserve claim strength, conditions, numbers, decimal formatting, sources and intended action. Natural language may differ; medical/product meaning must not drift.
>
> Design: apply the relevant skill within EVA's existing Hanken, italic editorial headings, warm paper, luminous glass and dot language. Specify placement, measure, hierarchy, spacing and responsive behavior. Preserve accepted media and motion. Keep truthful numeric geometry; solve collisions optically without moving values. A distinctive design must serve comprehension, not add decorative complexity.
>
> Independent Impeccable reviewer: check actual rendered font faces/weights/sizes, wrapping, spacing, rhythm, contrast, reflow, keyboard focus and reduced-motion behavior where relevant. Use current EN/ES desktop and phone screenshots; include ES320 when text density is affected. Do not shrink type to fit. Mark unimplemented/unrendered properties NOT VERIFIED rather than passing them from prose.
>
> Each reviewer returns: exact artifact/version reviewed; PASS, FIX or NOT VERIFIED for its lens; evidence; the smallest concrete revision; and any past rejection this change would reintroduce. Medical truth, missing essential explanation, misleading chart geometry, translation drift, accessibility or broken flows cannot be averaged away by a strong visual score.
>
> The lead consolidates conflicts, revises the exact shared candidate and sends that same candidate back to affected reviewers. Retain earlier findings and record how each was resolved. Repeat a focused round when a material issue remains; do not endlessly polish an already passing scope or claim perfection. If the owner asks for a proposal, stop before UI implementation and present it. Existing authorization governs routine work; this protocol creates no new permission gate.
>
> After authorized implementation, run checks appropriate to the change, inspect actual published EN/ES rendering and relevant interactions, and rerun affected lenses on the final source/screenshots. Record exact UI commit and native deployment receipt separately from later docs-only commits. Update the feedback ledger below and the current section QA. Agent approval is not owner acceptance or human medical approval. Do not change evahealth.es, DNS or real services without the separately authorized launch scope.

## Review record template

| Lens | Exact candidate and evidence | Verdict | Finding / required revision | Recheck |
| --- | --- | --- | --- | --- |
| Medical evidence | | | | |
| Marketing copy | | | | |
| Explanation / novice meaning | | | | |
| English language | | | | |
| Spanish and translation parity | | | | |
| UX / visual design | | | | |
| Independent Impeccable | | | | |
| Engineering / relevant interactions | | | | |

Use NOT APPLICABLE with a reason for genuinely unaffected fields. Use NOT VERIFIED for missing evidence, especially unrendered proposal geometry. No blanket all-fields PASS.

## Feedback ledger carried into every review

| Owner feedback or observed failure | Standing lesson / current constraint |
| --- | --- |
| Earlier general audit was too limited. | Define actual categories, evidence, coverage and limitations. More agent verdicts alone do not establish usability. |
| Runner delays access to content. | Preserve accepted 2.5-second entrance and native-speed footage unless specifically changed. |
| Hero controls became oversized and crowded. | Preserve the accepted slim side-by-side buttons, concise labels and one metadata line; no giant tiles or repeated terms row. |
| Dashboard examples overwhelmed the message. | Make each example prove one point, preserve context needed to interpret it, and keep the established design family. |
| Range graphics failed to show the difference clearly; later relay did not satisfy the request. | Plot real intervals against one shared scale, with the same result on both. Do not revert to connector-only or merely textual comparisons. |
| Shading suggested an undesirable region was optimal. | Labels, fills and cutoffs must express the same meaning. No universal optimal band from a conditional risk-review threshold. |
| Owner wanted actual dashboard levels, then slimmer SAVEE-informed treatment. | Preserve the dashboard-derived dotted ribbons and rings; use references for restraint/proportion, not imported artwork or a replacement system. |
| Latest numeric/label/footer correction. | Native70 baseline: independent example2.9 mg/L (ES2,9); Lab’s reference range<3; AHA lower relative-risk category<1; common0–5 domain; sample58%, lab60%, lower20%. Keep the recommendation footer removed. Alex/history/dashboard data are separate and unchanged. |
| The 2.9 marker is close to3. | Never shift true positions to make room. Retain visible cutoff caps around the14px ring and verify narrow rendering. |
| “There's more to normal” had no visible explanation. | Concision went too far. “One result. Two ranges.” and a hidden source disclosure cannot carry the teaching point. Proposed explanation belongs visibly beneath the headline. |
| Owner suggested ranges average an unhealthy population. | Explain the intended distinction accurately: many reference intervals describe a selected apparently healthy group; reference and outcome/risk limits can differ. Do not claim this specific lab cutoff has an undocumented statistical derivation. |
| A first explanation draft only said the ranges differ. | Include enough mechanism to answer WHY they differ, then state EVA's plain-language interpretation benefit. A cautious but empty explanation still needs revision. |
| Owner requested a rendered proposal plus a fresh judge. | Text approval is insufficient for visual claims. Nine real production-built preview renders and a judge independent of authors/designers now support showing this paragraph. Keep prototype geometry/interaction evidence separate from native/production capability proof; do not publish from a preview request. |

Latest loop: the owner requested a rendered preview and a new independent judge. Preserve that distinction from publication; see [preview QA](normal-explanation-preview-qa.json).

Current proposed explanation: [normal-explanation-proposal.md](normal-explanation-proposal.md). Current deployed range QA: [range-graphic-qa.json](range-graphic-qa.json). Subsequent owner corrections must update this ledger and supersede older constraints explicitly.

## Entry preview feedback — 26 November 2026

The owner explicitly confirmed the exact supplied eva® PNG; typed substitutes are not acceptable. First-screen usability is separate from runner arrival: keep actions usable without canceling or retiming media. Move the existing example rather than generating a replacement. HomeUnderstanding is a wrapper for accepted Trendlines, not an age promise; preserve it. The actual reduced-motion render exposed a global p-selector override; judge settled normal and calm states, not just pre-hydration metrics. Standard, enhanced and full panel meanings must stay distinct; only enhanced ApoB is newly confirmed. New private preview has its own identity and must never overwrite the public review or another proposal under review.
