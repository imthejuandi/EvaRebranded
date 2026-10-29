import type {Report} from '../../../lib/preview/model';
import type {DashboardReportResult} from '../../../lib/dashboard/backend-contract';
import type {DashboardMarker} from './dashboard-reading';
import {reportActionables} from './actionables/report-actionables';

/** Same rows as Campo. The catalog can supply names, never replace report values. */
export function previewReportResults(report: Report, markers: readonly DashboardMarker[]): DashboardReportResult[] {
  const labels = Object.fromEntries(markers.map(marker => [marker.key, marker.name]));
  return Object.values(reportActionables(report, labels).results).map(row => ({
    ...row,
    collectionDate: report.date,
    reportedValue: row.reportedValue ?? null,
    reportedUnit: row.reportedUnit ?? null,
  }));
}
