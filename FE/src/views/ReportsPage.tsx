'use client';

import React, { useState, useRef } from 'react';

export interface ReportsPageProps {
  onTriggerPdfToast?: (customMsg?: string) => void;
  fmtMoney: (idr: string, usd: string) => string;
  totalUsersCount?: number;
}

interface CustomSubjectItem {
  id: string;
  title: string;
  desc: string;
}

const CUSTOM_SUBJECTS: CustomSubjectItem[] = [
  {
    id: 'arus_kas',
    title: 'Arus Kas Keseluruhan',
    desc: 'Debit, kredit, & saldo rata-rata per mahasiswa'
  },
  {
    id: 'over_budget',
    title: 'Over-Budget & Defisit',
    desc: 'Pelanggaran limit amplop & anomali pengeluaran'
  },
  {
    id: 'beasiswa',
    title: 'Penyerapan Beasiswa',
    desc: 'KIP-K, PPA, & Bantuan Kedaruratan Kampus'
  },
  {
    id: 'pengeluaran_khusus',
    title: 'Pos Pengeluaran Khusus',
    desc: 'Makanan kantin, sewa kos, & transportasi harian'
  },
  {
    id: 'literasi',
    title: 'Skor Literasi Finansial',
    desc: 'Korelasi tes modul AI vs stabilitas tabungan'
  },
  {
    id: 'dana_darurat',
    title: 'Ketahanan Dana Darurat',
    desc: 'Daya tahan saldo saat keterlambatan kiriman'
  }
];

export const ReportsPage: React.FC<ReportsPageProps> = ({ onTriggerPdfToast, fmtMoney, totalUsersCount = 9 }) => {
  // Quick Report Panel States
  const [selectedReportType, setSelectedReportType] = useState<'arus_kas' | 'over_budget'>('arus_kas');
  const [selectedRange, setSelectedRange] = useState('Semester Ini (Ganjil 2026/2027)');

  // Modal 1: Buat Laporan Finansial Kustom (Figma media_1791764387084.png)
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>(['arus_kas', 'over_budget', 'pengeluaran_khusus']);
  // customFakultas removed
  // customAngkatan removed
  const [customKondisi, setCustomKondisi] = useState('Semua Kondisi (Prima + Warning + Kritis)');
  // customPreset removed
  const [customStartDate, setCustomStartDate] = useState('2026-09-01');
  const startDateInputRef = useRef<HTMLInputElement>(null);
  const [customEndDate, setCustomEndDate] = useState('2026-10-31');
  const endDateInputRef = useRef<HTMLInputElement>(null);

  // Modal 2: Jadwalkan Laporan Otomatis
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduleFrequency, setScheduleFrequency] = useState('Bulanan (Tgl 1 tiap bulan)');
  const [scheduleTime, setScheduleTime] = useState('07:30 WIB');
  const [stakeholders, setStakeholders] = useState({
    keuangan: true,
    baak: true,
    dekanat: true
  });

  // Modal 3: Kirim Peringatan Defisit (Intervensi Keisya Lanika)
  const [showInterventionModal, setShowInterventionModal] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);
  const [autoLockdown, setAutoLockdown] = useState(true);
  const [counseling, setCounseling] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  // Dynamic Toast Notification State (Reports & Schedule)
  const [toastGenerate, setToastGenerate] = useState(false);
  const [toastDetails, setToastDetails] = useState({
    title: 'Laporan Berhasil Digenerate & Diunduh!',
    reportName: 'Laporan Arus Kas Mahasiswa',
    range: 'Semester Ini (Ganjil 2026/2027)',
    fileName: 'Laporan_Eksekutif_Arus_Kas_Ganjil_2026.pdf'
  });
  const [toastSchedule, setToastSchedule] = useState(false);
  const [scheduleToastText, setScheduleToastText] = useState('');

  // Handle Quick Generate
  const handleGenerateQuickReport = () => {
    const reportName = selectedReportType === 'arus_kas' ? 'Laporan Arus Kas Mahasiswa' : 'Rekapitulasi Over-Budget';
    const cleanType = selectedReportType === 'arus_kas' ? 'Arus_Kas' : 'Over_Budget';
    const cleanRange = selectedRange.includes('Semester') ? 'Ganjil_2026_2027' : selectedRange.includes('Bulan') ? 'Oktober_2026' : 'TA_2025_2026';
    const fileName = `Laporan_Eksekutif_${cleanType}_${cleanRange}.pdf`;

    setToastDetails({
      title: 'Laporan PDF Berhasil Diunduh!',
      reportName,
      range: selectedRange,
      fileName
    });
    setToastGenerate(true);

    if (onTriggerPdfToast) {
      onTriggerPdfToast(`${reportName} (${selectedRange})`);
    }

    setTimeout(() => setToastGenerate(false), 5000);
  };

  // Handle Custom Report Generate
  const handleGenerateCustomReport = () => {
    const chosenTitles = CUSTOM_SUBJECTS
      .filter(s => selectedSubjects.includes(s.id))
      .map(s => s.title);
    const reportName = chosenTitles.length > 0 ? `Laporan Kustom: ${chosenTitles.slice(0, 2).join(', ')}${chosenTitles.length > 2 ? ' +' + (chosenTitles.length - 2) + ' subjek' : ''}` : 'Laporan Kustom Komprehensif';
    const dateRange = `${customStartDate} – ${customEndDate}`;
    const fileName = `Laporan_Kustom_Audit_${customStartDate}_sd_${customEndDate}.pdf`;

    setToastDetails({
      title: 'Laporan Kustom PDF Berhasil Diunduh!',
      reportName,
      range: dateRange,
      fileName
    });
    setToastGenerate(true);
    setShowCustomModal(false);

    if (onTriggerPdfToast) {
      onTriggerPdfToast(`${reportName} (${dateRange})`);
    }

    setTimeout(() => setToastGenerate(false), 5000);
  };

  // Handle Schedule Save
  const handleSaveSchedule = () => {
    const activeStakeholders: string[] = [];
    if (stakeholders.keuangan) activeStakeholders.push('Biro Keuangan');
    if (stakeholders.baak) activeStakeholders.push('BAAK');
    if (stakeholders.dekanat) activeStakeholders.push('Dekanat');

    setScheduleToastText(
      `Rekapitulasi dijadwalkan otomatis ${scheduleFrequency.toLowerCase()} pukul ${scheduleTime} WIB ke ${activeStakeholders.join(', ')}.`
    );
    setShowScheduleModal(false);
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

  const toggleSubject = (id: string) => {
    if (selectedSubjects.includes(id)) {
      setSelectedSubjects(selectedSubjects.filter(s => s !== id));
    } else {
      setSelectedSubjects([...selectedSubjects, id]);
    }
  };

  const toggleAllSubjects = () => {
    if (selectedSubjects.length === CUSTOM_SUBJECTS.length) {
      setSelectedSubjects([]);
    } else {
      setSelectedSubjects(CUSTOM_SUBJECTS.map(s => s.id));
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto w-full animate-fadeIn text-xs relative">
      {/* Dynamic Toast 1: Laporan Berhasil Diunduh (Menyesuaikan Jenis Laporan & Rentang Waktu) */}
      {toastGenerate && (
        <div className="fixed top-14 right-5 z-50 w-full max-w-sm pointer-events-auto transition-all animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-md border border-[#E5DDD8] rounded-2xl p-4 shadow-2xl text-xs space-y-2 border-l-4 border-emerald-500">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  📥
                </div>
                <div>
                  <div className="font-bold text-[#2D2825] text-xs">{toastDetails.title}</div>
                  <div className="text-[10px] text-[#8C7A70]">SIAKAD Verified • Format Resmi PDF</div>
                </div>
              </div>
              <button onClick={() => setToastGenerate(false)} className="text-[#8C7A70] hover:text-[#2D2825] p-1 cursor-pointer">✕</button>
            </div>

            <div className="text-[11px] text-[#554A43] space-y-1 bg-[#FAF7F4] p-2.5 rounded-xl border border-[#E5DDD8]">
              <div><strong>Jenis Laporan:</strong> {toastDetails.reportName}</div>
              <div><strong>Rentang Waktu:</strong> {toastDetails.range}</div>
              <div className="font-mono text-[10px] text-[#5C2D16] pt-1 border-t border-[#E5DDD8] overflow-x-auto">
                Berkas: {toastDetails.fileName}
              </div>
            </div>

            <div className="w-full h-1 bg-emerald-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full animate-pulse" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Toast 2: Jadwal Pengiriman Otomatis Aktif */}
      {toastSchedule && (
        <div className="fixed top-14 right-5 z-50 w-full max-w-sm pointer-events-auto transition-all animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-md border border-[#E5DDD8] rounded-2xl p-4 shadow-2xl text-xs space-y-2 border-l-4 border-[#5C2D16]">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FAF4F0] text-[#5C2D16] flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  🕒
                </div>
                <div>
                  <div className="font-bold text-[#2D2825] text-xs">Jadwal Pengiriman Otomatis Aktif</div>
                  <div className="text-[10px] text-[#8C7A70]">{scheduleFrequency} • {scheduleTime}</div>
                </div>
              </div>
              <button onClick={() => setToastSchedule(false)} className="text-[#8C7A70] hover:text-[#2D2825] p-1 cursor-pointer">✕</button>
            </div>
            <p className="text-[#554A43] text-[11px] leading-relaxed bg-[#FAF7F4] p-2.5 rounded-xl border border-[#E5DDD8]">
              {scheduleToastText}
            </p>
          </div>
        </div>
      )}

      {/* Breadcrumb & Header Bar */}
      <div>
        <div className="text-[11px] text-[#8C7A70] flex items-center gap-1 mb-0.5 font-medium">
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

          <div className="flex items-center gap-2.5 shrink-0">
            {/* BUTTON 1: Jadwalkan Laporan Otomatis -> Buka Modal Jadwal */}
            <button
              onClick={() => setShowScheduleModal(true)}
              className="px-3.5 py-2 bg-white border border-[#E5DDD8] hover:border-[#5C2D16] text-[#5C2D16] text-xs font-bold rounded-xl shadow-xs hover:bg-[#FAF7F4] flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>🕒</span>
              <span>Jadwalkan Laporan Otomatis</span>
            </button>

            {/* BUTTON 2: Buat Laporan Kustom -> Buka Modal Figma Kustom */}
            <button
              onClick={() => setShowCustomModal(true)}
              className="px-4 py-2 bg-[#5C2D16] hover:bg-[#462211] text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 cursor-pointer transition-all"
            >
              <span>+</span>
              <span>Buat Laporan Kustom</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Top Grid (Panel Generator Left & Metrik Audit Right) */}
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
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
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
                  className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
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

            {/* 2 & 3. Rentang Waktu & Format Berkas (PDF HANYA, TANPA XLS) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-[10px] font-bold text-[#8C7A70] uppercase mb-1">2. RENTANG WAKTU</label>
                <select
                  value={selectedRange}
                  onChange={e => setSelectedRange(e.target.value)}
                  className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-2 text-xs font-medium text-[#2D2825] focus:outline-none cursor-pointer"
                >
                  <option value="Semester Ini (Ganjil 2026/2027)">Semester Ini (Ganjil 2026/2027)</option>
                  <option value="Bulan Ini (Oktober 2026)">Bulan Ini (Oktober 2026)</option>
                  <option value="Tahun Ajaran 2025/2026">Tahun Ajaran 2025/2026</option>
                </select>
              </div>

              {/* Requirement 4: Format berkas HANYA PDF, disesuaikan rapi */}
              <div>
                <label className="block text-[10px] font-bold text-[#8C7A70] uppercase mb-1">3. FORMAT BERKAS</label>
                <div className="px-3 py-2 bg-[#FAF4F0] border border-[#C25E38] rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-base">📄</span>
                    <div>
                      <span className="font-bold text-[#5C2D16]">PDF Eksekutif</span>
                      <span className="text-[10px] text-[#8C7A70] ml-2 font-normal">• Kop Rektorat & Tabel Matriks</span>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                </div>
              </div>
            </div>
          </div>

          {/* Requirement 2: Text "data dilindungi enkripsi token universitas" DIHAPUS */}
          <div className="pt-4 border-t border-[#F0E8E4] flex items-center justify-between">
            <span className="text-[11px] text-[#8C7A70] flex items-center gap-1.5">
              <span>✓</span> Tervalidasi Sistem SIAKAD & BAAK
            </span>

            <button
              onClick={handleGenerateQuickReport}
              className="px-5 py-2.5 bg-[#5C2D16] hover:bg-[#462211] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>📥</span>
              <span>Generate & Unduh Laporan</span>
            </button>
          </div>
        </div>

        {/* Metrik Audit Kampus Card (Right Col) */}
        <div className="bg-[#FAF4F0] border border-[#E6D4CB] rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">METRIK AUDIT KAMPUS</span>
              <span className="w-2 h-2 rounded-full bg-amber-600"></span>
            </div>

            <div>
              <h2 className="text-base font-bold text-[#2D2825]">Status Disiplin Anggaran</h2>
              <p className="text-[11px] text-[#8C7A70] mt-0.5">Kalkulasi kepatuhan {totalUsersCount} mahasiswa aktif bulan ini.</p>
            </div>

            {/* Donut Chart & Breakdown Box */}
            <div className="bg-white border border-[#E8D6CD] rounded-xl p-3 flex items-center justify-between gap-3">
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
                  <strong className="font-bold text-[#2D2825]">{Math.round(totalUsersCount * 0.67)} Mhs</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#8C7A70]">Over-Budget</span>
                  <strong className="font-bold text-rose-600">{totalUsersCount - Math.round(totalUsersCount * 0.67)} Mhs</strong>
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
            <button
              onClick={() => setShowInterventionModal(true)}
              className="font-bold text-[#5C2D16] hover:underline cursor-pointer"
            >
              Audit Intervensi Mhs →
            </button>
          </div>
        </div>
      </div>

      {/* SECTION BAWAH: Templat Laporan Populer */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-[#2D2825]">Templat Laporan Populer</h2>
            <p className="text-xs text-[#8C7A70] mt-0.5">Preset terkonfigurasi untuk rapat pimpinan universitas dan audit BAAK.</p>
          </div>
          <button
            onClick={() => setShowCustomModal(true)}
            className="text-xs font-bold text-[#5C2D16] hover:underline cursor-pointer"
          >
            Kelola Templat Kustom →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1 */}
          <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between hover:border-[#5C2D16]/40 transition-all">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FAF4F0] text-[#5C2D16] rounded border border-[#E6D4CB]">
                  Dekanat
                </span>
                <span className="text-[10px] text-[#8C7A70]">Bulanan</span>
              </div>
              <h3 className="font-bold text-xs text-[#2D2825]">Rekap Eksekutif Dekanat</h3>
              <p className="text-[11px] text-[#8C7A70] leading-relaxed">
                Ringkasan komprehensif tingkat kesehatan keuangan seluruh pengguna dengan grafik perbandingan pengeluaran.
              </p>
            </div>

            <div className="pt-3 border-t border-[#F0E8E4] flex items-center justify-between text-xs">
              <span className="font-medium text-[#8C7A70]">Format: PDF Eksekutif</span>
              <button
                onClick={handleGenerateQuickReport}
                className="font-bold text-[#5C2D16] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ekspor Cepat</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between hover:border-[#5C2D16]/40 transition-all">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-50 text-amber-900 rounded border border-amber-200">
                  KIP-K & PPA
                </span>
                <span className="text-[10px] text-[#8C7A70]">Audit Semester</span>
              </div>
              <h3 className="font-bold text-xs text-[#2D2825]">Audit Kepatuhan Beasiswa</h3>
              <p className="text-[11px] text-[#8C7A70] leading-relaxed">
                Verifikasi penggunaan tunjangan biaya hidup mahasiswa penerima KIP-Kuliah dan beasiswa prestasi institusi.
              </p>
            </div>

            <div className="pt-3 border-t border-[#F0E8E4] flex items-center justify-between text-xs">
              <span className="font-medium text-[#8C7A70]">Format: PDF Audit</span>
              <button
                onClick={handleGenerateQuickReport}
                className="font-bold text-[#5C2D16] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ekspor Cepat</span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between hover:border-[#5C2D16]/40 transition-all">
            <div className="space-y-2">
              <div className="flex items-start justify-between">
                <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-900 rounded border border-emerald-200">
                  Area Kampus
                </span>
                <span className="text-[10px] text-[#8C7A70]">Analisis Makro</span>
              </div>
              <h3 className="font-bold text-xs text-[#2D2825]">Dinamika Biaya Hidup Mahasiswa</h3>
              <p className="text-[11px] text-[#8C7A70] leading-relaxed">
                Pemetaan pengeluaran sewa kos, logistik makanan, dan transportasi sekitar kampus untuk rekomendasi subsidi kantin.
              </p>
            </div>

            <div className="pt-3 border-t border-[#F0E8E4] flex items-center justify-between text-xs">
              <span className="font-medium text-[#8C7A70]">Format: PDF Lengkap</span>
              <button
                onClick={handleGenerateQuickReport}
                className="font-bold text-[#5C2D16] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Ekspor Cepat</span>
                <span>→</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: BUAT LAPORAN FINANSIAL KUSTOM (EXACT FIGMA media_1791764387084) */}
      {/* Pop Up dengan Latar Belakang Blur Sesuai Permintaan (Requirement 1 & 4)    */}
      {/* ========================================================================= */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#FAF7F4] border border-[#E5DDD8] rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-5 text-xs text-[#2D2825] my-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#E8DFD8] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3D2314] text-white flex items-center justify-center shrink-0 text-lg shadow-sm">
                  📑
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#2D2825]">Buat Laporan Finansial Kustom</h2>
                  <p className="text-xs text-[#8C7A70] mt-0.5">
                    Tentukan parameter subjek, filter demografi mahasiswa, rentang tanggal audit, serta output format laporan rekapitulasi.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCustomModal(false)}
                className="text-[#8C7A70] hover:text-[#2D2825] p-1 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Section 1: Kategori & Subjek Analisis */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-[#2D2825]">
                  <span className="w-5 h-5 rounded-full bg-[#3D2314] text-white text-[11px] flex items-center justify-center font-bold">1</span>
                  <span>Kategori & Subjek Analisis</span>
                </div>
                <button
                  type="button"
                  onClick={toggleAllSubjects}
                  className="text-xs font-bold text-[#C25E38] hover:underline cursor-pointer"
                >
                  {selectedSubjects.length === CUSTOM_SUBJECTS.length ? 'Batalkan Semua' : 'Pilih Semua Subjek'}
                </button>
              </div>

              {/* Grid 6 Subjek */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CUSTOM_SUBJECTS.map(subj => {
                  const isChecked = selectedSubjects.includes(subj.id);
                  return (
                    <div
                      key={subj.id}
                      onClick={() => toggleSubject(subj.id)}
                      className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-all ${
                        isChecked
                          ? 'bg-[#FAF0EA] border-[#C25E38] shadow-2xs'
                          : 'bg-white border-[#E5DDD8] hover:border-stone-400'
                      }`}
                    >
                      <div className={`w-4 h-4 rounded mt-0.5 flex items-center justify-center shrink-0 border transition-colors ${
                        isChecked ? 'bg-[#3D2314] border-[#3D2314] text-white text-[10px]' : 'border-stone-300 bg-white'
                      }`}>
                        {isChecked && '✓'}
                      </div>
                      <div className="space-y-0.5">
                        <div className="font-bold text-xs text-[#2D2825]">{subj.title}</div>
                        <div className="text-[10px] text-[#8C7A70] leading-tight">{subj.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 2: Parameter Filter & Kondisi Finansial (Tanpa Fakultas & Tahun Angkatan) */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#2D2825]">
                <span className="w-5 h-5 rounded-full bg-[#3D2314] text-white text-[11px] flex items-center justify-center font-bold">2</span>
                <span>Parameter Filter & Kondisi Finansial</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Kondisi Finansial Dompet */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#8C7A70] mb-1">Kondisi Finansial Pengguna</label>
                  <select
                    value={customKondisi}
                    onChange={e => setCustomKondisi(e.target.value)}
                    className="w-full bg-white border border-[#E5DDD8] rounded-xl px-3 py-2 text-xs font-medium text-[#2D2825] focus:outline-none cursor-pointer"
                  >
                    <option value="Semua Kondisi (Prima + Warning + Kritis)">Semua Kondisi (Prima + Warning + Kritis)</option>
                    <option value="Prima (Aman & Stabil)">Prima (Aman & Stabil)</option>
                    <option value="Warning (Mendekati Pagu)">Warning (Mendekati Pagu)</option>
                    <option value="Kritis (Defisit & Over-Budget)">Kritis (Defisit & Over-Budget)</option>
                  </select>
                </div>

                {/* Status Akun Pengguna */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#8C7A70] mb-1">Status Keaktifan Akun</label>
                  <select
                    defaultValue="Semua Pengguna Aktif"
                    className="w-full bg-white border border-[#E5DDD8] rounded-xl px-3 py-2 text-xs font-medium text-[#2D2825] focus:outline-none cursor-pointer"
                  >
                    <option value="Semua Pengguna Aktif">Semua Pengguna Terdaftar (9 Pengguna)</option>
                    <option value="Pengguna Aktif Saja">Pengguna Aktif Saja</option>
                  </select>
                </div>
              </div>
            </div>

                        {/* Section 3: Periode & Rentang Waktu (Tanpa Preset Akademik, Kalender Interaktif) */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#2D2825]">
                <span className="w-5 h-5 rounded-full bg-[#3D2314] text-white text-[11px] flex items-center justify-center font-bold">3</span>
                <span>Periode & Rentang Tanggal Audit</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Mulai Tanggal */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#8C7A70] mb-1">Mulai Tanggal</label>
                  <div className="relative flex items-center">
                    <input
                      ref={startDateInputRef}
                      type="date"
                      value={customStartDate}
                      onChange={e => setCustomStartDate(e.target.value)}
                      className="w-full bg-white border border-[#E5DDD8] rounded-xl px-3 py-2 pr-10 text-xs font-medium text-[#2D2825] focus:outline-none focus:border-[#5C2D16] cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (startDateInputRef.current) {
                          try {
                            startDateInputRef.current.showPicker();
                          } catch (err) {
                            startDateInputRef.current.focus();
                          }
                        }
                      }}
                      className="absolute right-2.5 top-2 text-base text-[#5C2D16] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                      title="Klik emoji kalender untuk memilih tanggal"
                    >
                      📅
                    </button>
                  </div>
                </div>

                {/* Sampai Tanggal */}
                <div>
                  <label className="block text-[10px] font-semibold text-[#8C7A70] mb-1">Sampai Tanggal</label>
                  <div className="relative flex items-center">
                    <input
                      ref={endDateInputRef}
                      type="date"
                      value={customEndDate}
                      onChange={e => setCustomEndDate(e.target.value)}
                      className="w-full bg-white border border-[#E5DDD8] rounded-xl px-3 py-2 pr-10 text-xs font-medium text-[#2D2825] focus:outline-none focus:border-[#5C2D16] cursor-pointer"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (endDateInputRef.current) {
                          try {
                            endDateInputRef.current.showPicker();
                          } catch (err) {
                            endDateInputRef.current.focus();
                          }
                        }
                      }}
                      className="absolute right-2.5 top-2 text-base text-[#5C2D16] hover:scale-110 active:scale-95 transition-transform cursor-pointer"
                      title="Klik emoji kalender untuk memilih tanggal"
                    >
                      📅
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Format Ekspor & Komposisi File (Requirement 4: Format berkas HANYA PDF) */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-[#2D2825]">
                <span className="w-5 h-5 rounded-full bg-[#3D2314] text-white text-[11px] flex items-center justify-center font-bold">4</span>
                <span>Format Ekspor & Komposisi File</span>
              </div>

              {/* Exact Card from Figma media_1791764387084.png */}
              <div className="p-3.5 bg-[#FAF0EA] border border-[#C25E38] rounded-2xl flex items-center justify-between shadow-2xs">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#FAF0EB] border border-[#E6D4CB] flex items-center justify-center text-base font-bold text-[#5C2D16]">
                    📄
                  </div>
                  <div>
                    <div className="font-bold text-xs text-[#2D2825]">PDF Eksekutif Dekanat</div>
                    <div className="text-[10px] text-[#8C7A70]">Lengkap diagram batang, kop surat rektorat, & matriks ringkas.</div>
                  </div>
                </div>

                {/* Selected Radio Dot */}
                <div className="w-4 h-4 rounded-full border-2 border-[#5C2D16] flex items-center justify-center p-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#5C2D16]"></div>
                </div>
              </div>
            </div>

            {/* Footer Bar */}
            <div className="pt-3 border-t border-[#E8DFD8] flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-1.5 text-[11px] text-[#554A43]">
                <span className="font-mono text-xs">{"{ }"}</span>
                <span>Estimasi data: <strong>{totalUsersCount} Mahasiswa</strong> (~12 halaman PDF terkompilasi)</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 bg-transparent hover:bg-stone-200/50 text-[#554A43] font-semibold text-xs rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleGenerateCustomReport}
                  className="px-4 py-2.5 bg-[#3D2314] hover:bg-[#2B170B] text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <span>✓</span>
                  <span>+ Generate & Unduh Laporan Kustom</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: JADWALKAN LAPORAN OTOMATIS (Requirement 1: Pop up & Latar Blur)  */}
      {/* ========================================================================= */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#FAF7F4] border border-[#E5DDD8] rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-xs text-[#2D2825] my-auto">
            <div className="flex items-start justify-between gap-4 border-b border-[#E8DFD8] pb-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3D2314] text-white flex items-center justify-center shrink-0 text-lg shadow-sm">
                  🕒
                </div>
                <div>
                  <h2 className="text-base font-bold text-[#2D2825]">Jadwalkan Laporan Finansial Otomatis</h2>
                  <p className="text-xs text-[#8C7A70] mt-0.5">
                    Konfigurasi pengiriman berkas rekapitulasi terjadwal langsung ke stakeholder universitas.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="text-[#8C7A70] hover:text-[#2D2825] p-1 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* 1. Frekuensi Pengiriman */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-[#8C7A70] uppercase">1. FREKUENSI PENGIRIMAN</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  'Bulanan (Tgl 1 tiap bulan)',
                  'Mingguan (Hari Senin)',
                  'Akhir Semester'
                ].map(freq => (
                  <button
                    key={freq}
                    type="button"
                    onClick={() => setScheduleFrequency(freq)}
                    className={`p-2.5 rounded-xl border text-center font-bold text-xs transition-all cursor-pointer ${
                      scheduleFrequency === freq
                        ? 'bg-[#5C2D16] text-white border-[#5C2D16] shadow-sm'
                        : 'bg-white border-[#E5DDD8] text-[#554A43] hover:border-[#5C2D16]/40'
                    }`}
                  >
                    {freq}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Waktu Eksekusi (Rekomendasi Pilihan & Custom Waktu) */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-[#8C7A70] uppercase">2. WAKTU PENGIRIMAN (WIB)</label>
              
              {/* Rekomendasi Pilihan Waktu */}
              <div>
                <span className="text-[10px] text-[#8C7A70] font-medium block mb-1">Rekomendasi Pilihan Waktu:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { val: '07:30 WIB', label: '07:30 WIB (Pagi)' },
                    { val: '09:00 WIB', label: '09:00 WIB (Awal Kerja)' },
                    { val: '12:00 WIB', label: '12:00 WIB (Siang)' },
                    { val: '17:00 WIB', label: '17:00 WIB (Sore)' },
                    { val: '20:00 WIB', label: '20:00 WIB (Malam)' }
                  ].map(item => (
                    <button
                      key={item.val}
                      type="button"
                      onClick={() => setScheduleTime(item.val)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        scheduleTime === item.val
                          ? 'bg-[#5C2D16] text-white shadow-xs'
                          : 'bg-white border border-[#E5DDD8] text-[#5C2D16] hover:bg-[#FAF4F0]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Input Custom Waktu */}
              <div className="pt-1">
                <span className="text-[10px] text-[#8C7A70] font-medium block mb-1">Atau Tentukan Waktu Kustom Sendiri:</span>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      type="time"
                      value={scheduleTime.replace(/\s*WIB/i, '').trim()}
                      onChange={e => {
                        if (e.target.value) {
                          setScheduleTime(`${e.target.value} WIB`);
                        }
                      }}
                      className="w-full bg-white border border-[#E5DDD8] rounded-xl px-3 py-1.5 text-xs font-semibold text-[#2D2825] focus:outline-none focus:border-[#5C2D16] cursor-pointer"
                    />
                  </div>
                  <span className="px-3 py-1.5 bg-[#F5EDE8] border border-[#ECD9CE] text-[#5C2D16] font-bold text-xs rounded-xl">
                    WIB
                  </span>
                </div>
                <div className="text-[10px] text-[#8C7A70] mt-1">
                  Waktu aktif terpilih: <strong className="text-[#5C2D16]">{scheduleTime}</strong>
                </div>
              </div>
            </div>

            {/* 3. Penerima Laporan */}
            <div className="space-y-2">
              <label className="block text-[11px] font-bold text-[#8C7A70] uppercase">3. PENERIMA LAPORAN (STAKEHOLDER)</label>
              <div className="space-y-2 bg-white p-3 rounded-2xl border border-[#E5DDD8]">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stakeholders.keuangan}
                    onChange={e => setStakeholders({ ...stakeholders, keuangan: e.target.checked })}
                    className="accent-[#5C2D16] w-4 h-4 rounded"
                  />
                  <div>
                    <div className="font-bold text-xs text-[#2D2825]">Biro Keuangan & Administrasi Rektorat</div>
                    <div className="text-[10px] text-[#8C7A70]">keuangan@universitas.ac.id</div>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stakeholders.baak}
                    onChange={e => setStakeholders({ ...stakeholders, baak: e.target.checked })}
                    className="accent-[#5C2D16] w-4 h-4 rounded"
                  />
                  <div>
                    <div className="font-bold text-xs text-[#2D2825]">Biro Administrasi Akademik & Kemahasiswaan (BAAK)</div>
                    <div className="text-[10px] text-[#8C7A70]">baak@universitas.ac.id</div>
                  </div>
                </label>

                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stakeholders.dekanat}
                    onChange={e => setStakeholders({ ...stakeholders, dekanat: e.target.checked })}
                    className="accent-[#5C2D16] w-4 h-4 rounded"
                  />
                  <div>
                    <div className="font-bold text-xs text-[#2D2825]">Pimpinan Institusi & Dekanat</div>
                    <div className="text-[10px] text-[#8C7A70]">dekanat@universitas.ac.id</div>
                  </div>
                </label>
              </div>
            </div>

            {/* 4. Format Pengiriman: PDF Otomatis */}
            <div className="p-3 bg-[#FAF4F0] border border-[#E6D4CB] rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span>📄</span>
                <span className="font-bold text-[#5C2D16]">Format Pengiriman: PDF Eksekutif Terenkripsi Digital</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Tervalidasi</span>
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-[#E8DFD8] flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 border border-[#E5DDD8] bg-white text-[#6E5D53] hover:text-[#2D2825] font-bold text-xs rounded-xl cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveSchedule}
                className="px-4 py-2.5 bg-[#5C2D16] hover:bg-[#462211] text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
              >
                <span>🕒</span>
                <span>Aktifkan Jadwal Otomatis</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: KIRIM PERINGATAN DEFISIT ANGGARAN (Intervensi Kampus)            */}
      {/* ========================================================================= */}
      {showInterventionModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-white border border-[#E5DDD8] rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 text-xs my-auto">
            {/* Modal Header */}
            <div>
              <div className="flex items-center justify-between text-[11px] text-[#8C7A70] mb-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#FAF4F0] text-[#5C2D16] font-bold rounded">Siswa: Keisya Lanika</span>
                  
                  <span>• Smt 4</span>
                </div>
                <button onClick={() => setShowInterventionModal(false)} className="text-[#8C7A70] hover:text-[#2D2825] text-base cursor-pointer">✕</button>
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
                <button className="font-bold text-[#5C2D16] hover:underline cursor-pointer">Regenerate AI</button>
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
                  className="px-4 py-2 border border-[#E5DDD8] bg-white text-[#6E5D53] font-bold text-xs rounded-xl hover:bg-[#FAF7F4] cursor-pointer"
                >
                  Batal / Tunda
                </button>
                <button
                  type="button"
                  onClick={handleSendWarning}
                  className="px-4 py-2 bg-[#5C2D16] hover:bg-[#462211] text-white font-bold text-xs rounded-xl shadow cursor-pointer"
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

export default ReportsPage;
