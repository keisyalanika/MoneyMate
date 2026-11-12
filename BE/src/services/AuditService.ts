import { auditRepository } from '../repositories';

export class AuditService {
  constructor(private readonly audits = auditRepository) {}

  logAction(data: {
    admin_id: number;
    action: string;
    target_table?: string;
    target_id?: number;
    description?: string;
  }) {
    return this.audits.create(data);
  }

  getAuditLogs(filters?: { admin_id?: number; action?: string; limit?: number }) {
    return this.audits.find(filters);
  }
}

export const auditService = new AuditService();
