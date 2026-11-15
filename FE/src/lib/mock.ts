import type {
  AdminCategory,
  AdminNotification,
  AdminProfile,
  AdminUser,
  AuditLog,
  CategoryUsage,
  DashboardStats,
  UserGrowthPoint,
} from "@/types";

export const adminProfile: AdminProfile = {
  name: "Admin MoneyMate",
  email: "admin@moneymate.com",
  phone: "0812-3456-7890",
};

export const dashboardStats: DashboardStats = {
  total: 1248,
  active: 1102,
  inactive: 146,
  newLast30Days: 87,
};

export const categoryUsage: CategoryUsage[] = [
  { name: "Makanan", count: 3412, percentage: 32 },
  { name: "Transportasi", count: 2560, percentage: 24 },
  { name: "Belanja", count: 1920, percentage: 18 },
  { name: "Pendidikan", count: 1493, percentage: 14 },
  { name: "Lainnya", count: 1280, percentage: 12 },
];

export const userGrowth: UserGrowthPoint[] = [
  { month: "Jun", count: 76 },
  { month: "Jul", count: 96 },
  { month: "Agu", count: 86 },
  { month: "Sep", count: 116 },
  { month: "Okt", count: 104 },
  { month: "Nov", count: 140 },
];

export const users: AdminUser[] = [
  { id: 1, code: "USR-001", name: "Keisya Exa Haniyah", email: "keisyaexahaniyah@gmail.com", phone: "0812-3456-7890", joinedAt: "12 Nov 2026", status: "Aktif" },
  { id: 2, code: "USR-002", name: "Raka Pratama", email: "raka.pratama@gmail.com", phone: "0813-2211-4455", joinedAt: "11 Nov 2026", status: "Aktif" },
  { id: 3, code: "USR-003", name: "Nadia Putri", email: "nadia.putri@gmail.com", phone: "0857-8899-1122", joinedAt: "10 Nov 2026", status: "Nonaktif" },
  { id: 4, code: "USR-004", name: "Bagas Saputra", email: "bagas.saputra@gmail.com", phone: "0821-3344-7788", joinedAt: "09 Nov 2026", status: "Aktif" },
  { id: 5, code: "USR-005", name: "Sinta Maharani", email: "sinta.maharani@gmail.com", phone: "0819-5566-2233", joinedAt: "08 Nov 2026", status: "Aktif" },
  { id: 6, code: "USR-006", name: "Dimas Arya", email: "dimas.arya@gmail.com", phone: "0878-1234-9087", joinedAt: "07 Nov 2026", status: "Aktif" },
  { id: 7, code: "USR-007", name: "Putri Amalia", email: "putri.amalia@gmail.com", phone: "0896-4433-2211", joinedAt: "06 Nov 2026", status: "Nonaktif" },
  { id: 8, code: "USR-008", name: "Fajar Nugroho", email: "fajar.nugroho@gmail.com", phone: "0812-7788-3344", joinedAt: "05 Nov 2026", status: "Aktif" },
];

export const categories: AdminCategory[] = [
  { id: 1, name: "Makanan & Minuman", icon: "utensils", type: "Pengeluaran", usage: 3412 },
  { id: 2, name: "Transportasi", icon: "bus", type: "Pengeluaran", usage: 2980 },
  { id: 3, name: "Belanja", icon: "shopping-cart", type: "Pengeluaran", usage: 2104 },
  { id: 4, name: "Pendidikan", icon: "book", type: "Pengeluaran", usage: 1876 },
  { id: 5, name: "Tagihan & Utilitas", icon: "file-text", type: "Pengeluaran", usage: 1502 },
  { id: 6, name: "Hiburan", icon: "music", type: "Pengeluaran", usage: 986 },
  { id: 7, name: "Kesehatan", icon: "activity", type: "Pengeluaran", usage: 742 },
  { id: 8, name: "Gaji Bulanan", icon: "wallet", type: "Pemasukan", usage: 1540 },
  { id: 9, name: "Beasiswa", icon: "award", type: "Pemasukan", usage: 624 },
];

export const notifications: AdminNotification[] = [
  { id: 1, title: "Pemeliharaan Sistem", message: "Aplikasi maintenance 15 Nov 2026 pukul 23.00 WIB.", audience: "Semua pengguna", type: "Info", sentAt: "12 Nov 2026" },
  { id: 2, title: "Pengingat Anggaran", message: "Anggaran kategori Makanan sudah mencapai 85%.", audience: "Pengguna terpilih", type: "Peringatan", sentAt: "11 Nov 2026" },
  { id: 3, title: "Promo Kantin Kampus", message: "Diskon 20% di kantin kampus sampai akhir bulan.", audience: "Semua pengguna", type: "Promo", sentAt: "10 Nov 2026" },
  { id: 4, title: "Fitur Baru: Goals", message: "Buat target tabungan langsung dari chat AI.", audience: "Semua pengguna", type: "Info", sentAt: "09 Nov 2026" },
  { id: 5, title: "Verifikasi Akun", message: "Lengkapi profil untuk mendapatkan akses penuh.", audience: "Pengguna baru", type: "Peringatan", sentAt: "08 Nov 2026" },
];

export const auditLogs: AuditLog[] = [
  { id: 1, time: "12 Nov 2026 · 10:42", admin: "Admin MoneyMate", action: "ACTIVATE_USER", target: "users#24", description: "Mengaktifkan akun Raka Pratama" },
  { id: 2, time: "12 Nov 2026 · 10:18", admin: "Admin MoneyMate", action: "DELETE_USER", target: "users#87", description: "Menghapus akun pengguna tidak aktif" },
  { id: 3, time: "11 Nov 2026 · 16:05", admin: "Admin MoneyMate", action: "CREATE_CATEGORY", target: "categories#14", description: "Menambahkan kategori Lainnya" },
  { id: 4, time: "11 Nov 2026 · 14:32", admin: "Admin MoneyMate", action: "DEACTIVATE_USER", target: "users#56", description: "Menonaktifkan akun Nadia Putri" },
  { id: 5, time: "10 Nov 2026 · 09:21", admin: "Admin MoneyMate", action: "SEND_NOTIFICATION", target: "notifications#312", description: "Mengirim pengumuman pemeliharaan" },
  { id: 6, time: "09 Nov 2026 · 15:47", admin: "Admin MoneyMate", action: "UPDATE_SETTINGS", target: "settings#1", description: "Mengubah preferensi notifikasi admin" },
  { id: 7, time: "08 Nov 2026 · 11:12", admin: "Admin MoneyMate", action: "LOGIN", target: "auth", description: "Login administrator berhasil" },
  { id: 8, time: "07 Nov 2026 · 08:55", admin: "Admin MoneyMate", action: "CREATE_CATEGORY", target: "categories#13", description: "Menambahkan kategori Kesehatan" },
];

export const latestUsers = users.slice(0, 5);
