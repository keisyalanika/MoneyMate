import React, { useState } from 'react';

interface DashboardProps {
  userEmail?: string;
  onLogout: () => void;
}

interface NotificationItem {
  id: string;
  type: 'success' | 'download' | 'ai';
  title: string;
  time: string;
  message: string;
  actionPrimary?: string;
  actionSecondary?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ userEmail = 'KeisyaExaHaniyah@gmail.com', onLogout }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'transactions' | 'budgets' | 'ai' | 'analytics' | 'reports' | 'settings' | 'profile'>('overview');
  const [currency, setCurrency] = useState<'IDR' | 'USD'>('IDR');
  
  // Notification states
  const [showNotificationsStack, setShowNotificationsStack] = useState<boolean>(false);
  const [toastNotification, setToastNotification] = useState<NotificationItem | null>(null);

  const defaultNotificationsStack: NotificationItem[] = [
    {
      id: 'notif-1',
      type: 'success',
      title: 'Perubahan Berhasil Disimpan',
      time: 'Baru saja',
      message: 'Kategori anggaran baru dan ambang batas peringatan 80% telah diperbarui ke sistem SIAKAD kampus.',
      actionPrimary: '↩ Batalkan (Undo)',
      actionSecondary: '🟢 Tersinkronisasi'
    },
    {
      id: 'notif-2',
      type: 'download',
      title: 'Laporan Berhasil Diunduh',
      time: '12 dtk lalu',
      message: 'Dokumen PDF Rekapitulasi-Keuangan-Semester-Genap.pdf (4.2 MB) siap dibuka di perangkat Anda.',
      actionPrimary: '📄 Buka Berkas',
      actionSecondary: 'Folder Downloads'
    },
    {
      id: 'notif-3',
      type: 'ai',
      title: 'Semua Rekomendasi AI Berhasil Diterapkan',
      time: 'Baru saja',
      message: 'Intervensi cerdas untuk 14 mahasiswa defisit telah aktif: Pembatasan limit QRIS terpasang & pesan bimbingan otomatis terkirim via WhatsApp/SIAKAD.',
      actionPrimary: '👁️ Lihat Log Intervensi',
      actionSecondary: '🟢 14/14 Sukses'
    }
  ];

  const [activeNotifications, setActiveNotifications] = useState<NotificationItem[]>(defaultNotificationsStack);
  const [hoveredDayIndex, setHoveredDayIndex] = useState<number | null>(null);
  
  // Search & Filter states
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState('All');
  const [userStatusFilter, setUserStatusFilter] = useState('All');

  // Transaction view state
  const [trxSearch, setTrxSearch] = useState('');

  // Budget Monitoring view state (Gambar 1 Specs)
  const [budgetSearch, setBudgetSearch] = useState('');
  const [budgetTabFilter, setBudgetTabFilter] = useState<'All' | 'Aman' | 'Waspada' | 'Overbudget'>('All');
  const [budgetSemesterFilter, setBudgetSemesterFilter] = useState('All');

  // AI Executed Notification state
  const [aiExecuted, setAiExecuted] = useState(false);

  // Profile Form States (Gambar 2 Specs)
  const [profileName, setProfileName] = useState('Admin');
  const [adminId] = useState('ADM-01');
  const [profileEmail, setProfileEmail] = useState(userEmail || 'KeisyaExaHaniyah@gmail.com');
  const [adminRole] = useState('Administrator');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileSavedMsg, setProfileSavedMsg] = useState(false);

  const handleDismissNotification = (id: string) => {
    setActiveNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleToggleBell = () => {
    if (!showNotificationsStack) {
      if (activeNotifications.length === 0) {
        setActiveNotifications(defaultNotificationsStack);
      }
      setShowNotificationsStack(true);
    } else {
      setShowNotificationsStack(false);
    }
  };

  const handleDownloadPdf = () => {
    const downloadToast: NotificationItem = {
      id: 'toast-pdf-' + Date.now(),
      type: 'download',
      title: 'Laporan Berhasil Diunduh',
      time: 'Baru saja',
      message: 'Dokumen PDF Rekapitulasi-Keuangan-Semester-Genap.pdf (4.2 MB) siap dibuka di perangkat Anda.',
      actionPrimary: '📄 Buka Berkas',
      actionSecondary: 'Folder Downloads'
    };
    setToastNotification(downloadToast);
    setTimeout(() => setToastNotification(null), 5000);
  };

  const handleExecuteAllAI = () => {
    setAiExecuted(true);
    const aiToast: NotificationItem = {
      id: 'toast-ai-' + Date.now(),
      type: 'ai',
      title: 'Semua Rekomendasi AI Berhasil Diterapkan',
      time: 'Baru saja',
      message: 'Intervensi cerdas untuk 14 mahasiswa defisit telah aktif: Pembatasan limit QRIS terpasang.',
      actionPrimary: '👁️ Lihat Log Intervensi',
      actionSecondary: '🟢 14/14 Sukses'
    };
    setToastNotification(aiToast);
    setTimeout(() => {
      setToastNotification(null);
      setAiExecuted(false);
    }, 4000);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSavedMsg(true);
    setTimeout(() => setProfileSavedMsg(false), 3000);
  };

  const fmtMoney = (idrStr: string, usdStr: string) => {
    return currency === 'USD' ? usdStr : idrStr;
  };

  // Mock Data for Aggregate Chart
  const chartDays = [
    { day: 'Sen', pas: currency === 'USD' ? '$26,000' : 'Rp 400 Jt', kel: currency === 'USD' ? '$18,000' : 'Rp 280 Jt', dateText: 'Senin, 21 Okt 2024', peakBadge: 'Normal' },
    { day: 'Sel', pas: currency === 'USD' ? '$42,000' : 'Rp 650 Jt', kel: currency === 'USD' ? '$27,000' : 'Rp 420 Jt', dateText: 'Selasa, 22 Okt 2024', peakBadge: 'Normal' },
    { day: 'Rab', pas: currency === 'USD' ? '$50,000' : 'Rp 780 Jt', kel: currency === 'USD' ? '$33,000' : 'Rp 510 Jt', dateText: 'Rabu, 23 Okt 2024', peakBadge: 'Normal' },
    { day: 'Kam', pas: currency === 'USD' ? '$63,300' : 'Rp 982.500.000', kel: currency === 'USD' ? '$26,400' : 'Rp 410.200.000', dateText: 'Kamis, 24 Okt 2024', peakBadge: '+24% Peak' },
    { day: 'Jum', pas: currency === 'USD' ? '$45,000' : 'Rp 710 Jt', kel: currency === 'USD' ? '$40,000' : 'Rp 620 Jt', dateText: 'Jumat, 25 Okt 2024', peakBadge: 'Normal' },
    { day: 'Sab', pas: currency === 'USD' ? '$35,000' : 'Rp 550 Jt', kel: currency === 'USD' ? '$31,000' : 'Rp 480 Jt', dateText: 'Sabtu, 26 Okt 2024', peakBadge: 'Normal' },
    { day: 'Min', pas: currency === 'USD' ? '$31,000' : 'Rp 490 Jt', kel: currency === 'USD' ? '$25,000' : 'Rp 390 Jt', dateText: 'Minggu, 27 Okt 2024', peakBadge: 'Normal' },
  ];

  // User Management Mock Data
  const usersData = [
    { id: '1', name: 'Ahmad Fauzi', email: 'ahmad.fauzi@gmail.com', role: 'Mahasiswa', status: 'Aktif', phone: '+62 812-3456-7890', regDate: '12 Jan 2024' },
    { id: '2', name: 'Nadia Putri', email: 'nadiaputri@gmail.com', role: 'Mahasiswa', status: 'Aktif', phone: '+62 812-4491-0021', regDate: '15 Jan 2024' },
    { id: '3', name: 'Bambang Santoso', email: 'bambang.s@corporate.id', role: 'Dosen / Staf', status: 'Aktif', phone: '+62 813-9988-1122', regDate: '02 Feb 2024' },
    { id: '4', name: 'Dewi Lestari', email: 'dewilestari@yahoo.com', role: 'Mahasiswa', status: 'Pending', phone: '+62 857-1122-3344', regDate: '20 Feb 2024' },
    { id: '5', name: 'Reza Hardiansyah', email: 'reza.hardiansyah@outlook.com', role: 'Mahasiswa', status: 'Aktif', phone: '+62 819-0011-2233', regDate: '01 Mar 2024' },
    { id: '6', name: 'Siti Rahmawati', email: 'siti.rahma@gmail.com', role: 'Bendahara UKM', status: 'Aktif', phone: '+62 812-9900-1122', regDate: '10 Mar 2024' },
    { id: '7', name: 'Budi Kurniawan', email: 'budi.kurnia@gmail.com', role: 'Mahasiswa', status: 'Nonaktif', phone: '+62 815-4433-2211', regDate: '18 Mar 2024' },
  ];

  const filteredUsers = usersData.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = userRoleFilter === 'All' || u.role === userRoleFilter;
    const matchStatus = userStatusFilter === 'All' || u.status === userStatusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  // Overview Recent Transactions Table Mock Data
  const overviewTransactions = [
    { id: '#TRX-94821', user: 'Ahmad Fauzi', email: 'ahmad.fauzi@gmail.com', avatar: 'AF', cat: 'Makanan & Minuman', subcat: 'BCA Virtual Account', amount: currency === 'USD' ? '- $2.90' : '- Rp 45.000', isExpense: true, status: 'Berhasil', time: 'Baru saja', timeSub: '14:32 WIB' },
    { id: '#TRX-94820', user: 'Nadia Putri', email: '+62 812-4491-0021', avatar: 'NP', cat: 'Target Ukuran (Auto-Save)', subcat: 'Debit Mandiri Rekening', amount: currency === 'USD' ? '+ $32.25' : '+ Rp 500.000', isExpense: false, status: 'Berhasil', time: '4 menit lalu', timeSub: '14:28 WIB' },
    { id: '#TRX-94819', user: 'Bambang Santoso', email: 'bambang.s@corporate.id', avatar: 'BS', cat: 'Listrik PLN Pascapabayar', subcat: 'QRIS Merchant Wallet', amount: currency === 'USD' ? '- $50.30' : '- Rp 780.000', isExpense: true, status: 'Berhasil', time: '12 menit lalu', timeSub: '14:20 WIB' },
    { id: '#TRX-94818', user: 'Dewi Lestari', email: 'dewilestari@yahoo.com', avatar: 'DL', cat: 'Fashion & Belanja Online', subcat: 'Kartu Kredit Visa', amount: currency === 'USD' ? '- $80.60' : '- Rp 1.250.000', isExpense: true, status: 'Menunggu Settlement', isPending: true, time: '26 menit lalu', timeSub: '14:07 WIB' },
    { id: '#TRX-94817', user: 'Reza Hardiansyah', email: 'reza.hardiansyah@outlook.com', avatar: 'RH', cat: 'Gaji & Pendapatan Tetap', subcat: 'Transfer Bank Payroll', amount: currency === 'USD' ? '+ $935.40' : '+ Rp 14.500.000', isExpense: false, status: 'Berhasil', time: '45 menit lalu', timeSub: '13:47 WIB' }
  ];

  // Pemantauan Transaksi Page Mock Data
  const fullTransactions = [
    { id: 'TRX-9982', time: '24 Okt 2026, 14:30', user: 'Aulia Rahma', email: 'aulia@univ.edu', category: 'Makanan', method: 'Manual', amount: currency === 'USD' ? '- $1.60' : '- Rp 25.000', isExpense: true },
    { id: 'TRX-9983', time: '24 Okt 2026, 13:15', user: 'Rizky Aditya', email: 'rizky@univ.edu', category: 'Freelance', method: 'Manual', amount: currency === 'USD' ? '+ $32.25' : '+ Rp 500.000', isExpense: false },
    { id: 'TRX-9984', time: '24 Okt 2026, 12:00', user: 'Keisya Lanika', email: 'keisya@univ.edu', category: 'Belanja Kos', method: 'Scan Struk', amount: currency === 'USD' ? '- $9.68' : '- Rp 150.000', isExpense: true, isScan: true },
    { id: 'TRX-9985', time: '24 Okt 2026, 10:45', user: 'Aulia Rahma', email: 'aulia@univ.edu', category: 'Transportasi', method: 'Manual', amount: currency === 'USD' ? '- $0.97' : '- Rp 15.000', isExpense: true },
    { id: 'TRX-9986', time: '23 Okt 2026, 19:20', user: 'Bima Santoso', email: 'bima@univ.edu', category: 'Hiburan', method: 'Manual', amount: currency === 'USD' ? '- $5.48' : '- Rp 85.000', isExpense: true },
    { id: 'TRX-9987', time: '23 Okt 2026, 08:00', user: 'Nadia Putri', email: 'nadia@univ.edu', category: 'Uang Bulanan', method: 'Manual', amount: currency === 'USD' ? '+ $96.77' : '+ Rp 1.500.000', isExpense: false },
  ];

  const filteredFullTrx = fullTransactions.filter(t => {
    return t.id.toLowerCase().includes(trxSearch.toLowerCase()) || t.user.toLowerCase().includes(trxSearch.toLowerCase()) || t.email.toLowerCase().includes(trxSearch.toLowerCase());
  });

  // Budget Monitoring Students Mock Data (Gambar 1 Specs)
  const studentBudgets = [
    { id: 'b1', name: 'Keisya Lanika', nim: '10293841', avatar: 'KL', color: 'bg-rose-100 text-rose-800', budget: 'Rp 2.000.000', realisasi: 'Rp 2.350.000', percent: '117.5%', quotaText: '+Rp 350.000', isOver: true, catKritis: 'Makanan & Kos', status: 'Over-Budget', statusType: 'over' },
    { id: 'b2', name: 'Bima Santoso', nim: '10293842', avatar: 'BS', color: 'bg-amber-100 text-amber-800', budget: 'Rp 1.500.000', realisasi: 'Rp 1.420.000', percent: '94.6%', quotaText: 'Sisa Rp 80.000', isOver: false, catKritis: 'Hiburan & Nongkrong', status: 'Waspada', statusType: 'waspada' },
    { id: 'b3', name: 'Aulia Rahma', nim: '10293843', avatar: 'AR', color: 'bg-emerald-100 text-emerald-800', budget: 'Rp 2.500.000', realisasi: 'Rp 1.625.000', percent: '65.0%', quotaText: 'Sisa Rp 875.000', isOver: false, catKritis: 'Belanja Bulanan', status: 'Aman', statusType: 'aman' },
    { id: 'b4', name: 'Rizky Aditya', nim: '10293844', avatar: 'RA', color: 'bg-stone-200 text-stone-800', budget: 'Rp 3.000.000', realisasi: 'Rp 2.100.000', percent: '70.0%', quotaText: 'Sisa Rp 900.000', isOver: false, catKritis: 'Buku & Kuliah', status: 'Aman', statusType: 'aman' },
    { id: 'b5', name: 'Nadia Putri', nim: '10293845', avatar: 'NP', color: 'bg-rose-100 text-rose-800', budget: 'Rp 1.800.000', realisasi: 'Rp 2.050.000', percent: '113.8%', quotaText: '+Rp 250.000', isOver: true, catKritis: 'Transport & Lifestyle', status: 'Over-Budget', statusType: 'over' },
  ];

  const filteredStudentBudgets = studentBudgets.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(budgetSearch.toLowerCase()) || b.nim.includes(budgetSearch);
    const matchTab = budgetTabFilter === 'All' ? true : (budgetTabFilter === 'Aman' ? b.statusType === 'aman' : (budgetTabFilter === 'Waspada' ? b.statusType === 'waspada' : b.statusType === 'over'));
    const matchSem = budgetSemesterFilter === 'All' ? true : true;
    return matchSearch && matchTab && matchSem;
  });

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-[#2D2825] font-sans flex flex-col md:flex-row text-xs">
      {/* SIDEBAR - Compact Layout */}
      <aside className="w-full md:w-56 bg-[#FDF0EC]/70 border-r border-[#E8DCD8] flex flex-col justify-between shrink-0 min-h-screen">
        <div>
          <div className="p-4 flex items-center gap-2.5 border-b border-[#E8DCD8]/60">
            <div className="w-8 h-8 rounded-xl bg-[#5C2D16] text-[#F7F5F0] flex items-center justify-center font-bold text-base shadow-sm">M</div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base text-[#5C2D16] tracking-tight">MoneyMate</span>
                <span className="px-1.5 py-0.5 text-[9px] font-bold bg-[#E6D0C7] text-[#5C2D16] rounded uppercase">ADMIN</span>
              </div>
            </div>
          </div>

          <nav className="p-2 space-y-4">
            <div>
              <div className="px-2 text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider mb-1.5">MENU UTAMA</div>
              <ul className="space-y-0.5">
                <li>
                  <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-medium text-xs transition-all ${activeTab === 'overview' ? 'bg-[#5C2D16] text-white shadow-md' : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/></svg>
                    Dashboard Overview
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('users')} className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-medium text-xs transition-all ${activeTab === 'users' ? 'bg-[#5C2D16] text-white shadow-md' : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
                    User Management
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('transactions')} className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-medium text-xs transition-all ${activeTab === 'transactions' ? 'bg-[#5C2D16] text-white shadow-md' : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
                    Transactions
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('budgets')} className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-medium text-xs transition-all ${activeTab === 'budgets' ? 'bg-[#5C2D16] text-white shadow-md' : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"/></svg>
                    Budget Monitoring
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="px-2 text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider mb-1.5">FITUR PINTAR</div>
              <ul className="space-y-0.5">
                <li>
                  <button onClick={() => setActiveTab('ai')} className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-medium text-xs transition-all ${activeTab === 'ai' ? 'bg-[#5C2D16] text-white shadow-md' : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'}`}>
                    <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                    AI Financial Insight
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('analytics')} className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-medium text-xs transition-all ${activeTab === 'analytics' ? 'bg-[#5C2D16] text-white shadow-md' : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 012-2H5a2 2 0 012 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                    Analytics & Statistik
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <div className="px-2 text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider mb-1.5">MANAJEMEN</div>
              <ul className="space-y-0.5">
                <li>
                  <button onClick={() => setActiveTab('reports')} className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-medium text-xs transition-all ${activeTab === 'reports' ? 'bg-[#5C2D16] text-white shadow-md' : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    Reports
                  </button>
                </li>
                <li>
                  <button onClick={() => setActiveTab('settings')} className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-xl font-medium text-xs transition-all ${activeTab === 'settings' ? 'bg-[#5C2D16] text-white shadow-md' : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'}`}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                    Settings
                  </button>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="p-2.5 border-t border-[#E8DCD8]">
          <div className="bg-[#FAF4F0] border border-[#E8DCD8] rounded-xl p-2.5 flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <div>
                <div className="font-semibold text-[#5C2D16]">Sistem Kampus v2.4</div>
                <div className="text-[9px] text-emerald-700 font-medium">Sync aktif</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 overflow-x-hidden relative">
        {/* TOP HEADER BAR */}
        <header className="bg-white/80 backdrop-blur border-b border-[#E8DCD8] px-5 py-2.5 flex items-center justify-between gap-4 sticky top-0 z-40">
          <div className="relative flex-1 max-w-md">
            <svg className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8C7A70]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
            <input
              type="text"
              placeholder={activeTab === 'ai' ? "Tanya AI tentang tren bulan ini (misal: 'analisis kopi')..." : "Cari data, mahasiswa, kategori..."}
              value={activeTab === 'transactions' ? trxSearch : (activeTab === 'users' ? userSearch : (activeTab === 'budgets' ? budgetSearch : ''))}
              onChange={e => {
                if (activeTab === 'transactions') setTrxSearch(e.target.value);
                if (activeTab === 'users') setUserSearch(e.target.value);
                if (activeTab === 'budgets') setBudgetSearch(e.target.value);
              }}
              className="w-full bg-[#F5F2ED] border border-[#E5DDD8] rounded-xl pl-8 pr-10 py-1.5 text-xs text-[#2D2825] focus:outline-none focus:ring-2 focus:ring-[#5C2D16]/20 transition-all placeholder-[#A08C82]"
            />
            <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] text-[#8C7A70] bg-[#EAE3DE] px-1.5 py-0.5 rounded font-mono">⌘K</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-[#F5F2ED] border border-[#E5DDD8] p-0.5 rounded-xl text-xs font-medium text-[#5C2D16]">
              <button onClick={() => setCurrency('IDR')} className={`px-2.5 py-1 rounded-lg transition-all ${currency === 'IDR' ? 'bg-white shadow-sm font-bold text-[#5C2D16]' : 'text-[#8C7A70] hover:text-[#5C2D16]'}`}>
                IDR (Rp)
              </button>
              <button onClick={() => setCurrency('USD')} className={`px-2.5 py-1 rounded-lg transition-all ${currency === 'USD' ? 'bg-white shadow-sm font-bold text-[#5C2D16]' : 'text-[#8C7A70] hover:text-[#5C2D16]'}`}>
                USD ($)
              </button>
            </div>

            <button onClick={handleToggleBell} className="relative p-2 rounded-xl text-[#5C2D16] hover:bg-[#F5F2ED] transition-colors" title="Notifikasi">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            </button>

            <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-2 p-1 pr-2.5 rounded-xl transition-all border ${activeTab === 'profile' ? 'bg-[#FAF4F0] border-[#5C2D16]/40 shadow-sm' : 'border-transparent hover:bg-[#FAF4F0] hover:border-[#E8DCD8]'}`}>
              <div className="w-7 h-7 rounded-full bg-[#5C2D16] text-[#F7F5F0] font-bold text-xs flex items-center justify-center shadow-sm">AM</div>
              <div className="text-left hidden lg:block">
                <div className="text-xs font-bold text-[#5C2D16] leading-tight">Admin Master</div>
                <div className="text-[9px] text-[#8C7A70]">Super Administrator</div>
              </div>
            </button>
          </div>
        </header>

        {/* SINGLE TOAST NOTIFICATION */}
        {toastNotification && (
          <div className="fixed top-14 right-5 z-50 w-full max-w-sm pointer-events-auto transition-all transform animate-fadeIn">
            <div className="bg-white/95 backdrop-blur-md border border-[#E5DDD8] rounded-2xl p-3.5 shadow-2xl text-xs space-y-1.5 border-l-4" style={{ borderLeftColor: toastNotification.type === 'download' ? '#F97316' : '#10B981' }}>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0 font-bold text-xs ${toastNotification.type === 'download' ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                    {toastNotification.type === 'download' ? '📄' : '✨'}
                  </div>
                  <div>
                    <div className="font-bold text-[#2D2825] text-xs leading-tight">{toastNotification.title}</div>
                    <div className="text-[9px] text-[#A08C82]">{toastNotification.time}</div>
                  </div>
                </div>
                <button onClick={() => setToastNotification(null)} className="text-[#A08C82] hover:text-[#2D2825] p-0.5">✕</button>
              </div>
              <p className="text-[#554A43] text-[11px] leading-relaxed pl-8">{toastNotification.message}</p>
              <div className="flex items-center gap-2 pl-8 pt-0.5 text-[11px]">
                <button className="text-[#5C2D16] font-bold hover:underline">{toastNotification.actionPrimary}</button>
                <span className="text-[#8C7A70]">• {toastNotification.actionSecondary}</span>
              </div>
            </div>
          </div>
        )}

        {/* FLOATING NOTIFICATIONS STACK */}
        {showNotificationsStack && (
          <div className="fixed top-14 right-5 z-50 w-full max-w-sm space-y-2.5 pointer-events-auto transition-all transform animate-fadeIn">
            {activeNotifications.length === 0 ? (
              <div className="bg-white border border-[#E5DDD8] rounded-2xl p-3.5 shadow-xl text-center text-xs text-[#8C7A70]">Tidak ada notifikasi aktif.</div>
            ) : (
              activeNotifications.map((notif) => (
                <div key={notif.id} className="bg-white/95 backdrop-blur-md border border-[#E5DDD8] rounded-2xl p-3.5 shadow-xl text-xs space-y-1.5 border-l-4 transition-all hover:shadow-2xl" style={{ borderLeftColor: notif.type === 'success' ? '#10B981' : notif.type === 'download' ? '#F97316' : '#10B981' }}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-white shrink-0 font-bold text-xs ${notif.type === 'success' ? 'bg-emerald-500' : notif.type === 'download' ? 'bg-amber-500' : 'bg-emerald-500'}`}>
                        {notif.type === 'success' && '✓'}
                        {notif.type === 'download' && '📥'}
                        {notif.type === 'ai' && '✨'}
                      </div>
                      <div>
                        <div className="font-bold text-[#2D2825] text-xs leading-tight">{notif.title}</div>
                        <div className="text-[9px] text-[#A08C82]">{notif.time}</div>
                      </div>
                    </div>
                    <button onClick={() => handleDismissNotification(notif.id)} className="text-[#A08C82] hover:text-[#2D2825] p-0.5">✕</button>
                  </div>
                  <p className="text-[#554A43] text-[11px] leading-relaxed pl-8">{notif.message}</p>
                  <div className="flex items-center gap-2 pl-8 text-[11px]">
                    {notif.actionPrimary && <button className="text-[#5C2D16] font-bold hover:underline">{notif.actionPrimary}</button>}
                    {notif.actionSecondary && <span className="text-[#8C7A70]">• {notif.actionSecondary}</span>}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="p-4 space-y-4 max-w-7xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-bold text-[#2D2825]">Dashboard Overview</h1>
                  <span className="px-2 py-0.5 text-[9px] font-semibold bg-emerald-100 text-emerald-800 rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Live Data Sync
                  </span>
                </div>
                <p className="text-[11px] text-[#8C7A70] mt-0.5">Konsolidasi metrik perbankan mikro & pemantauan tren finansial real-time.</p>
              </div>

              <button onClick={handleDownloadPdf} className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-[#5C2D16] hover:bg-[#462211] text-white text-xs font-bold rounded-xl shadow transition-all shrink-0">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                Unduh Laporan PDF
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#8C7A70]">Total Pengguna Aktif</span>
                  <div className="w-8 h-8 rounded-xl bg-[#F8F4F0] flex items-center justify-center text-[#5C2D16]">👤</div>
                </div>
                <div className="text-2xl font-extrabold text-[#2D2825]">1,245</div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#F0E8E4]">
                  <span className="text-emerald-600 font-semibold">▲ +12.5% vs 30 hari lalu</span>
                  <span className="text-[#8C7A70]">Target bulanan: <strong className="text-[#2D2825]">83% tercapai</strong></span>
                </div>
              </div>

              <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#8C7A70]">Total Transaksi Tercatat</span>
                  <div className="w-8 h-8 rounded-xl bg-[#F8F4F0] flex items-center justify-center text-[#5C2D16]">📋</div>
                </div>
                <div className="text-2xl font-extrabold text-[#2D2825]">34,500</div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#F0E8E4]">
                  <span className="text-emerald-600 font-semibold">▲ +8.2% vs 30 hari lalu</span>
                  <span className="text-[#8C7A70]">Success rate: <strong className="text-emerald-600 font-semibold">99.4%</strong></span>
                </div>
              </div>

              <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-medium text-[#8C7A70]">Volume Arus Kas Tercatat</span>
                  <div className="w-8 h-8 rounded-xl bg-[#F8F4F0] flex items-center justify-center text-[#5C2D16]">💳</div>
                </div>
                <div className="text-2xl font-extrabold text-[#2D2825]">{fmtMoney('Rp 4.5 M', '$ 290.3 K')}</div>
                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#F0E8E4]">
                  <span className="text-emerald-600 font-semibold">▲ +15.3% vs 30 hari lalu</span>
                  <span className="text-[#8C7A70]">Surplus bersih: <strong className="text-[#2D2825]">{fmtMoney('Rp 1.4M', '$90K')} (31%)</strong></span>
                </div>
              </div>
            </div>

            {/* Statistik Finansial Agregat */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-sm font-bold text-[#2D2825]">Statistik Finansial Agregat</h2>
                        <span className="px-2 py-0.5 text-[9px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">+15% vs minggu lalu</span>
                      </div>
                      <p className="text-[11px] text-[#8C7A70]">Komparasi kurva arus pemasukan vs pengeluaran seluruh akun pengguna.</p>
                    </div>

                    <div className="flex items-center bg-[#F5F2ED] p-0.5 rounded-xl text-[11px] font-medium text-[#6E5D53]">
                      <button className="px-2 py-0.5 rounded-lg hover:text-[#5C2D16]">Hari Ini</button>
                      <button className="px-2 py-0.5 rounded-lg bg-white text-[#5C2D16] shadow-sm font-bold">7 Hari</button>
                      <button className="px-2 py-0.5 rounded-lg hover:text-[#5C2D16]">30 Hari</button>
                      <button className="px-2 py-0.5 rounded-lg hover:text-[#5C2D16]">Bulan Ini</button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-3">
                    <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EBE3DE]">
                      <div className="text-[11px] text-[#8C7A70]">Total Pemasukan</div>
                      <div className="text-sm font-bold text-[#2D2825] mt-0.5">{fmtMoney('Rp 4.520.000.000', '$ 291.600')}</div>
                    </div>
                    <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EBE3DE]">
                      <div className="text-[11px] text-[#8C7A70]">Total Pengeluaran</div>
                      <div className="text-sm font-bold text-[#2D2825] mt-0.5">{fmtMoney('Rp 3.120.000.000', '$ 201.200')}</div>
                    </div>
                    <div className="bg-[#FAF7F2] p-2.5 rounded-xl border border-[#EBE3DE]">
                      <div className="text-[11px] text-[#8C7A70]">Rata-rata Harian</div>
                      <div className="text-sm font-bold text-emerald-700 mt-0.5">{fmtMoney('Rp 642.800', '$ 41.50')}</div>
                    </div>
                  </div>

                  <div className="relative h-48 w-full pt-2">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160" preserveAspectRatio="none">
                      <line x1="0" y1="25" x2="500" y2="25" stroke="#F0E8E4" strokeDasharray="3 3" />
                      <line x1="0" y1="70" x2="500" y2="70" stroke="#F0E8E4" strokeDasharray="3 3" />
                      <line x1="0" y1="115" x2="500" y2="115" stroke="#F0E8E4" strokeDasharray="3 3" />
                      <line x1="0" y1="150" x2="500" y2="150" stroke="#E5DDD8" />

                      <path d="M 20 110 Q 90 80, 160 90 T 250 35 T 360 70 T 480 80" fill="none" stroke="#5C2D16" strokeWidth="3" strokeLinecap="round" />
                      <path d="M 20 135 Q 90 105, 160 120 T 250 70 T 360 105 T 480 115" fill="none" stroke="#C25E38" strokeWidth="2" strokeDasharray="4 2" strokeLinecap="round" />

                      {chartDays.map((_, idx) => {
                        const cx = 20 + idx * 75;
                        const cyPemasukan = [110, 85, 90, 35, 70, 75, 80][idx];
                        const cyPengeluaran = [135, 110, 120, 70, 105, 110, 115][idx];
                        const isHovered = hoveredDayIndex === idx;

                        return (
                          <g key={idx} onMouseEnter={() => setHoveredDayIndex(idx)} onMouseLeave={() => setHoveredDayIndex(null)} className="cursor-pointer">
                            <rect x={cx - 30} y="0" width="60" height="150" fill="transparent" />
                            {isHovered && <line x1={cx} y1="10" x2={cx} y2="150" stroke="#5C2D16" strokeWidth="1.5" strokeDasharray="3 3" />}
                            {isHovered && <circle cx={cx} cy={cyPemasukan} r="4.5" fill="#5C2D16" stroke="#FFFFFF" strokeWidth="2" />}
                            {isHovered && <circle cx={cx} cy={cyPengeluaran} r="4" fill="#C25E38" stroke="#FFFFFF" strokeWidth="1.5" />}
                          </g>
                        );
                      })}
                    </svg>

                    {hoveredDayIndex !== null && (
                      <div className="absolute z-20 bg-[#2B231F] text-white p-2.5 rounded-xl shadow-2xl pointer-events-none text-[11px] space-y-1 transform -translate-x-1/2" style={{ left: `${(20 + hoveredDayIndex * 75) / 5}%`, top: '10px' }}>
                        <div className="flex items-center justify-between gap-3 font-bold border-b border-white/10 pb-1">
                          <span>{chartDays[hoveredDayIndex].dateText}</span>
                          <span className="text-[9px] text-emerald-400 bg-emerald-950/80 px-1 py-0.5 rounded">{chartDays[hoveredDayIndex].peakBadge}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span>● Masuk:</span>
                          <span className="font-mono font-bold">{chartDays[hoveredDayIndex].pas}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span>● Keluar:</span>
                          <span className="font-mono font-bold">{chartDays[hoveredDayIndex].kel}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#8C7A70] px-2 pt-1">
                    {chartDays.map((d, i) => (
                      <span key={i} className={`px-2 py-0.5 rounded ${hoveredDayIndex === i ? 'bg-[#5C2D16] text-white' : ''}`}>{d.day}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Side Card */}
              <div className="bg-[#FAF4F0] border border-[#E6D4CB] rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-[#5C2D16] text-white flex items-center justify-center font-bold text-xs">✨</div>
                      <div>
                        <h3 className="font-bold text-xs text-[#2D2825]">AI Financial Intelligence</h3>
                        <p className="text-[9px] text-[#8C7A70]">Deteksi Anomali & Rekomendasi</p>
                      </div>
                    </div>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-900 border border-amber-300 rounded uppercase">94% AKURAT</span>
                  </div>

                  <div className="mt-3 bg-white border border-[#E8D6CD] rounded-xl p-2.5 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-rose-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 animate-ping"></span> Lonjakan Anomali Kategori
                      </span>
                    </div>
                    <p className="text-[11px] text-[#554A43]">Terdeteksi lonjakan pengeluaran <strong className="text-[#2D2825]">+41.8%</strong> pada Coffee Shop.</p>
                  </div>
                </div>

                <button onClick={handleExecuteAllAI} className="w-full py-2 bg-[#5C2D16] hover:bg-[#462211] text-white font-bold text-xs rounded-xl shadow transition-all">
                  Terapkan Rekomendasi Terpilih →
                </button>
              </div>
            </div>

            {/* Distribusi Section */}
            <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3">
              <h3 className="font-bold text-sm text-[#2D2825]">Distribusi Kategori Pengeluaran Teratas</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center pt-2">
                <div className="flex items-center justify-center relative">
                  <div className="w-32 h-32 rounded-full border-[12px] border-[#5C2D16] flex items-center justify-center border-t-amber-500 border-r-[#C25E38] border-b-emerald-600 shadow-inner">
                    <div className="text-center">
                      <div className="text-[9px] text-[#8C7A70] uppercase font-bold">Total Belanja</div>
                      <div className="text-sm font-extrabold text-[#2D2825]">{fmtMoney('Rp 3.12 M', '$ 201.2 K')}</div>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <div className="flex justify-between text-xs"><span>Makanan & Minuman (F&B)</span><span className="font-bold">{fmtMoney('Rp 1.185.600.000', '$76.4K')} (38%)</span></div>
                  <div className="w-full h-2 bg-[#F5F2ED] rounded-full overflow-hidden"><div className="h-full bg-[#5C2D16]" style={{ width: '38%' }}></div></div>

                  <div className="flex justify-between text-xs"><span>Belanja & E-Commerce</span><span className="font-bold">{fmtMoney('Rp 748.800.000', '$48.3K')} (24%)</span></div>
                  <div className="w-full h-2 bg-[#F5F2ED] rounded-full overflow-hidden"><div className="h-full bg-[#C25E38]" style={{ width: '24%' }}></div></div>

                  <div className="flex justify-between text-xs"><span>Hiburan & Lifestyle</span><span className="font-bold">{fmtMoney('Rp 624.000.000', '$40.2K')} (20%)</span></div>
                  <div className="w-full h-2 bg-[#F5F2ED] rounded-full overflow-hidden"><div className="h-full bg-amber-500" style={{ width: '20%' }}></div></div>
                </div>
              </div>
            </div>

            {/* Table Aktivitas Pengguna */}
            <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-sm text-[#2D2825]">Aktivitas Pengguna & Mutasi Terkini</h3>
                <button onClick={() => setActiveTab('transactions')} className="text-xs font-bold text-[#5C2D16] hover:underline">Lihat Semua →</button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F4] text-[#8C7A70] uppercase text-[9px] font-bold border-b border-[#E5DDD8]">
                    <tr>
                      <th className="py-2 px-3">ID TRANSAKSI</th>
                      <th className="py-2 px-3">PENGGUNA</th>
                      <th className="py-2 px-3">KATEGORI & METODE</th>
                      <th className="py-2 px-3">NOMINAL</th>
                      <th className="py-2 px-3">STATUS</th>
                      <th className="py-2 px-3">WAKTU</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E8E4]">
                    {overviewTransactions.map((trx) => (
                      <tr key={trx.id} className="hover:bg-[#FAF7F2]">
                        <td className="py-2 px-3 font-mono font-bold text-[#5C2D16]">{trx.id}</td>
                        <td className="py-2 px-3">{trx.user}</td>
                        <td className="py-2 px-3">{trx.cat} ({trx.subcat})</td>
                        <td className={`py-2 px-3 font-bold ${trx.isExpense ? 'text-[#C25E38]' : 'text-emerald-700'}`}>{trx.amount}</td>
                        <td className="py-2 px-3"><span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded-full">✓ {trx.status}</span></td>
                        <td className="py-2 px-3 text-[#8C7A70]">{trx.time}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="p-4 space-y-4 max-w-7xl mx-auto w-full animate-fadeIn">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold text-[#2D2825]">User Management</h1>
              <button className="px-3.5 py-1.5 bg-[#5C2D16] text-white text-xs font-bold rounded-xl shadow">+ Tambah Pengguna Baru</button>
            </div>

            <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F4] text-[#8C7A70] uppercase text-[9px] font-bold border-b border-[#E5DDD8]">
                  <tr>
                    <th className="py-2.5 px-3">NAMA & EMAIL</th>
                    <th className="py-2.5 px-3">ROLE</th>
                    <th className="py-2.5 px-3">TELEPON</th>
                    <th className="py-2.5 px-3">STATUS</th>
   <th className="hidden">
     <select value={userRoleFilter} onChange={e => setUserRoleFilter(e.target.value)} />
     <select value={userStatusFilter} onChange={e => setUserStatusFilter(e.target.value)} />
   </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E8E4]">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-[#FAF7F2]">
                      <td className="py-2.5 px-3"><strong>{u.name}</strong><br/><span className="text-[10px] text-[#8C7A70]">{u.email}</span></td>
                      <td className="py-2.5 px-3">{u.role}</td>
                      <td className="py-2.5 px-3 text-[#8C7A70]">{u.phone}</td>
                      <td className="py-2.5 px-3"><span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded-full">{u.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: TRANSACTIONS */}
        {activeTab === 'transactions' && (
          <div className="p-4 space-y-4 max-w-7xl mx-auto w-full animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[11px] text-[#8C7A70]">Keuangan › <span className="font-semibold text-[#5C2D16]">Pemantauan Transaksi</span></div>
                <h1 className="text-xl font-bold text-[#2D2825]">Pemantauan Transaksi</h1>
              </div>
              <button onClick={handleDownloadPdf} className="px-3 py-1.5 bg-white border border-[#E5DDD8] text-[#5C2D16] text-xs font-bold rounded-xl shadow-sm">Ekspor Data</button>
            </div>

            <div className="bg-white border border-[#E5DDD8] rounded-2xl shadow-sm overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF7F4] text-[#8C7A70] uppercase text-[9px] font-bold border-b border-[#E5DDD8]">
                  <tr>
                    <th className="py-3 px-4">ID & WAKTU</th>
                    <th className="py-3 px-4">PENGGUNA</th>
                    <th className="py-3 px-4">KATEGORI</th>
                    <th className="py-3 px-4">METODE</th>
                    <th className="py-3 px-4">NOMINAL</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F0E8E4]">
                  {filteredFullTrx.map((trx) => (
                    <tr key={trx.id} className="hover:bg-[#FAF7F2]">
                      <td className="py-3 px-4 font-bold text-[#5C2D16]">{trx.id}</td>
                      <td className="py-3 px-4">{trx.user}</td>
                      <td className="py-3 px-4"><span className="px-2 py-0.5 bg-[#FAF4F0] border border-[#E8DCD8] rounded text-[#5C2D16]">{trx.category}</span></td>
                      <td className="py-3 px-4">{trx.isScan ? '📑 Scan Struk' : trx.method}</td>
                      <td className={`py-3 px-4 font-bold ${trx.isExpense ? 'text-[#C25E38]' : 'text-emerald-700'}`}>{trx.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: BUDGET MONITORING (PEMANTAUAN ANGGARAN MAHASISWA - EXACTLY MATCHING FIGMA GAMBAR 1) */}
        {activeTab === 'budgets' && (
          <div className="p-4 space-y-4 max-w-7xl mx-auto w-full animate-fadeIn">
            {/* Breadcrumb & Header */}
            <div>
              <div className="text-[11px] text-[#8C7A70] flex items-center gap-1 mb-0.5">
                <span>Anggaran</span>
                <span>›</span>
                <span className="font-semibold text-[#5C2D16]">Pemantauan Budget Mahasiswa</span>
              </div>
              <h1 className="text-2xl font-bold text-[#2D2825]">Pemantauan Anggaran Mahasiswa</h1>
              <p className="text-xs text-[#8C7A70] mt-0.5">Pantau batas kuota pengeluaran, deteksi mahasiswa over-budget, dan evaluasi kepatuhan finansial bulanan secara presisi.</p>
            </div>

            {/* Top 4 Stat Cards (Gambar 1 Specs) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Card 1 */}
              <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF4F0] text-[#5C2D16] flex items-center justify-center font-bold text-sm">🔄</div>
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded-full">↑ +2.1% bln lalu</span>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">RATA-RATA PEMAKAIAN BUDGET</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-extrabold text-[#2D2825]">68.4%</span>
                    <span className="text-xs text-emerald-700 font-bold">Status Sehat</span>
                  </div>
                </div>
                <div className="w-full h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '68.4%' }}></div>
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-sm">⚠️</div>
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-rose-100 text-rose-800 rounded-full">Kritis</span>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">MAHASISWA OVER-BUDGET</div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl font-extrabold text-[#2D2825]">142</span>
                    <span className="text-xs text-[#8C7A70]">Mahasiswa</span>
                  </div>
                </div>
                <div className="text-[11px] text-amber-700 font-semibold flex items-center gap-1">
                  <span>!</span> Butuh Edukasi Literasi & Konseling
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-[#FAF4F0] text-[#5C2D16] flex items-center justify-center font-bold text-sm">🏛️</div>
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-50 text-amber-900 border border-amber-200 rounded">Aktif Semester Ini</span>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">TOTAL ANGGARAN TERENCANA</div>
                  <div className="text-xl font-extrabold text-[#2D2825] mt-1">{fmtMoney('Rp4.850.000.000', '$ 312.900')}</div>
                </div>
                <div className="text-[10px] text-[#8C7A70]">Tercakup dalam 3.420 rekening dompet mahasiswa</div>
              </div>

              {/* Card 4 */}
              <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold text-sm">🍴</div>
                  <span className="px-2 py-0.5 text-[9px] font-bold bg-rose-100 text-rose-800 rounded-full">Defisit Tertinggi</span>
                </div>
                <div>
                  <div className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">KATEGORI PALING JEBOL</div>
                  <div className="text-base font-extrabold text-[#5C2D16] mt-0.5">Makanan & Kuliner</div>
                </div>
                <div className="text-[10px] text-[#8C7A70]"><strong className="text-rose-700 font-bold">84%</strong> mahasiswa melampaui alokasi pos ini</div>
              </div>
            </div>

            {/* Table Section: Daftar Pemantauan Budget Mahasiswa */}
            <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h2 className="font-bold text-sm text-[#2D2825]">Daftar Pemantauan Budget Mahasiswa</h2>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-[#F5F2ED] border border-[#E5DDD8] text-[#5C2D16] rounded-full">Total: 3.420</span>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={handleDownloadPdf} className="px-3 py-1.5 bg-white border border-[#E5DDD8] text-[#5C2D16] text-xs font-bold rounded-xl shadow-sm hover:bg-[#FAF7F4] flex items-center gap-1">
                    📥 Ekspor Ledger (XLS)
                  </button>
                  <button className="px-3 py-1.5 bg-white border border-[#E5DDD8] text-[#5C2D16] text-xs font-bold rounded-xl shadow-sm hover:bg-[#FAF7F4] flex items-center gap-1">
                    🔄 Segarkan
                  </button>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="relative flex-1 max-w-sm">
                  <input
                    type="text"
                    placeholder="Cari nama mahasiswa atau NIM..."
                    value={budgetSearch}
                    onChange={e => setBudgetSearch(e.target.value)}
                    className="w-full bg-[#F5F2ED] border border-[#E5DDD8] rounded-xl px-3 py-1.5 text-xs text-[#2D2825] focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={budgetSemesterFilter}
                    onChange={e => setBudgetSemesterFilter(e.target.value)}
                    className="bg-[#F5F2ED] border border-[#E5DDD8] rounded-xl px-2.5 py-1.5 text-xs text-[#2D2825] focus:outline-none"
                  >
                    <option value="All">Semua Tingkat Semester</option>
                    <option value="1">Semester 1 - 2</option>
                    <option value="3">Semester 3 - 4</option>
                    <option value="5">Semester 5 - 6</option>
                  </select>

                  <div className="flex items-center bg-[#F5F2ED] p-0.5 rounded-xl text-xs font-medium text-[#6E5D53]">
                    <button onClick={() => setBudgetTabFilter('All')} className={`px-2.5 py-1 rounded-lg transition-all ${budgetTabFilter === 'All' ? 'bg-[#5C2D16] text-white font-bold' : 'hover:text-[#5C2D16]'}`}>Semua (3.420)</button>
                    <button onClick={() => setBudgetTabFilter('Aman')} className={`px-2.5 py-1 rounded-lg transition-all ${budgetTabFilter === 'Aman' ? 'bg-[#5C2D16] text-white font-bold' : 'hover:text-[#5C2D16]'}`}>Aman (&lt;70%)</button>
                    <button onClick={() => setBudgetTabFilter('Waspada')} className={`px-2.5 py-1 rounded-lg transition-all ${budgetTabFilter === 'Waspada' ? 'bg-[#5C2D16] text-white font-bold' : 'hover:text-[#5C2D16]'}`}>Waspada (70-100%)</button>
                    <button onClick={() => setBudgetTabFilter('Overbudget')} className={`px-2.5 py-1 rounded-lg transition-all ${budgetTabFilter === 'Overbudget' ? 'bg-[#5C2D16] text-white font-bold' : 'hover:text-[#5C2D16]'}`}>Overbudget (&gt;100%)</button>
                  </div>
                </div>
              </div>

              {/* Table Data */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F4] text-[#8C7A70] uppercase text-[9px] font-bold tracking-wider border-b border-[#E5DDD8]">
                    <tr>
                      <th className="py-3 px-4">MAHASISWA & NIM</th>
                      <th className="py-3 px-4">BUDGET BULANAN</th>
                      <th className="py-3 px-4">REALISASI PENGELUARAN</th>
                      <th className="py-3 px-4">PERSENTASE & KUOTA</th>
                      <th className="py-3 px-4">KATEGORI KRITIS</th>
                      <th className="py-3 px-4">STATUS</th>
                      <th className="py-3 px-4 text-right">AKSI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E8E4]">
                    {filteredStudentBudgets.map((b) => (
                      <tr key={b.id} className="hover:bg-[#FAF7F2] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-7 h-7 rounded-full font-bold flex items-center justify-center text-xs ${b.color}`}>
                              {b.avatar}
                            </div>
                            <div>
                              <div className="font-bold text-[#2D2825]">{b.name}</div>
                              <div className="text-[10px] text-[#8C7A70]">NIM: {b.nim}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[#2D2825]">{b.budget}</td>
                        <td className={`py-3.5 px-4 font-mono font-bold ${b.isOver ? 'text-[#C25E38]' : 'text-amber-900'}`}>{b.realisasi}</td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2 font-mono">
                            <span className="font-bold text-[#2D2825]">{b.percent}</span>
                            <span className={`text-[10px] ${b.isOver ? 'text-rose-700 font-bold' : 'text-[#8C7A70]'}`}>({b.quotaText})</span>
                          </div>
                          <div className="w-28 h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden mt-1">
                            <div className={`h-full rounded-full ${b.isOver ? 'bg-rose-600' : (b.statusType === 'waspada' ? 'bg-amber-600' : 'bg-emerald-600')}`} style={{ width: Math.min(parseFloat(b.percent), 100) + '%' }}></div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2.5 py-1 text-[11px] font-medium bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] rounded-lg flex items-center gap-1.5 w-max">
                            🍴 {b.catKritis}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full border flex items-center gap-1 w-max ${
                            b.statusType === 'over' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                            b.statusType === 'waspada' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                            'bg-emerald-100 text-emerald-800 border-emerald-300'
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full fill-current"></span>
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          <button className="text-[#5C2D16] hover:text-[#462211] p-1 font-bold text-sm">▶️</button>
                          <button className="text-[#8C7A70] hover:text-[#2D2825] p-1 font-bold text-sm">👁️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table Footer */}
              <div className="pt-2 border-t border-[#E5DDD8] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#8C7A70]">
                <div className="flex items-center gap-3">
                  <span>Menampilkan 1 – 5 dari 3.420 Mahasiswa</span>
                  <span>• Baris per halaman: <strong className="text-[#2D2825]">10</strong></span>
                </div>
                <div className="flex items-center gap-1 font-medium">
                  <button className="w-6 h-6 rounded border border-[#E5DDD8] bg-white flex items-center justify-center">&lt;</button>
                  <button className="w-6 h-6 rounded bg-[#5C2D16] text-white font-bold flex items-center justify-center">1</button>
                  <button className="w-6 h-6 rounded border border-[#E5DDD8] bg-white flex items-center justify-center">2</button>
                  <button className="w-6 h-6 rounded border border-[#E5DDD8] bg-white flex items-center justify-center">3</button>
                  <span className="px-0.5">...</span>
                  <button className="px-1.5 py-0.5 rounded border border-[#E5DDD8] bg-white">684</button>
                  <button className="w-6 h-6 rounded border border-[#E5DDD8] bg-white flex items-center justify-center">&gt;</button>
                </div>
              </div>
            </div>

            {/* Bottom Kampus Policy Banner (Gambar 1) */}
            <div className="bg-[#FAF4F0] border border-[#E6D4CB] rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#5C2D16] text-white flex items-center justify-center text-lg shrink-0">
                  🎓
                </div>
                <div>
                  <h3 className="font-bold text-xs text-[#2D2825]">Kebijakan Finansial Kampus MoneyMate</h3>
                  <p className="text-[11px] text-[#554A43] leading-relaxed mt-0.5">
                    Mahasiswa dengan rasio pengeluaran &gt;110% selama 2 bulan berturut-turut akan secara otomatis dialokasikan modul micro-learning "Smart Budgeting Mahasiswa" di portal akademik.
                  </p>
                </div>
              </div>
              <button className="text-xs font-bold text-[#5C2D16] hover:underline shrink-0 flex items-center gap-1">
                Lihat Pedoman Lengkap →
              </button>
            </div>
          </div>
        )}

        {/* TAB 5: AI FINANCIAL INSIGHT (MATCHING GAMBAR 2 EXPLICITLY) */}
        {activeTab === 'ai' && (
          <div className="p-4 space-y-4 max-w-7xl mx-auto w-full animate-fadeIn">
            {/* Header Title Bar */}
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

              <button onClick={handleDownloadPdf} className="px-3.5 py-1.5 bg-[#5C2D16] text-white text-xs font-bold rounded-xl shadow shrink-0">
                Unduh Insight PDF
              </button>
            </div>

            {aiExecuted && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-xl text-xs font-semibold flex items-center justify-between">
                <span>✓ Semua rekomendasi AI telah berhasil dieksekusi dan notifikasi push terkirim!</span>
                <span className="text-[9px] bg-emerald-200 px-2 py-0.5 rounded font-bold">14/14 Sukses</span>
              </div>
            )}

            {/* Top 3 Predictive Metric Cards (Gambar 2) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1 */}
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

              {/* Card 2 */}
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
                  Status: <strong className="text-amber-700 font-bold">Sedang (Kuning)</strong>. Ada penurunan kedisiplinan pencatatan transaksi mikro sebesar -8.4% minggu ini.
                </p>
              </div>

              {/* Card 3 */}
              <div className="bg-[#FAF4F0] border border-[#E6D4CB] rounded-2xl p-4 shadow-sm space-y-2.5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#5C2D16]">Kesimpulan & Intervensi AI</span>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-white text-[#5C2D16] border border-[#E6D4CB] rounded">94% Confidence</span>
                  </div>
                  <p className="text-[11px] text-[#554A43] leading-relaxed">
                    Fokuskan intervensi langsung pada kategori <strong>"Hiburan"</strong> dan <strong>"Makanan & Kopi"</strong>. Dua kategori ini menyumbang <strong>74%</strong> dari total defisit overbudget mahasiswa bulan ini.
                  </p>
                </div>
                <div className="text-[10px] pt-1.5 border-t border-[#E6D4CB] text-[#8C7A70]">
                  Rekomendasi tindakan: <strong className="text-[#5C2D16]">2 Campaign Siap Kirim</strong>
                </div>
              </div>
            </div>

            {/* Bottom 2 Columns Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Column: Log Anomali Terdeteksi */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-sm text-[#2D2825] flex items-center gap-1.5">
                    📈 Log Anomali Terdeteksi
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-semibold bg-white border border-[#E5DDD8] text-[#5C2D16] rounded-lg">2 Anomali Signifikan</span>
                </div>

                <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-2 py-0.5 font-bold bg-amber-50 text-amber-900 border border-amber-200 rounded uppercase">KATEGORI: MAKANAN & HIBURAN</span>
                    <span className="text-[#8C7A70]">2 jam yang lalu</span>
                  </div>
                  <h3 className="font-bold text-xs text-[#2D2825]">Lonjakan +41.8% pada sub-kategori "Coffee Shop & Nongkrong"</h3>
                  <p className="text-[11px] text-[#554A43] leading-relaxed">Terdeteksi pada cohort usia mahasiswa (18-22 tahun) pasca periode UTS selesai.</p>
                </div>

                <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="px-2 py-0.5 font-bold bg-emerald-50 text-emerald-900 border border-emerald-200 rounded uppercase">KATEGORI: TRANSPORTASI</span>
                    <span className="text-[#8C7A70]">1 hari yang lalu</span>
                  </div>
                  <h3 className="font-bold text-xs text-[#2D2825]">Penurunan -15% pengeluaran Ojek Online</h3>
                  <p className="text-[11px] text-[#554A43] leading-relaxed">Korelasi positif dengan minggu libur tenang pergantian semester.</p>
                </div>
              </div>

              {/* Right Column: Rekomendasi Aksi */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-sm text-[#2D2825] flex items-center gap-1.5">
                    🚀 Rekomendasi Aksi (Auto-Campaign)
                  </h2>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded-lg">Siap Eksekusi</span>
                </div>

                <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2">
                  <h3 className="font-bold text-xs text-[#2D2825]">Kirim Notifikasi Smart Budget Limit</h3>
                  <p className="text-[11px] text-[#554A43]">Dorong target tabungan darurat & tips penghematan harian santai.</p>
                </div>

                <button
                  onClick={handleExecuteAllAI}
                  className="w-full py-3 bg-[#5C2D16] hover:bg-[#462211] text-white font-bold text-xs rounded-2xl shadow transition-all mt-2"
                >
                  Jalankan Semua Rekomendasi AI Terpilih →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: ANALYTICS & STATISTIK (STATISTIK & TREN FINANSIAL MAHASISWA - EXACTLY MATCHING FIGMA GAMBAR 3) */}
        {activeTab === 'analytics' && (
          <div className="p-4 space-y-4 max-w-7xl mx-auto w-full animate-fadeIn">
            {/* Header Title Bar & Breadcrumb */}
            <div>
              <div className="text-[11px] text-[#8C7A70] flex items-center gap-1 mb-0.5">
                <span>Analisis</span>
                <span>›</span>
                <span className="font-semibold text-[#5C2D16]">Statistik Finansial Mahasiswa</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#E6D0C7] text-[#5C2D16] rounded uppercase">
                    📄 LAPORAN ANALISIS MAKRO FINANSIAL
                  </span>
                  <h1 className="text-2xl font-bold text-[#2D2825] mt-1">Statistik & Tren Finansial Mahasiswa</h1>
                  <p className="text-xs text-[#8C7A70] mt-0.5 max-w-2xl">
                    Eksplorasi tren arus kas masuk, proporsi pengeluaran per kategori mahasiswa, dan tren tabungan per semester untuk perumusan program literasi kampus.
                  </p>
                </div>

                <div className="px-3 py-1.5 bg-white border border-[#E5DDD8] rounded-xl text-xs font-semibold text-[#5C2D16] shadow-sm shrink-0 flex items-center gap-1.5">
                  📅 Bulan Ini: Oktober 2026
                </div>
              </div>
            </div>

            {/* Top 4 Summary Cards (Gambar 3 Specs) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Card 1 */}
              <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#8C7A70] uppercase">TOTAL PERPUTARAN UANG</span>
                    <span className="w-7 h-7 rounded-xl bg-[#FAF4F0] text-[#5C2D16] flex items-center justify-center font-bold text-xs">🔄</span>
                  </div>
                  <div className="text-xl font-extrabold text-[#2D2825] mt-1">{fmtMoney('Rp 5.090.000.000', '$ 328.380')}</div>
                  <p className="text-[10px] text-[#8C7A70] mt-0.5">Arus kas gabungan di dompet mahasiswa</p>
                </div>
                <div className="pt-2 border-t border-[#F0E8E4] text-[10px] font-bold text-emerald-700 flex items-center gap-1">
                  <span className="bg-emerald-100 px-1.5 py-0.5 rounded">↑ +12% MoM</span> vs Rp 4.5M bln lalu
                </div>
              </div>

              {/* Card 2 */}
              <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#8C7A70] uppercase">RASIO TABUNGAN RATA-RATA</span>
                    <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">📈</span>
                  </div>
                  <div className="text-xl font-extrabold text-[#2D2825] mt-1">18.2% <span className="text-xs font-normal text-[#8C7A70]">/uang saku</span></div>
                  <p className="text-[10px] text-[#8C7A70] mt-0.5">Standar ideal kampus: minimal 15.0%</p>
                </div>
                <div className="pt-2 border-t border-[#F0E8E4] flex items-center justify-between text-[10px]">
                  <div className="w-24 h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                  <span className="font-bold text-emerald-700">Tercapai</span>
                </div>
              </div>

              {/* Card 3 */}
              <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#8C7A70] uppercase">MEDIAN PENGELUARAN HARIAN</span>
                    <span className="w-7 h-7 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold text-xs">☕</span>
                  </div>
                  <div className="text-xl font-extrabold text-[#2D2825] mt-1">{fmtMoney('Rp 42.500', '$ 2.74')} <span className="text-xs font-normal text-[#8C7A70]">/hari</span></div>
                  <p className="text-[10px] text-[#8C7A70] mt-0.5">Kebutuhan makan, fotokopi, & bensin</p>
                </div>
                <div className="pt-2 border-t border-[#F0E8E4] text-[10px] text-[#8C7A70]">
                  Batas aman rekomendasi: <strong className="text-[#5C2D16]">Rp 45.000</strong>
                </div>
              </div>

              {/* Card 4 */}
              <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#8C7A70] uppercase">SKOR KESEHATAN FINANSIAL</span>
                    <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">🛡️</span>
                  </div>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-xl font-extrabold text-[#2D2825]">74</span>
                    <span className="text-xs font-semibold text-[#8C7A70]">/100</span>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded">Cukup Sehat</span>
                  </div>
                  <p className="text-[10px] text-[#8C7A70] mt-0.5">Evaluasi kedisiplinan & dana darurat</p>
                </div>
                <div className="pt-2 border-t border-[#F0E8E4] text-[10px] font-bold text-emerald-700">
                  ↑ +4.1 pts sejak awal semester
                </div>
              </div>
            </div>

            {/* Middle Section: Tren Pemasukan vs Pengeluaran & Proporsi Pengeluaran (Gambar 3 Specs) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Tren Pemasukan vs Pengeluaran (2 cols) */}
              <div className="lg:col-span-2 bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h2 className="text-sm font-bold text-[#2D2825]">Tren Pemasukan vs Pengeluaran</h2>
                      <p className="text-[10px] text-[#8C7A70]">Data tren agregat perputaran kas bulanan (Mei 2026 – Oktober 2026)</p>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] font-medium">
                      <span className="flex items-center gap-1.5 text-[#5C2D16] font-bold">
                        <span className="w-2 h-2 rounded-full bg-[#5C2D16]"></span> Pemasukan (Kiriman & Freelance)
                      </span>
                      <span className="flex items-center gap-1.5 text-[#C25E38] font-bold">
                        <span className="w-2 h-2 rounded-full bg-[#C25E38]"></span> Pengeluaran (Kos, Makan & Kuliah)
                      </span>
                    </div>
                  </div>

                  {/* Line Chart Visual */}
                  <div className="relative h-44 w-full pt-3">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 500 140" preserveAspectRatio="none">
                      <line x1="0" y1="20" x2="500" y2="20" stroke="#F0E8E4" strokeDasharray="3 3" />
                      <line x1="0" y1="60" x2="500" y2="60" stroke="#F0E8E4" strokeDasharray="3 3" />
                      <line x1="0" y1="100" x2="500" y2="100" stroke="#F0E8E4" strokeDasharray="3 3" />
                      <line x1="0" y1="130" x2="500" y2="130" stroke="#E5DDD8" />

                      {/* Line Pemasukan */}
                      <path d="M 30 90 L 110 80 L 190 60 L 270 45 L 350 40 L 450 35" fill="none" stroke="#5C2D16" strokeWidth="3" />
                      <circle cx="450" cy="35" r="4" fill="#5C2D16" />

                      {/* Line Pengeluaran */}
                      <path d="M 30 115 L 110 100 L 190 85 L 270 70 L 350 65 L 450 60" fill="none" stroke="#C25E38" strokeWidth="2.5" strokeDasharray="4 2" />
                      <circle cx="450" cy="60" r="4" fill="#C25E38" />
                    </svg>

                    <div className="flex items-center justify-between text-[10px] font-semibold text-[#8C7A70] px-4 pt-1">
                      <span>Mei</span>
                      <span>Jun</span>
                      <span>Jul</span>
                      <span>Agu</span>
                      <span>Sep</span>
                      <span className="font-bold text-[#5C2D16]">Okt 2026</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FAF4F0] border border-[#E6D4CB] rounded-xl p-2.5 text-[11px] flex items-center justify-between">
                  <span className="text-[#554A43] flex items-center gap-1.5">
                    <span className="font-bold text-[#5C2D16]">⚡ Pola Siklus:</span> Pengeluaran memuncak di W1 (bayar kos/UKT) & W4 (persiapan akhir bulan).
                  </span>
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Surplus Kas: +Rp 842 Jt</span>
                </div>
              </div>

              {/* Proporsi Pengeluaran (Right col) */}
              <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <h2 className="text-sm font-bold text-[#2D2825]">Proporsi Pengeluaran</h2>
                      <p className="text-[10px] text-[#8C7A70]">Berdasarkan total Rp 1.840.000.000 (Okt 2026)</p>
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] rounded">6 Kategori Utama</span>
                  </div>

                  {/* Donut Chart Visual & List */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-2">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-28 h-28 rounded-full border-[10px] border-[#5C2D16] flex items-center justify-center border-t-amber-500 border-r-[#C25E38] border-b-emerald-600 shadow-inner">
                        <div className="text-center">
                          <div className="text-[8px] text-[#8C7A70] uppercase font-bold">ALOKASI</div>
                          <div className="text-xs font-extrabold text-[#2D2825]">100%</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-[10px]">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#5C2D16]"></span> Makanan & Minuman</span>
                        <strong className="font-mono">38%</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#C25E38]"></span> Tempat Tinggal & Kos</span>
                        <strong className="font-mono">24%</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Akademik & Kuliah</span>
                        <strong className="font-mono">15%</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-600"></span> Transportasi Kampus</span>
                        <strong className="font-mono">9%</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-700"></span> Nongkrong & Hiburan</span>
                        <strong className="font-mono">8%</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-[#F0E8E4] flex items-center justify-between text-[11px]">
                  <span className="text-[#8C7A70]">Pengeluaran Dominan: <strong className="text-[#5C2D16]">Makanan & Kos (62%)</strong></span>
                  <button className="font-bold text-[#5C2D16] hover:underline">Lihat Sub-Kategori Terperinci →</button>
                </div>
              </div>
            </div>

            {/* AI Financial Insights & Pola Perilaku Section (Gambar 3 Specs) */}
            <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">🧠</span>
                  <div>
                    <h2 className="font-bold text-sm text-[#2D2825]">AI Financial Insights & Pola Perilaku</h2>
                    <p className="text-[10px] text-[#8C7A70]">Dihasilkan otomatis dari pemodelan transaksi mahasiswa</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 text-[9px] font-bold bg-[#E6D0C7] text-[#5C2D16] rounded uppercase">MoneyMate AI Core</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {/* Card 1 */}
                <div className="bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="px-2 py-0.5 font-bold bg-amber-100 text-amber-900 rounded">Pola Kritis Kampus</span>
                      <span className="font-bold text-[#5C2D16]">62% Mahasiswa</span>
                    </div>
                    <h3 className="font-bold text-xs text-[#2D2825]">Pola Tanggal Kritis Finansial (Tgl 23 – 28)</h3>
                    <p className="text-[11px] text-[#554A43] leading-relaxed mt-1">
                      Sebanyak 62% mahasiswa mengalami penurunan saldo rekening/dompet hingga di bawah Rp 50.000 pada tanggal 23 hingga 28 setiap bulannya menjelang transfer uang saku baru.
                    </p>
                    <div className="bg-white p-2 rounded-lg border border-[#E5DDD8] text-[10px] text-[#8C7A70] mt-2">
                      <strong className="text-[#5C2D16]">Rekomendasi AI:</strong> Luncurkan fitur "Smart Envelope Lockdown" otomatis di H-10 akhir bulan untuk membatasi belanja non-pokok.
                    </div>
                  </div>
                  <div className="pt-2 text-[10px] text-[#8C7A70] flex items-center justify-between">
                    <span>Dampak Finansial:</span>
                    <strong className="text-rose-700">Defisit tinggi</strong>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="px-2 py-0.5 font-bold bg-emerald-100 text-emerald-900 rounded">Adopsi Fitur Pintar</span>
                      <span className="font-bold text-emerald-700">+45% Maba</span>
                    </div>
                    <h3 className="font-bold text-xs text-[#2D2825]">Lonjakan Metode Pencatatan Scan Struk AI</h3>
                    <p className="text-[11px] text-[#554A43] leading-relaxed mt-1">
                      Metode pencatatan pengeluaran berbasis Scan Struk Otomatis (OCR) melonjak 45% adopsinya di kalangan mahasiswa baru (Semester 1). Mengurangi tingkat lupa mencatat pengeluaran kantin dan perlengkapan ospek.
                    </p>
                    <div className="bg-white p-2 rounded-lg border border-[#E5DDD8] text-[10px] text-[#8C7A70] mt-2">
                      <strong className="text-emerald-700">Korelasi Positif:</strong> Mahasiswa yang scan struk memiliki akurasi estimasi sisa uang bulanan 3x lebih tepat.
                    </div>
                  </div>
                  <div className="pt-2 text-[10px] text-[#8C7A70] flex items-center justify-between">
                    <span>Tingkat Retensi Pengguna:</span>
                    <strong className="text-emerald-700">🟢 88.4% Aktif</strong>
                  </div>
                </div>

                {/* Card 3 */}
                <div className="bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl p-3.5 space-y-2 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="px-2 py-0.5 font-bold bg-amber-100 text-amber-900 rounded">Riset Demografi</span>
                      <span className="font-bold text-[#5C2D16]">32% Proporsi</span>
                    </div>
                    <h3 className="font-bold text-xs text-[#2D2825]">Korelasi Pengeluaran Kos Mahasiswa Rantau</h3>
                    <p className="text-[11px] text-[#554A43] leading-relaxed mt-1">
                      Mahasiswa perantau rata-rata menyisihkan 32% dari total uang saku bulanannya khusus untuk biaya sewa kos dan iuran listrik/air, jauh lebih tinggi dari mahasiswa non-rantau (6% transportasi rumah).
                    </p>
                    <div className="bg-white p-2 rounded-lg border border-[#E5DDD8] text-[10px] text-[#8C7A70] mt-2">
                      <strong className="text-[#5C2D16]">Program Solusi:</strong> Integrasi pengingat tagihan kos bersama bapak/ibu kos via sistem notifikasi WhatsApp MoneyMate.
                    </div>
                  </div>
                  <div className="pt-2 text-[10px] text-[#8C7A70] flex items-center justify-between">
                    <span>Populasi Terdampak:</span>
                    <strong className="text-[#2D2825]">9.190 Mahasiswa Rantau</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Matriks Perilaku Finansial Berdasarkan Angkatan & Semester Table (Gambar 3 Specs) */}
            <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="font-bold text-sm text-[#2D2825]">Matriks Perilaku Finansial Berdasarkan Angkatan & Semester</h2>
                  <p className="text-[10px] text-[#8C7A70]">Komparasi tingkat literasi keuangan, rerata uang saku, dan risiko defisit per tingkat studi.</p>
                </div>

                <div className="flex items-center gap-2">
                  <button className="px-3 py-1.5 bg-[#F5F2ED] border border-[#E5DDD8] text-[#5C2D16] text-xs font-bold rounded-xl flex items-center gap-1">
                    Urutkan: Defisit Tertinggi ∨
                  </button>
                  <button className="px-2.5 py-1.5 bg-[#F5F2ED] border border-[#E5DDD8] text-[#5C2D16] text-xs font-bold rounded-xl">
                    🖨️
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF7F4] text-[#8C7A70] uppercase text-[9px] font-bold tracking-wider border-b border-[#E5DDD8]">
                    <tr>
                      <th className="py-2.5 px-3">KELOMPOK ANGKATAN & TINGKAT</th>
                      <th className="py-2.5 px-3">TOTAL MAHASISWA</th>
                      <th className="py-2.5 px-3">RERATA UANG SAKU</th>
                      <th className="py-2.5 px-3">ALOKASI TABUNGAN</th>
                      <th className="py-2.5 px-3">INDEKS LITERASI (1-100)</th>
                      <th className="py-2.5 px-3">TINGKAT RISIKO DEFISIT</th>
                      <th className="py-2.5 px-3 text-right">STATUS EVALUASI</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E8E4]">
                    <tr className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-amber-100 text-amber-900 font-bold text-[10px] flex items-center justify-center shrink-0">T1</span>
                          <div>
                            <div className="font-bold text-[#2D2825]">Angkatan 2026 (Semester 1 - 2)</div>
                            <div className="text-[9px] text-[#8C7A70]">Mahasiswa Baru - Transisi Kemandirian</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#2D2825]">4.210 mhs</td>
                      <td className="py-3 px-3 font-mono font-bold text-[#5C2D16]">Rp 2.100.000 /bln</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold font-mono">11.4%</span>
                          <div className="w-16 h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden">
                            <div className="h-full bg-amber-600 rounded-full" style={{ width: '11.4%' }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-bold text-[#2D2825]">61 / 100</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-rose-100 text-rose-800 rounded-full">36.5% (Tinggi)</span>
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-amber-700">
                        ❗️ Perlu Mentoring Budget
                      </td>
                    </tr>

                    <tr className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-stone-200 text-stone-900 font-bold text-[10px] flex items-center justify-center shrink-0">T2</span>
                          <div>
                            <div className="font-bold text-[#2D2825]">Angkatan 2025 (Semester 3 - 4)</div>
                            <div className="text-[9px] text-[#8C7A70]">Tahun Kedua - Organisasi & Proyek</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#2D2825]">3.850 mhs</td>
                      <td className="py-3 px-3 font-mono font-bold text-[#5C2D16]">Rp 2.350.000 /bln</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold font-mono">17.8%</span>
                          <div className="w-16 h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden">
                            <div className="h-full bg-amber-600 rounded-full" style={{ width: '17.8%' }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-bold text-[#2D2825]">73 / 100</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-900 rounded-full">19.2% (Moderat)</span>
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-emerald-700">
                        🟢 Stabil
                      </td>
                    </tr>

                    <tr className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-900 font-bold text-[10px] flex items-center justify-center shrink-0">T3</span>
                          <div>
                            <div className="font-bold text-[#2D2825]">Angkatan 2024 (Semester 5 - 6)</div>
                            <div className="text-[9px] text-[#8C7A70]">Magang Industri (MBKM) & Part-time</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#2D2825]">3.620 mhs</td>
                      <td className="py-3 px-3 font-mono font-bold text-[#5C2D16]">Rp 3.150.000 /bln</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold font-mono">23.5%</span>
                          <div className="w-16 h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-600 rounded-full" style={{ width: '23.5%' }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-bold text-[#2D2825]">82 / 100</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded-full">8.4% (Rendah)</span>
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-emerald-700">
                        🟢 Mandiri Finansial
                      </td>
                    </tr>

                    <tr className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-stone-200 text-stone-900 font-bold text-[10px] flex items-center justify-center shrink-0">T4</span>
                          <div>
                            <div className="font-bold text-[#2D2825]">Angkatan 2023 (Semester 7 - 8+)</div>
                            <div className="text-[9px] text-[#8C7A70]">Penyusunan Skripsi & Persiapan Karir</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-[#2D2825]">3.140 mhs</td>
                      <td className="py-3 px-3 font-mono font-bold text-[#5C2D16]">Rp 2.800.000 /bln</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold font-mono">20.1%</span>
                          <div className="w-16 h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-600 rounded-full" style={{ width: '20.1%' }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-bold text-[#2D2825]">80 / 100</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-900 rounded-full">12.1% (Terkendali)</span>
                      </td>
                      <td className="py-3 px-3 text-right font-semibold text-[#5C2D16]">
                        🎓 Dana Kelulusan Siap
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="pt-2 border-t border-[#E5DDD8] flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-[#8C7A70]">
                <span>● Validitas data terverifikasi via sinkronisasi rekening bank kampus & e-wallet mahasiswa</span>
                <div className="flex items-center gap-3 font-semibold">
                  <button className="text-[#5C2D16] hover:underline">Download CSV</button>
                  <span>•</span>
                  <button className="text-[#5C2D16] hover:underline">Lihat Log Audit AI</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: PROFIL ADMIN */}
        {activeTab === 'profile' && (
          <div className="p-4 space-y-4 max-w-5xl mx-auto w-full animate-fadeIn">
            <div>
              <div className="text-[11px] text-[#8C7A70] flex items-center gap-1 mb-0.5">
                <span>Dashboard</span>
                <span>›</span>
                <span className="font-semibold text-[#5C2D16]">Profil Admin</span>
              </div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl font-bold text-[#2D2825]">Profil Admin</h1>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-[#E6D0C7] text-[#5C2D16] rounded uppercase">ADMINISTRATOR</span>
              </div>
              <p className="text-[11px] text-[#8C7A70] mt-0.5">Kelola informasi akun dan pengaturan profil administrator.</p>
            </div>

            {profileSavedMsg && (
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
                <span>✓</span> Perubahan profil administrator berhasil disimpan.
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white border border-[#E5DDD8] rounded-2xl p-5 shadow-sm text-center flex flex-col items-center justify-between space-y-5">
                <div className="flex flex-col items-center space-y-2.5 w-full">
                  <div className="relative">
                    <div className="w-20 h-20 rounded-2xl bg-[#5C2D16] text-[#F7F5F0] font-extrabold text-2xl flex items-center justify-center shadow-md">AD</div>
                    <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white text-white flex items-center justify-center text-[10px] font-bold">✓</span>
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-[#2D2825]">Admin</h2>
                    <p className="text-[11px] font-semibold text-[#5C2D16]">Administrator Sistem MoneyMate</p>
                    <p className="text-[11px] text-[#8C7A70] mt-0.5">{profileEmail}</p>
                  </div>

                  <div className="w-full bg-[#FAF4F0] border border-[#E6D4CB] rounded-xl p-2.5 text-xs space-y-0.5">
                    <div className="flex items-center justify-center gap-1.5 font-semibold text-[#5C2D16]">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      Sesi Aktif
                      <span className="px-1.5 py-0.5 text-[9px] bg-emerald-100 text-emerald-800 rounded font-bold">Online</span>
                    </div>
                    <div className="text-[10px] text-[#8C7A70]">IP Kampus 10.20.14.88</div>
                  </div>
                </div>

                <button onClick={onLogout} className="w-full py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/></svg>
                  Logout
                </button>
              </div>

              <div className="md:col-span-2 space-y-4">
                <form onSubmit={handleSaveProfile} className="bg-white border border-[#E5DDD8] rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 border-b border-[#F0E8E4] pb-2.5">
                    <span className="text-base">👤</span>
                    <h3 className="font-bold text-sm text-[#2D2825]">Informasi Akun</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#6E5D53] mb-1">Nama</label>
                      <input type="text" value={profileName} onChange={e => setProfileName(e.target.value)} className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-1.5 text-xs font-medium text-[#2D2825] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#6E5D53] mb-1">ID Admin</label>
                      <input type="text" value={adminId} disabled className="w-full bg-[#FAF4F0] border border-[#E6D4CB] rounded-xl px-3 py-1.5 text-xs font-bold text-[#5C2D16] cursor-not-allowed" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#6E5D53] mb-1">Email</label>
                      <input type="email" value={profileEmail} onChange={e => setProfileEmail(e.target.value)} className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-1.5 text-xs font-medium text-[#2D2825] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#6E5D53] mb-1">Peran / Hak Akses</label>
                      <input type="text" value={adminRole} disabled className="w-full bg-[#FAF4F0] border border-[#E6D4CB] rounded-xl px-3 py-1.5 text-xs font-bold text-[#5C2D16] cursor-not-allowed" />
                    </div>
                  </div>
                </form>

                <form onSubmit={handleSaveProfile} className="bg-white border border-[#E5DDD8] rounded-2xl p-5 shadow-sm space-y-3">
                  <div className="flex items-center gap-2 border-b border-[#F0E8E4] pb-2.5">
                    <span className="text-base">🔒</span>
                    <h3 className="font-bold text-sm text-[#2D2825]">Ubah Kata Sandi</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#6E5D53] mb-1">Kata Sandi Baru</label>
                      <input type="password" placeholder="Masukkan kata sandi baru" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-1.5 text-xs font-medium text-[#2D2825] focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#6E5D53] mb-1">Konfirmasi Kata Sandi</label>
                      <input type="password" placeholder="Ulangi kata sandi baru" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-1.5 text-xs font-medium text-[#2D2825] focus:outline-none" />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button type="submit" className="px-4 py-2 bg-[#5C2D16] hover:bg-[#462211] text-white font-bold text-xs rounded-xl shadow transition-all">Simpan Perubahan</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* OTHER PLACEHOLDER VIEWS */}
        {(activeTab === 'reports' || activeTab === 'settings') && (
          <div className="p-4 max-w-7xl mx-auto w-full animate-fadeIn space-y-4">
            <div className="bg-white border border-[#E5DDD8] rounded-2xl p-6 shadow-sm text-center space-y-2">
              <h2 className="text-base font-bold text-[#2D2825] capitalize">Fitur {activeTab}</h2>
              <p className="text-xs text-[#8C7A70]">Integrated admin panel module.</p>
              <button onClick={() => setActiveTab('overview')} className="px-3 py-1.5 bg-[#5C2D16] text-white text-xs font-bold rounded-xl shadow">Kembali ke Overview</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
