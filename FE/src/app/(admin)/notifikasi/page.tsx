"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, Trash2 } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { DataTable } from "@/components/tables/DataTable";
import {
  useDeleteNotification,
  useNotifications,
  useSendNotification,
} from "@/hooks/queries/useNotifications";
import { notificationSchema, type NotificationInput } from "@/lib/validators";
import { useTableStore } from "@/stores/tableStore";
import type { AdminNotification } from "@/types";

const columns: ColumnDef<AdminNotification, any>[] = [
  {
    accessorKey: "title",
    header: "Judul",
    cell: ({ getValue }) => (
      <span className="font-semibold text-ink">{getValue<string>()}</span>
    ),
  },
  {
    accessorKey: "message",
    header: "Pesan",
    enableSorting: false,
    cell: ({ getValue }) => <span className="text-subtle">{getValue<string>()}</span>,
  },
  {
    accessorKey: "audience",
    header: "Penerima",
    cell: ({ getValue }) => <span className="text-ink">{getValue<string>()}</span>,
  },
  {
    accessorKey: "type",
    header: "Jenis",
    cell: ({ getValue }) => <StatusBadge label={getValue<string>()} />,
  },
  {
    accessorKey: "sentAt",
    header: "Tanggal",
    cell: ({ getValue }) => <span className="text-ink">{getValue<string>()}</span>,
  },
  {
    id: "actions",
    header: "Aksi",
    enableSorting: false,
    cell: ({ row, table }) => {
      const meta = table.options.meta as { onDelete: (item: AdminNotification) => void };
      return (
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Hapus notifikasi"
          className="text-bad hover:bg-badbg"
          onPress={() => meta.onDelete(row.original)}
        >
          <Trash2 />
        </Button>
      );
    },
  },
];

export default function NotifikasiPage() {
  const search = useTableStore((state) => state.tables.notifikasi?.search ?? "");
  const type = useTableStore((state) => state.tables.notifikasi?.filters.type ?? "all");
  const setFilter = useTableStore((state) => state.setFilter);

  const [open, setOpen] = useState(false);
  const { data = [], isLoading } = useNotifications({ search, type });
  const sendNotification = useSendNotification();
  const deleteNotification = useDeleteNotification();

  const form = useForm<NotificationInput>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      audience: "Semua pengguna",
      title: "",
      message: "",
      type: "Info",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    await sendNotification.mutateAsync(values);
    form.reset({ audience: "Semua pengguna", title: "", message: "", type: "Info" });
    setOpen(false);
  });

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Notifikasi Pengguna"
        subtitle="Kirim pengumuman dan pengingat ke aplikasi mobile pengguna"
        action={
          <DialogTrigger isOpen={open} onOpenChange={setOpen}>
            <Button className="h-10 gap-1.5 rounded-[10px] bg-brand px-3.5 text-xs font-bold text-[#FFF7F2] hover:bg-brand/90">
              <Send className="size-3.5" />
              Kirim Notifikasi
            </Button>

            <Dialog className="rounded-2xl p-0 sm:max-w-md">
              <form onSubmit={onSubmit} className="flex flex-col gap-4 p-5">
                <DialogHeader>
                  <DialogTitle className="text-base font-extrabold text-ink">
                    Kirim Notifikasi
                  </DialogTitle>
                </DialogHeader>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] font-semibold text-ink">Penerima</Label>
                  <Controller
                    control={form.control}
                    name="audience"
                    render={({ field }) => (
                      <Select selectedKey={field.value} onSelectionChange={(key) => field.onChange(String(key))} aria-label="Penerima notifikasi">
                        <SelectTrigger className="h-10 rounded-[10px] border-line bg-field px-3 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem id="Semua pengguna">Semua pengguna (1.248)</SelectItem>
                          <SelectItem id="Pengguna terpilih">Pengguna terpilih</SelectItem>
                          <SelectItem id="Pengguna baru">Pengguna baru</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] font-semibold text-ink">Judul</Label>
                  <Input {...form.register("title")} placeholder="Contoh: Pemeliharaan Sistem" aria-label="Judul notifikasi" className="h-10 rounded-[10px] border-line bg-field text-xs" />
                  {form.formState.errors.title && (
                    <span className="text-[10px] text-bad">{form.formState.errors.title.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] font-semibold text-ink">Pesan</Label>
                  <Textarea {...form.register("message")} placeholder="Tulis pesan untuk pengguna..." aria-label="Pesan notifikasi" className="min-h-24 rounded-[10px] border-line bg-field text-xs" />
                  {form.formState.errors.message && (
                    <span className="text-[10px] text-bad">{form.formState.errors.message.message}</span>
                  )}
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-[11px] font-semibold text-ink">Tipe Notifikasi</Label>
                  <Controller
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <div className="flex gap-2">
                        {(["Info", "Peringatan", "Promo"] as const).map((option) => (
                          <Button
                            key={option}
                            type="button"
                            variant={field.value === option ? "default" : "outline"}
                            className={
                              field.value === option
                                ? "h-8 rounded-full bg-brand px-3.5 text-[11px] font-semibold text-[#FFF7F2] hover:bg-brand/90"
                                : "h-8 rounded-full border-line px-3.5 text-[11px] font-semibold text-subtle"
                            }
                            onPress={() => field.onChange(option)}
                          >
                            {option}
                          </Button>
                        ))}
                      </div>
                    )}
                  />
                </div>

                <DialogFooter className="mx-0 mb-0 gap-2 border-0 bg-transparent p-0">
                  <Button variant="ghost" type="button" className="h-10 rounded-[10px] text-xs text-subtle" onPress={() => setOpen(false)}>
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    isDisabled={sendNotification.isPending}
                    className="h-10 gap-1.5 rounded-[10px] bg-brand px-4 text-xs font-bold text-[#FFF7F2] hover:bg-brand/90"
                  >
                    <Send className="size-3.5" />
                    {sendNotification.isPending ? "Mengirim..." : "Kirim Notifikasi"}
                  </Button>
                </DialogFooter>
              </form>
            </Dialog>
          </DialogTrigger>
        }
      />

      <Card className="gap-0 rounded-2xl py-0 ring-1 ring-line">
        <div className="p-4">
          <DataTable<AdminNotification>
            id="notifikasi"
            columns={columns}
            data={data}
            isLoading={isLoading}
            searchPlaceholder="Cari judul atau pesan notifikasi..."
            emptyMessage="Belum ada notifikasi."
            meta={{ onDelete: (item: AdminNotification) => deleteNotification.mutate(item.id) }}
            toolbar={
              <Select
                selectedKey={type}
                onSelectionChange={(key) => setFilter("notifikasi", "type", String(key))}
                aria-label="Filter tipe notifikasi"
                className="w-[150px]"
              >
                <SelectTrigger className="h-10 rounded-[10px] border-line bg-surface px-3 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem id="all">Semua tipe</SelectItem>
                  <SelectItem id="Info">Info</SelectItem>
                  <SelectItem id="Peringatan">Peringatan</SelectItem>
                  <SelectItem id="Promo">Promo</SelectItem>
                </SelectContent>
              </Select>
            }
          />
        </div>
      </Card>
    </div>
  );
}
