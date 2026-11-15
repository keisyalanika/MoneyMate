"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "@/lib/services/categories";
import type { CategoryType } from "@/types";
import { useToastStore } from "@/stores/toastStore";

export const categoryKeys = {
  all: ["categories"] as const,
  list: (type: string) => ["categories", "list", type] as const,
};

export function useCategories(type: string) {
  return useQuery({
    queryKey: categoryKeys.list(type),
    queryFn: () => categoryService.list(type),
    placeholderData: (previous) => previous,
  });
}

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const toast = useToastStore((state) => state.push);

  return useMutation({
    mutationFn: (input: { name: string; type: CategoryType; icon?: string }) =>
      categoryService.create(input),
    onSuccess: (category) => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast(`Kategori ${category.name} ditambahkan`, "success");
    },
    onError: (error: Error) => toast(error.message, "error"),
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  const toast = useToastStore((state) => state.push);

  return useMutation({
    mutationFn: categoryService.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all });
      toast("Kategori dihapus", "success");
    },
    onError: (error: Error) => toast(error.message, "error"),
  });
}
