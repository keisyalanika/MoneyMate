import React, { useState } from 'react';
import { Download, ChevronRight, ChevronDown, CheckSquare, Square } from 'lucide-react';

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
  const [selectedCampaigns, setSelectedCampaigns] = useState<number[]>([1, 2]);
  const [expandedCampaignId, setExpandedCampaignId] = useState<number | null>(null);
  const [aiExecutedToast, setAiExecutedToast] = useState<{ show: boolean; message: string; count: number } | null>(null);

  const campaigns: CampaignDetail[] = [
    {
      id: 1,
      title: 'Kirim Notifikasi Smart Budget Limit',
      badgeColor: 'bg-[#C25E38]',
      shortDesc: 'Dorong target tabungan darurat & tips penghematan harian santai lewat push notification ke 845 akun berisiko tinggi.',
      targetCount: '845 Akun Berisiko',
      impact: '-22% Burn Rate',
      channel: 'Push & In-App',
      details: {
        objective: 'Meredam belanja impulsif pasca periode ujian di kafe dan merchant e-commerce.',
        mechanism: 'Notifikasi proaktif setiap jam 12:00 dan jam 19:00 jika pengeluaran harian mencapai 80% dari plafon rekomendasi.',
        criteria: 'Mahasiswa dengan saldo berjalan di bawah Rp 150.000 dan laju defisit >15% dari batas bulanan.',
        kpi: 'Menurunkan frekuensi transaksi kafe dari 4x/minggu menjadi 2x/minggu dalam 14 hari.'
      }
    },
    {
      id: 2,
      title: 'Tinjau Segmen Pengguna Freelancer (Multi-Income)',
      badgeColor: 'bg-amber-600',
      shortDesc: 'Buat cohort khusus untuk pemantauan arus kas penerimaan termin freelance selama 14 hari kedepan dengan proteksi saldo minimum.',
      targetCount: '210 Pengguna',
      impact: '+18% Saldo Stabil',
      channel: 'Segment Rules',
      details: {
        objective: 'Memisahkan arus kas operasional harian mahasiswa pekerja sampingan dari pendapatan proyek.',
        mechanism: 'Alokasi otomatis ke pos "Kas Cadangan Pajak & Tabungan Kuliah" sebesar 20% setiap kali ada transfer masuk dari platform freelance.',
        criteria: 'Akun dengan mutasi masuk tidak beraturan namun nominal >Rp 1.000.000.',
        kpi: 'Tercapainya saldo minimum aman Rp 500.000 hingga akhir bulan berjalan.'
      }
    },
    {
      id: 3,
      title: 'Aktifkan Reward Auto-Save Receh (Round-Up)',
      badgeColor: 'bg-emerald-600',
      shortDesc: 'Tawarkan program pembulatan transaksi belanja receh otomatis masuk ke reksadana mikro bagi cohort mahasiswa baru.',
      targetCount: 'Semua Pengguna Baru',
      impact: 'Rata-rata Rp 45.000/bln',
      channel: 'Gamifikasi & Reksadana',
      details: {
        objective: 'Membangun kebiasaan menabung tanpa beban terasa sejak semester pertama perkuliahan.',
        mechanism: 'Setiap pembayaran QRIS dibulatkan ke kelipatan Rp 5.000 terdekat. Selisih pembulatan otomatis ditransfer ke dompet investasi mikro.',
        criteria: 'Mahasiswa Angkatan 2026 (Semester 1 - 2) dengan status akun aktif.',
        kpi: '85% mahasiswa baru memiliki minimal 1 portofolio investasi mikro di semester ganjil.'
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
    <div className="p-5 space-y-5 max-w-7xl mx-auto w-full animate-fadeIn text-xs relative">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#5C2D16] text-white flex items-center justify-center text-xl shrink-0 shadow-md">
            ⚛
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#2D2825] tracking-tight">AI Financial Intelligence</h1>
            <p className="text-xs text-[#8C7A70] mt-0.5">Analisis prediktif, deteksi anomali cohort mahasiswa, dan otomatisasi mitigasi risiko finansial.</p>
          </div>
        </div>

        {/* Tombol Unduh Insight PDF (Item 7 Sesuai Figma) */}
        <button
          onClick={onTriggerPdfToast}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#5C2D16] hover:bg-[#462211] text-white text-xs font-bold rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Download className="w-4 h-4" /> Unduh Insight PDF
        </button>
      </div>

      {/* Floating Success Notification matching Figma */}
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

      {/* Top 3 Metric Cards (Matching media_1791618032713.png) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: PREDIKSI BURN RATE GLOBAL */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#8C7A70] flex items-center gap-1.5 uppercase">
              <span className="text-[#C25E38]">⚠️</span> PREDIKSI BURN RATE GLOBAL
            </span>
            <span className="px-2 py-0.5 text-[9px] font-extrabold bg-rose-100 text-rose-800 rounded-full border border-rose-200">
              High Alert
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-[#2D2825]">68% <span className="text-xs font-normal text-[#8C7A70]">Pengguna Aktif</span></div>
            <div className="w-full h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden mt-2">
              <div className="h-full bg-[#C25E38] rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>
          <p className="text-[11px] text-[#8C7A70] leading-relaxed">
            Diprediksi akan kehabisan budget bulanan dalam <strong className="text-[#C25E38]">5 hari ke depan</strong> akibat lonjakan transaksi awal bulan paska ujian.
          </p>
        </div>

        {/* Card 2: INDEKS KESEHATAN FINANSIAL */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#8C7A70] flex items-center gap-1.5 uppercase">
              <span className="text-emerald-600">📈</span> INDEKS KESEHATAN FINANSIAL
            </span>
            <span className="px-2 py-0.5 text-[9px] font-extrabold bg-amber-100 text-amber-900 rounded-full border border-amber-300">
              Perhatian
            </span>
          </div>
          <div>
            <div className="text-3xl font-black text-[#2D2825]">62 <span className="text-xs font-normal text-[#8C7A70]">/ 100 Skor Agregat</span></div>
            <div className="w-full h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden mt-2">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '62%' }}></div>
            </div>
          </div>
          <p className="text-[11px] text-[#8C7A70] leading-relaxed">
            Status: <strong className="text-amber-800">Sedang (Kuning)</strong>. Ada penurunan kedisiplinan pencatatan transaksi mikro sebesar -8.4% minggu ini.
          </p>
        </div>

        {/* Card 3: Kesimpulan & Intervensi AI */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-[#8C7A70] uppercase flex items-center gap-1.5">
              <span>💲</span> Kesimpulan & Intervensi AI
            </span>
            <span className="px-2 py-0.5 text-[9px] font-extrabold bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] rounded-full">
              94% Confidence
            </span>
          </div>
          <p className="text-[11px] text-[#554A43] leading-relaxed">
            Fokuskan intervensi langsung pada kategori <strong className="text-[#5C2D16]">"Hiburan"</strong> dan <strong className="text-[#C25E38]">"Makanan & Kopi"</strong>. Dua kategori ini menyumbang 74% dari total defisit overbudget mahasiswa bulan ini.
          </p>
          <div className="pt-2 border-t border-[#F0E8E4] flex items-center justify-between text-[11px] text-[#8C7A70]">
            <span>Rekomendasi tindakan: <strong className="text-[#2D2825]">{campaigns.length} Campaign Siap Kirim</strong></span>
          </div>
        </div>
      </div>

      {/* Main Grid: Log Anomali Kiri & Rekomendasi Aksi Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left Column: Log Anomali Terdeteksi */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-[#F0E8E4] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-base text-[#C25E38]">📈</span>
              <h2 className="font-bold text-sm text-[#2D2825]">Log Anomali Terdeteksi</h2>
            </div>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] rounded-full">
              2 Anomali Signifikan
            </span>
          </div>

          {/* Anomaly 1 */}
          <div className="bg-[#FAF7F4] border border-[#E5DDD8] rounded-2xl p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-[10px]">
              <span className="px-2.5 py-0.5 font-extrabold bg-[#FCEAE5] text-[#C25E38] rounded uppercase">
                KATEGORI: MAKANAN & HIBURAN
              </span>
              <span className="text-[#8C7A70]">🕒 2 jam yang lalu</span>
            </div>
            <h3 className="font-extrabold text-xs text-[#2D2825] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C25E38]"></span>
              Lonjakan +41.8% pada sub-kategori "Coffee Shop & Nongkrong"
            </h3>
            <p className="text-[11px] text-[#554A43] leading-relaxed">
              Terdeteksi pada cohort usia mahasiswa (18–22 tahun) pasca periode UTS selesai. Rata-rata transaksi per user meningkat dari Rp 28.000 menjadi Rp 54.000 per kunjungan.
            </p>
            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[#E5DDD8]/60 text-[#8C7A70]">
              <span>Audiens terdampak: <strong className="text-[#2D2825]">620 Akun</strong></span>
              <button className="font-bold text-[#5C2D16] hover:underline cursor-pointer">
                Lihat Rincian Akun →
              </button>
            </div>
          </div>

          {/* Anomaly 2 */}
          <div className="bg-[#FAF7F4] border border-[#E5DDD8] rounded-2xl p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-[10px]">
              <span className="px-2.5 py-0.5 font-extrabold bg-amber-100 text-amber-900 rounded uppercase">
                KATEGORI: TRANSPORTASI
              </span>
              <span className="text-[#8C7A70]">🕒 1 hari yang lalu</span>
            </div>
            <h3 className="font-extrabold text-xs text-[#2D2825] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              Penurunan -15% pengeluaran Ojek Online
            </h3>
            <p className="text-[11px] text-[#554A43] leading-relaxed">
              Korelasi positif dengan minggu libur tenang pergantian semester. Pola mobilitas mahasiswa beralih ke aktivitas residensial. Status normal aman.
            </p>
            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[#E5DDD8]/60 text-[#8C7A70]">
              <span>Tingkat fluktuasi: <strong className="text-emerald-700">Stabil Rendah</strong></span>
              <span className="text-[#8C7A70]">Arsipkan Log</span>
            </div>
          </div>

          {/* Anomaly 3 */}
          <div className="bg-[#FAF7F4] border border-[#E5DDD8] rounded-2xl p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-[10px]">
              <span className="px-2.5 py-0.5 font-extrabold bg-amber-100 text-amber-900 rounded uppercase">
                KATEGORI: BELANJA E-COMMERCE
              </span>
              <span className="text-[#8C7A70]">🕒 3 hari yang lalu</span>
            </div>
            <h3 className="font-extrabold text-xs text-[#2D2825] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C25E38]"></span>
              Lonjakan Checkout Flash Sale Gajian (Payday)
            </h3>
            <p className="text-[11px] text-[#554A43] leading-relaxed">
              Terjadi akumulasi 380 transaksi dalam kurun waktu 4 jam pada platform mitra. 142 akun menyentuh 90% budget bulanan.
            </p>
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
                  Siap Eksekusi
                </span>
              </div>
            </div>

            {/* Campaign Cards List (With Selection & Expandable Details - Items 8 & 9) */}
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
                          {/* Checkbox for Multi-Select (Item 9) */}
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

                        {/* Interactive Arrow Button for Detail (Item 8) */}
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

                    {/* EXPANDED DETAIL VIEW ACCORDION (Item 8 Feature) */}
                    {isExpanded && (
                      <div className="px-4 pb-4 pt-1 border-t border-[#E5DDD8]/80 text-[11px] space-y-2 bg-white rounded-b-2xl animate-fadeIn">
                        <div className="font-bold text-[#5C2D16] flex items-center gap-1 text-[10px] uppercase tracking-wider pt-2">
                          <span>🔍</span> Detail Parameter & Mekanisme Aturan AI
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                          <div className="p-2 bg-[#FAF7F4] border border-[#EBE4D8] rounded-xl">
                            <span className="text-[#8C7A70] font-bold block">Tujuan Intervensi:</span>
                            <span className="text-[#2D2825]">{camp.details.objective}</span>
                          </div>
                          <div className="p-2 bg-[#FAF7F4] border border-[#EBE4D8] rounded-xl">
                            <span className="text-[#8C7A70] font-bold block">Kriteria Mahasiswa:</span>
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

          {/* Dynamic Execution Button (Item 9) */}
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
              {selectedCampaigns.length} dari {campaigns.length} rekomendasi siap diaktifkan ke sistem kampus
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiInsightPage;
