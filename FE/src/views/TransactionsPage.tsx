'use client';

import React, { useState } from 'react';
import { UserItem } from './UserManagementPage';

interface TransactionsPageProps {
  onTriggerPdfToast: () => void;
  users?: UserItem[];
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ onTriggerPdfToast, users }) => {
  const [trxSearch, setTrxSearch] = useState('');

      // Pemantauan Transaksi (Strictly synchronized with User Management by index)
  const transactions = React.useMemo(() => {
    const metaList = [
      { id: 101, date: '2026-10-05 14:20', defaultStudent: 'Kayla', desc: 'Pembelian Buku & Alat Tulis', category: 'Akademik', method: 'Transfer Bank', amount: '-Rp 150.000', isExpense: true },
      { id: 102, date: '2026-10-05 12:10', defaultStudent: 'Exa', desc: 'Makan Siang Kantin Utama', category: 'Makanan', method: 'QRIS', amount: '-Rp 25.000', isExpense: true },
      { id: 103, date: '2026-10-04 18:45', defaultStudent: 'Keisya Lanika', desc: 'Kiriman Orang Tua', category: 'Pemasukan', method: 'Transfer Bank', amount: '+Rp 2.000.000', isExpense: false },
      { id: 104, date: '2026-10-04 09:30', defaultStudent: 'Bima Santoso', desc: 'Pembayaran Kos Bulan Oktober', category: 'Tempat Tinggal', method: 'Virtual Account', amount: '-Rp 850.000', isExpense: true },
      { id: 105, date: '2026-10-03 20:15', defaultStudent: 'Aulia Rahma', desc: 'Belanja Kebutuhan Supermarket', category: 'Belanja', method: 'E-Wallet', amount: '-Rp 175.000', isExpense: true },
      { id: 106, date: '2026-10-03 11:05', defaultStudent: 'Rizky Aditya', desc: 'Top Up Saldo E-Money Kampus', category: 'Top Up', method: 'Virtual Account', amount: '+Rp 500.000', isExpense: false },
      { id: 107, date: '2026-10-02 16:40', defaultStudent: 'Nadia Putri', desc: 'Langganan Internet & Kuota Riset', category: 'Utilitas', method: 'Debit Mandiri', amount: '-Rp 220.000', isExpense: true },
      { id: 108, date: '2026-10-02 08:30', defaultStudent: 'Ahmad Fauzi', desc: 'Pembelian Cat & Kanvas Tugas DKV', category: 'Akademik', method: 'QRIS', amount: '-Rp 310.000', isExpense: true },
      { id: 109, date: '2026-10-01 19:10', defaultStudent: 'Bambang Santoso', desc: 'Honor Asisten Laboratorium', category: 'Pemasukan', method: 'Transfer Bank', amount: '+Rp 750.000', isExpense: false }
    ];

    return metaList.map((tx, idx) => {
      const u = (users && users[idx]) ? users[idx] : null;
      return {
        ...tx,
        student: u ? u.name : tx.defaultStudent
      };
    });
  }, [users]);

  const filteredTransactions = transactions.filter(t =>
    t.student.toLowerCase().includes(trxSearch.toLowerCase()) ||
    t.desc.toLowerCase().includes(trxSearch.toLowerCase()) ||
    t.category.toLowerCase().includes(trxSearch.toLowerCase()) ||
    t.method.toLowerCase().includes(trxSearch.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto w-full animate-fadeIn text-xs">
      <div className="flex justify-between items-center">
        <div>
          <div className="text-[11px] text-[#8C7A70]">Keuangan › <span className="font-semibold text-[#5C2D16]">Pemantauan Transaksi</span></div>
          <h1 className="text-xl font-bold text-[#2D2825]">Pemantauan Transaksi Mahasiswa</h1>
        </div>
        <button
          onClick={onTriggerPdfToast}
          className="px-3.5 py-1.5 bg-white border border-[#E5DDD8] text-[#5C2D16] text-xs font-bold rounded-xl shadow-sm hover:bg-[#FAF7F4] flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <span>📥</span> Unduh PDF
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
                <th className="py-2.5 px-4">Metode Pembayaran</th>
                <th className="py-2.5 px-4">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8E4]">
              {filteredTransactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3 px-4 text-[#8C7A70] font-mono">{trx.date}</td>
                  <td className="py-3 px-4 font-bold text-[#2D2825]">{trx.student}</td>
                  <td className="py-3 px-4 text-[#2D2825]">{trx.desc}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 bg-[#FAF4F0] border border-[#E8DCD8] rounded text-[#5C2D16] font-semibold text-[11px]">
                      {trx.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-[#554A43]">{trx.method}</td>
                  <td className={'py-3 px-4 font-bold ' + (trx.isExpense ? 'text-[#C25E38]' : 'text-emerald-700')}>
                    {trx.amount}
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
