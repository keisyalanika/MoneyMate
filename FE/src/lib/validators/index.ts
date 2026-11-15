import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Email tidak valid"),
  password: z.string().min(6, "Kata sandi minimal 6 karakter"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const userSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.email("Email tidak valid"),
  phone: z.string().min(9, "Nomor telepon minimal 9 digit").optional().or(z.literal("")),
  status: z.enum(["Aktif", "Nonaktif"]),
});
export type UserInput = z.infer<typeof userSchema>;

export const categorySchema = z.object({
  name: z.string().min(3, "Nama kategori minimal 3 karakter"),
  type: z.enum(["Pemasukan", "Pengeluaran"]),
  icon: z.string().optional().or(z.literal("")),
});
export type CategoryInput = z.infer<typeof categorySchema>;

export const notificationSchema = z.object({
  audience: z.enum(["Semua pengguna", "Pengguna terpilih", "Pengguna baru"]),
  title: z.string().min(3, "Judul minimal 3 karakter"),
  message: z.string().min(10, "Pesan minimal 10 karakter"),
  type: z.enum(["Info", "Peringatan", "Promo"]),
});
export type NotificationInput = z.infer<typeof notificationSchema>;

export const profileSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.email("Email tidak valid"),
  phone: z.string().min(9, "Nomor telepon minimal 9 digit").optional().or(z.literal("")),
});
export type ProfileInput = z.infer<typeof profileSchema>;

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(6, "Kata sandi saat ini minimal 6 karakter"),
    newPassword: z.string().min(6, "Kata sandi baru minimal 6 karakter"),
    confirmPassword: z.string().min(6, "Ulangi kata sandi baru"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Konfirmasi kata sandi tidak sama",
    path: ["confirmPassword"],
  });
export type PasswordInput = z.infer<typeof passwordSchema>;
