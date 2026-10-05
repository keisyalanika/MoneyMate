import React, { useState } from 'react';

export interface BudgetsPageProps {
  onTriggerPdfToast: () => void;
  fmtMoney: (idr: string, usd: string) => string;
}

export const BudgetsPage: React.FC<BudgetsPageProps> = ({ onTriggerPdfToast, fmtMoney }) => {
  const [budgetSearch, setBudgetSearch] = useState('');
  const [budgetTabFilter, setBudgetTabFilter] = useState<'All' | 'Aman' | 'Waspada' | 'Overbudget'>('All');
  const [budgetSemesterFilter, setBudgetSemesterFilter] = useState('All');

  const studentBudgets = [
    { id: 'b1', name: 'Keisya Lanika', nim: '10293841', avatar: 'KL', color: 'bg-rose-100 text-rose-800', budget: 'Rp 2.000.000', realisasi: 'Rp 2.350.000', percent: '117.5%', quotaText: '+Rp 350.000', isOver: true, catKritis: 'Makanan & Kos', status: 'Over-Budget', statusType: 'over' },
    { id: 'b2', name: 'Bima Santoso', nim: '10293842', avatar: 'BS', color: 'bg-amber-100 text-amber-800', budget: 'Rp 1.500.000', realisasi: 'Rp 1.420.000', percent: '94.6%', quotaText: 'Sisa Rp 80.000', isOver: false, catKritis: 'Hiburan & Nongkrong', status: 'Waspada', statusType: 'waspada' },
    { id: 'b3', name: 'Aulia Rahma', nim: '10293843', avatar: 'AR', color: 'bg-emerald-100 text-emerald-800', budget: 'Rp 2.500.000', realisasi: 'Rp 1.625.000', percent: '65.0%', quotaText: 'Sisa Rp 875.000', isOver: false, catKritis: 'Belanja Bulanan', status: 'Aman', statusType: 'aman' },
    { id: 'b4', name: 'Rizky Aditya', nim: '10293844', avatar: 'RA', color: 'bg-stone-200 text-stone-800', budget: 'Rp 3.000.000', realisasi: 'Rp 2.100.000', percent: '70.0%', quotaText: 'Sisa Rp 900.000', isOver: false, catKritis: 'Buku & Kuliah', status: 'Aman', statusType: 'aman' },
    { id: 'b5', name: 'Nadia Putri', nim: '10293845', avatar: 'NP', color: 'bg-rose-100 text-rose-800', budget: 'Rp 1.800.000', realisasi: 'Rp 2.050.000', percent: '113.8%', quotaText: '+Rp 250.000', isOver: true, catKritis: 'Transport & Lifestyle', status: 'Over-Budget', statusType: 'over' },
  ];

  const filteredStudentBudgets = studentBudgets.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(budgetSearch.toLowerCase()) || b.nim.includes(budgetSearch);
    const matchTab = budgetTabFilter === 'All' ? true : (budgetTabFilter === 'Aman' ? b.statusType === 'aman' : (budgetTabFilter === 'Waspada' ? b.statusType === 'waspada' : b.statusType === 'over'));
    const matchSem = budgetSemesterFilter === 'All' ? true : true;
    return matchSearch && matchTab && matchSem;
  });

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto w-full animate-fadeIn text-xs">
      <div>
        <div className="text-[11px] text-[#8C7A70] flex items-center gap-1 mb-0.5">
          <span>Anggaran</span>
          <span>›</span>
          <span className="font-semibold text-[#5C2D16]">Pemantauan Budget Mahasiswa</span>
        </div>
        <h1 className="text-2xl font-bold text-[#2D2825]">Pemantauan Anggaran Mahasiswa</h1>
        <p className="text-xs text-[#8C7A70] mt-0.5">Pantau batas kuota pengeluaran, deteksi mahasiswa over-budget, dan evaluasi kepatuhan finansial bulanan secara presisi.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-[#FAF4F0] text-[#5C2D16] flex items-center justify-center font-bold text-sm">🔄</div>
            <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded-full">↑ +2.1% bln lalu</span>
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">RATA-RATA PEMAKAIAN BUDGET</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-[#2D2825]">68.4%</span>
              <span className="text-xs text-emerald-700 font-bold">Status Sehat</span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden">
            <div className="h-full bg-emerald-600 rounded-full" style={{ width: '68.4%' }}></div>
          </div>
        </div>

        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">⚠️</div>
            <span className="px-2 py-0.5 text-[9px] font-bold bg-rose-100 text-rose-800 rounded-full">Kritis</span>
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">MAHASISWA OVER-BUDGET</div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-extrabold text-[#2D2825]">142</span>
              <span className="text-xs text-[#8C7A70]">Mahasiswa</span>
            </div>
          </div>
          <div className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
            <span>!</span> Butuh Edukasi Literasi & Konseling
          </div>
        </div>

        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-[#FAF4F0] text-[#5C2D16] flex items-center justify-center font-bold text-sm">🏛️</div>
            <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-50 text-amber-900 border border-amber-200 rounded">Aktif Semester Ini</span>
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">TOTAL ANGGARAN TERENCANA</div>
            <div className="text-xl font-extrabold text-[#2D2825] mt-1">{fmtMoney('Rp4.850.000.000', '$ 312.900')}</div>
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

      <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm text-[#2D2825]">Daftar Pemantauan Budget Mahasiswa</h2>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#F5F2ED] border border-[#E5DDD8] text-[#5C2D16] rounded-full">Total: 3.420</span>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onTriggerPdfToast} className="px-3 py-1.5 bg-white border border-[#E5DDD8] text-[#5C2D16] text-xs font-bold rounded-xl shadow-sm hover:bg-[#FAF7F4] flex items-center gap-1">
              📥 Ekspor Ledger (XLS)
            </button>
            <button className="px-3 py-1.5 bg-white border border-[#E5DDD8] text-[#5C2D16] text-xs font-bold rounded-xl shadow-sm hover:bg-[#FAF7F4] flex items-center gap-1">
              🔄 Segarkan
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
              className="bg-[#F5F2ED] border border-[#E5DDD8] rounded-xl px-2.5 py-1.5 text-xs text-[#2D2825] focus:outline-none"
            >
              <option value="All">Semua Tingkat Semester</option>
              <option value="1">Semester 1 - 2</option>
              <option value="3">Semester 3 - 4</option>
              <option value="5">Semester 5 - 6</option>
            </select>

            <div className="flex items-center bg-[#F5F2ED] p-0.5 rounded-xl text-xs font-medium text-[#6E5D53]">
              <button onClick={() => setBudgetTabFilter('All')} className={'px-2.5 py-1 rounded-lg transition-all ' + (budgetTabFilter === 'All' ? 'bg-[#5C2D16] text-white font-bold' : 'hover:text-[#5C2D16]')}>Semua (3.420)</button>
              <button onClick={() => setBudgetTabFilter('Aman')} className={'px-2.5 py-1 rounded-lg transition-all ' + (budgetTabFilter === 'Aman' ? 'bg-[#5C2D16] text-white font-bold' : 'hover:text-[#5C2D16]')}>Aman (&lt;70%)</button>
              <button onClick={() => setBudgetTabFilter('Waspada')} className={'px-2.5 py-1 rounded-lg transition-all ' + (budgetTabFilter === 'Waspada' ? 'bg-[#5C2D16] text-white font-bold' : 'hover:text-[#5C2D16]')}>Waspada (70-100%)</button>
              <button onClick={() => setBudgetTabFilter('Overbudget')} className={'px-2.5 py-1 rounded-lg transition-all ' + (budgetTabFilter === 'Overbudget' ? 'bg-[#5C2D16] text-white font-bold' : 'hover:text-[#5C2D16]')}>Overbudget (&gt;100%)</button>
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
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button className="text-[#5C2D16] hover:text-[#462211] p-1 font-bold text-sm">▶️</button>
                    <button className="text-[#8C7A70] hover:text-[#2D2825] p-1 font-bold text-sm">👁️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
