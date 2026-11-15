export type UserStatus = "Aktif" | "Nonaktif";

export interface AdminUser {
  id: number;
  code: string;
  name: string;
  email: string;
  phone: string;
  joinedAt: string;
  status: UserStatus;
}

export type CategoryType = "Pemasukan" | "Pengeluaran";

export interface AdminCategory {
  id: number;
  name: string;
  icon: string;
  type: CategoryType;
  usage: number;
}

export type NotificationType = "Info" | "Peringatan" | "Promo";

export interface AdminNotification {
  id: number;
  title: string;
  message: string;
  audience: string;
  type: NotificationType;
  sentAt: string;
}

export interface AuditLog {
  id: number;
  time: string;
  admin: string;
  action: string;
  target: string;
  description: string;
}

export interface DashboardStats {
  total: number;
  active: number;
  inactive: number;
  newLast30Days: number;
}

export interface CategoryUsage {
  name: string;
  count: number;
  percentage: number;
}

export interface UserGrowthPoint {
  month: string;
  count: number;
}

export interface AdminProfile {
  name: string;
  email: string;
  phone: string;
}
