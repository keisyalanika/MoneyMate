import { Prisma } from '../generated/prisma/client';
import { AuditLog } from '../types';
import { BaseRepository } from './base/BaseRepository';
import { AuditLogFilters, CreateAuditLogData, IAuditRepository } from './interfaces/IAuditRepository';
import { toAuditLog } from './mappers/AuditLogMapper';

const auditInclude = { admin: { select: { name: true } } } satisfies Prisma.AuditLogInclude;

export class AuditRepository extends BaseRepository implements IAuditRepository {
  async create(data: CreateAuditLogData): Promise<AuditLog> {
    const row = await this.db.auditLog.create({
      data: {
        adminId: data.admin_id,
        action: data.action,
        targetTable: data.target_table ?? null,
        targetId: data.target_id ?? null,
        description: data.description ?? null,
      },
      include: auditInclude,
    });
    return toAuditLog(row);
  }

  async find(filters?: AuditLogFilters): Promise<AuditLog[]> {
    const where: Prisma.AuditLogWhereInput = {};
    if (filters?.admin_id) where.adminId = filters.admin_id;
    if (filters?.action) where.action = { contains: filters.action };

    const rows = await this.db.auditLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: filters?.limit,
      include: auditInclude,
    });
    return rows.map(toAuditLog);
  }
}
