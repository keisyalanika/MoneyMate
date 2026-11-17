import { apiRequest } from "@/lib/api";
import type { AdminUser, UserStatus } from "@/types";

interface BackendUser {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  saldo?: number;
  status?: string;
  is_active?: number | boolean;
  userId?: string;
  created_at?: string;
}

export interface UserQuery {
  search?: string;
  status?: string;
}

function toAdminUser(user: BackendUser): AdminUser {
  const active =
    user.status === "Aktif" ||
    user.is_active === true ||
    user.is_active === 1;
  const joinedAt = user.created_at
    ? new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(user.created_at))
    : "-";

  return {
    id: user.id,
    code: user.userId ?? `USR-${String(user.id).padStart(3, "0")}`,
    name: user.name,
    email: user.email,
    phone: user.phone || "-",
    joinedAt,
    status: active ? "Aktif" : "Nonaktif",
  };
}

export const userService = {
  async list(query: UserQuery = {}): Promise<AdminUser[]> {
    const users = await apiRequest<BackendUser[]>("admin/users");
    const term = (query.search ?? "").trim().toLowerCase();

    return users
      .map(toAdminUser)
      .filter((user) => {
        const matchTerm =
          !term ||
          user.name.toLowerCase().includes(term) ||
          user.email.toLowerCase().includes(term);
        const matchStatus =
          !query.status || query.status === "all" || user.status === query.status;
        return matchTerm && matchStatus;
      });
  },

  async create(input: {
    name: string;
    email: string;
    phone?: string;
    password: string;
    status: UserStatus;
  }): Promise<AdminUser> {
    const created = await apiRequest<BackendUser>("users", {
      method: "POST",
      body: JSON.stringify({
        name: input.name,
        email: input.email,
        phone: input.phone,
        password: input.password,
        is_active: input.status === "Aktif",
      }),
    });

    return {
      id: created.id,
      code: `USR-${String(created.id).padStart(3, "0")}`,
      name: created.name,
      email: created.email,
      phone: created.phone || input.phone || "-",
      joinedAt: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date()),
      status: input.status,
    };
  },

  async setStatus(id: number, status: UserStatus): Promise<{ id: number; status: UserStatus }> {
    await apiRequest(`admin/users/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ is_active: status === "Aktif" }),
    });
    return { id, status };
  },

  async remove(id: number): Promise<void> {
    await apiRequest(`admin/users/${id}`, { method: "DELETE" });
  },
};
