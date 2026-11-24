# Independent final judge — normal-range explanation

**Recommendation: READY TO SHOW.** No critical failure or required revision was found in the exact rendered proposal. This is a preview recommendation, not publication approval, human usability research or clinician approval. Design has not been used to average away medical or explanation requirements.

The communication goal is to explain why a lab-normal result and a level associated with lower long-term risk may differ, and what EVA adds.

## Exact artifact

- Published baseline: native 70, UI commit `58bac762100a18c440b38429dee95f4663194e2d`.
- Isolated candidate: `/workspace/eva-normal-explanation-preview`, base commit `788cae34151ece3ba592d2de9f2dad8c3a4c3289`, three-file diff recorded in `render-report.json` with SHA-256 hashes.
- Preview method: production-built HTML/CSS/JS fulfilled from local files in Playwright at a synthetic `.invalid` origin, with the real app hydrated. This is neither a native Site publication nor a full production flow.
- Personally viewed all nine section screenshots: EN1366, ES1366, EN390, ES390, ES320, ES768, EN1051, ES390 calm, ES683 DPR2 reflow; also ES320 viewport. The DPR2/reduced-viewport case is not actual browser-chrome zoom.

**English:** Many lab reference ranges describe typical results in selected groups of apparently healthy people. They don’t always identify levels linked to lower long-term risk. EVA explains the difference in plain language and puts your results in context with your health history.

**Spanish:** Muchos rangos de referencia reflejan resultados habituales en grupos seleccionados de personas aparentemente sanas. No siempre indican qué niveles se asocian a un menor riesgo a largo plazo. EVA explica esa diferencia en lenguaje sencillo y pone tus resultados en contexto con tu historial de salud.

## Independent judgment by lens

| Lens | Verdict | Evidence and smallest revision |
| --- | --- | --- |
| medical truth | **PASS** | CLSI EP28 describes health-associated reference values, reference-subject selection and distinct decision limits; IFCC 2018 distinguishes typical healthy-reference distributions from outcome-associated clinical decision limits. The exact copy says Many and don’t always, does not say unhealthy-population averages, and uses linked/se asocian rather than causal or treatment promises. Valley confirms <3.0 mg/L only; its specific derivation remains unknown. AHA confirms hs-CRP lower relative-CVD-risk category <1.0 mg/L, distinct from overall risk. **Smallest fix:** None required to show. Do not present the general paragraph as proof of Valley’s particular cutoff derivation. |
| wellness marketing copy | **PASS** | Three sentences establish mechanism, consequence and EVA’s interpretation benefit; there is no new CTA, fear statistic, diagnosis, universal optimum or guaranteed health improvement. 41 English words and 46 Spanish words retain the missing explanation within the existing section. **Smallest fix:** None required to show. **Limit:** The present-tense health-history product capability is NOT VERIFIED end to end by the preview; it is separately recorded below. |
| visible novice explanation | **PASS** | A simulated novice can now learn why typical reference results and levels associated with lower future risk need not be the same, without opening Sources and context. The example visibly shows the same 2.9/2,9 mg/L inside the <3 lab reference but outside the <1 lower relative-risk category; the visible overall-risk disclaimer bounds its meaning. EVA’s stated addition is plain-language interpretation with health history. **Smallest fix:** None required to show. **Limit:** Agent interpretation only; no human usability study or comprehension rate. |
| english clarity | **PASS** | They has a clear antecedent (lab reference ranges), the sentences progress logically and linked to preserves association. Selected groups of apparently healthy people is somewhat technical but understandable and medically useful; it is not a reason to remove the explanation. **Smallest fix:** None. |
| spain spanish translation parity | **PASS** | Muchos / No siempre preserve Many / don’t always; habituales, aparentemente sanas and se asocian preserve the mechanism and claim strength. Plain-language back-translation: Many reference ranges reflect usual results in selected groups of apparently healthy people; they do not always indicate levels associated with lower long-term risk; EVA explains the difference simply and contextualizes results with health history. Spain-appropriate analíticas remains in the existing CTA; visible decimal 2,9, operators and units remain intact. **Smallest fix:** None. Historial de salud and pone tus resultados en contexto are understandable; alternate phrasing would be optional polishing. |
| design hierarchy | **PASS** | The paragraph occupies the existing caption position beneath the heading and outside the glass; title → explanation → example remains the reading path. 46ch max-width creates 5 EN / 6 ES lines at 1366; natural responsive wrapping gives 6 EN / 7 ES at 390 and 9 ES at 320. The paragraph is visible while the disclosure is closed. I viewed EN1366, ES1366, EN390, ES390, ES320, ES768, EN1051, ES390 calm and ES683 DPR2 section captures. No clipping, collisions or horizontal overflow observed. Shared 0–5 domain, sample 58%, lab 60%, lower-risk 20%, 28px tracks, 14px rings, 4px source-defined cores, two dot rows and removed recommendation footer are preserved. **Smallest fix:** None. Keep the 46ch width and do not shrink the 16px body to compress ES320. |
| impeccable type spacing accessibility | **PASS** | Applied Impeccable 4.9.0 typeset/layout criteria to incumbent EVA visual system. Context allowed scoped existing review without new visual-system setup. Computed paragraph: EVA Hanken 400, 16px/24px, 16px heading-to-body margin, text-wrap pretty, #50594f over #f3f0e8; contrast 6.4:1. Hierarchy preserves 44px desktop / 34px phone heading, existing italic secondary line and quiet body tone. ES320 remains 16px rather than reduced type. Supplied browser checks show visible 2px CTA focus and Enter toggling the native disclosure; all nine profiles retain >=44px CTA height. My independent mechanical detector on exact candidate TSX/CSS returned zero type/layout findings. **Smallest fix:** None for the requested preview. **Limit:** Actual browser-chrome zoom, real devices, screen-reader experience, missing-font fallback and fresh full-glass contrast audit were not verified. Existing glass is preserved; new paragraph contrast was verified. |
| engineering relevant interaction | **NOT VERIFIED** | Preview source diff is limited to caption content binding/data attribute, bilingual explanation strings, and 34ch → 46ch plus text-wrap pretty. Production-built HTML/CSS/JS was hydrated through Playwright local-file request fulfillment at a synthetic .invalid origin; the reviewed script waits for fonts and layout. The supplied report records nine passing profiles, no page errors, no blocked requests/network writes, working keyboard disclosure, free-plan CTA hrefs and all owned browsers closed. This is not a native Site deployment or a full production upload/interpretation flow. Present-tense personalized history application is not established by static screenshots or preview checks. **Smallest fix:** No work is required before showing this proposal. Before any eventual release, verify the same candidate on native EN/ES and confirm the real interpretation flow supports the health-history promise; revise that sentence if it does not. |

## What a novice can learn

My simulated paraphrase is: “Many lab ranges show what is typical in selected apparently healthy groups. That is not automatically the same question as which levels are associated with lower future risk. Here the same 2.9 result falls inside the lab’s published reference but outside the lower hs-CRP category. EVA explains the distinction and says it uses my health history for context.”

The example does not establish a diagnosis, overall cardiovascular risk, an individual treatment target, a universal longevity optimum, a persistent elevation or a causal benefit from changing hs-CRP. The visible category disclaimer is important. This is an agent interpretation, not a measured human comprehension result.

## Medical evidence boundary

[CLSI EP28](https://clsi.org/shop/standards/ep28/) supports reference-subject selection and distinguishes reference intervals from decision limits. The [IFCC committee review](https://pubmed.ncbi.nlm.nih.gov/30047297/) distinguishes typical healthy-reference distributions from limits linked to specific clinical outcomes. “Many,” “apparently healthy,” and “don’t always” keep the proposed general explanation appropriately bounded.

[Valley](https://valleyhealth.testcatalog.org/show/CRPHS-1) documents **<3.0 mg/L**; it does not explain how that particular cutoff was derived. The general paragraph must not be retold as proof that Valley computed its cutoff from healthy volunteers. The [AHA toolkit](https://professional.heart.org/en/-/media/PHD-Files/Education/hsCRP-Toolkit-for-Professionals.pdf?sc_lang=en), page 2, supports **<1.0 mg/L** as the lower hs-CRP relative cardiovascular-risk category, distinct from overall risk. Neither source establishes a universal optimum.

## Rendered findings

The paragraph is visible beneath the heading and outside the glass while the disclosure is closed. The 46ch measure creates five English and six Spanish lines on desktop; Spanish expands to nine lines at 320px. The paragraph remains EVA Hanken 400, **16px/24px**, with a **16px** heading gap and measured **6.4:1** text contrast. I observed no overflow, clipped words, overlap or illegible condensed type. The section is longer on a narrow phone; normal vertical scrolling is acceptable and preserves the missing explanation.

The 2.9/2,9 result and the cutoffs retain truthful shared-scale positions: sample58%, lab60%, lower20%. Both 28px plots retain two dot rows, 14px rings and source-defined 4px cores. At 320px the lab boundary still extends above/below the nearby ring rather than shifting the value. The recommendation footer remains absent.

I applied [Impeccable SKILL.md](/workspace/eva-design-tools/impeccable/SKILL.md), its typeset/layout criteria and the incumbent EVA system. The context command allowed a scoped review without new product/design initialization. After the independent visual pass, my detector on the exact candidate TSX/CSS returned **zero type/layout findings**. The root’s browser record independently provides computed metrics, visible focus, keyboard disclosure and no page errors. A clean detector alone was not treated as visual proof.

## Residual issues and exact smallest fix

**No revision is required before showing this exact proposal.** Keep the current paragraph, 46ch width and 16/24 body. The residual items are:

- **nonblocking:** ES320 requires nine body lines and a 954px section; the CTA falls below the initial 844px viewport. Accept normal vertical scrolling; preserve readable type.
- **not verified:** Health-history personalization is a product capability claim, not demonstrated by this preview. Verify against the real flow before any release; current source has context collection/contextApplied signaling, while fictional fixtures disclose that context is not applied.
- **not verified:** Native deployment, full production flow, actual browser zoom, real-device performance and assistive-technology experience are outside this preview. Do not present preview evidence as proof of these.
- **nonblocking:** Existing disclosure's three sources support the numerical example; the new general mechanism is supported by CLSI/IFCC reviewed here but not yet included in that disclosure. For an eventual implementation, add the IFCC reference in existing Sources and context rather than adding visible prose or another panel.
- **medical boundary:** Valley cutoff derivation is unknown, and AHA <1 is a relative-risk category. Keep Many/don’t always and the visible overall-risk qualification; never label the lower band a universal optimum.

## Independence and limits

I did not write, design, implement or approve a prior version of this candidate. I formed and communicated the text-level judgments before an agent-status inventory unexpectedly exposed colleagues’ completion summaries. I did not open their reports or use their verdicts as evidence. The rendered judgments above are my own. This is independent agent review with partial blinding; it is not a strictly blinded or human study.

No UI edit, commit, publication or deployment was performed by this reviewer. Production use of the present-tense history promise, native rendering, actual browser zoom and full production interactions remain **NOT VERIFIED**. These limits do not prevent the owner from seeing and judging the bounded visual proposal.

