"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2, UserCheck, UserPlus } from "lucide-react";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable } from "@/components/tables/DataTable";
import { useCreateUser, useDeleteUser, useSetUserStatus, useUsers } from "@/hooks/queries/useUsers";
import { userSchema, type UserInput } from "@/lib/validators";
import { initialOf } from "@/lib/format";
import { useTableStore } from "@/stores/tableStore";
import type { AdminUser } from "@/types";

const columns: ColumnDef<AdminUser, any>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Pengguna",
    cell: ({ row }) => (
      <span className="flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-full bg-[#E6D0C7] text-[11px] font-bold text-brand">
          {initialOf(row.original.name)}
        </span>
        <span className="text-xs font-semibold text-ink">{row.original.name}</span>
      </span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => <span className="text-subtle">{getValue<string>()}</span>,
  },
  {
    accessorKey: "phone",
    header: "Telepon",
    enableSorting: false,
    cell: ({ getValue }) => <span className="text-ink">{getValue<string>()}</span>,
  },
  { accessorKey: "joinedAt", header: "Terdaftar" },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => <StatusBadge label={getValue<string>()} />,
  },
  {
    id: "actions",
    header: "Aksi",
    enableSorting: false,
    cell: ({ row, table }) => {
      const meta = table.options.meta as {
        onToggle: (user: AdminUser) => void;
        onDelete: (user: AdminUser) => void;
      };
      const user = row.original;
      return (
        <span className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Ubah status pengguna"
            className="text-subtle hover:text-brand"
            onPress={() => meta.onToggle(user)}
          >
            <UserCheck />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Hapus pengguna"
            className="text-bad hover:bg-badbg"
            onPress={() => meta.onDelete(user)}
          >
            <Trash2 />
          </Button>
        </span>
      );
    },
  },
];

export default function UsersPage() {
  const search = useTableStore((state) => state.tables.users?.search ?? "");
  const status = useTableStore((state) => state.tables.users?.filters.status ?? "all");
  const setFilter = useTableStore((state) => state.setFilter);

  const [open, setOpen] = useState(false);
  const { data = [], isLoading } = useUsers({ search, status });
  const createUser = useCreateUser();
  const setUserStatus = useSetUserStatus();
  const deleteUser = useDeleteUser();

  const form = useForm<UserInput>({
    resolver: zodResolver(userSchema),
    defaultValues: { name: "", email: "", phone: "", status: "Aktif" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await createUser.mutateAsync(values);
    form.reset({ name: "", email: "", phone: "", status: "Aktif" });
    setOpen(false);
  });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Daftar Pengguna"
        subtitle="1.248 akun terdaftar di MoneyMate"
        action={
          <DialogTrigger isOpen={open} onOpenChange={setOpen}>
            <Button className="h-10 gap-1.5 rounded-[10px] bg-brand px-3.5 text-xs font-bold text-[#FFF7F2] hover:bg-brand/90">
              <Plus className="size-3.5" />
              Tambah User
            </Button>

            <Dialog className="rounded-2xl p-0 sm:max-w-md">
              <form onSubmit={onSubmit} className="flex flex-col gap-4 p-5">
                <DialogHeader>
                  <DialogTitle className="text-base font-extrabold text-ink">
                    Tambah Pengguna
                  </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] font-semibold text-ink">Nama lengkap</Label>
                  <Input {...form.register("name")} placeholder="Nama lengkap pengguna" aria-label="Nama lengkap" className="h-10 rounded-[10px] border-line bg-field text-xs" />
                  {form.formState.errors.name && (
                    <span className="text-[10px] text-bad">{form.formState.errors.name.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] font-semibold text-ink">Email</Label>
                  <Input {...form.register("email")} type="email" placeholder="nama@email.com" aria-label="Email" className="h-10 rounded-[10px] border-line bg-field text-xs" />
                  {form.formState.errors.email && (
                    <span className="text-[10px] text-bad">{form.formState.errors.email.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] font-semibold text-ink">Nomor telepon</Label>
                  <Input {...form.register("phone")} placeholder="0812-3456-7890" aria-label="Nomor telepon" className="h-10 rounded-[10px] border-line bg-field text-xs" />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] font-semibold text-ink">Status</Label>
                  <Controller
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <Select
                        selectedKey={field.value}
                        onSelectionChange={(key) => field.onChange(String(key))}
                        aria-label="Status pengguna"
                      >
                        <SelectTrigger className="h-10 rounded-[10px] border-line bg-field px-3 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem id="Aktif">Aktif</SelectItem>
                          <SelectItem id="Nonaktif">Nonaktif</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <DialogFooter className="mx-0 mb-0 gap-2 border-0 bg-transparent p-0">
                  <Button variant="ghost" type="button" className="h-10 rounded-[10px] text-xs text-subtle" onPress={() => setOpen(false)}>
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    isDisabled={createUser.isPending}
                    className="h-10 gap-1.5 rounded-[10px] bg-brand px-4 text-xs font-bold text-[#FFF7F2] hover:bg-brand/90"
                  >
                    <UserPlus className="size-3.5" />
                    {createUser.isPending ? "Menyimpan..." : "Simpan"}
                  </Button>
                </DialogFooter>
              </form>
            </Dialog>
          </DialogTrigger>
        }
      />

      <Card className="gap-0 rounded-2xl py-0 ring-1 ring-line">
        <div className="p-4">
          <DataTable<AdminUser>
            id="users"
            columns={columns}
            data={data}
            isLoading={isLoading}
            searchPlaceholder="Cari nama atau email pengguna..."
            emptyMessage="Tidak ada pengguna yang cocok."
            toolbar={
              <Select
                selectedKey={status}
                onSelectionChange={(key) => setFilter("users", "status", String(key))}
                aria-label="Filter status pengguna"
                className="w-[150px]"
              >
                <SelectTrigger className="h-10 rounded-[10px] border-line bg-surface px-3 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem id="all">Semua Status</SelectItem>
                  <SelectItem id="Aktif">Aktif</SelectItem>
                  <SelectItem id="Nonaktif">Nonaktif</SelectItem>
                </SelectContent>
              </Select>
            }
            meta={{
              onToggle: (user: AdminUser) =>
                setUserStatus.mutate({
                  id: user.id,
                  status: user.status === "Aktif" ? "Nonaktif" : "Aktif",
                }),
              onDelete: (user: AdminUser) => deleteUser.mutate(user.id),
            }}
          />
        </div>
      </Card>
    </div>
  );
}
