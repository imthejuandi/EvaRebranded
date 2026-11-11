/** The fictional Alex case demonstrates what earlier observations add to one result. */
export const trendStoryCopy = {
  en: {
    kicker: 'WHAT HISTORY REVEALS',
    heading: ['Trendlines,', 'not snapshots.'],
    lead: 'One reading gives you a value. Four readings reveal a change.',
    latestLabel: 'Latest result',
    historyLabel: 'Four readings',
    readingLabel: 'Reading',
    interpretations: {
      latest: {
        label: 'With one reading',
        explanation: 'hs-CRP can signal inflammation, but cannot tell us its cause. Alex’s workout may influence the result. One reading cannot show whether his level has changed.',
        question: 'How does it compare with his earlier readings?',
      },
      history: {
        label: 'With history',
        explanation: 'Alex’s latest reading is higher than the three before it. His history reveals a rise; it cannot establish the cause or show whether that rise will last.',
        question: 'Is this rise temporary, or does it persist?',
      },
    },
    disclosure: 'Alex and these readings are fictional.',
    methodLink: 'How to read changes over time',
    controls: {latest: 'One reading', history: 'Show history'},
  },
  es: {
    kicker: 'LO QUE REVELA EL HISTORIAL',
    heading: ['Trayectorias,', 'no fotos.'],
    lead: 'Una lectura te da una cifra. Cuatro permiten ver un cambio.',
    latestLabel: 'Último resultado',
    historyLabel: 'Cuatro lecturas',
    readingLabel: 'Lectura',
    interpretations: {
      latest: {
        label: 'Con una lectura',
        explanation: 'La hs-CRP puede señalar inflamación, pero no identifica su causa. El entrenamiento de Alex puede influir en el resultado. Una sola lectura no muestra si su nivel ha cambiado.',
        question: '¿Cómo se compara con sus lecturas anteriores?',
      },
      history: {
        label: 'Con su historial',
        explanation: 'La última lectura de Alex es más alta que las tres anteriores. Su historial muestra una subida, pero no confirma la causa ni permite saber si durará.',
        question: '¿Es una subida temporal o persiste?',
      },
    },
    disclosure: 'Alex y estas lecturas son ficticios.',
    methodLink: 'Cómo leer los cambios en el tiempo',
    controls: {latest: 'Una lectura', history: 'Ver historial'},
  },
} as const;
