"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService, type UserQuery } from "@/lib/services/users";
import type { UserStatus } from "@/types";
import { useToastStore } from "@/stores/toastStore";

export const userKeys = {
  all: ["users"] as const,
  list: (query: UserQuery) => ["users", "list", query] as const,
};

export function useUsers(query: UserQuery) {
  return useQuery({
    queryKey: userKeys.list(query),
    queryFn: () => userService.list(query),
    placeholderData: (previous) => previous,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  const toast = useToastStore((state) => state.push);

  return useMutation({
    mutationFn: userService.create,
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast(`Pengguna ${user.name} berhasil ditambahkan`, "success");
    },
    onError: (error: Error) => toast(error.message, "error"),
  });
}

export function useSetUserStatus() {
  const queryClient = useQueryClient();
  const toast = useToastStore((state) => state.push);

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: UserStatus }) =>
      userService.setStatus(id, status),
    onSuccess: (user) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast(`Status ${user.name} diubah menjadi ${user.status}`, "success");
    },
    onError: (error: Error) => toast(error.message, "error"),
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  const toast = useToastStore((state) => state.push);

  return useMutation({
    mutationFn: userService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast("Pengguna berhasil dihapus", "success");
    },
    onError: (error: Error) => toast(error.message, "error"),
  });
}
