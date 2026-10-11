import React, { useState } from 'react';
import { RefreshCw, Download, Send, Eye } from 'lucide-react';

interface BudgetsPageProps {
  onTriggerPdfToast: () => void;
  fmtMoney: (idr: string, usd: string) => string;
}

export const BudgetsPage: React.FC<BudgetsPageProps> = ({ onTriggerPdfToast, fmtMoney }) => {
  const [budgetSearch, setBudgetSearch] = useState('');
  const [budgetTabFilter, setBudgetTabFilter] = useState<'All' | 'Aman' | 'Waspada' | 'Overbudget'>('All');
  const [budgetSemesterFilter, setBudgetSemesterFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshToast, setRefreshToast] = useState(false);
  const [selectedStudentForWarning, setSelectedStudentForWarning] = useState<any | null>(null);
  const [warningSuccessToast, setWarningSuccessToast] = useState<string | null>(null);

  const studentBudgets = [
    { id: 'b1', name: 'Keisya Lanika', nim: '10293841', avatar: 'KL', color: 'bg-rose-100 text-rose-800', budget: 'Rp 2.000.000', realisasi: 'Rp 2.350.000', percent: '117.5%', quotaText: '+Rp 350.000', isOver: true, catKritis: 'Makanan & Kos', status: 'Over-Budget', statusType: 'over', actionType: 'send' },
    { id: 'b2', name: 'Bima Santoso', nim: '10293842', avatar: 'BS', color: 'bg-amber-100 text-amber-800', budget: 'Rp 1.500.000', realisasi: 'Rp 1.420.000', percent: '94.6%', quotaText: 'Sisa Rp 80.000', isOver: false, catKritis: 'Hiburan & Nongkrong', status: 'Waspada', statusType: 'waspada', actionType: 'send' },
    { id: 'b3', name: 'Aulia Rahma', nim: '10293843', avatar: 'AR', color: 'bg-emerald-100 text-emerald-800', budget: 'Rp 2.500.000', realisasi: 'Rp 1.625.000', percent: '65.0%', quotaText: 'Sisa Rp 875.000', isOver: false, catKritis: 'Belanja Bulanan', status: 'Aman', statusType: 'aman', actionType: 'thumbs' },
    { id: 'b4', name: 'Rizky Aditya', nim: '10293844', avatar: 'RA', color: 'bg-stone-200 text-stone-800', budget: 'Rp 3.000.000', realisasi: 'Rp 2.100.000', percent: '70.0%', quotaText: 'Sisa Rp 900.000', isOver: false, catKritis: 'Buku & Kuliah', status: 'Aman', statusType: 'aman', actionType: 'send' },
    { id: 'b5', name: 'Nadia Putri', nim: '10293845', avatar: 'NP', color: 'bg-rose-100 text-rose-800', budget: 'Rp 1.800.000', realisasi: 'Rp 2.050.000', percent: '113.8%', quotaText: '+Rp 250.000', isOver: true, catKritis: 'Transport & Lifestyle', status: 'Over-Budget', statusType: 'over', actionType: 'send' }
  ];

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshToast(true);
      setTimeout(() => setRefreshToast(false), 3500);
    }, 700);
  };

  const handleSendWarning = (student: any) => {
    setSelectedStudentForWarning(student);
  };

  const handleConfirmSendWarning = () => {
    if (selectedStudentForWarning) {
      setWarningSuccessToast(`Peringatan defisit anggaran berhasil dikirimkan ke ${selectedStudentForWarning.name} (WhatsApp & Notifikasi SIAKAD)!`);
      setSelectedStudentForWarning(null);
      setTimeout(() => setWarningSuccessToast(null), 4000);
    }
  };

  const filteredStudentBudgets = studentBudgets.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(budgetSearch.toLowerCase()) || b.nim.includes(budgetSearch);
    const matchTab = budgetTabFilter === 'All' ? true :
      budgetTabFilter === 'Aman' ? b.statusType === 'aman' :
      budgetTabFilter === 'Waspada' ? b.statusType === 'waspada' :
      b.statusType === 'over';
    return matchSearch && matchTab;
  });

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto w-full animate-fadeIn text-xs relative">
      {/* Toast Notifikasi Refresh */}
      {refreshToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#2D2825] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-emerald-500/50 animate-fadeIn">
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">✓</span>
          <span className="font-semibold text-xs">Data anggaran mahasiswa berhasil disegarkan!</span>
        </div>
      )}

      {/* Toast Peringatan Terkirim */}
      {warningSuccessToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#2D2825] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-emerald-500/50 animate-fadeIn">
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">✓</span>
          <span className="font-semibold text-xs">{warningSuccessToast}</span>
        </div>
      )}

      {/* Top Header */}
      <div>
        <div className="text-[11px] text-[#8C7A70] flex items-center gap-1 mb-0.5">
          <span>Anggaran</span>
          <span>›</span>
          <span className="font-semibold text-[#5C2D16]">Pemantauan Budget Mahasiswa</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-[#2D2825]">Pemantauan Anggaran Mahasiswa</h1>
            <p className="text-xs text-[#8C7A70] mt-0.5">Pantau batas kuota pengeluaran, deteksi mahasiswa over-budget, dan evaluasi kepatuhan finansial bulanan secara presisi.</p>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#5C2D16] flex items-center justify-center font-bold text-sm">🔄</div>
            <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded-full">↑ +2.1% bln lalu</span>
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">RATA-RATA PEMAKAIAN BUDGET</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-[#2D2825]">68.4%</span>
              <span className="text-xs font-bold text-emerald-700">Status Sehat</span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden">
            <div className="h-full bg-[#5C2D16] rounded-full" style={{ width: '68.4%' }}></div>
          </div>
        </div>

        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-sm">⚠️</div>
            <span className="px-2 py-0.5 text-[9px] font-bold bg-rose-100 text-rose-800 rounded-full">Kritis</span>
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">MAHASISWA OVER-BUDGET</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-[#C25E38]">142</span>
              <span className="text-xs text-[#8C7A70]">Mahasiswa</span>
            </div>
          </div>
          <div className="text-[10px] text-[#8C7A70]">⚠️ <strong className="text-[#C25E38]">Butuh Edukasi Literasi & Konseling</strong></div>
        </div>

        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-[#5C2D16] flex items-center justify-center font-bold text-sm">🏛️</div>
            <span className="px-2 py-0.5 text-[9px] font-bold bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] rounded-full">Aktif Semester Ini</span>
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">TOTAL ANGGARAN TERENCANA</div>
            <div className="text-lg font-extrabold text-[#2D2825] mt-0.5">{fmtMoney('Rp 4.850.000.000', '$ 312.903')}</div>
          </div>
          <div className="text-[10px] text-[#8C7A70]">Tercakup dalam 3.420 rekening dompet mahasiswa</div>
        </div>

        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold text-sm">🍴</div>
            <span className="px-2 py-0.5 text-[9px] font-bold bg-rose-100 text-rose-800 rounded-full">Defisit Tertinggi</span>
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">KATEGORI PALING JEBOL</div>
            <div className="text-base font-extrabold text-[#5C2D16] mt-0.5">Makanan & Kuliner</div>
          </div>
          <div className="text-[10px] text-[#8C7A70]"><strong className="text-rose-700 font-bold">84%</strong> mahasiswa melampaui alokasi pos ini</div>
        </div>
      </div>

      {/* Main Budget Monitoring Table Card */}
      <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm text-[#2D2825]">Daftar Pemantauan Budget Mahasiswa</h2>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#F5F2ED] border border-[#E5DDD8] text-[#5C2D16] rounded-full">Total: 3.420</span>
          </div>

          <div className="flex items-center gap-2">
            {/* Tombol Unduh (Item 5) */}
            <button
              onClick={onTriggerPdfToast}
              className="px-3.5 py-1.5 bg-white border border-[#E5DDD8] text-[#5C2D16] text-xs font-bold rounded-xl shadow-sm hover:bg-[#FAF7F4] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Unduh
            </button>

            {/* Tombol Segarkan (Item 6) */}
            <button
              onClick={handleRefreshData}
              className="px-3.5 py-1.5 bg-white border border-[#E5DDD8] text-[#5C2D16] text-xs font-bold rounded-xl shadow-sm hover:bg-[#FAF7F4] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw className={'w-3.5 h-3.5 ' + (isRefreshing ? 'animate-spin' : '')} /> Segarkan
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Cari nama mahasiswa atau NIM..."
              value={budgetSearch}
              onChange={e => setBudgetSearch(e.target.value)}
              className="w-full bg-[#F5F2ED] border border-[#E5DDD8] rounded-xl px-3 py-1.5 text-xs text-[#2D2825] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={budgetSemesterFilter}
              onChange={e => setBudgetSemesterFilter(e.target.value)}
              className="bg-[#F5F2ED] border border-[#E5DDD8] rounded-xl px-2.5 py-1.5 text-xs text-[#2D2825] focus:outline-none cursor-pointer"
            >
              <option value="All">Semua Tingkat Semester</option>
              <option value="1">Semester 1 - 2</option>
              <option value="3">Semester 3 - 4</option>
              <option value="5">Semester 5 - 6</option>
            </select>

            <div className="flex items-center bg-[#F5F2ED] p-0.5 rounded-xl text-xs font-medium text-[#6E5D53]">
              <button onClick={() => setBudgetTabFilter('All')} className={'px-2.5 py-1 rounded-lg transition-all cursor-pointer ' + (budgetTabFilter === 'All' ? 'bg-[#5C2D16] text-white font-bold' : 'hover:text-[#5C2D16]')}>Semua (3.420)</button>
              <button onClick={() => setBudgetTabFilter('Aman')} className={'px-2.5 py-1 rounded-lg transition-all cursor-pointer ' + (budgetTabFilter === 'Aman' ? 'bg-[#5C2D16] text-white font-bold' : 'hover:text-[#5C2D16]')}>Aman (&lt;70%)</button>
              <button onClick={() => setBudgetTabFilter('Waspada')} className={'px-2.5 py-1 rounded-lg transition-all cursor-pointer ' + (budgetTabFilter === 'Waspada' ? 'bg-[#5C2D16] text-white font-bold' : 'hover:text-[#5C2D16]')}>Waspada (70-100%)</button>
              <button onClick={() => setBudgetTabFilter('Overbudget')} className={'px-2.5 py-1 rounded-lg transition-all cursor-pointer ' + (budgetTabFilter === 'Overbudget' ? 'bg-[#5C2D16] text-white font-bold' : 'hover:text-[#5C2D16]')}>Overbudget (&gt;100%)</button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F4] text-[#8C7A70] uppercase text-[9px] font-bold tracking-wider border-b border-[#E5DDD8]">
              <tr>
                <th className="py-3 px-4">MAHASISWA & NIM</th>
                <th className="py-3 px-4">BUDGET BULANAN</th>
                <th className="py-3 px-4">REALISASI PENGELUARAN</th>
                <th className="py-3 px-4">PERSENTASE & KUOTA</th>
                <th className="py-3 px-4">KATEGORI KRITIS</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8E4]">
              {filteredStudentBudgets.map((b) => (
                <tr key={b.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className={'w-7 h-7 rounded-full font-bold flex items-center justify-center text-xs ' + b.color}>
                        {b.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-[#2D2825]">{b.name}</div>
                        <div className="text-[10px] text-[#8C7A70]">NIM: {b.nim}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#2D2825]">{b.budget}</td>
                  <td className={'py-3.5 px-4 font-mono font-bold ' + (b.isOver ? 'text-[#C25E38]' : 'text-amber-900')}>{b.realisasi}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="font-bold text-[#2D2825]">{b.percent}</span>
                      <span className={'text-[10px] ' + (b.isOver ? 'text-rose-700 font-bold' : 'text-[#8C7A70]')}>({b.quotaText})</span>
                    </div>
                    <div className="w-28 h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden mt-1">
                      <div className={'h-full rounded-full ' + (b.isOver ? 'bg-rose-600' : (b.statusType === 'waspada' ? 'bg-amber-600' : 'bg-emerald-600'))} style={{ width: Math.min(parseFloat(b.percent), 100) + '%' }}></div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 text-[11px] font-medium bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] rounded-lg flex items-center gap-1.5 w-max">
                      🍴 {b.catKritis}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={'px-2.5 py-1 text-[10px] font-bold rounded-full border flex items-center gap-1 w-max ' + (
                      b.statusType === 'over' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                      b.statusType === 'waspada' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                      'bg-emerald-100 text-emerald-800 border-emerald-300'
                    )}>
                      <span className="w-1.5 h-1.5 rounded-full fill-current"></span>
                      {b.status}
                    </span>
                  </td>
                  {/* Kolom AKSI sesuai Figma: Tombol Kirim Peringatan / Thumbs + Lihat Detail */}
                  <td className="py-3.5 px-4 text-right space-x-2">
                    {b.actionType === 'thumbs' ? (
                      <button
                        title="Budget Sehat"
                        className="text-emerald-700 hover:text-emerald-900 p-1 font-bold text-sm cursor-pointer"
                      >
                        👍
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSendWarning(b)}
                        title="Kirim Peringatan Defisit"
                        className="text-[#C25E38] hover:text-[#8C5338] p-1 font-bold text-sm cursor-pointer"
                      >
                        <Send className="w-4 h-4 inline" />
                      </button>
                    )}
                    <button
                      onClick={() => handleSendWarning(b)}
                      title="Lihat Detail Transaksi"
                      className="text-[#8C7A70] hover:text-[#2D2825] p-1 font-bold text-sm cursor-pointer"
                    >
                      <Eye className="w-4 h-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Intervensi Peringatan Defisit (Matching Figma media_1791171274733.png) */}
      {selectedStudentForWarning && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-lg w-full border border-[#E5DDD8] shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-start justify-between border-b border-[#F0E8E4] pb-3">
              <div>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-[#FAF4F0] text-[#5C2D16] rounded">
                  Siswa: {selectedStudentForWarning.name} • NIM {selectedStudentForWarning.nim}
                </span>
                <h3 className="font-extrabold text-base text-[#2D2825] mt-1">Kirim Peringatan Defisit Anggaran</h3>
                <p className="text-[10px] text-[#8C7A70]">Terdeteksi pengeluaran melampaui batas bulanan mahasiswa lebih cepat dari estimasi siklus.</p>
              </div>
              <button
                onClick={() => setSelectedStudentForWarning(null)}
                className="text-[#8C7A70] hover:text-[#2D2825] font-bold text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl">
                <div className="text-[9px] text-[#8C7A70] uppercase font-bold">Defisit Tercatat</div>
                <div className="text-xs font-black text-rose-700">{selectedStudentForWarning.quotaText}</div>
              </div>
              <div className="p-2.5 bg-[#FAF4F0] border border-[#E8DCD8] rounded-xl">
                <div className="text-[9px] text-[#8C7A70] uppercase font-bold">Sisa Waktu Siklus</div>
                <div className="text-xs font-black text-[#5C2D16]">11 Hari Lagi</div>
              </div>
              <div className="p-2.5 bg-[#FAF4F0] border border-[#E8DCD8] rounded-xl">
                <div className="text-[9px] text-[#8C7A70] uppercase font-bold">Pos Kritis Utama</div>
                <div className="text-xs font-black text-[#2D2825]">{selectedStudentForWarning.catKritis}</div>
              </div>
            </div>

            <div className="p-3 bg-[#F8F6F2] border border-[#EBE4D8] rounded-xl text-xs space-y-1.5 text-[#554A43]">
              <div className="font-bold text-[#2D2825] flex items-center gap-1.5">
                <span>🤖</span> Draft Pesan Intervensi Cerdas (AI Kampus):
              </div>
              <p className="text-[11px] leading-relaxed italic">
                "Halo {selectedStudentForWarning.name}, sistem MoneyMate mendeteksi pengeluaran kamu di pos {selectedStudentForWarning.catKritis} telah melebihi batas bulanan. Disarankan untuk membatasi belanja non-pokok agar cadangan darurat tetap aman."
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#F0E8E4]">
              <button
                type="button"
                onClick={() => setSelectedStudentForWarning(null)}
                className="px-3.5 py-1.5 bg-[#F5F2ED] text-[#6E5D53] font-bold rounded-xl text-xs hover:bg-[#EAE4DC] cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmSendWarning}
                className="px-4 py-1.5 bg-[#5C2D16] text-white font-bold rounded-xl text-xs hover:bg-[#462211] shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <span>➤</span> Kirimkan Peringatan Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
