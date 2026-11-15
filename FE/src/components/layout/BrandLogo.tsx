import { cn } from "@/lib/utils";

export function BrandLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand",
        className
      )}
      aria-hidden
    >
      <svg viewBox="0 0 44 44" className="size-11" fill="none">
        <path
          d="M14 30V15.5l8 9.5 8-9.5V30"
          stroke="#FFF7F2"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
