const prices = {es: '99 € + IVA', en: '€99 + VAT'} as const;
const frequencies = {es: 'por trimestre', en: 'per quarter'} as const;

export const starterSubscription = {
  es: {
    planName: 'Suscripción trimestral',
    price: prices.es,
    frequency: frequencies.es,
    pricePerQuarter: `${prices.es} ${frequencies.es}`,
    cancelAnytime: 'Cancela cuando quieras.',
    kitAction: 'Suscribirme al kit',
    scope: '13 biomarcadores',
    summary: `Kit de 13 biomarcadores · ${prices.es} ${frequencies.es}.`,
    rationale: 'Tu primera medición establece un punto de partida. Comparar las siguientes en condiciones similares te ayuda a ver qué ha cambiado.',
  },
  en: {
    planName: 'Quarterly subscription',
    price: prices.en,
    frequency: frequencies.en,
    pricePerQuarter: `${prices.en} ${frequencies.en}`,
    cancelAnytime: 'Cancel anytime.',
    kitAction: 'Subscribe to the kit',
    scope: '13 biomarkers',
    summary: `13 biomarkers in each kit · ${prices.en} ${frequencies.en}.`,
    rationale: 'Your first measurement sets a baseline. Comparing later results under similar conditions helps you see what has changed.',
  },
} as const;
