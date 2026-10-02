import type {Locale, ServerZone} from '../../../../lib/preview/model';
import type {DashboardMarker} from '../dashboard-reading';
import type {DashboardReportResult} from '../../../../lib/dashboard/backend-contract';

export type StatusDirection = 'optimal' | 'above' | 'below' | 'unknown';
export type OrbMarker = Pick<DashboardMarker, 'key' | 'name' | 'zone'> & {
  value: number | null; unit: string | null; category: string | null;
  optimalLow?: number | null; optimalHigh?: number | null;
  reportedValue?: string | null; reportedUnit?: string | null;
};
const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const validDate = (value: unknown): value is string => typeof value === 'string'
  && /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(Date.parse(value))
  && new Date(value).toISOString().slice(0, 10) === value;

/** Accept a real date or timestamp, preserving the recorded reference calendar date. */
export function referenceCalendarDate(value: string | null | undefined): string | null {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}(?:$|T)/.test(value)
    || !Number.isFinite(Date.parse(value))) return null;
  const date = value.slice(0, 10);
  return validDate(date) ? date : null;
}

/** Completed years at the estimate date; a birth year alone is never a birthday. */
export function chronologicalAgeAt(birthDate: string | null | undefined, referenceDate: string | null): number | null {
  if (!validDate(birthDate) || !validDate(referenceDate) || birthDate > referenceDate) return null;
  const [birthYear, birthMonth, birthDay] = birthDate.split('-').map(Number);
  const [year, month, day] = referenceDate.split('-').map(Number);
  return year - birthYear - Number(month < birthMonth || (month === birthMonth && day < birthDay));
}

/** This comparison describes the displayed estimate, never a prognosis. */
export function compareAges(biologicalAge: number | null, chronologicalAge: number | null) {
  if (!finite(biologicalAge) || biologicalAge <= 0 || !finite(chronologicalAge)
    || !Number.isInteger(chronologicalAge) || chronologicalAge < 0) return null;
  const difference = (Math.round(biologicalAge * 10) - chronologicalAge * 10) / 10;
  if (!Number.isFinite(difference)) return null;
  return {chronologicalAge, difference,
    direction: difference < 0 ? 'younger' as const : difference > 0 ? 'older' as const : 'same' as const};
}

export function ageComparisonLabel(comparison: NonNullable<ReturnType<typeof compareAges>>, locale: Locale): string {
  if (comparison.direction === 'same') return locale === 'es' ? 'Igual a tu edad' : 'Same as your age';
  const amount = Math.abs(comparison.difference);
  const value = new Intl.NumberFormat(locale, {maximumFractionDigits: 1}).format(amount);
  return locale === 'es'
    ? `${value} ${amount === 1 ? 'año' : 'años'} ${comparison.direction === 'younger' ? 'menos' : 'más'}`
    : `${value} ${amount === 1 ? 'year' : 'years'} ${comparison.direction === 'younger' ? 'lower' : 'higher'}`;
}

export function statusDirection(zone: ServerZone): StatusDirection {
  switch (zone) {
    case 'optimal': return 'optimal';
    case 'above_optimal': case 'critical_high': return 'above';
    case 'below_optimal': case 'critical_low': return 'below';
    default: return 'unknown';
  }
}

/** Report membership only: this does not establish calculation inputs or weights. */
export function reportOrbMarkers(markers: readonly DashboardMarker[], markerKeys: readonly string[], readable: boolean): OrbMarker[] {
  if (!readable) return [];
  const keys = new Set(markerKeys), seen = new Set<string>();
  const zones = new Set<ServerZone>(['critical_low', 'below_optimal', 'optimal', 'above_optimal', 'critical_high', 'unclassified']);
  return markers.flatMap(marker => {
    if (!keys.has(marker.key) || !marker.key.trim() || seen.has(marker.key)) return [];
    seen.add(marker.key);
    const value = finite(marker.value) ? marker.value : null;
    const zone = value !== null && marker.unit.trim() && zones.has(marker.zone) ? marker.zone : 'unclassified';
    return [{key: marker.key, name: marker.name, category: marker.category, value, unit: marker.unit, zone,
      optimalLow: marker.rangeComparable && finite(marker.range[0]) ? marker.range[0] : null,
      optimalHigh: marker.rangeComparable && finite(marker.range[1]) ? marker.range[1] : null}];
  });
}

/** Live result rows retain their report identity and nullable source fields. */
export function backendReportOrbMarkers(rows: readonly DashboardReportResult[], reportId: string, readable: boolean): OrbMarker[] {
  if (!readable) return [];
  const seen = new Set<string>();
  const zones = new Set<ServerZone>(['critical_low', 'below_optimal', 'optimal', 'above_optimal', 'critical_high', 'unclassified']);
  return rows.flatMap(row => {
    if (row.reportId !== reportId || !row.key.trim() || seen.has(row.key)) return [];
    seen.add(row.key);
    const value = finite(row.value) ? row.value : null;
    const zone = value !== null && row.unit?.trim() && row.zone && zones.has(row.zone) ? row.zone : 'unclassified';
    return [{key: row.key, name: row.label, category: null, value, unit: row.unit, zone,
      optimalLow: finite(row.optimalLow) ? row.optimalLow : null, optimalHigh: finite(row.optimalHigh) ? row.optimalHigh : null,
      reportedValue: row.reportedValue, reportedUnit: row.reportedUnit}];
  });
}
