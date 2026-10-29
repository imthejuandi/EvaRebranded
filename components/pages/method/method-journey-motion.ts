/** Shared deterministic timeline for the scroll composition and its static chapters. */
export const METHOD_FRAMES = 361;
export const METHOD_CHAPTER_FRAMES = [0, 120, 240, 360] as const;
export function methodTween(frame: number, stops: readonly number[], values: readonly number[]) {
  if (frame <= stops[0]) return values[0];
  if (frame >= stops[stops.length - 1]) return values[values.length - 1];
  const index = stops.findIndex((stop, i) => i > 0 && frame <= stop);
  const t = (frame - stops[index - 1]) / (stops[index] - stops[index - 1]);
  const smooth = t * t * (3 - 2 * t);
  return values[index - 1] + (values[index] - values[index - 1]) * smooth;
}
export function methodSceneState(frame: number) {
  const f = Math.max(0, Math.min(METHOD_FRAMES - 1, frame));
  return {
    morning: methodTween(f, [0, 42, 66], [1, 1, 0]),
    sample: methodTween(f, [30, 62, 147, 176], [0, 1, 1, 0]),
    lab: methodTween(f, [145, 172, 265, 301], [0, 1, 1, 0]),
    result: methodTween(f, [266, 294, 360], [0, 1, 1]),
    progress: f / (METHOD_FRAMES - 1),
  };
}
