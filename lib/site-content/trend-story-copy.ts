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
        explanation: 'One reading shows the value, but not whether it has changed.',
        question: 'What do earlier readings show?',
      },
      history: {
        label: 'With history',
        explanation: 'History reveals a rise whose cause and persistence remain uncertain.',
        question: 'Is it temporary or persistent?',
      },
    },
    disclosure: 'Alex and these readings are fictional.',
    detailsLabel: 'More context',
    contextSummary: 'Alex reports a hard workout within 24 hours and no recent illness.',
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
        explanation: 'Una lectura muestra el valor, pero no si ha cambiado.',
        question: '¿Qué muestran las lecturas anteriores?',
      },
      history: {
        label: 'Con su historial',
        explanation: 'El historial muestra una subida cuya causa y persistencia siguen sin confirmar.',
        question: '¿Es temporal o persiste?',
      },
    },
    disclosure: 'Alex y estas lecturas son ficticios.',
    detailsLabel: 'Más contexto',
    contextSummary: 'Alex declara ejercicio intenso en las últimas 24 horas y ninguna enfermedad reciente.',
    methodLink: 'Cómo leer los cambios en el tiempo',
    controls: {latest: 'Una lectura', history: 'Ver historial'},
  },
} as const;
