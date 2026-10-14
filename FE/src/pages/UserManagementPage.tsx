import React, { useState, useEffect } from 'react';
import { fetchUsersList, createNewUser } from '../services/api';
import { RefreshCw } from 'lucide-react';

export interface UserItem {
  id: number;
  userId?: string;
  name: string;
  email: string;
  nim: string;
  prodi: string;
  saldo: string;
  status: 'Aktif' | 'Nonaktif';
}

export const DEFAULT_USERS: UserItem[] = [
  { id: 1, userId: 'USR-001', name: 'Keisya Lanika', email: 'KeisyaExaHaniyah@gmail.com', nim: '230101001', prodi: 'Informatika', saldo: 'Rp 2.450.000', status: 'Aktif' },
  { id: 2, userId: 'USR-002', name: 'Bima Santoso', email: 'bima.santoso@gmail.com', nim: '230101002', prodi: 'Sistem Informasi', saldo: 'Rp 1.150.000', status: 'Aktif' },
  { id: 3, userId: 'USR-003', name: 'Aulia Rahma', email: 'aulia.rahma@gmail.com', nim: '230101003', prodi: 'Teknik Elektro', saldo: 'Rp 4.800.000', status: 'Aktif' },
  { id: 4, userId: 'USR-004', name: 'Rizky Aditya', email: 'rizky.aditya@gmail.com', nim: '230101004', prodi: 'Informatika', saldo: 'Rp 850.000', status: 'Aktif' },
  { id: 5, userId: 'USR-005', name: 'Nadia Putri', email: 'nadia.putri@gmail.com', nim: '230101005', prodi: 'Manajemen', saldo: 'Rp 3.200.000', status: 'Aktif' },
  { id: 6, userId: 'USR-006', name: 'Ahmad Fauzi', email: 'ahmad.fauzi@gmail.com', nim: '230101006', prodi: 'Akuntansi', saldo: 'Rp 1.750.000', status: 'Aktif' },
  { id: 7, userId: 'USR-007', name: 'Bambang Santoso', email: 'bambang.santoso@gmail.com', nim: '230101007', prodi: 'Teknik Sipil', saldo: 'Rp 2.100.000', status: 'Aktif' },
  { id: 8, userId: 'USR-008', name: 'Dewi Lestari', email: 'dewi.lestari@gmail.com', nim: '230101008', prodi: 'Desain Komunikasi Visual', saldo: 'Rp 3.900.000', status: 'Aktif' },
  { id: 9, userId: 'USR-009', name: 'Reza Hardiansyah', email: 'reza.hardiansyah@gmail.com', nim: '230101009', prodi: 'Ilmu Komunikasi', saldo: 'Rp 1.350.000', status: 'Aktif' }
];

interface UserManagementPageProps {
  fmtMoney?: (idr: string, usd: string) => string;
  users?: UserItem[];
  onAddUser?: (user: UserItem) => void;
}

export const UserManagementPage: React.FC<UserManagementPageProps> = ({
  fmtMoney = (idr) => idr,
  users: propUsers,
  onAddUser
}) => {
  const [internalUsers, setInternalUsers] = useState<UserItem[]>([]);
  const users = propUsers || internalUsers;
  const [userSearch, setUserSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadUsers = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchUsersList();
      if (data && data.length > 0) {
        const mapped: UserItem[] = data.map((u: any, idx: number) => ({
          id: u.id || idx + 1,
          userId: u.userId || u.user_id || `USR-${String(u.id || idx + 1).padStart(3, '0')}`,
          name: u.name || 'Pengguna',
          email: u.email || '',
          nim: u.nim || '-',
          prodi: u.prodi || 'Informatika',
          saldo: typeof u.saldo === 'number' ? `Rp ${u.saldo.toLocaleString('id-ID')}` : (u.saldo || 'Rp 0'),
          status: u.is_active === 0 || u.status === 'Nonaktif' ? 'Nonaktif' : 'Aktif',
        }));
        setInternalUsers(mapped);
      } else {
        setInternalUsers([]);
      }
    } catch (err: any) {
      console.warn('Backend users not available, setting empty list:', err.message);
      setInternalUsers([]);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadUsers();

    const handleFocus = () => {
      loadUsers();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

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

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const formattedSaldo = 'Rp ' + Number(newSaldo.replace(/\D/g, '') || 0).toLocaleString('id-ID');
    const trimmedInput = newNim.trim();
    let computedUserId = `USR-${String(users.length + 1).padStart(3, '0')}`;
    let computedNim = '-';

    if (trimmedInput) {
      if (trimmedInput.toUpperCase().startsWith('USR') || isNaN(Number(trimmedInput))) {
        computedUserId = trimmedInput.toUpperCase();
      } else {
        computedNim = trimmedInput;
      }
    }

    const newUser: UserItem = {
      id: Date.now(),
      userId: computedUserId,
      name: newName.trim(),
      email: newEmail.trim(),
      nim: computedNim,
      prodi: newProdi,
      saldo: formattedSaldo,
      status: newStatus
    };

    // Live send to backend API
    try {
      await createNewUser({
        name: newUser.name,
        email: newUser.email,
        nim: newUser.nim,
        userId: newUser.userId,
        prodi: newUser.prodi,
        saldo: newUser.saldo,
        status: newUser.status,
      });
    } catch (err: any) {
      console.warn('Backend create user failed or running offline, saved locally:', err.message);
    }

    if (onAddUser) {
      onAddUser(newUser);
    } else {
      setInternalUsers(prev => [newUser, ...prev]);
    }
    setIsModalOpen(false);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase()) || 
    (u.userId && u.userId.toLowerCase().includes(userSearch.toLowerCase())) ||
    u.nim.includes(userSearch) ||
    u.prodi.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto w-full animate-fadeIn text-xs">
      {/* Header strictly matching Figma */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#2D2825]">User Management</h1>
          <p className="text-[11px] text-[#8C7A70] mt-0.5">Kelola daftar akun pengguna dan hak akses sistem MoneyMate.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadUsers}
            className="px-3.5 py-1.5 bg-white border border-[#E5DDD8] text-[#5C2D16] text-xs font-bold rounded-xl shadow-sm hover:bg-[#FAF7F4] flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <RefreshCw className={'w-3.5 h-3.5 ' + (isRefreshing ? 'animate-spin' : '')} /> Segarkan
          </button>
          <button
            onClick={handleOpenModal}
            className="px-3.5 py-1.5 bg-[#5C2D16] text-white text-xs font-bold rounded-xl shadow hover:bg-[#462211] transition-all cursor-pointer"
          >
            + Tambah Pengguna Baru
          </button>
        </div>
      </div>

      <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="relative max-w-sm">
          <input
            type="text"
            placeholder="Cari nama, email, atau ID Pengguna..."
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
                <th className="py-2.5 px-4">ID Pengguna</th>
                <th className="py-2.5 px-4">Fakultas / Prodi</th>
                <th className="py-2.5 px-4">Saldo Dompet</th>
                <th className="py-2.5 px-4">Status Akun</th>
                <th className="py-2.5 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8E4]">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 px-4 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3 max-w-md mx-auto">
                      <div className="w-14 h-14 rounded-2xl bg-[#FAF4F0] border border-[#E8DCD8] flex items-center justify-center text-2xl shadow-xs">
                        👥
                      </div>
                      <div className="space-y-1">
                        <div className="font-bold text-[#2D2825] text-sm">Belum Ada Pengguna</div>
                        <p className="text-[11px] text-[#8C7A70] leading-relaxed">
                          Database backend belum memiliki data pengguna. Pengguna yang terdaftar via aplikasi Mobile (Flutter) maupun Web akan otomatis muncul di sini.
                        </p>
                      </div>
                      <button
                        onClick={handleOpenModal}
                        className="mt-2 px-3 py-1.5 bg-[#5C2D16] text-white font-bold rounded-xl text-xs hover:bg-[#43200F] transition-colors cursor-pointer"
                      >
                        + Tambah Pengguna Baru
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => {
                  const num = parseInt(u.saldo.replace(/\D/g, '') || '0', 10);
                  const usdStr = '$ ' + (num / 15500).toFixed(2);
                  return (
                    <tr key={u.id} className="hover:bg-[#FAF7F2] transition-colors">
                      <td className="py-3 px-4 font-bold text-[#2D2825]">
                        <div>{u.name}</div>
                        <div className="text-[10px] text-[#8C7A70] font-normal">{u.email}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-mono text-[11px] font-bold text-[#5C2D16] bg-[#FAF4F0] px-2.5 py-1 rounded-md border border-[#E8DCD8] inline-block shadow-xs">
                          {u.userId || `USR-${String(u.id).padStart(3, '0')}`}
                        </span>
                      </td>
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
                })
              )}
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
                <label className="text-[11px] font-bold text-[#2D2825] block mb-1">Nama Lengkap *</label>
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
                  <label className="text-[11px] font-bold text-[#2D2825] block mb-1">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="contoh@gmail.com"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-2 text-xs text-[#2D2825] focus:outline-none focus:border-[#5C2D16]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-[#2D2825] block mb-1">ID Pengguna</label>
                  <input
                    type="text"
                    placeholder="Contoh: USR-001"
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
