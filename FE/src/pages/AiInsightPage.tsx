import React, { useState } from 'react';

interface AiInsightPageProps {
  onTriggerPdfToast?: () => void;
}

export const AiInsightPage: React.FC<AiInsightPageProps> = ({ onTriggerPdfToast }) => {
  const [aiExecuted, setAiExecuted] = useState(false);
  const [selectedCampaigns, setSelectedCampaigns] = useState<number[]>([1, 2, 3]);

  const toggleCampaign = (id: number) => {
    if (selectedCampaigns.includes(id)) {
      setSelectedCampaigns(selectedCampaigns.filter(c => c !== id));
    } else {
      setSelectedCampaigns([...selectedCampaigns, id]);
    }
  };

  const handleExecuteAllAi = () => {
    setAiExecuted(true);
    if (onTriggerPdfToast) onTriggerPdfToast();
    setTimeout(() => {
      setAiExecuted(false);
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

        <button
          onClick={handleExecuteAllAi}
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#5C2D16] hover:bg-[#462211] text-white text-xs font-bold rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
        >
          <span>📥</span> Unduh Insight PDF
        </button>
      </div>

      {/* Floating Success Notification matching Figma */}
      {aiExecuted && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl shadow-xl text-emerald-900 text-xs font-medium space-y-2 animate-fadeIn border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between font-extrabold">
            <span className="flex items-center gap-2 text-emerald-950">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              ✨ Semua Rekomendasi AI Berhasil Diterapkan
            </span>
            <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2.5 py-0.5 rounded-full">🟢 14/14 Sukses</span>
          </div>
          <p className="text-[11px] text-emerald-800 leading-relaxed">
            Intervensi cerdas untuk <strong className="font-extrabold text-emerald-950">845 mahasiswa defisit</strong> telah aktif: Pembatasan limit QRIS terpasang & pesan bimbingan otomatis terkirim via WhatsApp/SIAKAD.
          </p>
          <div className="flex items-center gap-3 pt-1 text-[11px] border-t border-emerald-200/60 font-bold">
            <button className="text-[#5C2D16] hover:underline">👁️ Lihat Log Intervensi</button>
            <span className="text-emerald-400">•</span>
            <span className="text-emerald-700">Tersinkronisasi ke SIAKAD Kampus</span>
          </div>
        </div>
      )}

      {/* Top 3 Predictive & Insight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Prediksi Burn Rate Global */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-7 h-7 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-xs border border-rose-200">⚠️</span>
                <span className="text-[10px] font-extrabold text-rose-800 tracking-wider">PREDIKSI BURN RATE GLOBAL</span>
              </div>
              <span className="px-2.5 py-0.5 text-[9px] font-extrabold bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                High Alert
              </span>
            </div>

            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-3xl font-black text-[#2D2825] tracking-tight">68%</span>
              <span className="text-xs text-[#8C7A70] font-semibold">Pengguna Aktif</span>
            </div>

            <div className="w-full h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden mt-2">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: '68%' }}></div>
            </div>

            <div className="mt-3 bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl p-3 text-[11px] text-[#554A43] leading-relaxed">
              Diprediksi akan kehabisan budget bulanan dalam <strong className="text-rose-700 font-extrabold">5 hari ke depan</strong> akibat lonjakan transaksi awal bulan pasca ujian.
            </div>
          </div>
        </div>

        {/* Card 2: Indeks Kesehatan Finansial */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-200">📈</span>
                <span className="text-[10px] font-extrabold text-emerald-800 tracking-wider">INDEKS KESEHATAN FINANSIAL</span>
              </div>
              <span className="px-2.5 py-0.5 text-[9px] font-extrabold bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                Perhatian
              </span>
            </div>

            <div className="flex items-baseline gap-1 mt-2">
              <span className="text-3xl font-black text-[#2D2825] tracking-tight">62</span>
              <span className="text-xs text-[#8C7A70] font-semibold">/ 100 Skor Agregat</span>
            </div>

            <div className="w-full h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden mt-2">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '62%' }}></div>
            </div>

            <div className="mt-3 bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl p-3 text-[11px] text-[#554A43] leading-relaxed">
              Status: <strong className="text-amber-800 font-bold">Sedang (Kuning)</strong>. Ada penurunan kedisiplinan pencatatan transaksi mikro sebesar -8.4% minggu ini.
            </div>
          </div>
        </div>

        {/* Card 3: Kesimpulan & Intervensi AI */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-7 h-7 rounded-xl bg-[#FAF4F0] text-[#5C2D16] flex items-center justify-center font-bold text-xs border border-[#E8DCD8]">💲</span>
                <span className="text-[10px] font-extrabold text-[#5C2D16] tracking-wider">Kesimpulan & Intervensi AI</span>
              </div>
              <span className="px-2.5 py-0.5 text-[9px] font-extrabold bg-amber-100 text-amber-900 rounded-full border border-amber-300">
                94% Confidence
              </span>
            </div>

            <p className="text-xs text-[#2D2825] leading-relaxed mt-2">
              Fokuskan intervensi langsung pada kategori <strong className="text-[#5C2D16]">"Hiburan"</strong> dan <strong className="text-[#5C2D16]">"Makanan & Kopi"</strong>. Dua kategori ini menyumbang <strong>74%</strong> dari total defisit overbudget mahasiswa bulan ini.
            </p>

            <div className="pt-2 border-t border-[#F0E8E4] mt-2 text-[11px] text-[#8C7A70]">
              Rekomendasi tindakan: <strong className="text-[#5C2D16] font-bold">2 Campaign Siap Kirim</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Middle 2-Column Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Left Column: Log Anomali Terdeteksi */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#F0E8E4] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-base">📈</span>
              <h2 className="font-bold text-sm text-[#2D2825]">Log Anomali Terdeteksi</h2>
            </div>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] rounded-full">
              2 Anomali Signifikan
            </span>
          </div>

          {/* Anomaly 1 */}
          <div className="bg-[#FAF7F4] border border-[#E5DDD8] rounded-2xl p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-[10px]">
              <span className="px-2.5 py-0.5 font-extrabold bg-amber-100 text-amber-900 rounded uppercase">
                KATEGORI: MAKANAN & HIBURAN
              </span>
              <span className="text-[#8C7A70] flex items-center gap-1">🕒 2 jam yang lalu</span>
            </div>

            <h3 className="font-extrabold text-xs text-[#2D2825] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C25E38] animate-pulse"></span>
              Lonjakan +41.8% pada sub-kategori "Coffee Shop & Nongkrong"
            </h3>

            <p className="text-[11px] text-[#554A43] leading-relaxed">
              Terdeteksi pada cohort usia mahasiswa (18–22 tahun) pasca periode UTS selesai. Rata-rata transaksi per user meningkat dari Rp 28.000 menjadi Rp 54.000 per kunjungan.
            </p>

            <div className="flex items-center justify-between text-[10px] pt-2 border-t border-[#E5DDD8]/60 text-[#8C7A70]">
              <span>Audiens terdampak: <strong className="text-[#2D2825]">620 Akun</strong></span>
              <button className="font-bold text-[#5C2D16] hover:underline flex items-center gap-1">
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
              <span className="text-[#8C7A70] flex items-center gap-1">🕒 1 hari yang lalu</span>
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
              <button className="font-bold text-[#8C7A70] hover:text-[#2D2825]">
                Arsipkan Log
              </button>
            </div>
          </div>

          {/* Anomaly 3 */}
          <div className="bg-[#FAF7F4] border border-[#E5DDD8] rounded-2xl p-4 space-y-2 shadow-xs">
            <div className="flex items-center justify-between text-[10px]">
              <span className="px-2.5 py-0.5 font-extrabold bg-amber-100 text-amber-900 rounded uppercase">
                KATEGORI: BELANJA E-COMMERCE
              </span>
              <span className="text-[#8C7A70] flex items-center gap-1">🕒 3 hari yang lalu</span>
            </div>

            <h3 className="font-extrabold text-xs text-[#2D2825] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#C25E38]"></span>
              Lonjakan Checkout Flash Sale Gajian (Payday)
            </h3>

            <p className="text-[11px] text-[#554A43] leading-relaxed">
              Terjadi akumulasi 380 transaksi dalam kurun waktu 4 jam pada platform e-commerce mitra. 142 akun menyentuh 90% budget bulanan.
            </p>
          </div>
        </div>

        {/* Right Column: Rekomendasi Aksi (Auto-Campaign) */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0E8E4] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">🚀</span>
                <h2 className="font-bold text-sm text-[#2D2825]">Rekomendasi Aksi (Auto-Campaign)</h2>
              </div>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-full">
                Siap Eksekusi
              </span>
            </div>

            {/* Campaign Item 1 */}
            <div
              onClick={() => toggleCampaign(1)}
              className={'p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ' + (
                selectedCampaigns.includes(1) ? 'bg-[#FAF7F4] border-[#5C2D16] shadow-xs' : 'bg-white border-[#E5DDD8] hover:border-[#5C2D16]/50'
              )}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-extrabold text-xs text-[#2D2825] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#C25E38]"></span>
                  Kirim Notifikasi Smart Budget Limit
                </h3>
                <div className="w-7 h-7 rounded-xl bg-white border border-[#E5DDD8] flex items-center justify-center text-xs text-[#5C2D16] font-bold">
                  ➔
                </div>
              </div>
              <p className="text-[11px] text-[#554A43] leading-relaxed">
                Dorong target tabungan darurat & tips penghematan harian santai lewat push notification ke 845 akun berisiko tinggi.
              </p>
              <div className="flex items-center justify-between text-[10px] text-[#8C7A70] pt-1">
                <span>Estimasi Dampak: <strong className="text-emerald-700">-22% Burn Rate</strong></span>
                <span>Saluran: <strong>Push & In-App</strong></span>
              </div>
            </div>

            {/* Campaign Item 2 */}
            <div
              onClick={() => toggleCampaign(2)}
              className={'p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ' + (
                selectedCampaigns.includes(2) ? 'bg-[#FAF7F4] border-[#5C2D16] shadow-xs' : 'bg-white border-[#E5DDD8] hover:border-[#5C2D16]/50'
              )}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-extrabold text-xs text-[#2D2825] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-600"></span>
                  Tinjau Segmen Pengguna Freelancer (Multi-Income)
                </h3>
                <div className="w-7 h-7 rounded-xl bg-white border border-[#E5DDD8] flex items-center justify-center text-xs text-[#5C2D16] font-bold">
                  ➔
                </div>
              </div>
              <p className="text-[11px] text-[#554A43] leading-relaxed">
                Buat cohort khusus untuk pemantauan arus kas penerimaan termin freelance selama 14 hari kedepan dengan proteksi saldo minimum.
              </p>
              <div className="flex items-center justify-between text-[10px] text-[#8C7A70] pt-1">
                <span>Target: <strong className="text-[#2D2825]">210 Pengguna</strong></span>
                <span>Tipe: <strong>Segment Rules</strong></span>
              </div>
            </div>

            {/* Campaign Item 3 */}
            <div
              onClick={() => toggleCampaign(3)}
              className={'p-4 rounded-2xl border transition-all cursor-pointer space-y-2 ' + (
                selectedCampaigns.includes(3) ? 'bg-[#FAF7F4] border-[#5C2D16] shadow-xs' : 'bg-white border-[#E5DDD8] hover:border-[#5C2D16]/50'
              )}
            >
              <div className="flex items-start justify-between">
                <h3 className="font-extrabold text-xs text-[#2D2825] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  Aktifkan Reward Auto-Save Receh (Round-Up)
                </h3>
                <div className="w-7 h-7 rounded-xl bg-white border border-[#E5DDD8] flex items-center justify-center text-xs text-[#5C2D16] font-bold">
                  ➔
                </div>
              </div>
              <p className="text-[11px] text-[#554A43] leading-relaxed">
                Tawarkan program pembulatan transaksi belanja receh otomatis masuk ke reksadana mikro bagi cohort mahasiswa baru.
              </p>
              <div className="flex items-center justify-between text-[10px] text-[#8C7A70] pt-1">
                <span>Target: <strong className="text-[#2D2825]">Semua Pengguna Baru</strong></span>
                <span>Tipe: <strong>Gamifikasi</strong></span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleExecuteAllAi}
              className="w-full py-3 bg-[#5C2D16] hover:bg-[#462211] text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>⚡</span> Jalankan Semua Rekomendasi AI Terpilih ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiInsightPage;
