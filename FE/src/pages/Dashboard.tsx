import React, { useState } from 'react';
import {
  Users,
  Receipt,
  Wallet,
  Sparkles,
  Search,
  Bell,
  Download,
  FileText,
  ArrowUpRight,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
  MoreHorizontal,
  Server,
  LayoutDashboard,
  CreditCard,
  BarChart3,
  ShieldAlert,
  Settings
} from 'lucide-react';

interface DashboardProps {
  userEmail?: string;
  onLogout?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userEmail = 'KeisyaExaHaniyah@gmail.com',
  onLogout
}) => {
  // State variables for interactive UI
  const [activeMenu, setActiveMenu] = useState('dashboard');
  const [currency, setCurrency] = useState<'IDR' | 'USD'>('IDR');
  const [chartPeriod, setChartPeriod] = useState<'today' | '7days' | '30days' | 'month' | 'custom'>('7days');
  const [selectedDayIndex, setSelectedDayIndex] = useState(3); // Default 'Kam' (index 3)
  const [aiActionSelected, setAiActionSelected] = useState<number>(0);
  const [tableSearch, setTableSearch] = useState('');
  const [notificationCount, setNotificationCount] = useState(3);
  const [showNotificationToast, setShowNotificationToast] = useState<string | null>(null);

  // Quick helper for currency formatting
  const formatMoney = (amountIDR: number) => {
    if (currency === 'USD') {
      const usd = (amountIDR / 15500).toFixed(2);
      return `$${usd}`;
    }
    return `Rp ${amountIDR.toLocaleString('id-ID')}`;
  };

  // Days data for Aggregate Financial Statistics
  const daysData = [
    { day: 'Sen', fullDate: 'Senin, 21 Okt 2024', inc: 650000000, exp: 310000000, peak: '+15%' },
    { day: 'Sel', fullDate: 'Selasa, 22 Okt 2024', inc: 780000000, exp: 420000000, peak: '+18%' },
    { day: 'Rab', fullDate: 'Rabu, 23 Okt 2024', inc: 890000000, exp: 380000000, peak: '+21%' },
    { day: 'Kam', fullDate: 'Kamis, 24 Okt 2024', inc: 982500000, exp: 410200000, peak: '+24% Peak' },
    { day: 'Jum', fullDate: 'Jumat, 25 Okt 2024', inc: 720000000, exp: 510000000, peak: '+12%' },
    { day: 'Sab', fullDate: 'Sabtu, 26 Okt 2024', inc: 540000000, exp: 620000000, peak: '-8%' },
    { day: 'Min', fullDate: 'Minggu, 27 Okt 2024', inc: 480000000, exp: 470000000, peak: '+2%' },
  ];

  const selectedDay = daysData[selectedDayIndex];

  // Transactions Data from screenshot
  const initialTransactions = [
    {
      id: '#TRX-94821',
      name: 'Ahmad Fauzi',
      email: 'ahmad.fauzi@gmail.com',
      avatar: 'AF',
      avatarBg: 'bg-amber-100 text-amber-800',
      category: 'Makanan & Minuman',
      metode: 'BCA Virtual Account',
      amount: -45000,
      status: 'Berhasil',
      time: 'Baru saja 14:22 WIB'
    },
    {
      id: '#TRX-94820',
      name: 'Nadia Putri',
      email: '+62 812-4491-0021',
      avatar: 'NP',
      avatarBg: 'bg-emerald-100 text-emerald-800',
      category: 'Target Liburan (Auto-Save)',
      metode: 'Debit Mandiri Rekening',
      amount: 500000,
      status: 'Berhasil',
      time: '4 menit lalu 14:18 WIB'
    },
    {
      id: '#TRX-94819',
      name: 'Bambang Santoso',
      email: 'bambang.s@corporate.id',
      avatar: 'BS',
      avatarBg: 'bg-stone-200 text-stone-800',
      category: 'Listrik PLN Pascabayar',
      metode: 'QRIS Merchant Wallet',
      amount: -780000,
      status: 'Berhasil',
      time: '12 menit lalu 14:10 WIB'
    },
    {
      id: '#TRX-94818',
      name: 'Dewi Lestari',
      email: 'dewi.lestari@yahoo.com',
      avatar: 'DL',
      avatarBg: 'bg-orange-100 text-orange-800',
      category: 'Fashion & Belanja Online',
      metode: 'Kartu Kredit Visa',
      amount: -1250000,
      status: 'Menunggu Settlement',
      time: '25 menit lalu 13:57 WIB'
    },
    {
      id: '#TRX-94817',
      name: 'Reza Hardiansyah',
      email: 'reza.hardiansyah@outlook.com',
      avatar: 'RH',
      avatarBg: 'bg-teal-100 text-teal-800',
      category: 'Gaji & Pendapatan Tetap',
      metode: 'Transfer Bank Payroll',
      amount: 14500000,
      status: 'Berhasil',
      time: '45 menit lalu 13:37 WIB'
    }
  ];

  const filteredTransactions = initialTransactions.filter(t => 
    t.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
    t.email.toLowerCase().includes(tableSearch.toLowerCase()) ||
    t.id.toLowerCase().includes(tableSearch.toLowerCase()) ||
    t.category.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const handleActionToast = (msg: string) => {
    setShowNotificationToast(msg);
    setTimeout(() => setShowNotificationToast(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#2C221E] flex font-sans antialiased selection:bg-[#5C2D16] selection:text-white">
      {/* Toast Notification Popup */}
      {showNotificationToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#5C2D16] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#7A3F20] animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{showNotificationToast}</span>
        </div>
      )}

      {/* ================= SIDEBAR NAVIGATION ================= */}
      <aside className="w-64 bg-[#F8F6F2] border-r border-[#EBE4D8] flex flex-col justify-between sticky top-0 h-screen shrink-0 shadow-sm select-none">
        <div>
          {/* Logo Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-[#EBE4D8]/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#5C2D16] text-white flex items-center justify-center font-black text-lg shadow-md shadow-[#5C2D16]/20">
                M
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[#2C221E]">MoneyMate</span>
              <span className="bg-[#5C2D16] text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                ADMIN
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="px-3 py-5 space-y-6">
            {/* MENU UTAMA */}
            <div>
              <div className="px-3 text-[11px] font-bold text-[#A0948D] tracking-wider uppercase mb-2">
                MENU UTAMA
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveMenu('dashboard')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeMenu === 'dashboard'
                      ? 'bg-[#5C2D16] text-white shadow-md shadow-[#5C2D16]/20'
                      : 'text-[#6E635B] hover:bg-[#EFE8DC] hover:text-[#2C221E]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Dashboard Overview</span>
                  </div>
                </button>

                <button
                  onClick={() => setActiveMenu('users')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeMenu === 'users'
                      ? 'bg-[#5C2D16] text-white shadow-md shadow-[#5C2D16]/20'
                      : 'text-[#6E635B] hover:bg-[#EFE8DC] hover:text-[#2C221E]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4" />
                    <span>User Management</span>
                  </div>
                  <span className="text-[11px] bg-[#E8E1D5] text-[#6E635B] font-bold px-2 py-0.5 rounded-full">
                    1.2k
                  </span>
                </button>

                <button
                  onClick={() => setActiveMenu('transactions')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeMenu === 'transactions'
                      ? 'bg-[#5C2D16] text-white shadow-md shadow-[#5C2D16]/20'
                      : 'text-[#6E635B] hover:bg-[#EFE8DC] hover:text-[#2C221E]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Receipt className="w-4 h-4" />
                    <span>Transactions</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#E05328]"></span>
                </button>

                <button
                  onClick={() => setActiveMenu('budgets')}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#6E635B] hover:bg-[#EFE8DC] hover:text-[#2C221E] transition-all"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Budget Monitoring</span>
                </button>

                <button
                  onClick={() => setActiveMenu('analytics')}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#6E635B] hover:bg-[#EFE8DC] hover:text-[#2C221E] transition-all"
                >
                  <BarChart3 className="w-4 h-4" />
                  <span>Analytics</span>
                </button>
              </nav>
            </div>

            {/* FITUR PINTAR */}
            <div>
              <div className="px-3 text-[11px] font-bold text-[#A0948D] tracking-wider uppercase mb-2">
                FITUR PINTAR
              </div>
              <nav className="space-y-1">
                <button
                  onClick={() => setActiveMenu('ai')}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold bg-[#FDF3E9] text-[#5C2D16] border border-[#F5E4D4] shadow-xs hover:bg-[#FAF0E4] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-[#D95D28]" />
                    <span>AI Financial Insight</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-[#D95D28]"></span>
                </button>
              </nav>
            </div>

            {/* MANAJEMEN */}
            <div>
              <div className="px-3 text-[11px] font-bold text-[#A0948D] tracking-wider uppercase mb-2">
                MANAJEMEN
              </div>
              <nav className="space-y-1">
                <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#6E635B] hover:bg-[#EFE8DC] hover:text-[#2C221E] transition-all">
                  <FileText className="w-4 h-4" />
                  <span>Reports</span>
                </button>

                <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#6E635B] hover:bg-[#EFE8DC] hover:text-[#2C221E] transition-all">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Audit Trail</span>
                </button>

                <button className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-[#6E635B] hover:bg-[#EFE8DC] hover:text-[#2C221E] transition-all">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Server Status Widget at Sidebar Bottom */}
        <div className="p-3.5 m-3 bg-white border border-[#EBE4D8] rounded-2xl shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-[#2C221E]">
            <div className="flex items-center gap-2">
              <Server className="w-3.5 h-3.5 text-[#6E635B]" />
              <span>Server JKT-01</span>
            </div>
            <span className="text-[10px] bg-[#E8E1D5] text-[#6E635B] font-bold px-1.5 py-0.5 rounded-md">
              14ms
            </span>
          </div>
          <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>99.98% Normal</span>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT WRAPPER ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* ================= TOP NAVBAR HEADER ================= */}
        <header className="h-16 bg-[#F8F6F2] border-b border-[#EBE4D8] px-8 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          {/* Search Bar */}
          <div className="relative w-96">
            <Search className="w-4 h-4 text-[#A0948D] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari user, transaksi, atau laporan..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
              className="w-full pl-10 pr-12 py-2 bg-[#EFE8DC]/80 border border-[#E5DDD0] rounded-xl text-xs text-[#2C221E] placeholder-[#A0948D] focus:outline-none focus:ring-2 focus:ring-[#5C2D16]/20 transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-mono text-[#A0948D] bg-[#F7F5F0] px-1.5 py-0.5 rounded border border-[#E5DDD0]">
              ⌘K
            </span>
          </div>

          {/* Right Header Actions */}
          <div className="flex items-center gap-4">
            {/* Currency Toggle Switch */}
            <div className="flex items-center bg-[#EFE8DC] p-1 rounded-xl border border-[#E5DDD0]">
              <button
                onClick={() => setCurrency('IDR')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  currency === 'IDR'
                    ? 'bg-white text-[#5C2D16] shadow-xs'
                    : 'text-[#6E635B] hover:text-[#2C221E]'
                }`}
              >
                IDR (Rp)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  currency === 'USD'
                    ? 'bg-white text-[#5C2D16] shadow-xs'
                    : 'text-[#6E635B] hover:text-[#2C221E]'
                }`}
              >
                USD ($)
              </button>
            </div>

            {/* Bell Notification */}
            <button
              onClick={() => setNotificationCount(0)}
              className="p-2.5 text-[#6E635B] hover:text-[#5C2D16] hover:bg-[#EFE8DC] rounded-xl relative transition-all"
              title="Notifikasi Sistem"
            >
              <Bell className="w-5 h-5" />
              {notificationCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#E05328] rounded-full ring-2 ring-[#F8F6F2]"></span>
              )}
            </button>

            <div className="h-6 w-px bg-[#E5DDD0]"></div>

            {/* Admin User Info */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-[#2C221E]">Admin Master</div>
                <div className="text-[10px] text-[#A0948D]" title={userEmail}>Super Administrator</div>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#7A3F20] to-[#5C2D16] text-white font-bold text-xs flex items-center justify-center shadow-sm border border-[#7A3F20]/30">
                AM
              </div>
              <button onClick={onLogout} className="text-[#A0948D] hover:text-[#5C2D16] transition-colors" title="Keluar / Logout">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* ================= PAGE BODY CONTENT ================= */}
        <main className="flex-1 p-8 space-y-8 max-w-[1600px] w-full mx-auto">
          {/* Main Title & Action Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black tracking-tight text-[#2C221E]">Dashboard Overview</h1>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Live Data Sync
                </span>
              </div>
              <p className="text-xs text-[#786C65] mt-1">
                Konsolidasi metrik perbankan mikro & pemantauan tren finansial real-time
              </p>
            </div>

            {/* Filter & Export Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Date Filter Dropdown */}
              <div className="relative">
                <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E5DDD0] rounded-xl text-xs font-semibold text-[#6E635B] hover:border-[#5C2D16]/40 hover:bg-[#F8F6F2] transition-all shadow-xs">
                  <CalendarIcon className="w-3.5 h-3.5 text-[#5C2D16]" />
                  <span>Filter Periode: 1 - 24 Okt 2024</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[#A0948D]" />
                </button>
              </div>

              {/* CSV Export */}
              <button
                onClick={() => handleActionToast('File CSV berhasil diekspor!')}
                className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E5DDD0] rounded-xl text-xs font-semibold text-[#6E635B] hover:bg-[#F8F6F2] transition-all shadow-xs"
              >
                <FileText className="w-3.5 h-3.5 text-[#5C2D16]" />
                <span>Ekspor CSV</span>
              </button>

              {/* PDF Download Primary Button */}
              <button
                onClick={() => handleActionToast('Laporan PDF sedang diunduh...')}
                className="flex items-center gap-2 px-4 py-2 bg-[#5C2D16] text-white rounded-xl text-xs font-bold hover:bg-[#482210] active:scale-98 transition-all shadow-md shadow-[#5C2D16]/20"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Unduh Laporan PDF</span>
              </button>
            </div>
          </div>

          {/* ================= 3 TOP SUMMARY CARDS ================= */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Total Pengguna Aktif */}
            <div className="bg-white p-6 rounded-2xl border border-[#EBE4D8] shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-[#786C65]">Total Pengguna Aktif</span>
                  <div className="text-3xl font-black text-[#2C221E] tracking-tight mt-1">1,245</div>
                </div>
                <div className="p-3 bg-[#F7F4EF] rounded-xl text-[#5C2D16] group-hover:scale-110 transition-transform">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F2EDE4] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 font-bold text-emerald-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+12.5%</span>
                  <span className="text-[11px] font-normal text-[#A0948D]">vs 30 hari lalu</span>
                </div>
                <span className="text-[11px] text-[#786C65]">Target bulanan: <strong className="text-[#2C221E]">83% tercapai</strong></span>
              </div>
              {/* Green Sparkline SVG */}
              <div className="mt-3 h-8 w-full">
                <svg className="w-full h-full text-emerald-500 overflow-visible" viewBox="0 0 300 40" fill="none">
                  <path d="M0 35 Q40 25, 80 30 T160 15 T240 20 T300 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Card 2: Total Transaksi Tercatat */}
            <div className="bg-white p-6 rounded-2xl border border-[#EBE4D8] shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-[#786C65]">Total Transaksi Tercatat</span>
                  <div className="text-3xl font-black text-[#2C221E] tracking-tight mt-1">34,500</div>
                </div>
                <div className="p-3 bg-[#F7F4EF] rounded-xl text-[#5C2D16] group-hover:scale-110 transition-transform">
                  <Receipt className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F2EDE4] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 font-bold text-emerald-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+8.2%</span>
                  <span className="text-[11px] font-normal text-[#A0948D]">vs 30 hari lalu</span>
                </div>
                <span className="text-[11px] text-[#786C65]">Success rate: <strong className="text-emerald-700">99.4%</strong></span>
              </div>
              {/* Orange Sparkline SVG */}
              <div className="mt-3 h-8 w-full">
                <svg className="w-full h-full text-[#D95D28] overflow-visible" viewBox="0 0 300 40" fill="none">
                  <path d="M0 30 Q50 35, 100 20 T200 25 T300 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>

            {/* Card 3: Volume Arus Kas Tercatat */}
            <div className="bg-white p-6 rounded-2xl border border-[#EBE4D8] shadow-xs hover:shadow-md transition-all relative overflow-hidden group">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-medium text-[#786C65]">Volume Arus Kas Tercatat</span>
                  <div className="text-3xl font-black text-[#2C221E] tracking-tight mt-1">
                    {formatMoney(4500000000).replace('Rp 4.500.000.000', 'Rp 4.5 M')}
                  </div>
                </div>
                <div className="p-3 bg-[#F7F4EF] rounded-xl text-[#5C2D16] group-hover:scale-110 transition-transform">
                  <Wallet className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-[#F2EDE4] flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 font-bold text-emerald-600">
                  <ArrowUpRight className="w-4 h-4" />
                  <span>+15.3%</span>
                  <span className="text-[11px] font-normal text-[#A0948D]">vs 30 hari lalu</span>
                </div>
                <span className="text-[11px] text-[#786C65]">Surplus bersih: <strong className="text-[#5C2D16]">Rp 1.4 M (31%)</strong></span>
              </div>
              {/* Terracotta Brown Sparkline SVG */}
              <div className="mt-3 h-8 w-full">
                <svg className="w-full h-full text-[#5C2D16] overflow-visible" viewBox="0 0 300 40" fill="none">
                  <path d="M0 32 Q40 28, 90 35 T180 18 T300 5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* ================= MIDDLE SECTION: CHART + AI PANEL ================= */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT 2 COLUMNS: FINANCIAL AGGREGATE CHART */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#EBE4D8] shadow-xs flex flex-col justify-between">
              {/* Chart Header & Controls */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-[#2C221E]">Statistik Finansial Agregat</h3>
                      <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">
                        +12% vs minggu lalu
                      </span>
                    </div>
                    <p className="text-xs text-[#786C65] mt-0.5">
                      Komparasi kurva arus pemasukan vs pengeluaran seluruh pengguna
                    </p>
                  </div>

                  {/* Period Tabs */}
                  <div className="flex items-center gap-1 bg-[#F7F4EF] p-1 rounded-xl border border-[#EBE4D8]">
                    <button
                      onClick={() => setChartPeriod('today')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        chartPeriod === 'today' ? 'bg-white text-[#5C2D16] shadow-xs' : 'text-[#786C65] hover:text-[#2C221E]'
                      }`}
                    >
                      Hari Ini
                    </button>
                    <button
                      onClick={() => setChartPeriod('7days')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        chartPeriod === '7days' ? 'bg-white text-[#5C2D16] shadow-xs' : 'text-[#786C65] hover:text-[#2C221E]'
                      }`}
                    >
                      7 Hari
                    </button>
                    <button
                      onClick={() => setChartPeriod('30days')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        chartPeriod === '30days' ? 'bg-white text-[#5C2D16] shadow-xs' : 'text-[#786C65] hover:text-[#2C221E]'
                      }`}
                    >
                      30 Hari
                    </button>
                    <button
                      onClick={() => setChartPeriod('month')}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                        chartPeriod === 'month' ? 'bg-white text-[#5C2D16] shadow-xs' : 'text-[#786C65] hover:text-[#2C221E]'
                      }`}
                    >
                      Bulan Ini
                    </button>
                    <button className="px-2.5 py-1 text-xs font-medium text-[#786C65] flex items-center gap-1">
                      <span>Kustom</span>
                      <ChevronDown className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Summary Row inside Chart Card */}
                <div className="mt-5 flex flex-wrap items-center justify-between gap-4 p-4 bg-[#F8F6F2] rounded-xl border border-[#EBE4D8]">
                  <div className="flex items-center gap-6">
                    <div>
                      <div className="text-[11px] text-[#786C65] flex items-center gap-1.5 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#5C2D16]"></span>
                        Total Pemasukan
                      </div>
                      <div className="text-base font-bold text-[#2C221E] mt-0.5">
                        {formatMoney(4520000000)}
                      </div>
                    </div>

                    <div className="h-8 w-px bg-[#E5DDD0]"></div>

                    <div>
                      <div className="text-[11px] text-[#786C65] flex items-center gap-1.5 font-medium">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span>
                        Total Pengeluaran
                      </div>
                      <div className="text-base font-bold text-[#2C221E] mt-0.5">
                        {formatMoney(3120000000)}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] text-[#786C65]">Rata-rata Harian</span>
                    <div className="text-sm font-bold text-emerald-700">
                      {formatMoney(642800)} <span className="text-[11px] font-semibold text-emerald-600">(+12%)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Main SVG Chart with Gradient Areas & Interactive Days Tooltip */}
              <div className="my-6 relative">
                {/* Interactive Tooltip Card floating on Selected Day */}
                <div
                  className="absolute z-20 bg-[#2C221E] text-white p-3 rounded-xl shadow-xl text-xs space-y-1 transition-all duration-300 border border-[#453630]"
                  style={{
                    left: `${(selectedDayIndex / 6) * 75 + 10}%`,
                    top: '20px'
                  }}
                >
                  <div className="flex items-center justify-between gap-4 border-b border-stone-700 pb-1.5 font-bold">
                    <span>{selectedDay.fullDate}</span>
                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] px-1.5 py-0.5 rounded font-mono">
                      {selectedDay.peak}
                    </span>
                  </div>
                  <div className="pt-1 flex items-center justify-between gap-4 text-[11px]">
                    <span className="text-stone-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Masuk:
                    </span>
                    <strong className="text-white font-mono">{formatMoney(selectedDay.inc)}</strong>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-[11px]">
                    <span className="text-stone-400 flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                      Keluar:
                    </span>
                    <strong className="text-white font-mono">{formatMoney(selectedDay.exp)}</strong>
                  </div>
                </div>

                {/* SVG Chart Graphic */}
                <div className="h-64 w-full relative pt-6">
                  {/* Y Axis Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-[#A0948D] pointer-events-none pr-2">
                    <div className="border-b border-[#F2EDE4] pb-1">Rp 1.5 M</div>
                    <div className="border-b border-[#F2EDE4] pb-1">Rp 1.0 M</div>
                    <div className="border-b border-[#F2EDE4] pb-1">Rp 500rb</div>
                    <div className="border-b border-[#F2EDE4] pb-1">Rp 0</div>
                  </div>

                  <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#5C2D16" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#5C2D16" stopOpacity="0.0" />
                      </linearGradient>
                      <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#D97706" stopOpacity="0.15" />
                        <stop offset="100%" stopColor="#D97706" stopOpacity="0.0" />
                      </linearGradient>
                    </defs>

                    {/* Expense Curve Area & Line */}
                    <path
                      d="M 0 140 Q 100 120, 200 130 T 400 110 T 600 150 L 700 160 L 700 200 L 0 200 Z"
                      fill="url(#expenseGrad)"
                    />
                    <path
                      d="M 0 140 Q 100 120, 200 130 T 400 110 T 600 150 L 700 160"
                      stroke="#D97706"
                      strokeWidth="2.5"
                      fill="none"
                      strokeDasharray="4 4"
                    />

                    {/* Income Curve Area & Line */}
                    <path
                      d="M 0 100 Q 100 80, 200 60 T 400 40 T 600 90 L 700 120 L 700 200 L 0 200 Z"
                      fill="url(#incomeGrad)"
                    />
                    <path
                      d="M 0 100 Q 100 80, 200 60 T 400 40 T 600 90 L 700 120"
                      stroke="#5C2D16"
                      strokeWidth="3.5"
                      fill="none"
                      strokeLinecap="round"
                    />

                    {/* Highlight Circle Dots on Selected Day (Index 3 = Kam = 400px x) */}
                    <circle cx="395" cy="40" r="6" fill="#5C2D16" stroke="#FFFFFF" strokeWidth="3" />
                    <circle cx="395" cy="110" r="5" fill="#D97706" stroke="#FFFFFF" strokeWidth="2" />
                    <line x1="395" y1="0" x2="395" y2="200" stroke="#5C2D16" strokeWidth="1.5" strokeDasharray="3 3" />
                  </svg>
                </div>

                {/* X Axis Day Selector Controls */}
                <div className="flex items-center justify-between pt-3 border-t border-[#F2EDE4] px-4">
                  {daysData.map((d, index) => (
                    <button
                      key={d.day}
                      onClick={() => setSelectedDayIndex(index)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                        selectedDayIndex === index
                          ? 'bg-[#5C2D16] text-white shadow-sm scale-105'
                          : 'text-[#786C65] hover:bg-[#F7F4EF] hover:text-[#2C221E]'
                      }`}
                    >
                      {d.day}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chart Card Footer */}
              <div className="pt-3 border-t border-[#F2EDE4] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#786C65]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                    <CheckCircle2 className="w-4 h-4" />
                    Rekonsiliasi otomatis: 100% cocok
                  </span>
                  <span className="hidden sm:inline text-[#A0948D]">|</span>
                  <span>Pembaruan data setiap 60 detik</span>
                </div>
                <button
                  onClick={() => handleActionToast('Membuka Laporan Analitik Rinci...')}
                  className="font-bold text-[#5C2D16] hover:underline flex items-center gap-1 group"
                >
                  <span>Buka Laporan Analitik Rinci</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: AI FINANCIAL INTELLIGENCE CARD */}
            <div className="bg-[#FFFBF7] p-6 rounded-2xl border border-[#F5ECE3] shadow-xs flex flex-col justify-between relative overflow-hidden">
              {/* Soft background glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#FCE8D5]/50 rounded-full blur-2xl pointer-events-none"></div>

              <div>
                {/* AI Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#5C2D16] text-white flex items-center justify-center shadow-md shadow-[#5C2D16]/20">
                      <Sparkles className="w-5 h-5 text-[#F5C29B]" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-[#2C221E]">AI Financial Intelligence</h3>
                      <p className="text-xs text-[#786C65]">Deteksi Anomali & Rekomendasi</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-orange-100 text-[#D95D28] font-black text-[10px] tracking-wider uppercase border border-orange-200">
                    94% AKURAT
                  </span>
                </div>

                {/* Anomaly Detection Banner */}
                <div className="p-4 bg-[#FDF3E9] border border-[#F5E4D4] rounded-2xl mb-6 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[#D95D28]">
                    <span className="flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      Lonjakan Anomali Kategori
                    </span>
                    <span className="text-[11px] font-normal text-[#A0948D]">2 jam yang lalu</span>
                  </div>
                  <p className="text-xs text-[#2C221E] leading-relaxed">
                    Terdeteksi lonjakan pengeluaran <strong className="text-[#D95D28] font-bold">+41.8%</strong> pada sub-kategori <strong className="font-bold">'Hiburan & Coffee Shop'</strong> di kelompok usia <strong className="font-bold">mahasiswa pasca periode ujian</strong>.
                  </p>
                  <div className="pt-2 flex items-center justify-between text-[11px] text-[#786C65] border-t border-[#F2E0CE]">
                    <span>Audiens Terdampak: <strong>620 Akun</strong></span>
                    <span>Estimasi Risiko: <strong className="text-emerald-700">Rendah</strong></span>
                  </div>
                </div>

                {/* Suggested Action Radio Options */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-[#2C221E] uppercase tracking-wider">
                    AKSI OPERASIONAL YANG DISARANKAN:
                  </div>

                  {/* Radio 1 */}
                  <label
                    onClick={() => setAiActionSelected(0)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      aiActionSelected === 0
                        ? 'bg-white border-[#5C2D16] shadow-sm ring-1 ring-[#5C2D16]'
                        : 'bg-white/60 border-[#EBE4D8] hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="ai_action"
                      checked={aiActionSelected === 0}
                      onChange={() => setAiActionSelected(0)}
                      className="mt-0.5 accent-[#5C2D16]"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#2C221E]">
                        Kirim Notifikasi Smart Budget Limit
                      </div>
                      <p className="text-[11px] text-[#786C65] mt-0.5 leading-snug">
                        Dorong target tabungan darurat & tips penghematan santai.
                      </p>
                    </div>
                  </label>

                  {/* Radio 2 */}
                  <label
                    onClick={() => setAiActionSelected(1)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      aiActionSelected === 1
                        ? 'bg-white border-[#5C2D16] shadow-sm ring-1 ring-[#5C2D16]'
                        : 'bg-white/60 border-[#EBE4D8] hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="ai_action"
                      checked={aiActionSelected === 1}
                      onChange={() => setAiActionSelected(1)}
                      className="mt-0.5 accent-[#5C2D16]"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#2C221E]">
                        Tinjau Segmen Pengguna Mahasiswa
                      </div>
                      <p className="text-[11px] text-[#786C65] mt-0.5 leading-snug">
                        Buat cohort khusus untuk pemantauan arus kas 14 hari.
                      </p>
                    </div>
                  </label>

                  {/* Radio 3 */}
                  <label
                    onClick={() => setAiActionSelected(2)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border transition-all cursor-pointer ${
                      aiActionSelected === 2
                        ? 'bg-white border-[#5C2D16] shadow-sm ring-1 ring-[#5C2D16]'
                        : 'bg-white/60 border-[#EBE4D8] hover:bg-white'
                    }`}
                  >
                    <input
                      type="radio"
                      name="ai_action"
                      checked={aiActionSelected === 2}
                      onChange={() => setAiActionSelected(2)}
                      className="mt-0.5 accent-[#5C2D16]"
                    />
                    <div>
                      <div className="text-xs font-bold text-[#2C221E]">
                        Aktifkan Reward Investasi / Auto-Save
                      </div>
                      <p className="text-[11px] text-[#786C65] mt-0.5 leading-snug">
                        Alihkan sisa belanja receh ke kantong reksa dana mikro.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-2 pt-4 border-t border-[#F5ECE3]">
                <button
                  onClick={() => handleActionToast('Rekomendasi AI berhasil diterapkan ke 620 akun!')}
                  className="w-full py-3 bg-[#5C2D16] text-white font-bold rounded-xl text-xs hover:bg-[#482210] active:scale-98 transition-all flex items-center justify-center gap-2 shadow-md shadow-[#5C2D16]/20"
                >
                  <span>Terapkan Rekomendasi Terpilih</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleActionToast('Notifikasi diabaikan selama 24 jam')}
                  className="w-full py-1.5 text-center text-[11px] font-medium text-[#A0948D] hover:text-[#5C2D16] transition-colors"
                >
                  Abaikan untuk 24 jam
                </button>
              </div>
            </div>
          </div>

          {/* ================= LOWER SECTION: CATEGORY DISTRIBUTION ================= */}
          <div className="bg-white p-6 rounded-2xl border border-[#EBE4D8] shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#2C221E]">Distribusi Kategori Pengeluaran Teratas</h3>
                <p className="text-xs text-[#786C65] mt-0.5">
                  Pemetaan alokasi belanja total pengguna akhir bulan ini
                </p>
              </div>

              {/* Legend Badges */}
              <div className="flex items-center gap-4 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-[#2C221E]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#5C2D16]"></span> Primer
                </span>
                <span className="flex items-center gap-1.5 text-[#2C221E]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#8C4623]"></span> Sekunder
                </span>
                <span className="flex items-center gap-1.5 text-[#2C221E]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#C4754B]"></span> Gaya Hidup
                </span>
                <span className="flex items-center gap-1.5 text-[#2C221E]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#E5B596]"></span> Rutin
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              {/* Left Donut Graphic */}
              <div className="flex flex-col items-center justify-center relative">
                <div className="w-48 h-48 relative flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Ring Segments */}
                    <circle cx="50" cy="50" r="38" stroke="#E5B596" strokeWidth="14" fill="transparent" strokeDasharray="238" strokeDashoffset="0" />
                    <circle cx="50" cy="50" r="38" stroke="#C4754B" strokeWidth="14" fill="transparent" strokeDasharray="238" strokeDashoffset="43" />
                    <circle cx="50" cy="50" r="38" stroke="#8C4623" strokeWidth="14" fill="transparent" strokeDasharray="238" strokeDashoffset="90" />
                    <circle cx="50" cy="50" r="38" stroke="#5C2D16" strokeWidth="14" fill="transparent" strokeDasharray="238" strokeDashoffset="148" />
                  </svg>
                  {/* Center Text inside Donut */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-bold text-[#A0948D] uppercase tracking-wider">Total Belanja</span>
                    <span className="text-lg font-black text-[#2C221E] tracking-tight mt-0.5">
                      {formatMoney(3120000000).replace('Rp 3.120.000.000', 'Rp 3.12 M')}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1">
                      100% Tercatat
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Progress Bars Breakdown */}
              <div className="md:col-span-2 space-y-4">
                {/* Item 1 */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-[#2C221E] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#5C2D16]"></span>
                      Makanan & Minuman (F&B)
                    </span>
                    <span className="text-[#2C221E] font-mono">
                      {formatMoney(1185600000)} <span className="text-[#786C65] font-normal">(38%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-[#F7F4EF] h-3 rounded-full overflow-hidden border border-[#EBE4D8]">
                    <div className="bg-[#5C2D16] h-full rounded-full transition-all duration-700" style={{ width: '38%' }}></div>
                  </div>
                </div>

                {/* Item 2 */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-[#2C221E] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#8C4623]"></span>
                      Belanja & E-Commerce
                    </span>
                    <span className="text-[#2C221E] font-mono">
                      {formatMoney(748800000)} <span className="text-[#786C65] font-normal">(24%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-[#F7F4EF] h-3 rounded-full overflow-hidden border border-[#EBE4D8]">
                    <div className="bg-[#8C4623] h-full rounded-full transition-all duration-700" style={{ width: '24%' }}></div>
                  </div>
                </div>

                {/* Item 3 */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-[#2C221E] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#C4754B]"></span>
                      Hiburan, Kafe & Lifestyle
                    </span>
                    <span className="text-[#2C221E] font-mono">
                      {formatMoney(624000000)} <span className="text-[#786C65] font-normal">(20%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-[#F7F4EF] h-3 rounded-full overflow-hidden border border-[#EBE4D8]">
                    <div className="bg-[#C4754B] h-full rounded-full transition-all duration-700" style={{ width: '20%' }}></div>
                  </div>
                </div>

                {/* Item 4 */}
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1.5">
                    <span className="text-[#2C221E] flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#E5B596]"></span>
                      Tagihan, Listrik & Utilitas
                    </span>
                    <span className="text-[#2C221E] font-mono">
                      {formatMoney(561600000)} <span className="text-[#786C65] font-normal">(18%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-[#F7F4EF] h-3 rounded-full overflow-hidden border border-[#EBE4D8]">
                    <div className="bg-[#E5B596] h-full rounded-full transition-all duration-700" style={{ width: '18%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ================= BOTTOM SECTION: TRANSACTIONS TABLE ================= */}
          <div className="bg-white rounded-2xl border border-[#EBE4D8] shadow-xs overflow-hidden">
            {/* Table Header Controls */}
            <div className="p-6 border-b border-[#EBE4D8] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-bold text-[#2C221E]">Aktivitas Pengguna & Mutasi Terkini</h3>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#F7F4EF] text-[#5C2D16] border border-[#EBE4D8]">
                    Real-Time Feed
                  </span>
                </div>
                <p className="text-xs text-[#786C65] mt-0.5">
                  Audit log transaksi perbankan dan pencatatan kas keluar-masuk
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#A0948D] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari Data, pengguna..."
                    value={tableSearch}
                    onChange={(e) => setTableSearch(e.target.value)}
                    className="pl-9 pr-3 py-1.5 bg-[#F7F4EF] border border-[#EBE4D8] rounded-xl text-xs text-[#2C221E] placeholder-[#A0948D] focus:outline-none focus:ring-1 focus:ring-[#5C2D16]"
                  />
                </div>

                <button
                  onClick={() => handleActionToast('Menampilkan seluruh data transaksi')}
                  className="px-3.5 py-1.5 border border-[#EBE4D8] text-[#6E635B] rounded-xl text-xs font-semibold hover:bg-[#F7F4EF] hover:text-[#2C221E] transition-all"
                >
                  Lihat Semua
                </button>
              </div>
            </div>

            {/* Table Element */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#F8F6F2] border-b border-[#EBE4D8] text-[11px] font-extrabold text-[#786C65] tracking-wider uppercase">
                    <th className="py-3.5 px-6">ID TRANSAKSI</th>
                    <th className="py-3.5 px-6">PENGGUNA</th>
                    <th className="py-3.5 px-6">KATEGORI & METODE</th>
                    <th className="py-3.5 px-6">NOMINAL</th>
                    <th className="py-3.5 px-6">STATUS</th>
                    <th className="py-3.5 px-6">WAKTU</th>
                    <th className="py-3.5 px-6 text-center">AKSI</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE4D8] text-xs text-[#2C221E]">
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#F8F6F2]/60 transition-colors group">
                        <td className="py-4 px-6 font-mono font-bold text-[#5C2D16]">{tx.id}</td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${tx.avatarBg}`}>
                              {tx.avatar}
                            </div>
                            <div>
                              <div className="font-bold text-[#2C221E]">{tx.name}</div>
                              <div className="text-[11px] text-[#A0948D]">{tx.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-[#2C221E] flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#5C2D16]"></span>
                            {tx.category}
                          </div>
                          <div className="text-[11px] text-[#786C65]">{tx.metode}</div>
                        </td>
                        <td className={`py-4 px-6 font-bold font-mono text-sm ${
                          tx.amount > 0 ? 'text-emerald-600' : 'text-[#2C221E]'
                        }`}>
                          {tx.amount > 0 ? `+ ${formatMoney(tx.amount)}` : `- ${formatMoney(Math.abs(tx.amount))}`}
                        </td>
                        <td className="py-4 px-6">
                          {tx.status === 'Berhasil' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <Check className="w-3 h-3" /> Berhasil
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <Clock className="w-3 h-3" /> Menunggu Settlement
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-[#786C65] text-[11px]">{tx.time}</td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleActionToast(`Detail rincian transaksi ${tx.id}`)}
                            className="p-1.5 text-[#A0948D] hover:text-[#5C2D16] hover:bg-[#F7F4EF] rounded-lg transition-all"
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-xs text-[#A0948D]">
                        Tidak ada transaksi yang sesuai dengan kata kunci pencarian.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Pagination */}
            <div className="p-4 bg-[#F8F6F2]/50 border-t border-[#EBE4D8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#786C65]">
              <div>
                Menampilkan <strong className="text-[#2C221E]">1 - 5</strong> dari <strong className="text-[#2C221E]">1,245</strong> transaksi
              </div>

              <div className="flex items-center gap-1.5">
                <button className="px-3 py-1.5 border border-[#EBE4D8] bg-white rounded-xl text-xs font-semibold hover:bg-[#F7F4EF] text-[#6E635B] transition-all">
                  Sebelumnya
                </button>
                <button className="px-3 py-1.5 bg-[#5C2D16] text-white rounded-xl text-xs font-bold shadow-xs">
                  1
                </button>
                <button className="px-3 py-1.5 border border-[#EBE4D8] bg-white rounded-xl text-xs font-semibold hover:bg-[#F7F4EF] text-[#6E635B] transition-all">
                  2
                </button>
                <button className="px-3 py-1.5 border border-[#EBE4D8] bg-white rounded-xl text-xs font-semibold hover:bg-[#F7F4EF] text-[#6E635B] transition-all">
                  3
                </button>
                <span className="px-1 text-[#A0948D]">...</span>
                <button className="px-3 py-1.5 border border-[#EBE4D8] bg-white rounded-xl text-xs font-semibold hover:bg-[#F7F4EF] text-[#6E635B] transition-all">
                  249
                </button>
                <button className="px-3 py-1.5 border border-[#EBE4D8] bg-white rounded-xl text-xs font-semibold hover:bg-[#F7F4EF] text-[#6E635B] transition-all">
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Custom Helper Icon component for calendar
function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}
