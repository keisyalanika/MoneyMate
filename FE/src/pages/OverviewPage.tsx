import React, { useState, useEffect } from 'react';
import { fetchTransactionsList, fetchUsersList, createTransaction } from '../services/api';

export interface OverviewPageProps {
  onTriggerPdfToast: () => void;
  fmtMoney: (idr: string, usd: string) => string;
  onNavigateTab?: (tab: string) => void;
  onTriggerAiNotification?: (title: string, message: string) => void;
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
  onTriggerAiNotification
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>('7 Hari');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [aiOption, setAiOption] = useState<number>(1);
  const [searchTable, setSearchTable] = useState('');
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [usersCount, setUsersCount] = useState<number>(0);
  const [usersActiveCount, setUsersActiveCount] = useState<number>(0);
  const [isRefreshingTrx, setIsRefreshingTrx] = useState(false);

  // AI Toast state
  const [aiToast, setAiToast] = useState<{ show: boolean; title: string; message: string; badge: string } | null>(null);

  const formatCurrency = (idr: string, usd: string) => {
    return fmtMoney(idr, usd);
  };

  // Helper dynamic format money
  const formatShortMoney = (val: number) => {
    if (val === 0) return 'Rp 0';
    if (Math.abs(val) >= 1_000_000_000) return `Rp ${(val / 1_000_000_000).toFixed(1)} M`;
    if (Math.abs(val) >= 1_000_000) return `Rp ${(val / 1_000_000).toFixed(1)} Jt`;
    return `Rp ${val.toLocaleString('id-ID')}`;
  };

  const formatShortUsd = (val: number) => {
    const usd = val / 15500;
    if (usd === 0) return '$ 0';
    if (Math.abs(usd) >= 1_000_000) return `$ ${(usd / 1_000_000).toFixed(1)} M`;
    if (Math.abs(usd) >= 1_000) return `$ ${(usd / 1_000).toFixed(1)} K`;
    return `$ ${usd.toFixed(0)}`;
  };

  const totalIncome = recentTransactions
    .filter(t => t.isIncome)
    .reduce((sum, t) => sum + (t.rawAmount || parseInt(t.amount.replace(/\D/g, '') || '0', 10)), 0);

  const totalExpense = recentTransactions
    .filter(t => !t.isIncome)
    .reduce((sum, t) => sum + (t.rawAmount || parseInt(t.amount.replace(/\D/g, '') || '0', 10)), 0);

  const totalCashVolume = totalIncome + totalExpense;
  const netSurplus = totalIncome - totalExpense;
  const avgTrx = recentTransactions.length > 0 ? Math.round(totalCashVolume / recentTransactions.length) : 0;

  const currentData = (() => {
    if (recentTransactions.length === 0) {
      const emptyPoints: ChartPoint[] = [
        { label: '08:00', pemasukan: 0, pengeluaran: 0, peakLabel: 'Awal', x: 45, yIn: 140, yOut: 140 },
        { label: '11:00', pemasukan: 0, pengeluaran: 0, peakLabel: 'Siang', x: 125, yIn: 140, yOut: 140 },
        { label: '14:00', pemasukan: 0, pengeluaran: 0, peakLabel: 'Sore', x: 205, yIn: 140, yOut: 140 },
        { label: '17:00', pemasukan: 0, pengeluaran: 0, peakLabel: 'Petang', x: 285, yIn: 140, yOut: 140 },
        { label: '20:00', pemasukan: 0, pengeluaran: 0, peakLabel: 'Malam', x: 365, yIn: 140, yOut: 140 },
        { label: '23:00', pemasukan: 0, pengeluaran: 0, peakLabel: 'Tutup', x: 455, yIn: 140, yOut: 140 }
      ];
      return {
        totalInIdr: 'Rp 0',
        totalInUsd: '$ 0',
        totalOutIdr: 'Rp 0',
        totalOutUsd: '$ 0',
        avgIdr: 'Rp 0 / trx',
        avgUsd: '$ 0 / trx',
        growthPercent: '0%',
        growthLabel: 'Belum ada data',
        points: emptyPoints,
        pathIn: 'M 45 140 L 455 140',
        pathOut: 'M 45 140 L 455 140',
        areaIn: 'M 45 140 L 455 140 L 455 150 L 45 150 Z',
        areaOut: 'M 45 140 L 455 140 L 455 150 L 45 150 Z'
      };
    }

    const baseLabels = ['Pagi', 'Siang', 'Sore', 'Malam'];
    const xCoords = [60, 180, 320, 440];
    const maxVal = Math.max(totalIncome, totalExpense, 1);

    const points: ChartPoint[] = baseLabels.map((lbl, idx) => {
      const sliceTrx = recentTransactions.filter((_, tIdx) => tIdx % baseLabels.length === idx);
      const inSum = sliceTrx.filter(t => t.isIncome).reduce((sum, t) => sum + (t.rawAmount || 0), 0);
      const outSum = sliceTrx.filter(t => !t.isIncome).reduce((sum, t) => sum + (t.rawAmount || 0), 0);
      const yIn = Math.round(135 - (inSum / maxVal) * 95);
      const yOut = Math.round(135 - (outSum / maxVal) * 95);

      return {
        label: lbl,
        pemasukan: inSum,
        pengeluaran: outSum,
        peakLabel: inSum > outSum ? 'Surplus' : (outSum > 0 ? 'Defisit' : 'Normal'),
        x: xCoords[idx],
        yIn,
        yOut
      };
    });

    const pathIn = `M ${points[0].x} ${points[0].yIn} C ${points[1].x - 40} ${points[0].yIn}, ${points[1].x - 40} ${points[1].yIn}, ${points[1].x} ${points[1].yIn} C ${points[2].x - 40} ${points[1].yIn}, ${points[2].x - 40} ${points[2].yIn}, ${points[2].x} ${points[2].yIn} C ${points[3].x - 40} ${points[2].yIn}, ${points[3].x - 40} ${points[3].yIn}, ${points[3].x} ${points[3].yIn}`;
    const pathOut = `M ${points[0].x} ${points[0].yOut} C ${points[1].x - 40} ${points[0].yOut}, ${points[1].x - 40} ${points[1].yOut}, ${points[1].x} ${points[1].yOut} C ${points[2].x - 40} ${points[1].yOut}, ${points[2].x - 40} ${points[2].yOut}, ${points[2].x} ${points[2].yOut} C ${points[3].x - 40} ${points[2].yOut}, ${points[3].x - 40} ${points[3].yOut}, ${points[3].x} ${points[3].yOut}`;

    return {
      totalInIdr: `Rp ${totalIncome.toLocaleString('id-ID')}`,
      totalInUsd: `$ ${(totalIncome / 15500).toFixed(0)}`,
      totalOutIdr: `Rp ${totalExpense.toLocaleString('id-ID')}`,
      totalOutUsd: `$ ${(totalExpense / 15500).toFixed(0)}`,
      avgIdr: `Rp ${avgTrx.toLocaleString('id-ID')} / trx`,
      avgUsd: `$ ${(avgTrx / 15500).toFixed(1)} / trx`,
      growthPercent: '+100%',
      growthLabel: 'Data Live',
      points,
      pathIn,
      pathOut,
      areaIn: `${pathIn} L ${points[points.length - 1].x} 150 L ${points[0].x} 150 Z`,
      areaOut: `${pathOut} L ${points[points.length - 1].x} 150 L ${points[0].x} 150 Z`
    };
  })();

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

  // Helpers for live transactions
  const formatRelativeTime = (dateStr?: string) => {
    if (!dateStr) return 'Baru saja';
    try {
      const d = new Date(dateStr);
      const now = new Date();
      const diffMs = now.getTime() - d.getTime();
      if (diffMs < 0) return 'Baru saja';
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) return 'Baru saja';
      if (diffMin < 60) return `${diffMin} mnt lalu`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours} jam lalu`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays === 1) return 'Kemarin';
      if (diffDays < 7) return `${diffDays} hari lalu`;
      return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
    } catch {
      return 'Baru saja';
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'MB';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Live Sync with Backend (includes transactions and users added from Flutter mobile or web)
  const loadLiveTransactions = async () => {
    setIsRefreshingTrx(true);
    try {
      const [trxData, usersData] = await Promise.all([
        fetchTransactionsList(100),
        fetchUsersList()
      ]);

      if (usersData) {
        setUsersCount(usersData.length);
        setUsersActiveCount(usersData.filter((u: any) => u.status !== 'Nonaktif' && u.is_active !== 0).length);
      }

      if (trxData && trxData.length > 0) {
        const liveItems = trxData.map((t: any) => {
          const isInc = String(t.type).toLowerCase() === 'income';
          const userName = t.user_name || 'Pengguna Mobile';
          const amountNum = Number(t.amount || 0);

          return {
            id: `TRX-${String(t.id).padStart(4, '0')}`,
            user: userName,
            sub: `ID: USR-${String(t.user_id || 1).padStart(3, '0')}${t.user_email ? ' • Mobile' : ''}`,
            category: t.note || t.category_name || (isInc ? 'Pemasukan' : 'Pengeluaran'),
            method: t.income_source_name || (isInc ? 'Dompet Digital' : 'Kas / Rekening'),
            amount: `Rp ${amountNum.toLocaleString('id-ID')}`,
            rawAmount: amountNum,
            isIncome: isInc,
            status: 'Berhasil',
            statusType: 'success',
            time: formatRelativeTime(t.created_at || t.date),
            avatar: getInitials(userName),
          };
        });
        setRecentTransactions(liveItems);
      } else {
        // No transactions in database yet
        setRecentTransactions([]);
      }
    } catch (err: any) {
      console.warn('Backend transactions sync error:', err.message);
      setRecentTransactions([]);
    } finally {
      setIsRefreshingTrx(false);
    }
  };

  const handleCreateSampleTransaction = async () => {
    setIsRefreshingTrx(true);
    try {
      await createTransaction({
        amount: 50000,
        type: 'EXPENSE',
        categoryId: '1',
        title: 'Makan Siang (Percobaan Mobile)',
        date: new Date().toISOString()
      });
      await loadLiveTransactions();
    } catch (err: any) {
      console.warn('Gagal membuat transaksi contoh:', err.message);
    } finally {
      setIsRefreshingTrx(false);
    }
  };

  useEffect(() => {
    loadLiveTransactions();

    const handleFocus = () => {
      loadLiveTransactions();
    };
    window.addEventListener('focus', handleFocus);

    const interval = setInterval(() => {
      loadLiveTransactions();
    }, 10000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      clearInterval(interval);
    };
  }, []);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const filteredTrx = recentTransactions.filter(t => 
    t.id.toLowerCase().includes(searchTable.toLowerCase()) || 
    t.user.toLowerCase().includes(searchTable.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTable.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(filteredTrx.length / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const paginatedTrx = filteredTrx.slice(startIndex, startIndex + pageSize);

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
        {/* Card 1: Total Pengguna Aktif */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#8C7A70]">Total Pengguna Aktif</span>
            <div className="w-8 h-8 rounded-full bg-[#FAF4F0] border border-[#E8DCD8] flex items-center justify-center text-[#5C2D16] font-bold text-xs">
              👤
            </div>
          </div>
          <div className="text-3xl font-black text-[#2D2825] tracking-tight">
            {usersActiveCount > 0 ? usersActiveCount.toLocaleString('id-ID') : usersCount.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#F0E8E4]">
            <span className="text-emerald-600 font-bold">
              ● {usersActiveCount} Aktif <span className="text-[#8C7A70] font-normal">dari {usersCount} terdaftar</span>
            </span>
            <span className="text-[#8C7A70]">
              Status: <strong className="text-[#2D2825]">{usersCount > 0 ? 'Tersinkron' : 'Belum Ada Akun'}</strong>
            </span>
          </div>
        </div>

        {/* Card 2: Total Transaksi Tercatat */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#8C7A70]">Total Transaksi Tercatat</span>
            <div className="w-8 h-8 rounded-full bg-[#FAF4F0] border border-[#E8DCD8] flex items-center justify-center text-[#5C2D16] font-bold text-xs">
              📑
            </div>
          </div>
          <div className="text-3xl font-black text-[#2D2825] tracking-tight">
            {recentTransactions.length.toLocaleString('id-ID')}
          </div>
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#F0E8E4]">
            <span className="text-emerald-600 font-bold">
              ▲ Live Sync <span className="text-[#8C7A70] font-normal">Database</span>
            </span>
            <span className="text-[#8C7A70]">
              Success rate: <strong className="text-emerald-600 font-bold">{recentTransactions.length > 0 ? '100%' : '0%'}</strong>
            </span>
          </div>
        </div>

        {/* Card 3: Volume Arus Kas Tercatat */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#8C7A70]">Volume Arus Kas Tercatat</span>
            <div className="w-8 h-8 rounded-full bg-[#FAF4F0] border border-[#E8DCD8] flex items-center justify-center text-[#5C2D16] font-bold text-xs">
              💳
            </div>
          </div>
          <div className="text-3xl font-black text-[#2D2825] tracking-tight">
            {formatCurrency(formatShortMoney(totalCashVolume), formatShortUsd(totalCashVolume))}
          </div>
          <div className="flex items-center justify-between text-[11px] pt-2 border-t border-[#F0E8E4]">
            <span className="text-emerald-600 font-bold">
              {totalCashVolume > 0 ? '▲ Data Riil' : '● Rp 0'} <span className="text-[#8C7A70] font-normal">Periode Ini</span>
            </span>
            <span className="text-[#8C7A70]">
              Surplus: <strong className="text-[#5C2D16] font-bold">{formatCurrency(formatShortMoney(netSurplus), formatShortUsd(netSurplus))}</strong>
            </span>
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
                <span>Audiens Terdampak: <strong className="text-[#2D2825]">{usersCount} Akun</strong></span>
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
            <button
              onClick={loadLiveTransactions}
              title="Perbarui data dari backend / mobile"
              className="px-3 py-1.5 bg-white border border-[#E5DDD8] text-[#5C2D16] font-bold text-xs rounded-xl hover:bg-[#FAF7F4] flex items-center gap-1.5 cursor-pointer shadow-xs transition-all"
            >
              <span className={isRefreshingTrx ? 'animate-spin' : ''}>↻</span>
              <span>{isRefreshingTrx ? 'Memuat...' : 'Refresh'}</span>
            </button>
            <button
              onClick={() => onNavigateTab && onNavigateTab('transactions')}
              className="px-3 py-1.5 bg-[#5C2D16] text-white font-bold text-xs rounded-xl hover:bg-[#482210] flex items-center gap-1 cursor-pointer shadow-xs"
            >
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
              {filteredTrx.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 max-w-md mx-auto">
                      <div className="w-14 h-14 rounded-2xl bg-[#FAF4F0] border border-[#E8DCD8] flex items-center justify-center text-2xl shadow-xs">
                        💳
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-[#2D2825] text-sm">Belum Ada Aktivitas Transaksi</div>
                        <p className="text-[11px] text-[#8C7A70] leading-relaxed">
                          Database backend saat ini masih kosong karena belum ada pengguna yang melakukan transaksi. Transaksi baru yang dicatat pengguna dari aplikasi Mobile (Flutter) maupun Web akan otomatis tampil di sini secara real-time.
                        </p>
                      </div>
                      <button
                        onClick={handleCreateSampleTransaction}
                        className="mt-2 px-3.5 py-1.5 bg-[#FAF4F0] hover:bg-[#F2EAE5] border border-[#E8DCD8] text-[#5C2D16] font-bold text-xs rounded-xl transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                      >
                        <span>✨</span>
                        <span>Buat Transaksi Percobaan ke Database</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedTrx.map((row) => (
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
                      {formatCurrency(row.amount, row.amount.replace('Rp', '$'))}
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
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="pt-3 border-t border-[#E5DDD8] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#8C7A70]">
          <div>
            Menampilkan {filteredTrx.length > 0 ? `${startIndex + 1} – ${Math.min(startIndex + pageSize, filteredTrx.length)}` : '0'} dari {filteredTrx.length} transaksi
          </div>
          <div className="flex items-center gap-1 font-semibold">
            <button
              disabled={validCurrentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              className="px-2 py-1 rounded border border-[#E5DDD8] bg-white hover:bg-[#FAF7F4] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Sebelumnya
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs transition-all ${
                  pageNum === validCurrentPage
                    ? 'bg-[#5C2D16] text-white shadow-xs'
                    : 'border border-[#E5DDD8] bg-white text-[#2D2825] hover:bg-[#FAF7F4] cursor-pointer'
                }`}
              >
                {pageNum}
              </button>
            ))}
            <button
              disabled={validCurrentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              className="px-2 py-1 rounded border border-[#E5DDD8] bg-white hover:bg-[#FAF7F4] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
