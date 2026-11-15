"use client";

import { Download } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { useLogs } from "@/hooks/queries/useLogs";
import { auditLogs } from "@/lib/mock";
import { useTableStore } from "@/stores/tableStore";
import type { AuditLog } from "@/types";

const actions = Array.from(new Set(auditLogs.map((log) => log.action)));

const columns: ColumnDef<AuditLog, any>[] = [
  {
    accessorKey: "time",
    header: "Waktu",
    cell: ({ getValue }) => <span className="text-subtle">{getValue<string>()}</span>,
  },
  {
    accessorKey: "admin",
    header: "Admin",
    cell: ({ getValue }) => (
      <span className="font-semibold text-ink">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "action",
    header: "Aksi",
    cell: ({ getValue }) => (
      <span className="rounded-md bg-field px-2 py-1 text-[9px] font-bold tracking-wide text-brand">
        {getValue<string>()}
      </span>
    ),
  },
  {
    accessorKey: "target",
    header: "Target",
    cell: ({ getValue }) => <span className="text-ink">{getValue<string>()}</span>,
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
    enableSorting: false,
    cell: ({ getValue }) => <span className="text-subtle">{getValue<string>()}</span>,
  },
];

export default function LogsPage() {
  const search = useTableStore((state) => state.tables.logs?.search ?? "");
  const action = useTableStore((state) => state.tables.logs?.filters.action ?? "all");
  const setFilter = useTableStore((state) => state.setFilter);

  const { data = [], isLoading } = useLogs({ search, action });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Audit Logs"
        subtitle="Riwayat aktivitas administrator di portal"
        action={
          <Button
            variant="outline"
            className="h-10 gap-1.5 rounded-[10px] border-line bg-surface px-3.5 text-xs font-semibold text-brand"
          >
            <Download className="size-3.5" />
            Export CSV
          </Button>
        }
      />

      <Card className="gap-0 rounded-2xl py-0 ring-1 ring-line">
        <div className="p-4">
          <DataTable<AuditLog>
            id="logs"
            columns={columns}
            data={data}
            isLoading={isLoading}
            searchPlaceholder="Cari deskripsi aktivitas..."
            emptyMessage="Tidak ada aktivitas yang cocok."
            toolbar={
              <Select
                selectedKey={action}
                onSelectionChange={(key) => setFilter("logs", "action", String(key))}
                aria-label="Filter aksi log"
                className="w-[170px]"
              >
                <SelectTrigger className="h-10 rounded-[10px] border-line bg-surface px-3 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem id="all">Semua aksi</SelectItem>
                  {actions.map((item) => (
                    <SelectItem key={item} id={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            }
          />
        </div>
      </Card>
    </div>
  );
}
