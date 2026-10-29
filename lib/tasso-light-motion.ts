const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => {const t = clamp(value); return t * t * (3 - 2 * t);};
const mix = (from: number, to: number, value: number) => from + (to - from) * smooth(value);

export type LightDashboardLandmarks = {signature: number; apob: number; hscrp: number; closed: number};
const fallbackLandmarks: LightDashboardLandmarks = {signature: 12, apob: 56, hscrp: 124, closed: 184};

/** A filmed interface is allowed to rest at its real captured interaction states. */
export function lightDashboardFrame(p: number, last: number, landmarks = fallbackLandmarks) {
  const initial = landmarks.signature;
  if (p < .70) return Math.round(mix(0, initial, (p - .61) / .09));
  if (p < .74) return Math.round(mix(initial, landmarks.apob, (p - .70) / .04));
  if (p < .80) return landmarks.apob;
  if (p < .84) return Math.round(mix(landmarks.apob, landmarks.hscrp, (p - .80) / .04));
  if (p < .90) return landmarks.hscrp;
  if (p < .94) return Math.round(mix(landmarks.hscrp, landmarks.closed, (p - .90) / .04));
  return Math.round(mix(landmarks.closed, last, (p - .94) / .02));
}

function paperPass(p: number, start: number, coverStart: number, coverEnd: number, end: number) {
  if (p < start || p > end) return {visible: false, x: 1.3, y: 1.3, size: .18, covered: false};
  if (p < coverStart) {const t = smooth((p - start) / (coverStart - start)); return {visible: true, x: 1.3 - .8 * t, y: 1.3 - .8 * t, size: .18 + 1.32 * t, covered: false};}
  if (p <= coverEnd) return {visible: true, x: .5, y: .5, size: 1.5, covered: true};
  const t = smooth((p - coverEnd) / (end - coverEnd));
  return {visible: true, x: .5 - 1.3 * t, y: .5 - 1.3 * t, size: 1.5 - 1.32 * t, covered: false};
}

/** One source at alpha 1; edits happen only inside an opaque-paper coverage hold. */
export function lightCinematicPose(value: number) {
  const p = clamp(value), scene = p < .293 ? 0 : p < .566 ? 1 : 2;
  let scale = 1;
  if (scene === 0) scale = p < .22 ? mix(1, 1.04, p / .22) : mix(1.04, 1.65, (p - .22) / .062);
  else if (scene === 1) scale = p < .34 ? 1.5 : p < .39 ? mix(1.5, 1, (p - .34) / .05) : p < .50 ? mix(1, 1.025, (p - .39) / .11) : mix(1.025, 1.65, (p - .50) / .054);
  else scale = p < .61 ? 1.12 : mix(1.12, 1, (p - .61) / .09);
  const paper = p < .44 ? paperPass(p, .22, .282, .304, .34) : paperPass(p, .50, .554, .578, .61);
  const detail = smooth((p - .72) / .02) * (1 - smooth((p - .90) / .04));
  return {p, scene, scale, paper, detail, frames: [clamp(p / .22), clamp((p - .39) / .11)], uiState: p < .74 ? 'signature' : p < .80 ? 'apob' : p < .84 ? 'selection' : p < .90 ? 'hscrp' : p < .94 ? 'closing' : 'overview'};
}

/** Exact rotated surface test, not its axis-aligned bounding box. */
export function lightPaperCovers(width: number, height: number, x: number, y: number, size: number, margin = .05, inset = {left: 0, top: 0, right: 0, bottom: 0}) {
  const angle = 22 * Math.PI / 180, cos = Math.cos(angle), sin = Math.sin(angle);
  return [[-width * margin, -height * margin], [width * (1 + margin), -height * margin], [width * (1 + margin), height * (1 + margin)], [-width * margin, height * (1 + margin)]].every(([px, py]) => {
    const dx = px - x, dy = py - y;
    const localX = dx * cos - dy * sin + size / 2, localY = dx * sin + dy * cos + size / 2;
    return localX >= size * inset.left && localX <= size * (1 - inset.right) && localY >= size * inset.top && localY <= size * (1 - inset.bottom);
  });
}
