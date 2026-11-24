# Normal explanation — independent language and comprehension review

Status: final mechanism-inclusive EN/ES proposal passes text-only language, translation and explanation review. No UI changes and no rendered-implementation pass claimed.

## Observed gap

Read AGENTS.md and current bilingual range-proof-copy.ts; visually inspected actual-es-320-section.png from native70. The visible Spanish opening currently offers only “Un resultado. Dos rangos.” after its heading. The graph demonstrates a difference, but the visible prose does not explain why the difference exists or what EVA adds. Context hidden in the disclosure cannot carry the central message.

## Language constraints

- Explain the distinction before the graphic, in short plain sentences. Keep the visible lab<3 / sample2.9 / category<1 example intact.
- Do not describe reference intervals as simply the average of an unhealthy population. A reference interval often derives from a selected reference population; clinical decision limits are a distinct concept. Not every lab threshold is population-derived.
- Qualify general explanations with “many/often” and “muchos/suelen”. If a statement specifically describes the hs-CRP example, name its reference/category distinction rather than implying an entire lab methodology.
- Use Spain Spanish: “analíticas”, “resultados”, “rangos de referencia”, “riesgo a largo plazo”. Avoid Anglicisms such as “baseline”, “insight” or “score” in this paragraph.
- Avoid “óptimo”, “riesgo real”, “descubrir enfermedades ocultas”, “detectar antes” or guaranteed forecasts unless the precise service and claim are separately substantiated.
- Translate the same qualification, comparison and EVA benefit. Do not strengthen “associated with” into “prevents” or omit relative-risk context.
- A lower-risk hs-CRP category is not an overall-health verdict. Being in range is neither proof of optimal health nor proof of hidden illness.

## Cold-reader test for each draft

A beginner must be able to answer, using only the visible paragraph:

1. What does “normal” tell me? How this result compares with the range supplied for that test.
2. What does it not guarantee? That the result belongs to a lower-risk category or establishes my overall health.
3. What does EVA add? A plain-language explanation, relevant evidence and my history/context to help me understand the result.

Back-translation test: the ES paragraph must return those same three ideas, with the same degree of certainty. A draft that says “the average population is unhealthy” fails even if it sounds persuasive.

## Lessons retained from this conversation

- Brevity removed the explanation too far: a beautiful chart needs a visible sentence establishing its meaning.
- The comparison must show the same measurement on one shared scale; wording must support, not contradict, that visual.
- Do not reintroduce the review-if-persistent recommendation the owner just removed.
- Do not hide denominator, category or source qualifications through translation.
- Preserve 2,9 decimal notation in Spanish, 2.9 in English, and strict < operators.

## Copy specialist draft reviewed

EN: “A lab’s reference range helps interpret a result, but it may differ from levels linked to lower long-term risk. EVA connects that result with your health history and previous readings, helping you understand the fuller picture.”

Recommended natural ES: “El rango de referencia del laboratorio ayuda a interpretar un resultado, pero puede ser distinto de los niveles asociados a un menor riesgo a largo plazo. EVA lo relaciona con tu historial y tus resultados anteriores para ayudarte a entenderlo en contexto.”

Language/translation: conditional PASS. The uncertainty survives translation (“may differ” / “puede ser distinto”), association is not changed into causation, and no unhealthy-average claim or universal optimum is introduced. “En contexto” is clearer and more idiomatic than “entender el conjunto”.

Explanation: PARTIAL. A novice can understand that reference and risk categories are different and that EVA adds history/context. They still cannot explain why those categories exist or how reference populations enter the picture. The owner's explicit request for that mechanism needs either a carefully qualified visible sentence or an explicitly explained alternative. This is a separate issue from grammar or translation.

Suggested mechanism sentence for CMO review: “Many reference ranges describe values typically found in a selected reference group.” / “Muchos rangos de referencia describen los valores habituales en un grupo de personas seleccionado.” Do not claim that every range works this way or that the specific hs-CRP <3 boundary is necessarily calculated from such a population.

No browser/layout PASS can be issued for unimplemented wording. Recheck actual EN/ES rendering if the owner chooses it.


## Final mechanism-inclusive proposal — reviewed successor

This supersedes the partial verdict on the earlier draft above. The CMO approved the general, qualified mechanism; “many” does not claim that Valley Hospital’s specific <3 cutoff was calculated from a percentile distribution.

EN: “Many lab reference ranges describe typical results in selected groups of apparently healthy people. They don’t always identify levels linked to lower long-term risk. EVA explains the difference in plain language and puts your results in context with your health history.”

Recommended ES with minimal naturalness/parity polish: “Muchos rangos de referencia reflejan resultados habituales en grupos seleccionados de personas aparentemente sanas. No siempre indican qué niveles se asocian a un menor riesgo a largo plazo. EVA explica esa diferencia en lenguaje sencillo y pone tus resultados en contexto con tu historial de salud.”

Verdict: PASS for text-only language, translation and beginner comprehension. The translation preserves “many”, “selected”, “apparently healthy”, the non-guarantee, association rather than causation, and EVA’s plain-language/context benefit. “A un menor riesgo” is more natural than dropping the article; “en lenguaje sencillo” maps directly to “in plain language”.

Cold-reader paraphrase:

1. “Normal” often means typical results in a selected reference group.
2. That does not necessarily identify the levels associated with lower long-term risk, and is not an overall-health verdict.
3. EVA explains the distinction and considers a result with health history so it is understandable in context.

Back-translation preserves all three ideas. No unhealthy-population average, optimal-health guarantee, disease prediction or treatment recommendation is introduced. The visible chart retains its distinct qualified hs-CRP category. A future implementation still requires actual EN/ES rendering and spacing review; this is not a browser-QA pass.
