import {
  categoryUsage,
  dashboardStats,
  latestUsers,
  userGrowth,
} from "@/lib/mock";
import type { CategoryUsage, DashboardStats, UserGrowthPoint, AdminUser } from "@/types";

const delay = (ms = 260) => new Promise((resolve) => setTimeout(resolve, ms));

export interface DashboardPayload {
  stats: DashboardStats;
  distribution: CategoryUsage[];
  growth: UserGrowthPoint[];
  latest: AdminUser[];
}

export const dashboardService = {
  async get(): Promise<DashboardPayload> {
    await delay();
    return {
      stats: dashboardStats,
      distribution: categoryUsage,
      growth: userGrowth,
      latest: latestUsers,
    };
  },
};
