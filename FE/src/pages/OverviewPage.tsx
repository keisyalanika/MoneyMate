import React, { useState } from 'react';

interface OverviewPageProps {
  onTriggerPdfToast?: () => void;
  fmtMoney?: (idr: string, usd: string) => string;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({ onTriggerPdfToast, fmtMoney }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<'Hari Ini' | '7 Hari' | '30 Hari' | 'Bulan Ini'>('7 Hari');
  const [aiOption, setAiOption] = useState<number>(1);
  const [hoveredDay, setHoveredDay] = useState<string | null>('Kam');
  const [searchTable, setSearchTable] = useState('');

  const formatCurrency = (idr: string, usd: string) => {
    return fmtMoney ? fmtMoney(idr, usd) : idr;
  };

  const transactionsData = [
    { id: '#TRX-94821', user: 'Ahmad Fauzi', sub: 'ahmad.fauzi@gmail.com', avatar: 'AF', category: 'Makanan & Minuman', method: 'BCA Virtual Account', amount: '- Rp 45.000', isIncome: false, status: '✓ Berhasil', statusType: 'success', time: 'Baru saja (14:32 WIB)' },
    { id: '#TRX-94820', user: 'Nadia Putri', sub: '+62 812-4491-0021', avatar: 'NP', category: 'Target Liburan (Auto-Save)', method: 'Debit Mandiri Rekening', amount: '+ Rp 500.000', isIncome: true, status: '✓ Berhasil', statusType: 'success', time: '4 menit lalu (14:28 WIB)' },
    { id: '#TRX-94819', user: 'Bambang Santoso', sub: 'bambang.s@corporate.id', avatar: 'BS', category: 'Listrik PLN Pascabayar', method: 'QRIS Merchant Wallet', amount: '- Rp 750.000', isIncome: false, status: '✓ Berhasil', statusType: 'success', time: '12 menit lalu (14:20 WIB)' },
    { id: '#TRX-94818', user: 'Dewi Lestari', sub: 'dewilestari@yahoo.com', avatar: 'DL', category: 'Fashion & Belanja Online', method: 'Kartu Kredit Visa', amount: '- Rp 1.250.000', isIncome: false, status: '⏳ Menunggu Settlement', statusType: 'warning', time: '28 menit lalu (14:04 WIB)' },
    { id: '#TRX-94817', user: 'Reza Hardiansyah', sub: 'reza.hardi@outlook.com', avatar: 'RH', category: 'Gaji & Pendapatan Tetap', method: 'Transfer Bank Payroll', amount: '+ Rp 14.500.000', isIncome: true, status: '✓ Berhasil', statusType: 'success', time: '45 menit lalu (13:47 WIB)' },
  ];

  const filteredTrx = transactionsData.filter(t => 
    t.id.toLowerCase().includes(searchTable.toLowerCase()) || 
    t.user.toLowerCase().includes(searchTable.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTable.toLowerCase())
  );

  return (
    <div className="p-5 space-y-5 max-w-7xl mx-auto w-full animate-fadeIn text-xs">
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
          <div className="text-3xl font-black text-[#2D2825] tracking-tight">1,245</div>
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
            {/* Header & Filter Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-[#2D2825]">Statistik Finansial Agregat</h2>
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                    +18% vs minggu lalu
                  </span>
                </div>
                <p className="text-[11px] text-[#8C7A70] mt-0.5">Komparasi kurva arus pemasukan vs pengeluaran seluruh akun pengguna.</p>
              </div>

              {/* Timeframe Pills */}
              <div className="flex items-center bg-[#F5F2ED] p-1 rounded-xl text-xs font-semibold text-[#6E5D53]">
                {(['Hari Ini', '7 Hari', '30 Hari', 'Bulan Ini'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setSelectedPeriod(p)}
                    className={'px-3 py-1 rounded-lg transition-all ' + (selectedPeriod === p ? 'bg-[#5C2D16] text-white font-bold shadow-xs' : 'hover:text-[#5C2D16]')}
                  >
                    {p}
                  </button>
                ))}
                <span className="px-2 text-[11px] text-[#8C7A70] font-normal cursor-pointer">Kustom ▾</span>
              </div>
            </div>

            {/* Sub-summary metrics */}
            <div className="flex flex-wrap items-center gap-5 pt-3 border-t border-[#F0E8E4] mt-3 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#5C2D16]"></span>
                <span className="text-[#8C7A70]">Total Pemasukan:</span>
                <strong className="font-extrabold text-[#2D2825]">{formatCurrency('Rp 4.520.000.000', '$ 291.612')}</strong>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C25E38]"></span>
                <span className="text-[#8C7A70]">Total Pengeluaran:</span>
                <strong className="font-extrabold text-[#2D2825]">{formatCurrency('Rp 3.120.000.000', '$ 201.290')}</strong>
              </div>
              <div className="ml-auto text-[11px] text-[#8C7A70]">
                Rata-rata Harian: <strong className="text-emerald-700 font-bold">{formatCurrency('Rp 642.800', '$ 41.47')} (+12%)</strong>
              </div>
            </div>

            {/* SVG Interactive Line Chart */}
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

                {/* Curve Pemasukan (Upper Brown Curve) */}
                <path fill="url(#pemasukanGrad)" d="M 30 110 Q 100 80, 170 95 T 310 40 T 450 75 L 450 140 L 30 140 Z" />
                <path fill="none" stroke="#5C2D16" strokeWidth="3" strokeLinecap="round" d="M 30 110 Q 100 80, 170 95 T 310 40 T 450 75" />

                {/* Curve Pengeluaran (Lower Orange Curve) */}
                <path fill="url(#pengeluaranGrad)" d="M 30 125 Q 100 100, 170 110 T 310 70 T 450 95 L 450 140 L 30 140 Z" />
                <path fill="none" stroke="#C25E38" strokeWidth="2.5" strokeDasharray="4 2" strokeLinecap="round" d="M 30 125 Q 100 100, 170 110 T 310 70 T 450 95" />

                {/* Points */}
                {[{ day: 'Sen', x: 30, y: 110 }, { day: 'Sel', x: 100, y: 80 }, { day: 'Rab', x: 170, y: 95 }, { day: 'Kam', x: 310, y: 40 }, { day: 'Jum', x: 380, y: 55 }, { day: 'Sab', x: 415, y: 65 }, { day: 'Min', x: 450, y: 75 }].map((pt) => (
                  <g key={pt.day} className="cursor-pointer" onClick={() => setHoveredDay(pt.day)}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={pt.day === hoveredDay ? '7' : '4'}
                      className={pt.day === hoveredDay ? 'fill-[#5C2D16] stroke-white stroke-[3]' : 'fill-white stroke-[#5C2D16] stroke-[2]'}
                    />
                  </g>
                ))}
              </svg>

              {/* Kamis Hover Tooltip Card (Identical to Figma) */}
              {hoveredDay === 'Kam' && (
                <div className="absolute top-2 left-[58%] -translate-x-1/2 bg-[#2D2825] text-white p-3 rounded-2xl shadow-2xl z-20 text-[11px] border border-[#5C2D16]/50 min-w-[210px] animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-[#4A423E] pb-1.5 mb-1.5">
                    <span className="font-bold text-[#E6D0C7]">Kamis, 24 Okt 2026</span>
                    <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-emerald-900 text-emerald-300 rounded">+24% Peak</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400"></span> Masuk:</span>
                      <strong className="font-mono font-bold">{formatCurrency('Rp 982.500.000', '$ 63.387')}</strong>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400"></span> Keluar:</span>
                      <strong className="font-mono font-bold text-rose-300">{formatCurrency('Rp 410.200.000', '$ 26.464')}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* X-Axis Labels */}
            <div className="flex justify-between items-center text-xs font-semibold text-[#8C7A70] px-3 pt-2">
              <span>Sen</span>
              <span>Sel</span>
              <span>Rab</span>
              <span className="px-2 py-0.5 bg-[#5C2D16] text-white rounded-lg font-bold">Kam</span>
              <span>Jum</span>
              <span>Sab</span>
              <span>Min</span>
            </div>
          </div>

          {/* Footer Info Banner */}
          <div className="bg-[#FAF4F0] border border-[#E6D4CB] rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-[#554A43]">
              <span className="text-emerald-600 font-bold">✓ Rekonsiliasi otomatis 100% cocok</span>
              <span className="text-[#8C7A70]">• Pembaruan data setiap 60 detik</span>
            </div>
            <button className="font-bold text-[#5C2D16] hover:underline flex items-center gap-1">
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
              onClick={onTriggerPdfToast}
              className="w-full py-2.5 bg-[#5C2D16] hover:bg-[#462211] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>⚡</span> Terapkan Rekomendasi Terpilih →
            </button>
            <div className="text-center text-[10px] text-[#8C7A70]">Abaikan untuk 24 jam</div>
          </div>
        </div>
      </div>

      {/* Distribution Section: Distribusi Kategori Pengeluaran Teratas */}
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
            <button className="px-3 py-1.5 bg-white border border-[#E5DDD8] text-[#5C2D16] font-bold text-xs rounded-xl hover:bg-[#FAF7F4] flex items-center gap-1">
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
            <button className="px-2 py-1 rounded border border-[#E5DDD8] bg-white hover:bg-[#FAF7F4]">Sebelumnya</button>
            <button className="w-6 h-6 rounded bg-[#5C2D16] text-white font-bold flex items-center justify-center">1</button>
            <button className="w-6 h-6 rounded border border-[#E5DDD8] bg-white flex items-center justify-center hover:bg-[#FAF7F4]">2</button>
            <button className="w-6 h-6 rounded border border-[#E5DDD8] bg-white flex items-center justify-center hover:bg-[#FAF7F4]">3</button>
            <span className="px-1">...</span>
            <button className="px-2 py-1 rounded border border-[#E5DDD8] bg-white hover:bg-[#FAF7F4]">249</button>
            <button className="px-2 py-1 rounded border border-[#E5DDD8] bg-white hover:bg-[#FAF7F4]">Selanjutnya</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;
