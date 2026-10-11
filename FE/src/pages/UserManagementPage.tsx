import React, { useState } from 'react';

export interface UserItem {
  id: number;
  name: string;
  email: string;
  nim: string;
  prodi: string;
  saldo: string;
  status: 'Aktif' | 'Nonaktif';
}

interface UserManagementPageProps {
  fmtMoney: (idr: string, usd: string) => string;
  users: UserItem[];
  onAddUser: (user: UserItem) => void;
}

export const UserManagementPage: React.FC<UserManagementPageProps> = ({ fmtMoney, users, onAddUser }) => {
  const [userSearch, setUserSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newNim, setNewNim] = useState('');
  const [newProdi, setNewProdi] = useState('Informatika');
  const [newSaldo, setNewSaldo] = useState('1500000');
  const [newStatus, setNewStatus] = useState<'Aktif' | 'Nonaktif'>('Aktif');

  const handleOpenModal = () => {
    setNewName('');
    setNewEmail('');
    setNewNim('');
    setNewProdi('Informatika');
    setNewSaldo('1500000');
    setNewStatus('Aktif');
    setIsModalOpen(true);
  };

  const handleSubmitUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim() || !newNim.trim()) return;

    const formattedSaldo = 'Rp ' + Number(newSaldo.replace(/\D/g, '') || 0).toLocaleString('id-ID');
    const newUser: UserItem = {
      id: Date.now(),
      name: newName.trim(),
      email: newEmail.trim(),
      nim: newNim.trim(),
      prodi: newProdi,
      saldo: formattedSaldo,
      status: newStatus
    };

    onAddUser(newUser);
    setIsModalOpen(false);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.nim.includes(userSearch) ||
    u.prodi.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto w-full animate-fadeIn text-xs">
      {/* Header strictly matching Figma */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#2D2825]">User Management</h1>
          <p className="text-[11px] text-[#8C7A70] mt-0.5">Kelola daftar akun mahasiswa dan hak akses pengguna sistem MoneyMate.</p>
        </div>
        <button
          onClick={handleOpenModal}
          className="px-3.5 py-1.5 bg-[#5C2D16] text-white text-xs font-bold rounded-xl shadow hover:bg-[#462211] transition-all cursor-pointer"
        >
          + Tambah Pengguna Baru
        </button>
      </div>

      <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="relative max-w-sm">
          <input
            type="text"
            placeholder="Cari nama, email, atau NIM..."
            value={userSearch}
            onChange={e => setUserSearch(e.target.value)}
            className="w-full bg-[#F5F2ED] border border-[#E5DDD8] rounded-xl px-3 py-1.5 text-xs text-[#2D2825] focus:outline-none"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F4] text-[#8C7A70] uppercase text-[9px] font-bold border-b border-[#E5DDD8]">
              <tr>
                <th className="py-2.5 px-4">Nama & Email</th>
                <th className="py-2.5 px-4">NIM</th>
                <th className="py-2.5 px-4">Fakultas / Prodi</th>
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
                    <td className="py-3 px-4 text-[#8C7A70]">{u.nim}</td>
                    <td className="py-3 px-4 text-[#8C7A70]">{u.prodi}</td>
                    <td className="py-3 px-4 font-mono font-bold text-[#5C2D16]">{fmtMoney(u.saldo, usdStr)}</td>
                    <td className="py-3 px-4">
                      <span className={'px-2 py-0.5 rounded font-semibold text-[10px] ' + (
                        u.status === 'Aktif' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      )}>
                        {u.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-[#5C2D16] font-bold cursor-pointer hover:underline">Edit</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Tambah Pengguna Baru (Figma Spec) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-md w-full border border-[#E5DDD8] shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-[#F0E8E4] pb-3">
              <h3 className="font-extrabold text-sm text-[#2D2825]">Tambah Pengguna Baru</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-[#8C7A70] hover:text-[#2D2825] font-bold text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitUser} className="space-y-3">
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

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#2D2825] block mb-1">Email Mahasiswa *</label>
                  <input
                    type="email"
                    required
                    placeholder="nama@student.ac.id"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-2 text-xs text-[#2D2825] focus:outline-none focus:border-[#5C2D16]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#2D2825] block mb-1">NIM *</label>
                  <input
                    type="text"
                    required
                    placeholder="10293850"
                    value={newNim}
                    onChange={e => setNewNim(e.target.value)}
                    className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-2 text-xs text-[#2D2825] focus:outline-none focus:border-[#5C2D16]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-[#2D2825] block mb-1">Fakultas / Prodi</label>
                  <select
                    value={newProdi}
                    onChange={e => setNewProdi(e.target.value)}
                    className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-2 text-xs text-[#2D2825] focus:outline-none focus:border-[#5C2D16]"
                  >
                    <option value="Informatika">Informatika</option>
                    <option value="Sistem Informasi">Sistem Informasi</option>
                    <option value="Teknik Elektro">Teknik Elektro</option>
                    <option value="Teknik Sipil">Teknik Sipil</option>
                    <option value="Manajemen">Manajemen</option>
                    <option value="Akuntansi">Akuntansi</option>
                    <option value="Ilmu Komunikasi">Ilmu Komunikasi</option>
                    <option value="Desain Komunikasi Visual">Desain Komunikasi Visual</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#2D2825] block mb-1">Status Akun</label>
                  <select
                    value={newStatus}
                    onChange={e => setNewStatus(e.target.value as 'Aktif' | 'Nonaktif')}
                    className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-2 text-xs text-[#2D2825] focus:outline-none focus:border-[#5C2D16]"
                  >
                    <option value="Aktif">Aktif</option>
                    <option value="Nonaktif">Nonaktif</option>
                  </select>
                </div>
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

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F0E8E4]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
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
    </div>
  );
};
