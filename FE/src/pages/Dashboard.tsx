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
  AlertTriangle,
  ChevronDown,
  MoreHorizontal,
  Server,
  LayoutDashboard,
  CreditCard,
  BarChart3,
  Settings,
  Filter,
  Plus,
  RefreshCcw,
  Camera,
  ArrowDownLeft
} from 'lucide-react';

interface DashboardProps {
  userEmail?: string;
  onLogout?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  userEmail = 'KeisyaExaHaniyah@gmail.com',
  onLogout
}) => {
  // Navigation State: 'dashboard' | 'users' | 'transactions' | 'budgets' | 'analytics' | 'ai' | 'reports' | 'settings'
  const [activeMenu, setActiveMenu] = useState<'dashboard' | 'users' | 'transactions' | 'budgets' | 'analytics' | 'ai' | 'reports' | 'settings'>('dashboard');
  const [currency, setCurrency] = useState<'IDR' | 'USD'>('IDR');
  
  // Dashboard Overview state
  const [chartPeriod, setChartPeriod] = useState<'today' | '7days' | '30days' | 'month' | 'custom'>('7days');
  const [selectedDayIndex, setSelectedDayIndex] = useState(3); // Default 'Kam'
  const [aiActionSelected, setAiActionSelected] = useState<number>(0);
  const [tableSearch, setTableSearch] = useState('');
  
  // User Management state
  const [userSearch, setUserSearch] = useState('');
  const [userFilterStatus, setUserFilterStatus] = useState<string>('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [selectedUserDetail, setSelectedUserDetail] = useState<any>(null);

  // Transactions state
  const [txSearch, setTxSearch] = useState('');
  
  // Notification Toast state
  const [notificationCount, setNotificationCount] = useState(3);
  const [showNotificationToast, setShowNotificationToast] = useState<string | null>(null);

  // Helper for currency formatting
  const formatMoney = (amountIDR: number) => {
    if (currency === 'USD') {
      const usd = (amountIDR / 15500).toFixed(2);
      return `$${usd}`;
    }
    return `Rp ${amountIDR.toLocaleString('id-ID')}`;
  };

  const handleActionToast = (msg: string) => {
    setShowNotificationToast(msg);
    setTimeout(() => setShowNotificationToast(null), 3500);
  };

  // ================= DATA FOR DASHBOARD OVERVIEW =================
  const daysData = [
    { day: 'Sen', fullDate: 'Senin, 21 Okt 2024', inc: 650000000, exp: 310000000, peak: '+15%' },
    { day: 'Sel', fullDate: 'Selasa, 22 Okt 2024', inc: 780000000, exp: 420000000, peak: '+18%' },
    { day: 'Rab', fullDate: 'Rabu, 23 Okt 2024', inc: 890000000, exp: 380000000, peak: '+21%' },
    { day: 'Kam', fullDate: 'Kamis, 24 Okt 2024', inc: 982500000, exp: 410200000, peak: '+24% Peak' },
    { day: 'Jum', fullDate: 'Jumat, 25 Okt 2024', inc: 720000000, exp: 510000000, peak: '+12%' },
    { day: 'Sab', fullDate: 'Sabtu, 26 Okt 2024', inc: 540000000, exp: 620000000, peak: '-8%' },
    { day: 'Min', fullDate: 'Minggu, 27 Okt 2024', inc: 480000000, exp: 470000000, peak: '+2%' },
  ];
  
  // ================= DATA FOR USER MANAGEMENT =================
  const userManagementList = [
    {
      id: 'USR-001',
      avatar: 'AR',
      avatarBg: 'bg-[#FDE8E0] text-[#D95D28]',
      name: 'Aulia Rahma',
      email: 'aulia.r@student.univ.edu',
      tipe: 'Single Income',
      statusType: 'critical',
      statusLabel: 'Critical • Sering Overbudget',
      statusBg: 'bg-[#FDF0EC] text-[#D9381E] border-[#F9D6CE]',
      joinDate: '12 Sep 2026'
    },
    {
      id: 'USR-002',
      avatar: 'RA',
      avatarBg: 'bg-emerald-100 text-emerald-800',
      name: 'Rizky Aditya',
      email: 'rizky.adit@student.univ.edu',
      tipe: 'Multi Income',
      statusType: 'good',
      statusLabel: 'Good • Surplus Stabil',
      statusBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      joinDate: '05 Okt 2026'
    },
    {
      id: 'USR-003',
      avatar: 'KL',
      avatarBg: 'bg-amber-100 text-amber-800',
      name: 'Keisya Lanika',
      email: 'keisya.l@student.univ.edu',
      tipe: 'Single Income',
      statusType: 'warning',
      statusLabel: 'Warning • Mendekati Limit',
      statusBg: 'bg-amber-50 text-amber-700 border-amber-200',
      joinDate: '20 Okt 2026'
    },
    {
      id: 'USR-004',
      avatar: 'BS',
      avatarBg: 'bg-emerald-100 text-emerald-800',
      name: 'Bima Santoso',
      email: 'bima.snt@student.univ.edu',
      tipe: 'Multi Income',
      statusType: 'good',
      statusLabel: 'Good • Tabungan Naik',
      statusBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      joinDate: '22 Okt 2026'
    },
    {
      id: 'USR-005',
      avatar: 'NP',
      avatarBg: 'bg-[#FDE8E0] text-[#D95D28]',
      name: 'Nadia Putri',
      email: 'nadia.ptr@student.univ.edu',
      tipe: 'Single Income',
      statusType: 'critical',
      statusLabel: 'Critical • Budget Habis',
      statusBg: 'bg-[#FDF0EC] text-[#D9381E] border-[#F9D6CE]',
      joinDate: '24 Okt 2026'
    }
  ];

  const filteredUsers = userManagementList.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchStatus = userFilterStatus === 'all' || u.statusType === userFilterStatus;
    return matchSearch && matchStatus;
  });

  // ================= DATA FOR TRANSACTIONS MONITORING =================
  const transactionsMonitoringList = [
    {
      id: 'TRX-9982',
      time: '24 Okt 2026, 14:30',
      name: 'Aulia Rahma',
      email: 'aulia@univ.edu',
      category: 'Makanan',
      metode: 'Manual',
      hasIcon: false,
      amount: -25000,
      type: 'expense'
    },
    {
      id: 'TRX-9983',
      time: '24 Okt 2026, 13:15',
      name: 'Rizky Aditya',
      email: 'rizky@univ.edu',
      category: 'Freelance',
      metode: 'Manual',
      hasIcon: false,
      amount: 500000,
      type: 'income'
    },
    {
      id: 'TRX-9984',
      time: '24 Okt 2026, 12:00',
      name: 'Keisya Lanika',
      email: 'keisya@univ.edu',
      category: 'Belanja Kos',
      metode: 'Scan Struk',
      hasIcon: true,
      amount: -150000,
      type: 'expense'
    },
    {
      id: 'TRX-9985',
      time: '24 Okt 2026, 10:45',
      name: 'Aulia Rahma',
      email: 'aulia@univ.edu',
      category: 'Transportasi',
      metode: 'Manual',
      hasIcon: false,
      amount: -15000,
      type: 'expense'
    },
    {
      id: 'TRX-9986',
      time: '23 Okt 2026, 19:20',
      name: 'Bima Santoso',
      email: 'bima@univ.edu',
      category: 'Hiburan',
      metode: 'Manual',
      hasIcon: false,
      amount: -85000,
      type: 'expense'
    },
    {
      id: 'TRX-9987',
      time: '23 Okt 2026, 08:00',
      name: 'Nadia Putri',
      email: 'nadia@univ.edu',
      category: 'Uang Bulanan',
      metode: 'Manual',
      hasIcon: false,
      amount: 1500000,
      type: 'income'
    }
  ];

  const filteredTxMonitoring = transactionsMonitoringList.filter(t => 
    t.id.toLowerCase().includes(txSearch.toLowerCase()) ||
    t.name.toLowerCase().includes(txSearch.toLowerCase()) ||
    t.email.toLowerCase().includes(txSearch.toLowerCase()) ||
    t.category.toLowerCase().includes(txSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#2C221E] flex font-sans antialiased selection:bg-[#5C2D16] selection:text-white">
      {/* Toast Notification Popup */}
      {showNotificationToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#5C2D16] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#7A3F20] animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400" />
          <span className="text-sm font-medium">{showNotificationToast}</span>
        </div>
      )}

      {/* Modal Detail User */}
      {selectedUserDetail && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#EBE4D8] shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#EBE4D8] pb-3">
              <h3 className="font-bold text-lg text-[#2C221E]">Rincian Profil Pengguna</h3>
              <button onClick={() => setSelectedUserDetail(null)} className="text-[#A0948D] hover:text-[#2C221E]">✕</button>
            </div>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm ${selectedUserDetail.avatarBg}`}>
                {selectedUserDetail.avatar}
              </div>
              <div>
                <h4 className="font-bold text-[#2C221E]">{selectedUserDetail.name}</h4>
                <p className="text-xs text-[#786C65]">{selectedUserDetail.email}</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-[#6E635B] pt-2 border-t border-[#EBE4D8]">
              <div className="flex justify-between">
                <span>Tipe Finansial:</span>
                <strong className="text-[#2C221E]">{selectedUserDetail.tipe}</strong>
              </div>
              <div className="flex justify-between">
                <span>Status AI Health:</span>
                <span className={`px-2 py-0.5 rounded-full font-bold ${selectedUserDetail.statusBg}`}>
                  {selectedUserDetail.statusLabel}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tanggal Bergabung:</span>
                <strong className="text-[#2C221E]">{selectedUserDetail.joinDate}</strong>
              </div>
            </div>
            <button
              onClick={() => {
                handleActionToast(`Profil ${selectedUserDetail.name} berhasil di-update!`);
                setSelectedUserDetail(null);
              }}
              className="w-full py-2.5 bg-[#5C2D16] text-white rounded-xl text-xs font-bold hover:bg-[#482210] transition-all"
            >
              Tutup Rincian
            </button>
          </div>
        </div>
      )}

      {/* Modal Tambah Pengguna */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-[#EBE4D8] shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#EBE4D8] pb-3">
              <h3 className="font-bold text-lg text-[#2C221E]">Tambah Mahasiswa Baru</h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-[#A0948D] hover:text-[#2C221E]">✕</button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-[#2C221E]">Nama Lengkap</label>
                <input type="text" placeholder="Masukkan nama mahasiswa" className="w-full mt-1 p-2.5 bg-[#F7F4EF] border border-[#EBE4D8] rounded-xl text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#2C221E]">Email Kampus</label>
                <input type="email" placeholder="nama@student.univ.edu" className="w-full mt-1 p-2.5 bg-[#F7F4EF] border border-[#EBE4D8] rounded-xl text-xs" />
              </div>
              <div>
                <label className="text-xs font-bold text-[#2C221E]">Tipe Finansial</label>
                <select className="w-full mt-1 p-2.5 bg-[#F7F4EF] border border-[#EBE4D8] rounded-xl text-xs">
                  <option>Single Income</option>
                  <option>Multi Income</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowAddUserModal(false)}
                className="flex-1 py-2.5 bg-[#F7F4EF] text-[#6E635B] rounded-xl text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  handleActionToast('Pengguna baru berhasil ditambahkan!');
                  setShowAddUserModal(false);
                }}
                className="flex-1 py-2.5 bg-[#5C2D16] text-white rounded-xl text-xs font-bold hover:bg-[#482210]"
              >
                Simpan User
              </button>
            </div>
          </div>
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeMenu === 'users'
                      ? 'bg-[#5C2D16] text-white shadow-md shadow-[#5C2D16]/20'
                      : 'text-[#6E635B] hover:bg-[#EFE8DC] hover:text-[#2C221E]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4" />
                    <span>User Management</span>
                  </div>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                    activeMenu === 'users' ? 'bg-[#7A3F20] text-white' : 'bg-[#E8E1D5] text-[#6E635B]'
                  }`}>
                    1.2k
                  </span>
                </button>

                <button
                  onClick={() => setActiveMenu('transactions')}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
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
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeMenu === 'budgets'
                      ? 'bg-[#5C2D16] text-white shadow-md shadow-[#5C2D16]/20'
                      : 'text-[#6E635B] hover:bg-[#EFE8DC] hover:text-[#2C221E]'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Budget Monitoring</span>
                </button>

                <button
                  onClick={() => setActiveMenu('analytics')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeMenu === 'analytics'
                      ? 'bg-[#5C2D16] text-white shadow-md shadow-[#5C2D16]/20'
                      : 'text-[#6E635B] hover:bg-[#EFE8DC] hover:text-[#2C221E]'
                  }`}
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    activeMenu === 'ai'
                      ? 'bg-[#5C2D16] text-white shadow-md shadow-[#5C2D16]/20'
                      : 'bg-[#FDF3E9] text-[#5C2D16] border border-[#F5E4D4] hover:bg-[#FAF0E4]'
                  }`}
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
                <button
                  onClick={() => setActiveMenu('reports')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeMenu === 'reports' ? 'bg-[#5C2D16] text-white' : 'text-[#6E635B] hover:bg-[#EFE8DC] hover:text-[#2C221E]'
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>Reports</span>
                </button>

                <button
                  onClick={() => setActiveMenu('settings')}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeMenu === 'settings' ? 'bg-[#5C2D16] text-white' : 'text-[#6E635B] hover:bg-[#EFE8DC] hover:text-[#2C221E]'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </button>
              </nav>
            </div>
          </div>
        </div>

        {/* Server Status Widget at Sidebar Bottom */}
        <div className="p-3.5 m-3 bg-white border border-[#EBE4D8] rounded-2xl shadow-xs">
          {activeMenu === 'transactions' ? (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#2C221E]">
                <div className="w-5 h-5 rounded-full bg-stone-200 text-[#5C2D16] flex items-center justify-center font-bold text-[10px]">ID</div>
                <span>Sistem Kampus v2.4</span>
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Sync aktif (Real-time)</span>
              </div>
            </div>
          ) : (
            <div>
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
          )}
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
              placeholder={
                activeMenu === 'users'
                  ? 'Cari user (nama, email, ID)...'
                  : activeMenu === 'transactions'
                  ? 'Cari ID transaksi, nama pengguna, kategori...'
                  : 'Cari user, transaksi, atau laporan...'
              }
              value={activeMenu === 'users' ? userSearch : activeMenu === 'transactions' ? txSearch : tableSearch}
              onChange={(e) => {
                if (activeMenu === 'users') setUserSearch(e.target.value);
                else if (activeMenu === 'transactions') setTxSearch(e.target.value);
                else setTableSearch(e.target.value);
              }}
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
                <div className="text-[10px] text-[#A0948D]" title={userEmail}>
                  {activeMenu === 'transactions' ? 'Super Admin' : 'Super Administrator'}
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#5C2D16] text-white font-bold text-xs flex items-center justify-center shadow-sm">
                AM
              </div>
              <button onClick={onLogout} className="text-[#A0948D] hover:text-[#5C2D16] transition-colors" title="Keluar / Logout">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* ================= PAGE BODY CONTENT SWITCHER ================= */}
        <main className="flex-1 p-8 space-y-8 max-w-[1600px] w-full mx-auto">
          
          {/* ========================================================================= */}
          {/* VIEW 1: DASHBOARD OVERVIEW                                                */}
          {/* ========================================================================= */}
          {activeMenu === 'dashboard' && (
            <>
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

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E5DDD0] rounded-xl text-xs font-semibold text-[#6E635B] hover:bg-[#F8F6F2]">
                    <CalendarIcon className="w-3.5 h-3.5 text-[#5C2D16]" />
                    <span>Filter Periode: 1 - 24 Okt 2024</span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#A0948D]" />
                  </button>
                  <button onClick={() => handleActionToast('File CSV berhasil diekspor!')} className="flex items-center gap-2 px-3.5 py-2 bg-white border border-[#E5DDD0] rounded-xl text-xs font-semibold text-[#6E635B] hover:bg-[#F8F6F2]">
                    <FileText className="w-3.5 h-3.5 text-[#5C2D16]" />
                    <span>Ekspor CSV</span>
                  </button>
                  <button onClick={() => handleActionToast('Laporan PDF sedang diunduh...')} className="flex items-center gap-2 px-4 py-2 bg-[#5C2D16] text-white rounded-xl text-xs font-bold hover:bg-[#482210] shadow-md shadow-[#5C2D16]/20">
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Laporan PDF</span>
                  </button>
                </div>
              </div>

              {/* 3 Top Summary KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-[#EBE4D8] shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-medium text-[#786C65]">Total Pengguna Aktif</span>
                      <div className="text-3xl font-black text-[#2C221E] tracking-tight mt-1">1,245</div>
                    </div>
                    <div className="p-3 bg-[#F7F4EF] rounded-xl text-[#5C2D16]">
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
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#EBE4D8] shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-medium text-[#786C65]">Total Transaksi Tercatat</span>
                      <div className="text-3xl font-black text-[#2C221E] tracking-tight mt-1">34,500</div>
                    </div>
                    <div className="p-3 bg-[#F7F4EF] rounded-xl text-[#5C2D16]">
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
                </div>

                <div className="bg-white p-6 rounded-2xl border border-[#EBE4D8] shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-medium text-[#786C65]">Volume Arus Kas Tercatat</span>
                      <div className="text-3xl font-black text-[#2C221E] tracking-tight mt-1">
                        {formatMoney(4500000000).replace('Rp 4.500.000.000', 'Rp 4.5 M')}
                      </div>
                    </div>
                    <div className="p-3 bg-[#F7F4EF] rounded-xl text-[#5C2D16]">
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
                </div>
              </div>

              {/* Middle Section Chart + AI */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-[#EBE4D8] shadow-xs flex flex-col justify-between">
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

                      <div className="flex items-center gap-1 bg-[#F7F4EF] p-1 rounded-xl border border-[#EBE4D8]">
                        {['today', '7days', '30days', 'month'].map((p) => (
                          <button
                            key={p}
                            onClick={() => setChartPeriod(p as any)}
                            className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                              chartPeriod === p ? 'bg-white text-[#5C2D16] shadow-xs' : 'text-[#786C65]'
                            }`}
                          >
                            {p === 'today' ? 'Hari Ini' : p === '7days' ? '7 Hari' : p === '30days' ? '30 Hari' : 'Bulan Ini'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Summary Row */}
                    <div className="mt-5 flex flex-wrap items-center justify-between gap-4 p-4 bg-[#F8F6F2] rounded-xl border border-[#EBE4D8]">
                      <div className="flex items-center gap-6">
                        <div>
                          <div className="text-[11px] text-[#786C65] flex items-center gap-1.5 font-medium">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#5C2D16]"></span>
                            Total Pemasukan
                          </div>
                          <div className="text-base font-bold text-[#2C221E] mt-0.5">{formatMoney(4520000000)}</div>
                        </div>
                        <div className="h-8 w-px bg-[#E5DDD0]"></div>
                        <div>
                          <div className="text-[11px] text-[#786C65] flex items-center gap-1.5 font-medium">
                            <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span>
                            Total Pengeluaran
                          </div>
                          <div className="text-base font-bold text-[#2C221E] mt-0.5">{formatMoney(3120000000)}</div>
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

                  {/* SVG Chart Graphic */}
                  <div className="my-6 relative">
                    <div className="h-56 w-full relative pt-4">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                        <path d="M 0 140 Q 100 120, 200 130 T 400 110 T 600 150 L 700 160 L 700 200 L 0 200 Z" fill="#D9770615" />
                        <path d="M 0 140 Q 100 120, 200 130 T 400 110 T 600 150 L 700 160" stroke="#D97706" strokeWidth="2.5" fill="none" strokeDasharray="4 4" />
                        <path d="M 0 100 Q 100 80, 200 60 T 400 40 T 600 90 L 700 120 L 700 200 L 0 200 Z" fill="#5C2D1625" />
                        <path d="M 0 100 Q 100 80, 200 60 T 400 40 T 600 90 L 700 120" stroke="#5C2D16" strokeWidth="3.5" fill="none" />
                        <circle cx="395" cy="40" r="6" fill="#5C2D16" stroke="#FFFFFF" strokeWidth="3" />
                      </svg>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[#F2EDE4] px-4">
                      {daysData.map((d, index) => (
                        <button
                          key={d.day}
                          onClick={() => setSelectedDayIndex(index)}
                          className={`px-3 py-1 rounded-xl text-xs font-bold ${
                            selectedDayIndex === index ? 'bg-[#5C2D16] text-white' : 'text-[#786C65]'
                          }`}
                        >
                          {d.day}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#F2EDE4] flex items-center justify-between text-xs text-[#786C65]">
                    <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> Rekonsiliasi otomatis: 100% cocok
                    </span>
                    <button onClick={() => setActiveMenu('analytics')} className="font-bold text-[#5C2D16] hover:underline flex items-center gap-1">
                      <span>Buka Laporan Analitik Rinci</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* AI Panel */}
                <div className="bg-[#FFFBF7] p-6 rounded-2xl border border-[#F5ECE3] shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-[#5C2D16] text-white flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-[#F5C29B]" />
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-[#2C221E]">AI Financial Intelligence</h3>
                          <p className="text-xs text-[#786C65]">Deteksi Anomali & Rekomendasi</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-orange-100 text-[#D95D28] font-black text-[10px]">
                        94% AKURAT
                      </span>
                    </div>

                    <div className="p-4 bg-[#FDF3E9] border border-[#F5E4D4] rounded-2xl mb-4 text-xs space-y-2">
                      <div className="font-bold text-[#D95D28] flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4" /> Lonjakan Anomali Kategori
                      </div>
                      <p className="text-[#2C221E]">
                        Terdeteksi lonjakan pengeluaran <strong className="text-[#D95D28]">+41.8%</strong> pada sub-kategori <strong>'Hiburan & Coffee Shop'</strong>.
                      </p>
                    </div>

                    <div className="space-y-2">
                      {['Kirim Notifikasi Smart Budget Limit', 'Tinjau Segmen Pengguna Mahasiswa', 'Aktifkan Reward Investasi / Auto-Save'].map((title, idx) => (
                        <label
                          key={idx}
                          onClick={() => setAiActionSelected(idx)}
                          className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer ${
                            aiActionSelected === idx ? 'bg-white border-[#5C2D16] shadow-xs' : 'border-[#EBE4D8]'
                          }`}
                        >
                          <input type="radio" checked={aiActionSelected === idx} readOnly className="mt-0.5 accent-[#5C2D16]" />
                          <div className="text-xs font-bold text-[#2C221E]">{title}</div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => handleActionToast('Rekomendasi AI berhasil diterapkan!')}
                    className="w-full mt-6 py-3 bg-[#5C2D16] text-white font-bold rounded-xl text-xs hover:bg-[#482210] flex items-center justify-center gap-2"
                  >
                    <span>Terapkan Rekomendasi Terpilih</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* VIEW 2: USER MANAGEMENT (Exact match with Figma Image 1)                   */}
          {/* ========================================================================= */}
          {activeMenu === 'users' && (
            <>
              {/* Header Title & Actions */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-2xl font-black tracking-tight text-[#2C221E]">Manajemen Pengguna</h1>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      1.245 Total Mahasiswa
                    </span>
                  </div>
                  <p className="text-xs text-[#786C65] mt-1">
                    Kelola data mahasiswa dan pantau skor kesehatan finansial mereka secara real-time.
                  </p>
                </div>

                {/* Top Action Buttons */}
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <button
                      onClick={() => setUserFilterStatus(userFilterStatus === 'all' ? 'critical' : 'all')}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5DDD0] rounded-xl text-xs font-semibold text-[#6E635B] hover:bg-[#F8F6F2] shadow-xs"
                    >
                      <Filter className="w-4 h-4 text-[#5C2D16]" />
                      <span>Filter Status</span>
                    </button>
                  </div>

                  <button
                    onClick={() => handleActionToast('Data Pengguna berhasil diekspor ke CSV!')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5DDD0] rounded-xl text-xs font-semibold text-[#6E635B] hover:bg-[#F8F6F2] shadow-xs"
                  >
                    <Download className="w-4 h-4 text-[#5C2D16]" />
                    <span>Ekspor CSV</span>
                  </button>

                  <button
                    onClick={() => setShowAddUserModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#5C2D16] text-white rounded-xl text-xs font-bold hover:bg-[#482210] shadow-md shadow-[#5C2D16]/20 transition-all active:scale-98"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Tambah Pengguna</span>
                  </button>
                </div>
              </div>

              {/* 4 Health Stat KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {/* Card 1: GOOD */}
                <div className="bg-white p-5 rounded-2xl border border-[#EBE4D8] shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-[#786C65] uppercase tracking-wider">
                      KONDISI PRIMA (GOOD)
                    </div>
                    <div className="text-3xl font-black text-[#2C221E] tracking-tight mt-1">842</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs">
                    67.6%
                  </span>
                </div>

                {/* Card 2: WARNING */}
                <div className="bg-white p-5 rounded-2xl border border-[#EBE4D8] shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-[#786C65] uppercase tracking-wider">
                      PERLU PERHATIAN (WARNING)
                    </div>
                    <div className="text-3xl font-black text-[#2C221E] tracking-tight mt-1">278</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-bold text-xs">
                    22.3%
                  </span>
                </div>

                {/* Card 3: CRITICAL */}
                <div className="bg-white p-5 rounded-2xl border border-[#EBE4D8] shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-[#786C65] uppercase tracking-wider">
                      KRITIS (CRITICAL)
                    </div>
                    <div className="text-3xl font-black text-[#2C221E] tracking-tight mt-1">125</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#FDF0EC] text-[#D9381E] font-bold text-xs">
                    10.1%
                  </span>
                </div>

                {/* Card 4: NEW REGISTRATIONS */}
                <div className="bg-white p-5 rounded-2xl border border-[#EBE4D8] shadow-xs flex items-center justify-between">
                  <div>
                    <div className="text-[11px] font-bold text-[#786C65] uppercase tracking-wider">
                      PENDAFTARAN BULAN INI
                    </div>
                    <div className="text-3xl font-black text-[#2C221E] tracking-tight mt-1">+156</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold text-xs">
                    +12.5%
                  </span>
                </div>
              </div>

              {/* User Management Main Table */}
              <div className="bg-white rounded-2xl border border-[#EBE4D8] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F8F6F2]/80 border-b border-[#EBE4D8] text-[11px] font-extrabold text-[#786C65] tracking-wider uppercase">
                        <th className="py-4 px-6">INFORMASI PENGGUNA</th>
                        <th className="py-4 px-6">TIPE FINANSIAL</th>
                        <th className="py-4 px-6">STATUS AI HEALTH</th>
                        <th className="py-4 px-6">TGL BERGABUNG</th>
                        <th className="py-4 px-6 text-center">AKSI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBE4D8] text-xs text-[#2C221E]">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-[#F8F6F2]/60 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs ${user.avatarBg}`}>
                                {user.avatar}
                              </div>
                              <div>
                                <div className="font-bold text-[#2C221E] text-sm">{user.name}</div>
                                <div className="text-xs text-[#786C65]">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-[#F7F4EF] border border-[#EBE4D8] rounded-full text-xs font-semibold text-[#6E635B]">
                              {user.tipe}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${user.statusBg}`}>
                              {user.statusType === 'critical' ? (
                                <RefreshCcw className="w-3.5 h-3.5" />
                              ) : user.statusType === 'good' ? (
                                <Check className="w-3.5 h-3.5" />
                              ) : (
                                <AlertTriangle className="w-3.5 h-3.5" />
                              )}
                              {user.statusLabel}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-[#786C65] font-medium">{user.joinDate}</td>
                          <td className="py-4 px-6 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => setSelectedUserDetail(user)}
                                className="px-3 py-1 bg-white border border-[#EBE4D8] rounded-lg text-xs font-semibold text-[#2C221E] hover:bg-[#F7F4EF]"
                              >
                                Detail
                              </button>
                              <button
                                onClick={() => handleActionToast(`Menu opsi untuk ${user.name}`)}
                                className="p-1 text-[#A0948D] hover:text-[#2C221E]"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Pagination */}
                <div className="p-4 bg-[#F8F6F2]/50 border-t border-[#EBE4D8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#786C65]">
                  <div>
                    Menampilkan <strong className="text-[#2C221E]">1 hingga 5</strong> dari <strong className="text-[#2C221E]">1.245</strong> pengguna
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button className="px-3.5 py-1.5 border border-[#EBE4D8] bg-white rounded-xl text-xs font-semibold hover:bg-[#F7F4EF] text-[#6E635B]">
                      Sebelumnya
                    </button>
                    <button className="px-3.5 py-1.5 bg-[#5C2D16] text-white rounded-xl text-xs font-bold shadow-xs">
                      1
                    </button>
                    <button className="px-3.5 py-1.5 border border-[#EBE4D8] bg-white rounded-xl text-xs font-semibold hover:bg-[#F7F4EF] text-[#6E635B]">
                      2
                    </button>
                    <button className="px-3.5 py-1.5 border border-[#EBE4D8] bg-white rounded-xl text-xs font-semibold hover:bg-[#F7F4EF] text-[#6E635B]">
                      3
                    </button>
                    <span className="px-1 text-[#A0948D]">...</span>
                    <button className="px-3.5 py-1.5 border border-[#EBE4D8] bg-white rounded-xl text-xs font-semibold hover:bg-[#F7F4EF] text-[#6E635B]">
                      250
                    </button>
                    <button className="px-3.5 py-1.5 border border-[#EBE4D8] bg-white rounded-xl text-xs font-semibold hover:bg-[#F7F4EF] text-[#6E635B]">
                      Selanjutnya
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* VIEW 3: TRANSACTIONS MONITORING (Exact match with Figma Image 2)          */}
          {/* ========================================================================= */}
          {activeMenu === 'transactions' && (
            <>
              {/* Breadcrumb & Header Title */}
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#786C65] font-medium mb-1">
                  <span>Keuangan</span>
                  <span>›</span>
                  <span className="text-[#2C221E] font-semibold">Pemantauan Transaksi</span>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-black tracking-tight text-[#2C221E]">Pemantauan Transaksi</h1>
                    <p className="text-xs text-[#786C65] mt-1">
                      Pantau dan kelola seluruh log pemasukan serta pengeluaran mahasiswa.
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleActionToast('Filter Lanjutan Diaktifkan!')}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5DDD0] rounded-xl text-xs font-semibold text-[#6E635B] hover:bg-[#F8F6F2] shadow-xs"
                    >
                      <Filter className="w-4 h-4 text-[#5C2D16]" />
                      <span>Filter Lanjutan</span>
                    </button>

                    <button
                      onClick={() => handleActionToast('Data Transaksi berhasil diekspor!')}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#E5DDD0] rounded-xl text-xs font-semibold text-[#6E635B] hover:bg-[#F8F6F2] shadow-xs"
                    >
                      <Download className="w-4 h-4 text-[#5C2D16]" />
                      <span>Ekspor Data</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 3 Summary KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Card 1: TOTAL TRANSAKSI */}
                <div className="bg-white p-6 rounded-2xl border border-[#EBE4D8] shadow-xs flex items-center gap-4">
                  <div className="p-3.5 bg-[#F7F4EF] rounded-2xl text-[#5C2D16]">
                    <Receipt className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#786C65] uppercase tracking-wider">
                      TOTAL TRANSAKSI
                    </div>
                    <div className="text-2xl font-black text-[#2C221E] tracking-tight mt-0.5">
                      34,500 <span className="text-xs font-normal text-[#786C65]">bulan ini</span>
                    </div>
                  </div>
                </div>

                {/* Card 2: TOTAL PEMASUKAN */}
                <div className="bg-white p-6 rounded-2xl border border-[#EBE4D8] shadow-xs flex items-center gap-4">
                  <div className="p-3.5 bg-emerald-50 rounded-2xl text-emerald-600">
                    <ArrowDownLeft className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#786C65] uppercase tracking-wider">
                      TOTAL PEMASUKAN
                    </div>
                    <div className="text-2xl font-black text-emerald-600 tracking-tight mt-0.5">
                      {formatMoney(3250000000)}
                    </div>
                  </div>
                </div>

                {/* Card 3: TOTAL PENGELUARAN */}
                <div className="bg-white p-6 rounded-2xl border border-[#EBE4D8] shadow-xs flex items-center gap-4">
                  <div className="p-3.5 bg-[#FDF0EC] rounded-2xl text-[#D95D28]">
                    <ArrowUpRight className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#786C65] uppercase tracking-wider">
                      TOTAL PENGELUARAN
                    </div>
                    <div className="text-2xl font-black text-[#D95D28] tracking-tight mt-0.5">
                      {formatMoney(1840000000)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Transactions Main Table */}
              <div className="bg-white rounded-2xl border border-[#EBE4D8] shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-[#F8F6F2]/80 border-b border-[#EBE4D8] text-[11px] font-extrabold text-[#786C65] tracking-wider uppercase">
                        <th className="py-4 px-6">ID & WAKTU</th>
                        <th className="py-4 px-6">PENGGUNA</th>
                        <th className="py-4 px-6">KATEGORI</th>
                        <th className="py-4 px-6">METODE</th>
                        <th className="py-4 px-6 text-right">NOMINAL</th>
                        <th className="py-4 px-6 text-center">DETAIL</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#EBE4D8] text-xs text-[#2C221E]">
                      {filteredTxMonitoring.map((tx) => (
                        <tr key={tx.id} className="hover:bg-[#F8F6F2]/60 transition-colors">
                          <td className="py-4 px-6">
                            <div className="font-bold text-[#2C221E] font-mono">{tx.id}</div>
                            <div className="text-[11px] text-[#786C65] mt-0.5">{tx.time}</div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="font-bold text-[#2C221E]">{tx.name}</div>
                            <div className="text-[11px] text-[#A0948D]">{tx.email}</div>
                          </td>
                          <td className="py-4 px-6">
                            <span className="px-3 py-1 bg-[#F7F4EF] border border-[#EBE4D8] rounded-lg text-xs font-semibold text-[#6E635B]">
                              {tx.category}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-[#6E635B] font-medium">
                            {tx.hasIcon ? (
                              <span className="flex items-center gap-1.5 text-[#5C2D16]">
                                <Camera className="w-3.5 h-3.5" />
                                {tx.metode}
                              </span>
                            ) : (
                              tx.metode
                            )}
                          </td>
                          <td className={`py-4 px-6 text-right font-mono font-bold text-sm ${
                            tx.type === 'income' ? 'text-emerald-600' : 'text-[#D95D28]'
                          }`}>
                            {tx.type === 'income' ? `+ ${formatMoney(tx.amount)}` : `- ${formatMoney(Math.abs(tx.amount))}`}
                          </td>
                          <td className="py-4 px-6 text-center">
                            <button
                              onClick={() => handleActionToast(`Detail rincian transaksi ${tx.id}`)}
                              className="p-1 text-[#A0948D] hover:text-[#2C221E]"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Table Pagination */}
                <div className="p-4 bg-[#F8F6F2]/50 border-t border-[#EBE4D8] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#786C65]">
                  <div>
                    Menampilkan <strong className="text-[#2C221E]">1–6</strong> dari <strong className="text-[#2C221E]">34,500</strong> transaksi
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button className="px-3.5 py-1.5 border border-[#EBE4D8] bg-white rounded-xl text-xs font-semibold hover:bg-[#F7F4EF] text-[#6E635B]">
                      Sebelumnya
                    </button>
                    <button className="px-3.5 py-1.5 bg-[#5C2D16] text-white rounded-xl text-xs font-bold shadow-xs">
                      1
                    </button>
                    <button className="px-3.5 py-1.5 border border-[#EBE4D8] bg-white rounded-xl text-xs font-semibold hover:bg-[#F7F4EF] text-[#6E635B]">
                      2
                    </button>
                    <button className="px-3.5 py-1.5 border border-[#EBE4D8] bg-white rounded-xl text-xs font-semibold hover:bg-[#F7F4EF] text-[#6E635B]">
                      3
                    </button>
                    <span className="px-1 text-[#A0948D]">...</span>
                    <button className="px-3.5 py-1.5 border border-[#EBE4D8] bg-white rounded-xl text-xs font-semibold hover:bg-[#F7F4EF] text-[#6E635B]">
                      5,750
                    </button>
                    <button className="px-3.5 py-1.5 border border-[#EBE4D8] bg-white rounded-xl text-xs font-semibold hover:bg-[#F7F4EF] text-[#6E635B]">
                      Selanjutnya
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ========================================================================= */}
          {/* OTHER VIEWS (Budgets, Analytics, AI, Reports, Settings)                   */}
          {/* ========================================================================= */}
          {activeMenu !== 'dashboard' && activeMenu !== 'users' && activeMenu !== 'transactions' && (
            <div className="bg-white p-12 rounded-3xl border border-[#EBE4D8] text-center space-y-4">
              <div className="w-16 h-16 bg-[#F7F4EF] text-[#5C2D16] rounded-2xl mx-auto flex items-center justify-center font-bold text-xl">
                {activeMenu.toUpperCase().substring(0, 2)}
              </div>
              <h2 className="text-xl font-bold text-[#2C221E] uppercase tracking-wider">
                Modul {activeMenu}
              </h2>
              <p className="text-xs text-[#786C65] max-w-md mx-auto">
                Halaman {activeMenu} telah terhubung dengan sistem MoneyMate Admin. Pilih modul lain di sidebar untuk navigasi.
              </p>
              <button
                onClick={() => setActiveMenu('dashboard')}
                className="px-5 py-2.5 bg-[#5C2D16] text-white rounded-xl text-xs font-bold shadow-md shadow-[#5C2D16]/20"
              >
                Kembali ke Dashboard Overview
              </button>
            </div>
          )}

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
