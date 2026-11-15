"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as Icons from "lucide-react";
import { Pencil, Plus, Trash2 } from "lucide-react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable } from "@/components/tables/DataTable";
import { useCategories, useCreateCategory, useDeleteCategory } from "@/hooks/queries/useCategories";
import { categorySchema, type CategoryInput } from "@/lib/validators";
import { useTableStore } from "@/stores/tableStore";
import type { AdminCategory } from "@/types";

const TABS = [
  { id: "semua", label: "Semua", icon: Icons.Layers },
  { id: "Pemasukan", label: "Pemasukan", icon: Icons.ArrowDownLeft },
  { id: "Pengeluaran", label: "Pengeluaran", icon: Icons.ArrowUpRight },
];

const ICONS: Record<string, Icons.LucideIcon> = {
  utensils: Icons.Utensils,
  bus: Icons.Bus,
  "shopping-cart": Icons.ShoppingCart,
  book: Icons.Book,
  "file-text": Icons.FileText,
  music: Icons.Music,
  activity: Icons.Activity,
  wallet: Icons.Wallet,
  award: Icons.Award,
};

function CategoryIcon({ name }: { name: string }) {
  const Icon = ICONS[name] ?? Icons.Tag;
  return (
    <span className="flex size-8 items-center justify-center rounded-[10px] bg-field">
      <Icon className="size-[15px] text-brand" />
    </span>
  );
}

const columns: ColumnDef<AdminCategory, any>[] = [
  {
    id: "name",
    accessorKey: "name",
    header: "Nama Kategori",
    cell: ({ row }) => (
      <span className="flex items-center gap-2.5">
        <CategoryIcon name={row.original.icon} />
        <span className="text-xs font-semibold text-ink">{row.original.name}</span>
      </span>
    ),
  },
  {
    accessorKey: "type",
    header: "Tipe",
    cell: ({ getValue }) => <StatusBadge label={getValue<string>()} />,
  },
  {
    accessorKey: "usage",
    header: "Pemakaian",
    cell: ({ getValue }) => (
      <span className="text-ink">{getValue<number>().toLocaleString("id-ID")}x</span>
    ),
  },
  {
    id: "actions",
    header: "Aksi",
    enableSorting: false,
    cell: ({ row, table }) => {
      const meta = table.options.meta as { onDelete: (item: AdminCategory) => void };
      return (
        <span className="flex items-center gap-2">
          <Button variant="ghost" size="icon-sm" aria-label="Ubah kategori" className="text-subtle hover:text-brand">
            <Pencil />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label="Hapus kategori"
            className="text-bad hover:bg-badbg"
            onPress={() => meta.onDelete(row.original)}
          >
            <Trash2 />
          </Button>
        </span>
      );
    },
  },
];

export default function KategoriPage() {
  const type = useTableStore((state) => state.tables.kategori?.filters.type ?? "semua");
  const setFilter = useTableStore((state) => state.setFilter);

  const [open, setOpen] = useState(false);
  const { data = [], isLoading } = useCategories(type);
  const createCategory = useCreateCategory();
  const deleteCategory = useDeleteCategory();

  const form = useForm<CategoryInput>({
    resolver: zodResolver(categorySchema),
    defaultValues: { name: "", type: "Pengeluaran", icon: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await createCategory.mutateAsync(values);
    form.reset({ name: "", type: "Pengeluaran", icon: "" });
    setOpen(false);
  });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Kelola Kategori"
        subtitle="14 kategori aktif digunakan pengguna"
        action={
          <DialogTrigger isOpen={open} onOpenChange={setOpen}>
            <Button className="h-10 gap-1.5 rounded-[10px] bg-brand px-3.5 text-xs font-bold text-[#FFF7F2] hover:bg-brand/90">
              <Plus className="size-3.5" />
              Tambah Kategori
            </Button>

            <Dialog className="rounded-2xl p-0 sm:max-w-md">
              <form onSubmit={onSubmit} className="flex flex-col gap-4 p-5">
                <DialogHeader>
                  <DialogTitle className="text-base font-extrabold text-ink">
                    Tambah Kategori
                  </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] font-semibold text-ink">Nama kategori</Label>
                  <Input {...form.register("name")} placeholder="Contoh: Makanan & Minuman" aria-label="Nama kategori" className="h-10 rounded-[10px] border-line bg-field text-xs" />
                  {form.formState.errors.name && (
                    <span className="text-[10px] text-bad">{form.formState.errors.name.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] font-semibold text-ink">Tipe</Label>
                  <Controller
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <Select selectedKey={field.value} onSelectionChange={(key) => field.onChange(String(key))} aria-label="Tipe kategori">
                        <SelectTrigger className="h-10 rounded-[10px] border-line bg-field px-3 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem id="Pemasukan">Pemasukan</SelectItem>
                          <SelectItem id="Pengeluaran">Pengeluaran</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] font-semibold text-ink">Icon (opsional)</Label>
                  <Input {...form.register("icon")} placeholder="utensils, bus, wallet..." aria-label="Nama ikon kategori" className="h-10 rounded-[10px] border-line bg-field text-xs" />
                </div>

                <DialogFooter className="mx-0 mb-0 gap-2 border-0 bg-transparent p-0">
                  <Button variant="ghost" type="button" className="h-10 rounded-[10px] text-xs text-subtle" onPress={() => setOpen(false)}>
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    isDisabled={createCategory.isPending}
                    className="h-10 gap-1.5 rounded-[10px] bg-brand px-4 text-xs font-bold text-[#FFF7F2] hover:bg-brand/90"
                  >
                    <Plus className="size-3.5" />
                    {createCategory.isPending ? "Menyimpan..." : "Simpan"}
                  </Button>
                </DialogFooter>
              </form>
            </Dialog>
          </DialogTrigger>
        }
      />

      <Tabs selectedKey={type} onSelectionChange={(key) => setFilter("kategori", "type", String(key))} aria-label="Filter kategori" className="w-full">
        <TabsList variant="line" className="w-full justify-start gap-1 rounded-none border-b border-line p-0">
          {TABS.map(({ id, label, icon: Icon }) => (
            <TabsTrigger
              key={id}
              id={id}
              className="h-10 flex-none rounded-none px-3.5 text-[11px] font-semibold text-subtle after:bottom-0 after:h-0.5 after:bg-brand data-selected:bg-tint data-selected:text-brand"
            >
              <Icon className="size-3.5" />
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card className="gap-0 rounded-2xl py-0 ring-1 ring-line">
        <div className="p-4">
          <DataTable<AdminCategory>
            id="kategori"
            columns={columns}
            data={data}
            isLoading={isLoading}
            searchPlaceholder="Cari kategori..."
            emptyMessage="Belum ada kategori pada filter ini."
            meta={{ onDelete: (item: AdminCategory) => deleteCategory.mutate(item.id) }}
          />
        </div>
      </Card>
    </div>
  );
}
