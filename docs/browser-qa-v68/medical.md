# v68 dashboard-style range: bounded medical check

Status: **Approved for implementation with the boundaries below; rendered review pending.** Medical semantics agent review, not human clinician approval. Read-only inspection of application source and fictional fixtures only. No connected health service, backend or patient record was accessed. No application source was edited. No new literature search was needed because the clinical facts remain those verified for v67.

## What the dashboard actually uses

`lib/preview/fixtures.ts:5` defines the fictional hsCRP marker with value 2.1 mg/L, range [0,1], display domain [0,5] and fixture history [2.8,2.4,2.1]. These are separate example data from the landing’s independent 3.2 teaching sample.

`components/pages/dashboard/dashboard-reading.ts:8` takes a report-owned value, unit, interval and classification and retains the base marker’s display domain. It does not treat the fixture alone as a patient result. The fictional report builder supplies optimal_low=0 and optimal_high=1; normal_low and normal_high are null. Therefore the dashboard fixture is not an independent source for a <5 laboratory-reference claim.

`components/pages/dashboard/DashboardPage.tsx:96` (`CapsuleRange`) computes low=min(domain minimum,value) and high=max(domain maximum,value), then maps the displayed interval and sample proportionally. For the current hsCRP fixture this is a linear **0–5 mg/L** display, with the illustrative 0–1 interval occupying **20%**, and the fictional 2.1 cursor at **42%**. If a selected report value exceeded the stored domain, that renderer would extend the domain; 0–5 is not a universal medical measurement limit.

The actual range-view styling in `components/pages/dashboard/dashboard.css:305` is a slim 5 px rail with a translucent filled segment and a white 17 px cursor plus quiet halo. It is not a clinical severity gauge. Its visible range labels call the interval illustrative and direct readers to laboratory range/context. The dashboard history chart uses a separate data-derived scale; it should not be mistaken for the range view’s 0–5 domain. The biomarker-detail instrument also expands its domain to encompass values/ranges, with [0,5] as the fixture base.

## Important endpoint and terminology difference

The fixture classifier flags values only when below range[0] or above range[1]. Thus exactly 1 is considered inside the illustrative dashboard interval, and internal storage uses names such as optimal_high and optimal. The landing’s evidence-based AHA lower-relative-risk category is **strictly <1**, so exactly 1 belongs in the 1–3 category. These are not identical clinical boundary contracts.

Reuse the dashboard’s visual language and display domain, not its internal “optimal” nomenclature or inclusive endpoint classifier. Do not describe the landing as showing the exact dashboard clinical classifications. Do not change the dashboard in this task.

## Approved landing mapping on 0–5

| Landing item | Medical meaning | Position on shared 0–5 domain |
|---|---|---|
| Independent sample | Example hs-CRP 3.2 mg/L | 64% |
| Lab reference | This documented assay reference <5 mg/L | Ends at 100%, strict boundary label remains <5 |
| Lower relative cardiovascular-risk category | AHA hs-CRP category <1 mg/L | Ends at 20%, strict boundary label remains <1 |
| Review condition | European >2 mg/L if persistently elevated | 40% if plotted; retain the separate text callout |

A 0–5 visual domain is medically acceptable. It changes display geometry, not the clinical thresholds or interpretation. Because the lab reference now spans the visible rail, retain a clearly marked upper boundary and explicit <5 label: the endpoint 5 itself is excluded, and 5 is a plot limit rather than the maximum possible hs-CRP value. Zero is a graph origin, not a claim that this assay reports exact zero or that zero is a personal goal.

Keep the two landing tracks aligned on the same linear domain. Keep the same 3.2 marker on both. The source must recalculate coordinates to 64% and 20%; do not merely relabel the old 0–6 scale or preserve its 53.333%/16.667% geometry.

## Preserved medical contract

- One independent labelled 3.2 / 3,2 mg/L example; no copied dashboard 2.1 result or history.
- This lab’s reference <5, with laboratory variability visible.
- Lower relative cardiovascular-risk hs-CRP category <1, with the visible category/not-overall-risk note.
- Separate **review if persistent: >2 mg/L**, no filled >2 desirable region.
- Repeat when well; if still elevated, review overall cardiovascular risk. No fixed repeat interval or automatic treatment.
- No diagnosis, personal risk percentage, universal optimum or universal treatment target.
- Retain CDC, AHA, ESC/EAS and ERFC references and existing contextual disclosure.

The slim dashboard rail/cursor can be reused while preserving readable landing label sizes and explicit two-track meanings. Render review must confirm that a full-width <5 rail still reads as the laboratory reference and that the 20%-width <1 rail stays a scoped category rather than a universal health guarantee.
