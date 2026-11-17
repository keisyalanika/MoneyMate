import { apiRequest } from "@/lib/api";
import type { AdminUser, CategoryUsage, DashboardStats, UserGrowthPoint } from "@/types";

export interface DashboardPayload {
  stats: DashboardStats;
  distribution: CategoryUsage[];
  growth: UserGrowthPoint[];
  latest: AdminUser[];
}

export const dashboardService = {
  async get(): Promise<DashboardPayload> {
    return apiRequest<DashboardPayload>("admin/dashboard");
  },
};
