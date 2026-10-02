import {statusDirection, type OrbMarker, type StatusDirection} from './orb-model';

export const DOT_PALETTE = {optimal: '#9cae8e', above: '#b47659', below: '#9680a7', unknown: '#8c958e'} as const;
export const DOT_LIMITS = {mobile: 1500, desktop: 2300} as const;
export const DOT_BASELINE_RADIUS = .395;
export interface RingPoint {
  id: string; key: string; x: number; y: number; radius: number; alpha: number;
  color: string; baselineX: number; baselineY: number; direction: StatusDirection;
}
const TAU = Math.PI * 2;
const polar = (angle: number, radius: number) => ({x: .5 + Math.cos(angle) * radius, y: .5 + Math.sin(angle) * radius});

/** Approved B halftone. Source status chooses a fixed shape; values and units never set displacement. */
export function reportRingGeometry(markers: readonly OrbMarker[], mobile = false) {
  const points: RingPoint[] = [], anchors: {key: string; x: number; y: number; targetX: number; targetY: number}[] = [];
  if (!markers.length) return {points, anchors};
  const limit = mobile ? DOT_LIMITS.mobile : DOT_LIMITS.desktop;
  const ringRows = mobile ? 6 : 8;
  const columns = Math.max(1, Math.floor(limit / (markers.length * ringRows)));
  const sector = TAU / markers.length, gap = Math.min(.016, sector * .13);
  markers.forEach((marker, position) => {
    const middle = -Math.PI / 2 + position * sector;
    const direction = statusDirection(marker.zone), amount = direction === 'above' ? 1 : direction === 'below' ? -1 : 0;
    const target = polar(middle, DOT_BASELINE_RADIUS + amount * .032);
    anchors.push({key: marker.key, ...polar(middle, .41), targetX: target.x, targetY: target.y});
    let id = 0;
    for (let ring = 0; ring < ringRows; ring++) {
      const baselineRadius = DOT_BASELINE_RADIUS - .030 + ring / (ringRows - 1) * .060;
      for (let column = 0; column < columns && points.length < limit; column++) {
        const fraction = (column + .5) / columns;
        const theta = middle + (fraction - .5) * (sector - gap);
        const crest = Math.pow(Math.sin(fraction * Math.PI), 2);
        let radial = baselineRadius + amount * .041 * crest;
        const wave = .5 + .5 * Math.sin(theta * 3 + ring * .53);
        const radius = (mobile ? .00165 : .00135) + .0014 * wave;
        let alpha = .49 + .39 * wave;
        if (direction === 'unknown') {
          radial += (ring % 2 ? 1 : -1) * .005;
          if (Math.floor(column / 2) % 3 === 1) alpha = 0;
        }
        const bounded = Math.max(.30 + radius, Math.min(.47 - radius, radial));
        const baseline = polar(theta, Math.max(.30 + radius, Math.min(.47 - radius, baselineRadius)));
        points.push({id: `${marker.key}:${id++}`, key: marker.key, ...polar(theta, bounded), radius, alpha,
          color: DOT_PALETTE[direction], baselineX: baseline.x, baselineY: baseline.y, direction});
      }
    }
  });
  return {points, anchors};
}

/** Polar interpolation keeps every transition outside the glass lens. */
export function interpolateDotPosition(from: Pick<RingPoint, 'x' | 'y'>, to: Pick<RingPoint, 'x' | 'y'>, progress: number) {
  const t = Math.max(0, Math.min(1, progress));
  const start = Math.atan2(from.y - .5, from.x - .5), end = Math.atan2(to.y - .5, to.x - .5);
  const delta = ((end - start + Math.PI * 3) % TAU) - Math.PI;
  const r0 = Math.hypot(from.x - .5, from.y - .5), r1 = Math.hypot(to.x - .5, to.y - .5);
  return polar(start + delta * t, Math.max(.30, Math.min(.47, r0 + (r1 - r0) * t)));
}
