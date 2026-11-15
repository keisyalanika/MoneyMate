"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "@/lib/services/notifications";
import type { NotificationType } from "@/types";
import { useToastStore } from "@/stores/toastStore";

export const notificationKeys = {
  all: ["notifications"] as const,
  list: (query: { search?: string; type?: string }) =>
    ["notifications", "list", query] as const,
};

export function useNotifications(query: { search?: string; type?: string }) {
  return useQuery({
    queryKey: notificationKeys.list(query),
    queryFn: () => notificationService.list(query),
    placeholderData: (previous) => previous,
  });
}

export function useSendNotification() {
  const queryClient = useQueryClient();
  const toast = useToastStore((state) => state.push);

  return useMutation({
    mutationFn: (input: {
      audience: string;
      title: string;
      message: string;
      type: NotificationType;
    }) => notificationService.send(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toast("Notifikasi berhasil dikirim", "success");
    },
    onError: (error: Error) => toast(error.message, "error"),
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();
  const toast = useToastStore((state) => state.push);

  return useMutation({
    mutationFn: notificationService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationKeys.all });
      toast("Notifikasi dihapus", "success");
    },
    onError: (error: Error) => toast(error.message, "error"),
  });
}
