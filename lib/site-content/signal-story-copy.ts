/** One narrative for the signal film, chapter controls and its complete static transcript. */
export const signalStoryCopy = {
  en: {
    eyebrow: 'A SIGNAL TO KNOW YOURSELF',
    introHeading: ['Understand', 'the signals', 'from your body.'],
    outcomeHeading: ['From data.', 'To your life.'],
    accessibleHeading: 'Understand the signals from your body. From data. To your life.',
    timelineLabel: 'Signal chapters',
    chapters: [
      {
        id: 'body',
        timeline: 'Your body',
        title: 'Your body changes.',
        body: 'Your biomarkers help you observe those changes.',
      },
      {
        id: 'starting-point',
        timeline: 'Starting point',
        title: 'Your starting point.',
        body: 'Start with 13 biomarkers, or bring your previous lab results.',
      },
      {
        id: 'review',
        timeline: 'Review',
        title: 'A chance to review.',
        body: 'Around 90 days later, compare compatible results with guidance.',
      },
      {
        id: 'choice',
        timeline: 'Your choice',
        title: 'Your next focus.',
        body: 'Explore available panels with EVA, then choose what to measure.',
      },
    ],
  },
  es: {
    eyebrow: 'UNA SEÑAL PARA CONOCERTE',
    introHeading: ['Entiende mejor', 'las señales', 'de tu cuerpo.'],
    outcomeHeading: ['De los datos.', 'A tu vida.'],
    accessibleHeading: 'Entiende mejor las señales de tu cuerpo. De los datos. A tu vida.',
    timelineLabel: 'Etapas de la señal',
    chapters: [
      {
        id: 'body',
        timeline: 'Tu cuerpo',
        title: 'Tu cuerpo cambia.',
        body: 'Tus biomarcadores ayudan a observar esos cambios.',
      },
      {
        id: 'starting-point',
        timeline: 'Punto de partida',
        title: 'Tu punto de partida.',
        body: 'Empieza con 13 biomarcadores o aporta tus analíticas anteriores.',
      },
      {
        id: 'review',
        timeline: 'Revisión',
        title: 'Un momento para revisar.',
        body: 'En unos 90 días, compara resultados compatibles con orientación.',
      },
      {
        id: 'choice',
        timeline: 'Tu elección',
        title: 'Tu próximo enfoque.',
        body: 'Explora los paneles disponibles con EVA y elige qué medir.',
      },
    ],
  },
} as const;

export type SignalStoryContent = typeof signalStoryCopy[keyof typeof signalStoryCopy];
