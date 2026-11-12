import { Report, ReportType } from '../../types';
import { nullable, toDateOnly } from './MapperHelpers';

export interface ReportRow {
  id: number;
  userId: number | null;
  generatedBy: number;
  reportType: ReportType;
  title: string | null;
  periodStart: Date | null;
  periodEnd: Date | null;
  fileUrl: string | null;
  createdAt: Date;
  user?: { name: string } | null;
  generatedByUser?: { name: string } | null;
}

export const toReport = (row: ReportRow): Report => ({
  id: row.id,
  user_id: nullable(row.userId),
  generated_by: row.generatedBy,
  report_type: row.reportType,
  title: nullable(row.title),
  period_start: toDateOnly(row.periodStart),
  period_end: toDateOnly(row.periodEnd),
  file_url: nullable(row.fileUrl),
  created_at: row.createdAt,
  user_name: nullable(row.user?.name),
  generated_by_name: nullable(row.generatedByUser?.name),
});
