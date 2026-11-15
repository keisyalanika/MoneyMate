import { Badge } from "@/components/ui/badge";

export function StatusBadge({ label }: { label: string }) {
  return (
    <Badge className="h-6 rounded-full border-transparent bg-tint px-2.5 text-[10px] font-semibold text-brand">
      {label}
    </Badge>
  );
}
