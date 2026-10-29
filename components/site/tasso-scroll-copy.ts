export const tassoScrollCopy = {
  en: {
    eyebrow: 'EVA / SCROLL STUDIES', title: ['One small step.', 'Four ways to experience it.'],
    intro: 'Four scroll-led directions, one simple journey. Collect at home, return your protected sample, then explore your actual EVA dashboard.',
    back: 'Back to the content review', choose: 'Explore the four directions',
    current: 'CURRENT VERSION', study: 'NEW DIRECTION', ready: 'Ready to review', pending: 'Sequence in preparation',
    pendingBody: 'This scene will appear here when its image sequence is ready.',
    error: 'This film could not be loaded.', errorBody: 'You can retry playback or choose another scene. The process is explained below.',
    scene: 'Scene', selectScene: 'Choose a scene', silent: 'Silent films. All three steps are explained below.',
    transcript: 'Read the three steps', instructions: 'Follow the instructions supplied with your kit.',
    fullInstructions: 'Watch the manufacturer’s full instructions',
    sameJourney: 'The same journey in every direction.',
    sameBody: 'Kit at home. A protected sample returned in the prepaid envelope. Results in 2 working days from laboratory receipt.',
    noSelection: 'The current homepage remains the original while we review these directions.',
    options: {
      original: {title: 'Original', pitch: 'The current version, kept for comparison.', description: 'The existing collection and return scenes, followed by the actual EVA dashboard.'},
      studio: {title: 'Studio Precision', pitch: 'The process, in its simplest form.', description: 'Warm ivory, close focus and tactile materials. A precise product film with soft light and deliberate framing.'},
      morning: {title: 'Morning at Home', pitch: 'A small moment in an ordinary day.', description: 'A real-feeling morning, one person and one familiar table. Quiet daylight and natural movement make the routine easy to imagine.'},
      light: {title: 'Light into Insight', pitch: 'A close look. A clearer understanding.', description: 'EVA ink and controlled amber light. Camera and focus reveal real skin, protected packaging and the texture of a report.'},
    },
    scenes: [
      {short: 'Collect', title: 'Collect at home.', caption: 'Your kit comes to you. Prepare, apply, press once, release.', detail: 'Upper arm · up to 5 minutes', long: 'The kit comes to you. Warm, clean and dry your upper arm. Apply Tasso+, then press once and release. Relax your arm. Allow up to 5 minutes. Keep the attached tube pointing down.'},
      {short: 'Return', title: 'Send your sample back.', caption: 'Protected sample. Prepaid return envelope.', detail: 'Return postage included.', long: 'Seal and label your sample as instructed. Pack it in the supplied protective packaging, then the prepaid return envelope.'},
      {short: 'Understand', title: 'Understand your results.', caption: '2 working days from laboratory receipt.', detail: 'Biomarkers explained. A clearer picture over time.', long: 'Your biomarkers, explained. A clearer picture of your health, ready to follow over time. Results in 2 working days from laboratory receipt of your sample.'},
    ],
  },
  es: {
    eyebrow: 'EVA / ESTUDIOS DE SCROLL', title: ['Un pequeño gesto.', 'Cuatro formas de vivirlo.'],
    intro: 'Cuatro direcciones guiadas por scroll, un mismo recorrido sencillo. Recoge tu muestra en casa, devuélvela protegida y explora el panel real de EVA.',
    back: 'Volver a la revisión de contenido', choose: 'Explora las cuatro direcciones',
    current: 'VERSIÓN ACTUAL', study: 'NUEVA DIRECCIÓN', ready: 'Lista para revisar', pending: 'Secuencia en preparación',
    pendingBody: 'Esta escena aparecerá aquí cuando su secuencia de imágenes esté lista.',
    error: 'No se ha podido cargar esta película.', errorBody: 'Puedes volver a intentarlo o elegir otra escena. El proceso se explica debajo.',
    scene: 'Escena', selectScene: 'Elige una escena', silent: 'Películas sin sonido. Los tres pasos se explican debajo.',
    transcript: 'Lee los tres pasos', instructions: 'Sigue las instrucciones incluidas en tu kit.',
    fullInstructions: 'Ver las instrucciones completas del fabricante',
    sameJourney: 'El mismo recorrido en cada dirección.',
    sameBody: 'El kit en casa. Una muestra protegida que devuelves en el sobre prepagado. Resultados en 2 días laborables desde la recepción en laboratorio.',
    noSelection: 'La página de inicio actual conserva el original mientras revisamos estas direcciones.',
    options: {
      original: {title: 'Original', pitch: 'La versión actual, conservada para comparar.', description: 'Las escenas actuales de recogida y devolución, seguidas del panel real de EVA.'},
      studio: {title: 'Precisión de estudio', pitch: 'El proceso, en su forma más sencilla.', description: 'Marfil cálido, enfoque cercano y materiales táctiles. Una película de producto precisa, con luz suave y encuadres cuidados.'},
      morning: {title: 'Una mañana en casa', pitch: 'Un pequeño momento en un día cualquiera.', description: 'Una mañana cotidiana, una persona y una mesa familiar. La luz natural y el movimiento sutil hacen fácil imaginar la rutina.'},
      light: {title: 'De la luz a la claridad', pitch: 'Una mirada cercana. Una visión más clara.', description: 'El tono tinta de EVA y una luz ámbar controlada. Cámara y enfoque revelan piel real, embalaje protector y la textura de un informe.'},
    },
    scenes: [
      {short: 'Recoge', title: 'Recoge tu muestra en casa.', caption: 'El kit llega a ti. Prepara, coloca, pulsa una vez y suelta.', detail: 'Parte superior del brazo · hasta 5 minutos', long: 'El kit llega a tu casa. Calienta, limpia y seca la parte superior del brazo. Coloca Tasso+, pulsa una vez y suelta. Relaja el brazo. La recogida puede durar hasta 5 minutos. Mantén el tubo conectado hacia abajo.'},
      {short: 'Devuelve', title: 'Devuelve tu muestra.', caption: 'Muestra protegida. Sobre de devolución prepagado.', detail: 'Franqueo de devolución incluido.', long: 'Sella e identifica tu muestra según las instrucciones. Colócala en el embalaje protector incluido y después en el sobre de devolución prepagado.'},
      {short: 'Comprende', title: 'Comprende tus resultados.', caption: '2 días laborables desde la recepción en laboratorio.', detail: 'Biomarcadores explicados. Una visión más clara en el tiempo.', long: 'Tus biomarcadores, explicados. Una visión más clara de tu salud para seguir su evolución en el tiempo. Resultados en 2 días laborables desde la recepción de tu muestra en el laboratorio.'},
    ],
  },
} as const;

export type TassoScrollCopy = typeof tassoScrollCopy[keyof typeof tassoScrollCopy];
