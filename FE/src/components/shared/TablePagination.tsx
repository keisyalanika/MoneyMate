"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TablePagination({
  label,
  pages,
  active = 1,
}: {
  label: string;
  pages: number[];
  active?: number;
}) {
  const last = pages[pages.length - 1];
  const prevDisabled = active <= pages[0];
  const nextDisabled = active >= last;

  return (
    <div className="flex w-full items-center justify-between pt-2">
      <span className="text-[11px] text-subtle">{label}</span>
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="icon-sm"
          isDisabled={prevDisabled}
          className={
            prevDisabled
              ? "border-transparent bg-field text-[#CDBFB6] disabled:opacity-100"
              : "border-line text-brand"
          }
          aria-label="Halaman sebelumnya"
        >
          <ChevronLeft />
        </Button>

        {pages.map((page) =>
          page === active ? (
            <span
              key={page}
              className="flex size-8 items-center justify-center rounded-lg bg-brand text-[11px] font-bold text-[#FFF7F2]"
            >
              {page}
            </span>
          ) : (
            <Button
              key={page}
              variant="ghost"
              size="icon-sm"
              className="text-[11px] text-ink"
              aria-label={`Halaman ${page}`}
            >
              {page}
            </Button>
          )
        )}

        <span className="px-1 text-[11px] text-subtle">…</span>

        <Button
          variant="outline"
          size="icon-sm"
          isDisabled={nextDisabled}
          className={
            nextDisabled
              ? "border-transparent bg-field text-[#CDBFB6] disabled:opacity-100"
              : "border-line text-brand"
          }
          aria-label="Halaman berikutnya"
        >
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
