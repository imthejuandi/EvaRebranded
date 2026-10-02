import type {Profile, Report} from '../preview/model';
import type {DashboardCoreSnapshot, DashboardReportResult} from './backend-contract';

/** Only the data read by the metric component; unknown report source stays unknown. */
export type DashboardMetricReport = Pick<Report, 'id' | 'date' | 'status' | 'contextComplete' |
  'markerKeys' | 'biologicalAge' | 'longevityScore' | 'longevity_grade'>;
export type DashboardMetricProfile = Pick<Profile, 'healthConsent' | 'current_ba' | 'current_ba_method' |
  'current_ba_n_labs_averaged' | 'current_ba_window_months' | 'current_ba_n_markers_used' | 'current_ba_computed_at'>;

/** Use only after status === ready from the authenticated server reader; never merge into PreviewState. */
export function dashboardMetricReadout(snapshot: DashboardCoreSnapshot): {
  report: DashboardMetricReport; profile: DashboardMetricProfile; paid: true; reportResults: readonly DashboardReportResult[];
} {
  const method = snapshot.profile.current_ba_method;
  return {
    paid: true,
    reportResults: snapshot.reportResults,
    report: {
      id: snapshot.report.id, date: snapshot.report.collectionDate, status: 'ready', contextComplete: true,
      markerKeys: snapshot.report.markerKeys, biologicalAge: snapshot.report.biologicalAge,
      longevityScore: snapshot.report.longevityScore, longevity_grade: snapshot.report.longevity_grade,
    },
    profile: {
      healthConsent: true, current_ba: snapshot.profile.current_ba,
      current_ba_method: method === 'Reference' || method === 'Comprehensive' ? method : null,
      current_ba_n_labs_averaged: snapshot.profile.current_ba_n_labs_averaged,
      current_ba_window_months: snapshot.profile.current_ba_window_months,
      current_ba_n_markers_used: snapshot.profile.current_ba_n_markers_used,
      current_ba_computed_at: snapshot.profile.current_ba_computed_at,
    },
  };
}
