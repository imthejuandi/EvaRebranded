import type {Report} from '@/lib/preview/model';
export function archiveReport(report:Report):Report {
 return report.status==='archived'?report:{...report,archivedStatus:report.status,status:'archived'};
}
export function restoreReport(report:Report):Report {
 if(report.status!=='archived')return report;
 return {...report,status:report.archivedStatus??(report.contextComplete?'processing':'pending_context'),archivedStatus:undefined};
}
