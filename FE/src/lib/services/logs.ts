import { apiRequest } from "@/lib/api";
import type { AuditLog } from "@/types";

interface BackendAuditLog {
  id: number;
  action: string;
  target_table?: string;
  target_id?: number;
  description?: string;
  created_at: string;
  admin_name?: string;
}

function toAuditLog(log: BackendAuditLog): AuditLog {
  const time = log.created_at
    ? new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(log.created_at))
    : "-";

  return {
    id: log.id,
    time,
    admin: log.admin_name || "Admin",
    action: log.action,
    target: log.target_table
      ? `${log.target_table}${log.target_id ? `#${log.target_id}` : ""}`
      : "-",
    description: log.description || "-",
  };
}

export const logService = {
  async list(query: { search?: string; action?: string } = {}): Promise<AuditLog[]> {
    const params = new URLSearchParams();
    if (query.action && query.action !== "all") params.set("action", query.action);
    const suffix = params.toString() ? `?${params.toString()}` : "";
    const logs = await apiRequest<BackendAuditLog[]>(`admin/audit-logs${suffix}`);
    const term = (query.search ?? "").trim().toLowerCase();

    return logs.map(toAuditLog).filter((log) => {
      if (!term) return true;
      return (
        log.description.toLowerCase().includes(term) ||
        log.admin.toLowerCase().includes(term) ||
        log.action.toLowerCase().includes(term)
      );
    });
  },
};
