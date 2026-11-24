# v67 numeric-level comparison: medical evidence and semantic specification

Date: 2026-11-24. Role: CMO/medical semantics agent. This is not human clinician approval, patient-specific advice, or real-user research. No application source edits.

## Decision

Keep the independent illustrative **hs-CRP 3.2 mg/L** example. It is a kit marker and supports an honest comparison between **this assay reference <5 mg/L** and **the lower relative cardiovascular-risk hs-CRP category <1 mg/L**. A real quantitative two-track chart is medically defensible with those labels. The owner’s new direction supersedes the earlier no-axis design restriction; the factual ban on inventing a universal optimum remains.

**Do not call <1 a universal “optimal range,” “longevity optimum,” “prevention goal,” or treatment target.** It is a category associated with lower relative cardiovascular risk, interpreted alongside other factors. An individual can have hs-CRP <1 and high overall cardiovascular risk for other reasons. Conversely, one 3.2 result does not diagnose disease or establish persistent inflammation.

## Freshly checked evidence

1. **Current official American Heart Association hsCRP Toolkit for Professionals**, PDF page 2, “hsCRP RANGES: Relative CVD Risk Categories.” Opened and read directly through web tooling. It states lower <1.0 mg/L; average 1.0–3.0 mg/L; higher >3.0 mg/L. It expressly distinguishes these relative categories from overall PREVENT-ASCVD 10-year risk categories. Page 1 advises measuring when clinically stable, avoiding acute infection/illness, confirming elevations and considering other inflammatory causes.
   URL: https://professional.heart.org/en/-/media/PHD-Files/Education/hsCRP-Toolkit-for-Professionals.pdf?sc_lang=en
   This is current official guidance material, not solely a historical classification. Important framework distinction: the current US treatment discussion uses ≥2 on two occasions in a defined borderline-risk context. Do not merge that threshold with the chosen European strict >2 wording.

2. **2025 ACC Scientific Statement: Inflammation and Cardiovascular Disease**, evaluation/risk-assessment section. Search-indexed primary-journal text independently says <1, 1–3 and >3 mg/L represent lower, average and higher relative cardiovascular risk in the context of traditional factors. Direct journal open returned 403; therefore verification here is indexed text, corroborated by the directly opened official AHA toolkit.
   URL: https://www.jacc.org/doi/10.1016/j.jacc.2025.08.047
   DOI: 10.1016/j.jacc.2025.08.047

3. **CDC NHANES Roche Cobas 8000 hs-CRP laboratory manual, 2021–2023**, directly opened. Section 13, PDF page 18, gives the adult serum reference <5.00 mg/L. Section 1 explains that increases are nonspecific and need medical-history context. This is a documented assay reference, not every laboratory’s reference.
   URL: https://wwwn.cdc.gov/nchs/data/nhanes/public/2021/labmethods/HSCRP-L-MET-508.pdf
   The 0.15 mg/L analytical detection/reporting limit in this manual is not a health target. A chart starting at 0 is a display domain and must not imply this assay reports exact zero.

4. **2025 ESC/EAS dyslipidaemia focused update**, Box 1: persistently elevated hs-CRP >2 mg/L is a modifier considered beyond SCORE2/SCORE2-OP assessment. Existing local medical packet and fresh indexed primary-article/official-slide search both confirm the strict operator and persistence condition. Direct article and slide opens were inaccessible in this pass.
   Primary URL: https://academic.oup.com/eurheartj/article/46/42/4359/8234482
   DOI: 10.1093/eurheartj/ehaf190
   Official slides: https://www.escardio.org/static-file/Escardio/Guidelines/Products/Slide%20sets/2025/2025%20official%20slides_Dyslipidaemias.pdf

5. **Original 2003 AHA/CDC statement** establishes historical provenance. Bibliographic record verified; direct journal open returned 403 and the CDC PDF is only an external-link notice, so do not claim the original full text was freshly reviewed.
   PubMed: https://pubmed.ncbi.nlm.nih.gov/12551878/
   CDC record: https://stacks.cdc.gov/view/cdc/7090
   DOI: 10.1161/01.CIR.0000052939.59093.45

6. Retain the existing **ERFC prospective meta-analysis** source for association, not causality or personalized prognosis: https://pubmed.ncbi.nlm.nih.gov/20031199/ . No new numerical personal-risk claim is supported by this graphic.

## Exact clinical boundaries

| Meaning | Boundary | At boundary |
|---|---|---|
| This adult assay’s reference | <5 mg/L | 5 is not below the limit |
| Lower relative cardiovascular-risk hs-CRP category | <1 mg/L | 1 is in the 1–3 category |
| Average relative category in the selected AHA framework | 1–3 mg/L | Includes 1 and 3 |
| Higher relative category in the selected AHA framework | >3 mg/L | 3.2 falls here numerically; this is not an overall-risk diagnosis |
| European risk-review modifier | >2 mg/L, if persistently elevated | Exactly 2 does not meet strict >2 |

The category system and European review modifier answer different questions. The interval 2–3 can be in the average hs-CRP relative category while meeting the >2 review condition if persistent. This is not a contradiction and is why a single traffic-light strip would oversimplify.

## Simplest recommended two-track chart

- Shared horizontal, linear 0–6 mg/L scale. Both tracks must have identical origin, width and tick positions. Labels 0, 1, 2, 3, 4, 5, 6 may be reduced to a readable shared subset, but the endpoints 1 and 5 and the sample 3.2 must remain quantitatively located.
- Upper track: direct label **“This lab’s reference” / “Referencia de este laboratorio”**, prominent **<5 mg/L**. A neutral pale band runs from the axis origin to just below 5. Boundary marking/label conveys the strict endpoint. It is legitimate to show this reference interval as a band because its meaning is explicit and bounded.
- Lower track: direct label **“Lower relative heart risk” / “Menor riesgo cardiovascular relativo”**, prominent **<1 mg/L**. A restrained visually distinct band runs from the axis origin to just below 1. Do not make this a green success zone or trophy-like goal. The purpose is to compare its much narrower extent with the lab reference.
- One static 3.2 mg/L marker line crosses both tracks at x = 3.2/6 = 53.333% of shared plot width. Sample annotation stays “Example / Ejemplo.” A single repeated line is the same sample, not repeat-test data. No arrow toward 1 or animated falling measurement.
- The lab end at 5 is x = 83.333%; lower-relative-risk end at 1 is x = 16.667%. If the >2 modifier is marked on the plot, it is x = 33.333% and must be a thin separate conditional-review annotation, **not another filled region**. Prefer placing this as a compact callout outside the two bands to avoid three competing interpretive systems.
- Visible source-category qualification beside/below the lower track: **“hs-CRP category, not your overall risk.” / “Categoría según hs-CRP; no indica tu riesgo global.”** This was agreed with the copy specialist.
- Visible review callout: **“>2 mg/L if persistent” / “>2 mg/L si persiste.”** Keep existing repeat-when-well and overall-risk action. Do not label the whole >2 region an optimum or a disease zone.
- Retain visible lab variability and no-diagnosis note. Source disclosure should add the new AHA category source alongside existing CDC, ESC/EAS and ERFC links.

## Closed copy and disclosure limits

Acceptable short result interpretation: **“Below this lab’s limit. Above the lower-risk category.”** / **“Por debajo del límite de este laboratorio. Por encima de la categoría de menor riesgo.”** The second clause is acceptable only with the relative/hs-CRP category label and visible not-overall-risk note directly present.

Do not label the sample “high risk” in isolation. If the disclosure describes all three categories, always call them relative cardiovascular-risk categories based on hs-CRP and explain that they do not assign overall risk. The official AHA table supplies all three cutoffs; a two-track display may deliberately show only the lower category for the requested comparison, as long as the remaining unfilled track is not labelled uniformly high risk.

Suggested disclosure explanation: “The AHA’s hs-CRP categories are <1 mg/L for lower relative cardiovascular risk, 1–3 for average, and >3 for higher. They add context to overall risk; they are not a universal treatment target. The European >2 mg/L review modifier applies when elevation persists. Illness, infection and injury can affect the result.” Translate naturally without adding causal or individualized prediction claims.

No need to switch to LDL: a universal LDL optimum would introduce more individualized treatment-target complexity. No source here establishes that lowering any individual’s hs-CRP to <1 by any means is itself a universally valid prevention goal.

## Review status

Evidence/specification approved for implementation under the stated labels and scope. Final graphic semantics remain pending actual rendered EN/ES desktop/mobile screenshots. Current owner-requested quantitative comparison is intentionally different from the earlier relay candidate, so the earlier no-band gate is superseded for these explicitly labelled <5 and <1 tracks; it remains wrong to shade >2 as desirable.
