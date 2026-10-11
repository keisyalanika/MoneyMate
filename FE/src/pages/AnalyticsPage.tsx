import React, { useState } from 'react';
import { Download } from 'lucide-react';

interface AnalyticsPageProps {
  fmtMoney: (idr: string, usd: string) => string;
  totalUsersCount?: number;
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ fmtMoney, totalUsersCount = 1245 }) => {
  const [selectedMonth, setSelectedMonth] = useState('Oktober 2026');
  const [sortField, setSortField] = useState<'defisit' | 'literasi' | 'mhs'>('defisit');
  const [actionToast, setActionToast] = useState<string | null>(null);

  const cohortData = [
    {
      id: 1,
      angkatan: 'Angkatan 2026',
      semester: 'Semester 1 - 2',
      badge: 'Mahasiswa Baru - Transisi Kemandirian',
      totalMhs: '4.210 mhs',
      uangSaku: 'Rp 2.100.000 /bln',
      tabunganPercent: '11.4%',
      tabunganWidth: '28%',
      literasiScore: '61 / 100',
      risikoPercent: '38.5%',
      risikoStatus: 'Tinggi',
      risikoColor: 'bg-rose-100 text-rose-800 border-rose-200',
      evaluasi: 'Perlu Mentoring Budget',
      evaluasiColor: 'text-amber-800 font-bold'
    },
    {
      id: 2,
      angkatan: 'Angkatan 2025',
      semester: 'Semester 3 - 4',
      badge: 'Tahun Kedua - Organisasi & Proyek',
      totalMhs: '3.850 mhs',
      uangSaku: 'Rp 2.350.000 /bln',
      tabunganPercent: '17.8%',
      tabunganWidth: '45%',
      literasiScore: '73 / 100',
      risikoPercent: '19.2%',
      risikoStatus: 'Moderat',
      risikoColor: 'bg-amber-100 text-amber-900 border-amber-200',
      evaluasi: 'Stabil',
      evaluasiColor: 'text-emerald-700 font-bold'
    },
    {
      id: 3,
      angkatan: 'Angkatan 2024',
      semester: 'Semester 5 - 6',
      badge: 'Magang Industri MBKM & Part-time',
      totalMhs: '3.620 mhs',
      uangSaku: 'Rp 3.150.000 /bln',
      tabunganPercent: '23.5%',
      tabunganWidth: '65%',
      literasiScore: '82 / 100',
      risikoPercent: '8.4%',
      risikoStatus: 'Rendah',
      risikoColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      evaluasi: 'Mandiri Finansial',
      evaluasiColor: 'text-emerald-800 font-bold'
    },
    {
      id: 4,
      angkatan: 'Angkatan 2023',
      semester: 'Semester 7 - 8+',
      badge: 'Penyusunan Skripsi & Persiapan Karir',
      totalMhs: '3.140 mhs',
      uangSaku: 'Rp 2.800.000 /bln',
      tabunganPercent: '20.1%',
      tabunganWidth: '55%',
      literasiScore: '80 / 100',
      risikoPercent: '12.1%',
      risikoStatus: 'Terkendali',
      risikoColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      evaluasi: 'Dana Kelulusan Siap',
      evaluasiColor: 'text-[#5C2D16] font-bold'
    }
  ];

  const sortedCohort = [...cohortData].sort((a, b) => {
    if (sortField === 'defisit') {
      return parseFloat(b.risikoPercent) - parseFloat(a.risikoPercent);
    } else if (sortField === 'literasi') {
      return parseInt(b.literasiScore) - parseInt(a.literasiScore);
    } else {
      return parseInt(b.totalMhs.replace(/\D/g, '')) - parseInt(a.totalMhs.replace(/\D/g, ''));
    }
  });

  const handleDownloadCsv = () => {
    setActionToast('Memproses ekspor file CSV Analitik Finansial Kampus...');
    setTimeout(() => {
      setActionToast('✅ Berkas Analitik_Finansial_Oktober_2026.csv berhasil diunduh!');
      setTimeout(() => setActionToast(null), 3500);
    }, 1200);
  };

  const handleViewAuditLog = () => {
    setActionToast('✅ Log Audit AI & Rekonsiliasi Perbankan: 100% Cocok (34.500 transaksi tervalidasi).');
    setTimeout(() => setActionToast(null), 4000);
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
        <div className="text-[11px] text-[#8C7A70] flex items-center gap-1 mb-1">
          <span>Analisis</span>
          <span>›</span>
          <span className="font-semibold text-[#5C2D16]">Statistik Finansial Mahasiswa</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#E6D0C7] text-[#5C2D16] rounded uppercase tracking-wider">
              📄 LAPORAN ANALISIS MAKRO FINANSIAL
            </span>
            <h1 className="text-2xl font-black text-[#2D2825] mt-1 tracking-tight">Statistik & Tren Finansial Mahasiswa</h1>
            <p className="text-xs text-[#8C7A70] mt-0.5 max-w-2xl">
              Eksplorasi tren arus kas masuk, proporsi pengeluaran per kategori mahasiswa, dan tren tabungan per semester untuk perumusan program literasi kampus.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-white border border-[#E5DDD8] rounded-xl text-xs font-semibold text-[#5C2D16] shadow-sm shrink-0 flex items-center gap-1.5">
              <span>📅</span>
              <select
                value={selectedMonth}
                onChange={e => setSelectedMonth(e.target.value)}
                className="bg-transparent font-bold text-[#5C2D16] focus:outline-none cursor-pointer"
              >
                <option value="Oktober 2026">Bulan Ini: Oktober 2026</option>
                <option value="September 2026">Bulan Lalu: September 2026</option>
                <option value="Agustus 2026">Periode Registrasi: Agustus 2026</option>
                <option value="Juli 2026">Juli 2026</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 Summary Cards (Exact to media_1791130982558.png) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: TOTAL PERPUTARAN UANG */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">TOTAL PERPUTARAN UANG</span>
              <span className="w-7 h-7 rounded-xl bg-[#FAF4F0] text-[#5C2D16] flex items-center justify-center font-bold text-xs">🔄</span>
            </div>
            <div className="text-xl font-extrabold text-[#2D2825] mt-1.5">{fmtMoney('Rp 5.090.000.000', '$ 328.380')}</div>
            <p className="text-[10px] text-[#8C7A70] mt-0.5">Arus kas gabungan di dompet mahasiswa</p>
          </div>
          <div className="pt-2 border-t border-[#F0E8E4] text-[10px] font-bold text-emerald-700 flex items-center gap-1">
            <span className="bg-emerald-100 px-1.5 py-0.5 rounded">↑ +12% MoM</span> vs Rp 4.5M bln lalu
          </div>
        </div>

        {/* Card 2: RASIO TABUNGAN RATA-RATA */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">RASIO TABUNGAN RATA-RATA</span>
              <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">📈</span>
            </div>
            <div className="text-xl font-extrabold text-[#2D2825] mt-1.5">18.2% <span className="text-xs font-normal text-[#8C7A70]">/uang saku</span></div>
            <p className="text-[10px] text-[#8C7A70] mt-0.5">Standar ideal kampus: minimal 15.0%</p>
          </div>
          <div className="pt-2 border-t border-[#F0E8E4] flex items-center justify-between text-[10px]">
            <div className="w-24 h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: '80%' }}></div>
            </div>
            <span className="font-bold text-emerald-700">Tercapai</span>
          </div>
        </div>

        {/* Card 3: MEDIAN PENGELUARAN HARIAN */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">MEDIAN PENGELUARAN HARIAN</span>
              <span className="w-7 h-7 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold text-xs">☕</span>
            </div>
            <div className="text-xl font-extrabold text-[#2D2825] mt-1.5">{fmtMoney('Rp 42.500', '$ 2.74')} <span className="text-xs font-normal text-[#8C7A70]">/hari</span></div>
            <p className="text-[10px] text-[#8C7A70] mt-0.5">Kebutuhan makan, fotokopi, & bensin</p>
          </div>
          <div className="pt-2 border-t border-[#F0E8E4] text-[10px] text-[#8C7A70]">
            Batas aman rekomendasi: <strong className="text-[#5C2D16]">Rp 45.000</strong>
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
              <span className="text-2xl font-black text-[#2D2825]">74</span>
              <span className="text-xs font-semibold text-[#8C7A70]">/ 100</span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded">Cukup Sehat</span>
            </div>
            <p className="text-[10px] text-[#8C7A70] mt-0.5">Evaluasi kedisiplinan & dana darurat</p>
          </div>
          <div className="pt-2 border-t border-[#F0E8E4] text-[10px] font-bold text-emerald-700">
            ↑ +4.1 pts sejak awal semester
          </div>
        </div>
      </div>

      {/* Middle Row: Tren Kiri & Proporsi Kanan (Exact to media_1791130982558.png) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Tren Pemasukan vs Pengeluaran */}
        <div className="lg:col-span-2 bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
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

            {/* SVG Chart with Grid & Axis Labels */}
            <div className="relative h-48 w-full pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="anGradIn" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5C2D16" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#5C2D16" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="anGradOut" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C25E38" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#C25E38" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y-axis Labels on Left */}
                <text x="5" y="25" fill="#8C7A70" fontSize="8" fontFamily="monospace">Rp 3.0M</text>
                <text x="5" y="55" fill="#8C7A70" fontSize="8" fontFamily="monospace">Rp 2.3M</text>
                <text x="5" y="85" fill="#8C7A70" fontSize="8" fontFamily="monospace">Rp 1.5M</text>
                <text x="5" y="115" fill="#8C7A70" fontSize="8" fontFamily="monospace">Rp 0.8M</text>
                <text x="15" y="140" fill="#8C7A70" fontSize="8" fontFamily="monospace">0</text>

                {/* Grid Lines */}
                <line x1="45" y1="20" x2="490" y2="20" stroke="#F0E8E4" strokeDasharray="3 3" />
                <line x1="45" y1="50" x2="490" y2="50" stroke="#F0E8E4" strokeDasharray="3 3" />
                <line x1="45" y1="80" x2="490" y2="80" stroke="#F0E8E4" strokeDasharray="3 3" />
                <line x1="45" y1="110" x2="490" y2="110" stroke="#F0E8E4" strokeDasharray="3 3" />
                <line x1="45" y1="135" x2="490" y2="135" stroke="#E5DDD8" />

                {/* Area Fills */}
                <path d="M 60 100 L 130 90 L 210 70 L 290 52 L 370 45 L 460 38 L 460 135 L 60 135 Z" fill="url(#anGradIn)" />
                <path d="M 60 115 L 130 102 L 210 88 L 290 75 L 370 68 L 460 62 L 460 135 L 60 135 Z" fill="url(#anGradOut)" />

                {/* Curve Lines */}
                <path d="M 60 100 L 130 90 L 210 70 L 290 52 L 370 45 L 460 38" fill="none" stroke="#5C2D16" strokeWidth="3" strokeLinecap="round" />
                <path d="M 60 115 L 130 102 L 210 88 L 290 75 L 370 68 L 460 62" fill="none" stroke="#C25E38" strokeWidth="2.5" strokeDasharray="4 2" strokeLinecap="round" />

                {/* Points */}
                <circle cx="60" cy="100" r="3.5" fill="#5C2D16" />
                <circle cx="130" cy="90" r="3.5" fill="#5C2D16" />
                <circle cx="210" cy="70" r="3.5" fill="#5C2D16" />
                <circle cx="290" cy="52" r="3.5" fill="#5C2D16" />
                <circle cx="370" cy="45" r="3.5" fill="#5C2D16" />
                <circle cx="460" cy="38" r="5" fill="#5C2D16" stroke="#fff" strokeWidth="2" />

                <circle cx="60" cy="115" r="3.5" fill="#C25E38" />
                <circle cx="130" cy="102" r="3.5" fill="#C25E38" />
                <circle cx="210" cy="88" r="3.5" fill="#C25E38" />
                <circle cx="290" cy="75" r="3.5" fill="#C25E38" />
                <circle cx="370" cy="68" r="3.5" fill="#C25E38" />
                <circle cx="460" cy="62" r="5" fill="#C25E38" stroke="#fff" strokeWidth="2" />
              </svg>

              <div className="flex items-center justify-between text-[10px] font-semibold text-[#8C7A70] pl-10 pr-2 pt-1">
                <span>Mei</span>
                <span>Jun</span>
                <span>Jul</span>
                <span>Agu (Registrasi Smt)</span>
                <span>Sep</span>
                <span className="font-bold text-[#5C2D16] bg-[#FAF4F0] px-2 py-0.5 rounded border border-[#E8DCD8]">Okt 2026</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FAF4F0] border border-[#E6D4CB] rounded-xl p-2.5 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-[#554A43] flex items-center gap-1.5">
              <span className="font-bold text-[#5C2D16]">⚡ Pola Siklus:</span> Pengeluaran memuncak di W1 (bayar kos/UKT) & W4 (persiapan akhir bulan).
            </span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">Surplus Kas: +Rp 842 Jt</span>
          </div>
        </div>

        {/* Right: Proporsi Pengeluaran */}
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
              <div className="flex flex-col items-center justify-center relative">
                <div className="w-28 h-28 rounded-full border-[12px] border-[#5C2D16] flex items-center justify-center border-t-[#C25E38] border-r-amber-500 border-b-emerald-600 shadow-inner">
                  <div className="text-center">
                    <div className="text-[8px] text-[#8C7A70] uppercase font-bold">ALOKASI</div>
                    <div className="text-xs font-extrabold text-[#2D2825]">100%</div>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-[#FAF7F4] border border-[#EBE4D8] rounded-xl text-[10px] space-y-1">
                <div className="text-[9px] text-[#8C7A70] font-bold uppercase">Pengeluaran Dominan</div>
                <div className="font-extrabold text-[#5C2D16] text-xs">Makanan & Kos: 62%</div>
                <p className="text-[9px] text-[#786C65] leading-tight">Total Rp 1.14 Miliar terserap untuk kebutuhan primer bulanan mahasiswa.</p>
              </div>
            </div>

            <div className="space-y-1.5 text-[10px] pt-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#5C2D16]"></span> Makanan & Minuman</span>
                <span className="font-mono text-[#2D2825]">Rp 699.200.000 <strong className="font-bold text-[#5C2D16]">38%</strong></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#C25E38]"></span> Tempat Tinggal & Kos</span>
                <span className="font-mono text-[#2D2825]">Rp 441.600.000 <strong className="font-bold text-[#C25E38]">24%</strong></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Akademik & Kuliah</span>
                <span className="font-mono text-[#2D2825]">Rp 276.000.000 <strong className="font-bold">15%</strong></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-600"></span> Transportasi Kampus</span>
                <span className="font-mono text-[#2D2825]">Rp 165.600.000 <strong className="font-bold">9%</strong></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-700"></span> Nongkrong & Hiburan</span>
                <span className="font-mono text-[#2D2825]">Rp 147.200.000 <strong className="font-bold">8%</strong></span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-stone-400"></span> Lain-lain & Darurat</span>
                <span className="font-mono text-[#2D2825]">Rp 110.400.000 <strong className="font-bold">6%</strong></span>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-[#F0E8E4] flex items-center justify-end text-[11px]">
            <button
              onClick={() => setActionToast('Membuka rincian 24 sub-kategori transaksi mahasiswa...')}
              className="font-bold text-[#5C2D16] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Lihat Sub-Kategori Terperinci →
            </button>
          </div>
        </div>
      </div>

      {/* AI Financial Insights & Pola Perilaku (Exact to Figma media_1791130982558.png) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base text-[#5C2D16]">🤖</span>
            <h2 className="font-extrabold text-sm text-[#2D2825]">AI Financial Insights & Pola Perilaku</h2>
            <span className="px-2 py-0.5 text-[9px] font-extrabold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
              MoneyMate AI Core
            </span>
          </div>
          <span className="text-[10px] text-[#8C7A70]">Dihasilkan otomatis dari pemodelan transaksi mahasiswa</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: Pola Tanggal Kritis Finansial */}
          <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="px-2 py-0.5 bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] font-bold rounded">
                  Pola Kritis Kampus
                </span>
                <span className="font-bold text-[#C25E38]">62% Mahasiswa</span>
              </div>
              <h3 className="font-extrabold text-xs text-[#2D2825] leading-snug">
                Pola Tanggal Kritis Finansial (Tgl 23 – 28)
              </h3>
              <p className="text-[11px] text-[#554A43] leading-relaxed">
                Sebanyak 62% mahasiswa mengalami penurunan saldo rekening/dompet hingga di bawah Rp 50.000 pada tanggal 23 hingga 28 setiap bulannya menjelang transfer uang saku baru.
              </p>
              <div className="p-2.5 bg-[#FAF4F0] border border-[#E8DCD8] rounded-xl text-[10px] text-[#5C2D16]">
                <strong>Rekomendasi AI:</strong> Luncurkan fitur "Smart Envelope Lockdown" otomatis di H-10 akhir bulan untuk membatasi belanja non-pokok.
              </div>
            </div>
            <div className="pt-2 border-t border-[#F0E8E4] flex items-center justify-between text-[10px]">
              <span className="text-[#8C7A70]">Dampak Finansial:</span>
              <span className="font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">⚠️ Defisit tinggi</span>
            </div>
          </div>

          {/* Card 2: Lonjakan Metode Pencatatan Digital */}
          <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="px-2 py-0.5 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded">
                  Adopsi Fitur Pintar
                </span>
                <span className="font-bold text-emerald-700">+45% Maba</span>
              </div>
              <h3 className="font-extrabold text-xs text-[#2D2825] leading-snug">
                Lonjakan Metode Pencatatan Digital Terintegrasi
              </h3>
              <p className="text-[11px] text-[#554A43] leading-relaxed">
                Metode pencatatan pengeluaran digital melonjak 45% adopsinya di kalangan mahasiswa baru (Semester 1). Mengurangi tingkat lupa mencatat pengeluaran kantin dan perlengkapan studi.
              </p>
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[10px] text-emerald-900">
                <strong>Korelasi Positif:</strong> Mahasiswa yang mencatat teratur memiliki akurasi estimasi sisa uang bulanan 3x lebih tepat.
              </div>
            </div>
            <div className="pt-2 border-t border-[#F0E8E4] flex items-center justify-between text-[10px]">
              <span className="text-[#8C7A70]">Tingkat Retensi Pengguna:</span>
              <span className="font-bold text-emerald-700">88.4% Aktif</span>
            </div>
          </div>

          {/* Card 3: Korelasi Pengeluaran Kos Mahasiswa Rantau */}
          <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-2.5 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px]">
                <span className="px-2 py-0.5 bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] font-bold rounded">
                  Riset Demografis
                </span>
                <span className="font-bold text-[#5C2D16]">32% Proporsi</span>
              </div>
              <h3 className="font-extrabold text-xs text-[#2D2825] leading-snug">
                Korelasi Pengeluaran Kos Mahasiswa Rantau
              </h3>
              <p className="text-[11px] text-[#554A43] leading-relaxed">
                Mahasiswa perantau rata-rata menyisihkan 32% dari total uang saku bulanannya khusus untuk biaya sewa kos dan iuran listrik/air, jauh lebih tinggi dari mahasiswa non-rantau (6% transportasi rumah).
              </p>
              <div className="p-2.5 bg-[#FAF4F0] border border-[#E8DCD8] rounded-xl text-[10px] text-[#5C2D16]">
                <strong>Program Solusi:</strong> Integrasi pengingat tagihan kos bersama bapak/ibu kos via sistem notifikasi WhatsApp MoneyMate.
              </div>
            </div>
            <div className="pt-2 border-t border-[#F0E8E4] flex items-center justify-between text-[10px]">
              <span className="text-[#8C7A70]">Populasi Terdampak:</span>
              <span className="font-bold text-[#2D2825]">9.190 Mahasiswa Rantau</span>
            </div>
          </div>
        </div>
      </div>

      {/* Matriks Perilaku Finansial Berdasarkan Angkatan & Semester (Exact to Figma media_1791130982558.png) */}
      <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#2D2825]">Matriks Perilaku Finansial Berdasarkan Angkatan & Semester</h2>
            <p className="text-[10px] text-[#8C7A70] mt-0.5">Komparasi tingkat literasi keuangan, rerata uang saku, dan risiko defisit per tingkat studi.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-2.5 py-1 text-xs">
              <span className="text-[#8C7A70]">Urutkan:</span>
              <select
                value={sortField}
                onChange={e => setSortField(e.target.value as any)}
                className="bg-transparent font-bold text-[#5C2D16] focus:outline-none cursor-pointer"
              >
                <option value="defisit">Defisit Tertinggi ▾</option>
                <option value="literasi">Literasi Tertinggi ▾</option>
                <option value="mhs">Jumlah Mahasiswa ▾</option>
              </select>
            </div>
            <button
              onClick={handleDownloadCsv}
              title="Cetak Matriks"
              className="p-1.5 bg-white border border-[#E5DDD8] text-[#5C2D16] rounded-xl hover:bg-[#FAF7F4] cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F4] text-[#8C7A70] uppercase text-[9px] font-bold tracking-wider border-b border-[#E5DDD8]">
              <tr>
                <th className="py-3 px-4">KELOMPOK ANGKATAN & TINGKAT</th>
                <th className="py-3 px-4">TOTAL MAHASISWA</th>
                <th className="py-3 px-4">RERATA UANG SAKU</th>
                <th className="py-3 px-4">ALOKASI TABUNGAN</th>
                <th className="py-3 px-4">INDEKS LITERASI (1–100)</th>
                <th className="py-3 px-4">TINGKAT RISIKO DEFISIT</th>
                <th className="py-3 px-4 text-right">STATUS EVALUASI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8E4]">
              {sortedCohort.map((row) => (
                <tr key={row.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] font-bold flex items-center justify-center text-[10px]">
                        T{row.id}
                      </div>
                      <div>
                        <div className="font-bold text-[#2D2825]">{row.angkatan} ({row.semester})</div>
                        <div className="text-[10px] text-[#8C7A70]">{row.badge}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-[#2D2825]">{row.totalMhs}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#2D2825]">{row.uangSaku}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#2D2825]">{row.tabunganPercent}</span>
                      <div className="w-16 h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden">
                        <div className="h-full bg-[#5C2D16] rounded-full" style={{ width: row.tabunganWidth }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-[#5C2D16]">{row.literasiScore}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={'px-2.5 py-0.5 rounded-full font-bold text-[10px] border ' + row.risikoColor}>
                      {row.risikoPercent} ({row.risikoStatus})
                    </span>
                  </td>
                  <td className={'py-3.5 px-4 text-right ' + row.evaluasiColor}>
                    {row.evaluasi}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Audit Bar */}
        <div className="pt-3 border-t border-[#E5DDD8] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#8C7A70]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Validitas data terverifikasi via sinkronisasi rekening bank kampus & e-wallet mahasiswa ({totalUsersCount} Pengguna Terdaftar)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadCsv}
              className="font-bold text-[#5C2D16] hover:underline cursor-pointer"
            >
              Download CSV
            </button>
            <span>•</span>
            <button
              onClick={handleViewAuditLog}
              className="font-bold text-[#5C2D16] hover:underline cursor-pointer"
            >
              Lihat Log Audit AI
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
