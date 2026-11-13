/** The fictional Alex case demonstrates what earlier observations add to one result. */
export const trendStoryCopy = {
  en: {
    kicker: 'WHAT HISTORY REVEALS',
    heading: ['Trendlines,', 'not snapshots.'],
    lead: [
      {text: 'Repeated, comparable blood tests help establish ', emphasis: false},
      {text: 'your baseline', emphasis: true},
      {text: '. Exercise and illness can affect biomarkers, so interpreting them alongside your ', emphasis: false},
      {text: 'history and context', emphasis: true},
      {text: ' helps ', emphasis: false},
      {text: 'track changes', emphasis: true},
      {text: '. How often to test depends on the marker and your health.', emphasis: false},
    ],
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
    lead: [
      {text: 'Repetir análisis comparables ayuda a conocer ', emphasis: false},
      {text: 'tu nivel habitual', emphasis: true},
      {text: '. Como el ejercicio y las enfermedades pueden alterar los biomarcadores, leerlos junto con tu ', emphasis: false},
      {text: 'historial y contexto', emphasis: true},
      {text: ' ayuda a ', emphasis: false},
      {text: 'seguir cambios', emphasis: true},
      {text: '. La frecuencia depende del marcador y de tu salud.', emphasis: false},
    ],
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
