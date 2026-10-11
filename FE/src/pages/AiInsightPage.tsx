import React, { useState } from 'react';

interface AiInsightPageProps {
  onTriggerPdfToast: () => void;
}

export const AiInsightPage: React.FC<AiInsightPageProps> = ({ onTriggerPdfToast }) => {
  const [aiExecuted, setAiExecuted] = useState(false);

  const handleExecuteAiActions = () => {
    setAiExecuted(true);
    setTimeout(() => setAiExecuted(false), 5000);
  };

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto w-full animate-fadeIn text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#C25E38] text-white flex items-center justify-center text-lg shrink-0 shadow-sm mt-0.5">
            ⚛
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#2D2825]">AI Financial Intelligence</h1>
            <p className="text-[11px] text-[#8C7A70] mt-0.5">Analisis prediktif, deteksi anomali cohort mahasiswa, dan otomatisasi mitigasi risiko finansial.</p>
          </div>
        </div>

        <button onClick={onTriggerPdfToast} className="px-3.5 py-1.5 bg-[#5C2D16] text-white text-xs font-bold rounded-xl shadow shrink-0 hover:bg-[#462211] transition-all">
          Unduh Insight PDF
        </button>
      </div>

      {aiExecuted && (
        <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between">
          <span>✓ Semua rekomendasi AI telah berhasil dieksekusi dan notifikasi push terkirim!</span>
          <span className="text-[9px] bg-emerald-200 px-2 py-0.5 rounded font-bold">14/14 Sukses</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-rose-500 font-bold">⚠️</span>
              <span className="text-[10px] font-bold text-rose-800 uppercase">PREDIKSI BURN RATE GLOBAL</span>
            </div>
            <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-900 rounded-full border border-amber-300">High Alert</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-[#2D2825]">68%</span>
              <span className="text-xs text-[#8C7A70]">Pengguna Aktif</span>
            </div>
            <div className="w-full h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden mt-1.5">
              <div className="h-full bg-rose-500 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>
          <p className="text-[11px] text-[#554A43]">
            Diprediksi akan kehabisan budget bulanan dalam <strong className="text-rose-700 font-bold">5 hari ke depan</strong> akibat lonjakan transaksi awal bulan pasca ujian.
          </p>
        </div>

        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-600 font-bold">📈</span>
              <span className="text-[10px] font-bold text-emerald-800 uppercase">INDEKS KESEHATAN FINANSIAL</span>
            </div>
            <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-900 rounded-full border border-amber-300">Perhatian</span>
          </div>
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-extrabold text-[#2D2825]">62</span>
              <span className="text-xs text-[#8C7A70]">/ 100 Skor Agregat</span>
            </div>
            <div className="w-full h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden mt-1.5">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '62%' }}></div>
            </div>
          </div>
          <p className="text-[11px] text-[#554A43]">
            Tingkat tabungan rata-rata menurun <strong className="text-amber-700 font-bold">-4.2% MoM</strong> akibat pengeluaran tak terduga pos akademik.
          </p>
        </div>

        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-600 font-bold">🤖</span>
              <span className="text-[10px] font-bold text-[#5C2D16] uppercase">AUTOMATION AGENT</span>
            </div>
            <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded-full">Ready</span>
          </div>
          <p className="text-[11px] text-[#554A43]">
            Jalankan otomatisasi AI untuk mengirim notifikasi peringatan dini ke 142 mahasiswa yang terdeteksi over-budget.
          </p>
          <button onClick={handleExecuteAiActions} className="w-full py-2 bg-[#5C2D16] hover:bg-[#462211] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2">
            <span>⚡</span> Eksekusi Tindakan Otomatis AI
          </button>
        </div>
      </div>
    </div>
  );
};
