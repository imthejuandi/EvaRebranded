export const FREE_REPORT_UPLOAD_LIMIT = 5;

export const uploadAllowance = {
  en: {
    freeShort: `${FREE_REPORT_UPLOAD_LIMIT} free report uploads per account`,
    free: `You can upload up to ${FREE_REPORT_UPLOAD_LIMIT} reports in total with a free account.`,
    subscribed: 'You can upload unlimited reports while your subscription is active.',
    labYear: 'The lab panel includes unlimited report uploads for one year from purchase.',
  },
  es: {
    freeShort: `${FREE_REPORT_UPLOAD_LIMIT} informes gratis por cuenta`,
    free: `Puedes subir hasta ${FREE_REPORT_UPLOAD_LIMIT} informes en total con tu cuenta gratuita.`,
    subscribed: 'Puedes subir informes sin límite mientras tu suscripción esté activa.',
    labYear: 'Con el panel de laboratorio puedes subir informes sin límite durante un año desde la compra.',
  },
} as const;
