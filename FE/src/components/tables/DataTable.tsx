"use client";

import { useState, type ReactNode } from "react";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import {
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTableStore } from "@/stores/tableStore";

interface DataTableProps<T> {
  id: string;
  columns: ColumnDef<T, any>[];
  data: T[];
  isLoading?: boolean;
  searchPlaceholder?: string;
  toolbar?: ReactNode;
  pageSize?: number;
  emptyMessage?: string;
  meta?: Record<string, unknown>;
}

export function DataTable<T>({
  id,
  columns,
  data,
  isLoading = false,
  searchPlaceholder = "Cari...",
  toolbar,
  pageSize = 8,
  emptyMessage = "Belum ada data.",
  meta,
}: DataTableProps<T>) {
  const search = useTableStore((state) => state.tables[id]?.search ?? "");
  const pageIndex = useTableStore((state) => state.tables[id]?.pageIndex ?? 0);
  const setSearch = useTableStore((state) => state.setSearch);
  const setPageIndex = useTableStore((state) => state.setPageIndex);

  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data,
    columns,
    meta,
    state: { sorting, globalFilter: search, pagination: { pageIndex, pageSize } },
    onSortingChange: setSorting,
    onGlobalFilterChange: (value) => setSearch(id, String(value ?? "")),
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(id, next.pageIndex);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rows = table.getRowModel().rows;
  const filteredCount = table.getFilteredRowModel().rows.length;
  const from = filteredCount === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min(filteredCount, (pageIndex + 1) * pageSize);
  const canPrev = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative w-full sm:w-[320px]">
          <Search className="absolute left-3 top-1/2 size-[15px] -translate-y-1/2 text-subtle" />
          <Input
            value={search}
            onChange={(event) => {
              table.setGlobalFilter(event.target.value);
              table.setPageIndex(0);
            }}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="h-10 rounded-[10px] border-line bg-surface pl-9 text-xs"
          />
        </div>
        {toolbar}
      </div>

      <Table aria-label="Data tabel" className="w-full min-w-[720px] text-left">
        <TableHeader className="[&_tr]:bg-field [&_th:first-child]:rounded-l-lg [&_th:last-child]:rounded-r-lg">
          {table.getHeaderGroups()[0]?.headers.map((header) => (
            <TableHead
              key={header.id}
              isRowHeader={header.index === 0}
              className="h-9 px-3 text-[10px] font-bold tracking-wide text-subtle"
            >
              {header.isPlaceholder ? null : header.column.getCanSort() ? (
                <button
                  type="button"
                  onClick={header.column.getToggleSortingHandler()}
                  className="flex items-center gap-1.5 uppercase"
                >
                  {flexRender(header.column.columnDef.header, header.getContext())}
                  {header.column.getIsSorted() === "asc" ? (
                    <ArrowUp className="size-3" />
                  ) : header.column.getIsSorted() === "desc" ? (
                    <ArrowDown className="size-3" />
                  ) : (
                    <ChevronsUpDown className="size-3" />
                  )}
                </button>
              ) : (
                <span className="uppercase">
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </span>
              )}
            </TableHead>
          ))}
        </TableHeader>

        <TableBody items={rows}>
          {(row) => (
            <TableRow
              key={row.id}
              className="border-b border-line-soft outline-none last:border-0"
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="px-3 py-3 text-[11px]">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          )}
        </TableBody>
      </Table>

      {isLoading && (
        <div className="flex flex-col gap-2 py-2">
          {[0, 1, 2].map((row) => (
            <div key={row} className="h-9 w-full animate-pulse rounded-lg bg-field" />
          ))}
        </div>
      )}

      {!isLoading && filteredCount === 0 && (
        <div className="flex h-24 items-center justify-center rounded-xl bg-field text-xs text-subtle">
          {emptyMessage}
        </div>
      )}

      <div className="flex w-full flex-col gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <span className="text-[11px] text-subtle">
          Menampilkan {from}–{to} dari {filteredCount} data
        </span>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon-sm"
            isDisabled={!canPrev}
            onPress={() => table.previousPage()}
            className={
              !canPrev
                ? "border-transparent bg-field text-[#CDBFB6] disabled:opacity-100"
                : "border-line text-brand"
            }
            aria-label="Halaman sebelumnya"
          >
            <ChevronLeft />
          </Button>
          <span className="flex size-8 items-center justify-center rounded-lg bg-brand text-[11px] font-bold text-[#FFF7F2]">
            {pageIndex + 1}
          </span>
          <span className="px-1 text-[11px] text-subtle">/ {Math.max(table.getPageCount(), 1)}</span>
          <Button
            variant="outline"
            size="icon-sm"
            isDisabled={!canNext}
            onPress={() => table.nextPage()}
            className={
              !canNext
                ? "border-transparent bg-field text-[#CDBFB6] disabled:opacity-100"
                : "border-line text-brand"
            }
            aria-label="Halaman berikutnya"
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
