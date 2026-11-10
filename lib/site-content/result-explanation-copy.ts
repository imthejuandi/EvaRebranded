export type ExplanationLevel = 'simple' | 'balanced' | 'advanced';
export const explanationLevels = ['simple', 'balanced', 'advanced'] as const;
export const RESULT_EXPLANATION_EVENT = 'eva:show-explanation';

export const resultExplanationCopy = {
  en: {
    headline: ['Your results.', 'Explained your way.'],
    intro: 'Choose a simple explanation or explore the clinical detail.',
    label: 'Explanation level',
    levels: {simple: 'Essential', balanced: 'With context', advanced: 'In detail'},
    benefits: {simple: 'Plain language', balanced: 'What affects it', advanced: 'The science'},
    hint: 'Try Essential.',
    reassurance: 'The result stays the same. You choose the detail.',
    unavailable: 'An explanation for this example is not available yet.',
    previewTitle: ['Understand the essentials.', 'Explore the detail.'],
    previewBody: 'These short explanations are a starting point. In your results, you choose how much detail to see.',
    previewAction: 'Try the explanation levels',
  },
  es: {
    headline: ['Tus resultados.', 'Explicados a tu manera.'],
    intro: 'Elige una explicación sencilla o explora el detalle clínico.',
    label: 'Nivel de explicación',
    levels: {simple: 'Esencial', balanced: 'Con contexto', advanced: 'En detalle'},
    benefits: {simple: 'Lenguaje claro', balanced: 'Qué influye', advanced: 'La ciencia'},
    hint: 'Prueba Esencial.',
    reassurance: 'El resultado se mantiene. Tú eliges el detalle.',
    unavailable: 'La explicación de este ejemplo aún no está disponible.',
    previewTitle: ['Entiende lo esencial.', 'Explora el detalle.'],
    previewBody: 'Estas explicaciones breves son el punto de partida. En tus resultados, tú eliges cuánto detalle ver.',
    previewAction: 'Prueba los niveles de explicación',
  },
} as const;
