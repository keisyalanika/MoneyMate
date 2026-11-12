import { Prisma } from '../generated/prisma/client';
import { Report, ReportType } from '../types';
import { BaseRepository } from './base/BaseRepository';
import { CreateReportData, IReportRepository, ReportFilters } from './interfaces/IReportRepository';
import { toReport } from './mappers/ReportMapper';

const reportInclude = {
  user: { select: { name: true } },
  generatedByUser: { select: { name: true } },
} satisfies Prisma.ReportInclude;

export class ReportRepository extends BaseRepository implements IReportRepository {
  async find(filters?: ReportFilters): Promise<Report[]> {
    const where: Prisma.ReportWhereInput = {};
    if (filters?.user_id) where.userId = filters.user_id;
    if (filters?.report_type) where.reportType = filters.report_type as ReportType;

    const rows = await this.db.report.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: reportInclude,
    });
    return rows.map(toReport);
  }

  async create(data: CreateReportData): Promise<Report> {
    const row = await this.db.report.create({
      data: {
        userId: data.user_id ?? null,
        generatedBy: data.generated_by,
        reportType: data.report_type as ReportType,
        title: data.title ?? null,
        periodStart: data.period_start ? new Date(data.period_start) : null,
        periodEnd: data.period_end ? new Date(data.period_end) : null,
        fileUrl: data.file_url ?? null,
      },
      include: reportInclude,
    });
    return toReport(row);
  }

  async remove(id: number): Promise<boolean> {
    try {
      await this.db.report.delete({ where: { id } });
      return true;
    } catch (error) {
      if ((error as { code?: string }).code === 'P2025') return false;
      throw error;
    }
  }
}
