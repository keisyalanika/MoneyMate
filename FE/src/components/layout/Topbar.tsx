"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useUIStore } from "@/stores/uiStore";

const TITLES: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Ringkasan aktivitas pengguna MoneyMate" },
  "/users": { title: "Users", subtitle: "Kelola akun pengguna MoneyMate" },
  "/kategori": { title: "Kategori", subtitle: "Kelola kategori pemasukan dan pengeluaran" },
  "/notifikasi": { title: "Notifikasi", subtitle: "Kirim pengumuman ke pengguna" },
  "/logs": { title: "Logs", subtitle: "Audit aktivitas administrator" },
  "/settings": { title: "Settings", subtitle: "Profil dan preferensi akun admin" },
};

const API_ORIGIN = process.env.NEXT_PUBLIC_API_ORIGIN ?? "http://localhost:5000";

function resolveAvatar(url?: string) {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_ORIGIN}${url.startsWith("/") ? "" : "/"}${url}`;
}

export function Topbar() {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const meta = TITLES[pathname] ?? { title: "Admin", subtitle: "MoneyMate Admin Console" };

  const name = user?.name ?? "Admin";
  const initial = name.trim()[0]?.toUpperCase() ?? "A";
  const avatarUrl = resolveAvatar(user?.avatar_url);

  return (
    <header className="flex h-[68px] w-full shrink-0 items-center justify-between gap-3 border-b border-line bg-surface px-4 sm:h-[76px] sm:px-6 xl:px-7">
      <div className="flex min-w-0 items-center gap-2.5">
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-field text-brand lg:hidden"
          aria-label="Buka menu"
        >
          <Menu className="size-4" />
        </button>

        <div className="flex min-w-0 flex-col gap-0.5">
          <h1 className="truncate text-[16px] font-extrabold text-ink sm:text-[18px]">{meta.title}</h1>
          <p className="hidden truncate text-[11px] text-subtle sm:block">{meta.subtitle}</p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Link
          href="/notifikasi"
          className="flex size-9 items-center justify-center rounded-[10px] bg-field text-brand sm:size-10"
          aria-label="Notifikasi"
        >
          <Bell className="size-4" />
        </Link>

        <div className="flex items-center gap-2">
          <span
            className="flex size-8 items-center justify-center rounded-full bg-[#E6D0C7] bg-cover bg-center text-xs font-bold text-brand sm:size-9"
            style={avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : undefined}
          >
            {!avatarUrl && initial}
          </span>
          <div className="hidden flex-col sm:flex">
            <span className="max-w-[140px] truncate text-xs font-semibold text-ink">{name}</span>
            <span className="text-[10px] text-subtle">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
