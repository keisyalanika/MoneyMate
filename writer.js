const fs = require('fs');
const path = require('path');
const target = path.join(__dirname, 'FE', 'src', 'pages', 'Dashboard.tsx');

const content = import React, { useState } from 'react';
import {
  LayoutDashboard,
  Receipt,
  Users,
  FileText,
  Settings,
  LogOut,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Bell,
  Search,
  Plus,
  Download,
  Sparkles,
  PieChart,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface DashboardProps {
  onLogout: () => void;
  userEmail?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout, userEmail = 'KeisyaExaHaniyah@gmail.com' }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const transactions = [
    { id: 'TRX-9081', date: '22 Sep 2026', desc: 'Dana Hibah Operasional Q3', category: 'Pemasukan', type: 'in', amount: 25000000, status: 'Berhasil' },
    { id: 'TRX-9080', date: '21 Sep 2026', desc: 'Pembayaran Sewa Server & Cloud', category: 'Operasional', type: 'out', amount: 3450000, status: 'Berhasil' },
    { id: 'TRX-9079', date: '20 Sep 2026', desc: 'Langganan Software Design', category: 'Tools', type: 'out', amount: 1200000, status: 'Berhasil' },
    { id: 'TRX-9078', date: '19 Sep 2026', desc: 'Konsultasi Layanan Keuangan', category: 'Pemasukan', type: 'in', amount: 8500000, status: 'Berhasil' },
    { id: 'TRX-9077', date: '18 Sep 2026', desc: 'Pembelian Perlengkapan Kantor', category: 'Operasional', type: 'out', amount: 2150000, status: 'Pending' },
    { id: 'TRX-9076', date: '17 Sep 2026', desc: 'Royalti Penjualan Modul', category: 'Pemasukan', type: 'in', amount: 8800000, status: 'Berhasil' }
  ];

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.desc.toLowerCase().includes(searchTerm.toLowerCase()) || t.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || (filterType === 'in' && t.type === 'in') || (filterType === 'out' && t.type === 'out');
    return matchesSearch && matchesFilter;
  });

  return (
    <div className=" min-h-screen bg-[#F8F5F0] text-[#2D241E] flex\>
 <aside className=\w-64 bg-white border-r border-[#EFE8DF] flex flex-col justify-between p-5 fixed h-full z-20\>
 <div>
 <div className=\flex items-center gap-3 px-2 py-3 mb-6\>
 <div className=\w-10 h-10 rounded-xl bg-[#803B21] flex items-center justify-center text-white shadow-md\>
 <Wallet className=\w-5 h-5\ />
 </div>
 <div>
 <h1 className=\font-bold text-xl tracking-tight text-[#803B21]\>MoneyMate</h1>
 <p className=\text-xs text-[#8A7A6D] font-medium\>Admin Dashboard</p>
 </div>
 </div>

 <nav className=\space-y-1\>
 <button
 onClick={() => setActiveTab('overview')}
 className={w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all }
 >
 <LayoutDashboard className=\w-4 h-4\ /> Overview
 </button>
 <button
 onClick={() => setActiveTab('transactions')}
 className={w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all }
 >
 <Receipt className=\w-4 h-4\ /> Transaksi
 </button>
 <button
 onClick={() => setActiveTab('members')}
 className={w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all }
 >
 <Users className=\w-4 h-4\ /> Anggota & Peran
 </button>
 <button
 onClick={() => setActiveTab('reports')}
 className={w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all }
 >
 <FileText className=\w-4 h-4\ /> Laporan Keuangan
 </button>
 <button
 onClick={() => setActiveTab('settings')}
 className={w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all }
 >
 <Settings className=\w-4 h-4\ /> Pengaturan
 </button>
 </nav>
 </div>

 <div className=\pt-4 border-t border-[#EFE8DF] space-y-3\>
 <div className=\flex items-center gap-3 px-2\>
 <div className=\w-9 h-9 rounded-full bg-[#E8DDD1] text-[#803B21] font-bold flex items-center justify-center text-sm border border-[#D9CBBF]\>KH</div>
 <div className=\flex-1 overflow-hidden\>
 <p className=\text-xs font-semibold text-[#2D241E] truncate\>Keisya Exa Haniyah</p>
 <p className=\text-[11px] text-[#8A7A6D] truncate\>{userEmail}</p>
 </div>
 </div>
 <button onClick={onLogout} className=\w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-[#B91C1C] hover:bg-[#FEE2E2] transition-colors\>
 <LogOut className=\w-4 h-4\ /> Keluar Dari Akun
 </button>
 </div>
 </aside>

 <div className=\flex-1 ml-64 flex flex-col min-h-screen\>
 <header className=\h-16 bg-white border-b border-[#EFE8DF] px-8 flex items-center justify-between sticky top-0 z-10\>
 <div>
 <h2 className=\text-lg font-bold text-[#2D241E]\>Ringkasan Eksekutif Keuangan</h2>
 <p className=\text-xs text-[#8A7A6D]\>Update Realtime • Selasa, 22 September 2026</p>
 </div>
 <div className=\flex items-center gap-4\>
 <div className=\relative w-64\>
 <Search className=\w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8A7A6D]\ />
 <input type=\text\ placeholder=\Cari transaksi laporan...\ value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className=\w-full pl-9 pr-4 py-1.5 text-xs bg-[#F8F5F0] border border-[#EFE8DF] rounded-lg focus:outline-none focus:border-[#803B21] text-[#2D241E]\ />
 </div>
 <button className=\flex items-center gap-1.5 bg-[#803B21] hover:bg-[#682F19] text-white text-xs font-medium px-3.5 py-2 rounded-lg shadow-sm transition-all\>
 <Plus className=\w-3.5 h-3.5\ /> Transaksi Baru
 </button>
 <button className=\p-2 rounded-lg text-[#5C4D42] hover:bg-[#F8F5F0] relative border border-[#EFE8DF]\>
 <Bell className=\w-4 h-4\ /><span className=\absolute top-1 right-1 w-2 h-2 bg-[#B91C1C] rounded-full\></span>
 </button>
 </div>
 </header>

 <main className=\p-8 space-y-6 flex-1\>
 <div className=\grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5\>
 <div className=\bg-white p-5 rounded-xl border border-[#EFE8DF] shadow-sm flex flex-col justify-between\>
 <div className=\flex justify-between items-start\><span className=\text-xs font-semibold text-[#8A7A6D]\>Total Saldo Kas</span><div className=\p-2 rounded-lg bg-[#F5EFE6] text-[#803B21]\><Wallet className=\w-4 h-4\ /></div></div>
 <div className=\mt-3\><h3 className=\text-2xl font-bold text-[#2D241E]\>Rp 148.500.000</h3><div className=\flex items-center gap-1.5 mt-2 text-xs text-[#15803D] font-medium\><ArrowUpRight className=\w-3.5 h-3.5\ /><span>+12.5% vs bulan lalu</span></div></div>
 </div>
 <div className=\bg-white p-5 rounded-xl border border-[#EFE8DF] shadow-sm flex flex-col justify-between\>
 <div className=\flex justify-between items-start\><span className=\text-xs font-semibold text-[#8A7A6D]\>Total Pemasukan</span><div className=\p-2 rounded-lg bg-[#DCFCE7] text-[#15803D]\><TrendingUp className=\w-4 h-4\ /></div></div>
 <div className=\mt-3\><h3 className=\text-2xl font-bold text-[#2D241E]\>Rp 42.300.000</h3><div className=\flex items-center gap-1.5 mt-2 text-xs text-[#15803D] font-medium\><ArrowUpRight className=\w-3.5 h-3.5\ /><span>+8.1% vs target</span></div></div>
 </div>
 <div className=\bg-white p-5 rounded-xl border border-[#EFE8DF] shadow-sm flex flex-col justify-between\>
 <div className=\flex justify-between items-start\><span className=\text-xs font-semibold text-[#8A7A6D]\>Total Pengeluaran</span><div className=\p-2 rounded-lg bg-[#FEE2E2] text-[#B91C1C]\><TrendingDown className=\w-4 h-4\ /></div></div>
 <div className=\mt-3\><h3 className=\text-2xl font-bold text-[#2D241E]\>Rp 18.750.000</h3><div className=\flex items-center gap-1.5 mt-2 text-xs text-[#15803D] font-medium\><ArrowDownRight className=\w-3.5 h-3.5 text-[#15803D]\ /><span>-3.4% lebih hemat</span></div></div>
 </div>
 <div className=\bg-white p-5 rounded-xl border border-[#EFE8DF] shadow-sm flex flex-col justify-between\>
 <div className=\flex justify-between items-start\><span className=\text-xs font-semibold text-[#8A7A6D]\>Surplus Bersih</span><div className=\p-2 rounded-lg bg-[#F5EFE6] text-[#803B21]\><Sparkles className=\w-4 h-4\ /></div></div>
 <div className=\mt-3\><h3 className=\text-2xl font-bold text-[#803B21]\>Rp 23.550.000</h3><div className=\flex items-center gap-1.5 mt-2 text-xs text-[#15803D] font-medium\><ArrowUpRight className=\w-3.5 h-3.5\ /><span>+15.2% rasio tabungan</span></div></div>
 </div>
 </div>

 <div className=\grid grid-cols-1 lg:grid-cols-3 gap-6\>
 <div className=\lg:col-span-2 bg-white p-6 rounded-xl border border-[#EFE8DF] shadow-sm flex flex-col justify-between space-y-6\>
 <div className=\flex justify-between items-center\>
 <div><h3 className=\font-bold text-base text-[#2D241E]\>Tren Arus Kas & Analisis Bulanan</h3><p className=\text-xs text-[#8A7A6D]\>Perbandingan pemasukan vs pengeluaran tahun 2026</p></div>
 <div className=\flex items-center gap-2 bg-[#F8F5F0] p-1 rounded-lg border border-[#EFE8DF]\><button className=\px-3 py-1 text-xs font-semibold bg-white text-[#803B21] rounded shadow-sm\>Bulanan</button><button className=\px-3 py-1 text-xs font-medium text-[#8A7A6D] hover:text-[#2D241E]\>Tahunan</button></div>
 </div>
 <div className=\space-y-4 py-2\>
 {[
 { month: 'Jan', in: 35, out: 20 },
 { month: 'Feb', in: 40, out: 22 },
 { month: 'Mar', in: 38, out: 18 },
 { month: 'Apr', in: 45, out: 25 },
 { month: 'Mei', in: 50, out: 19 },
 { month: 'Jun', in: 42, out: 18 }
 ].map((item, idx) => (
 <div key={idx} className=\flex items-center gap-4 text-xs\>
 <span className=\w-10 font-semibold text-[#5C4D42]\>{item.month}</span>
 <div className=\flex-1 space-y-1.5\>
 <div className=\w-full bg-[#F5EFE6] h-3 rounded-full overflow-hidden flex\><div className=\bg-[#803B21] h-full rounded-full transition-all\ style={{ width: ${item.in * 2}% }}></div></div>
 <div className=\w-full bg-[#FEE2E2] h-2 rounded-full overflow-hidden flex\><div className=\bg-[#B91C1C] h-full rounded-full transition-all\ style={{ width: ${item.out * 2}% }}></div></div>
 </div>
 <span className=\w-20 text-right font-medium text-[#2D241E]\>Rp {item.in}M</span>
 </div>
 ))}
 </div>
 <div className=\bg-[#F5EFE6] border border-[#E8DDD1] rounded-xl p-4 flex items-start gap-3\>
 <div className=\p-2 bg-[#803B21] text-white rounded-lg\><Sparkles className=\w-4 h-4\ /></div>
 <div><h4 className=\text-xs font-bold text-[#803B21]\>MoneyMate Financial Intelligence Insight</h4><p className=\text-xs text-[#5C4D42] mt-0.5 leading-relaxed\>Arus kas berjalan sangat sehat dengan rasio efisiensi 55.6%. Proyeksi surplus bulan depan diperkirakan stabil pada angka <strong>Rp 25.000.000</strong>.</p></div>
 </div>
 </div>

 <div className=\bg-white p-6 rounded-xl border border-[#EFE8DF] shadow-sm flex flex-col justify-between space-y-5\>
 <div className=\flex justify-between items-center\><h3 className=\font-bold text-base text-[#2D241E]\>Alokasi Pengeluaran</h3><PieChart className=\w-4 h-4 text-[#803B21]\ /></div>
 <div className=\flex justify-center py-4\><div className=\relative w-44 h-44 rounded-full border-8 border-[#F5EFE6] flex items-center justify-center shadow-inner\><div className=\text-center\><p className=\text-xs text-[#8A7A6D] font-medium\>Total Terpakai</p><p className=\text-lg font-bold text-[#803B21]\>Rp 18.75M</p><span className=\text-[10px] bg-[#DCFCE7] text-[#15803D] font-semibold px-2 py-0.5 rounded-full\>Optimal</span></div></div></div>
 <div className=\space-y-3\>
 {[
 { label: 'Operasional Kantor', pct: '45%', color: 'bg-[#803B21]' },
 { label: 'Program & Kegiatan', pct: '30%', color: 'bg-[#D97706]' },
 { label: 'Investasi & Cadangan', pct: '15%', color: 'bg-[#059669]' },
 { label: 'Lain-lain', pct: '10%', color: 'bg-[#6B7280]' }
 ].map((cat, idx) => (
 <div key={idx} className=\flex items-center justify-between text-xs\>
 <div className=\flex items-center gap-2\><span className={w-3 h-3 rounded-full }></span><span className=\text-[#5C4D42] font-medium\>{cat.label}</span></div>
 <span className=\font-bold text-[#2D241E]\>{cat.pct}</span>
 </div>
 ))}
 </div>
 </div>
 </div>

 <div className=\bg-white rounded-xl border border-[#EFE8DF] shadow-sm overflow-hidden\>
 <div className=\p-6 border-b border-[#EFE8DF] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4\>
 <div><h3 className=\font-bold text-base text-[#2D241E]\>Transaksi & Mutasi Terakhir</h3><p className=\text-xs text-[#8A7A6D]\>Daftar aktivitas transaksi keuangan yang memerlukan verifikasi admin</p></div>
 <div className=\flex items-center gap-3\>
 <div className=\flex items-center gap-1 bg-[#F8F5F0] p-1 rounded-lg border border-[#EFE8DF]\>
 <button onClick={() => setFilterType('all')} className={px-3 py-1 text-xs font-semibold rounded }>Semua</button>
 <button onClick={() => setFilterType('in')} className={px-3 py-1 text-xs font-semibold rounded }>Pemasukan</button>
 <button onClick={() => setFilterType('out')} className={px-3 py-1 text-xs font-semibold rounded }>Pengeluaran</button>
 </div>
 <button className=\flex items-center gap-1 text-xs font-medium text-[#5C4D42] bg-[#F8F5F0] border border-[#EFE8DF] px-3 py-1.5 rounded-lg hover:bg-[#EFE8DF]\><Download className=\w-3.5 h-3.5\ /> Export Excel</button>
 </div>
 </div>
 <div className=\overflow-x-auto\>
 <table className=\w-full text-left text-xs text-[#2D241E]\>
 <thead className=\bg-[#F8F5F0] text-[#8A7A6D] font-semibold border-b border-[#EFE8DF]\>
 <tr><th className=\py-3.5 px-6\>ID Transaksi</th><th className=\py-3.5 px-6\>Tanggal</th><th className=\py-3.5 px-6\>Deskripsi</th><th className=\py-3.5 px-6\>Kategori</th><th className=\py-3.5 px-6 text-right\>Jumlah (IDR)</th><th className=\py-3.5 px-6 text-center\>Status</th></tr>
 </thead>
 <tbody className=\divide-y divide-[#EFE8DF]\>
 {filteredTransactions.map((trx) => (
 <tr key={trx.id} className=\hover:bg-[#F8F5F0]/50 transition-colors\>
 <td className=\py-4 px-6 font-semibold text-[#803B21]\>{trx.id}</td>
 <td className=\py-4 px-6 text-[#5C4D42]\>{trx.date}</td>
 <td className=\py-4 px-6 font-medium text-[#2D241E]\>{trx.desc}</td>
 <td className=\py-4 px-6\><span className=\px-2.5 py-1 rounded-md bg-[#F5EFE6] text-[#803B21] font-medium text-[11px]\>{trx.category}</span></td>
 <td className={py-4 px-6 text-right font-bold }>{trx.type === 'in' ? '+ ' : '- '}
 Rp {trx.amount.toLocaleString('id-ID')}
 </td>
 <td className=\py-4 px-6 text-center\>
 <span className={inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold }>
 {trx.status === 'Berhasil' ? <CheckCircle2 className=\w-3 h-3\ /> : <Clock className=\w-3 h-3\ />}
 {trx.status}
 </span>
 </td>
 </tr>
 ))}
 </tbody>
 </table>
 </div>
 </div>
 </main>
 </div>
 </div>
 );
};
;

fs.writeFileSync(target, content, 'utf8');
console.log('WRITTEN');
