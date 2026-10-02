import 'server-only';
import type {DashboardCoreSnapshot, DashboardReadClient, DashboardReadResult, DashboardReportResult} from './backend-contract';

type Row = Record<string, unknown>;
const row = (value: unknown): Row | null => value !== null && typeof value === 'object' && !Array.isArray(value) ? value as Row : null;
const text = (value: unknown): string | null => typeof value === 'string' && value.trim() ? value : null;
const finite = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value);
const nullableNumber = (value: unknown): number | null => finite(value) ? value : null;
const sourceZone = (value: unknown): DashboardReportResult['zone'] => typeof value === 'string' &&
  ['critical_low','below_optimal','optimal','above_optimal','critical_high','unclassified'].includes(value)
  ? value as NonNullable<DashboardReportResult['zone']> : null;
const reportedValue = (value: unknown): string | null => finite(value) ? String(value) : text(value);
const age = (value: unknown): number | null => finite(value) && value > 0 ? value : null;
const score = (value: unknown): number | null => finite(value) && value >= 1 && value <= 100 ? value : null;
const count = (value: unknown): number | null => finite(value) && Number.isInteger(value) && value >= 0 ? value : null;
const timestamp = (value: unknown): string | null => typeof value === 'string' && /^\d{4}-\d\d-\d\dT/.test(value) && Number.isFinite(Date.parse(value)) ? value : null;
const stringList = (value: unknown): string[] | null => Array.isArray(value) && value.every(item => typeof item === 'string') ? value : null;
const uuid = (value: unknown): value is string => typeof value === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
const collectionDate = (value: unknown): value is string => typeof value === 'string' && /^\d{4}-\d\d-\d\d$/.test(value) && Number.isFinite(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;

export const DASHBOARD_AUTH_COLUMNS = 'id,first_name,onboarding_completed,privacy_accepted_at,subscription_status,subscription_period_end,full_panel_purchased_at';
export const DASHBOARD_AGE_COLUMNS = 'id,current_ba,current_ba_method,current_ba_n_labs_averaged,current_ba_window_months,current_ba_n_markers_used,current_ba_computed_at';
export const DASHBOARD_REPORT_COLUMNS = 'id,user_id,source,collection_date,status,biological_age,biological_age_comprehensive,bio_age_method,bio_age_n_markers,bio_age_applied_spanish_calibration,longevity_score,longevity_grade,summary_narrative,summary_narrative_es';
export const DASHBOARD_RESULT_COLUMNS = 'lab_result_id,biomarker_key,biomarker_name,value,unit,zone,optimal_low,optimal_high,reported_value,reported_unit';

/** Mirrors the source's full-panel purchase / active subscription + three-day grace rule.
 * A malformed date fails closed; a source-supported legacy null period remains unbounded. */
export function dashboardPaidAccess(profile: Row, now = Date.now()): boolean {
  if (timestamp(profile.full_panel_purchased_at)) return true;
  if (profile.subscription_status !== 'active') return false;
  if (profile.subscription_period_end === null) return true;
  const end = timestamp(profile.subscription_period_end);
  return end !== null && Date.parse(end) + 3 * 24 * 60 * 60 * 1000 > now;
}

/** No caller-supplied user ID, admin client, endpoint, fixture fallback, or persistence. */
export async function readDashboardCore(client: DashboardReadClient, now = Date.now()): Promise<DashboardReadResult> {
  try {
    const identity = await client.auth.getUser();
    const user = identity.data?.user;
    if (identity.error || !user || user.is_anonymous || !uuid(user.id)) return {status: 'unauthenticated'};

    // Fetch authorization fields before any biological age, score or narrative.
    const authorization = await client.from('profiles').select(DASHBOARD_AUTH_COLUMNS).eq('id', user.id).maybeSingle();
    if (authorization.error) return {status: 'unavailable'};
    const profile = row(authorization.data);
    if (!profile) return {status: 'profile_missing'};
    if (profile.id !== user.id) return {status: 'invalid_data'};
    if (profile.onboarding_completed !== true) return {status: 'onboarding_required'};
    // This is the existing source record, not user-editable JWT metadata or demo consent.
    if (!timestamp(profile.privacy_accepted_at)) return {status: 'consent_required'};
    if (!dashboardPaidAccess(profile, now)) return {status: 'access_required'};

    const latest = await client.from('lab_results').select(DASHBOARD_REPORT_COLUMNS)
      .eq('user_id', user.id).eq('status', 'ready')
      .order('collection_date', {ascending: false}).order('created_at', {ascending: false}).limit(1).maybeSingle();
    if (latest.error) return {status: 'unavailable'};
    const lab = row(latest.data);
    if (!lab) return {status: 'no_ready_report'};
    if (lab.user_id !== user.id || lab.status !== 'ready' || !uuid(lab.id) || !collectionDate(lab.collection_date)) return {status: 'invalid_data'};

    const [rolling, markerResult, pendingResult] = await Promise.all([
      client.from('profiles').select(DASHBOARD_AGE_COLUMNS).eq('id', user.id).maybeSingle(),
      client.from('biomarker_values').select(DASHBOARD_RESULT_COLUMNS).eq('lab_result_id', lab.id),
      client.from('lab_results').select('id,user_id,collection_date,status').eq('user_id', user.id)
        .eq('status', 'pending_context').order('created_at', {ascending: false}),
    ]);
    if (rolling.error || markerResult.error || pendingResult.error) return {status: 'unavailable'};
    const rollingProfile = row(rolling.data);
    // A profile removed during the read must not leave an authenticated-looking snapshot.
    if (!rollingProfile) return {status: 'profile_missing'};
    if (rollingProfile.id !== user.id || !Array.isArray(markerResult.data) || !Array.isArray(pendingResult.data)) return {status: 'invalid_data'};
    const markers = markerResult.data.map(row);
    if (!markers.length || markers.some(marker => !marker || marker.lab_result_id !== lab.id || !text(marker.biomarker_key))) return {status: 'invalid_data'};
    // There is no revision selector for duplicate keys: never choose an arbitrary observation.
    if (new Set(markers.map(marker => marker!.biomarker_key)).size !== markers.length) return {status: 'invalid_data'};
    const pendingRows = pendingResult.data.map(row);
    if (pendingRows.some(item => !item || item.user_id !== user.id || !uuid(item.id) || !collectionDate(item.collection_date) || item.status !== 'pending_context')) return {status: 'invalid_data'};

    const currentAge = age(rollingProfile.current_ba), reportAge = age(lab.biological_age), evaScore = score(lab.longevity_score);
    const ageSource = currentAge !== null ? 'profile' : reportAge !== null ? 'report' : null;
    const grade = evaScore === null ? null : text(lab.longevity_grade);
    const computedAt = timestamp(rollingProfile.current_ba_computed_at);
    const snapshot: DashboardCoreSnapshot = {
      source: 'backend', readOnly: true,
      profile: {
        firstName: text(profile.first_name) ?? '', current_ba: currentAge,
        current_ba_method: text(rollingProfile.current_ba_method),
        current_ba_n_labs_averaged: count(rollingProfile.current_ba_n_labs_averaged),
        current_ba_window_months: count(rollingProfile.current_ba_window_months),
        current_ba_n_markers_used: count(rollingProfile.current_ba_n_markers_used),
        current_ba_computed_at: computedAt,
      },
      report: {
        id: lab.id, collectionDate: lab.collection_date, source: text(lab.source),
        biologicalAge: reportAge, biological_age_comprehensive: age(lab.biological_age_comprehensive),
        bio_age_method: text(lab.bio_age_method), bio_age_n_markers: count(lab.bio_age_n_markers),
        bio_age_applied_spanish_calibration: stringList(lab.bio_age_applied_spanish_calibration),
        longevityScore: evaScore, longevity_grade: grade,
        markerKeys: [...new Set(markers.map(marker => marker!.biomarker_key as string))],
      },
      core: {biologicalAge: currentAge ?? reportAge, evaScore, longevityGrade: grade, ageSource, ageComputedAt: ageSource === 'profile' ? computedAt : null},
      summary: {reportId: lab.id, collectionDate: lab.collection_date, en: text(lab.summary_narrative), es: text(lab.summary_narrative_es)},
      reportResults: markers.map(marker => ({
        key: marker!.biomarker_key as string,
        label: text(marker!.biomarker_name) ?? marker!.biomarker_key as string,
        reportId: lab.id as string, collectionDate: lab.collection_date as string,
        value: nullableNumber(marker!.value), unit: text(marker!.unit), zone: sourceZone(marker!.zone),
        optimalLow: nullableNumber(marker!.optimal_low), optimalHigh: nullableNumber(marker!.optimal_high),
        // Original lab text has a separate scale; it never replaces the canonical unit/bounds.
        reportedValue: reportedValue(marker!.reported_value), reportedUnit: text(marker!.reported_unit),
      })),
      pending: pendingRows.map(item => ({id: item!.id as string, collectionDate: item!.collection_date as string, status: 'pending_context'})),
    };
    return {status: 'ready', snapshot};
  } catch {
    // Never surface database errors, response payloads, tokens or patient text in logs/errors.
    return {status: 'unavailable'};
  }
}
