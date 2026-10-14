import React, { useState, useEffect } from 'react';
import { Download, ChevronRight, ChevronDown, CheckSquare, Square, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { fetchAiInsights, fetchTransactionsList, fetchBudgets, fetchUsersList } from '../services/api';

interface AiInsightPageProps {
  onTriggerPdfToast?: () => void;
}

interface CampaignDetail {
  id: number;
  title: string;
  badgeColor: string;
  shortDesc: string;
  targetCount: string;
  impact: string;
  channel: string;
  details: {
    objective: string;
    mechanism: string;
    criteria: string;
    kpi: string;
  };
}

export const AiInsightPage: React.FC<AiInsightPageProps> = ({ onTriggerPdfToast }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedCampaigns, setSelectedCampaigns] = useState<number[]>([1]);
  const [expandedCampaignId, setExpandedCampaignId] = useState<number | null>(null);
  const [aiExecutedToast, setAiExecutedToast] = useState<{ show: boolean; message: string; count: number } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [trxData, bgtData, usrData] = await Promise.all([
        fetchTransactionsList(150),
        fetchBudgets(),
        fetchUsersList(),
        fetchAiInsights()
      ]);
      setTransactions(trxData || []);
      setBudgets(bgtData || []);
      setUsers(usrData || []);
    } catch (err: any) {
      console.warn('Backend sync failed in AiInsightPage:', err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    const handleFocus = () => loadData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Compute Live Metrics
  const incomes = transactions.filter(t => String(t.type).toLowerCase() === 'income');
  const expenses = transactions.filter(t => String(t.type).toLowerCase() !== 'income');
  const totalIncome = incomes.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const totalExpense = expenses.reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

  // Burn Rate: expense vs income or budget limit
  const totalBudgetLimit = budgets.reduce((sum, b) => sum + (Number(b.limitAmount) || 0), 0);
  const totalBudgetSpent = budgets.reduce((sum, b) => sum + (Number(b.spentAmount) || 0), 0);

  const burnRatePercent = totalBudgetLimit > 0
    ? Math.min(100, Math.round((totalBudgetSpent / totalBudgetLimit) * 100))
    : (totalIncome > 0 ? Math.min(100, Math.round((totalExpense / totalIncome) * 100)) : 0);

  const burnRateStatus = transactions.length === 0
    ? 'Belum Ada Data'
    : (burnRatePercent > 80 ? 'Tinggi' : (burnRatePercent > 50 ? 'Sedang' : 'Aman'));

  // Health Index
  const healthScore = transactions.length === 0 ? 0 : Math.min(100, Math.max(10, Math.round(
    (totalIncome > totalExpense ? 50 : 20) +
    (burnRatePercent < 70 ? 30 : 10) +
    (budgets.length > 0 ? 20 : 10)
  )));

  // Generate Real Anomalies
  interface AnomalyItem {
    id: string;
    category: string;
    timeAgo: string;
    title: string;
    desc: string;
    severityColor: string;
    affectedCount: string;
  }

  const detectedAnomalies: AnomalyItem[] = (() => {
    if (transactions.length === 0) return [];

    const items: AnomalyItem[] = [];
    const catMap: Record<string, number> = {};
    expenses.forEach(t => {
      const name = t.category_name || 'Lainnya';
      catMap[name] = (catMap[name] || 0) + (Number(t.amount) || 0);
    });

    const sortedCats = Object.entries(catMap).sort((a, b) => b[1] - a[1]);
    if (sortedCats.length > 0 && totalExpense > 0) {
      const [topCat, topAmt] = sortedCats[0];
      const share = Math.round((topAmt / totalExpense) * 100);
      if (share >= 35) {
        items.push({
          id: 'ano-top-cat',
          category: topCat.toUpperCase(),
          timeAgo: 'Data Terbaru',
          title: `Dominasi Pengeluaran ${share}% pada "${topCat}"`,
          desc: `Tercatat penyerapan dana sebesar Rp ${topAmt.toLocaleString('id-ID')} pada kategori ${topCat}. Disarankan alokasi batas pos belanja.`,
          severityColor: 'bg-[#C25E38]',
          affectedCount: `${users.length || 1} Akun Terpantau`
        });
      }
    }

    const overBudgets = budgets.filter(b => b.spentAmount > b.limitAmount);
    if (overBudgets.length > 0) {
      items.push({
        id: 'ano-over-budget',
        category: 'LIMIT ANGGARAN',
        timeAgo: 'Sistem Alert',
        title: `${overBudgets.length} Pos Anggaran Melebihi Kuota`,
        desc: `Pengeluaran riil telah melampaui batas yang ditetapkan pada pos: ${overBudgets.map(b => b.categoryName).join(', ')}.`,
        severityColor: 'bg-rose-600',
        affectedCount: `${overBudgets.length} Pos Defisit`
      });
    }

    return items;
  })();

  const campaigns: CampaignDetail[] = [
    {
      id: 1,
      title: 'Kirim Notifikasi Smart Budget Limit',
      badgeColor: 'bg-[#C25E38]',
      shortDesc: `Dorong pembatasan pengeluaran harian lewat push notification ke pengguna saat mendekati batas anggaran.`,
      targetCount: users.length > 0 ? `${users.length} Akun Terdaftar` : 'Akun Aktif',
      impact: '-20% Burn Rate',
      channel: 'Push & In-App',
      details: {
        objective: 'Meredam belanja impulsif dan menjaga stabilitas arus kas pengguna.',
        mechanism: 'Notifikasi otomatis jika pengeluaran harian mencapai 80% dari batas kuota anggaran.',
        criteria: 'Pengguna dengan status akun aktif yang memiliki pos anggaran.',
        kpi: 'Menurunkan frekuensi transaksi impulsif sebesar 20% dalam 14 hari.'
      }
    },
    {
      id: 2,
      title: 'Optimalisasi Cadangan Saldo Aman',
      badgeColor: 'bg-amber-600',
      shortDesc: 'Peringatan otomatis saat saldo berjalan menyentuh batas minimum cadangan darurat.',
      targetCount: users.length > 0 ? `${users.length} Akun Terdaftar` : 'Akun Aktif',
      impact: '+15% Ketahanan Saldo',
      channel: 'In-App Banner',
      details: {
        objective: 'Membantu pengguna mempertahankan saldo kas minimum yang sehat.',
        mechanism: 'Banner pengingat saat saldo operasional mendekati batas bawah.',
        criteria: 'Pengguna aktif dengan histori pengeluaran bulanan.',
        kpi: 'Tercapainya kestabilan saldo kas hingga akhir siklus bulanan.'
      }
    },
    {
      id: 3,
      title: 'Program Pembulatan Tabungan (Auto-Save)',
      badgeColor: 'bg-emerald-600',
      shortDesc: 'Tawarkan fitur pembulatan transaksi receh otomatis untuk menambah simpanan tabungan.',
      targetCount: 'Semua Akun Pengguna',
      impact: 'Rata-rata Rp 45.000/bln',
      channel: 'Gamifikasi Tabungan',
      details: {
        objective: 'Membangun kebiasaan menabung secara konsisten tanpa beban terasa.',
        mechanism: 'Pembulatan transaksi ke kelipatan terdekat masuk otomatis ke pos tabungan.',
        criteria: 'Semua pengguna MoneyMate dengan akun aktif.',
        kpi: 'Peningkatan saldo tabungan secara konsisten setiap bulan.'
      }
    }
  ];

  const toggleSelectCampaign = (id: number) => {
    if (selectedCampaigns.includes(id)) {
      setSelectedCampaigns(selectedCampaigns.filter(c => c !== id));
    } else {
      setSelectedCampaigns([...selectedCampaigns, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedCampaigns.length === campaigns.length) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(campaigns.map(c => c.id));
    }
  };

  const toggleExpand = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setExpandedCampaignId(expandedCampaignId === id ? null : id);
  };

  const handleExecuteSelectedAi = () => {
    if (selectedCampaigns.length === 0) return;
    const count = selectedCampaigns.length;
    const names = campaigns.filter(c => selectedCampaigns.includes(c.id)).map(c => c.title).join(', ');
    setAiExecutedToast({
      show: true,
      message: `${count} Rekomendasi AI Berhasil Diterapkan: ${names}`,
      count
    });
    setTimeout(() => {
      setAiExecutedToast(null);
    }, 6000);
  };

  return (
    <div className="p-4 sm:p-5 space-y-5 max-w-7xl mx-auto w-full animate-fadeIn text-xs relative">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#5C2D16] text-white flex items-center justify-center text-xl shrink-0 shadow-md">
            ⚛
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#2D2825] tracking-tight">AI Financial Intelligence</h1>
            <p className="text-xs text-[#8C7A70] mt-0.5">Analisis prediktif, deteksi anomali pengeluaran pengguna, dan rekomendasi mitigasi risiko finansial.</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadData}
            className="px-3.5 py-2 bg-white border border-[#E5DDD8] text-[#5C2D16] text-xs font-bold rounded-xl shadow-xs hover:bg-[#FAF7F4] flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={'w-3.5 h-3.5 ' + (isRefreshing ? 'animate-spin' : '')} /> Segarkan
          </button>
          <button
            onClick={onTriggerPdfToast}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#5C2D16] hover:bg-[#462211] text-white text-xs font-bold rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
          >
            <Download className="w-4 h-4" /> Unduh Insight PDF
          </button>
        </div>
      </div>

      {/* Floating Success Notification */}
      {aiExecutedToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl shadow-xl text-emerald-900 text-xs font-medium space-y-2 animate-fadeIn border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between font-extrabold">
            <span className="flex items-center gap-2 text-emerald-950">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              ✨ {aiExecutedToast.count} Rekomendasi AI Berhasil Dijalankan
            </span>
            <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full">
              🟢 {aiExecutedToast.count}/{campaigns.length} Aktif
            </span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            {aiExecutedToast.message}
          </p>
        </div>
      )}

      {/* Top 3 Metric Cards (Calculated dynamically) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: PREDIKSI BURN RATE */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#8C7A70] flex items-center gap-1.5 uppercase">
              <span className="text-[#C25E38]">⚠️</span> PREDIKSI BURN RATE GLOBAL
            </span>
            <span className={'px-2 py-0.5 text-[9px] font-extrabold rounded-full border ' + (
              burnRatePercent > 70 ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-emerald-100 text-emerald-800 border-emerald-200'
            )}>
              {burnRateStatus}
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-[#2D2825]">
              {transactions.length > 0 ? `${burnRatePercent}%` : '0%'} <span className="text-xs font-normal text-[#8C7A70]">Kapasitas Terpakai</span>
            </div>
            <div className="w-full h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden mt-2">
              <div className="h-full bg-[#C25E38] rounded-full" style={{ width: `${burnRatePercent}%` }}></div>
            </div>
          </div>
          <p className="text-[11px] text-[#8C7A70] leading-relaxed">
            {transactions.length > 0
              ? `Rasio pengeluaran tercatat mencapai ${burnRatePercent}% dari akumulasi dana/anggaran pengguna.`
              : 'Belum ada data transaksi yang dicatat. Burn rate akan dihitung otomatis saat data transaksi masuk.'}
          </p>
        </div>

        {/* Card 2: INDEKS KESEHATAN FINANSIAL */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#8C7A70] flex items-center gap-1.5 uppercase">
              <span className="text-emerald-600">📈</span> INDEKS KESEHATAN FINANSIAL
            </span>
            <span className={'px-2 py-0.5 text-[9px] font-extrabold rounded-full border ' + (
              healthScore >= 70 ? 'bg-emerald-100 text-emerald-900 border-emerald-300' : 'bg-amber-100 text-amber-900 border-amber-300'
            )}>
              {transactions.length === 0 ? 'Belum Ada Data' : (healthScore >= 70 ? 'Sehat' : 'Perhatian')}
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-[#2D2825]">
              {healthScore} <span className="text-xs font-normal text-[#8C7A70]">/ 100 Skor Agregat</span>
            </div>
            <div className="w-full h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden mt-2">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${healthScore}%` }}></div>
            </div>
          </div>
          <p className="text-[11px] text-[#8C7A70] leading-relaxed">
            {transactions.length > 0
              ? `Skor kesehatan dihitung berdasarkan rasio surplus pemasukan terhadap pengeluaran dan kepatuhan anggaran.`
              : 'Belum ada kalkulasi skor. Indeks akan aktif secara otomatis setelah pengguna mencatat transaksi.'}
          </p>
        </div>

        {/* Card 3: Kesimpulan & Intervensi AI */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#8C7A70] uppercase flex items-center gap-1.5">
              <span>💡</span> Kesimpulan & Intervensi AI
            </span>
            <span className="px-2 py-0.5 text-[9px] font-extrabold bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] rounded-full">
              Sistem Aktif
            </span>
          </div>
          <p className="text-[11px] text-[#554A43] leading-relaxed">
            {transactions.length > 0
              ? `Sistem AI memantau ${transactions.length} transaksi dan ${users.length} akun terdaftar untuk mendeteksi deviasi anggaran.`
              : 'Sistem siap menganalisis data finansial secara otomatis begitu transaksi baru dibuat dari aplikasi mobile.'}
          </p>
          <div className="pt-2 border-t border-[#F0E8E4] flex items-center justify-between text-[11px] text-[#8C7A70]">
            <span>Rekomendasi tindakan: <strong className="text-[#2D2825]">{campaigns.length} Campaign Tersedia</strong></span>
          </div>
        </div>
      </div>

      {/* Main Grid: Log Anomali Kiri & Rekomendasi Aksi Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Column: Log Anomali Terdeteksi */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-5 shadow-xs space-y-3.5 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#F0E8E4] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base text-[#C25E38]">📈</span>
                <h2 className="font-bold text-sm text-[#2D2825]">Log Anomali Terdeteksi</h2>
              </div>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] rounded-full">
                {detectedAnomalies.length} Anomali Terdeteksi
              </span>
            </div>

            {detectedAnomalies.length === 0 ? (
              <div className="bg-[#FAF7F4] border border-[#E5DDD8] rounded-2xl p-8 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-[#8C7A70] mx-auto" />
                <div className="font-bold text-[#2D2825] text-xs">Belum Ada Anomali Terdeteksi</div>
                <p className="text-[11px] text-[#8C7A70] max-w-sm mx-auto">
                  Sistem AI memindai anomali dan lonjakan belanja secara real-time. Data akan tampil ketika transaksi diinput dari aplikasi.
                </p>
              </div>
            ) : (
              detectedAnomalies.map(ano => (
                <div key={ano.id} className="bg-[#FAF7F4] border border-[#E5DDD8] rounded-2xl p-4 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-2.5 py-0.5 font-extrabold bg-[#FCEAE5] text-[#C25E38] rounded uppercase">
                      KATEGORI: {ano.category}
                    </span>
                    <span className="text-[#8C7A70]">{ano.timeAgo}</span>
                  </div>
                  <h3 className="font-extrabold text-xs text-[#2D2825] flex items-center gap-1.5">
                    <span className={'w-2 h-2 rounded-full ' + ano.severityColor}></span>
                    {ano.title}
                  </h3>
                  <p className="text-[11px] text-[#554A43] leading-relaxed">
                    {ano.desc}
                  </p>
                  <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[#E5DDD8]/60 text-[#8C7A70]">
                    <span>Target terdampak: <strong className="text-[#2D2825]">{ano.affectedCount}</strong></span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-3 border-t border-[#F0E8E4] flex items-center justify-between text-[10px] text-[#8C7A70]">
            <span>Status Monitor AI: <strong className="text-emerald-700">Aktif & Siaga</strong></span>
            <span>Total Transaksi Dipindai: <strong className="text-[#2D2825]">{transactions.length}</strong></span>
          </div>
        </div>

        {/* Right Column: Rekomendasi Aksi (Auto-Campaign) */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between border-b border-[#F0E8E4] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base text-emerald-700">⚡</span>
                <h2 className="font-bold text-sm text-[#2D2825]">Rekomendasi Aksi (Auto-Campaign)</h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="text-[10px] text-[#5C2D16] font-bold hover:underline cursor-pointer"
                >
                  {selectedCampaigns.length === campaigns.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
                </button>
                <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                  Siap Diterapkan
                </span>
              </div>
            </div>

            {/* Campaign Cards List */}
            <div className="space-y-3">
              {campaigns.map((camp) => {
                const isSelected = selectedCampaigns.includes(camp.id);
                const isExpanded = expandedCampaignId === camp.id;

                return (
                  <div
                    key={camp.id}
                    className={'rounded-2xl border transition-all ' + (
                      isSelected ? 'bg-[#FAF7F4] border-[#5C2D16] shadow-xs' : 'bg-white border-[#E5DDD8] hover:border-[#5C2D16]/40'
                    )}
                  >
                    <div
                      onClick={() => toggleSelectCampaign(camp.id)}
                      className="p-4 cursor-pointer space-y-2"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleSelectCampaign(camp.id);
                            }}
                            className="mt-0.5 text-[#5C2D16] hover:scale-110 transition-transform cursor-pointer"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-[#5C2D16]" />
                            ) : (
                              <Square className="w-4 h-4 text-[#A0948D]" />
                            )}
                          </button>

                          <div>
                            <h3 className="font-extrabold text-xs text-[#2D2825] flex items-center gap-1.5">
                              <span className={'w-2 h-2 rounded-full ' + camp.badgeColor}></span>
                              {camp.title}
                            </h3>
                            <p className="text-[11px] text-[#554A43] leading-relaxed mt-1">
                              {camp.shortDesc}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => toggleExpand(camp.id, e)}
                          title="Lihat Detail Rekomendasi"
                          className="w-7 h-7 rounded-xl bg-white border border-[#E5DDD8] flex items-center justify-center text-xs text-[#5C2D16] font-bold hover:bg-[#5C2D16] hover:text-white transition-colors shrink-0 cursor-pointer shadow-xs"
                        >
                          {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[#8C7A70] pt-1 pl-6">
                        <span>Target: <strong className="text-[#2D2825]">{camp.targetCount}</strong></span>
                        <span>Estimasi Dampak: <strong className="text-emerald-700">{camp.impact}</strong></span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-[#E5DDD8]/80 text-[11px] space-y-2 bg-white rounded-b-2xl animate-fadeIn">
                        <div className="font-bold text-[#5C2D16] flex items-center gap-1 text-[10px] uppercase tracking-wider pt-2">
                          <Sparkles className="w-3.5 h-3.5" /> Detail Parameter & Mekanisme Aturan AI
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                          <div className="p-2 bg-[#FAF7F4] border border-[#EBE4D8] rounded-xl">
                            <span className="text-[#8C7A70] font-bold block">Tujuan Intervensi:</span>
                            <span className="text-[#2D2825]">{camp.details.objective}</span>
                          </div>
                          <div className="p-2 bg-[#FAF7F4] border border-[#EBE4D8] rounded-xl">
                            <span className="text-[#8C7A70] font-bold block">Kriteria Sasaran:</span>
                            <span className="text-[#2D2825]">{camp.details.criteria}</span>
                          </div>
                          <div className="p-2 bg-[#FAF7F4] border border-[#EBE4D8] rounded-xl">
                            <span className="text-[#8C7A70] font-bold block">Mekanisme Notifikasi:</span>
                            <span className="text-[#2D2825]">{camp.details.mechanism}</span>
                          </div>
                          <div className="p-2 bg-[#FAF7F4] border border-[#EBE4D8] rounded-xl">
                            <span className="text-[#8C7A70] font-bold block">Metrik Keberhasilan (KPI):</span>
                            <span className="text-emerald-700 font-bold">{camp.details.kpi}</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-[#F0E8E4] space-y-1.5">
            <button
              onClick={handleExecuteSelectedAi}
              disabled={selectedCampaigns.length === 0}
              className={'w-full py-3 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer ' + (
                selectedCampaigns.length > 0
                  ? 'bg-[#5C2D16] hover:bg-[#462211] text-white active:scale-98'
                  : 'bg-stone-200 text-[#8C7A70] cursor-not-allowed'
              )}
            >
              <span>⚡</span>
              {selectedCampaigns.length === campaigns.length
                ? 'Jalankan Semua Rekomendasi AI Terpilih ➔'
                : selectedCampaigns.length > 0
                ? `Jalankan ${selectedCampaigns.length} Rekomendasi AI Terpilih ➔`
                : 'Pilih Minimal 1 Rekomendasi AI'}
            </button>
            <div className="text-center text-[10px] text-[#8C7A70]">
              {selectedCampaigns.length} dari {campaigns.length} rekomendasi siap diaktifkan
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiInsightPage;
