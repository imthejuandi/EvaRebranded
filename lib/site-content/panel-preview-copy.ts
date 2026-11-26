import type {SiteLocale} from '@/lib/site-language';
import {starterSubscription} from './starter-subscription';
import {uploadAllowance} from './upload-allowance';

export type PreviewPanelId = 'free' | 'quarterly' | 'enhanced' | 'full';
export type PanelPreviewPlan = {
  id: PreviewPanelId;
  label: string;
  name: string;
  price: string | null;
  cadence: string;
  summary: string;
  includes: string[];
  action: string;
  href: string;
  foot: string;
};

/** Public panel names stay separate from the existing browser-local plan IDs. */
export function previewPanelFromQuery(value: string | null): PreviewPanelId {
  if (value === 'enhanced' || value === 'full' || value === 'free') return value;
  return 'quarterly';
}

export function previewPanelQuery(plan: PreviewPanelId): string {
  return plan === 'quarterly' ? 'standard' : plan;
}

function copyFor(locale: SiteLocale) {
  const en = locale === 'en';
  const kit = starterSubscription[locale];
  const uploads = uploadAllowance[locale];
  const score = en
    ? 'EVA Score is available when your reports contain enough compatible data.'
    : 'EVA Score está disponible si tus informes contienen suficientes datos compatibles.';
  const confirm = en ? 'To confirm' : 'Por confirmar';
  const plans: PanelPreviewPlan[] = [
    {
      id: 'free', label: en ? 'Your previous results' : 'Tus resultados anteriores',
      name: en ? 'Free report upload' : 'Subida gratuita de analíticas', price: '0',
      cadence: en ? 'no subscription' : 'sin suscripción', summary: uploads.free,
      includes: [uploads.format, en ? 'Your values, units and dates in one place.' : 'Tus valores, unidades y fechas en un mismo lugar.', score],
      action: en ? 'Upload previous labs for free' : 'Subir mis analíticas gratis',
      href: '/es/signup?plan=free&redirect=%2Fes%2Fupload',
      foot: en ? 'Free. No card required.' : 'Gratis. Sin tarjeta.',
    },
    {
      id: 'quarterly', label: en ? 'Standard at home' : 'Estándar en casa',
      name: en ? 'Standard at-home panel' : 'Panel estándar en casa', price: '99',
      cadence: kit.frequency, summary: kit.rationale,
      includes: [en ? '13 biomarkers. ApoB is not included.' : '13 biomarcadores. No incluye ApoB.', en ? 'At-home collection with Tasso+ and shipping both ways.' : 'Recogida en casa con Tasso+ y envíos de ida y vuelta.', en ? 'Report and comparison of results.' : 'Informe y comparación de resultados.', uploads.subscribed],
      action: en ? 'Preview the standard subscription' : 'Ver la suscripción estándar',
      href: '/es/signup?plan=quarterly', foot: kit.cancelAnytime,
    },
    {
      id: 'enhanced', label: en ? 'Enhanced at home' : 'Ampliado en casa',
      name: en ? 'Enhanced at-home panel' : 'Panel ampliado en casa', price: null,
      cadence: en ? 'terms to confirm' : 'condiciones por confirmar',
      summary: en ? 'Includes ApoB. Check all included biomarkers and terms before choosing.' : 'Incluye ApoB. Consulta todos sus biomarcadores y condiciones antes de elegir.',
      includes: [en ? 'An at-home option separate from the standard panel.' : 'Una opción en casa distinta del panel estándar.', en ? 'Includes ApoB.' : 'Incluye ApoB.', en ? 'Other biomarkers and total count to be confirmed.' : 'Resto de biomarcadores y número total por confirmar.'],
      action: en ? 'View enhanced panel details' : 'Ver detalles del panel ampliado',
      href: '#panel-enhanced-details',
      foot: en ? 'Price, timing and availability to be confirmed. This preview does not accept orders.' : 'Precio, plazos y disponibilidad por confirmar. Esta vista previa no admite pedidos.',
    },
    {
      id: 'full', label: en ? 'Full panel in a lab' : 'Completo en laboratorio',
      name: en ? 'Full laboratory panel' : 'Panel completo en laboratorio', price: '499',
      cadence: en ? 'one-time payment' : 'pago único',
      summary: en ? 'A separate panel collected at a partner laboratory. Confirm its scope before booking.' : 'Un panel distinto, con extracción en un laboratorio asociado. Confirma su alcance antes de reservar.',
      includes: [en ? 'Blood draw at a partner laboratory.' : 'Extracción en un laboratorio asociado.', en ? 'EVA report.' : 'Informe EVA.', en ? 'One-time purchase, with no subscription.' : 'Compra única, sin suscripción.', uploads.labYear],
      action: en ? 'Preview the laboratory panel' : 'Ver el panel de laboratorio',
      href: '/es/signup?plan=full',
      foot: en ? 'Panel contents and availability must be confirmed before booking.' : 'El contenido del panel y la disponibilidad se confirman antes de reservar.',
    },
  ];
  return {
    plans,
    eyebrow: en ? 'Choose your panel' : 'Elige tu panel',
    intro: en ? 'Compare at-home panels and the separate laboratory option. Already have blood test results? You can upload them for free.' : 'Compara los paneles en casa y la opción de laboratorio. Si ya tienes una analítica, puedes subirla gratis.',
    selectLabel: en ? 'Choose a panel' : 'Elige un panel',
    preview: en ? 'Preview only. No payments, orders or bookings are made.' : 'Solo vista previa. No se realizan pagos, pedidos ni reservas.',
    priceToConfirm: en ? 'Price to confirm' : 'Precio por confirmar',
    comparisonAction: en ? 'Compare all options' : 'Comparar todas las opciones',
    tableHint: en ? 'Swipe the table to compare all options.' : 'Desliza la tabla para comparar todas las opciones.',
    comparisonNote: en ? 'EVA Score depends on having enough compatible data. Enhanced-panel details are pending confirmation. Confirm the full laboratory panel’s contents and terms separately.' : 'EVA Score requiere suficientes datos compatibles. Los detalles del panel ampliado están pendientes de confirmación. Consulta por separado el contenido y las condiciones del panel completo en laboratorio.',
    groups: [
      {title: en ? 'Testing' : 'Pruebas', rows: [
        {label: en ? 'Reports you can upload' : 'Informes que puedes subir', cells: [uploads.freeShort, en ? 'Unlimited while subscribed' : 'Sin límite con la suscripción activa', confirm, en ? 'Unlimited for one year from purchase' : 'Sin límite durante un año desde la compra']},
        {label: en ? 'Sample collection' : 'Recogida de muestra', cells: [en ? 'Your existing report' : 'Tu informe anterior', en ? 'At home' : 'En casa', en ? 'At home' : 'En casa', en ? 'At a partner laboratory' : 'En laboratorio asociado']},
        {label: en ? 'Biomarkers measured' : 'Biomarcadores analizados', cells: [en ? 'Those in your report' : 'Los de tu informe', '13', en ? 'Includes ApoB; remaining scope to confirm' : 'Incluye ApoB; resto por confirmar', en ? 'Panel scope to confirm' : 'Alcance por confirmar']},
        {label: en ? 'ApoB in the panel' : 'ApoB en el panel', cells: [en ? 'Depends on your report' : 'Depende de tu informe', false, true, confirm]},
        {label: en ? 'Cadence' : 'Frecuencia', cells: [en ? 'When you choose' : 'Cuando tú decidas', en ? 'Quarterly' : 'Trimestral', confirm, en ? 'One blood draw' : 'Una extracción']},
      ]},
      {title: en ? 'Understanding your results' : 'Entender tus resultados', rows: [
        {label: en ? 'Report values, units and dates' : 'Valores, unidades y fechas del informe', cells: [true, true, confirm, true]},
        {label: en ? 'EVA Score' : 'EVA Score', cells: [en ? 'With enough compatible data' : 'Con suficientes datos compatibles', en ? 'With enough compatible data' : 'Con suficientes datos compatibles', confirm, en ? 'With enough compatible data' : 'Con suficientes datos compatibles']},
      ]},
      {title: en ? 'Terms' : 'Condiciones', rows: [
        {label: en ? 'Subscription' : 'Suscripción', cells: [false, en ? 'Renews quarterly' : 'Renovación trimestral', confirm, false]},
        {label: en ? 'Cancellation' : 'Cancelación', cells: [en ? 'Not applicable' : 'No aplica', en ? 'Cancel anytime' : 'Cuando quieras', confirm, en ? 'Not applicable' : 'No aplica']},
      ]},
    ],
    offer: {
      kicker: en ? 'THE SERVICE, WITH THE DETAILS' : 'EL SERVICIO, CON SUS DETALLES',
      title: en ? 'A panel for your next step.' : 'Un panel para tu siguiente paso.',
      freeTitle: en ? 'Already have blood test results?' : '¿Ya tienes una analítica?',
      freeBody: `${uploads.free} ${uploads.format} ${score}`,
      standardBody: en ? 'Collect your sample at home with Tasso+. The standard panel includes 13 biomarkers, laboratory analysis and shipping both ways. ApoB is not included.' : 'Recoge la muestra en casa con Tasso+. El panel estándar incluye 13 biomarcadores, análisis en laboratorio y envíos de ida y vuelta. No incluye ApoB.',
      markerAction: en ? 'See all 13 standard biomarkers' : 'Ver los 13 biomarcadores del estándar',
      timing: en ? 'Shipping and analysis times are confirmed before ordering. The enhanced panel’s contents, price and availability are still to be confirmed.' : 'Los plazos de envío y análisis se confirman antes de contratar. El contenido, el precio y la disponibilidad del panel ampliado están pendientes de confirmación.',
      timingTitle: en ? 'Before you choose.' : 'Antes de elegir.',
      termsAction: en ? 'Read the full terms' : 'Leer las condiciones completas',
    },
    markers: {
      eyebrow: en ? 'STANDARD AT-HOME PANEL' : 'PANEL ESTÁNDAR EN CASA',
      title: en ? 'The standard panel’s 13 biomarkers.' : 'Los 13 biomarcadores del panel estándar.',
      note: en ? 'ApoB belongs to the separate enhanced at-home option. It is not included in this standard panel.' : 'ApoB forma parte de la opción ampliada en casa. No está incluido en este panel estándar.',
    },
    reportDetail: en ? 'You can compare readings without attributing a change to a particular habit.' : 'Puedes comparar lecturas sin atribuir un cambio a un hábito concreto.',
    standardTermsTitle: en ? 'What the standard fee includes' : 'Qué incluye la cuota estándar',
    standardSubscriptionTitle: en ? 'The standard quarterly subscription.' : 'La suscripción trimestral estándar.',
    standardProcessTitle: en ? 'How the standard kit works.' : 'Cómo funciona el kit estándar.',
    standardCancellationQuestion: en ? 'When can I cancel the standard subscription?' : '¿Cuándo puedo cancelar la suscripción estándar?',
    standardFaqQuestion: en ? 'What does the standard panel include?' : '¿Qué incluye el panel estándar?',
    enhancedRhythmTitle: en ? 'An at-home option with ApoB.' : 'Una opción en casa con ApoB.',
    enhancedRhythmBody: en ? 'The enhanced panel is separate from the standard subscription. Its other biomarkers, frequency, price and availability are still to be confirmed.' : 'El panel ampliado es distinto de la suscripción estándar. El resto de sus biomarcadores, la frecuencia, el precio y la disponibilidad están pendientes de confirmación.',
  };
}

export const panelPreviewCopy = {es: copyFor('es'), en: copyFor('en')};
