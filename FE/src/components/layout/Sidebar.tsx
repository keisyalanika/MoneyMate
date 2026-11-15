"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Bell,
  History,
  LayoutDashboard,
  LogOut,
  Settings,
  Tags,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BrandLogo } from "./BrandLogo";
import { useUIStore } from "@/stores/uiStore";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/users", label: "Users", icon: Users },
  { href: "/kategori", label: "Kategori", icon: Tags },
  { href: "/notifikasi", label: "Notifikasi", icon: Bell },
  { href: "/logs", label: "Logs", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const open = useUIStore((state) => state.sidebarOpen);
  const setOpen = useUIStore((state) => state.setSidebarOpen);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-[1px] lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[280px] shrink-0 flex-col justify-between border-r border-line bg-surface p-5 transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-[240px] lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2.5">
            <BrandLogo />
            <div className="flex flex-col">
              <span className="text-[15px] font-extrabold text-ink">MoneyMate</span>
              <span className="text-[10px] text-subtle">Admin Console</span>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="ml-auto flex size-8 items-center justify-center rounded-lg text-subtle hover:bg-field lg:hidden"
              aria-label="Tutup menu"
            >
              <X className="size-4" />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            <span className="px-3 py-1 text-[10px] font-bold tracking-[1.2px] text-subtle">
              MENU UTAMA
            </span>
            {NAV.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex h-11 items-center gap-2.5 rounded-xl px-3 text-[13px] transition-colors",
                    active
                      ? "bg-tint font-semibold text-brand"
                      : "text-subtle hover:bg-field hover:text-ink"
                  )}
                >
                  <Icon className="size-[18px]" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex flex-col gap-3">
          <div className="h-px w-full bg-line" />
          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-semibold text-brand transition-colors hover:bg-tint"
          >
            <LogOut className="size-[15px]" />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
