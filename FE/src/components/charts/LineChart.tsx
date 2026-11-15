import type { UserGrowthPoint } from "@/types";

const W = 620;
const H = 150;
const PAD_X = 20;
const TOP = 34;
const BOTTOM = 126;

export function LineChart({ data }: { data: UserGrowthPoint[] }) {
  const max = Math.max(...data.map((d) => d.count));
  const min = Math.min(...data.map((d) => d.count));
  const span = Math.max(1, max - min);
  const stepX = data.length > 1 ? (W - PAD_X * 2) / (data.length - 1) : 0;

  const points = data.map((item, index) => {
    const x = PAD_X + index * stepX;
    const ratio = (item.count - min) / span;
    const y = BOTTOM - ratio * (BOTTOM - TOP);
    return { x, y, ...item };
  });

  const poly = points.map((p) => `${p.x},${p.y}`).join(" ");
  const area = `${poly} ${points[points.length - 1].x},${H} ${points[0].x},${H}`;
  const last = points[points.length - 1];

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Pertumbuhan pengguna">
      <defs>
        <linearGradient id="growth-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#592314" stopOpacity="0.10" />
          <stop offset="100%" stopColor="#592314" stopOpacity="0.02" />
        </linearGradient>
      </defs>

      {[TOP, (TOP + BOTTOM) / 2, BOTTOM].map((y) => (
        <line key={y} x1={0} x2={W} y1={y} y2={y} stroke="#F4F1EF" strokeWidth={1} />
      ))}

      <polygon points={area} fill="url(#growth-area)" />
      <polyline
        points={poly}
        fill="none"
        stroke="#592314"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {points.map((p, i) => (
        <circle
          key={p.month}
          cx={p.x}
          cy={p.y}
          r={i === points.length - 1 ? 5.5 : 4}
          fill={i === points.length - 1 ? "#592314" : "#FAF6F0"}
          stroke="#592314"
          strokeWidth={2}
        />
      ))}

      <g>
        <rect x={last.x - 74} y={2} width={78} height={20} rx={8} fill="#FFF7F2" />
        <text x={last.x - 35} y={16} textAnchor="middle" fontSize={9} fontWeight={700} fill="#D95B27">
          {last.count} pengguna baru
        </text>
      </g>
    </svg>
  );
}
