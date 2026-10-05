import { useState } from 'react';

export interface ReportsPageProps {
  onTriggerPdfToast: () => void;
  fmtMoney: (idr: string, usd: string) => string;
}

export const ReportsPage = ({ onTriggerPdfToast, fmtMoney }: ReportsPageProps) => {
  const [selectedReportType, setSelectedReportType] = useState<'arus_kas' | 'over_budget'>('arus_kas');
  const [selectedRange, setSelectedRange] = useState('Semester Ini (Ganjil 2026/2027)');
  const [selectedFormat, setSelectedFormat] = useState('PDF');
  
  // Toast Notification States
  const [toastGenerate, setToastGenerate] = useState(false);
  const [toastSchedule, setToastSchedule] = useState(false);

  // Intervention Modal State (Gambar 5 Specs)
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [autoLockdown, setAutoLockdown] = useState(true);
  const [counseling, setCounseling] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const handleGenerateReport = () => {
    setToastGenerate(true);
    onTriggerPdfToast();
    setTimeout(() => setToastGenerate(false), 5000);
  };

  const handleScheduleReport = () => {
    setToastSchedule(true);
    setTimeout(() => setToastSchedule(false), 5000);
  };

  const handleSendWarning = () => {
    setAlertSent(true);
    setTimeout(() => {
      setAlertSent(false);
      setShowInterventionModal(false);
    }, 2000);
  };

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto w-full animate-fadeIn text-xs">
      {/* Toast 1: Laporan Berhasil Digenerate! (Gambar 3 Specs) */}
      {toastGenerate && (
        <div className="fixed top-14 right-5 z-50 w-full max-w-sm pointer-events-auto transition-all animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-md border border-[#E5DDD8] rounded-2xl p-3.5 shadow-2xl text-xs space-y-2 border-l-4 border-emerald-500">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  📥
                </div>
                <div>
                  <div className="font-bold text-[#2D2825] text-xs">Laporan Berhasil Digenerate!</div>
                  <div className="text-[10px] text-[#A08C82]">Baru saja • SIAKAD Verified</div>
                </div>
              </div>
              <button onClick={() => setToastGenerate(false)} className="text-[#A08C82] hover:text-[#2D2825]">✕</button>
            </div>
            <p className="text-[#554A43] text-[11px] font-mono bg-[#FAF7F4] p-2 rounded-lg border border-[#E5DDD8] overflow-x-auto">
              Berkas: Laporan_Eksekutif_Finansial_Ganjil_2026_BAAK.pdf
            </p>
            <div className="w-full h-1 bg-emerald-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Toast 2: Jadwal Pengiriman Otomatis Aktif (Gambar 4 Specs) */}
      {toastSchedule && (
        <div className="fixed top-14 right-5 z-50 w-full max-w-sm pointer-events-auto transition-all animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-md border border-[#E5DDD8] rounded-2xl p-3.5 shadow-2xl text-xs space-y-2 border-l-4 border-[#5C2D16]">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-[#FAF4F0] text-[#5C2D16] flex items-center justify-center font-bold text-sm shrink-0">
                  📅
                </div>
                <div>
                  <div className="font-bold text-[#2D2825] text-xs">Jadwal Pengiriman Otomatis Aktif</div>
                  <div className="text-[10px] text-[#A08C82]">Setiap tgl 1 pukul 07:30 WIB</div>
                </div>
              </div>
              <button onClick={() => setToastSchedule(false)} className="text-[#A08C82] hover:text-[#2D2825]">✕</button>
            </div>
            <p className="text-[#554A43] text-[11px] leading-relaxed">
              Rekap bulanan dijadwalkan setiap tgl 1 pukul 07:30 WIB terkirim otomatis ke 3 email stakeholder BAAK.
            </p>
            <div className="text-[10px] font-bold text-[#5C2D16] bg-[#FAF4F0] p-1.5 rounded border border-[#E6D4CB]">
              ✉️ Biro Keuangan, Rektorat & BAAK
            </div>
          </div>
        </div>
      )}

      {/* Breadcrumb & Header Bar */}
      <div>
        <div className="text-[11px] text-[#8C7A70] flex items-center gap-1 mb-0.5">
          <span>Manajemen</span>
          <span>›</span>
          <span className="font-semibold text-[#5C2D16]">Laporan Keuangan</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-[#2D2825]">Laporan & Rekapitulasi Finansial</h1>
            <p className="text-xs text-[#8C7A70] mt-0.5 max-w-2xl">
              Buat, jadwalkan, dan unduh laporan komprehensif arus kas, audit kepatuhan dana beasiswa, dan rekapitulasi pengeluaran bulanan.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleScheduleReport}
              className="px-3 py-2 bg-white border border-[#E5DDD8] text-[#5C2D16] text-xs font-bold rounded-xl shadow-sm hover:bg-[#FAF7F4] flex items-center gap-1.5"
            >
              <span>🕒</span>
              <span>Jadwalkan Laporan Otomatis</span>
            </button>
            <button
              onClick={() => setShowInterventionModal(true)}
              className="px-3.5 py-2 bg-[#5C2D16] hover:bg-[#462211] text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5"
            >
              <span>+</span>
              <span>Buat Laporan Kustom</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Grid (Panel Generator Left & Metrik Audit Right - Gambar 1 Specs) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Panel Generator Laporan Cepat (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-[#E5DDD8] rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#F0E8E4] pb-3">
              <span className="text-base">⚙️</span>
              <h2 className="font-bold text-sm text-[#2D2825]">Panel Generator Laporan Cepat</h2>
            </div>

            {/* 1. Pilih Jenis Laporan */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-[#8C7A70] uppercase">1. PILIH JENIS LAPORAN</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Option 1 */}
                <button
                  type="button"
                  onClick={() => setSelectedReportType('arus_kas')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedReportType === 'arus_kas'
                      ? 'bg-[#5C2D16] text-white border-[#5C2D16] shadow-md'
                      : 'bg-[#FAF4F0] border-[#E6D4CB] text-[#2D2825] hover:border-[#5C2D16]/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">⇄</span>
                    <h3 className="font-bold text-xs">Laporan Arus Kas Mahasiswa</h3>
                  </div>
                  <p className={`text-[10px] mt-1 ${selectedReportType === 'arus_kas' ? 'text-stone-300' : 'text-[#8C7A70]'}`}>
                    Rekap debit kredit seluruh dompet mahasiswa
                  </p>
                </button>

                {/* Option 2 */}
                <button
                  type="button"
                  onClick={() => setSelectedReportType('over_budget')}
                  className={`p-3.5 rounded-xl border text-left transition-all ${
                    selectedReportType === 'over_budget'
                      ? 'bg-[#5C2D16] text-white border-[#5C2D16] shadow-md'
                      : 'bg-[#FAF4F0] border-[#E6D4CB] text-[#2D2825] hover:border-[#5C2D16]/40'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">⚠️</span>
                    <h3 className="font-bold text-xs">Rekapitulasi Over-Budget</h3>
                  </div>
                  <p className={`text-[10px] mt-1 ${selectedReportType === 'over_budget' ? 'text-stone-300' : 'text-[#8C7A70]'}`}>
                    Pelanggaran limit amplop & deviasi belanja
                  </p>
                </button>
              </div>
            </div>

            {/* 2 & 3. Rentang Waktu & Format Berkas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-[10px] font-bold text-[#8C7A70] uppercase mb-1">2. RENTANG WAKTU</label>
                <select
                  value={selectedRange}
                  onChange={e => setSelectedRange(e.target.value)}
                  className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-2 text-xs font-medium text-[#2D2825] focus:outline-none"
                >
                  <option value="Semester Ini (Ganjil 2026/2027)">Semester Ini (Ganjil 2026/2027)</option>
                  <option value="Bulan Ini (Oktober 2026)">Bulan Ini (Oktober 2026)</option>
                  <option value="Tahun Ajaran 2025/2026">Tahun Ajaran 2025/2026</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-[#8C7A70] uppercase mb-1">3. FORMAT BERKAS</label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedFormat('PDF')}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                      selectedFormat === 'PDF' ? 'bg-[#5C2D16] text-white border-[#5C2D16]' : 'bg-[#FAF7F4] border-[#E5DDD8] text-[#6E5D53]'
                    }`}
                  >
                    PDF Eksekutif
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedFormat('XLS')}
                    className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all ${
                      selectedFormat === 'XLS' ? 'bg-[#5C2D16] text-white border-[#5C2D16]' : 'bg-[#FAF7F4] border-[#E5DDD8] text-[#6E5D53]'
                    }`}
                  >
                    Excel Ledger (XLS)
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F0E8E4] flex items-center justify-between">
            <span className="text-[11px] text-[#8C7A70] flex items-center gap-1.5">
              <span>🔒</span> Data dilindungi enkripsi token universitas
            </span>

            <button
              onClick={handleGenerateReport}
              className="px-5 py-2.5 bg-[#5C2D16] hover:bg-[#462211] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <span>📥</span>
              <span>Generate & Unduh Laporan</span>
            </button>
          </div>
        </div>

        {/* Metrik Audit Kampus Card (Right Col - Gambar 1 Specs) */}
        <div className="bg-[#FAF4F0] border border-[#E6D4CB] rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">METRIK AUDIT KAMPUS</span>
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            </div>

            <div>
              <h2 className="text-base font-bold text-[#2D2825]">Status Disiplin Anggaran</h2>
              <p className="text-[11px] text-[#8C7A70] mt-0.5">Kalkulasi kepatuhan 4.820 mahasiswa aktif bulan ini.</p>
            </div>

            {/* Donut Chart & Breakdown Box */}
            <div className="bg-white border border-[#E8D6CD] rounded-xl p-3 flex items-center justify-between gap-3">
              {/* Donut Visual */}
              <div className="relative flex items-center justify-center shrink-0">
                <div className="w-20 h-20 rounded-full border-[7px] border-emerald-500 flex items-center justify-center border-t-rose-500 shadow-inner">
                  <div className="text-center">
                    <div className="text-xs font-extrabold text-[#2D2825]">78%</div>
                    <div className="text-[8px] text-emerald-700 font-bold">PATUH</div>
                  </div>
                </div>
              </div>

              <div className="space-y-1 text-[11px] flex-1">
                <div className="flex justify-between items-center">
                  <span className="text-[#8C7A70]">Sesuai Budget</span>
                  <strong className="font-bold text-[#2D2825]">3.759 Mhs</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8C7A70]">Over-Budget</span>
                  <strong className="font-bold text-rose-600">1.061 Mhs</strong>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-[#F0E8E4]">
                  <span className="text-[#8C7A70]">Rata-rata Defisit</span>
                  <strong className="font-bold font-mono text-[#5C2D16]">{fmtMoney('Rp 340.000', '$ 21.90')}</strong>
                </div>
              </div>
            </div>

            {/* Alert Notice Box */}
            <div className="bg-white border border-[#E8D6CD] rounded-xl p-2.5 text-[11px] text-[#554A43] leading-relaxed flex items-start gap-2">
              <span className="text-amber-600 text-sm">💡</span>
              <p>
                Penyaluran beasiswa tahap II dijadwalkan tanggal 5 November. Pastikan unduh audit sebelum tanggal pencairan.
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-[#E6D4CB] flex items-center justify-between text-[11px] text-[#8C7A70]">
            <span>Arsip Tersimpan: <strong>148 Dokumen</strong></span>
            <button className="font-bold text-[#5C2D16] hover:underline">Lihat Semua →</button>
          </div>
        </div>
      </div>

      {/* Koleksi Templat Laporan Siap Pakai (Gambar 1 Specs) */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-sm text-[#2D2825]">Koleksi Templat Laporan Siap Pakai</h2>
            <p className="text-[11px] text-[#8C7A70]">Format preset standar dekanat & lembaga kemahasiswaan kampus.</p>
          </div>
          <button className="text-xs font-bold text-[#5C2D16] hover:underline">Kelola Templat Kustom</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Preset Card 1 */}
          <div className="bg-white border border-[#E5DDD8] rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#FAF4F0] text-[#5C2D16] flex items-center justify-center font-bold text-base">
                  📅
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FAF4F0] border border-[#E6D4CB] text-[#5C2D16] rounded">
                  Rutin Bulanan
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-[#2D2825]">Rekap Arus Kas Bulanan Mahasiswa</h3>
                <p className="text-[11px] text-[#554A43] leading-relaxed mt-1">
                  Standar laporan arus kas menyeluruh: agregasi pemasukan transfer ortu/pekerjaan sambilan vs pos pengeluaran.
                </p>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-[#8C7A70] pt-1">
                <span>📄 PDF</span>
                <span>•</span>
                <span>🔄 Tiap tanggal 1</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0E8E4] flex items-center justify-between text-xs">
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Preset Aktif</span>
              <button
                onClick={handleGenerateReport}
                className="font-bold text-[#5C2D16] hover:underline flex items-center gap-1"
              >
                <span>Ekspor Cepat</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Preset Card 2 */}
          <div className="bg-white border border-[#E5DDD8] rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-[#FAF4F0] text-[#5C2D16] flex items-center justify-center font-bold text-base">
                  🏪
                </div>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FAF4F0] border border-[#E6D4CB] text-[#5C2D16] rounded">
                  Analisis Makro
                </span>
              </div>

              <div>
                <h3 className="font-bold text-sm text-[#2D2825]">Evaluasi Inflasi Biaya Sekitar Kampus</h3>
                <p className="text-[11px] text-[#554A43] leading-relaxed mt-1">
                  Dianalisis dari rata-rata harga struk makanan kantin, sewa kos, serta inflasi alat penunjang studi semesteran.
                </p>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-[#8C7A70] pt-1">
                <span>📈 Indeks Harga</span>
                <span>•</span>
                <span>📍 Radius 3 Km</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#F0E8E4] flex items-center justify-between text-xs">
              <span className="font-medium text-[#8C7A70]">Riset Finansial Kampus</span>
              <button
                onClick={handleGenerateReport}
                className="font-bold text-[#5C2D16] hover:underline flex items-center gap-1"
              >
                <span>Ekspor Cepat</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Kirim Peringatan Defisit Anggaran (Gambar 5 Specs) */}
      {showInterventionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-[#E5DDD8] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 text-xs">
            {/* Modal Header */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-[#8C7A70] mb-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#FAF4F0] text-[#5C2D16] font-bold rounded">Siswa: Keisya Lanika</span>
                  <span>• NIM 220194827</span>
                  <span>• Smt 4</span>
                </div>
                <button onClick={() => setShowInterventionModal(false)} className="text-[#8C7A70] hover:text-[#2D2825] text-base">✕</button>
              </div>
              <h2 className="text-lg font-bold text-[#2D2825]">Kirim Peringatan Defisit Anggaran</h2>
              <p className="text-[11px] text-[#8C7A70]">Terdeteksi pengeluaran melampaui batas bulanan mahasiswa lebih cepat dari estimasi siklus.</p>
            </div>

            {alertSent && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
                ✓ Peringatan defisit anggaran telah berhasil dikirim ke Keisya Lanika via Push & WhatsApp!
              </div>
            )}

            {/* Stat Row 3 cols */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-[#FAF7F4] p-3 rounded-xl border border-[#E5DDD8]">
                <div className="text-[10px] font-bold text-[#8C7A70] uppercase">DEFISIT TERCATAT</div>
                <div className="text-base font-extrabold text-[#C25E38] mt-0.5">+Rp 350.000</div>
                <div className="text-[9px] text-rose-600 font-bold">• 117.5% dari Pagu Rp 2.0M</div>
              </div>

              <div className="bg-[#FAF7F4] p-3 rounded-xl border border-[#E5DDD8]">
                <div className="text-[10px] font-bold text-[#8C7A70] uppercase">SISA WAKTU SIKLUS</div>
                <div className="text-base font-extrabold text-[#2D2825] mt-0.5">11 Hari Lagi</div>
                <div className="text-[9px] text-[#8C7A70]">Siklus kiriman: tgl 1 tiap bulan</div>
              </div>

              <div className="bg-[#FAF7F4] p-3 rounded-xl border border-[#E5DDD8]">
                <div className="text-[10px] font-bold text-[#8C7A70] uppercase">POS KRITIS UTAMA</div>
                <div className="text-base font-extrabold text-[#5C2D16] mt-0.5">Kuliner & Cafe</div>
                <div className="text-[9px] text-[#8C7A70]">Rp 950.000 / Rp 600.000</div>
              </div>
            </div>

            {/* Progress Bar Box */}
            <div className="bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl p-3 space-y-1.5">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-[#2D2825]">Realisasi Pos Kuliner & Cafe (158% Melampaui Batas)</span>
                <span className="font-bold text-rose-700">Defisit Rp 350.000</span>
              </div>
              <div className="w-full h-2 bg-[#E5DDD8] rounded-full overflow-hidden">
                <div className="h-full bg-rose-600 rounded-full" style={{ width: '100%' }}></div>
              </div>
              <div className="flex justify-between items-center text-[9px] text-[#8C7A70]">
                <span>Rp 0 (Awal)</span>
                <span>Batas Aman: Rp 600.000</span>
                <span className="font-bold text-[#5C2D16]">Tercapai: Rp 950.000</span>
              </div>
            </div>

            {/* Draft Pesan Intervensi Cerdas (AI Kampus) */}
            <div className="bg-[#FAF4F0] border border-[#E6D4CB] rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#5C2D16] flex items-center gap-1.5">
                  <span>🤖</span> Draft Pesan Intervensi Cerdas (AI Kampus)
                </span>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-white text-emerald-800 border border-emerald-300 rounded">
                  • Rekomendasi Terpersonalisasi
                </span>
              </div>

              <p className="text-[11px] text-[#554A43] leading-relaxed">
                Halo Keisya, sistem MoneyMate mendeteksi pengeluaran kamu di pos Kuliner & Cafe telah melebihi batas bulanan sebesar Rp 350.000. Tersisa 11 hari sebelum siklus kiriman berikutnya. Rekomendasi: Manfaatkan promo Kantin Hemat Mahasiswa Kampus dan batasi nongkrong non-esensial agar cadangan darurat tetap aman.
              </p>

              <div className="flex items-center justify-between text-[10px] text-[#8C7A70] pt-1">
                <span>⚙️ Dihasilkan dari Pola Transaksi Mingguan</span>
                <button className="font-bold text-[#5C2D16] hover:underline">Regenerate AI</button>
              </div>
            </div>

            {/* Checkbox Options */}
            <div className="space-y-2">
              <div className="text-[10px] font-bold text-[#8C7A70] uppercase">OPSI TINDAKAN ADMINISTRATIF</div>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={pushNotif} onChange={e => setPushNotif(e.target.checked)} className="accent-[#5C2D16]" />
                <span className="font-bold text-[#2D2825]">Kirimkan Push Notifikasi & WhatsApp Bot Kampus 📟</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={autoLockdown} onChange={e => setAutoLockdown(e.target.checked)} className="accent-[#5C2D16]" />
                <span className="font-bold text-[#2D2825]">Kunci Pembelian Kategori Fleksibel (Auto-Lockdown) 🔒</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={counseling} onChange={e => setCounseling(e.target.checked)} className="accent-[#5C2D16]" />
                <span className="font-medium text-[#554A43]">Alokasikan ke Konseling Keuangan BAAK ☕</span>
              </label>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-[#F0E8E4] flex items-center justify-between">
              <span className="text-[10px] text-[#8C7A70]">⏱️ Peringatan terakhir: Belum pernah</span>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowInterventionModal(false)}
                  className="px-4 py-2 border border-[#E5DDD8] bg-white text-[#6E5D53] font-bold text-xs rounded-xl hover:bg-[#FAF7F4]"
                >
                  Batal / Tunda
                </button>
                <button
                  type="button"
                  onClick={handleSendWarning}
                  className="px-4 py-2 bg-[#5C2D16] hover:bg-[#462211] text-white font-bold text-xs rounded-xl shadow"
                >
                  Kirimkan Peringatan Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
