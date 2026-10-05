import React, { useState } from 'react';

interface TransactionsPageProps {
  onTriggerPdfToast: () => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ onTriggerPdfToast }) => {
  const [trxSearch, setTrxSearch] = useState('');

  const transactions = [
    { id: 101, date: '2026-10-05 14:20', student: 'Keisya Lanika', desc: 'Pembelian Buku & Alat Tulis', category: 'Akademik', method: 'Transfer Bank', amount: '-Rp 150.000', isExpense: true, isScan: false },
    { id: 102, date: '2026-10-05 12:10', student: 'Bima Santoso', desc: 'Scan Struk Kantin Utama', category: 'Makanan', method: 'QRIS', amount: '-Rp 25.000', isExpense: true, isScan: true },
    { id: 103, date: '2026-10-04 18:45', student: 'Aulia Rahma', desc: 'Kiriman Orang Tua', category: 'Pemasukan', method: 'Transfer Bank', amount: '+Rp 2.000.000', isExpense: false, isScan: false },
    { id: 104, date: '2026-10-04 09:30', student: 'Rizky Aditya', desc: 'Pembayaran Kos Bulan Oktober', category: 'Tempat Tinggal', method: 'Virtual Account', amount: '-Rp 850.000', isExpense: true, isScan: false },
    { id: 105, date: '2026-10-03 20:15', student: 'Nadia Putri', desc: 'Scan Struk Supermarket', category: 'Belanja', method: 'E-Wallet', amount: '-Rp 175.000', isExpense: true, isScan: true }
  ];

  const filteredTransactions = transactions.filter(t =>
    t.student.toLowerCase().includes(trxSearch.toLowerCase()) ||
    t.desc.toLowerCase().includes(trxSearch.toLowerCase()) ||
    t.category.toLowerCase().includes(trxSearch.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto w-full animate-fadeIn text-xs">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-[11px] text-[#8C7A70]">Keuangan › <span className="font-semibold text-[#5C2D16]">Pemantauan Transaksi</span></div>
          <h1 className="text-xl font-bold text-[#2D2825]">Pemantauan Transaksi Mahasiswa</h1>
        </div>
        <button onClick={onTriggerPdfToast} className="px-3 py-1.5 bg-white border border-[#E5DDD8] text-[#5C2D16] text-xs font-bold rounded-xl shadow-sm hover:bg-[#FAF7F4] flex items-center gap-1.5">
          <span>📥</span> Ekspor Data PDF
        </button>
      </div>

      <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="relative max-w-sm">
          <input
            type="text"
            placeholder="Cari mahasiswa, deskripsi, atau kategori..."
            value={trxSearch}
            onChange={e => setTrxSearch(e.target.value)}
            className="w-full bg-[#F5F2ED] border border-[#E5DDD8] rounded-xl px-3 py-1.5 text-xs text-[#2D2825] focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F4] text-[#8C7A70] uppercase text-[9px] font-bold border-b border-[#E5DDD8]">
              <tr>
                <th className="py-2.5 px-4">Tanggal & Waktu</th>
                <th className="py-2.5 px-4">Mahasiswa</th>
                <th className="py-2.5 px-4">Deskripsi Transaksi</th>
                <th className="py-2.5 px-4">Kategori</th>
                <th className="py-2.5 px-4">Metode</th>
                <th className="py-2.5 px-4">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8E4]">
              {filteredTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-[#FAF7F2]">
                  <td className="py-3 px-4 text-[#8C7A70] font-mono">{trx.date}</td>
                  <td className="py-3 px-4 font-bold text-[#2D2825]">{trx.student}</td>
                  <td className="py-3 px-4 text-[#2D2825]">{trx.desc}</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 bg-[#FAF4F0] border border-[#E8DCD8] rounded text-[#5C2D16]">{trx.category}</span></td>
                  <td className="py-3 px-4">{trx.isScan ? '📑 Scan Struk' : trx.method}</td>
                  <td className={`py-3 px-4 font-bold ${trx.isExpense ? 'text-[#C25E38]' : 'text-emerald-700'}`}>{trx.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
