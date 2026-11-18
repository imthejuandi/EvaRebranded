# EVA rebrand launch handoff

Updated 18 November 2026. GitHub `imthejuandi/EvaRebranded`, branch `main`, is the consolidated workspace for finishing the rebranded website. The user requested this preparation and explicitly postponed publication to `evahealth.es`.

## Approved baseline

The current landing is **review version 44**, deployed UI commit `71571c8bb1092e8f7d6099d3dc0385b6314899a8`. The landing runner entrance and the reveal of its headline and entry links run at 1.5×. The footage plays at native speed. [Runner timing checks](runner-entrance-speed-qa.json) record the measured differences. Version 43 introduced the [Trend emphasis](trend-emphasis-qa.json) on top of the [typography and spacing pass](impeccable-typography-qa.json).

Review: [English](https://eva-content-review.jdlagop.chatgpt.site/en?review=44) · [Español](https://eva-content-review.jdlagop.chatgpt.site/es?review=44). The query is a review label; native receipts in [SESSION_HANDOFF.json](SESSION_HANDOFF.json) identify the actual deployment.

Preserve the runner, analog dots, typography, Tasso footage, dashboard examples, lifestyle imagery and narrative order. Free interpretation of previous reports leads; the optional starting kit contains 13 biomarkers at **€99 + VAT**. The internal `quarterly` preview intent does not advertise an automatic recurring offer.

Version 39 groups Method controls with their copy, stacks guided results at 701–1050px, uses 72px phone offer bottom padding and balances the founder quotation. Version 40 further condenses dashboard examples and removes outgoing reference symbols. Version 41 starts Trend in One reading, reveals history only on request, and explains comparable repeat tests, baseline and context with an individualized cadence. Version 42 shares the installed Hanken 400/600 type roles and spacing across these examples, quiets secondary marker controls, and improves text contrast while preserving the established glass/dots. Approved media and application flow handlers are preserved.

## Current behavior

The repository contains source, required media and fonts, EN/ES public pages, Spanish application preview, archives, integration references and verification evidence. Node 24, Codespaces and the lockfile support development; [README.md](../README.md) contains the commands.

The current build is a static review export with 113 routes. Account, report-upload and checkout screens demonstrate browser-local fictional state. They do not provide production account creation, document processing, payment, email delivery, AI inference or health-data storage. No real upload or purchase was performed in the recorded browser checks.

The dashboard integration directory is an inactive reference from an earlier backend revision. Its intercepted-SDK tests do not validate the current production service. See [backend connection notes](backend-connection.md) and [dashboard integration notes](../integration/dashboard/README.md).

## Remaining details before launch

1. **Reconcile wider commercial pages.** The landing and first-kit entry flow use 13 biomarkers and €99 + VAT. `/pricing`, `PricingPage.tsx`, `ServiceCalendar.tsx` and restored pricing material retain legacy 15-marker, quarterly, annual and €499 examples. Review them together before presenting them as current offers.
2. **Complete purchase terms.** Confirm the VAT-inclusive payable amount, delivery/fulfillment terms, available future panels and their separate scope/prices, and any recurring arrangement. Do not infer them from preview plan IDs or old mock prices.
3. **Set the free-upload policy.** Historical notes describe unlimited uploads; the current preview models five lifetime uploads. Confirm one policy before connecting production enforcement and public wording.
4. **Finalize legal and contact content.** Review privacy, cookies, service terms, consents and operational/contact details against the actual service and vendors.
5. **Integrate the real application.** Reuse existing production authentication and backend through explicit adapters. Verify report ownership, signed uploads, processing jobs, entitlements, consents, checkout, fulfillment, account operations and AI streaming. Replace each mock path when its real integration passes.
6. **Choose the deployment architecture.** The static export supports review. Production authentication, secrets and server endpoints need an appropriate runtime and configuration. Connect those after integration, preserving EN/ES routing and existing data.

## Verification and publication hold

[Version 38 QA](final-browser-qa.json) records 18 desktop/phone scenarios across EN/ES, including keyboard/media/reduced-motion controls and fictional entry flows. [Version 39 QA](format-spacing-qa.json) records responsive layout, tablet picker, Method grouping, founder wrapping and offer/footer checks with live screenshots. TypeScript, the 113-route build, English-route audit and relevant Method checks passed for the approved source.

These results establish the review experience. They do not validate physical-device performance or production authentication, payments and medical processing. Verify the integrated system before launch.

Keep `evahealth.es`, its DNS, production hosting and real services unchanged while final details are completed. This synchronization does not create a hosting project, modify domains, activate integrations or perform a production deployment.

Continue editing GitHub `main`. The existing review Site remains available for design review; its project is `appgprj_6ae2409926cc819180f1453af398551d`. Review updates use the established Sites workflow and preserve its audience. Record exact source/build receipts and distinguish GitHub HEAD from deployed UI.

After the remaining details are complete and the user explicitly requests launch, prepare and verify the concrete production release before changing hosting or domains. Keep the previous production release available for rollback.
