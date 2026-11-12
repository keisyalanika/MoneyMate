import { Report } from '../../types';

export interface ReportFilters {
  user_id?: number;
  report_type?: string;
}

export interface CreateReportData {
  user_id?: number | null;
  generated_by: number;
  report_type: string;
  title?: string | null;
  period_start?: string | null;
  period_end?: string | null;
  file_url?: string | null;
}

export interface IReportRepository {
  find(filters?: ReportFilters): Promise<Report[]>;
  create(data: CreateReportData): Promise<Report>;
  remove(id: number): Promise<boolean>;
}
