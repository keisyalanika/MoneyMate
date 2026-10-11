import React from 'react';

interface AnalyticsPageProps {
  fmtMoney: (idr: string, usd: string) => string;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ fmtMoney }) => {
  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto w-full animate-fadeIn text-xs">
      <div>
        <div className="text-[11px] text-[#8C7A70] flex items-center gap-1 mb-0.5">
          <span>Analisis</span>
          <span>›</span>
          <span className="font-semibold text-[#5C2D16]">Statistik Finansial Mahasiswa</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#E6D0C7] text-[#5C2D16] rounded uppercase">
              📄 LAPORAN ANALISIS MAKRO FINANSIAL
            </span>
            <h1 className="text-2xl font-bold text-[#2D2825] mt-1">Statistik & Tren Finansial Mahasiswa</h1>
            <p className="text-xs text-[#8C7A70] mt-0.5 max-w-2xl">
              Eksplorasi tren arus kas masuk, proporsi pengeluaran per kategori mahasiswa, dan tren tabungan per semester untuk perumusan program literasi kampus.
            </p>
          </div>

          <div className="px-3 py-1.5 bg-white border border-[#E5DDD8] rounded-xl text-xs font-semibold text-[#5C2D16] shadow-sm shrink-0 flex items-center gap-1.5">
            📅 Bulan Ini: Oktober 2026
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C7A70] uppercase">TOTAL PERPUTARAN UANG</span>
              <span className="w-7 h-7 rounded-xl bg-[#FAF4F0] text-[#5C2D16] flex items-center justify-center font-bold text-xs">🔄</span>
            </div>
            <div className="text-xl font-extrabold text-[#2D2825] mt-1">{fmtMoney('Rp 5.090.000.000', '$ 328.380')}</div>
            <p className="text-[10px] text-[#8C7A70] mt-0.5">Arus kas gabungan di dompet mahasiswa</p>
          </div>
          <div className="pt-2 border-t border-[#F0E8E4] text-[10px] font-bold text-emerald-700 flex items-center gap-1">
            <span className="bg-emerald-100 px-1.5 py-0.5 rounded">↑ +12% MoM</span> vs Rp 4.5M bln lalu
          </div>
        </div>

        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C7A70] uppercase">RASIO TABUNGAN RATA-RATA</span>
              <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">📈</span>
            </div>
            <div className="text-xl font-extrabold text-[#2D2825] mt-1">18.2% <span className="text-xs font-normal text-[#8C7A70]">/uang saku</span></div>
            <p className="text-[10px] text-[#8C7A70] mt-0.5">Standar ideal kampus: minimal 15.0%</p>
          </div>
          <div className="pt-2 border-t border-[#F0E8E4] flex items-center justify-between text-[10px]">
            <div className="w-24 h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <span className="font-bold text-emerald-700">Tercapai</span>
          </div>
        </div>

        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C7A70] uppercase">MEDIAN PENGELUARAN HARIAN</span>
              <span className="w-7 h-7 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold text-xs">☕</span>
            </div>
            <div className="text-xl font-extrabold text-[#2D2825] mt-1">{fmtMoney('Rp 42.500', '$ 2.74')} <span className="text-xs font-normal text-[#8C7A70]">/hari</span></div>
            <p className="text-[10px] text-[#8C7A70] mt-0.5">Kebutuhan makan, fotokopi, & bensin</p>
          </div>
          <div className="pt-2 border-t border-[#F0E8E4] text-[10px] text-[#8C7A70]">
            Batas aman rekomendasi: <strong className="text-[#5C2D16]">Rp 45.000</strong>
          </div>
        </div>

        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C7A70] uppercase">SKOR KESEHATAN FINANSIAL</span>
              <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">🛡️</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-xl font-extrabold text-[#2D2825]">74</span>
              <span className="text-xs font-semibold text-[#8C7A70]">/100</span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded">Cukup Sehat</span>
            </div>
            <p className="text-[10px] text-[#8C7A70] mt-0.5">Evaluasi kedisiplinan & dana darurat</p>
          </div>
          <div className="pt-2 border-t border-[#F0E8E4] text-[10px] font-bold text-emerald-700">
            ↑ +4.1 pts sejak awal semester
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-sm font-bold text-[#2D2825]">Tren Pemasukan vs Pengeluaran</h2>
                <p className="text-[10px] text-[#8C7A70]">Data tren agregat perputaran kas bulanan (Mei 2026 – Oktober 2026)</p>
              </div>

              <div className="flex items-center gap-3 text-[10px] font-medium">
                <span className="flex items-center gap-1.5 text-[#5C2D16] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#5C2D16]"></span> Pemasukan (Kiriman & Freelance)
                </span>
                <span className="flex items-center gap-1.5 text-[#C25E38] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#C25E38]"></span> Pengeluaran (Kos, Makan & Kuliah)
                </span>
              </div>
            </div>

            <div className="relative h-44 w-full pt-3">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 140" preserveAspectRatio="none">
                <line x1="0" y1="20" x2="500" y2="20" stroke="#F0E8E4" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="500" y2="60" stroke="#F0E8E4" strokeDasharray="3 3" />
                <line x1="0" y1="100" x2="500" y2="100" stroke="#F0E8E4" strokeDasharray="3 3" />
                <line x1="0" y1="130" x2="500" y2="130" stroke="#E5DDD8" />

                <path d="M 30 90 L 110 80 L 190 60 L 270 45 L 350 40 L 450 35" fill="none" stroke="#5C2D16" strokeWidth="3" />
                <circle cx="450" cy="35" r="4" fill="#5C2D16" />

                <path d="M 30 115 L 110 100 L 190 85 L 270 70 L 350 65 L 450 60" fill="none" stroke="#C25E38" strokeWidth="2.5" strokeDasharray="4 2" />
                <circle cx="450" cy="60" r="4" fill="#C25E38" />
              </svg>

              <div className="flex items-center justify-between text-[10px] font-semibold text-[#8C7A70] px-4 pt-1">
                <span>Mei</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Agu</span>
                <span>Sep</span>
                <span className="font-bold text-[#5C2D16]">Okt 2026</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FAF4F0] border border-[#E6D4CB] rounded-xl p-2.5 text-[11px] flex items-center justify-between">
            <span className="text-[#554A43] flex items-center gap-1.5">
              <span className="font-bold text-[#5C2D16]">⚡ Pola Siklus:</span> Pengeluaran memuncak di W1 (bayar kos/UKT) & W4 (persiapan akhir bulan).
            </span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Surplus Kas: +Rp 842 Jt</span>
          </div>
        </div>

        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-sm font-bold text-[#2D2825]">Proporsi Pengeluaran</h2>
                <p className="text-[10px] text-[#8C7A70]">Berdasarkan total Rp 1.840.000.000 (Okt 2026)</p>
              </div>
              <span className="px-2 py-0.5 text-[9px] font-bold bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] rounded">6 Kategori Utama</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-2">
              <div className="flex flex-col items-center justify-center">
                <div className="w-28 h-28 rounded-full border-[10px] border-[#5C2D16] flex items-center justify-center border-t-amber-500 border-r-[#C25E38] border-b-emerald-600 shadow-inner">
                  <div className="text-center">
                    <div className="text-[8px] text-[#8C7A70] uppercase font-bold">ALOKASI</div>
                    <div className="text-xs font-extrabold text-[#2D2825]">100%</div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 text-[10px]">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#5C2D16]"></span> Makanan & Minuman</span>
                  <strong className="font-mono">38%</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#C25E38]"></span> Tempat Tinggal & Kos</span>
                  <strong className="font-mono">24%</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Akademik & Kuliah</span>
                  <strong className="font-mono">15%</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-600"></span> Transportasi Kampus</span>
                  <strong className="font-mono">9%</strong>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-700"></span> Nongkrong & Hiburan</span>
                  <strong className="font-mono">8%</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#F0E8E4] flex items-center justify-between text-[11px]">
            <span className="text-[#8C7A70]">Pengeluaran Dominan: <strong className="text-[#5C2D16]">Makanan & Kos (62%)</strong></span>
            <button className="font-bold text-[#5C2D16] hover:underline">Lihat Sub-Kategori Terperinci →</button>
          </div>
        </div>
      </div>
    </div>
  );
};
