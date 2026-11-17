"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronsUpDown,
  TrendingUp,
  UserCheck,
  UserPlus,
  Users,
  UserX,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DonutChart } from "@/components/charts/DonutChart";
import { LineChart } from "@/components/charts/LineChart";
import { StatCard } from "@/components/shared/StatCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useDashboard } from "@/hooks/queries/useLogs";
import { formatNumber, initialOf } from "@/lib/format";
import type { AdminUser } from "@/types";

export default function DashboardPage() {
  const { data, isLoading } = useDashboard();

  const stats = data?.stats;
  const distribution = data?.distribution ?? [];
  const growth = data?.growth ?? [];
  const latest = data?.latest ?? [];
  const growthPercent =
    growth.length >= 2 && growth[0].count > 0
      ? Math.round(
          ((growth[growth.length - 1].count - growth[0].count) / growth[0].count) * 100
        )
      : 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-0.5">
          <h2 className="text-xl font-extrabold text-ink">Selamat datang, Admin</h2>
          <p className="text-xs text-subtle">Berikut ringkasan pengguna MoneyMate hari ini.</p>
        </div>
        <span className="flex items-center gap-2 rounded-[10px] border border-line bg-surface px-3.5 py-2 text-[11px] font-semibold text-ink">
          <CalendarDays className="size-3.5 text-subtle" />
          {new Intl.DateTimeFormat("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date())}
        </span>
      </div>

      <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading || !stats ? (
          [0, 1, 2, 3].map((item) => (
            <div key={item} className="h-[118px] animate-pulse rounded-2xl border border-line bg-surface" />
          ))
        ) : (
          <>
            <StatCard
              label="Total Pengguna"
              value={formatNumber(stats.total)}
              note="Seluruh akun terdaftar"
              icon={Users}
              tone="brand"
            />
            <StatCard
              label="Pengguna Aktif"
              value={formatNumber(stats.active)}
              note={`${Math.round((stats.active / stats.total) * 100)}% dari total pengguna`}
              icon={UserCheck}
              tone="success"
            />
            <StatCard
              label="Pengguna Nonaktif"
              value={formatNumber(stats.inactive)}
              note={`${stats.total > 0 ? Math.round((stats.inactive / stats.total) * 100) : 0}% dari total pengguna`}
              icon={UserX}
              tone="accent"
            />
            <StatCard
              label="Pendaftar 30 Hari"
              value={formatNumber(stats.newLast30Days)}
              note="30 hari terakhir"
              icon={UserPlus}
              tone="gold"
            />
          </>
        )}
      </div>

      <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-[456px_1fr]">
        <Card className="gap-0 rounded-2xl py-0 ring-1 ring-line">
          <div className="flex flex-col gap-3.5 p-5">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-extrabold text-ink">Persebaran Kategori</span>
                <span className="text-[10px] text-subtle">Berdasarkan jumlah pemakaian</span>
              </div>
              <span className="rounded-lg bg-field px-2 py-1 text-[10px] font-semibold text-subtle">
                30 hari
              </span>
            </div>

            {isLoading ? (
              <div className="flex items-center gap-5">
                <div className="size-[168px] animate-pulse rounded-full bg-field" />
                <div className="flex flex-1 flex-col gap-2">
                  {[0, 1, 2, 3, 4].map((item) => (
                    <div key={item} className="h-3 animate-pulse rounded bg-field" />
                  ))}
                </div>
              </div>
            ) : (
              <DonutChart data={distribution} />
            )}
          </div>
        </Card>

        <Card className="gap-0 rounded-2xl py-0 ring-1 ring-line">
          <div className="flex flex-col gap-3.5 p-5">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-extrabold text-ink">Pertumbuhan Pengguna</span>
                <span className="text-[10px] text-subtle">Pendaftar baru per bulan</span>
              </div>
              <span className="flex items-center gap-1 rounded-lg bg-tint px-2 py-1 text-[10px] font-semibold text-orange">
                <TrendingUp className="size-3" />
                {growthPercent >= 0 ? "+" : ""}
                {growthPercent}%
              </span>
            </div>

            {isLoading ? (
              <div className="h-[150px] w-full animate-pulse rounded-xl bg-field" />
            ) : (
              <div className="flex flex-col gap-2">
                <LineChart data={growth} />
                <div className="flex justify-between px-1">
                  {growth.map((point) => (
                    <span key={point.month} className="w-10 text-center text-[10px] text-subtle">
                      {point.month}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      <Card className="gap-0 rounded-2xl py-0 ring-1 ring-line">
        <div className="flex flex-col gap-3 p-4">
          <div className="flex items-center justify-between">
            <div className="flex flex-col gap-0.5">
              <span className="text-sm font-extrabold text-ink">Pengguna Terbaru</span>
              <span className="text-[10px] text-subtle">5 akun terakhir yang mendaftar</span>
            </div>
            <Link href="/users" className="flex items-center gap-1 text-[11px] font-semibold text-orange">
              Lihat semua
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <Table aria-label="Pengguna terbaru" className="w-full text-left">
            <TableHeader className="[&_tr]:bg-field [&_th:first-child]:rounded-l-lg [&_th:last-child]:rounded-r-lg">
              {["PENGGUNA", "EMAIL", "TERDAFTAR", "STATUS"].map((label, index) => (
                <TableHead
                  key={label}
                  isRowHeader={index === 0}
                  className="h-9 px-3 text-[10px] font-bold tracking-wide text-subtle"
                >
                  <span className="flex items-center gap-1.5">
                    {label}
                    <ChevronsUpDown className="size-3" />
                  </span>
                </TableHead>
              ))}
            </TableHeader>

            <TableBody<AdminUser> items={latest}>
              {(user) => (
                <TableRow key={user.id} className="border-b border-line-soft outline-none last:border-0">
                  <TableCell className="px-3 py-3">
                    <span className="flex items-center gap-2.5">
                      <span className="flex size-8 items-center justify-center rounded-full bg-[#E6D0C7] text-[11px] font-bold text-brand">
                        {initialOf(user.name)}
                      </span>
                      <span className="text-xs font-semibold text-ink">{user.name}</span>
                    </span>
                  </TableCell>
                  <TableCell className="px-3 py-3 text-[11px] text-subtle">{user.email}</TableCell>
                  <TableCell className="px-3 py-3 text-[11px] text-ink">{user.joinedAt}</TableCell>
                  <TableCell className="px-3 py-3">
                    <StatusBadge label={user.status} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
