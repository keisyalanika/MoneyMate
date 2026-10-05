import React, { useState } from "react";
import {
  Filter,
  MoreVertical,
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { AdminLayout } from "../layouts/AdminLayout";

interface User {
  id: number;
  name: string;
  email: string;
  financialType: string;
  status: string;
  statusType: "critical" | "good" | "warning";
  joinedDate: string;
  initials: string;
  avatarBg: string;
  aiMessage?: string;
}

export const UserManagementPage: React.FC = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const users: User[] = [
    {
      id: 1,
      name: "Aulia Rahma",
      email: "aulia.r@student.univ.edu",
      financialType: "Single Income",
      status: "Critical • Sering Overbudget",
      statusType: "critical",
      joinedDate: "12 Sep 2026",
      initials: "AR",
      avatarBg: "bg-orange-100 text-orange-700",
      aiMessage:
        "Pengguna sering melakukan pengeluaran impulsif di kategori hiburan.",
    },
    {
      id: 2,
      name: "Rizky Aditya",
      email: "rizky.adit@student.univ.edu",
      financialType: "Multi Income",
      status: "Good • Surplus Stabil",
      statusType: "good",
      joinedDate: "05 Okt 2026",
      initials: "RA",
      avatarBg: "bg-emerald-100 text-emerald-700",
      aiMessage: "Kondisi keuangan sehat dengan rasio tabungan di atas 30%.",
    },
    {
      id: 3,
      name: "Keisya Lanika",
      email: "keisya.l@student.univ.edu",
      financialType: "Single Income",
      status: "Warning • Mendekati Limit",
      statusType: "warning",
      joinedDate: "20 Okt 2026",
      initials: "KL",
      avatarBg: "bg-amber-100 text-amber-700",
      aiMessage:
        "Perlu membatasi anggaran bulanan agar tidak melewati batas aman.",
    },
    {
      id: 4,
      name: "Bima Santoso",
      email: "bima.snt@student.univ.edu",
      financialType: "Multi Income",
      status: "Good • Tabungan Naik",
      statusType: "good",
      joinedDate: "22 Okt 2026",
      initials: "BS",
      avatarBg: "bg-emerald-100 text-emerald-700",
      aiMessage: "Pemasokan dana tambahan berjalan konsisten setiap bulannya.",
    },
    {
      id: 5,
      name: "Nadia Putri",
      email: "nadia.ptr@student.univ.edu",
      financialType: "Single Income",
      status: "Critical • Budget Habis",
      statusType: "critical",
      joinedDate: "24 Okt 2026",
      initials: "NP",
      avatarBg: "bg-orange-100 text-orange-700",
      aiMessage:
        "Sisa saldo kritis, memerlukan intervensi alokasi dana darurat.",
    },
  ];

  return (
    <AdminLayout activeMenu="User Management">
      <div className="space-y-6 font-sans">
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-[#3D2314]">
                Manajemen Pengguna
              </h1>
              <span className="bg-[#EAF3DE] text-[#276749] text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                1.245 Total Mahasiswa
              </span>
            </div>
            <p className="text-sm text-[#7C6A5B] mt-1">
              Kelola data mahasiswa dan pantau skor kesehatan finansial mereka
              secara real-time.
            </p>
          </div>
          <button className="bg-white border border-[#EEDFD2] hover:bg-[#F9ECE3]/50 text-[#3D2314] px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-sm transition-all">
            <Filter size={16} />
            <span>Filter Status</span>
          </button>
        </div>

        {/* Statistic Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#EEDFD2] shadow-sm">
            <p className="text-[11px] font-bold text-[#8C7A6B] uppercase tracking-wider">
              KONDISI PRIMA (GOOD)
            </p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-[#3D2314]">
                842
              </span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                67.6%
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EEDFD2] shadow-sm">
            <p className="text-[11px] font-bold text-[#8C7A6B] uppercase tracking-wider">
              PERLU PERHATIAN (WARNING)
            </p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-[#3D2314]">
                278
              </span>
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">
                22.3%
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EEDFD2] shadow-sm">
            <p className="text-[11px] font-bold text-[#8C7A6B] uppercase tracking-wider">
              KRITIS (CRITICAL)
            </p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-[#3D2314]">
                125
              </span>
              <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-lg">
                10.1%
              </span>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#EEDFD2] shadow-sm">
            <p className="text-[11px] font-bold text-[#8C7A6B] uppercase tracking-wider">
              PENDAFTARAN BULAN INI
            </p>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-extrabold text-[#3D2314]">
                +156
              </span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                +12.5%
              </span>
            </div>
          </div>
        </div>

        {/* User Table Card */}
        <div className="bg-white rounded-2xl border border-[#EEDFD2] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#EEDFD2] text-[11px] font-bold text-[#8C7A6B] uppercase tracking-wider bg-[#FDF8F2]/60">
                  <th className="py-4 px-6">Informasi Pengguna</th>
                  <th className="py-4 px-6">Tipe Finansial</th>
                  <th className="py-4 px-6">Status AI Health</th>
                  <th className="py-4 px-6">Tgl Bergabung</th>
                  <th className="py-4 px-6 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEDFD2]/60 text-sm">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-[#F9ECE3]/20 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-xl ${user.avatarBg} font-bold flex items-center justify-center text-sm shadow-sm`}
                        >
                          {user.initials}
                        </div>
                        <div>
                          <p className="font-bold text-[#3D2314]">
                            {user.name}
                          </p>
                          <p className="text-xs text-[#7C6A5B]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="bg-[#F9ECE3]/60 border border-[#EEDFD2] text-[#5C4A3D] text-xs font-medium px-3 py-1 rounded-full">
                        {user.financialType}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                          user.statusType === "critical"
                            ? "bg-red-50 text-red-700 border-red-200"
                            : user.statusType === "warning"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-emerald-50 text-emerald-700 border-emerald-200"
                        }`}
                      >
                        {user.statusType === "critical" && (
                          <AlertTriangle size={12} />
                        )}
                        {user.statusType === "warning" && <Clock size={12} />}
                        {user.statusType === "good" && (
                          <CheckCircle2 size={12} />
                        )}
                        {user.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-[#7C6A5B] text-xs font-medium">
                      {user.joinedDate}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="bg-white hover:bg-[#F9ECE3] text-[#3D2314] border border-[#EEDFD2] px-3 py-1.5 rounded-lg text-xs font-medium transition-all shadow-sm"
                        >
                          Detail
                        </button>
                        <button className="text-[#7C6A5B] hover:text-[#3D2314] p-1.5 rounded-lg hover:bg-[#F9ECE3]/50">
                          <MoreVertical size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="p-4 border-t border-[#EEDFD2] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7C6A5B]">
            <p>
              Menampilkan 1 hingga 5 dari{" "}
              <span className="font-bold text-[#3D2314]">1.245</span> pengguna
            </p>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 border border-[#EEDFD2] rounded-lg hover:bg-white disabled:opacity-50">
                Sebelumnya
              </button>
              <button className="px-3 py-1.5 bg-[#5C3317] text-white rounded-lg font-bold shadow-sm">
                1
              </button>
              <button className="px-3 py-1.5 border border-[#EEDFD2] rounded-lg hover:bg-white">
                2
              </button>
              <button className="px-3 py-1.5 border border-[#EEDFD2] rounded-lg hover:bg-white">
                3
              </button>
              <span className="px-2">...</span>
              <button className="px-3 py-1.5 border border-[#EEDFD2] rounded-lg hover:bg-white">
                250
              </button>
              <button className="px-3 py-1.5 border border-[#EEDFD2] rounded-lg hover:bg-white">
                Selanjutnya
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#EEDFD2] rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedUser(null)}
              className="absolute top-4 right-4 text-[#7C6A5B] hover:text-[#3D2314] bg-[#FDF8F2] p-2 rounded-full border border-[#EEDFD2]"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div
                className={`w-14 h-14 rounded-2xl ${selectedUser.avatarBg} font-bold text-lg flex items-center justify-center shadow-sm`}
              >
                {selectedUser.initials}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#3D2314]">
                  {selectedUser.name}
                </h3>
                <p className="text-xs text-[#7C6A5B]">{selectedUser.email}</p>
              </div>
            </div>

            <div className="space-y-3 text-sm bg-[#FDF8F2] p-4 rounded-xl border border-[#EEDFD2] mb-6">
              <div className="flex justify-between">
                <span className="text-[#7C6A5B]">Tipe Finansial:</span>
                <span className="font-bold text-[#3D2314]">
                  {selectedUser.financialType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7C6A5B]">Status AI Health:</span>
                <span className="font-bold text-[#3D2314]">
                  {selectedUser.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7C6A5B]">Tanggal Bergabung:</span>
                <span className="font-bold text-[#3D2314]">
                  {selectedUser.joinedDate}
                </span>
              </div>
              {selectedUser.aiMessage && (
                <div className="pt-3 border-t border-[#EEDFD2]">
                  <p className="text-[11px] font-bold text-[#8C7A6B] uppercase tracking-wider mb-1">
                    Status Diagnosis AI
                  </p>
                  <p className="text-xs font-medium text-[#5C3317]">
                    {selectedUser.aiMessage}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedUser(null)}
              className="bg-[#5C3317] text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm hover:bg-[#5C3317]/90 w-full"
            >
              Tutup Detail
            </button>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};
