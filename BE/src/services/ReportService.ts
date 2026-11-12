import { reportRepository } from '../repositories';

export class ReportService {
  constructor(private readonly reports = reportRepository) {}

  getReports(filters?: { user_id?: number; report_type?: string }) {
    return this.reports.find(filters);
  }

  createReport(data: {
    user_id?: number;
    generated_by: number;
    report_type: string;
    title?: string;
    period_start?: string;
    period_end?: string;
    file_url?: string;
  }) {
    return this.reports.create(data);
  }

  deleteReport(id: number) {
    return this.reports.remove(id);
  }
}

export const reportService = new ReportService();
