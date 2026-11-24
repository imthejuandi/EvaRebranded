# EVA: one result, two interpretations

## Master prompt

Act as a specialist on a small design team refining EVA’s existing landing section `#otra-lectura`. Deliver an exceptionally considered, memorable medical education instrument within EVA’s accepted retrofuturistic identity. The visitor should understand the example without learning how to read a complicated chart. The piece must feel like a contemporary physical instrument: luminous analog dot numerals, precise calibration, smoked glass, warm paper, a controlled amber signal and the incumbent purple/warm reflections. Distinctive craft must serve the explanation. Preserve the rest of the landing and its compact scale.

The owner’s latest correction is decisive: the filled region above 2 looked like an optimal target range. A follow-up removed all graphics and became too textual. Solve both failures together. Do not simply restore that shaded band, the rejected neutral ruler, a generic feature-card grid, a decorative health gauge, or a graphic whose intended meaning requires the source disclosure to be open. Explore alternative instrument metaphors before selecting one. Any marks, pointers, lights or colour changes must have an explicit semantic purpose.

### The visitor and communication task

Spain-based adults with very different health literacy. Many interpret “in the lab reference” as “nothing else to consider.” Convey: the same illustrative result can be below this laboratory’s reference limit and above a conditional cardiovascular review threshold. These are different questions, not competing definitions of a universal healthy range. The concise action is to repeat when well, then consider overall heart risk if it remains raised. EVA interprets data in context; it does not diagnose from this one result.

### Fixed medical truth

- Independent illustrative hs-CRP: **3.2 mg/L** (Spanish **3,2**). Not Alex’s fictional case or history elsewhere.
- Documented adult assay reference: **<5 mg/L**. Lab limits vary. Source: CDC NHANES Roche Cobas adult assay, section 13, https://wwwn.cdc.gov/nchs/data/nhanes/public/2021/labmethods/HSCRP-L-MET-508.pdf.
- ESC/EAS 2025: **persistently elevated >2 mg/L** is a cardiovascular risk modifier considered with overall risk/history, not a diagnosis, optimal goal, inevitable disease, prescription or universal treatment target. Source: https://academic.oup.com/eurheartj/article/46/42/4359/8234482, Box 1.
- Repeat when clinically stable/well. Infection, illness, injury and other inflammation may affect hs-CRP; no fixed repeat interval or automatic treatment.
- Association with later cardiovascular events is supported by 160,309 participants in 54 prospective studies: https://pubmed.ncbi.nlm.nih.gov/20031199/. Do not turn population association into an individual risk prediction or imply CRP causes disease.
- Above 2 is a **review trigger if persistent**, never a “normal heart-risk range.” Below 2 does not imply universal optimal health. At exactly 2 the strict European comparison is not >2.

### Incumbent authority and scope

Read AGENTS.md, .impeccable.md, `components/story/RangeProofSection.tsx`, its CSS and `lib/site-content/range-proof-copy.ts`. Use `/workspace/eva-design-tools/impeccable/SKILL.md`; scoped existing refinement is permitted. Preserve `DotNumber`, Hanken 400/600, Georgia italic, actual glass hue/rim/noise, the landing’s asymmetry and breathing room. Label/task text at least 14px, body 16px/24px. No new fonts, icons, emojis, dependencies, assets, fake data/history, fixed-height clipping, animated risk severity, decorative ordinals or eyebrows above the headline. No synthesized weights. Preserve free-upload action, disclosures and three sources. Design must work EN/ES, 320/390/768/1366px, keyboard, normal/calm/reduced motion. All meaning must be visible before any animation; entrance may be at most 500ms and must not simulate a measured result evolving.

The owner authorizes implementation, checks, commits, pushes and publication to the existing review Site. Production evahealth.es remains on hold. Models must be outside the 6.2 family. Agents supply design/editorial review, not real-user research or human clinician approval.

## Roles and judging loop

1. **Wellness marketing copy:** propose the shortest natural EN/ES wording that makes the two questions and next action clear. Reject fear, vague “optimal” claims, duplicated prose and math-only explanation.
2. **Creative instrument designer:** name and apply the Impeccable guidance available locally. Propose distinct visual concepts with exact hierarchy, encoding, colour, responsive composition and purposeful motion. Explain how each avoids a target-zone reading.
3. **Medical semantics judge:** verify each sign, cutoff, unit and condition; assess likely visual implication, not only disclaimer text. Any optimal/safe-zone reading is a blocking failure.
4. **Independent Impeccable judge:** inspect actual rendered desktop and phone images. Judge font, spacing, glass, colour, density and visual distinction. Name concrete corrections, not generic praise.
5. **Cold-image reader:** receive only final candidate images and neutral questions: what does this show, what do the numbers mean, what should this person do, and does any area appear to be a goal? Do not receive the intended answer before the first read.
6. **Master design judge:** synthesize the strongest compatible ideas; do not average votes or equate a technical pass with aesthetic success. Resolve disagreements against owner feedback and the communication task. Return a precise final specification and a candid verdict on the rendered result.

Review loop: explore → master selects/combines → root implements → render EN/ES desktop/mobile → separate medical, aesthetic and unprimed reading reviews → batch fixes for observed issues → inspect final candidate again → publish and verify actual native result. Retain rejected designs and reasons in a concise evidence record. Continue when a meaningful issue remains; do not claim perfection from agent scores or run empty repeated votes.

## Acceptance gates

- One unmistakable 3.2 sample, visible units and example label.
- A newcomer can tell below-lab-limit from above-review-trigger and sees “if persistent” beside the latter.
- No shaded region, green safe zone, pointer destination or colour implies a universal optimal range.
- A memorable visual instrument remains central; the result is not two paragraphs in glass.
- Meaningful graphic geometry, editorial hierarchy and restrained premium materials belong to the existing EVA world.
- The repeat/overall-risk action, lab variability and source access remain readable without bloating the instrument.
- No overflow, unreadable small status labels, clipped content, competing dominant values, entrance delay or motion-only content.
- Actual native EN/ES desktop/mobile checks, source/build match, exact publication receipt, and candid limits are recorded.
