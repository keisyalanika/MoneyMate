import React, { useState } from 'react';
import { OverviewPage } from './OverviewPage';
import { UserManagementPage } from './UserManagementPage';
import { TransactionsPage } from './TransactionsPage';
import { BudgetsPage } from './BudgetsPage';
import { AiInsightPage } from './AiInsightPage';
import { AnalyticsPage } from './AnalyticsPage';
import { ReportsPage } from './ReportsPage';
import { SettingsPage } from './SettingsPage';
import { ProfilePage } from './ProfilePage';

interface DashboardProps {
  userEmail?: string;
  onLogout?: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ userEmail = 'KeisyaExaHaniyah@gmail.com', onLogout }) => {
  const [activeTab, setActiveTab] = useState<string>('settings');
  const [currency, setCurrency] = useState<'IDR' | 'USD'>('IDR');
  
  // Notification and Toast States
  const [pdfToast, setPdfToast] = useState(false);
  const [pdfToastMessage, setPdfToastMessage] = useState('Memproses Unduh PDF Laporan...');
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(3);

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
      <aside className="w-64 bg-[#FAF7F4] border-r border-[#E5DDD8] flex flex-col justify-between p-4 shrink-0 shadow-xs">
        <div className="space-y-5">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-9 h-9 rounded-xl bg-[#5C2D16] text-[#F7F5F0] font-black text-xl flex items-center justify-center shadow-md">
              M
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-[#5C2D16]">MoneyMate</div>
              <div className="text-[10px] text-[#8C7A70] font-medium uppercase tracking-wider">Keuangan Kampus</div>
            </div>
            <span className="px-2 py-0.5 text-[9px] font-bold bg-[#E6D0C7] text-[#5C2D16] rounded ml-auto uppercase">ADMIN</span>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ' + (
                activeTab === 'overview'
                  ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                  : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
              )}
            >
              <span className="text-base">📊</span> Dashboard Overview
            </button>

            <button
              onClick={() => setActiveTab('users')}
              className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ' + (
                activeTab === 'users'
                  ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                  : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
              )}
            >
              <span className="text-base">👥</span> User Management
            </button>

            <button
              onClick={() => setActiveTab('transactions')}
              className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ' + (
                activeTab === 'transactions'
                  ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                  : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
              )}
            >
              <span className="text-base">💳</span> Transactions
            </button>

            <button
              onClick={() => setActiveTab('budgets')}
              className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ' + (
                activeTab === 'budgets'
                  ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                  : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
              )}
            >
              <span className="text-base">🎯</span> Budget Monitoring
            </button>

            <div className="pt-2 pb-1">
              <div className="text-[10px] font-bold text-[#8C7A70] uppercase px-3 tracking-wider">FITUR PINTAR</div>
            </div>

            <button
              onClick={() => setActiveTab('ai')}
              className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ' + (
                activeTab === 'ai'
                  ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                  : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
              )}
            >
              <span className="text-base">✨</span> AI Financial Insight
            </button>

            <button
              onClick={() => setActiveTab('analytics')}
              className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ' + (
                activeTab === 'analytics'
                  ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                  : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
              )}
            >
              <span className="text-base">📈</span> Analytics & Statistik
            </button>

            <div className="pt-2 pb-1">
              <div className="text-[10px] font-bold text-[#8C7A70] uppercase px-3 tracking-wider">MANAJEMEN</div>
            </div>

            <button
              onClick={() => setActiveTab('reports')}
              className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ' + (
                activeTab === 'reports'
                  ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                  : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
              )}
            >
              <span className="text-base">📄</span> Reports
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-xs transition-all ' + (
                activeTab === 'settings'
                  ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                  : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
              )}
            >
              <span className="text-base">⚙️</span> Settings
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Info */}
        <div className="pt-4 border-t border-[#E5DDD8] space-y-2">
          <div className="p-2.5 bg-white border border-[#E5DDD8] rounded-xl text-[10px] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <div>
              <div className="font-bold text-[#2D2825]">Sistem Kampus v2.4</div>
              <div className="text-emerald-700 font-semibold">Sync aktif</div>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* TOPBAR HEADER */}
        <header className="h-16 bg-white border-b border-[#E5DDD8] px-6 flex items-center justify-between shrink-0 shadow-xs z-10">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Cari data, mahasiswa, kategori..."
                className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-1.5 pl-8 text-xs text-[#2D2825] focus:outline-none"
              />
              <span className="absolute left-2.5 top-2 text-[#8C7A70] text-xs">🔍</span>
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

              {/* 3-TOAST STACK FLOATING NOTIFICATION PANEL (Exact Gambar 3 Specs) */}
              {showNotifDropdown && (
                <div className="absolute right-0 mt-2 w-96 z-50 space-y-3 p-1 animate-fadeIn">
                  {/* Toast 1: Perubahan Berhasil Disimpan (Success) */}
                  <div className="bg-white border border-emerald-400 rounded-2xl p-4 shadow-2xl space-y-2 border-t-4 border-t-emerald-500">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-[#2D2825]">Perubahan Berhasil Disimpan</h4>
                          <span className="text-[10px] text-[#8C7A70]">Baru saja</span>
                        </div>
                      </div>
                      <button onClick={() => setShowNotifDropdown(false)} className="text-[#8C7A70] hover:text-[#2D2825] text-xs font-bold">✕</button>
                    </div>
                    <p className="text-[11px] text-[#554A43] leading-relaxed">
                      Kategori anggaran baru dan ambang batas peringatan 80% telah diperbarui ke sistem SIAKAD kampus.
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] border-t border-[#F0E8E4]">
                      <button className="font-bold text-[#5C2D16] hover:underline">↩ Batalkan (Undo)</button>
                      <span className="text-[#8C7A70]">•</span>
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Tersinkronisasi
                      </span>
                    </div>
                  </div>

                  {/* Toast 2: Laporan Berhasil Diunduh (Download PDF) */}
                  <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-2xl space-y-2 border-t-4 border-t-amber-700">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] flex items-center justify-center text-xs font-bold shrink-0">
                          📄
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-[#2D2825]">Laporan Berhasil Diunduh</h4>
                          <span className="text-[10px] text-[#8C7A70]">12 dtk lalu</span>
                        </div>
                      </div>
                      <button onClick={() => setShowNotifDropdown(false)} className="text-[#8C7A70] hover:text-[#2D2825] text-xs font-bold">✕</button>
                    </div>
                    <p className="text-[11px] text-[#554A43] leading-relaxed">
                      Dokumen PDF <strong className="text-[#2D2825]">Rekapitulasi-Keuangan-Semester-Genap.pdf</strong> (4.2 MB) siap dibuka di perangkat Anda.
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] border-t border-[#F0E8E4]">
                      <button className="px-2.5 py-1 bg-[#5C2D16] text-white font-bold rounded-lg text-[10px]">📄 Buka Berkas</button>
                      <span className="text-[#8C7A70]">•</span>
                      <span className="text-[10px] text-[#8C7A70]">Folder Downloads</span>
                    </div>
                  </div>

                  {/* Toast 3: Semua Rekomendasi AI Berhasil Diterapkan (AI Agent) */}
                  <div className="bg-white border border-emerald-300 rounded-2xl p-4 shadow-2xl space-y-2 border-t-4 border-t-emerald-600">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">
                          ✨
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-[#2D2825]">Semua Rekomendasi AI Berhasil Diterapkan</h4>
                          <span className="text-[10px] text-[#8C7A70]">Baru saja</span>
                        </div>
                      </div>
                      <button onClick={() => setShowNotifDropdown(false)} className="text-[#8C7A70] hover:text-[#2D2825] text-xs font-bold">✕</button>
                    </div>
                    <p className="text-[11px] text-[#554A43] leading-relaxed">
                      Intervensi cerdas untuk 14 mahasiswa defisit telah aktif: Pembatasan limit QRIS terpasang & pesan bimbingan otomatis terkirim via WhatsApp/SIAKAD.
                    </p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] border-t border-[#F0E8E4]">
                      <button className="px-2.5 py-1 bg-[#5C2D16] text-white font-bold rounded-lg text-[10px]">👁️ Lihat Log Intervensi</button>
                      <span className="text-[#8C7A70]">•</span>
                      <span className="font-bold text-emerald-700 text-[10px]">🟢 14/14 Sukses</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Button */}
            <button
              onClick={() => setActiveTab('profile')}
              className={'flex items-center gap-2 p-1 pr-2.5 rounded-xl transition-all border ' + (
                activeTab === 'profile' ? 'bg-[#FAF4F0] border-[#5C2D16]/40 shadow-xs' : 'border-transparent hover:bg-[#FAF4F0]'
              )}
            >
              <div className="w-7 h-7 rounded-full bg-[#5C2D16] text-white font-bold flex items-center justify-center text-xs">
                AD
              </div>
              <div className="text-left">
                <div className="text-xs font-bold text-[#2D2825] leading-tight">Admin Master</div>
                <div className="text-[9px] text-[#8C7A70]">Super Admin</div>
              </div>
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
          {activeTab === 'settings' && <SettingsPage onTriggerSaveToast={handleDownloadPdf} fmtMoney={fmtMoney} />}
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
