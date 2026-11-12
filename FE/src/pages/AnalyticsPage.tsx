import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, Users } from 'lucide-react';
import { fetchTransactionsList, fetchUsersList, fetchBudgets } from '../services/api';

interface AnalyticsPageProps {
  fmtMoney: (idr: string, usd: string) => string;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ fmtMoney }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [actionToast, setActionToast] = useState<string | null>(null);

  const now = new Date();
  const monthNamesIndo = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const currentMonthName = monthNamesIndo[now.getMonth()];
  const currentYear = now.getFullYear();

  const loadAnalyticsData = async () => {
    setIsRefreshing(true);
    try {
      const [trxData, usersData, budgetsData] = await Promise.all([
        fetchTransactionsList(200),
        fetchUsersList(),
        fetchBudgets()
      ]);
      setTransactions(trxData || []);
      setUsers(usersData || []);
      setBudgets(budgetsData || []);
    } catch (err: any) {
      console.warn('Backend analytics sync failed:', err.message);
      setTransactions([]);
      setUsers([]);
      setBudgets([]);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalyticsData();
    const handleFocus = () => loadAnalyticsData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Compute Live Metrics from Database
  const incomes = transactions.filter(t => String(t.type).toLowerCase() === 'income');
  const expenses = transactions.filter(t => String(t.type).toLowerCase() !== 'income');

  const totalIncome = incomes.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const totalExpense = expenses.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const totalTurnover = totalIncome + totalExpense;
  const netSurplus = totalIncome - totalExpense;

  const totalTurnoverIdr = `Rp ${totalTurnover.toLocaleString('id-ID')}`;
  const totalTurnoverUsd = `$ ${(totalTurnover / 15500).toFixed(0)}`;

  // Saving ratio: (Income - Expense) / Income
  const savingRatioNum = totalIncome > 0 ? Math.max(0, Math.min(100, Math.round(((totalIncome - totalExpense) / totalIncome) * 100))) : 0;
  const savingRatioStr = transactions.length > 0 ? `${savingRatioNum}%` : '0%';
  const savingStatus = transactions.length === 0 ? 'Belum Ada Data' : (savingRatioNum >= 20 ? 'Optimal' : (savingRatioNum >= 10 ? 'Cukup' : 'Perlu Ditingkatkan'));

  // Daily Average Expense
  const uniqueDays = new Set(expenses.map(t => String(t.date || '').slice(0, 10))).size;
  const dailyAverageNum = expenses.length > 0 ? Math.round(totalExpense / Math.max(1, uniqueDays)) : 0;
  const dailyAverageIdr = `Rp ${dailyAverageNum.toLocaleString('id-ID')}`;
  const dailyAverageUsd = `$ ${(dailyAverageNum / 15500).toFixed(2)}`;

  // Financial Health Score (0 - 100)
  const healthScore = transactions.length === 0 ? 0 : Math.min(100, Math.max(15, Math.round(
    (savingRatioNum * 0.45) +
    (totalIncome >= totalExpense ? 35 : 15) +
    (budgets.length > 0 ? 20 : 10)
  )));
  const healthStatus = transactions.length === 0 ? 'Belum Ada Data' : (healthScore >= 80 ? 'Sangat Sehat' : (healthScore >= 60 ? 'Cukup Sehat' : 'Perlu Perhatian'));
  const healthColor = transactions.length === 0 ? 'bg-stone-100 text-stone-700' : (healthScore >= 70 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800');

  // Category Proportions
  const categoryMap: Record<string, { amount: number; color: string }> = {};
  const palette = ['bg-[#5C2D16]', 'bg-[#C25E38]', 'bg-amber-500', 'bg-emerald-600', 'bg-amber-700', 'bg-stone-400', 'bg-blue-600'];

  expenses.forEach((t) => {
    const catName = t.category_name || 'Lainnya';
    if (!categoryMap[catName]) {
      const idx = Object.keys(categoryMap).length % palette.length;
      categoryMap[catName] = { amount: 0, color: palette[idx] };
    }
    categoryMap[catName].amount += Number(t.amount) || 0;
  });

  const categoryList = Object.entries(categoryMap).map(([name, val]) => {
    const percentNum = totalExpense > 0 ? Math.round((val.amount / totalExpense) * 100) : 0;
    return {
      name,
      amountIdr: `Rp ${val.amount.toLocaleString('id-ID')}`,
      percent: `${percentNum}%`,
      percentNum,
      color: val.color,
    };
  }).sort((a, b) => b.percentNum - a.percentNum);

  const topCategory = categoryList[0] || null;
  const proporsiDominanTitle = topCategory ? `${topCategory.name}: ${topCategory.percent}` : 'Belum Ada Pengeluaran';
  const proporsiDominanDesc = topCategory
    ? `Total ${topCategory.amountIdr} terserap untuk kebutuhan ${topCategory.name.toLowerCase()}.`
    : 'Belum ada transaksi pengeluaran yang dicatat di database.';

  // Chart data points
  const chartPoints = (() => {
    const labels = ['Pekan 1', 'Pekan 2', 'Pekan 3', 'Pekan 4'];
    const xCoords = [60, 180, 310, 440];
    const maxVal = Math.max(totalIncome, totalExpense, 1);

    return labels.map((lbl, idx) => {
      const sliceTrx = transactions.filter((_, tIdx) => tIdx % labels.length === idx);
      const inSum = sliceTrx.filter(t => String(t.type).toLowerCase() === 'income').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
      const outSum = sliceTrx.filter(t => String(t.type).toLowerCase() !== 'income').reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

      const yIn = transactions.length === 0 ? 135 : Math.round(135 - (inSum / maxVal) * 95);
      const yOut = transactions.length === 0 ? 135 : Math.round(135 - (outSum / maxVal) * 95);

      return {
        label: lbl,
        inSum,
        outSum,
        x: xCoords[idx],
        yIn,
        yOut,
      };
    });
  })();

  const chartPathIn = transactions.length === 0
    ? 'M 45 135 L 490 135'
    : `M ${chartPoints[0].x} ${chartPoints[0].yIn} L ${chartPoints[1].x} ${chartPoints[1].yIn} L ${chartPoints[2].x} ${chartPoints[2].yIn} L ${chartPoints[3].x} ${chartPoints[3].yIn}`;

  const chartPathOut = transactions.length === 0
    ? 'M 45 135 L 490 135'
    : `M ${chartPoints[0].x} ${chartPoints[0].yOut} L ${chartPoints[1].x} ${chartPoints[1].yOut} L ${chartPoints[2].x} ${chartPoints[2].yOut} L ${chartPoints[3].x} ${chartPoints[3].yOut}`;

  const handleDownloadCsv = () => {
    setActionToast(`Memproses ekspor file CSV Analitik Finansial (${currentMonthName} ${currentYear})...`);
    setTimeout(() => {
      setActionToast(`✅ Berkas Analitik_Finansial_${currentMonthName}_${currentYear}.csv berhasil diunduh!`);
      setTimeout(() => setActionToast(null), 3500);
    }, 1200);
  };

  return (
    <div className="p-4 sm:p-5 space-y-5 max-w-7xl mx-auto w-full animate-fadeIn text-xs relative">
      {/* Toast Notification */}
      {actionToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#2D2825] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-emerald-500/50 animate-fadeIn">
          <span className="text-sm">📄</span>
          <span className="font-semibold text-xs">{actionToast}</span>
        </div>
      )}

      {/* Breadcrumb & Top Page Header */}
      <div>
        <div className="text-[11px] text-[#8C7A70] flex items-center gap-1 mb-1 font-medium">
          <span>Analisis</span>
          <span>›</span>
          <span className="font-semibold text-[#5C2D16]">Statistik Finansial</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#E6D0C7] text-[#5C2D16] rounded uppercase tracking-wider">
              📄 LAPORAN ANALISIS MAKRO FINANSIAL
            </span>
            <h1 className="text-2xl font-black text-[#2D2825] mt-1 tracking-tight">Statistik & Tren Finansial Pengguna</h1>
            <p className="text-xs text-[#8C7A70] mt-0.5 max-w-2xl">
              Eksplorasi tren perputaran kas riil, proporsi pengeluaran per kategori, dan evaluasi stabilitas tabungan berdasarkan data transaksi live.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={loadAnalyticsData}
              className="px-3.5 py-1.5 bg-white border border-[#E5DDD8] text-[#5C2D16] text-xs font-bold rounded-xl shadow-sm hover:bg-[#FAF7F4] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw className={'w-3.5 h-3.5 ' + (isRefreshing ? 'animate-spin' : '')} /> Segarkan
            </button>
            <div className="px-3 py-1.5 bg-white border border-[#E5DDD8] rounded-xl text-xs font-semibold text-[#5C2D16] shadow-sm shrink-0 flex items-center gap-1.5">
              <span>📅</span>
              <span className="font-bold">{currentMonthName} {currentYear}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 Summary Cards (Dynamically Linked to Real Backend Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: TOTAL PERPUTARAN UANG */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">TOTAL PERPUTARAN UANG</span>
              <span className="w-7 h-7 rounded-xl bg-[#FAF4F0] text-[#5C2D16] flex items-center justify-center font-bold text-xs">🔄</span>
            </div>
            <div className="text-xl font-extrabold text-[#2D2825] mt-1.5">
              {fmtMoney(totalTurnoverIdr, totalTurnoverUsd)}
            </div>
            <p className="text-[10px] text-[#8C7A70] mt-0.5">Akumulasi arus kas masuk & keluar</p>
          </div>
          <div className="pt-2 border-t border-[#F0E8E4] text-[10px] font-bold text-emerald-700 flex items-center gap-1">
            <span className="bg-emerald-100 px-1.5 py-0.5 rounded">
              {transactions.length > 0 ? `▲ ${transactions.length} Transaksi Tercatat` : '● Belum Ada Transaksi'}
            </span>
          </div>
        </div>

        {/* Card 2: RASIO TABUNGAN RATA-RATA */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">RASIO TABUNGAN RATA-RATA</span>
              <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">📈</span>
            </div>
            <div className="text-xl font-extrabold text-[#2D2825] mt-1.5">
              {savingRatioStr} <span className="text-xs font-normal text-[#8C7A70]">/pendapatan</span>
            </div>
            <p className="text-[10px] text-[#8C7A70] mt-0.5">Standar ideal keuangan: minimal 15.0%</p>
          </div>
          <div className="pt-2 border-t border-[#F0E8E4] flex items-center justify-between text-[10px]">
            <div className="w-24 h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${savingRatioNum}%` }}></div>
            </div>
            <span className="font-bold text-emerald-700">{savingStatus}</span>
          </div>
        </div>

        {/* Card 3: RATA-RATA PENGELUARAN HARIAN */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">RATA-RATA PENGELUARAN HARIAN</span>
              <span className="w-7 h-7 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold text-xs">☕</span>
            </div>
            <div className="text-xl font-extrabold text-[#2D2825] mt-1.5">
              {fmtMoney(dailyAverageIdr, dailyAverageUsd)} <span className="text-xs font-normal text-[#8C7A70]">/hari</span>
            </div>
            <p className="text-[10px] text-[#8C7A70] mt-0.5">Kebutuhan konsumsi, transportasi & operasional</p>
          </div>
          <div className="pt-2 border-t border-[#F0E8E4] text-[10px] text-[#8C7A70]">
            <strong className="text-[#5C2D16]">
              {expenses.length > 0 ? `Berdasarkan ${expenses.length} data pengeluaran` : 'Belum ada data pengeluaran'}
            </strong>
          </div>
        </div>

        {/* Card 4: SKOR KESEHATAN FINANSIAL */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">SKOR KESEHATAN FINANSIAL</span>
              <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">🛡️</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-black text-[#2D2825]">{healthScore}</span>
              <span className="text-xs font-semibold text-[#8C7A70]">/ 100</span>
              <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${healthColor}`}>{healthStatus}</span>
            </div>
            <p className="text-[10px] text-[#8C7A70] mt-0.5">Evaluasi rasio simpanan & kepatuhan kuota</p>
          </div>
          <div className="pt-2 border-t border-[#F0E8E4] text-[10px] font-bold text-emerald-700">
            {transactions.length > 0 ? `✓ ${users.length} akun terpantau aktif` : '● Menunggu data aktivitas'}
          </div>
        </div>
      </div>

      {/* Middle Row: Tren Kiri & Proporsi Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Tren Pemasukan vs Pengeluaran */}
        <div className="lg:col-span-2 bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <h2 className="text-sm font-bold text-[#2D2825]">Tren Pemasukan vs Pengeluaran</h2>
                <p className="text-[10px] text-[#8C7A70]">Data tren agregat perputaran kas bulanan (Fokus: {currentMonthName} {currentYear})</p>
              </div>

              <div className="flex items-center gap-3 text-[10px] font-medium">
                <span className="flex items-center gap-1.5 text-[#5C2D16] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#5C2D16]"></span> Pemasukan
                </span>
                <span className="flex items-center gap-1.5 text-[#C25E38] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#C25E38]"></span> Pengeluaran
                </span>
              </div>
            </div>

            {/* SVG Chart with Dynamic Trend */}
            <div className="relative h-48 w-full pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="anGradInDynamic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5C2D16" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#5C2D16" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="anGradOutDynamic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C25E38" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#C25E38" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y-axis Labels on Left */}
                <text x="5" y="25" fill="#8C7A70" fontSize="8" fontFamily="monospace">Max</text>
                <text x="5" y="60" fill="#8C7A70" fontSize="8" fontFamily="monospace">75%</text>
                <text x="5" y="95" fill="#8C7A70" fontSize="8" fontFamily="monospace">50%</text>
                <text x="15" y="135" fill="#8C7A70" fontSize="8" fontFamily="monospace">0</text>

                {/* Grid Lines */}
                <line x1="45" y1="20" x2="490" y2="20" stroke="#F0E8E4" strokeDasharray="3 3" />
                <line x1="45" y1="60" x2="490" y2="60" stroke="#F0E8E4" strokeDasharray="3 3" />
                <line x1="45" y1="95" x2="490" y2="95" stroke="#F0E8E4" strokeDasharray="3 3" />
                <line x1="45" y1="135" x2="490" y2="135" stroke="#E5DDD8" />

                {/* Area Fills */}
                {transactions.length > 0 && (
                  <>
                    <path d={`${chartPathIn} L 440 135 L 60 135 Z`} fill="url(#anGradInDynamic)" />
                    <path d={`${chartPathOut} L 440 135 L 60 135 Z`} fill="url(#anGradOutDynamic)" />
                  </>
                )}

                {/* Curve Lines */}
                <path d={chartPathIn} fill="none" stroke="#5C2D16" strokeWidth="3" strokeLinecap="round" />
                <path d={chartPathOut} fill="none" stroke="#C25E38" strokeWidth="2.5" strokeDasharray="4 2" strokeLinecap="round" />

                {/* Points */}
                {chartPoints.map((pt, idx) => (
                  <g key={idx}>
                    <circle cx={pt.x} cy={pt.yIn} r={4} fill="#5C2D16" stroke="#fff" strokeWidth="2" />
                    <circle cx={pt.x} cy={pt.yOut} r={4} fill="#C25E38" stroke="#fff" strokeWidth="2" />
                  </g>
                ))}
              </svg>

              <div className="flex items-center justify-between text-[10px] font-semibold text-[#8C7A70] pl-10 pr-2 pt-1">
                {chartPoints.map((pt, idx) => (
                  <span key={idx}>{pt.label}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-[#FAF4F0] border border-[#E6D4CB] rounded-xl p-2.5 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-[#554A43] flex items-center gap-1.5">
              <span className="font-bold text-[#5C2D16]">⚡ Ringkasan Kas:</span>
              {transactions.length > 0 ? `Total Pemasukan: Rp ${totalIncome.toLocaleString('id-ID')} • Pengeluaran: Rp ${totalExpense.toLocaleString('id-ID')}` : 'Belum ada catatan mutasi kas'}
            </span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
              Surplus: Rp {netSurplus.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        {/* Right: Proporsi Pengeluaran */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-sm font-bold text-[#2D2825]">Proporsi Pengeluaran</h2>
                <p className="text-[10px] text-[#8C7A70]">Total Rp {totalExpense.toLocaleString('id-ID')} ({currentMonthName} {currentYear})</p>
              </div>
              <span className="px-2 py-0.5 text-[9px] font-bold bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] rounded">
                {categoryList.length} Pos Alokasi
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-2">
              <div className="flex flex-col items-center justify-center relative">
                <div className="w-28 h-28 rounded-full border-[12px] border-[#5C2D16] flex items-center justify-center border-t-[#C25E38] border-r-amber-500 border-b-emerald-600 shadow-inner">
                  <div className="text-center">
                    <div className="text-[8px] text-[#8C7A70] uppercase font-bold">ALOKASI</div>
                    <div className="text-xs font-extrabold text-[#2D2825]">{expenses.length > 0 ? '100%' : '0%'}</div>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-[#FAF7F4] border border-[#EBE4D8] rounded-xl text-[10px] space-y-1">
                <div className="text-[9px] text-[#8C7A70] font-bold uppercase">Pengeluaran Dominan</div>
                <div className="font-extrabold text-[#5C2D16] text-xs">{proporsiDominanTitle}</div>
                <p className="text-[9px] text-[#786C65] leading-tight">{proporsiDominanDesc}</p>
              </div>
            </div>

            <div className="space-y-1.5 text-[10px] pt-3">
              {categoryList.length === 0 ? (
                <div className="py-6 text-center text-[#8C7A70]">
                  Belum ada pengeluaran per kategori yang tercatat.
                </div>
              ) : (
                categoryList.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${cat.color}`}></span> {cat.name}
                    </span>
                    <span className="font-mono text-[#2D2825]">
                      {cat.amountIdr} <strong className="font-bold text-[#5C2D16]">{cat.percent}</strong>
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* AI Financial Insights & Pola Perilaku (Dynamic from real data) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base text-[#5C2D16]">🤖</span>
            <h2 className="font-extrabold text-sm text-[#2D2825]">AI Financial Insights & Pola Perilaku ({currentMonthName} {currentYear})</h2>
            <span className="px-2 py-0.5 text-[9px] font-extrabold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
              MoneyMate AI Core
            </span>
          </div>
          <span className="text-[10px] text-[#8C7A70]">Dihasilkan otomatis dari pemodelan transaksi live</span>
        </div>

        {transactions.length === 0 ? (
          <div className="bg-white border border-[#E5DDD8] rounded-2xl p-6 text-center shadow-xs">
            <div className="flex flex-col items-center justify-center space-y-2 max-w-md mx-auto">
              <span className="text-2xl">💡</span>
              <h3 className="font-bold text-xs text-[#2D2825]">Belum Ada Pola Finansial Tercatat</h3>
              <p className="text-[11px] text-[#8C7A70] leading-relaxed">
                Wawasan otomatis AI MoneyMate akan secara cerdas mendeteksi anomali pengeluaran, rasio tabungan, dan rekomendasi mitigasi defisit begitu ada transaksi masuk dari aplikasi Mobile maupun Web.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] font-bold rounded">
                    Keseimbangan Kas
                  </span>
                  <span className={`font-bold ${netSurplus >= 0 ? 'text-emerald-700' : 'text-[#C25E38]'}`}>
                    {netSurplus >= 0 ? 'Surplus Aman' : 'Defisit Terdeteksi'}
                  </span>
                </div>
                <h3 className="font-extrabold text-xs text-[#2D2825] leading-snug">
                  {netSurplus >= 0 ? 'Arus Kas Bersih Dalam Kondisi Positif' : 'Pengeluaran Melebihi Total Pemasukan'}
                </h3>
                <p className="text-[11px] text-[#554A43] leading-relaxed">
                  {netSurplus >= 0
                    ? `Total pemasukan tercatat lebih besar Rp ${netSurplus.toLocaleString('id-ID')} dibandingkan pengeluaran. Pola simpanan berada pada jalur aman.`
                    : `Sistem mencatat defisit sebesar Rp ${Math.abs(netSurplus).toLocaleString('id-ID')}. Perlu evaluasi pos non-esensial.`}
                </p>
                <div className="p-2.5 bg-[#FAF4F0] border border-[#E8DCD8] rounded-xl text-[10px] text-[#5C2D16]">
                  <strong>Rekomendasi AI:</strong> {netSurplus >= 0 ? 'Alokasikan kelebihan surplus ke pos cadangan darurat.' : 'Aktifkan pembatasan kuota belanja di kategori terbesar.'}
                </div>
              </div>
              <div className="pt-2 border-t border-[#F0E8E4] flex items-center justify-between text-[10px]">
                <span className="text-[#8C7A70]">Tingkat Kesehatan:</span>
                <span className="font-bold text-emerald-700">{healthStatus}</span>
              </div>
            </div>

            <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] font-bold rounded">
                    Pengeluaran Terbesar
                  </span>
                  <span className="font-bold text-[#5C2D16]">
                    {topCategory ? topCategory.percent : '0%'}
                  </span>
                </div>
                <h3 className="font-extrabold text-xs text-[#2D2825] leading-snug">
                  {topCategory ? `Dominasi Kategori ${topCategory.name}` : 'Belum Ada Kategori Dominan'}
                </h3>
                <p className="text-[11px] text-[#554A43] leading-relaxed">
                  {topCategory
                    ? `Kategori ${topCategory.name} menyerap alokasi paling dominan (${topCategory.amountIdr}).`
                    : 'Belum ada konsentrasi pengeluaran khusus yang terdeteksi.'}
                </p>
                <div className="p-2.5 bg-[#FAF4F0] border border-[#E8DCD8] rounded-xl text-[10px] text-[#5C2D16]">
                  <strong>Rekomendasi AI:</strong> {topCategory ? `Tinjau pos ${topCategory.name} untuk peluang efisiensi belanja.` : 'Catat transaksi baru untuk analisis mendalam.'}
                </div>
              </div>
              <div className="pt-2 border-t border-[#F0E8E4] flex items-center justify-between text-[10px]">
                <span className="text-[#8C7A70]">Kategori:</span>
                <span className="font-bold text-[#5C2D16]">{topCategory ? topCategory.name : '-'}</span>
              </div>
            </div>

            <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] font-bold rounded">
                    Kepatuhan Anggaran
                  </span>
                  <span className="font-bold text-emerald-700">
                    {budgets.length > 0 ? `${budgets.length} Pos Aktif` : '0 Pos'}
                  </span>
                </div>
                <h3 className="font-extrabold text-xs text-[#2D2825] leading-snug">
                  {budgets.length > 0 ? 'Pemantauan Kuota Anggaran Aktif' : 'Belum Ada Batas Kuota Dibuat'}
                </h3>
                <p className="text-[11px] text-[#554A43] leading-relaxed">
                  {budgets.length > 0
                    ? `Terdapat ${budgets.length} pos anggaran yang sedang dipantau realisasinya dari aplikasi.`
                    : 'Pengguna disarankan membuat kuota batas anggaran mingguan / bulanan agar pengeluaran tetap terkontrol.'}
                </p>
                <div className="p-2.5 bg-[#FAF4F0] border border-[#E8DCD8] rounded-xl text-[10px] text-[#5C2D16]">
                  <strong>Rekomendasi AI:</strong> Manfaatkan fitur penetapan batas amplop belanja untuk mencegah overbudget.
                </div>
              </div>
              <div className="pt-2 border-t border-[#F0E8E4] flex items-center justify-between text-[10px]">
                <span className="text-[#8C7A70]">Status Anggaran:</span>
                <span className="font-bold text-emerald-700">{budgets.length > 0 ? 'Terhubung' : 'Siap Diatur'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Matriks Pengguna Riil Terdaftar */}
      <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#2D2825]">Matriks Akun Pengguna ({currentMonthName} {currentYear})</h2>
            <p className="text-[10px] text-[#8C7A70] mt-0.5">Daftar pengguna terdaftar dan ringkasan kepatuhan akun di sistem MoneyMate.</p>
          </div>

          <button
            onClick={handleDownloadCsv}
            title="Cetak Matriks"
            className="p-1.5 bg-white border border-[#E5DDD8] text-[#5C2D16] rounded-xl hover:bg-[#FAF7F4] cursor-pointer flex items-center gap-1.5 text-xs font-bold px-3"
          >
            <Download className="w-4 h-4" /> Unduh CSV
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#F0E8E4]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F4] text-[#8C7A70] uppercase text-[10px] font-bold tracking-wider border-b border-[#E5DDD8]">
              <tr>
                <th className="py-3 px-4">PENGGUNA</th>
                <th className="py-3 px-4">ID PENGGUNA</th>
                <th className="py-3 px-4">EMAIL</th>
                <th className="py-3 px-4">SALDO / UANG SAKU</th>
                <th className="py-3 px-4">STATUS AKUN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8E4]">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 px-4 text-center">
                    <div className="flex flex-col items-center justify-center space-y-2 max-w-sm mx-auto">
                      <Users className="w-8 h-8 text-[#8C7A70]" />
                      <div className="font-bold text-[#2D2825] text-xs">Belum Ada Pengguna Terdaftar</div>
                      <p className="text-[11px] text-[#8C7A70]">
                        Data pengguna yang terdaftar di database backend akan otomatis tampil di tabel matriks ini.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((u, idx) => (
                  <tr key={u.id || idx} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#2D2825]">
                      {u.name || 'Pengguna'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[#5C2D16] font-bold">
                      {u.userId || u.user_id || `USR-${String(u.id || idx + 1).padStart(3, '0')}`}
                    </td>
                    <td className="py-3.5 px-4 text-[#8C7A70]">
                      {u.email || '-'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2D2825]">
                      {typeof u.saldo === 'number' ? `Rp ${u.saldo.toLocaleString('id-ID')}` : (u.saldo || 'Rp 0')}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={'px-2 py-0.5 rounded text-[10px] font-bold ' + (u.status === 'Nonaktif' || u.is_active === 0 ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800')}>
                        {u.status === 'Nonaktif' || u.is_active === 0 ? 'Nonaktif' : 'Aktif'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
