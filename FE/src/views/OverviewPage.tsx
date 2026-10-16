'use client';

import React, { useState } from 'react';

export interface OverviewPageProps {
  onTriggerPdfToast: () => void;
  fmtMoney: (idr: string, usd: string) => string;
  onNavigateTab?: (tab: string) => void;
  onTriggerAiNotification?: (title: string, message: string) => void;
  totalUsersCount?: number;
}

type Period = 'Hari Ini' | '7 Hari' | '1 Bulan' | 'Kustom';

interface ChartPoint {
  label: string;
  pemasukan: number;
  pengeluaran: number;
  peakLabel: string;
  x: number;
  yIn: number;
  yOut: number;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  onTriggerPdfToast,
  fmtMoney,
  onNavigateTab,
  onTriggerAiNotification,
  totalUsersCount = 9
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('7 Hari');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [aiOption, setAiOption] = useState<number>(1);
  const [searchTable, setSearchTable] = useState('');

  // AI Toast state
  const [aiToast, setAiToast] = useState<{ show: boolean; title: string; message: string; badge: string } | null>(null);

  const formatCurrency = (idr: string, usd: string) => {
    return fmtMoney(idr, usd);
  };

  // Period Datasets
  const periodDataMap: Record<Period, {
    totalInIdr: string;
    totalInUsd: string;
    totalOutIdr: string;
    totalOutUsd: string;
    avgIdr: string;
    avgUsd: string;
    growthPercent: string;
    growthLabel: string;
    points: ChartPoint[];
    pathIn: string;
    pathOut: string;
    areaIn: string;
    areaOut: string;
  }> = {
    'Hari Ini': {
      totalInIdr: 'Rp 48.500.000',
      totalInUsd: '$ 3.129',
      totalOutIdr: 'Rp 31.200.000',
      totalOutUsd: '$ 2.012',
      avgIdr: 'Rp 6.640.000 / 3 jam',
      avgUsd: '$ 428 / 3 jam',
      growthPercent: '+9.4%',
      growthLabel: 'vs kemarin',
      points: [
        { label: '08:00', pemasukan: 4500000, pengeluaran: 3200000, peakLabel: 'Pagi', x: 45, yIn: 110, yOut: 125 },
        { label: '11:00', pemasukan: 9200000, pengeluaran: 5800000, peakLabel: 'Makan Siang', x: 125, yIn: 75, yOut: 100 },
        { label: '14:00', pemasukan: 14800000, pengeluaran: 8400000, peakLabel: 'Siang', x: 205, yIn: 45, yOut: 85 },
        { label: '17:00', pemasukan: 11500000, pengeluaran: 7100000, peakLabel: 'Sore', x: 285, yIn: 65, yOut: 95 },
        { label: '20:00', pemasukan: 6200000, pengeluaran: 4800000, peakLabel: 'Malam', x: 365, yIn: 95, yOut: 115 },
        { label: '23:00', pemasukan: 2300000, pengeluaran: 1900000, peakLabel: 'Penutupan', x: 455, yIn: 125, yOut: 135 }
      ],
      pathIn: 'M 45 110 C 85 90, 105 75, 125 75 C 165 75, 185 45, 205 45 C 245 45, 265 65, 285 65 C 325 65, 345 95, 365 95 C 410 95, 435 125, 455 125',
      pathOut: 'M 45 125 C 85 115, 105 100, 125 100 C 165 100, 185 85, 205 85 C 245 85, 265 95, 285 95 C 325 95, 345 115, 365 115 C 410 115, 435 135, 455 135',
      areaIn: 'M 45 110 C 85 90, 105 75, 125 75 C 165 75, 185 45, 205 45 C 245 45, 265 65, 285 65 C 325 65, 345 95, 365 95 C 410 95, 435 125, 455 125 L 455 150 L 45 150 Z',
      areaOut: 'M 45 125 C 85 115, 105 100, 125 100 C 165 100, 185 85, 205 85 C 245 85, 265 95, 285 95 C 325 95, 345 115, 365 115 C 410 115, 435 135, 455 135 L 455 150 L 45 150 Z'
    },
    '7 Hari': {
      totalInIdr: 'Rp 4.520.000.000',
      totalInUsd: '$ 291.612',
      totalOutIdr: 'Rp 3.120.000.000',
      totalOutUsd: '$ 201.290',
      avgIdr: 'Rp 642.800.000 / hari',
      avgUsd: '$ 41.470 / hari',
      growthPercent: '+18%',
      growthLabel: 'vs minggu lalu',
      points: [
        { label: 'Sen', pemasukan: 540000000, pengeluaran: 380000000, peakLabel: 'Awal Pekan', x: 40, yIn: 98, yOut: 115 },
        { label: 'Sel', pemasukan: 620000000, pengeluaran: 410000000, peakLabel: 'Stabil', x: 110, yIn: 88, yOut: 108 },
        { label: 'Rab', pemasukan: 710000000, pengeluaran: 460000000, peakLabel: 'Naik', x: 180, yIn: 72, yOut: 98 },
        { label: 'Kam', pemasukan: 982500000, pengeluaran: 410200000, peakLabel: '+24% Peak', x: 260, yIn: 38, yOut: 92 },
        { label: 'Jum', pemasukan: 680000000, pengeluaran: 530000000, peakLabel: 'Konsolidasi', x: 330, yIn: 68, yOut: 75 },
        { label: 'Sab', pemasukan: 510000000, pengeluaran: 490000000, peakLabel: 'Akhir Pekan', x: 400, yIn: 94, yOut: 85 },
        { label: 'Min', pemasukan: 477500000, pengeluaran: 440000000, peakLabel: 'Istirahat', x: 465, yIn: 105, yOut: 102 }
      ],
      pathIn: 'M 40 98 C 75 92, 90 88, 110 88 C 145 88, 160 72, 180 72 C 220 72, 240 38, 260 38 C 295 38, 310 68, 330 68 C 365 68, 380 94, 400 94 C 430 94, 445 105, 465 105',
      pathOut: 'M 40 115 C 75 110, 90 108, 110 108 C 145 108, 160 98, 180 98 C 220 98, 240 92, 260 92 C 295 92, 310 75, 330 75 C 365 75, 380 85, 400 85 C 430 85, 445 102, 465 102',
      areaIn: 'M 40 98 C 75 92, 90 88, 110 88 C 145 88, 160 72, 180 72 C 220 72, 240 38, 260 38 C 295 38, 310 68, 330 68 C 365 68, 380 94, 400 94 C 430 94, 445 105, 465 105 L 465 150 L 40 150 Z',
      areaOut: 'M 40 115 C 75 110, 90 108, 110 108 C 145 108, 160 98, 180 98 C 220 98, 240 92, 260 92 C 295 92, 310 75, 330 75 C 365 75, 380 85, 400 85 C 430 85, 445 102, 465 102 L 465 150 L 40 150 Z'
    },
    '1 Bulan': {
      totalInIdr: 'Rp 18.450.000.000',
      totalInUsd: '$ 1.190.322',
      totalOutIdr: 'Rp 12.800.000.000',
      totalOutUsd: '$ 825.806',
      avgIdr: 'Rp 3.200.000.000 / mgg',
      avgUsd: '$ 206.451 / mgg',
      growthPercent: '+15.2%',
      growthLabel: 'vs bulan lalu',
      points: [
        { label: 'Mgg 1', pemasukan: 4100000000, pengeluaran: 2900000000, peakLabel: 'Minggu 1', x: 60, yIn: 92, yOut: 112 },
        { label: 'Mgg 2', pemasukan: 4850000000, pengeluaran: 3350000000, peakLabel: 'Minggu 2', x: 190, yIn: 70, yOut: 96 },
        { label: 'Mgg 3', pemasukan: 5400000000, pengeluaran: 3600000000, peakLabel: 'Peak SPP', x: 320, yIn: 48, yOut: 88 },
        { label: 'Mgg 4', pemasukan: 4100000000, pengeluaran: 2950000000, peakLabel: 'Akhir Bulan', x: 450, yIn: 88, yOut: 108 }
      ],
      pathIn: 'M 60 92 C 120 85, 150 70, 190 70 C 250 70, 280 48, 320 48 C 370 48, 410 88, 450 88',
      pathOut: 'M 60 112 C 120 105, 150 96, 190 96 C 250 96, 280 88, 320 88 C 370 88, 410 108, 450 108',
      areaIn: 'M 60 92 C 120 85, 150 70, 190 70 C 250 70, 280 48, 320 48 C 370 48, 410 88, 450 88 L 450 150 L 60 150 Z',
      areaOut: 'M 60 112 C 120 105, 150 96, 190 96 C 250 96, 280 88, 320 88 C 370 88, 410 108, 450 108 L 450 150 L 60 150 Z'
    },
    'Kustom': {
      totalInIdr: 'Rp 9.850.000.000',
      totalInUsd: '$ 635.483',
      totalOutIdr: 'Rp 6.600.000.000',
      totalOutUsd: '$ 425.806',
      avgIdr: 'Rp 1.641.000.000 / rentang',
      avgUsd: '$ 105.871 / rentang',
      growthPercent: '+11.8%',
      growthLabel: 'periode terpilih',
      points: [
        { label: '1 Okt', pemasukan: 1200000000, pengeluaran: 850000000, peakLabel: '01 Okt', x: 45, yIn: 100, yOut: 118 },
        { label: '6 Okt', pemasukan: 1650000000, pengeluaran: 1100000000, peakLabel: '06 Okt', x: 125, yIn: 82, yOut: 102 },
        { label: '12 Okt', pemasukan: 1950000000, pengeluaran: 1300000000, peakLabel: '12 Okt', x: 205, yIn: 64, yOut: 90 },
        { label: '18 Okt', pemasukan: 2350000000, pengeluaran: 1450000000, peakLabel: 'Peak 18 Okt', x: 285, yIn: 42, yOut: 82 },
        { label: '24 Okt', pemasukan: 1550000000, pengeluaran: 1050000000, peakLabel: '24 Okt', x: 365, yIn: 86, yOut: 106 },
        { label: '30 Okt', pemasukan: 1150000000, pengeluaran: 850000000, peakLabel: '30 Okt', x: 455, yIn: 108, yOut: 122 }
      ],
      pathIn: 'M 45 100 C 85 92, 105 82, 125 82 C 165 82, 185 64, 205 64 C 245 64, 265 42, 285 42 C 325 42, 345 86, 365 86 C 410 86, 435 108, 455 108',
      pathOut: 'M 45 118 C 85 110, 105 102, 125 102 C 165 102, 185 90, 205 90 C 245 90, 265 82, 285 82 C 325 82, 345 106, 365 106 C 410 106, 435 122, 455 122',
      areaIn: 'M 45 100 C 85 92, 105 82, 125 82 C 165 82, 185 64, 205 64 C 245 64, 265 42, 285 42 C 325 42, 345 86, 365 86 C 410 86, 435 108, 455 108 L 455 150 L 45 150 Z',
      areaOut: 'M 45 118 C 85 110, 105 102, 125 102 C 165 102, 185 90, 205 90 C 245 90, 265 82, 285 82 C 325 82, 345 106, 365 106 C 410 106, 435 122, 455 122 L 455 150 L 45 150 Z'
    }
  };

  const currentData = periodDataMap[selectedPeriod];

  // AI Recommendation Trigger Action
  const handleApplyAiRecommendation = () => {
    let title = '';
    let message = '';
    let badge = '';

    if (aiOption === 1) {
      title = 'Rekomendasi AI: Smart Budget Limit Diterapkan';
      message = 'Pesan bimbingan batas anggaran dan proteksi limit QRIS aktif untuk 620 akun mahasiswa.';
      badge = 'Batas Anggaran Aktif';
    } else if (aiOption === 2) {
      title = 'Rekomendasi AI: Segmen Kohort Mahasiswa Dibuat';
      message = 'Kohort pemantauan khusus arus kas 14 hari berhasil dibuat untuk mitigasi risiko mahasiswa defisit.';
      badge = 'Kohort 14 Hari';
    } else {
      title = 'Rekomendasi AI: Auto-Save Mikro Dijalankan';
      message = 'Alokasi sisa cashback transaksi ke kantung tabungan mikro & reksadana otomatis diaktifkan.';
      badge = 'Auto-Save Aktif';
    }

    setAiToast({ show: true, title, message, badge });

    if (onTriggerAiNotification) {
      onTriggerAiNotification(title, message);
    }

    setTimeout(() => {
      setAiToast(null);
    }, 5000);
  };

  // Recent Transactions Data (Consistent with Users)
  const recentTransactions = [
    { id: 'TRX-9481', user: 'Ahmad Fauzi', sub: 'NIM: 10293846 • TI', category: 'Pembayaran SPP Kuliah', method: 'Virtual Account BCA', amount: 'Rp 14.500.000', isIncome: true, status: 'Berhasil', statusType: 'success', time: '10 mnt lalu', avatar: 'AF' },
    { id: 'TRX-9482', user: 'Nadia Putri', sub: 'NIM: 10293845 • Akuntansi', category: 'Alokasi Dana Auto-Save', method: 'Debit Mandiri', amount: 'Rp 500.000', isIncome: false, status: 'Berhasil', statusType: 'success', time: '24 mnt lalu', avatar: 'NP' },
    { id: 'TRX-9483', user: 'Bambang Santoso', sub: 'NIM: 10293847 • Komunikasi', category: 'Top-Up Saldo Digital', method: 'Merchant Wallet', amount: 'Rp 750.000', isIncome: true, status: 'Berhasil', statusType: 'success', time: '41 mnt lalu', avatar: 'BS' },
    { id: 'TRX-9484', user: 'Dewi Lestari', sub: 'NIM: 10293848 • DKV', category: 'Beli Buku & Modul DKV', method: 'Kartu Kredit', amount: 'Rp 1.250.000', isIncome: false, status: 'Menunggu', statusType: 'pending', time: '1 jam lalu', avatar: 'DL' },
    { id: 'TRX-9485', user: 'Reza Hardiansyah', sub: 'NIM: 10293849 • Sipil', category: 'Honor Asisten Praktikum', method: 'Payroll Kampus', amount: 'Rp 45.000', isIncome: true, status: 'Berhasil', statusType: 'success', time: '2 jam lalu', avatar: 'RH' }
  ];

  const filteredTrx = recentTransactions.filter(t => 
    t.id.toLowerCase().includes(searchTable.toLowerCase()) || 
    t.user.toLowerCase().includes(searchTable.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTable.toLowerCase())
  );

  return (
    <div className="p-5 space-y-5 max-w-7xl mx-auto w-full animate-fadeIn text-xs relative">
      {/* AI Floating Toast Notification */}
      {aiToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#2D2825] border border-emerald-500/80 text-white p-4 rounded-2xl shadow-2xl max-w-sm w-full animate-fadeIn space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0">✨</span>
              <div>
                <h4 className="font-extrabold text-xs text-white leading-tight">{aiToast.title}</h4>
                <span className="text-[10px] text-emerald-400 font-bold">{aiToast.badge}</span>
              </div>
            </div>
            <button onClick={() => setAiToast(null)} className="text-[#A0948D] hover:text-white font-bold text-xs">✕</button>
          </div>
          <p className="text-[11px] text-[#D8CECA] leading-relaxed">
            {aiToast.message}
          </p>
          <div className="pt-1 border-t border-[#4A403A] flex items-center justify-between text-[10px] text-[#A0948D]">
            <span className="text-emerald-400 font-semibold">● Rekomendasi Terverifikasi</span>
            <span>Tersinkron ke Akun</span>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-[#2D2825] tracking-tight">Dashboard Overview</h1>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Live Data Sync
            </span>
          </div>
          <p className="text-xs text-[#8C7A70] mt-0.5">Konsolidasi metrik perbankan mikro & pemantauan tren finansial real-time.</p>
        </div>

        <button
          onClick={onTriggerPdfToast}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#5C2D16] hover:bg-[#462211] text-white text-xs font-bold rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
        >
          <span>📩</span> Unduh Laporan PDF
        </button>
      </div>

      {/* Top 3 KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#8C7A70]">Total Pengguna Aktif</span>
            <div className="w-8 h-8 rounded-full bg-[#FAF4F0] border border-[#E8DCD8] flex items-center justify-center text-[#5C2D16] font-bold text-xs">
              👤
            </div>
          </div>
          <div className="text-3xl font-black text-[#2D2825] tracking-tight">{totalUsersCount}</div>
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#F0E8E4]">
            <span className="text-emerald-600 font-bold">▲ +12.5% <span className="text-[#8C7A70] font-normal">vs 30 hari lalu</span></span>
            <span className="text-[#8C7A70]">Target bulanan: <strong className="text-[#2D2825]">83% tercapai</strong></span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#8C7A70]">Total Transaksi Tercatat</span>
            <div className="w-8 h-8 rounded-full bg-[#FAF4F0] border border-[#E8DCD8] flex items-center justify-center text-[#5C2D16] font-bold text-xs">
              📑
            </div>
          </div>
          <div className="text-3xl font-black text-[#2D2825] tracking-tight">34,500</div>
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#F0E8E4]">
            <span className="text-emerald-600 font-bold">▲ +8.2% <span className="text-[#8C7A70] font-normal">vs 30 hari lalu</span></span>
            <span className="text-[#8C7A70]">Success rate: <strong className="text-emerald-600 font-bold">99.4%</strong></span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#8C7A70]">Volume Arus Kas Tercatat</span>
            <div className="w-8 h-8 rounded-full bg-[#FAF4F0] border border-[#E8DCD8] flex items-center justify-center text-[#5C2D16] font-bold text-xs">
              💳
            </div>
          </div>
          <div className="text-3xl font-black text-[#2D2825] tracking-tight">{formatCurrency('Rp 4.5 M', '$ 290.3 K')}</div>
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#F0E8E4]">
            <span className="text-emerald-600 font-bold">▲ +15.3% <span className="text-[#8C7A70] font-normal">vs 30 hari lalu</span></span>
            <span className="text-[#8C7A70]">Surplus bersih: <strong className="text-[#5C2D16] font-bold">{formatCurrency('Rp 1.4 M (31%)', '$ 90.3 K')}</strong></span>
          </div>
        </div>
      </div>

      {/* Middle Grid: Chart Left (65%) & AI Intelligence Right (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left Sub-Panel: Statistik Finansial Agregat */}
        <div className="lg:col-span-2 bg-white border border-[#E5DDD8] rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            {/* Header & Filter Controls (Hari Ini, 7 Hari, 1 Bulan, Kustom) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#2D2825]">Statistik Finansial Agregat</h2>
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                    {currentData.growthPercent} {currentData.growthLabel}
                  </span>
                </div>
                <p className="text-[11px] text-[#8C7A70] mt-0.5">Komparasi kurva arus pemasukan vs pengeluaran seluruh akun pengguna.</p>
              </div>

              {/* Activated Timeframe Buttons */}
              <div className="flex items-center bg-[#F5F2ED] p-1 rounded-xl text-xs font-semibold text-[#6E5D53]">
                {(['Hari Ini', '7 Hari', '1 Bulan', 'Kustom'] as Period[]).map(p => (
                  <button
                    key={p}
                    onClick={() => {
                      setSelectedPeriod(p);
                      setHoveredPointIndex(null);
                    }}
                    className={'px-3 py-1 rounded-lg transition-all cursor-pointer ' + (
                      selectedPeriod === p ? 'bg-[#5C2D16] text-white font-bold shadow-xs' : 'hover:text-[#5C2D16]'
                    )}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-summary metrics */}
            <div className="flex flex-wrap items-center gap-5 pt-3 border-t border-[#F0E8E4] mt-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5C2D16]"></span>
                <span className="text-[#8C7A70]">Total Pemasukan:</span>
                <strong className="font-extrabold text-[#2D2825]">{formatCurrency(currentData.totalInIdr, currentData.totalInUsd)}</strong>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C25E38]"></span>
                <span className="text-[#8C7A70]">Total Pengeluaran:</span>
                <strong className="font-extrabold text-[#2D2825]">{formatCurrency(currentData.totalOutIdr, currentData.totalOutUsd)}</strong>
              </div>
              <div className="ml-auto text-[11px] text-[#8C7A70]">
                Rata-rata: <strong className="text-emerald-700 font-bold">{formatCurrency(currentData.avgIdr, currentData.avgUsd)}</strong>
              </div>
            </div>

            {/* SVG Interactive Line Chart (HOVER ONLY TOOLTIP) */}
            <div className="relative w-full h-52 mt-4 pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="pemasukanGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5C2D16" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#5C2D16" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="pengeluaranGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C25E38" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#C25E38" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                <line x1="20" y1="20" x2="480" y2="20" stroke="#F0E8E4" strokeDasharray="3 3" />
                <line x1="20" y1="60" x2="480" y2="60" stroke="#F0E8E4" strokeDasharray="3 3" />
                <line x1="20" y1="100" x2="480" y2="100" stroke="#F0E8E4" strokeDasharray="3 3" />
                <line x1="20" y1="140" x2="480" y2="140" stroke="#E5DDD8" />

                {/* Area Fills */}
                <path d={currentData.areaIn} fill="url(#pemasukanGrad)" />
                <path d={currentData.areaOut} fill="url(#pengeluaranGrad)" />

                {/* Curve Lines */}
                <path d={currentData.pathIn} fill="none" stroke="#5C2D16" strokeWidth="3" strokeLinecap="round" />
                <path d={currentData.pathOut} fill="none" stroke="#C25E38" strokeWidth="2.5" strokeDasharray="5 4" strokeLinecap="round" />

                {/* Hover Hit Targets and Circles */}
                {currentData.points.map((pt, idx) => (
                  <g
                    key={pt.label}
                    onMouseEnter={() => setHoveredPointIndex(idx)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                    className="cursor-pointer"
                  >
                    {/* Transparent vertical target column for effortless hover detection */}
                    <rect
                      x={pt.x - 20}
                      y={10}
                      width={40}
                      height={140}
                      fill="transparent"
                    />

                    {/* Active vertical guide line on hover */}
                    {hoveredPointIndex === idx && (
                      <line
                        x1={pt.x}
                        y1={20}
                        x2={pt.x}
                        y2={140}
                        stroke="#5C2D16"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                        opacity="0.6"
                      />
                    )}

                    {/* Circle Point */}
                    <circle
                      cx={pt.x}
                      cy={pt.yIn}
                      r={hoveredPointIndex === idx ? 6 : 4}
                      className={hoveredPointIndex === idx ? 'fill-[#5C2D16] stroke-white stroke-[3] transition-all' : 'fill-white stroke-[#5C2D16] stroke-[2] transition-all'}
                    />
                  </g>
                ))}
              </svg>

              {/* DETAIL / POP UP TAMPILAN STATISTIK: MUNCUL HANYA SAAT KURSOR MENGARAH KE STATISTIK */}
              {hoveredPointIndex !== null && currentData.points[hoveredPointIndex] && (
                (() => {
                  const pt = currentData.points[hoveredPointIndex];
                  const inIdr = 'Rp ' + pt.pemasukan.toLocaleString('id-ID');
                  const inUsd = '$ ' + (pt.pemasukan / 15500).toFixed(0);
                  const outIdr = 'Rp ' + pt.pengeluaran.toLocaleString('id-ID');
                  const outUsd = '$ ' + (pt.pengeluaran / 15500).toFixed(0);

                  // Calculate left clamp percentage
                  const leftPercent = Math.min(Math.max((pt.x / 500) * 100, 20), 80);

                  return (
                    <div
                      className="absolute top-0 bg-[#2D2825] text-white p-3 rounded-2xl shadow-2xl z-30 text-[11px] border border-[#5C2D16]/50 min-w-[210px] pointer-events-none animate-fadeIn transition-all"
                      style={{ left: `${leftPercent}%`, transform: 'translateX(-50%)' }}
                    >
                      <div className="flex items-center justify-between border-b border-[#4A423E] pb-1.5 mb-1.5">
                        <span className="font-bold text-[#E6D0C7]">{pt.label} ({selectedPeriod})</span>
                        <span className="px-1.5 py-0.5 text-[9px] font-extrabold bg-emerald-900 text-emerald-300 rounded">{pt.peakLabel}</span>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-xs">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Masuk:</span>
                          <strong className="font-mono font-bold">{formatCurrency(inIdr, inUsd)}</strong>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400"></span> Keluar:</span>
                          <strong className="font-mono font-bold text-rose-300">{formatCurrency(outIdr, outUsd)}</strong>
                        </div>
                      </div>
                    </div>
                  );
                })()
              )}
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between items-center text-xs font-semibold text-[#8C7A70] px-3 pt-2">
              {currentData.points.map((pt, idx) => (
                <span
                  key={pt.label}
                  className={'transition-colors ' + (hoveredPointIndex === idx ? 'px-2 py-0.5 bg-[#5C2D16] text-white rounded-lg font-bold' : '')}
                >
                  {pt.label}
                </span>
              ))}
            </div>
          </div>

          {/* Footer Info Banner */}
          <div className="bg-[#FAF4F0] border border-[#E6D4CB] rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-[#554A43]">
              <span className="text-emerald-600 font-bold">✓ Rekonsiliasi otomatis 100% cocok</span>
              <span className="text-[#8C7A70]">• Pembaruan data setiap 60 detik</span>
            </div>
            {/* Navigasi ke Halaman Analytics & Statistics */}
            <button
              onClick={() => onNavigateTab ? onNavigateTab('analytics') : null}
              className="font-bold text-[#5C2D16] hover:underline flex items-center gap-1 cursor-pointer transition-colors"
            >
              Buka Laporan Analitik Rinci →
            </button>
          </div>
        </div>

        {/* Right Sub-Panel: AI Financial Intelligence */}
        <div className="bg-[#FAF4F0] border border-[#E6D4CB] rounded-2xl p-5 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#5C2D16] text-white flex items-center justify-center font-bold text-sm">
                  ✨
                </div>
                <div>
                  <h2 className="font-bold text-sm text-[#2D2825]">AI Financial Intelligence</h2>
                  <p className="text-[10px] text-[#8C7A70]">Deteksi Anomali & Rekomendasi</p>
                </div>
              </div>
              <span className="px-2 py-0.5 text-[9px] font-extrabold bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                94% AKURAT
              </span>
            </div>

            {/* Anomaly Card */}
            <div className="bg-white border border-[#E5DDD8] rounded-2xl p-3.5 mt-3 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between text-[10px]">
                <span className="font-bold text-[#C25E38] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C25E38] animate-pulse"></span>
                  Lonjakan Anomali Kategori
                </span>
                <span className="text-[#8C7A70]">2 jam yang lalu</span>
              </div>
              <p className="text-xs text-[#2D2825] leading-relaxed">
                Terdeteksi lonjakan pengeluaran <strong className="text-[#C25E38]">+41.8%</strong> pada sub-kategori <strong>"Hiburan & Coffee Shop"</strong> di kelompok usia mahasiswa pasca periode ujian.
              </p>
              <div className="flex items-center justify-between text-[10px] pt-1 border-t border-[#F0E8E4] text-[#8C7A70]">
                <span>Audiens Terdampak: <strong className="text-[#2D2825]">620 Akun</strong></span>
                <span>Estimasi Risiko: <strong className="text-emerald-700 font-bold">Rendah</strong></span>
              </div>
            </div>

            {/* Recommended Operational Actions */}
            <div className="mt-4 space-y-2">
              <span className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider block">AKSI OPERASIONAL YANG DISARANKAN:</span>
              
              <div className="space-y-2 text-xs">
                <label
                  onClick={() => setAiOption(1)}
                  className={'flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ' + (aiOption === 1 ? 'bg-white border-[#5C2D16] shadow-xs' : 'bg-[#F5F2ED]/60 border-transparent hover:bg-white')}
                >
                  <input type="radio" checked={aiOption === 1} onChange={() => setAiOption(1)} className="mt-0.5 accent-[#5C2D16]" />
                  <div>
                    <div className="font-bold text-[#2D2825]">Kirim Notifikasi Smart Budget Limit</div>
                    <div className="text-[10px] text-[#8C7A70] leading-snug">Dorong target tabungan darurat & tips penghematan santai.</div>
                  </div>
                </label>

                <label
                  onClick={() => setAiOption(2)}
                  className={'flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ' + (aiOption === 2 ? 'bg-white border-[#5C2D16] shadow-xs' : 'bg-[#F5F2ED]/60 border-transparent hover:bg-white')}
                >
                  <input type="radio" checked={aiOption === 2} onChange={() => setAiOption(2)} className="mt-0.5 accent-[#5C2D16]" />
                  <div>
                    <div className="font-bold text-[#2D2825]">Tinjau Segmen Pengguna Mahasiswa</div>
                    <div className="text-[10px] text-[#8C7A70] leading-snug">Buat kohort khusus untuk pemantauan arus kas 14 hari.</div>
                  </div>
                </label>

                <label
                  onClick={() => setAiOption(3)}
                  className={'flex items-start gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-all ' + (aiOption === 3 ? 'bg-white border-[#5C2D16] shadow-xs' : 'bg-[#F5F2ED]/60 border-transparent hover:bg-white')}
                >
                  <input type="radio" checked={aiOption === 3} onChange={() => setAiOption(3)} className="mt-0.5 accent-[#5C2D16]" />
                  <div>
                    <div className="font-bold text-[#2D2825]">Aktifkan Reward Investasi / Auto-Save</div>
                    <div className="text-[10px] text-[#8C7A70] leading-snug">Alokasikan sisa cashback ke kantung reksadana mikro.</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="pt-2 space-y-1.5">
            <button
              onClick={handleApplyAiRecommendation}
              className="w-full py-2.5 bg-[#5C2D16] hover:bg-[#462211] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>⚡</span> Terapkan Rekomendasi Terpilih →
            </button>
            <div className="text-center text-[10px] text-[#8C7A70]">
              Memerlukan konfirmasi role Super Administrator
            </div>
          </div>
        </div>
      </div>

      {/* Category Breakdown Progress Bar Section (Restored Previous Version matching Gambar 2 Request) */}
      <div className="bg-white border border-[#E5DDD8] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-[#2D2825]">Distribusi Kategori Pengeluaran Teratas</h2>
            <p className="text-[11px] text-[#8C7A70] mt-0.5">Pemetaan alokasi belanja total pengguna aktif bulan ini.</p>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-medium text-[#6E5D53]">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#5C2D16]"></span> Primer</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#8C5338]"></span> Sekunder</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#C25E38]"></span> Gaya Hidup</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#D4A373]"></span> Rutin</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-2">
          {/* Donut Chart Display */}
          <div className="flex flex-col items-center justify-center relative">
            <div className="w-36 h-36 rounded-full border-[14px] border-[#5C2D16] flex items-center justify-center border-t-[#C25E38] border-r-[#8C5338] border-b-[#D4A373] shadow-inner relative">
              <div className="text-center">
                <div className="text-[9px] text-[#8C7A70] font-bold uppercase tracking-wider">Total Belanja</div>
                <div className="text-base font-black text-[#2D2825]">{formatCurrency('Rp 3.12 M', '$ 201.2 K')}</div>
                <div className="text-[9px] text-emerald-600 font-extrabold">100% Recorded</div>
              </div>
            </div>
          </div>

          {/* Progress Bars Category Rows (2/3 width) */}
          <div className="md:col-span-2 space-y-3.5 text-xs">
            {/* Row 1 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-[#2D2825] flex items-center gap-2">
                  <span>🍴</span> Makanan & Minuman (F&B)
                </span>
                <span className="font-extrabold text-[#2D2825]">{formatCurrency('Rp 1.185.600.000', '$ 76.490')} <span className="text-[#8C7A70] font-normal">(38%)</span></span>
              </div>
              <div className="w-full h-2 bg-[#F5F2ED] rounded-full overflow-hidden">
                <div className="h-full bg-[#5C2D16] rounded-full" style={{ width: '38%' }}></div>
              </div>
            </div>

            {/* Row 2 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-[#2D2825] flex items-center gap-2">
                  <span>🛒</span> Belanja & E-Commerce
                </span>
                <span className="font-extrabold text-[#2D2825]">{formatCurrency('Rp 748.800.000', '$ 48.309')} <span className="text-[#8C7A70] font-normal">(24%)</span></span>
              </div>
              <div className="w-full h-2 bg-[#F5F2ED] rounded-full overflow-hidden">
                <div className="h-full bg-[#8C5338] rounded-full" style={{ width: '24%' }}></div>
              </div>
            </div>

            {/* Row 3 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-[#2D2825] flex items-center gap-2">
                  <span>☕</span> Hiburan, Kafe & Lifestyle
                </span>
                <span className="font-extrabold text-[#2D2825]">{formatCurrency('Rp 624.000.000', '$ 40.258')} <span className="text-[#8C7A70] font-normal">(20%)</span></span>
              </div>
              <div className="w-full h-2 bg-[#F5F2ED] rounded-full overflow-hidden">
                <div className="h-full bg-[#C25E38] rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>

            {/* Row 4 */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-[#2D2825] flex items-center gap-2">
                  <span>⚡</span> Tagihan, Listrik & Utilitas
                </span>
                <span className="font-extrabold text-[#2D2825]">{formatCurrency('Rp 561.600.000', '$ 36.232')} <span className="text-[#8C7A70] font-normal">(18%)</span></span>
              </div>
              <div className="w-full h-2 bg-[#F5F2ED] rounded-full overflow-hidden">
                <div className="h-full bg-[#D4A373] rounded-full" style={{ width: '18%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Table Section: Aktivitas Pengguna & Mutasi Terkini */}
      <div className="bg-white border border-[#E5DDD8] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#2D2825]">Aktivitas Pengguna & Mutasi Terkini</h2>
              <span className="px-2 py-0.5 text-[9px] font-bold bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] rounded-full">
                Real-Time Feed
              </span>
            </div>
            <p className="text-[11px] text-[#8C7A70] mt-0.5">Audit log transaksi perbankan dan pencatatan kas keluar-masuk.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari ID atau pengguna..."
                value={searchTable}
                onChange={e => setSearchTable(e.target.value)}
                className="bg-[#F5F2ED] border border-[#E5DDD8] rounded-xl px-3 py-1.5 pl-8 text-xs text-[#2D2825] focus:outline-none w-48"
              />
              <span className="absolute left-2.5 top-2 text-[#8C7A70] text-xs">🔍</span>
            </div>
            <button className="px-3 py-1.5 bg-white border border-[#E5DDD8] text-[#5C2D16] font-bold text-xs rounded-xl hover:bg-[#FAF7F4] flex items-center gap-1 cursor-pointer">
              ≡ Lihat Semua
            </button>
          </div>
        </div>

        {/* Table Data */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F4] text-[#8C7A70] uppercase text-[9px] font-bold tracking-wider border-b border-[#E5DDD8]">
              <tr>
                <th className="py-3 px-4">ID TRANSAKSI</th>
                <th className="py-3 px-4">PENGGUNA</th>
                <th className="py-3 px-4">KATEGORI & METODE</th>
                <th className="py-3 px-4">NOMINAL</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4">WAKTU</th>
                <th className="py-3 px-4 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8E4]">
              {filteredTrx.map((row) => (
                <tr key={row.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#5C2D16]">{row.id}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#E6D0C7] text-[#5C2D16] font-extrabold flex items-center justify-center text-xs">
                        {row.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-[#2D2825]">{row.user}</div>
                        <div className="text-[10px] text-[#8C7A70]">{row.sub}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#2D2825] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#5C2D16]"></span>
                      {row.category}
                    </div>
                    <div className="text-[10px] text-[#8C7A70]">{row.method}</div>
                  </td>
                  <td className={'py-3.5 px-4 font-mono font-extrabold ' + (row.isIncome ? 'text-emerald-700' : 'text-[#2D2825]')}>
                    {formatCurrency(row.amount, row.amount.replace('Rp', '$').replace('45.000', '2.90').replace('500.000', '32.25').replace('750.000', '48.38').replace('1.250.000', '80.64').replace('14.500.000', '935.48'))}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={'px-2.5 py-1 text-[10px] font-bold rounded-full border flex items-center gap-1 w-max ' + (
                      row.statusType === 'success' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-900 border-amber-300'
                    )}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-[#8C7A70] text-[10px]">{row.time}</td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="text-[#8C7A70] hover:text-[#2D2825] p-1 font-bold text-sm">•••</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="pt-3 border-t border-[#E5DDD8] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#8C7A70]">
          <div>Menampilkan 1 – 5 dari 1,245 transaksi</div>
          <div className="flex items-center gap-1 font-semibold">
            <button className="px-2 py-1 rounded border border-[#E5DDD8] bg-white hover:bg-[#FAF7F4] cursor-pointer">Sebelumnya</button>
            <button className="w-6 h-6 rounded bg-[#5C2D16] text-white font-bold flex items-center justify-center">1</button>
            <button className="w-6 h-6 rounded border border-[#E5DDD8] bg-white flex items-center justify-center hover:bg-[#FAF7F4] cursor-pointer">2</button>
            <button className="w-6 h-6 rounded border border-[#E5DDD8] bg-white flex items-center justify-center hover:bg-[#FAF7F4] cursor-pointer">3</button>
            <span className="px-1">...</span>
            <button className="px-2 py-1 rounded border border-[#E5DDD8] bg-white hover:bg-[#FAF7F4] cursor-pointer">249</button>
            <button className="px-2 py-1 rounded border border-[#E5DDD8] bg-white hover:bg-[#FAF7F4] cursor-pointer">Selanjutnya</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
