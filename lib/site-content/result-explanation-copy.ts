export type ExplanationLevel = 'simple' | 'balanced' | 'advanced';
export const explanationLevels = ['simple', 'balanced', 'advanced'] as const;
export const RESULT_EXPLANATION_EVENT = 'eva:show-explanation';

export const resultExplanationCopy = {
  en: {
    headline: ['Your results.', 'Explained your way.'],
    intro: 'The same result. You choose the detail.',
    label: 'Explanation level',
    settingLabel: 'Your reading setting',
    settingHint: 'The result stays the same.',
    settingEyebrow: 'READING PREFERENCE',
    settingInvitation: 'Choose the level of detail.',
    levels: {simple: 'Beginner', balanced: 'Intermediate', advanced: 'Advanced'},
    benefits: {simple: 'Plain language', balanced: 'More explanation', advanced: 'Technical detail'},
    hint: 'Try Beginner.',
    reassurance: 'The result stays the same. You choose the detail.',
    unavailable: 'An explanation for this example is not available yet.',
    previewTitle: ['The same context.', 'Your level of detail.'],
    previewBody: 'One result. Choose how much detail to see.',
    previewAction: 'Try the explanation levels',
  },
  es: {
    headline: ['Tus resultados.', 'Explicados a tu manera.'],
    intro: 'El mismo resultado. Tú eliges el detalle.',
    label: 'Nivel de explicación',
    settingLabel: 'Tu nivel de lectura',
    settingHint: 'El resultado se mantiene.',
    settingEyebrow: 'TU NIVEL DE LECTURA',
    settingInvitation: 'Elige el nivel de detalle.',
    levels: {simple: 'Principiante', balanced: 'Intermedio', advanced: 'Avanzado'},
    benefits: {simple: 'Lenguaje claro', balanced: 'Más explicación', advanced: 'Detalle técnico'},
    hint: 'Prueba Principiante.',
    reassurance: 'El resultado se mantiene. Tú eliges el detalle.',
    unavailable: 'La explicación de este ejemplo aún no está disponible.',
    previewTitle: ['El mismo contexto.', 'Tu nivel de detalle.'],
    previewBody: 'Un mismo resultado. Elige cuánto detalle ver.',
    previewAction: 'Prueba los niveles de explicación',
  },
} as const;
