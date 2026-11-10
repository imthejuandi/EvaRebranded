export type ExplanationLevel = 'simple' | 'balanced' | 'advanced';
export const explanationLevels = ['simple', 'balanced', 'advanced'] as const;
export const RESULT_EXPLANATION_EVENT = 'eva:show-explanation';

export const resultExplanationCopy = {
  en: {
    headline: ['Your results.', 'Explained your way.'],
    intro: 'Your results and context, explained at the level that works for you.',
    label: 'Explanation level',
    settingLabel: 'Your reading setting',
    settingHint: 'Chosen at signup. Change it in Settings.',
    levels: {simple: 'Beginner', balanced: 'Intermediate', advanced: 'Advanced'},
    benefits: {simple: 'Plain language', balanced: 'More explanation', advanced: 'Clinical detail'},
    hint: 'Try Beginner.',
    reassurance: 'The result stays the same. You choose the detail.',
    unavailable: 'An explanation for this example is not available yet.',
    previewTitle: ['The same context.', 'Your level of detail.'],
    previewBody: 'Choose your reading level when you sign up. Your results use it automatically, with your history and blood-draw notes in view. Change it anytime in Settings.',
    previewAction: 'Try the explanation levels',
  },
  es: {
    headline: ['Tus resultados.', 'Explicados a tu manera.'],
    intro: 'Tus resultados y tu contexto, explicados al nivel que prefieras.',
    label: 'Nivel de explicación',
    settingLabel: 'Tu nivel de lectura',
    settingHint: 'Elegido al registrarte. Cámbialo en Configuración.',
    levels: {simple: 'Principiante', balanced: 'Intermedio', advanced: 'Avanzado'},
    benefits: {simple: 'Lenguaje claro', balanced: 'Más explicación', advanced: 'Detalle clínico'},
    hint: 'Prueba Principiante.',
    reassurance: 'El resultado se mantiene. Tú eliges el detalle.',
    unavailable: 'La explicación de este ejemplo aún no está disponible.',
    previewTitle: ['El mismo contexto.', 'Tu nivel de detalle.'],
    previewBody: 'Elige tu nivel al registrarte. Tus resultados lo usan automáticamente, con tu historial y los datos de la extracción a la vista. Cámbialo en Configuración.',
    previewAction: 'Prueba los niveles de explicación',
  },
} as const;
