# Actual dashboard reference for Tasso step 3

Source inspection only; the root agent captures and visually inspects the rendered route before integrating an image. No generated UI or patient data is required.

## Actual interface

`app/(spanish)/es/dashboard/page.tsx` renders `components/pages/dashboard/DashboardPage.tsx` inside the existing app shell. Its ready state includes:

- The app's EVA navigation and the visible notice `Vista previa · Datos de ejemplo`.
- `Hola, Alex.` in a fresh demo context, plus `Añadir resultados`.
- Four page sections: `Tu firma`, `Tu lectura`, `Tus acciones`, and `Biomarcadores`.
- `HealthSignature`: `Tu firma biológica.`, an `Ejemplo` badge, report date, circular biomarker field, biological-age estimate, EVA Score, source/method details, and count of available report markers/health areas.
- `ExecutiveReading`: report-owned narrative explanation; actionables and the biomarker explorer follow below.

The actual route is Spanish. `HealthSignature` has bilingual component copy, but `DashboardPage` invokes it without an English locale override. Do not repaint its screenshot with invented English interface text.

## Default fixture, not a personal result

`PreviewProvider` initializes from `createFixture('ready')`, then restores any saved browser-local preview state. A fresh isolated browser context therefore gives the reproducible example: Alex; quarterly plan; the 12 June 2026 kit report; 15 biomarkers spanning seven categories; biological age 29 and EVA Score 82. All are fictional design-review values, not an accuracy claim or an actual patient's measurements.

Capture in an isolated context so a saved user profile, modified scenario, or stored report cannot leak into the image. Retain the example labeling in the image or an immediately adjacent caption. Do not expose the fixture's address, birth date, or other unnecessary profile details by capturing the Profile route.

## Recommended crop

For a readable product-focused third step, capture the real `#dashboard-signature` section, including its heading and `Ejemplo` badge. It contains the recognizable current circular signature design and actual source-owned estimates. `.health-signature-device` is a tighter crop if the scene needs less height, but keep example labeling outside that inner crop. Show the full object with `object-fit: contain` or an intentionally reviewed crop; do not stretch it to a cinematic aspect ratio.

A wider screenshot of the upper app view can include the sidebar, `Hola, Alex.`, section navigation, and signature heading. A tall screenshot can travel within a bounded viewport during scrolling to reveal the actual interface. Keep the motion as a camera/crop movement over the real captured UI, not a fabricated interactive dashboard or changing medical values.

Use the root agent's inspected screenshot path as the final asset source. The third-step copy should continue to explain results and retain `2 working days from laboratory receipt`; the screenshot's illustrative figures do not establish individual outcomes or a result turnaround.
