import React, { useState } from 'react';
import { OverviewPage } from './OverviewPage';
import { UserManagementPage } from './UserManagementPage';
import { TransactionsPage } from './TransactionsPage';
import { BudgetsPage } from './BudgetsPage';
import { AiInsightPage } from './AiInsightPage';
import { AnalyticsPage } from './AnalyticsPage';
import { ReportsPage } from './ReportsPage';
import { ProfilePage } from './ProfilePage';

interface DashboardProps {
  userEmail?: string;
  onLogout?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userEmail = 'KeisyaExaHaniyah@gmail.com', onLogout }) => {
  const [activeTab, setActiveTab] = useState<string>('reports');
  const [currency, setCurrency] = useState<'IDR' | 'USD'>('IDR');
  
  // Notification and Toast States
  const [pdfToast, setPdfToast] = useState(false);
  const [pdfToastMessage, setPdfToastMessage] = useState('Memproses Unduh PDF Laporan...');
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(3);

  const notificationsList = [
    { id: 1, title: '📄 Laporan PDF Berhasil Diunduh', time: '1 menit yang lalu', isRead: false, type: 'pdf' },
    { id: 2, title: '⚠️ Defisit Anggaran: Keisya Lanika', time: '15 menit yang lalu', isRead: false, type: 'alert' },
    { id: 3, title: '👤 Pengguna Baru Terdaftar: Bima Santoso', time: '1 jam yang lalu', isRead: false, type: 'user' },
    { id: 4, title: '⚙️ Pembaruan Sistem MoneyMate v2.4', time: '3 jam yang lalu', isRead: true, type: 'system' }
  ];

  const handleDownloadPdf = () => {
    setPdfToastMessage('Memproses Unduh PDF Laporan...');
    setPdfToast(true);
    setTimeout(() => {
      setPdfToastMessage('✅ Laporan PDF Berhasil Diunduh!');
      setUnreadNotifCount(prev => prev + 1);
    }, 1500);
    setTimeout(() => {
      setPdfToast(false);
    }, 4500);
  };

  const fmtMoney = (idr: string, usd: string) => {
    return currency === 'USD' ? usd : idr;
  };

  return (
    <div className="flex h-screen bg-[#F7F5F0] text-[#2D2825] font-sans overflow-hidden">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-[#FAF7F4] border-r border-[#E5DDD8] flex flex-col justify-between p-4 shrink-0 shadow-sm">
        <div className="space-y-6">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-xl bg-[#5C2D16] text-[#F7F5F0] font-black text-xl flex items-center justify-center shadow-md">
              M
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-[#5C2D16]">MoneyMate</div>
              <div className="text-[10px] text-[#8C7A70] font-medium uppercase tracking-wider">Admin Portal</div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ' + (
                activeTab === 'overview'
                  ? 'bg-[#5C2D16] text-white shadow-md'
                  : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
              )}
            >
              <span className="text-base">📊</span> Overview
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ' + (
                activeTab === 'users'
                  ? 'bg-[#5C2D16] text-white shadow-md'
                  : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
              )}
            >
              <span className="text-base">👥</span> User Management
            </button>

            <button
              onClick={() => setActiveTab('transactions')}
              className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ' + (
                activeTab === 'transactions'
                  ? 'bg-[#5C2D16] text-white shadow-md'
                  : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
              )}
            >
              <span className="text-base">💳</span> Transactions
            </button>

            <button
              onClick={() => setActiveTab('budgets')}
              className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ' + (
                activeTab === 'budgets'
                  ? 'bg-[#5C2D16] text-white shadow-md'
                  : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
              )}
            >
              <span className="text-base">🎯</span> Budget Monitoring
            </button>

            <button
              onClick={() => setActiveTab('ai')}
              className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ' + (
                activeTab === 'ai'
                  ? 'bg-[#5C2D16] text-white shadow-md'
                  : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
              )}
            >
              <span className="text-base">⚛️</span> AI Insight
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ' + (
                activeTab === 'analytics'
                  ? 'bg-[#5C2D16] text-white shadow-md'
                  : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
              )}
            >
              <span className="text-base">📈</span> Analytics
            </button>

            <button
              onClick={() => setActiveTab('reports')}
              className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ' + (
                activeTab === 'reports'
                  ? 'bg-[#5C2D16] text-white shadow-md'
                  : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
              )}
            >
              <span className="text-base">📄</span> Laporan & Rekap
            </button>
          </nav>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="pt-4 border-t border-[#E5DDD8]">
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#FAF4F0]">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-[#5C2D16] text-white font-bold flex items-center justify-center text-xs shrink-0">
                AD
              </div>
              <div className="truncate">
                <div className="font-bold text-xs text-[#2D2825] truncate">Admin</div>
                <div className="text-[10px] text-[#8C7A70] truncate">{userEmail}</div>
              </div>
            </div>
            <button
              onClick={onLogout}
              title="Logout"
              className="p-1.5 text-[#8C7A70] hover:text-[#DC2626] rounded-lg transition-colors"
            >
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* TOPBAR HEADER */}
        <header className="h-16 bg-white border-b border-[#E5DDD8] px-6 flex items-center justify-between shrink-0 shadow-xs z-10">
          <div className="flex items-center gap-3">
            <div className="text-sm font-bold text-[#2D2825] capitalize">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'users' && 'User Management'}
              {activeTab === 'transactions' && 'Pemantauan Transaksi'}
              {activeTab === 'budgets' && 'Pemantauan Anggaran Mahasiswa'}
              {activeTab === 'ai' && 'AI Financial Intelligence'}
              {activeTab === 'analytics' && 'Statistik & Tren Finansial'}
              {activeTab === 'reports' && 'Laporan & Rekapitulasi Finansial'}
              {activeTab === 'profile' && 'Profil Admin'}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Currency Selector (IDR / USD) */}
            <div className="flex items-center bg-[#FAF4F0] p-1 rounded-xl border border-[#E8DCD8]">
              <button
                onClick={() => setCurrency('IDR')}
                className={'px-2.5 py-1 rounded-lg text-xs font-bold transition-all ' + (
                  currency === 'IDR' ? 'bg-[#5C2D16] text-white shadow-xs' : 'text-[#6E5D53] hover:text-[#5C2D16]'
                )}
              >
                IDR (Rp)
              </button>
              <button
                onClick={() => setCurrency('USD')}
                className={'px-2.5 py-1 rounded-lg text-xs font-bold transition-all ' + (
                  currency === 'USD' ? 'bg-[#5C2D16] text-white shadow-xs' : 'text-[#6E5D53] hover:text-[#5C2D16]'
                )}
              >
                USD ($)
              </button>
            </div>

            {/* Notification Bell Icon */}
            <div className="relative">
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 text-[#6E5D53] hover:text-[#5C2D16] hover:bg-[#FAF4F0] rounded-xl transition-all border border-transparent hover:border-[#E8DCD8]"
              >
                <span className="text-lg">🔔</span>
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C25E38] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border-2 border-white">
                    {unreadNotifCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown Panel */}
              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-[#E5DDD8] rounded-2xl shadow-xl z-50 p-3 space-y-2 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-[#F0E8E4] pb-2">
                    <span className="font-bold text-xs text-[#2D2825]">Notifikasi Terbaru</span>
                    <button onClick={() => setUnreadNotifCount(0)} className="text-[10px] text-[#5C2D16] font-bold hover:underline">
                      Tandai Dibaca
                    </button>
                  </div>
                  <div className="space-y-1.5 max-h-64 overflow-y-auto">
                    {notificationsList.map(n => (
                      <div key={n.id} className="p-2 rounded-xl bg-[#FAF7F4] hover:bg-[#FAF4F0] transition-colors text-xs border border-[#E5DDD8]/50">
                        <div className="font-semibold text-[#2D2825]">{n.title}</div>
                        <div className="text-[10px] text-[#8C7A70] mt-0.5">{n.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Button */}
            <button
              onClick={() => setActiveTab('profile')}
              className={'flex items-center gap-2 p-1.5 pr-3 rounded-xl transition-all border ' + (
                activeTab === 'profile' ? 'bg-[#FAF4F0] border-[#5C2D16]/40' : 'border-[#E8DCD8] hover:bg-[#FAF4F0]'
              )}
            >
              <div className="w-7 h-7 rounded-full bg-[#5C2D16] text-white font-bold flex items-center justify-center text-xs">
                AD
              </div>
              <span className="text-xs font-bold text-[#2D2825]">Admin</span>
            </button>
          </div>
        </header>

        {/* DYNAMIC SCROLLABLE PAGE BODY */}
        <main className="flex-1 overflow-y-auto bg-[#F7F5F0]">
          {activeTab === 'overview' && <OverviewPage onTriggerPdfToast={handleDownloadPdf} fmtMoney={fmtMoney} />}
          {activeTab === 'users' && <UserManagementPage fmtMoney={fmtMoney} />}
          {activeTab === 'transactions' && <TransactionsPage onTriggerPdfToast={handleDownloadPdf} />}
          {activeTab === 'budgets' && <BudgetsPage onTriggerPdfToast={handleDownloadPdf} fmtMoney={fmtMoney} />}
          {activeTab === 'ai' && <AiInsightPage onTriggerPdfToast={handleDownloadPdf} />}
          {activeTab === 'analytics' && <AnalyticsPage fmtMoney={fmtMoney} />}
          {activeTab === 'reports' && <ReportsPage onTriggerPdfToast={handleDownloadPdf} fmtMoney={fmtMoney} />}
          {activeTab === 'profile' && <ProfilePage userEmail={userEmail} onLogout={onLogout || (() => {})} />}
        </main>
      </div>

      {/* GLOBAL FLOATING TOAST FOR PDF DOWNLOAD NOTIFICATIONS */}
      {pdfToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#2D2825] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-[#5C2D16]/40 animate-bounce">
          <span className="text-lg">📄</span>
          <span className="text-xs font-bold">{pdfToastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
