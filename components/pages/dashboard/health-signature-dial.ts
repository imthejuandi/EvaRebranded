/** SVG geometry only. The domain readout helper remains the source of eligibility. */
export function scoreDialGeometry(score: number | null) {
  if (score === null || !Number.isFinite(score) || score < 1 || score > 100) return null;
  const angle = (score / 100 * Math.PI * 2) - Math.PI / 2;
  return {dasharray: `${score} 100`, x: 250 + Math.cos(angle) * 205, y: 250 + Math.sin(angle) * 205};
}

export const signatureTicks = Array.from({length: 100}, (_, index) => {
  const angle = (index * 3.6 - 90) * Math.PI / 180;
  const inner = index % 5 === 0 ? 232 : 234, outer = index % 5 === 0 ? 243 : 240;
  return {x1: 250 + Math.cos(angle) * inner, y1: 250 + Math.sin(angle) * inner, x2: 250 + Math.cos(angle) * outer, y2: 250 + Math.sin(angle) * outer};
});
