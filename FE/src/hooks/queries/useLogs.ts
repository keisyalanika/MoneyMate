"use client";

import { useQuery } from "@tanstack/react-query";
import { logService } from "@/lib/services/logs";
import { dashboardService } from "@/lib/services/dashboard";

export function useLogs(query: { search?: string; action?: string }) {
  return useQuery({
    queryKey: ["logs", "list", query],
    queryFn: () => logService.list(query),
    placeholderData: (previous) => previous,
  });
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: dashboardService.get,
  });
}
