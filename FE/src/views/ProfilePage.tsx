'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface ProfilePageProps {
  userEmail?: string;
  onLogout?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ userEmail, onLogout }) => {
  const router = useRouter();
  const [profileName, setProfileName] = useState('Admin Master');
  const [profileEmail, setProfileEmail] = useState(userEmail || 'KeisyaExaHaniyah@gmail.com');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileSavedMsg, setProfileSavedMsg] = useState('');
  const [passError, setPassError] = useState('');
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('moneymate_admin_name', profileName);
      localStorage.setItem('moneymate_user_email', profileEmail);
    }
    setProfileSavedMsg('Perubahan informasi profil berhasil disimpan.');
    setTimeout(() => setProfileSavedMsg(''), 4000);
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword.trim()) {
      setPassError('Kata sandi baru tidak boleh kosong.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassError('Konfirmasi kata sandi tidak cocok.');
      return;
    }
    setPassError('');
    setNewPassword('');
    setConfirmPassword('');
    setProfileSavedMsg('Kata sandi administrator berhasil diperbarui.');
    setTimeout(() => setProfileSavedMsg(''), 4000);
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('moneymate_user_email');
      localStorage.removeItem('moneymate_users_db');
      sessionStorage.clear();
    }
    if (onLogout) {
      onLogout();
    }
    router.push('/login');
  };

  return (
    <div className="p-4 space-y-4 max-w-5xl mx-auto w-full animate-fadeIn text-xs">
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
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn shadow-xs">
          <span className="w-4 h-4 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">✓</span>
          <span>{profileSavedMsg}</span>
        </div>
      )}

      {passError && (
        <div className="p-3 bg-rose-50 border border-rose-300 text-rose-800 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fadeIn shadow-xs">
          <span className="w-4 h-4 rounded-full bg-rose-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">✕</span>
          <span>{passError}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left Column: Avatar & Logout Button */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-5 shadow-sm text-center flex flex-col items-center justify-between space-y-5">
          <div className="flex flex-col items-center space-y-2.5 w-full">
            <div className="relative">
              <div className="w-20 h-20 rounded-2xl bg-[#5C2D16] text-[#F7F5F0] font-extrabold text-2xl flex items-center justify-center shadow-md">
                AD
              </div>
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white text-white flex items-center justify-center text-[10px] font-bold">✓</span>
            </div>

            <div>
              <h2 className="text-base font-bold text-[#2D2825]">{profileName}</h2>
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

          {/* ACTIVE WORKING LOGOUT BUTTON */}
          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full py-2.5 bg-[#DC2626] hover:bg-[#B91C1C] text-white font-bold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-98"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span>{isLoggingOut ? 'Sedang Logout...' : 'Logout (Keluar)'}</span>
          </button>
        </div>

        {/* Right Column: Forms */}
        <div className="md:col-span-2 space-y-4">
          {/* Form 1: Informasi Akun */}
          <form onSubmit={handleSaveProfile} className="bg-white border border-[#E5DDD8] rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between border-b border-[#F0E8E4] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-base">👤</span>
                <h3 className="font-bold text-sm text-[#2D2825]">Informasi Akun</h3>
              </div>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-[#5C2D16] hover:bg-[#462211] text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              >
                Simpan Profil
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#6E5D53] mb-1">Nama</label>
                <input
                  type="text"
                  value={profileName}
                  onChange={e => setProfileName(e.target.value)}
                  className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-1.5 text-xs font-medium text-[#2D2825] focus:outline-none focus:border-[#5C2D16]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#6E5D53] mb-1">ID Admin</label>
                <input
                  type="text"
                  value="ADM-2026-0091"
                  disabled
                  className="w-full bg-[#FAF4F0] border border-[#E6D4CB] rounded-xl px-3 py-1.5 text-xs font-bold text-[#5C2D16] cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#6E5D53] mb-1">Email</label>
                <input
                  type="email"
                  value={profileEmail}
                  onChange={e => setProfileEmail(e.target.value)}
                  className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-1.5 text-xs font-medium text-[#2D2825] focus:outline-none focus:border-[#5C2D16]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#6E5D53] mb-1">Peran / Hak Akses</label>
                <input
                  type="text"
                  value="Super Administrator"
                  disabled
                  className="w-full bg-[#FAF4F0] border border-[#E6D4CB] rounded-xl px-3 py-1.5 text-xs font-bold text-[#5C2D16] cursor-not-allowed"
                />
              </div>
            </div>
          </form>

          {/* Form 2: Ubah Kata Sandi */}
          <form onSubmit={handleSavePassword} className="bg-white border border-[#E5DDD8] rounded-2xl p-5 shadow-sm space-y-3">
            <div className="flex items-center gap-2 border-b border-[#F0E8E4] pb-2.5">
              <span className="text-base">🔒</span>
              <h3 className="font-bold text-sm text-[#2D2825]">Ubah Kata Sandi</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#6E5D53] mb-1">Kata Sandi Baru</label>
                <input
                  type="password"
                  placeholder="Masukkan kata sandi baru"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-1.5 text-xs font-medium text-[#2D2825] focus:outline-none focus:border-[#5C2D16]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-[#6E5D53] mb-1">Konfirmasi Kata Sandi</label>
                <input
                  type="password"
                  placeholder="Ulangi kata sandi baru"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-1.5 text-xs font-medium text-[#2D2825] focus:outline-none focus:border-[#5C2D16]"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-[#5C2D16] hover:bg-[#462211] text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer"
              >
                Perbarui Kata Sandi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
