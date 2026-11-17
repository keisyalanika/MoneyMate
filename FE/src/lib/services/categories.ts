import { apiRequest } from "@/lib/api";
import type { AdminCategory, CategoryType } from "@/types";

interface BackendCategory {
  id: number;
  name: string;
  type: "income" | "expense";
  icon?: string;
  usage?: number;
}

function toType(type: string): CategoryType {
  return type.toLowerCase() === "income" ? "Pemasukan" : "Pengeluaran";
}

function toBackendType(type: CategoryType): "income" | "expense" {
  return type === "Pemasukan" ? "income" : "expense";
}

function toAdminCategory(category: BackendCategory): AdminCategory {
  return {
    id: category.id,
    name: category.name,
    icon: category.icon || "tag",
    type: toType(category.type),
    usage: Number(category.usage ?? 0),
  };
}

export const categoryService = {
  async list(type?: string): Promise<AdminCategory[]> {
    const categories = await apiRequest<BackendCategory[]>("categories");
    const mapped = categories.map(toAdminCategory);
    if (!type || type === "semua") return mapped;
    return mapped.filter((item) => item.type === type);
  },

  async create(input: { name: string; type: CategoryType; icon?: string }): Promise<AdminCategory> {
    const created = await apiRequest<BackendCategory>("categories", {
      method: "POST",
      body: JSON.stringify({
        name: input.name,
        type: toBackendType(input.type),
        icon: input.icon || "tag",
      }),
    });
    return toAdminCategory(created);
  },

  async update(
    id: number,
    input: { name: string; type: CategoryType; icon?: string }
  ): Promise<AdminCategory> {
    const updated = await apiRequest<BackendCategory>(`categories/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: input.name,
        type: toBackendType(input.type),
        icon: input.icon || "tag",
      }),
    });
    return toAdminCategory(updated);
  },

  async remove(id: number): Promise<void> {
    await apiRequest(`categories/${id}`, { method: "DELETE" });
  },
};
