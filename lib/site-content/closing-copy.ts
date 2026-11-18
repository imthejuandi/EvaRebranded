import {uploadAllowance} from '@/lib/site-content/upload-allowance';
import {starterSubscription} from '@/lib/site-content/starter-subscription';

export const closingCopy = {
  es: {
    founder: {
      kicker: 'LA IDEA DETRÁS DE EVA',
      quote: [
        '«EVA es el servicio que deseaba tener cuando comencé mi propio camino de salud preventiva: uno que no solo te entrega datos, sino que te enseña lo que significan ',
        'y qué hacer al respecto.»',
      ],
      name: 'Juan Diego Lago',
      role: 'Fundador y CEO, EVA Health',
      link: 'Nuestra historia',
    },
    offer: {
      kicker: 'ELIGE CÓMO EMPEZAR',
      heading: ['Empieza', 'con EVA.'],
      lead: 'Con una analítica previa o con un kit por suscripción.',
      free: {
        heading: 'Interpreta tus analíticas gratis.',
        body: `${uploadAllowance.es.free} ${uploadAllowance.es.format}`,
        action: 'Interpretar mis analíticas gratis',
        note: 'Con tu cuenta y consentimiento. Sin tarjeta ni suscripción.',
      },
      kit: {
        heading: 'O suscríbete al kit en casa.',
        summary: '13 biomarcadores en cada kit.',
        bullets: [
          'Recogida en casa con Tasso+.',
          'Tus resultados, explicados junto a los intervalos del laboratorio.',
          starterSubscription.es.rationale,
          uploadAllowance.es.subscribed,
        ],
        action: starterSubscription.es.kitAction,
      },
      details: {
        kicker: 'ANTES DE ELEGIR',
        heading: 'Consulta cada opción.',
        body: 'Otros paneles tienen su propio alcance y precio. Consulta los detalles antes de elegir.',
        action: 'Ver planes y detalles',
      },
    },
    footer: {
      privatePreview: 'Mi EVA · vista previa en español',
      note: 'La vista previa del área privada y los archivos de diseño están en español. El acceso a la cuenta y los documentos públicos están disponibles en español e inglés.',
      designLabel: 'Diseño y archivo (en español)',
    },
  },
  en: {
    founder: {
      kicker: 'THE IDEA BEHIND EVA',
      quote: [
        '“EVA is the service I wished I had when I began my own journey into preventive health: one that gives you more than data, helping you understand what it means ',
        'and what to do with it.”',
      ],
      name: 'Juan Diego Lago',
      role: 'Founder and CEO, EVA Health',
      link: 'Our story',
    },
    offer: {
      kicker: 'CHOOSE HOW TO START',
      heading: ['Start', 'with EVA.'],
      lead: 'With a previous lab report or a home kit subscription.',
      free: {
        heading: 'Interpret your lab results for free.',
        body: `${uploadAllowance.en.free} ${uploadAllowance.en.format}`,
        action: 'Interpret my lab results for free',
        note: 'With your account and consent. No card or subscription required.',
      },
      kit: {
        heading: 'Or subscribe to the home kit.',
        summary: '13 biomarkers in every kit.',
        bullets: [
          'Collect at home with Tasso+.',
          'Your results, explained with laboratory reference ranges.',
          starterSubscription.en.rationale,
          uploadAllowance.en.subscribed,
        ],
        action: starterSubscription.en.kitAction,
      },
      details: {
        kicker: 'BEFORE YOU CHOOSE',
        heading: 'Explore each option.',
        body: 'Other panels have their own scope and pricing. Check the details before choosing.',
        action: 'See plans and details',
      },
    },
    footer: {
      privatePreview: 'My EVA · Spanish preview',
      note: 'The private app preview and design archives are currently in Spanish. Account entry and public documents are available in English and Spanish.',
      designLabel: 'Design and archive (in Spanish)',
    },
  },
} as const;
