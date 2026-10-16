'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { OverviewPage } from './OverviewPage';
import { UserManagementPage, UserItem } from './UserManagementPage';
import { TransactionsPage } from './TransactionsPage';
import { BudgetsPage } from './BudgetsPage';
import { AiInsightPage } from './AiInsightPage';
import { AnalyticsPage } from './AnalyticsPage';
import { ReportsPage } from './ReportsPage';
import { SettingsPage } from './SettingsPage';
import { ProfilePage } from './ProfilePage';
import { Search, Bell } from 'lucide-react';

const INITIAL_USERS: UserItem[] = [
  { id: 1, name: 'Keisya Lanika', email: 'KeisyaExaHaniyah@gmail.com', nim: '10293841', prodi: 'Informatika', saldo: 'Rp 2.450.000', status: 'Aktif' },
  { id: 2, name: 'Bima Santoso', email: 'bima.santoso@student.ac.id', nim: '10293842', prodi: 'Sistem Informasi', saldo: 'Rp 1.150.000', status: 'Aktif' },
  { id: 3, name: 'Aulia Rahma', email: 'aulia.r@student.ac.id', nim: '10293843', prodi: 'Manajemen', saldo: 'Rp 4.800.000', status: 'Aktif' },
  { id: 4, name: 'Rizky Aditya', email: 'rizky.a@student.ac.id', nim: '10293844', prodi: 'Teknik Elektro', saldo: 'Rp 850.000', status: 'Aktif' },
  { id: 5, name: 'Nadia Putri', email: 'nadia.p@student.ac.id', nim: '10293845', prodi: 'Akuntansi', saldo: 'Rp 3.200.000', status: 'Aktif' },
  { id: 6, name: 'Ahmad Fauzi', email: 'ahmad.fauzi@student.ac.id', nim: '10293846', prodi: 'Teknik Informatika', saldo: 'Rp 1.750.000', status: 'Aktif' },
  { id: 7, name: 'Bambang Santoso', email: 'bambang.s@student.ac.id', nim: '10293847', prodi: 'Ilmu Komunikasi', saldo: 'Rp 2.100.000', status: 'Aktif' },
  { id: 8, name: 'Dewi Lestari', email: 'dewi.lestari@student.ac.id', nim: '10293848', prodi: 'Desain Komunikasi Visual', saldo: 'Rp 3.900.000', status: 'Aktif' },
  { id: 9, name: 'Reza Hardiansyah', email: 'reza.h@student.ac.id', nim: '10293849', prodi: 'Teknik Sipil', saldo: 'Rp 1.350.000', status: 'Aktif' }
];

interface DashboardProps {
  userEmail?: string;
  onLogout?: () => void;
  initialTab?: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ userEmail = 'KeisyaExaHaniyah@gmail.com', onLogout, initialTab = 'overview' }) => {
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== 'undefined') {
      const newPath = tab === 'overview' ? '/dashboard' : `/dashboard/${tab}`;
      if (window.location.pathname !== newPath) {
        window.history.pushState(null, '', newPath);
      }
    }
  };

  const [currency, setCurrency] = useState<'IDR' | 'USD'>('IDR');
  
  // Shared persistent users state across all pages (Item 3)
  const [usersList, setUsersList] = useState<UserItem[]>(INITIAL_USERS);

  // Notification and Toast States
  const [pdfToast, setPdfToast] = useState(false);
  const [pdfToastMessage, setPdfToastMessage] = useState('Memproses Unduh PDF Laporan...');
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [unreadNotifCount, setUnreadNotifCount] = useState(3);
  const [latestAiToastTitle, setLatestAiToastTitle] = useState('Rekomendasi AI Diterapkan');
  const [latestAiToastDesc, setLatestAiToastDesc] = useState('Intervensi cerdas berhasil diaktifkan untuk akun mahasiswa.');

  // Load users from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('moneymate_users_db');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setUsersList(parsed);
        }
      }
    } catch {
      // fallback
    }
  }, []);

  const handleAddUserGlobal = (newUser: UserItem) => {
    const updated = [newUser, ...usersList];
    setUsersList(updated);
    try {
      localStorage.setItem('moneymate_users_db', JSON.stringify(updated));
    } catch {
      // fallback
    }
    // Increment notification counter & add message
    setUnreadNotifCount(prev => prev + 1);
  };

  const handleUpdateUserGlobal = (updatedUser: UserItem) => {
    const updated = usersList.map(u => u.id === updatedUser.id ? updatedUser : u);
    setUsersList(updated);
    try {
      localStorage.setItem('moneymate_users_db', JSON.stringify(updated));
    } catch {
      // fallback
    }
  };

  const handleDownloadPdf = (customTitle?: string) => {
    setPdfToastMessage(customTitle ? `Memproses Unduh: ${customTitle}...` : 'Memproses Unduh PDF Laporan...');
    setPdfToast(true);
    setTimeout(() => {
      setPdfToastMessage(customTitle ? `✅ ${customTitle} Berhasil Diunduh!` : '✅ Laporan PDF Berhasil Diunduh!');
      setUnreadNotifCount(prev => prev + 1);
    }, 1500);
    setTimeout(() => {
      setPdfToast(false);
    }, 4500);
  };

  const handleAiNotification = (title: string, message: string) => {
    setLatestAiToastTitle(title);
    setLatestAiToastDesc(message);
    setUnreadNotifCount(prev => prev + 1);
  };

  const fmtMoney = (idr: string, usd: string) => {
    return currency === 'USD' ? usd : idr;
  };

  return (
    <div className="flex h-screen bg-[#F7F5F0] text-[#2D2825] font-sans overflow-hidden">
      {/* UNIFIED SIDEBAR NAVIGATION (Matching Figma Specs 100%) */}
      <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* TOPBAR HEADER */}
        <header className="h-16 bg-white border-b border-[#E5DDD8] px-6 flex items-center justify-between shrink-0 shadow-xs z-20 relative">
          {/* SEARCH BAR (Hidden on AI page per user request) */}
          {activeTab !== 'ai' ? (
            <div className="flex items-center gap-3 flex-1 max-w-md">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Cari user, transaksi, atau laporan..."
                  className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-1.5 pl-9 pr-12 text-xs text-[#2D2825] focus:outline-none"
                />
                <Search className="w-4 h-4 text-[#8C7A70] absolute left-3 top-2.5" />
                <span className="absolute right-2.5 top-2 bg-white border border-[#E5DDD8] rounded px-1.5 py-0.5 text-[9px] font-mono text-[#8C7A70]">
                  ⌘K
                </span>
              </div>
            </div>
          ) : (
            <div className="flex-1" />
          )}

          <div className="flex items-center gap-4 relative">
            {/* Currency Selector (IDR / USD) - Hidden on AI page per user request */}
            {activeTab !== 'ai' && (
              <div className="flex items-center bg-[#FAF4F0] p-1 rounded-xl border border-[#E8DCD8]">
                <button
                  onClick={() => setCurrency('IDR')}
                  className={'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ' + (
                    currency === 'IDR' ? 'bg-[#5C2D16] text-white shadow-xs' : 'text-[#6E5D53] hover:text-[#5C2D16]'
                  )}
                >
                  IDR (Rp)
                </button>
                <button
                  onClick={() => setCurrency('USD')}
                  className={'px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ' + (
                    currency === 'USD' ? 'bg-[#5C2D16] text-white shadow-xs' : 'text-[#6E5D53] hover:text-[#5C2D16]'
                  )}
                >
                  USD ($)
                </button>
              </div>
            )}

            {/* Notification Bell Icon */}
            <div>
              <button
                onClick={() => setShowNotifDropdown(!showNotifDropdown)}
                className="relative p-2 text-[#6E5D53] hover:text-[#5C2D16] hover:bg-[#FAF4F0] rounded-xl transition-all border border-transparent hover:border-[#E8DCD8] cursor-pointer"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifCount > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#C25E38] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center border-2 border-white">
                    {unreadNotifCount}
                  </span>
                )}
              </button>
            </div>

            {/* Admin Profile Button */}
            <button
              onClick={() => setActiveTab('profile')}
              className={'flex items-center gap-2.5 p-1 pr-2.5 rounded-xl transition-all border cursor-pointer ' + (
                activeTab === 'profile' ? 'bg-[#FAF4F0] border-[#5C2D16]/40 shadow-xs' : 'border-transparent hover:bg-[#FAF4F0]'
              )}
            >
              <div className="w-8 h-8 rounded-full bg-[#5C2D16] text-white font-bold flex items-center justify-center text-xs border border-[#E8DCD8]">
                AM
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-[#2D2825] leading-tight">Admin Master</div>
                <div className="text-[9px] text-[#8C7A70]">Super Administrator</div>
              </div>
            </button>

            {/* NOTIFICATION POPUP: ANCHORED FLUSH TO THE RIGHT EDGE */}
            {showNotifDropdown && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowNotifDropdown(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-80 sm:w-84 z-50 space-y-2.5 p-1 animate-fadeIn">
                  {/* Toast 1: Perubahan Berhasil Disimpan */}
                  <div className="bg-white border border-emerald-400 rounded-2xl p-3.5 shadow-2xl space-y-1.5 border-t-4 border-t-emerald-500">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                          ✓
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-[#2D2825]">Data Terupdate Real-Time</h4>
                          <span className="text-[9px] text-[#8C7A70]">Baru saja</span>
                        </div>
                      </div>
                      <button onClick={() => setShowNotifDropdown(false)} className="text-[#8C7A70] hover:text-[#2D2825] text-xs font-bold cursor-pointer">✕</button>
                    </div>
                    <p className="text-[11px] text-[#554A43] leading-relaxed">
                      Total {usersList.length} akun mahasiswa aktif tersinkronisasi ke Dashboard dan Analytics.
                    </p>
                    <div className="flex items-center gap-2 pt-1 text-[10px] border-t border-[#F0E8E4]">
                      <span className="font-bold text-emerald-700 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Tersinkronisasi
                      </span>
                    </div>
                  </div>

                  {/* Toast 2: Laporan Berhasil Diunduh */}
                  <div className="bg-white border border-[#E5DDD8] rounded-2xl p-3.5 shadow-2xl space-y-1.5 border-t-4 border-t-amber-700">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] flex items-center justify-center text-[10px] font-bold shrink-0">
                          📄
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-[#2D2825]">Laporan Berhasil Diunduh</h4>
                          <span className="text-[9px] text-[#8C7A70]">12 dtk lalu</span>
                        </div>
                      </div>
                      <button onClick={() => setShowNotifDropdown(false)} className="text-[#8C7A70] hover:text-[#2D2825] text-xs font-bold cursor-pointer">✕</button>
                    </div>
                    <p className="text-[11px] text-[#554A43] leading-relaxed">
                      Dokumen PDF <strong className="text-[#2D2825]">Rekapitulasi-Keuangan-2026.pdf</strong> (4.2 MB) siap dibuka.
                    </p>
                    <div className="flex items-center gap-2 pt-1 text-[10px] border-t border-[#F0E8E4]">
                      <button className="px-2 py-0.5 bg-[#5C2D16] text-white font-bold rounded-lg text-[9px] cursor-pointer">📄 Buka Berkas</button>
                      <span className="text-[#8C7A70]">• Folder Downloads</span>
                    </div>
                  </div>

                  {/* Toast 3: Rekomendasi AI Berhasil Diterapkan */}
                  <div className="bg-white border border-emerald-300 rounded-2xl p-3.5 shadow-2xl space-y-1.5 border-t-4 border-t-emerald-600">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-[10px] font-bold shrink-0">
                          ✨
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-[#2D2825]">{latestAiToastTitle}</h4>
                          <span className="text-[9px] text-[#8C7A70]">Baru saja</span>
                        </div>
                      </div>
                      <button onClick={() => setShowNotifDropdown(false)} className="text-[#8C7A70] hover:text-[#2D2825] text-xs font-bold cursor-pointer">✕</button>
                    </div>
                    <p className="text-[11px] text-[#554A43] leading-relaxed">
                      {latestAiToastDesc}
                    </p>
                    <div className="flex items-center gap-2 pt-1 text-[10px] border-t border-[#F0E8E4]">
                      <span className="font-bold text-emerald-700 text-[10px]">🟢 Sukses Diterapkan</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </header>

        {/* DYNAMIC SCROLLABLE PAGE BODY */}
        <main className="flex-1 overflow-y-auto bg-[#F7F5F0]">
          {activeTab === 'overview' && (
            <OverviewPage
              onTriggerPdfToast={handleDownloadPdf}
              fmtMoney={fmtMoney}
              onNavigateTab={setActiveTab}
              onTriggerAiNotification={handleAiNotification}
            />
          )}
          {activeTab === 'users' && (
            <UserManagementPage
              fmtMoney={fmtMoney}
              users={usersList}
              onAddUser={handleAddUserGlobal}
              onUpdateUser={handleUpdateUserGlobal}
            />
          )}
          {activeTab === 'transactions' && <TransactionsPage onTriggerPdfToast={handleDownloadPdf} />}
          {activeTab === 'budgets' && (
            <BudgetsPage
              onTriggerPdfToast={handleDownloadPdf}
              fmtMoney={fmtMoney}
              users={usersList}
              totalUsersCount={usersList.length}
            />
          )}
          {activeTab === 'ai' && <AiInsightPage onTriggerPdfToast={handleDownloadPdf} />}
          {activeTab === 'analytics' && (
            <AnalyticsPage
              fmtMoney={fmtMoney}
              totalUsersCount={usersList.length}
            />
          )}
          {activeTab === 'reports' && (
            <ReportsPage
              onTriggerPdfToast={handleDownloadPdf}
              fmtMoney={fmtMoney}
              totalUsersCount={usersList.length}
            />
          )}
          {activeTab === 'settings' && <SettingsPage fmtMoney={fmtMoney} />}
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
