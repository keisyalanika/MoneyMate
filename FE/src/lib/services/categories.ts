import { categories as seedCategories } from "@/lib/mock";
import type { AdminCategory, CategoryType } from "@/types";

const delay = (ms = 240) => new Promise((resolve) => setTimeout(resolve, ms));

let data: AdminCategory[] = [...seedCategories];

export const categoryService = {
  async list(type?: string): Promise<AdminCategory[]> {
    await delay();
    if (!type || type === "semua") return data;
    return data.filter((item) => item.type === type);
  },

  async create(input: { name: string; type: CategoryType; icon?: string }): Promise<AdminCategory> {
    await delay();
    const created: AdminCategory = {
      id: Date.now(),
      name: input.name,
      type: input.type,
      icon: input.icon || "tag",
      usage: 0,
    };
    data = [created, ...data];
    return created;
  },

  async remove(id: number): Promise<void> {
    await delay(200);
    data = data.filter((item) => item.id !== id);
  },
};
