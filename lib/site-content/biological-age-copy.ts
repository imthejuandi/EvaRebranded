/** Public educational example; availability is not an inclusion promise for the starting kit. */
export const biologicalAgeCopy = {
  en: {
    kicker: 'YOUR EVOLUTION',
    availability: 'WHEN THE REQUIRED DATA ARE AVAILABLE',
    headline: ['Your age tells', 'part of the story.'],
    intro: 'Individual values tell you one part. These two measures bring them together from different perspectives.',
    definitions: [
      {
        id: 'biological-age',
        label: 'Estimated biological age',
        description: 'An estimate of the age your biomarker pattern resembles in a reference population.',
      },
      {
        id: 'longevity-score',
        label: 'Longevity score',
        description: 'How close your values are to the targets used by EVA’s method.',
      },
    ],
    exampleLabel: 'An illustrative comparison of chronological and estimated biological age',
    chronologicalLabel: 'Chronological age',
    estimatedLabel: 'Estimated biological age',
    years: 'years',
    differenceCaption: 'Difference between the two ages in this example.',
    note: 'Illustrative ages, not a prediction of your result. Availability depends on the data in your report.',
    link: 'How these measures work',
  },
  es: {
    kicker: 'TU EVOLUCIÓN',
    availability: 'CUANDO ESTÁN LOS DATOS NECESARIOS',
    headline: ['Tu edad cuenta', 'una parte.'],
    intro: 'Cada valor cuenta una parte. Estas dos medidas los reúnen desde perspectivas distintas.',
    definitions: [
      {
        id: 'biological-age',
        label: 'Edad biológica estimada',
        description: 'Una estimación de la edad a la que se parece tu patrón de biomarcadores en una población de referencia.',
      },
      {
        id: 'longevity-score',
        label: 'Puntuación de longevidad',
        description: 'Hasta qué punto tus valores se acercan a los objetivos del método de EVA.',
      },
    ],
    exampleLabel: 'Una comparación ilustrativa de la edad cronológica y la edad biológica estimada',
    chronologicalLabel: 'Edad cronológica',
    estimatedLabel: 'Edad biológica estimada',
    years: 'años',
    differenceCaption: 'Diferencia entre las dos edades de este ejemplo.',
    note: 'Edades ilustrativas, no una predicción de tu resultado. La disponibilidad depende de los datos de tu informe.',
    link: 'Cómo funcionan estas medidas',
  },
} as const;
