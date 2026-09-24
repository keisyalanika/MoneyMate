import React, { useState } from 'react';
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Bell,
  LogOut,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface DashboardProps {
  userEmail?: string;
  onLogout?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userEmail = 'KeisyaExaHaniyah@gmail.com',
  onLogout
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  const user = {
    name: 'Keisya Exa Haniyah',
    email: userEmail,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
    role: 'Admin Utama'
  };

  const stats = [
    { title: 'Saldo Utama', value: 'Rp 24.500.000', change: '+12.5%', isUp: true, icon: Wallet, color: 'bg-[#803B21]/10 text-[#803B21]' },
    { title: 'Total Pemasukan', value: 'Rp 18.250.000', change: '+8.2%', isUp: true, icon: TrendingUp, color: 'bg-emerald-100 text-emerald-700' },
    { title: 'Total Pengeluaran', value: 'Rp 6.420.000', change: '-4.1%', isUp: false, icon: TrendingDown, color: 'bg-rose-100 text-rose-700' },
    { title: 'Tabungan & Investasi', value: 'Rp 12.800.000', change: '+15.0%', isUp: true, icon: PiggyBank, color: 'bg-amber-100 text-amber-700' },
  ];

  const transactions = [
    { id: 'TX-1001', name: 'Gaji Bulanan PT MoneyMate', category: 'Pemasukan', amount: '+ Rp 15.000.000', date: '22 Sep 2026', type: 'income', status: 'Selesai' },
    { id: 'TX-1002', name: 'Belanja Bulanan Supermarket', category: 'Kebutuhan', amount: '- Rp 1.250.000', date: '21 Sep 2026', type: 'expense', status: 'Selesai' },
    { id: 'TX-1003', name: 'Project Freelance UI/UX', category: 'Pemasukan', amount: '+ Rp 3.250.000', date: '20 Sep 2026', type: 'income', status: 'Selesai' },
    { id: 'TX-1004', name: 'Langganan Cloud & Domain', category: 'Tagihan', amount: '- Rp 350.000', date: '19 Sep 2026', type: 'expense', status: 'Selesai' },
    { id: 'TX-1005', name: 'Makan Malam Restoran', category: 'Hiburan', amount: '- Rp 420.000', date: '18 Sep 2026', type: 'expense', status: 'Selesai' },
  ];

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) || t.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || t.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#2D2623] flex flex-col font-sans">
      <header className="bg-white border-b border-[#E8E1D7] sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#803B21] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-[#803B21]/20">
              M
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#2D2623]">MoneyMate</h1>
              <p className="text-xs text-[#6E635B]">Financial Admin Dashboard</p>
            </div>
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-8 relative">
            <Search className="w-4 h-4 text-[#8C7E74] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari transaksi, kategori, atau laporan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#F8F5F0] border border-[#E8E1D7] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#803B21]/30 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <button className="p-2.5 text-[#6E635B] hover:text-[#803B21] hover:bg-[#F8F5F0] rounded-xl relative transition-all">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#803B21] rounded-full ring-2 ring-white"></span>
            </button>
            
            <div className="h-8 w-px bg-[#E8E1D7] hidden sm:block"></div>

            <div className="flex items-center gap-3 pl-1">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-10 h-10 rounded-full border-2 border-[#803B21]/20 object-cover"
              />
              <div className="hidden lg:block text-left">
                <div className="text-sm font-semibold text-[#2D2623] leading-none mb-1 flex items-center gap-1.5">
                  {user.name}
                  <ShieldCheck className="w-4 h-4 text-[#803B21]" />
                </div>
                <div className="text-xs text-[#6E635B]">{user.email}</div>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="ml-2 p-2.5 text-[#8C7E74] hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
              title="Keluar / Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E8E1D7] shadow-sm">
          <div>
            <h2 className="text-2xl font-bold text-[#2D2623]">Selamat Datang Kembali, {user.name} 👋</h2>
            <p className="text-sm text-[#6E635B] mt-1">Berikut adalah ringkasan keuangan dan laporan transaksi Anda bulan ini.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#803B21] text-white rounded-2xl font-medium text-sm hover:bg-[#682E19] transition-all shadow-md shadow-[#803B21]/20 active:scale-98">
              <Plus className="w-4 h-4" />
              Tambah Transaksi
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-3xl border border-[#E8E1D7] shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[#6E635B]">{stat.title}</span>
                  <div className={`p-3 rounded-2xl ${stat.color} transition-transform group-hover:scale-110`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-[#2D2623] tracking-tight">{stat.value}</div>
                <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold">
                  {stat.isUp ? (
                    <span className="flex items-center text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" /> {stat.change}
                    </span>
                  ) : (
                    <span className="flex items-center text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
                      <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" /> {stat.change}
                    </span>
                  )}
                  <span className="text-[#8C7E74] font-normal">vs bulan lalu</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-[#E8E1D7] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#2D2623]">Arus Kas & Analytics</h3>
                <p className="text-xs text-[#6E635B]">Grafik statistik pemasukan dan pengeluaran</p>
              </div>
              <div className="flex items-center gap-2 bg-[#F8F5F0] p-1 rounded-xl border border-[#E8E1D7]">
                <button className="px-3 py-1 text-xs font-semibold bg-white text-[#803B21] rounded-lg shadow-xs">Mingguan</button>
                <button className="px-3 py-1 text-xs font-medium text-[#6E635B] hover:text-[#2D2623]">Bulanan</button>
                <button className="px-3 py-1 text-xs font-medium text-[#6E635B] hover:text-[#2D2623]">Tahunan</button>
              </div>
            </div>

            <div className="h-56 flex items-end justify-between gap-3 pt-6 px-4 border-b border-[#E8E1D7]">
              {[
                { day: 'Sen', inc: '70%', exp: '30%' },
                { day: 'Sel', inc: '45%', exp: '60%' },
                { day: 'Rab', inc: '90%', exp: '25%' },
                { day: 'Kam', inc: '60%', exp: '40%' },
                { day: 'Jum', inc: '80%', exp: '50%' },
                { day: 'Sab', inc: '100%', exp: '85%' },
                { day: 'Min', inc: '50%', exp: '20%' },
              ].map((item, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                  <div className="w-full flex items-end justify-center gap-1.5 h-full">
                    <div
                      className="w-3.5 bg-[#803B21] rounded-t-lg transition-all group-hover:bg-[#682E19]"
                      style={{ height: item.inc }}
                    ></div>
                    <div
                      className="w-3.5 bg-[#E8E1D7] rounded-t-lg transition-all group-hover:bg-[#D5C9BB]"
                      style={{ height: item.exp }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-[#6E635B]">{item.day}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-8 mt-4 pt-2 text-xs text-[#6E635B]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#803B21] rounded-sm"></div>
                <span>Pemasukan</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-[#E8E1D7] rounded-sm"></div>
                <span>Pengeluaran</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E8E1D7] shadow-sm flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#2D2623]">Target Keuangan</h3>
                <PiggyBank className="w-5 h-5 text-[#803B21]" />
              </div>
              <p className="text-xs text-[#6E635B] mb-6">Target tabungan dan impian Anda</p>

              <div className="space-y-5">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-[#2D2623]">Beli Laptop Baru</span>
                    <span className="text-[#803B21]">75%</span>
                  </div>
                  <div className="w-full bg-[#F8F5F0] h-2.5 rounded-full overflow-hidden border border-[#E8E1D7]">
                    <div className="bg-[#803B21] h-full rounded-full transition-all duration-500" style={{ width: '75%' }}></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#8C7E74] mt-1">
                    <span>Rp 15.000.000</span>
                    <span>Target: Rp 20.000.000</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1.5">
                    <span className="text-[#2D2623]">Dana Darurat</span>
                    <span className="text-[#803B21]">90%</span>
                  </div>
                  <div className="w-full bg-[#F8F5F0] h-2.5 rounded-full overflow-hidden border border-[#E8E1D7]">
                    <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: '90%' }}></div>
                  </div>
                  <div className="flex justify-between text-[11px] text-[#8C7E74] mt-1">
                    <span>Rp 45.000.000</span>
                    <span>Target: Rp 50.000.000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#F8F5F0] rounded-2xl border border-[#E8E1D7] flex items-center gap-3">
              <div className="p-2.5 bg-white rounded-xl text-[#803B21] shadow-xs">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-[#2D2623]">Tips Keuangan Hari Ini</h4>
                <p className="text-[11px] text-[#6E635B] mt-0.5">Alokasikan 20% penghasilan langsung ke tabungan sebelum dibelanjakan.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-[#E8E1D7] shadow-sm overflow-hidden">
          <div className="p-6 border-b border-[#E8E1D7] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-[#2D2623]">Transaksi Terakhir</h3>
              <p className="text-xs text-[#6E635B]">Daftar riwayat transaksi masuk dan keluar</p>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${filterType === 'all' ? 'bg-[#803B21] text-white' : 'bg-[#F8F5F0] text-[#6E635B]'}`}
              >
                Semua
              </button>
              <button
                onClick={() => setFilterType('income')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${filterType === 'income' ? 'bg-emerald-600 text-white' : 'bg-[#F8F5F0] text-[#6E635B]'}`}
              >
                Pemasukan
              </button>
              <button
                onClick={() => setFilterType('expense')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${filterType === 'expense' ? 'bg-rose-600 text-white' : 'bg-[#F8F5F0] text-[#6E635B]'}`}
              >
                Pengeluaran
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F5F0]/60 border-b border-[#E8E1D7] text-[12px] font-semibold text-[#6E635B]">
                  <th className="py-3.5 px-6">ID Transaksi</th>
                  <th className="py-3.5 px-6">Keterangan</th>
                  <th className="py-3.5 px-6">Kategori</th>
                  <th className="py-3.5 px-6">Tanggal</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E1D7] text-sm text-[#2D2623]">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-[#F8F5F0]/40 transition-colors">
                      <td className="py-4 px-6 font-mono text-xs font-semibold text-[#803B21]">{tx.id}</td>
                      <td className="py-4 px-6 font-medium text-[#2D2623]">{tx.name}</td>
                      <td className="py-4 px-6">
                        <span className="px-2.5 py-1 bg-[#F8F5F0] border border-[#E8E1D7] rounded-lg text-xs font-medium text-[#6E635B]">
                          {tx.category}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-xs text-[#6E635B]">{tx.date}</td>
                      <td className="py-4 px-6">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/60">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                          {tx.status}
                        </span>
                      </td>
                      <td className={`py-4 px-6 text-right font-bold ${tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {tx.amount}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-xs text-[#8C7E74]">
                      Tidak ada transaksi yang cocok dengan filter atau kata kunci.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};
