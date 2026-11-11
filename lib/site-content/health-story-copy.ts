/** This chapter explains fair comparisons and repeated choices, without promising a testing schedule. */
export const healthStoryCopy = {
  en: {
    kicker: '01 / A BROADER PERSPECTIVE',
    scienceLabel: 'THE SCIENCE BEHIND EVA',
    heading: ['Your health has', 'a story.'],
    lead: 'A change in a number needs a fair comparison and the context around it.',
    insights: [
      {
        id: 'comparison',
        title: 'Compare like with like.',
        body: 'The same biomarker, compatible units and comparable lab methods make changes easier to interpret.',
      },
      {
        id: 'context',
        title: 'The day matters, too.',
        body: 'Exercise or illness around a blood draw can influence a result. Your notes help put changes in context.',
      },
    ],
    methodLink: 'What makes results comparable',
    rhythm: {
      numberLabel: 'days. A suggested review rhythm.',
      heading: ['Let your next question', 'guide your next test.'],
      intro: 'Review your history. Decide whether to test again and which available panel fits, with EVA’s guidance.',
      points: [
        {month: '01', title: 'Start', body: 'First results or previous labs.'},
        {month: '04', title: 'Review + choose', body: 'What changed?'},
        {month: '07', title: 'Review + choose', body: 'What matters now?'},
        {month: '10', title: 'Review + choose', body: 'What will you follow?'},
      ],
    },
  },
  es: {
    kicker: '01 / UNA MIRADA MÁS AMPLIA',
    scienceLabel: 'LA CIENCIA DE EVA',
    heading: ['Tu salud tiene', 'una historia.'],
    lead: 'Para entender un cambio, importan tanto la comparación como el contexto de la prueba.',
    insights: [
      {
        id: 'comparison',
        title: 'Compara lo comparable.',
        body: 'Comparar el mismo biomarcador, con unidades y métodos de laboratorio compatibles, ayuda a interpretar mejor los cambios.',
      },
      {
        id: 'context',
        title: 'El día también cuenta.',
        body: 'El ejercicio o una enfermedad cerca de la extracción pueden influir en un resultado. Tus notas ponen los cambios en contexto.',
      },
    ],
    methodLink: 'Qué permite comparar dos resultados',
    rhythm: {
      numberLabel: 'días. Un ritmo orientativo de revisión.',
      heading: ['Tu próxima pregunta', 'guía tu próxima prueba.'],
      intro: 'Revisa tu historial. Con la orientación de EVA, decide si hacer otra analítica y qué panel disponible elegir.',
      points: [
        {month: '01', title: 'Empieza', body: 'Primeros resultados o analíticas anteriores.'},
        {month: '04', title: 'Revisa y elige', body: '¿Qué cambió?'},
        {month: '07', title: 'Revisa y elige', body: '¿Qué te importa ahora?'},
        {month: '10', title: 'Revisa y elige', body: '¿Qué quieres seguir midiendo?'},
      ],
    },
  },
} as const;
