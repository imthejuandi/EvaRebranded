/** This chapter explains personal history, draw-day context and guided review choices. */
export const healthStoryCopy = {
  en: {
    kicker: '01 / A BROADER PERSPECTIVE',
    scienceLabel: 'THE SCIENCE BEHIND EVA',
    heading: ['Your health has', 'a story.'],
    lead: 'Your past results and the day of your test help explain what a new reading may mean.',
    insights: [
      {
        id: 'comparison',
        title: 'Know what’s usual for you.',
        body: 'A result can sit inside a lab’s range and still differ from your usual pattern. Past results help show whether a shift is new or recurring.',
      },
      {
        id: 'context',
        title: 'The day matters, too.',
        body: 'Exercise or illness around a blood draw can influence a result. Your notes help put changes in context.',
      },
    ],
    methodLink: 'How to read your history',
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
    lead: 'Tus resultados anteriores y el día de la prueba ayudan a entender qué puede significar una nueva lectura.',
    insights: [
      {
        id: 'comparison',
        title: 'Conoce tu propio patrón.',
        body: 'Un resultado puede estar dentro del intervalo del laboratorio y ser distinto a tu patrón habitual. Tus análisis anteriores ayudan a ver si el cambio es nuevo o se repite.',
      },
      {
        id: 'context',
        title: 'El día también cuenta.',
        body: 'El ejercicio o una enfermedad cerca de la extracción pueden influir en un resultado. Tus notas ponen los cambios en contexto.',
      },
    ],
    methodLink: 'Cómo leer tu historial',
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
