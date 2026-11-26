# EVA landing decision ledger

Latest owner direction wins. These decisions apply to the existing EVA rebrand, not other projects.

| Decision | Why / rejected approach | Regression check |
|---|---|---|
| Preserve the actual eva® wordmark in the approved Codex preview. | A standalone recreation used the wrong Eva typography. | Check rendered header/footer against the approved preview; an asset filename alone is not proof. |
| Preserve the current runner opening (~2.5 seconds). Reveal the hero actions only after the normal opening animation finishes. | The latest owner direction expressly rejects early CTA display, superseding earlier first-paint guidance. Oversized buttons competed with the runner. | On ordinary motion, verify actions are neither visible nor keyboard-focusable during the opening, then visible and usable once it ends. Keep the existing reduced-motion and no-video fallback accessible without trapping users. Check ES/EN mobile and desktop. |
| Lead the paid path with the €99 + VAT standard at-home pack. Keep the separate free action. Put other panels in a separate area as a subtle inline link, not a button. | “Choose a panel” makes an unnecessary upfront decision. | Paid CTA goes directly to standard terms or existing preview purchase path, not a chooser or free signup. No third/wrapped line at 320/390 px that crowds the hero. Spanish: “Empieza con el pack de 99 € + IVA”; English: “Start with the €99 + VAT pack.” Compact label plus price subline is acceptable. |
| ApoB is included in the enhanced at-home panel, not the regular at-home pack. Full panel is distinct. | The old comparison could imply standard inclusion or unsupported details about full. | Check labels and destinations; do not infer full-panel contents, unconfirmed terms, or live checkout. |
| Explain the problem in plain language before fictional Alex; one point per demo. | More data is not the first lesson; the page should make clear what EVA helps the reader understand. | A new reader can say what ordinary reports leave unclear and what Alex illustrates. Trendlines starts with one reading; history appears on selection. |
| Tell the “There's more to normal” story in visible copy and a truthful same-scale graph. | Extra shading and decoration made clinical cutoffs harder to read. | Same measured value in both bands, real cutoff positions, visible reason the ranges answer different questions, no diagnosis or universal optimum. |
| Keep launch public scope to eligible EVA Score, not public EVA AI or biological age. Context does not edit measured values. | Beta/proposed features and derived-score inputs are not lab results. | Check affected copy surfaces; no public age/AI promise. Do not mix the SHRC event into the website scope. |


## Verified iteration lesson — 26 November 2026

The delayed-action candidate initially rendered visible no-JavaScript links that could not receive clicks: the pending-state pointer rule's `:not([data-hero-immediate])` specificity exceeded the noscript override. Independent review blocked publication. Matching that selector in the noscript override restored hit testing, direct keyboard focus and actual quarterly-route navigation in all six EN/ES320/390/1366 no-JavaScript rechecks. When changing a reveal gate, verify computed pointer behavior and real clicks as well as visibility; do not assume an inline `<style>` wins the cascade. This is an observed regression and correction, not a new product preference.
