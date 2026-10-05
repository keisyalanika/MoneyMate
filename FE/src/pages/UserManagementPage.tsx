import React, { useState } from 'react';

interface UserManagementPageProps {
  fmtMoney: (idr: string, usd: string) => string;
}

export const UserManagementPage: React.FC<UserManagementPageProps> = ({ fmtMoney }) => {
  const [userSearch, setUserSearch] = useState('');

  const users = [
    { id: 1, name: 'Keisya Lanika', email: 'KeisyaExaHaniyah@gmail.com', nim: '10293841', prodi: 'Informatika', saldo: 'Rp 2.450.000' },
    { id: 2, name: 'Bima Santoso', email: 'bima.santoso@student.ac.id', nim: '10293842', prodi: 'Sistem Informasi', saldo: 'Rp 1.150.000' },
    { id: 3, name: 'Aulia Rahma', email: 'aulia.r@student.ac.id', nim: '10293843', prodi: 'Manajemen', saldo: 'Rp 4.800.000' },
    { id: 4, name: 'Rizky Aditya', email: 'rizky.a@student.ac.id', nim: '10293844', prodi: 'Teknik Elektro', saldo: 'Rp 850.000' },
    { id: 5, name: 'Nadia Putri', email: 'nadia.p@student.ac.id', nim: '10293845', prodi: 'Akuntansi', saldo: 'Rp 3.200.000' }
  ];

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.email.toLowerCase().includes(userSearch.toLowerCase()) || 
    u.nim.includes(userSearch)
  );

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto w-full animate-fadeIn text-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#2D2825]">User Management</h1>
          <p className="text-[11px] text-[#8C7A70] mt-0.5">Kelola daftar akun mahasiswa dan hak akses pengguna sistem MoneyMate.</p>
        </div>
        <button className="px-3.5 py-1.5 bg-[#5C2D16] text-white text-xs font-bold rounded-xl shadow hover:bg-[#462211] transition-all">
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
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-[#FAF7F2]">
                  <td className="py-3 px-4 font-bold text-[#2D2825]">
                    <div>{u.name}</div>
                    <div className="text-[10px] text-[#8C7A70] font-normal">{u.email}</div>
                  </td>
                  <td className="py-3 px-4 text-[#8C7A70]">{u.nim}</td>
                  <td className="py-3 px-4 text-[#8C7A70]">{u.prodi}</td>
                  <td className="py-3 px-4 font-mono font-bold text-[#5C2D16]">{fmtMoney(u.saldo, '$ ' + (parseInt(u.saldo.replace(/D/g, ''))/15500).toFixed(2))}</td>
                  <td className="py-3 px-4"><span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded font-semibold text-[10px]">Aktif</span></td>
                  <td className="py-3 px-4 text-right text-[#5C2D16] font-bold cursor-pointer hover:underline">Edit</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
