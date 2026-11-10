export type ExplanationLevel = 'simple' | 'balanced' | 'advanced';
export const explanationLevels = ['simple', 'balanced', 'advanced'] as const;
export const RESULT_EXPLANATION_EVENT = 'eva:show-explanation';

export const resultExplanationCopy = {
  en: {
    headline: ['Your results.', 'Explained your way.'],
    intro: 'Your results and context, explained at the level that works for you.',
    label: 'Explanation level',
    levels: {simple: 'Beginner', balanced: 'Intermediate', advanced: 'Advanced'},
    benefits: {simple: 'Plain language', balanced: 'More explanation', advanced: 'Clinical detail'},
    hint: 'Try Beginner.',
    reassurance: 'The result stays the same. You choose the detail.',
    unavailable: 'An explanation for this example is not available yet.',
    previewTitle: ['The same context.', 'Your level of detail.'],
    previewBody: 'Your history and blood-draw notes stay in view. Switch between Beginner, Intermediate and Advanced to find your level.',
    previewAction: 'Try the explanation levels',
  },
  es: {
    headline: ['Tus resultados.', 'Explicados a tu manera.'],
    intro: 'Tus resultados y tu contexto, explicados al nivel que prefieras.',
    label: 'Nivel de explicación',
    levels: {simple: 'Principiante', balanced: 'Intermedio', advanced: 'Avanzado'},
    benefits: {simple: 'Lenguaje claro', balanced: 'Más explicación', advanced: 'Detalle clínico'},
    hint: 'Prueba Principiante.',
    reassurance: 'El resultado se mantiene. Tú eliges el detalle.',
    unavailable: 'La explicación de este ejemplo aún no está disponible.',
    previewTitle: ['El mismo contexto.', 'Tu nivel de detalle.'],
    previewBody: 'Tu historial y los datos de la extracción siguen a la vista. Cambia entre Principiante, Intermedio y Avanzado para encontrar tu nivel.',
    previewAction: 'Prueba los niveles de explicación',
  },
} as const;
