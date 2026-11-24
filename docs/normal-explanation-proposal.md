# “There’s more to normal” — visible explanation proposal

Prepared 24 November 2026. **Proposal for owner review; not implemented or published.** Live native70 remains the 2.9 / lab<3 / renamed-label / removed-footer version, UI commit `58bac762100a18c440b38429dee95f4663194e2d`.

## Preferred English copy

> Many lab reference ranges describe typical results in selected groups of apparently healthy people. They don’t always identify levels linked to lower long-term risk. EVA explains the difference in plain language and puts your results in context with your health history.

## Spanish for Spain

> Muchos rangos de referencia reflejan resultados habituales en grupos seleccionados de personas aparentemente sanas. No siempre indican qué niveles se asocian a un menor riesgo a largo plazo. EVA explica esa diferencia en lenguaje sencillo y pone tus resultados en contexto con tu historial de salud.

## Placement and design

Replace “One result. Two ranges.” / “Un resultado. Dos rangos.” with this visible paragraph directly beneath the existing heading, outside the glass. Keep the graph and current action. Use existing Hanken regular16/24, muted ink,16px heading gap and about46ch desktop measure, with natural full-width phone wrapping. No new card, subheading, icon or default bold. Essential meaning must be readable without opening Sources and context. Detailed assay/category/source explanation stays there.

The paragraph explains the reference-population mechanism, distinguishes it from levels associated with lower risk, and makes EVA’s plain-language interpretation benefit explicit. It restores the meaning removed by excessive concision without filling the glass with prose. Allow natural height; do not shrink typography or distort the plot to fit a viewport.

## Medical rationale and sources

The owner's intended point is useful: being within a lab reference is not a complete assessment of long-term health. The proposed premise that references simply average an unhealthy population is inaccurate. Many reference intervals describe a selected apparently healthy group; clinical decision limits and outcome-linked risk categories are distinct concepts. “Many,” “apparently” and “don’t always” preserve these qualifications. No new disease statistic, universal optimum, causal claim or outcome promise is introduced.

- [CLSI EP28, joint CLSI–IFCC guideline](https://clsi.org/shop/standards/ep28/): public abstract/scope covers health-associated reference values, subject selection and reliable intervals. The paid full standard was not reviewed.
- [IFCC committee review: distinguishing reference intervals and clinical decision limits](https://pubmed.ncbi.nlm.nih.gov/30047297/), [DOI](https://doi.org/10.1080/10408363.2018.1482256): supports the conceptual distinction; it does not demonstrate EVA outcomes.
- [Valley Hospital catalog](https://valleyhealth.testcatalog.org/show/CRPHS-1): publishes the specific current lab reference<3.0 mg/L, but does not document its derivation. The general paragraph must not be rewritten to claim that this particular cutoff is a population average or percentile interval.
- [AHA professional hs-CRP toolkit](https://professional.heart.org/en/-/media/PHD-Files/Education/hsCRP-Toolkit-for-Professionals.pdf?sc_lang=en): the current<1 comparison is a lower relative cardiovascular-risk category for this marker, not overall risk or a universal longevity optimum.

Preserve the separate illustrative2.9 mg/L sample (ES2,9), lab<3, lower category<1, one0–5 scale, sample58% on both fields, lab cutoff60%, lower cutoff20%. Preserve the removed recommendation footer, source qualifications and separate Alex/dashboard data.

## Review loop and current verdict

Six specialist agents reviewed the proposal. A first draft merely said the ranges differ; the language reviewer marked its explanatory mechanism incomplete. The lead required a revision explaining the reference population, then affected lenses reviewed the new shared candidate. The chosen pair above supersedes earlier drafts retained in the individual review logs.

| Lens | Current verdict and scope | Evidence |
| --- | --- | --- |
| CMO medical evidence | PASS, qualified general mechanism and no undocumented derivation of this specific cutoff | [Medical review](normal-explanation-reviews/normal-explanation-medical.md) |
| Wellness marketing copy | PASS, mechanism → limitation → EVA benefit | [Copy selection](normal-explanation-reviews/normal-explanation-copy.md) |
| Explanation / simulated novice | PASS for text; not human research | [Clarity review](normal-explanation-reviews/normal-explanation-clarity.md) |
| English / Spain Spanish parity | PASS for exact meaning and final natural Spanish refinements | [Language review](normal-explanation-reviews/normal-explanation-language.md) |
| UX / design using Impeccable layout/typeset | PASS for proposed placement and hierarchy; rendered behavior NOT VERIFIED | [Design review](normal-explanation-reviews/normal-explanation-design.md) |
| Independent Impeccable typography/spacing | Text-density proposal PASS; actual EN/ES wrapping, bounds, contrast and focus NOT VERIFIED | [Impeccable review](normal-explanation-reviews/normal-explanation-impeccable.md) |
| Engineering / published interaction | No UI changed; current70 evidence remains valid. New copy's rendered checks NOT VERIFIED | [Deployed baseline](range-graphic-qa.json) |

After the owner reviews this proposal, implementation must verify actual EN/ES at desktop, tablet and phone widths including ES320, text scaling, reduced-motion/static forms, section bounds and unchanged source/free-entry interactions. No additional UI release was created for this proposal. Follow [the reusable review protocol and feedback ledger](AGENT_REVIEW_WORKFLOW.md) for this and future changes.
