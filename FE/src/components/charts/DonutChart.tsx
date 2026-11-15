import type { CategoryUsage } from "@/types";
import { formatNumber } from "@/lib/format";

const COLORS = ["#592314", "#D95B27", "#E5B73F", "#A88F82", "#EFE8E0"];

export function DonutChart({ data }: { data: CategoryUsage[] }) {
  const size = 168;
  const stroke = 34;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const total = data.reduce((sum, item) => sum + item.count, 0);

  let offset = 0;

  return (
    <div className="flex flex-col items-center gap-5 md:flex-row">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {data.map((item, index) => {
            const ratio = total > 0 ? item.count / total : 0;
            const dash = ratio * circumference;
            const circle = (
              <circle
                key={item.name}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={COLORS[index % COLORS.length]}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset}
                strokeLinecap="butt"
              />
            );
            offset += dash;
            return circle;
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[19px] font-extrabold text-ink">{formatNumber(total)}</span>
          <span className="text-[9px] text-subtle">pemakaian</span>
        </div>
      </div>

      <div className="flex w-full min-w-0 flex-1 flex-col gap-2.5">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2">
            <span
              className="size-2 shrink-0 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="flex-1 truncate text-[11px] text-ink">{item.name}</span>
            <span className="text-[11px] font-bold text-subtle">{item.percentage}%</span>
          </div>
        ))}
        <div className="h-px w-full bg-line" />
        <p className="text-[9px] leading-snug text-subtle">
          Jumlah transaksi per kategori, bukan nominal.
        </p>
      </div>
    </div>
  );
}
