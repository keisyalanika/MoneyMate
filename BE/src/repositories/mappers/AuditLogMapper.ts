import { AuditLog } from '../../types';
import { nullable } from './MapperHelpers';

export interface AuditLogRow {
  id: number;
  adminId: number;
  action: string;
  targetTable: string | null;
  targetId: number | null;
  description: string | null;
  createdAt: Date;
  admin?: { name: string } | null;
}

export const toAuditLog = (row: AuditLogRow): AuditLog => ({
  id: row.id,
  admin_id: row.adminId,
  action: row.action,
  target_table: nullable(row.targetTable),
  target_id: nullable(row.targetId),
  description: nullable(row.description),
  created_at: row.createdAt,
  admin_name: nullable(row.admin?.name),
});
