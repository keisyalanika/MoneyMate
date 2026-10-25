'use client';

import React, { useState } from 'react';

export interface UserItem {
  id: number;
  name: string;
  email: string;
  nim?: string;
  prodi?: string;
  saldo: string;
  status: 'Aktif' | 'Nonaktif';
}

interface UserManagementPageProps {
  fmtMoney: (idr: string, usd: string) => string;
  users: UserItem[];
  onAddUser: (user: UserItem) => void;
  onUpdateUser?: (user: UserItem) => void;
}

export const UserManagementPage: React.FC<UserManagementPageProps> = ({
  fmtMoney,
  users,
  onAddUser,
  onUpdateUser
}) => {
  const [userSearch, setUserSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State - Tambah Pengguna
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newSaldo, setNewSaldo] = useState('1500000');
  const [newStatus, setNewStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');

  // Form State - Edit Pengguna
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editSaldo, setEditSaldo] = useState('');
  const [editStatus, setEditStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');

  // Toast Notification State
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Handle Tambah Modal
  const handleOpenAddModal = () => {
    setNewName('');
    setNewEmail('');
    setNewSaldo('1500000');
    setNewStatus('Aktif');
    setIsAddModalOpen(true);
  };

  const handleSubmitNewUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const formattedSaldo = 'Rp ' + Number(newSaldo.replace(/\D/g, '') || 0).toLocaleString('id-ID');
    const newUser: UserItem = {
      id: Date.now(),
      name: newName.trim(),
      email: newEmail.trim(),
      saldo: formattedSaldo,
      status: newStatus
    };

    onAddUser(newUser);
    setIsAddModalOpen(false);
    setToastMessage(`✓ Pengguna "${newUser.name}" berhasil ditambahkan!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Handle Edit Modal
  const handleOpenEditModal = (user: UserItem) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    const numericSaldo = user.saldo.replace(/\D/g, '') || '0';
    setEditSaldo(numericSaldo);
    setEditStatus(user.status);
  };

  const handleSaveEditUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editName.trim() || !editEmail.trim()) return;

    const formattedSaldo = 'Rp ' + Number(editSaldo.replace(/\D/g, '') || 0).toLocaleString('id-ID');
    const updated: UserItem = {
      ...editingUser,
      name: editName.trim(),
      email: editEmail.trim(),
      saldo: formattedSaldo,
      status: editStatus
    };

    if (onUpdateUser) {
      onUpdateUser(updated);
    }
    setEditingUser(null);
    setToastMessage(`✓ Data pengguna "${updated.name}" berhasil diperbarui!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filter Search
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto w-full animate-fadeIn text-xs relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-14 right-5 z-50 w-full max-w-sm pointer-events-auto transition-all animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-md border border-[#E5DDD8] rounded-2xl p-4 shadow-2xl text-xs space-y-1.5 border-l-4 border-emerald-500">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-[#2D2825] text-xs">Berhasil Disimpan</div>
                  <div className="text-[10px] text-[#8C7A70]">Database pengguna terupdate real-time</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setToastMessage(null)}
                className="text-[#8C7A70] hover:text-[#2D2825] p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-[#554A43] text-[11px] bg-[#FAF7F4] p-2 rounded-xl border border-[#E5DDD8]">
              {toastMessage}
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl font-bold text-[#2D2825]">User Management</h1>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] rounded-full">
              Total: {users.length} Pengguna
            </span>
          </div>
          <p className="text-[11px] text-[#8C7A70] mt-0.5">Kelola daftar akun pengguna dan hak akses sistem MoneyMate.</p>
        </div>
        <button
          type="button"
          onClick={handleOpenAddModal}
          className="px-3.5 py-1.5 bg-[#5C2D16] text-white text-xs font-bold rounded-xl shadow hover:bg-[#462211] transition-all cursor-pointer flex items-center gap-1.5"
        >
          <span>+</span> Tambah Pengguna Baru
        </button>
      </div>

      <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="relative max-w-sm">
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
            className="w-full bg-[#F5F2ED] border border-[#E5DDD8] rounded-xl px-3 py-1.5 text-xs text-[#2D2825] focus:outline-none"
          />
        </div>

        {/* Tabel Pengguna */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F4] text-[#8C7A70] uppercase text-[9px] font-bold border-b border-[#E5DDD8]">
              <tr>
                <th className="py-2.5 px-4">Nama &amp; Email</th>
                <th className="py-2.5 px-4">Saldo Dompet</th>
                <th className="py-2.5 px-4">Status Akun</th>
                <th className="py-2.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8E4]">
              {filteredUsers.map((u) => {
                const num = parseInt(u.saldo.replace(/\D/g, '') || '0', 10);
                const usdStr = '$ ' + (num / 15500).toFixed(2);
                return (
                  <tr key={u.id} className="hover:bg-[#FAF7F2] transition-colors">
                    <td className="py-3 px-4 font-bold text-[#2D2825]">
                      <div>{u.name}</div>
                      <div className="text-[10px] text-[#8C7A70] font-normal">{u.email}</div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-[#5C2D16]">{fmtMoney(u.saldo, usdStr)}</td>
                    <td className="py-3 px-4">
                      <span className={'px-2 py-0.5 rounded font-semibold text-[10px] ' + (
                        u.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      )}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(u)}
                        className="text-[#5C2D16] hover:text-[#462211] font-bold cursor-pointer hover:underline text-xs"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: Tambah Pengguna Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-[#E5DDD8] shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#F0E8E4] pb-3">
              <h3 className="font-extrabold text-sm text-[#2D2825]">Tambah Pengguna Baru</h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-[#8C7A70] hover:text-[#2D2825] font-bold text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewUser} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-[#2D2825] block mb-1">Nama Mahasiswa *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-2 text-xs text-[#2D2825] focus:outline-none focus:border-[#5C2D16]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#2D2825] block mb-1">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="nama@student.ac.id"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-2 text-xs text-[#2D2825] focus:outline-none focus:border-[#5C2D16]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#2D2825] block mb-1">Status Akun</label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as 'Aktif' | 'Nonaktif')}
                    className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-2 text-xs text-[#2D2825] focus:outline-none focus:border-[#5C2D16] cursor-pointer"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#2D2825] block mb-1">Saldo Awal Dompet</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-[#8C7A70] text-xs font-bold">Rp</span>
                    <input
                      type="number"
                      value={newSaldo}
                      onChange={e => setNewSaldo(e.target.value)}
                      className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl pl-9 pr-3 py-2 text-xs text-[#2D2825] focus:outline-none focus:border-[#5C2D16]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0E8E4]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 bg-[#F5F2ED] text-[#6E5D53] font-bold rounded-xl text-xs hover:bg-[#EAE4DC] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#5C2D16] text-white font-bold rounded-xl text-xs hover:bg-[#462211] shadow-sm cursor-pointer"
                >
                  Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Data Pengguna */}
      {editingUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-[#E5DDD8] shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#F0E8E4] pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-[#2D2825]">Edit Data Pengguna</h3>
                <p className="text-[10px] text-[#8C7A70] mt-0.5">Perbarui informasi akun, saldo, atau status pengguna.</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="text-[#8C7A70] hover:text-[#2D2825] font-bold text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEditUser} className="space-y-3.5">
              <div>
                <label className="text-[11px] font-bold text-[#2D2825] block mb-1">Nama Mahasiswa *</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-2 text-xs text-[#2D2825] focus:outline-none focus:border-[#5C2D16]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#2D2825] block mb-1">Email *</label>
                <input
                  type="email"
                  required
                  placeholder="nama@student.ac.id"
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-2 text-xs text-[#2D2825] focus:outline-none focus:border-[#5C2D16]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#2D2825] block mb-1">Status Akun</label>
                  <select
                    value={editStatus}
                    onChange={e => setEditStatus(e.target.value as 'Aktif' | 'Nonaktif')}
                    className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-2 text-xs text-[#2D2825] focus:outline-none focus:border-[#5C2D16] cursor-pointer"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#2D2825] block mb-1">Saldo Dompet</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2 text-[#8C7A70] text-xs font-bold">Rp</span>
                    <input
                      type="number"
                      value={editSaldo}
                      onChange={e => setEditSaldo(e.target.value)}
                      className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl pl-9 pr-3 py-2 text-xs text-[#2D2825] focus:outline-none focus:border-[#5C2D16]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0E8E4]">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-3.5 py-1.5 bg-[#F5F2ED] text-[#6E5D53] font-bold rounded-xl text-xs hover:bg-[#EAE4DC] cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#5C2D16] text-white font-bold rounded-xl text-xs hover:bg-[#462211] shadow-sm cursor-pointer"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagementPage;
