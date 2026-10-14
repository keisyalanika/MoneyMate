import React, { useState, useEffect } from 'react';
import { fetchTransactionsList, createTransaction } from '../services/api';
import { RefreshCw, Download, Plus } from 'lucide-react';

interface TransactionsPageProps {
  onTriggerPdfToast: () => void;
}

interface TransactionItem {
  id: number | string;
  date: string;
  student: string;
  desc: string;
  category: string;
  method: string;
  amount: string;
  isExpense: boolean;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ onTriggerPdfToast }) => {
  const [trxSearch, setTrxSearch] = useState('');
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreatingTest, setIsCreatingTest] = useState(false);

  const loadTransactions = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchTransactionsList(100);
      if (data && data.length > 0) {
        const mapped: TransactionItem[] = data.map((t: any, idx: number) => {
          const isExpense = t.type !== 'income';
          return {
            id: t.id || idx + 101,
            date: t.date ? String(t.date).slice(0, 16).replace('T', ' ') : new Date().toISOString().slice(0, 16).replace('T', ' '),
            student: t.user_name || t.student || 'Pengguna',
            desc: t.note || t.notes || t.title || 'Transaksi',
            category: t.category_name || t.categoryName || 'Lainnya',
            method: isExpense ? 'QRIS / Debit' : 'Transfer Bank',
            amount: `${isExpense ? '-' : '+'}Rp ${Number(t.amount || 0).toLocaleString('id-ID')}`,
            isExpense,
          };
        });
        setTransactions(mapped);
      } else {
        setTransactions([]);
      }
    } catch (err: any) {
      console.warn('Backend transactions unavailable, set empty:', err.message);
      setTransactions([]);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadTransactions();

    const handleFocus = () => {
      loadTransactions();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleCreateTestTransaction = async () => {
    setIsCreatingTest(true);
    try {
      await createTransaction({
        amount: 25000,
        type: 'EXPENSE',
        categoryId: '1',
        title: 'Makan Siang Kantin Kampus',
        notes: 'Uji coba sinkronisasi transaksi',
        date: new Date().toISOString()
      });
      await loadTransactions();
    } catch (err: any) {
      console.error('Failed to create test transaction:', err);
    } finally {
      setIsCreatingTest(false);
    }
  };

  const filteredTransactions = transactions.filter(t =>
    t.student.toLowerCase().includes(trxSearch.toLowerCase()) ||
    t.desc.toLowerCase().includes(trxSearch.toLowerCase()) ||
    t.category.toLowerCase().includes(trxSearch.toLowerCase()) ||
    t.method.toLowerCase().includes(trxSearch.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto w-full animate-fadeIn text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[11px] text-[#8C7A70] flex items-center gap-1 mb-0.5">
            <span>Keuangan</span>
            <span>›</span>
            <span className="font-semibold text-[#5C2D16]">Pemantauan Transaksi</span>
          </div>
          <h1 className="text-xl font-bold text-[#2D2825]">Pemantauan Transaksi Pengguna</h1>
          <p className="text-xs text-[#8C7A70] mt-0.5">
            Riwayat seluruh mutasi pemasukan dan pengeluaran yang masuk secara langsung dari aplikasi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadTransactions}
            className="px-3.5 py-1.5 bg-white border border-[#E5DDD8] text-[#5C2D16] text-xs font-bold rounded-xl shadow-sm hover:bg-[#FAF7F4] flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RefreshCw className={'w-3.5 h-3.5 ' + (isRefreshing ? 'animate-spin' : '')} /> Segarkan
          </button>
          <button
            onClick={onTriggerPdfToast}
            className="px-3.5 py-1.5 bg-white border border-[#E5DDD8] text-[#5C2D16] text-xs font-bold rounded-xl shadow-sm hover:bg-[#FAF7F4] flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Unduh PDF
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Cari pengguna, deskripsi, atau kategori..."
              value={trxSearch}
              onChange={e => setTrxSearch(e.target.value)}
              className="w-full bg-[#F5F2ED] border border-[#E5DDD8] rounded-xl px-3 py-1.5 text-xs text-[#2D2825] focus:outline-none"
            />
          </div>

          <div className="text-xs font-medium text-[#8C7A70]">
            Total Transaksi: <strong className="text-[#2D2825] font-bold">{transactions.length}</strong>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-[#F0E8E4]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F4] text-[#8C7A70] uppercase text-[10px] font-bold border-b border-[#E5DDD8]">
              <tr>
                <th className="py-2.5 px-4">Tanggal & Waktu</th>
                <th className="py-2.5 px-4">Pengguna</th>
                <th className="py-2.5 px-4">Deskripsi Transaksi</th>
                <th className="py-2.5 px-4">Kategori</th>
                <th className="py-2.5 px-4">Metode Pembayaran</th>
                <th className="py-2.5 px-4 text-right">Jumlah</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8E4]">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 max-w-md mx-auto">
                      <div className="w-14 h-14 rounded-2xl bg-[#FAF4F0] border border-[#E8DCD8] flex items-center justify-center text-2xl shadow-xs">
                        💳
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-[#2D2825] text-sm">Belum Ada Transaksi</div>
                        <p className="text-[11px] text-[#8C7A70] leading-relaxed">
                          Database backend saat ini belum memiliki data transaksi. Transaksi yang dicatat pengguna dari aplikasi Mobile (Flutter) maupun Web akan otomatis muncul di sini secara real-time.
                        </p>
                      </div>
                      <button
                        onClick={handleCreateTestTransaction}
                        disabled={isCreatingTest}
                        className="mt-2 px-3 py-1.5 bg-[#5C2D16] text-white font-bold rounded-xl text-xs hover:bg-[#43200F] transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        {isCreatingTest ? 'Menyimpan...' : 'Tambah Transaksi Uji Coba'}
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((trx) => (
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
                    <td className={'py-3 px-4 text-right font-bold font-mono ' + (trx.isExpense ? 'text-[#C25E38]' : 'text-emerald-700')}>
                      {trx.amount}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer pagination */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8C7A70]">
          <div>
            Menampilkan <strong className="text-[#2D2825]">{filteredTransactions.length > 0 ? `1 - ${filteredTransactions.length}` : '0'}</strong> dari <strong className="text-[#2D2825]">{transactions.length}</strong> Transaksi
          </div>

          <div className="flex items-center gap-1">
            <button disabled className="w-6 h-6 rounded flex items-center justify-center text-stone-400 opacity-40 cursor-not-allowed">‹</button>
            <button className="w-6 h-6 rounded bg-[#4A2613] text-white font-bold flex items-center justify-center">1</button>
            <button disabled className="w-6 h-6 rounded flex items-center justify-center text-stone-400 opacity-40 cursor-not-allowed">›</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
