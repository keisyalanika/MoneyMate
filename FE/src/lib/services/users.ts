import { users as seedUsers } from "@/lib/mock";
import type { AdminUser, UserStatus } from "@/types";

const delay = (ms = 260) => new Promise((resolve) => setTimeout(resolve, ms));

let data: AdminUser[] = [...seedUsers];

export interface UserQuery {
  search?: string;
  status?: string;
}

export const userService = {
  async list(query: UserQuery = {}): Promise<AdminUser[]> {
    await delay();
    const term = (query.search ?? "").trim().toLowerCase();
    return data.filter((user) => {
      const matchTerm =
        !term ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term);
      const matchStatus = !query.status || query.status === "all" || user.status === query.status;
      return matchTerm && matchStatus;
    });
  },

  async create(input: {
    name: string;
    email: string;
    phone?: string;
    status: UserStatus;
  }): Promise<AdminUser> {
    await delay();
    const created: AdminUser = {
      id: Date.now(),
      code: `USR-${String(data.length + 1).padStart(3, "0")}`,
      name: input.name,
      email: input.email,
      phone: input.phone || "-",
      joinedAt: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date()),
      status: input.status,
    };
    data = [created, ...data];
    return created;
  },

  async setStatus(id: number, status: UserStatus): Promise<AdminUser> {
    await delay(200);
    data = data.map((user) => (user.id === id ? { ...user, status } : user));
    const updated = data.find((user) => user.id === id);
    if (!updated) throw new Error("Pengguna tidak ditemukan");
    return updated;
  },

  async remove(id: number): Promise<void> {
    await delay(200);
    data = data.filter((user) => user.id !== id);
  },
};
