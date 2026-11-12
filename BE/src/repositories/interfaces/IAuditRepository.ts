import { AuditLog } from '../../types';

export interface CreateAuditLogData {
  admin_id: number;
  action: string;
  target_table?: string | null;
  target_id?: number | null;
  description?: string | null;
}

export interface AuditLogFilters {
  admin_id?: number;
  action?: string;
  limit?: number;
}

export interface IAuditRepository {
  create(data: CreateAuditLogData): Promise<AuditLog>;
  find(filters?: AuditLogFilters): Promise<AuditLog[]>;
}
