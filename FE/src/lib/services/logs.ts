import { auditLogs } from "@/lib/mock";
import type { AuditLog } from "@/types";

const delay = (ms = 220) => new Promise((resolve) => setTimeout(resolve, ms));

export const logService = {
  async list(query: { search?: string; action?: string } = {}): Promise<AuditLog[]> {
    await delay();
    const term = (query.search ?? "").trim().toLowerCase();
    return auditLogs.filter((log) => {
      const matchTerm = !term || log.description.toLowerCase().includes(term);
      const matchAction = !query.action || query.action === "all" || log.action === query.action;
      return matchTerm && matchAction;
    });
  },
};
