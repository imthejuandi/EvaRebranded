/** SVG geometry only. The domain readout helper remains the source of eligibility. */
export function scoreDialGeometry(score: number | null) {
  if (score === null || !Number.isFinite(score) || score < 1 || score > 100) return null;
  const angle = (score / 100 * Math.PI * 2) - Math.PI / 2;
  const x = 250 + Math.cos(angle) * 205, y = 250 + Math.sin(angle) * 205;
  // Explicit geometry keeps the score extent independent of non-scaling stroke widths.
  const path = score === 100
    ? 'M 250 45 A 205 205 0 1 1 250 455 A 205 205 0 1 1 250 45'
    : `M 250 45 A 205 205 0 ${score > 50 ? 1 : 0} 1 ${x} ${y}`;
  return {path, x, y};
}

export const signatureTicks = Array.from({length: 100}, (_, index) => {
  const angle = (index * 3.6 - 90) * Math.PI / 180;
  const inner = index % 5 === 0 ? 232 : 234, outer = index % 5 === 0 ? 243 : 240;
  return {x1: 250 + Math.cos(angle) * inner, y1: 250 + Math.sin(angle) * inner, x2: 250 + Math.cos(angle) * outer, y2: 250 + Math.sin(angle) * outer};
});
