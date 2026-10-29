/** Read-only live data. Never persist this snapshot in the synthetic PreviewProvider. */
import type {ServerZone} from '../preview/model';

/** One persisted observation from the authorized report, with no catalog fallback. */
export interface DashboardReportResult {
  key: string;
  label: string;
  reportId: string;
  value: number | null;
  unit: string | null;
  zone: ServerZone | null;
  optimalLow: number | null;
  optimalHigh: number | null;
  collectionDate: string;
  reportedValue: string | null;
  reportedUnit: string | null;
}

export type DashboardReadStatus = 'unconfigured' | 'unauthenticated' | 'profile_missing' |
  'onboarding_required' | 'consent_required' | 'access_required' | 'no_ready_report' |
  'unavailable' | 'invalid_data';

export interface DashboardCoreSnapshot {
  source: 'backend';
  readOnly: true;
  profile: {
    firstName: string;
    current_ba: number | null;
    current_ba_method: string | null;
    current_ba_n_labs_averaged: number | null;
    current_ba_window_months: number | null;
    current_ba_n_markers_used: number | null;
    current_ba_computed_at: string | null;
  };
  report: {
    id: string;
    collectionDate: string;
    source: string | null;
    biologicalAge: number | null;
    biological_age_comprehensive: number | null;
    bio_age_method: string | null;
    bio_age_n_markers: number | null;
    bio_age_applied_spanish_calibration: string[] | null;
    longevityScore: number | null;
    longevity_grade: string | null;
    markerKeys: string[];
  };
  core: {
    biologicalAge: number | null;
    evaScore: number | null;
    longevityGrade: string | null;
    ageSource: 'profile' | 'report' | null;
    ageComputedAt: string | null;
  };
  /** Existing persisted narrative; no generation, fixture fallback, or HTML rendering. */
  summary: {reportId: string; collectionDate: string; en: string | null; es: string | null};
  reportResults: DashboardReportResult[];
  pending: Array<{id: string; collectionDate: string; status: 'pending_context'}>;
}

export type DashboardReadResult =
  | {status: 'ready'; snapshot: DashboardCoreSnapshot}
  | {status: DashboardReadStatus};

/** Minimal structural port implemented by the existing user-scoped Supabase client. */
export interface DashboardQueryResult {data: unknown; error: unknown}
export interface DashboardQuery extends PromiseLike<DashboardQueryResult> {
  select(columns: string): DashboardQuery;
  eq(column: string, value: string): DashboardQuery;
  order(column: string, options: {ascending: boolean}): DashboardQuery;
  limit(count: number): DashboardQuery;
  maybeSingle(): DashboardQuery;
}
export interface DashboardReadClient {
  auth: {getUser(): Promise<{data: {user: {id: string; is_anonymous?: boolean} | null}; error: unknown}>};
  from(table: string): DashboardQuery;
}
