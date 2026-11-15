import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  note,
  icon: Icon,
  tone = "brand",
}: {
  label: string;
  value: string;
  note: string;
  icon: LucideIcon;
  tone?: "brand" | "success" | "accent" | "gold";
}) {
  const tones = {
    brand: "bg-tint text-brand",
    success: "bg-okbg text-ok",
    accent: "bg-[#FFF1E8] text-orange",
    gold: "bg-[#FFF7D4] text-[#A88F82]",
  } as const;

  return (
    <div className="flex flex-1 flex-col gap-1.5 rounded-2xl border border-line bg-surface px-5 py-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-subtle">{label}</span>
        <span className={cn("flex size-[30px] items-center justify-center rounded-[9px]", tones[tone])}>
          <Icon className="size-[15px]" />
        </span>
      </div>
      <span className="text-[26px] font-extrabold leading-tight text-ink">{value}</span>
      <span
        className={cn(
          "text-[10px]",
          note.startsWith("+") ? "text-ok" : note.includes("perlu") ? "text-orange" : "text-subtle"
        )}
      >
        {note}
      </span>
    </div>
  );
}
