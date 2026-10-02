/** Pure proposal mapping. No fetch, authorization, medical classification or unit conversion. */
export type SourceZone = 'critical_low' | 'below_optimal' | 'optimal' | 'above_optimal' | 'critical_high' | 'unclassified';
export type ResultLocale = 'es' | 'en';

/** value/unit and optimal bounds MUST come from the same authorized biomarker_values row.
 * Bounds use that row's canonical unit; reported* is separate, original-lab display text.
 * A future gateway must preserve any bounded-result qualifier before enabling live shapes.
 */
export interface MarkerResult {
  readonly key: string;
  readonly label: string;
  readonly reportId: string;
  readonly value: number | null;
  readonly unit: string | null;
  readonly zone: SourceZone | null;
  readonly optimalLow: number | null;
  readonly optimalHigh: number | null;
  readonly collectionDate: string | null;
  readonly reportedValue?: string | null;
  readonly reportedUnit?: string | null;
}

export interface ResultSignal {
  readonly direction: 'high' | 'low' | 'optimal' | 'unknown';
  readonly displacement: -1 | 0 | 1;
  readonly labelEs: string;
  readonly labelEn: string;
  readonly comparable: boolean;
}

const labels: Readonly<Record<SourceZone, { readonly labelEs: string; readonly labelEn: string }>> = {
  critical_low: {labelEs: 'Crítico bajo', labelEn: 'Critical low'},
  below_optimal: {labelEs: 'Por debajo del óptimo', labelEn: 'Below optimal'},
  optimal: {labelEs: 'Óptimo', labelEn: 'Optimal'},
  above_optimal: {labelEs: 'Por encima del óptimo', labelEn: 'Above optimal'},
  critical_high: {labelEs: 'Crítico alto', labelEn: 'Critical high'},
  unclassified: {labelEs: 'Sin clasificar', labelEn: 'Unclassified'},
};

export function sourceZoneLabels(zone: SourceZone | null | undefined) {
  return zone && Object.hasOwn(labels, zone) ? {...labels[zone]} : {...labels.unclassified};
}

const isFiniteNumber = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const hasUnit = (value: unknown): value is string => typeof value === 'string' && value.trim().length > 0;

function hasValidRange(result: MarkerResult): boolean {
  const {optimalLow: low, optimalHigh: high} = result;
  return (low === null || isFiniteNumber(low)) && (high === null || isFiniteNumber(high))
    && (low !== null || high !== null) && (low === null || high === null || low <= high);
}

function hasInexactReportedValue(result: MarkerResult): boolean {
  if (result.reportedValue == null || result.reportedValue.trim() === '') return false;
  // Do not turn <, >, ≤, ≥, qualitative text or an ambiguous formatted bound into an exact reading.
  return !/^[+-]?(?:\d+(?:[.,]\d*)?|[.,]\d+)(?:e[+-]?\d+)?$/i.test(result.reportedValue.trim());
}

function unknownSignal(): ResultSignal {
  return {direction: 'unknown', displacement: 0, labelEs: 'Sin clasificación comparable', labelEn: 'No comparable classification', comparable: false};
}

/** Fixed direction comes ONLY from the persisted zone. Range checks can reject a conflict,
 * never assign a new classification. Displacement is not magnitude, urgency or an average.
 */
export function deriveResultSignal(result: MarkerResult | undefined, expectedReportId: string): ResultSignal {
  if (!result || !expectedReportId.trim() || result.reportId !== expectedReportId
    || !result.key.trim() || !isFiniteNumber(result.value) || !hasUnit(result.unit)
    || !hasValidRange(result) || hasInexactReportedValue(result)) return unknownSignal();

  const {value, optimalLow: low, optimalHigh: high, zone} = result;
  if (zone === 'below_optimal' || zone === 'critical_low') {
    if (low === null || value >= low) return unknownSignal();
    return {direction: 'low', displacement: -1, ...sourceZoneLabels(zone), comparable: true};
  }
  if (zone === 'above_optimal' || zone === 'critical_high') {
    if (high === null || value <= high) return unknownSignal();
    return {direction: 'high', displacement: 1, ...sourceZoneLabels(zone), comparable: true};
  }
  if (zone === 'optimal') {
    if ((low !== null && value < low) || (high !== null && value > high)) return unknownSignal();
    return {direction: 'optimal', displacement: 0, ...sourceZoneLabels(zone), comparable: true};
  }
  return unknownSignal();
}

/** Preserve the stored number's precision and zero; do not re-round a laboratory value. */
export function formatResultNumber(value: number | null | undefined, locale: ResultLocale = 'es'): string {
  return isFiniteNumber(value)
    ? new Intl.NumberFormat(locale === 'es' ? 'es-ES' : 'en-GB', {useGrouping: false, maximumSignificantDigits: 21}).format(value)
    : '—';
}

export function formatResultValue(result: MarkerResult | undefined, locale: ResultLocale = 'es'): string {
  if (!result || !isFiniteNumber(result.value)) return '—';
  const number = formatResultNumber(result.value, locale);
  return hasUnit(result.unit) ? `${number}\u00a0${result.unit.trim()}` : number;
}

export function formatOptimalRange(result: MarkerResult | undefined, locale: ResultLocale = 'es'): string {
  if (!result || !hasUnit(result.unit) || !hasValidRange(result))
    return locale === 'es' ? 'Intervalo no disponible' : 'Range unavailable';
  const {optimalLow: low, optimalHigh: high} = result;
  const range = low === null ? `≤ ${formatResultNumber(high, locale)}`
    : high === null ? `≥ ${formatResultNumber(low, locale)}`
    : `${formatResultNumber(low, locale)}–${formatResultNumber(high, locale)}`;
  return `${range}\u00a0${result.unit.trim()}`;
}

/** Original text stays verbatim, including a qualifier. It never replaces canonical range units. */
export function formatReportedResult(result: MarkerResult | undefined, _locale: ResultLocale = 'es'): string {
  if (!result || result.reportedValue == null || !result.reportedValue.trim()) return '—';
  return hasUnit(result.reportedUnit) ? `${result.reportedValue}\u00a0${result.reportedUnit.trim()}` : result.reportedValue;
}
