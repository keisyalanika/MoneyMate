"use client";

import { CheckCircle2, Info, X, XCircle } from "lucide-react";
import { useToastStore } from "@/stores/toastStore";

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const dismiss = useToastStore((state) => state.dismiss);

  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[100] flex w-80 flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-2.5 rounded-xl border border-line bg-surface p-3 shadow-lg"
        >
          {toast.tone === "success" && <CheckCircle2 className="mt-0.5 size-4 text-ok" />}
          {toast.tone === "error" && <XCircle className="mt-0.5 size-4 text-bad" />}
          {toast.tone === "info" && <Info className="mt-0.5 size-4 text-brand" />}
          <p className="flex-1 text-[11px] leading-snug text-ink">{toast.message}</p>
          <button
            type="button"
            onClick={() => dismiss(toast.id)}
            className="text-muted hover:text-ink"
            aria-label="Tutup notifikasi"
          >
            <X className="size-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
