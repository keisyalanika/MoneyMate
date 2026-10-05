import React, { useState } from 'react';

interface OverviewPageProps {
  onTriggerPdfToast: () => void;
  fmtMoney: (idr: string, usd: string) => string;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onTriggerPdfToast, fmtMoney }) => {
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number; y: number; day: string; val: string } | null>(null);

  const chartData = [
    { day: 'Sen', val: 'Rp 45.000.000', usdVal: '$ 2,903', x: 25, y: 120 },
    { day: 'Sel', val: 'Rp 68.500.000', usdVal: '$ 4,419', x: 95, y: 70 },
    { day: 'Rab', val: 'Rp 52.000.000', usdVal: '$ 3,354', x: 165, y: 105 },
    { day: 'Kam', val: 'Rp 94.200.000', usdVal: '$ 6,077', x: 235, y: 25 },
    { day: 'Jum', val: 'Rp 81.000.000', usdVal: '$ 5,225', x: 305, y: 50 },
    { day: 'Sab', val: 'Rp 40.000.000', usdVal: '$ 2,580', x: 375, y: 130 },
    { day: 'Min', val: 'Rp 65.000.000', usdVal: '$ 4,193', x: 445, y: 80 }
  ];

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#2D2825]">Dashboard Overview</h1>
            <span className="px-2 py-0.5 text-[9px] font-semibold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live Data Sync
            </span>
          </div>
          <p className="text-[11px] text-[#8C7A70] mt-0.5">Konsolidasi metrik perbankan mikro & pemantauan tren finansial real-time.</p>
        </div>

        <button onClick={onTriggerPdfToast} className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#5C2D16] hover:bg-[#462211] text-white text-xs font-bold rounded-xl shadow transition-all shrink-0">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          Unduh Laporan PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#8C7A70]">Total Pengguna Aktif</span>
            <div className="w-8 h-8 rounded-xl bg-[#F8F4F0] flex items-center justify-center text-[#5C2D16]">👤</div>
          </div>
          <div className="text-2xl font-extrabold text-[#2D2825]">1,245</div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#F0E8E4]">
            <span className="text-emerald-600 font-semibold">▲ +12.5% vs 30 hari lalu</span>
            <span className="text-[#8C7A70]">Target bulanan: <strong className="text-[#2D2825]">83% tercapai</strong></span>
          </div>
        </div>

        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#8C7A70]">Total Transaksi Tercatat</span>
            <div className="w-8 h-8 rounded-xl bg-[#F8F4F0] flex items-center justify-center text-[#5C2D16]">📋</div>
          </div>
          <div className="text-2xl font-extrabold text-[#2D2825]">34,500</div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#F0E8E4]">
            <span className="text-emerald-600 font-semibold">▲ +8.2% vs 30 hari lalu</span>
            <span className="text-[#8C7A70]">Success rate: <strong className="text-emerald-600 font-semibold">99.4%</strong></span>
          </div>
        </div>

        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[#8C7A70]">Volume Arus Kas Tercatat</span>
            <div className="w-8 h-8 rounded-xl bg-[#F8F4F0] flex items-center justify-center text-[#5C2D16]">💳</div>
          </div>
          <div className="text-2xl font-extrabold text-[#2D2825]">{fmtMoney('Rp 4.5 M', '$ 290.3 K')}</div>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#F0E8E4]">
            <span className="text-emerald-600 font-semibold">▲ +15.1% vs 30 hari lalu</span>
            <span className="text-[#8C7A70]">Net flow: <strong className="text-emerald-600 font-semibold">Surplus</strong></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm flex flex-col justify-between relative">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-sm font-bold text-[#2D2825]">Statistik Finansial (Mingguan)</h2>
              <p className="text-[10px] text-[#8C7A70]">Arahkan kursor pada titik grafik untuk detail transaksi per hari.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#5C2D16]">
                <span className="w-2 h-2 rounded-full bg-[#5C2D16]"></span> Volume Transaksi
              </span>
            </div>
          </div>

          <div className="relative w-full h-48 mt-2">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 470 160">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5C2D16" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="#5C2D16" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path fill="url(#chartGrad)" d="M 25 120 Q 95 70, 165 105 T 305 50 T 445 80 L 445 160 L 25 160 Z" />
              <path fill="none" stroke="#5C2D16" strokeWidth="3" strokeLinecap="round" d="M 25 120 Q 95 70, 165 105 T 305 50 T 445 80" />

              {chartData.map((pt, idx) => (
                <g key={idx} className="cursor-pointer group">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="5"
                    className="fill-white stroke-[#5C2D16] stroke-[3] transition-all duration-200 group-hover:r-7 group-hover:fill-[#5C2D16]"
                    onMouseEnter={() => setHoveredPoint({ x: pt.x, y: pt.y, day: pt.day, val: fmtMoney(pt.val, pt.usdVal) })}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />
                </g>
              ))}
            </svg>

            {hoveredPoint && (
              <div
                className="absolute z-20 bg-[#2D2825] text-white px-2.5 py-1.5 rounded-xl shadow-xl text-[10px] -translate-x-1/2 -translate-y-full pointer-events-none transition-all duration-150 animate-fadeIn border border-[#5C2D16]/40"
                style={{ left: `${(hoveredPoint.x / 470) * 100}%`, top: `${(hoveredPoint.y / 160) * 100 - 10}%` }}
              >
                <div className="font-bold text-[#E6D0C7]">{hoveredPoint.day}</div>
                <div className="text-white font-extrabold">{hoveredPoint.val}</div>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center text-[10px] text-[#8C7A70] px-2 pt-2 border-t border-[#F0E8E4]">
            <span>Senin</span>
            <span>Selasa</span>
            <span>Rabu</span>
            <span>Kamis</span>
            <span>Jumat</span>
            <span>Sabtu</span>
            <span>Minggu</span>
          </div>
        </div>

        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#2D2825]">Ringkasan Sistem</h2>
            <p className="text-[10px] text-[#8C7A70]">Metrik kehandalan & aktivitas pengguna saat ini.</p>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center p-2 rounded-xl bg-[#FAF7F4] border border-[#E5DDD8]">
              <span className="text-[#8C7A70]">Rata-rata Transaksi/Hari</span>
              <span className="font-bold text-[#2D2825]">4,928 tx</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-[#FAF7F4] border border-[#E5DDD8]">
              <span className="text-[#8C7A70]">Rasio Defisit Mahasiswa</span>
              <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">14.2%</span>
            </div>
            <div className="flex justify-between items-center p-2 rounded-xl bg-[#FAF7F4] border border-[#E5DDD8]">
              <span className="text-[#8C7A70]">Integrasi API Bank</span>
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">Active (100%)</span>
            </div>
          </div>

          <div className="p-3 bg-[#FAF4F0] border border-[#E8DCD8] rounded-xl text-[11px] text-[#5C2D16] space-y-1">
            <div className="font-bold flex items-center gap-1.5">
              <span>💡 Insight Otomatis:</span>
            </div>
            <p className="text-[10px] leading-relaxed text-[#6E5D53]">
              Volume transaksi melonjak 28% pada hari Kamis pasca pencairan dana beasiswa universitas.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
