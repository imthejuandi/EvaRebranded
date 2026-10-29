import type {Profile, Report} from '../../../lib/preview/model';
import {canReadReport} from '../../../lib/preview/policy';

const clamp = (value: number) => Math.min(1, Math.max(0, Number.isFinite(value) ? value : 0));

/** The sculpture opens with scroll; it is an illustration, never a clinical scale. */
export function signaturePose(progress: number, reduced = false) {
  const p = reduced ? 0 : clamp(progress);
  const opening = p * p * (3 - 2 * p);
  return {progress: p, opening, tilt: -.23 + opening * .3, spread: .12 + opening * .88, depth: 1 - opening * .48};
}

/** A point on one of three continuous, folded ribbons, in a unit viewport. */
export function signaturePoint(u: number, v: number, band: number, phase: number, progress: number) {
  const {opening, tilt, spread, depth} = signaturePose(progress);
  const wave = u * Math.PI * 1.48 + band * .44 + phase * .22;
  const twist = u * Math.PI * 1.68 - band * .48 + phase * .12;
  const breadth = .125 * (1 - .16 * Math.abs(u));
  const x = u * (.4 + opening * .025);
  const y = Math.sin(wave) * (.13 - opening * .052) + v * Math.cos(twist) * breadth + (band - 1) * .135 * spread;
  const z = (Math.cos(wave) * .12 + v * Math.sin(twist) * breadth) * depth;
  const perspective = 1 / (1.17 - z);
  return {
    x: .5 + (x * Math.cos(tilt) - y * Math.sin(tilt)) * perspective,
    y: .54 + (x * Math.sin(tilt) + y * Math.cos(tilt)) * perspective,
    z,
    light: clamp(.48 + z * 1.7 + .18 * Math.sin(twist + v)),
  };
}

export type SignatureReport = Pick<Report, 'id' | 'date' | 'status' | 'markerKeys' | 'contextComplete' | 'biologicalAge' | 'longevityScore' | 'longevity_grade'>;

/** Preserve the original profile-first age while keeping both estimates behind the same read gates. */
export function signatureReadouts(report: SignatureReport, paid: boolean, profile: Pick<Profile, 'healthConsent' | 'current_ba' | 'current_ba_computed_at'>) {
  const readable = canReadReport(report, profile.healthConsent);
  const allowed = readable && paid;
  // The processing pipeline can persist 0 when KDM succeeds but score coverage fails.
  const score = allowed && typeof report.longevityScore === 'number' && Number.isFinite(report.longevityScore) && report.longevityScore >= 1 && report.longevityScore <= 100 ? report.longevityScore : null;
  const validAge = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value > 0;
  const ageSource = !allowed ? null : validAge(profile.current_ba) ? 'profile' : validAge(report.biologicalAge) ? 'report' : null;
  const age = ageSource === 'profile' ? profile.current_ba! : ageSource === 'report' ? report.biologicalAge! : null;
  const ageComputedAt = ageSource === 'profile' && profile.current_ba_computed_at && Number.isFinite(Date.parse(profile.current_ba_computed_at)) ? profile.current_ba_computed_at : null;
  const grade = score !== null && typeof report.longevity_grade === 'string' ? report.longevity_grade.trim() || null : null;
  return {score, grade, age, ageSource, ageComputedAt, readable, allowed};
}
