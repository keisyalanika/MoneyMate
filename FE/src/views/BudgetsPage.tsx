'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Download, Send, Eye, ThumbsUp } from 'lucide-react';
import { UserItem } from './UserManagementPage';

export interface BudgetsPageProps {
  onTriggerPdfToast: () => void;
  fmtMoney: (idr: string, usd: string) => string;
  users?: UserItem[];
  totalUsersCount?: number;
}

export interface StudentBudgetItem {
  id: string;
  name: string;
  semester: string;
  avatar: string;
  color: string;
  budget: string;
  realisasi: string;
  budgetNum: number;
  realisasiNum: number;
  percent: string;
  quotaText: string;
  isOver: boolean;
  catKritis: string;
  status: string;
  statusType: 'over' | 'waspada' | 'aman';
  actionType: 'send' | 'thumbs';
}

type ModalMode = 'send' | 'preview' | 'thumbs';

// Helper untuk menghitung status, kuota sisa/defisit, dan aksi berdasarkan batas pagu awal
function calculateBudgetMetrics(cfg: {
  id: string;
  name: string;
  semester: string;
  avatar: string;
  color: string;
  budgetNum: number;
  realisasiNum: number;
  catKritis: string;
}): StudentBudgetItem {
  const ratio = cfg.realisasiNum / cfg.budgetNum;
  const percent = (ratio * 100).toFixed(1) + '%';
  let status: string;
  let statusType: 'over' | 'waspada' | 'aman';
  let actionType: 'send' | 'thumbs';
  let quotaText: string;
  let isOver = false;

  // Batas per status sesuai pagu awal:
  // 1. Aman: realisasi < 70% dari anggaran awal -> Diberi icon/emoji jempol (ThumbsUp)
  // 2. Waspada: realisasi 70% s/d 90% dari anggaran awal -> Diberi tombol Send
  // 3. Over-Budget: realisasi > 90% dari anggaran awal -> Diberi tombol Send
  if (ratio < 0.70) {
    status = 'Aman';
    statusType = 'aman';
    actionType = 'thumbs';
    const sisa = cfg.budgetNum - cfg.realisasiNum;
    quotaText = `Sisa Rp ${sisa.toLocaleString('id-ID')}`;
  } else if (ratio <= 0.90) {
    status = 'Waspada';
    statusType = 'waspada';
    actionType = 'send';
    const sisa = cfg.budgetNum - cfg.realisasiNum;
    quotaText = `Sisa Rp ${sisa.toLocaleString('id-ID')}`;
  } else {
    status = 'Over-Budget';
    statusType = 'over';
    actionType = 'send';
    isOver = true;
    const defisit = cfg.realisasiNum - cfg.budgetNum;
    quotaText = `+Rp ${defisit.toLocaleString('id-ID')}`;
  }

  return {
    id: cfg.id,
    name: cfg.name,
    semester: cfg.semester,
    avatar: cfg.avatar,
    color: cfg.color,
    budget: `Rp ${cfg.budgetNum.toLocaleString('id-ID')}`,
    realisasi: `Rp ${cfg.realisasiNum.toLocaleString('id-ID')}`,
    budgetNum: cfg.budgetNum,
    realisasiNum: cfg.realisasiNum,
    percent,
    quotaText,
    isOver,
    catKritis: cfg.catKritis,
    status,
    statusType,
    actionType
  };
}

// 9 User dummy sinkron dengan UserManagement & Dashboard
const INITIAL_STUDENT_PRESETS = [
  {
    id: 'b1',
    name: 'Keisya Lanika',
    semester: '4',
    avatar: 'KL',
    color: 'bg-rose-100 text-rose-800',
    budgetNum: 2000000,
    realisasiNum: 2350000,
    catKritis: 'Makanan & Kos'
  },
  {
    id: 'b2',
    name: 'Bima Santoso',
    semester: '4',
    avatar: 'BS',
    color: 'bg-amber-100 text-amber-800',
    budgetNum: 1500000,
    realisasiNum: 1200000,
    catKritis: 'Hiburan & Nongkrong'
  },
  {
    id: 'b3',
    name: 'Aulia Rahma',
    semester: '4',
    avatar: 'AR',
    color: 'bg-emerald-100 text-emerald-800',
    budgetNum: 2500000,
    realisasiNum: 1625000,
    catKritis: 'Belanja Bulanan'
  },
  {
    id: 'b4',
    name: 'Rizky Aditya',
    semester: '4',
    avatar: 'RA',
    color: 'bg-emerald-100 text-emerald-800',
    budgetNum: 3000000,
    realisasiNum: 1800000,
    catKritis: 'Buku & Kuliah'
  },
  {
    id: 'b5',
    name: 'Nadia Putri',
    semester: '4',
    avatar: 'NP',
    color: 'bg-rose-100 text-rose-800',
    budgetNum: 1800000,
    realisasiNum: 2050000,
    catKritis: 'Transport & Lifestyle'
  },
  {
    id: 'b6',
    name: 'Ahmad Fauzi',
    semester: '4',
    avatar: 'AF',
    color: 'bg-amber-100 text-amber-800',
    budgetNum: 2000000,
    realisasiNum: 1560000,
    catKritis: 'Keperluan IT & Proyek'
  },
  {
    id: 'b7',
    name: 'Bambang Santoso',
    semester: '4',
    avatar: 'BS',
    color: 'bg-emerald-100 text-emerald-800',
    budgetNum: 2200000,
    realisasiNum: 1100000,
    catKritis: 'Operasional Harian'
  },
  {
    id: 'b8',
    name: 'Dewi Lestari',
    semester: '4',
    avatar: 'DL',
    color: 'bg-rose-100 text-rose-800',
    budgetNum: 2400000,
    realisasiNum: 2640000,
    catKritis: 'Perlengkapan Desain'
  },
  {
    id: 'b9',
    name: 'Reza Hardiansyah',
    semester: '4',
    avatar: 'RH',
    color: 'bg-emerald-100 text-emerald-800',
    budgetNum: 1800000,
    realisasiNum: 1080000,
    catKritis: 'Bahan Praktikum'
  }
];

export const BudgetsPage: React.FC<BudgetsPageProps> = ({
  onTriggerPdfToast,
  fmtMoney,
  users,
  totalUsersCount
}) => {
  const [budgetSearch, setBudgetSearch] = useState('');
  const [budgetTabFilter, setBudgetTabFilter] = useState<'All' | 'Aman' | 'Waspada' | 'Overbudget'>('All');
  const [budgetSemesterFilter, setBudgetSemesterFilter] = useState('All');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshToast, setRefreshToast] = useState(false);

  // Pagination State (Default 3 baris per halaman agar 9 user terbagi ke halaman 1, 2, 3)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  // Modal State
  const [selectedStudent, setSelectedStudent] = useState<StudentBudgetItem | null>(null);
  const [modalMode, setModalMode] = useState<ModalMode>('send');

  // Modal Form States (Opsi Tindakan Administratif)
  const [pushNotif, setPushNotif] = useState(true);
  const [autoLockdown, setAutoLockdown] = useState(true);
  const [counseling, setCounseling] = useState(false);
  const [voucherReward, setVoucherReward] = useState(true);
  const [aiCustomMessage, setAiCustomMessage] = useState('');

  // Toast State
  const [actionSuccessToast, setActionSuccessToast] = useState<string | null>(null);

  // Sinkronisasi data user dari usersList atau default INITIAL_STUDENT_PRESETS
  const studentBudgets: StudentBudgetItem[] = React.useMemo(() => {
    if (users && users.length > 0) {
      return users.map((u, idx) => {
        const preset = INITIAL_STUDENT_PRESETS.find(p => p.name.toLowerCase() === u.name.toLowerCase()) || INITIAL_STUDENT_PRESETS[idx % INITIAL_STUDENT_PRESETS.length];
        const initials = u.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
        return calculateBudgetMetrics({
          id: `b-${u.id || idx}`,
          name: u.name,
          semester: preset ? preset.semester : '4',
          avatar: initials || 'MM',
          color: preset ? preset.color : 'bg-emerald-100 text-emerald-800',
          budgetNum: preset ? preset.budgetNum : 2000000,
          realisasiNum: preset ? preset.realisasiNum : 1300000,
          catKritis: preset ? preset.catKritis : 'Operasional Harian'
        });
      });
    }

    return INITIAL_STUDENT_PRESETS.map(p => calculateBudgetMetrics(p));
  }, [users]);

  // Total user konsisten di seluruh halaman
  const totalUsers = users ? users.length : (totalUsersCount || studentBudgets.length);

  // Hitung metrik status
  const countAman = studentBudgets.filter(s => s.statusType === 'aman').length;
  const countWaspada = studentBudgets.filter(s => s.statusType === 'waspada').length;
  const countOver = studentBudgets.filter(s => s.statusType === 'over').length;

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setRefreshToast(true);
      setTimeout(() => setRefreshToast(false), 3500);
    }, 700);
  };

  // Open Modal in Send Mode (Waspada / Over-Budget)
  const handleOpenSendAction = (student: StudentBudgetItem) => {
    setSelectedStudent(student);
    setModalMode('send');
    setAiCustomMessage(
      `Halo ${student.name}, sistem MoneyMate mendeteksi pengeluaran kamu di pos ${student.catKritis} telah melampaui batas yang dianjurkan (${student.quotaText}). Tersisa 11 hari sebelum siklus kiriman berikutnya. Rekomendasi: Batasi transaksi belanja non-pokok agar cadangan kas tetap aman.`
    );
  };

  // Open Modal in Preview Mode
  const handleOpenPreviewAction = (student: StudentBudgetItem) => {
    setSelectedStudent(student);
    setModalMode('preview');
  };

  // Open Modal in Thumbs / Appreciation Mode (Status Aman)
  const handleOpenThumbsAction = (student: StudentBudgetItem) => {
    setSelectedStudent(student);
    setModalMode('thumbs');
    setAiCustomMessage(
      `Selamat ${student.name}! Sistem MoneyMate mencatat pengelolaan anggaran pos ${student.catKritis} kamu sangat disiplin bulan ini (${student.percent} dari pagu awal). Terus pertahankan kedisiplinan finansial ini!`
    );
  };

  // Confirm Actions
  const handleConfirmSend = () => {
    if (!selectedStudent) return;
    if (modalMode === 'send') {
      setActionSuccessToast(`Peringatan anggaran berhasil dikirimkan ke ${selectedStudent.name} via WhatsApp & Push Notifikasi!`);
    } else if (modalMode === 'thumbs') {
      setActionSuccessToast(`Apresiasi kedisiplinan finansial (👍 Jempol) berhasil dikirimkan ke ${selectedStudent.name}!`);
    }
    setSelectedStudent(null);
    setTimeout(() => setActionSuccessToast(null), 4500);
  };

  const handleRegenerateAi = () => {
    if (!selectedStudent) return;
    if (modalMode === 'send') {
      setAiCustomMessage(
        `Peringatan Otomatis: ${selectedStudent.name}, evaluasi sistem mendeteksi lonjakan di kategori ${selectedStudent.catKritis}. Segera amankan alokasi kebutuhan pokok dan aktifkan penguncian belanja otomatis hingga akhir bulan.`
      );
    } else {
      setAiCustomMessage(
        `Rekomendasi Apresiasi: ${selectedStudent.name} berhasil menghemat ${selectedStudent.quotaText} dari pagu bulanan. Voucher reward kantin kampus telah siap diaktifkan!`
      );
    }
  };

  // Filter Data
  const filteredStudentBudgets = studentBudgets.filter(b => {
    const matchSearch = b.name.toLowerCase().includes(budgetSearch.toLowerCase());
    const matchSemester = budgetSemesterFilter === 'All' ? true : b.semester === budgetSemesterFilter;
    const matchTab = budgetTabFilter === 'All' ? true :
      budgetTabFilter === 'Aman' ? b.statusType === 'aman' :
      budgetTabFilter === 'Waspada' ? b.statusType === 'waspada' :
      b.statusType === 'over';
    return matchSearch && matchSemester && matchTab;
  });

  // Reset page saat filter/search berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [budgetSearch, budgetSemesterFilter, budgetTabFilter, itemsPerPage]);

  // Perhitungan Pagination
  const totalPages = Math.max(1, Math.ceil(filteredStudentBudgets.length / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredStudentBudgets.length);
  const displayedBudgets = filteredStudentBudgets.slice(startIndex, endIndex);

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto w-full animate-fadeIn text-xs relative">
      {/* Toast Notifikasi Refresh */}
      {refreshToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#2D2825] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-emerald-500/50 animate-fadeIn">
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">✓</span>
          <span className="font-semibold text-xs">Data anggaran berhasil disegarkan!</span>
        </div>
      )}

      {/* Toast Aksi Terkirim */}
      {actionSuccessToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#2D2825] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-emerald-500/50 animate-fadeIn">
          <span className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">✓</span>
          <span className="font-semibold text-xs">{actionSuccessToast}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[#2D2825]">Pemantauan Budget Mahasiswa</h1>
          <p className="text-[11px] text-[#8C7A70] mt-0.5">
            Pantau kepatuhan anggaran mahasiswa secara real-time dan kirimkan intervensi terpersonalisasi.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg font-semibold text-[11px] flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Sinkronisasi Real-Time ({totalUsers} User)
          </span>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-orange-50 text-[#5C2D16] flex items-center justify-center font-bold text-sm">🔄</div>
            <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded-full">↑ +2.1% bln lalu</span>
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">RATA-RATA PEMAKAIAN BUDGET</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-[#2D2825]">68.4%</span>
              <span className="text-xs font-bold text-emerald-700">Status Sehat</span>
            </div>
          </div>
          <div className="w-full h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden">
            <div className="h-full bg-[#5C2D16] rounded-full" style={{ width: '68.4%' }}></div>
          </div>
        </div>

        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold text-sm">⚠️</div>
            <span className="px-2 py-0.5 text-[9px] font-bold bg-rose-100 text-rose-800 rounded-full">Kritis</span>
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">MAHASISWA OVER-BUDGET</div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-extrabold text-[#C25E38]">{countOver}</span>
              <span className="text-xs text-[#8C7A70]">Mahasiswa</span>
            </div>
          </div>
          <div className="text-[10px] text-[#8C7A70]">⚠️ <strong className="text-[#C25E38]">Butuh Edukasi Literasi & Konseling</strong></div>
        </div>

        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-stone-100 text-[#5C2D16] flex items-center justify-center font-bold text-sm">🏛️</div>
            <span className="px-2 py-0.5 text-[9px] font-bold bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] rounded-full">Aktif Semester Ini</span>
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">TOTAL ANGGARAN TERENCANA</div>
            <div className="text-lg font-extrabold text-[#2D2825] mt-0.5">{fmtMoney('Rp 19.200.000', '$ 1.238')}</div>
          </div>
          <div className="text-[10px] text-[#8C7A70]">Tercakup dalam {totalUsers} rekening dompet mahasiswa</div>
        </div>

        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold text-sm">🍴</div>
            <span className="px-2 py-0.5 text-[9px] font-bold bg-rose-100 text-rose-800 rounded-full">Defisit Tertinggi</span>
          </div>
          <div>
            <div className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">KATEGORI PALING JEBOL</div>
            <div className="text-base font-extrabold text-[#5C2D16] mt-0.5">Makanan & Kuliner</div>
          </div>
          <div className="text-[10px] text-[#8C7A70]"><strong className="text-rose-700 font-bold">{countOver} dari {totalUsers}</strong> mahasiswa melampaui alokasi pos ini</div>
        </div>
      </div>

      {/* Main Budget Monitoring Table Card */}
      <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm text-[#2D2825]">Daftar Pemantauan Budget Mahasiswa</h2>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#F5F2ED] border border-[#E5DDD8] text-[#5C2D16] rounded-full">
              Total: {totalUsers}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Tombol Unduh */}
            <button
              onClick={onTriggerPdfToast}
              className="px-3.5 py-1.5 bg-white border border-[#E5DDD8] text-[#5C2D16] text-xs font-bold rounded-xl shadow-sm hover:bg-[#FAF7F4] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" /> Unduh
            </button>

            {/* Tombol Segarkan */}
            <button
              onClick={handleRefreshData}
              className="px-3.5 py-1.5 bg-white border border-[#E5DDD8] text-[#5C2D16] text-xs font-bold rounded-xl shadow-sm hover:bg-[#FAF7F4] flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <RefreshCw className={'w-3.5 h-3.5 ' + (isRefreshing ? 'animate-spin' : '')} /> Segarkan
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 max-w-sm">
            <input
              type="text"
              placeholder="Cari nama mahasiswa..."
              value={budgetSearch}
              onChange={e => setBudgetSearch(e.target.value)}
              className="w-full bg-[#F5F2ED] border border-[#E5DDD8] rounded-xl px-3 py-1.5 text-xs text-[#2D2825] focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={budgetSemesterFilter}
              onChange={e => setBudgetSemesterFilter(e.target.value)}
              className="bg-[#F5F2ED] border border-[#E5DDD8] rounded-xl px-2.5 py-1.5 text-xs text-[#2D2825] focus:outline-none cursor-pointer"
            >
              <option value="All">Semua Tingkat Semester</option>
              <option value="4">Semester 3 - 4</option>
              <option value="2">Semester 1 - 2</option>
              <option value="6">Semester 5 - 6</option>
            </select>

            <div className="flex items-center bg-[#F5F2ED] p-0.5 rounded-xl text-xs font-medium text-[#6E5D53]">
              <button
                onClick={() => setBudgetTabFilter('All')}
                className={'px-2.5 py-1 rounded-lg transition-all cursor-pointer ' + (budgetTabFilter === 'All' ? 'bg-[#5C2D16] text-white font-bold' : 'hover:text-[#5C2D16]')}
              >
                Semua ({totalUsers})
              </button>
              <button
                onClick={() => setBudgetTabFilter('Aman')}
                className={'px-2.5 py-1 rounded-lg transition-all cursor-pointer ' + (budgetTabFilter === 'Aman' ? 'bg-[#5C2D16] text-white font-bold' : 'hover:text-[#5C2D16]')}
              >
                Aman ({countAman})
              </button>
              <button
                onClick={() => setBudgetTabFilter('Waspada')}
                className={'px-2.5 py-1 rounded-lg transition-all cursor-pointer ' + (budgetTabFilter === 'Waspada' ? 'bg-[#5C2D16] text-white font-bold' : 'hover:text-[#5C2D16]')}
              >
                Waspada ({countWaspada})
              </button>
              <button
                onClick={() => setBudgetTabFilter('Overbudget')}
                className={'px-2.5 py-1 rounded-lg transition-all cursor-pointer ' + (budgetTabFilter === 'Overbudget' ? 'bg-[#5C2D16] text-white font-bold' : 'hover:text-[#5C2D16]')}
              >
                Over-Budget ({countOver})
              </button>
            </div>
          </div>
        </div>

        {/* Table Data */}
        <div className="overflow-x-auto rounded-xl border border-[#F0E8E4]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F2] text-[#8C7A70] uppercase font-bold text-[10px] border-b border-[#F0E8E4]">
              <tr>
                <th className="py-3 px-4">MAHASISWA</th>
                <th className="py-3 px-4">BUDGET BULANAN</th>
                <th className="py-3 px-4">REALISASI PENGELUARAN</th>
                <th className="py-3 px-4">PERSENTASE &amp; KUOTA</th>
                <th className="py-3 px-4">KATEGORI KRITIS</th>
                <th className="py-3 px-4">STATUS</th>
                <th className="py-3 px-4 text-right">AKSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8E4]">
              {displayedBudgets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-[#8C7A70]">
                    Tidak ada data mahasiswa yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                displayedBudgets.map((b) => (
                  <tr key={b.id} className="hover:bg-[#FAF7F2] transition-colors">
                    {/* Kolom 1: Nama Pengguna (Clean, Tanpa Siswa & Tanpa NIM) */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className={'w-7 h-7 rounded-full font-bold flex items-center justify-center text-xs ' + b.color}>
                          {b.avatar}
                        </div>
                        <div>
                          <div className="font-bold text-[#2D2825]">{b.name}</div>
                        </div>
                      </div>
                    </td>

                    {/* Kolom 2: Budget */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2D2825]">{b.budget}</td>

                    {/* Kolom 3: Realisasi */}
                    <td className={'py-3.5 px-4 font-mono font-bold ' + (
                      b.isOver ? 'text-[#C25E38]' : b.statusType === 'aman' ? 'text-emerald-700' : 'text-amber-900'
                    )}>
                      {b.realisasi}
                    </td>

                    {/* Kolom 4: Persentase & Kuota */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 font-mono">
                        <span className="font-bold text-[#2D2825]">{b.percent}</span>
                        <span className={'text-[10px] ' + (b.isOver ? 'text-rose-700 font-bold' : b.statusType === 'aman' ? 'text-emerald-700 font-semibold' : 'text-amber-800 font-semibold')}>
                          ({b.quotaText})
                        </span>
                      </div>
                      <div className="w-28 h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden mt-1">
                        <div
                          className={'h-full rounded-full ' + (b.isOver ? 'bg-rose-600' : (b.statusType === 'waspada' ? 'bg-amber-600' : 'bg-emerald-600'))}
                          style={{ width: Math.min(parseFloat(b.percent), 100) + '%' }}
                        ></div>
                      </div>
                    </td>

                    {/* Kolom 5: Kategori Kritis */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 text-[11px] font-medium bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] rounded-lg flex items-center gap-1.5 w-max">
                        🍴 {b.catKritis}
                      </span>
                    </td>

                    {/* Kolom 6: Status */}
                    <td className="py-3.5 px-4">
                      <span className={'px-2.5 py-1 text-[10px] font-bold rounded-full border flex items-center gap-1 w-max ' + (
                        b.statusType === 'over' ? 'bg-rose-100 text-rose-800 border-rose-300' :
                        b.statusType === 'waspada' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                        'bg-emerald-100 text-emerald-800 border-emerald-300'
                      )}>
                        <span className="w-1.5 h-1.5 rounded-full fill-current"></span>
                        {b.status}
                      </span>
                    </td>

                    {/* Kolom 7: AKSI (Jika Status Aman: Emoji Jempol / ThumbsUp Icon) */}
                    <td className="py-3.5 px-4 text-right space-x-2">
                      {b.statusType === 'aman' ? (
                        <button
                          type="button"
                          onClick={() => handleOpenThumbsAction(b)}
                          title="Kirim Apresiasi Kedisiplinan (Status Aman)"
                          className="text-emerald-700 hover:text-emerald-900 p-1.5 rounded-lg hover:bg-emerald-100/60 cursor-pointer inline-flex items-center justify-center transition-colors shadow-2xs"
                        >
                          {/* Sesuai instruksi: jika statusnya aman, diberi emoji jempol / outline icon ThumbsUp */}
                          <ThumbsUp className="w-4 h-4 stroke-[2] text-emerald-700" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleOpenSendAction(b)}
                          title={b.statusType === 'waspada' ? "Kirim Pengingat Waspada" : "Kirim Peringatan Defisit Over-Budget"}
                          className="text-[#8C7A70] hover:text-[#C25E38] p-1.5 rounded-lg hover:bg-rose-50 cursor-pointer inline-flex items-center justify-center transition-colors"
                        >
                          <Send className="w-4 h-4 stroke-[1.8]" />
                        </button>
                      )}

                      {/* Tombol Lihat/Preview */}
                      <button
                        type="button"
                        onClick={() => handleOpenPreviewAction(b)}
                        title="Lihat Pratinjau Detail Budget"
                        className="text-[#8C7A70] hover:text-[#2D2825] p-1.5 rounded-lg hover:bg-[#FAF4F0] cursor-pointer inline-flex items-center justify-center transition-colors"
                      >
                        <Eye className="w-4 h-4 stroke-[1.8]" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer & Working Dynamic Pagination (Halaman 1, 2, 3...) */}
        <div className="pt-3 border-t border-[#F0E8E4] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#8C7A70]">
          <div>
            Menampilkan <strong className="text-[#2D2825]">{filteredStudentBudgets.length === 0 ? 0 : startIndex + 1} - {endIndex}</strong> dari <strong className="text-[#2D2825]">{filteredStudentBudgets.length}</strong> Mahasiswa
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-[11px]">
              <span>Baris per halaman:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="px-2 py-0.5 bg-[#FAF4F0] border border-[#E8DCD8] rounded font-bold text-[#5C2D16] focus:outline-none cursor-pointer"
              >
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={10}>10</option>
              </select>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={safeCurrentPage === 1}
                className={'w-6 h-6 rounded flex items-center justify-center transition-colors ' + (
                  safeCurrentPage === 1 ? 'text-stone-300 cursor-not-allowed' : 'hover:bg-stone-200 text-stone-700 cursor-pointer'
                )}
                title="Halaman Sebelumnya"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => setCurrentPage(pageNum)}
                  className={'w-6 h-6 rounded flex items-center justify-center text-xs transition-all cursor-pointer ' + (
                    safeCurrentPage === pageNum
                      ? 'bg-[#4A2613] text-white font-bold shadow-xs'
                      : 'hover:bg-stone-200 text-stone-700 font-medium'
                  )}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={safeCurrentPage === totalPages || totalPages === 0}
                className={'w-6 h-6 rounded flex items-center justify-center transition-colors ' + (
                  safeCurrentPage === totalPages || totalPages === 0 ? 'text-stone-300 cursor-not-allowed' : 'hover:bg-stone-200 text-stone-700 cursor-pointer'
                )}
                title="Halaman Selanjutnya"
              >
                ›
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Policy Banner */}
      <div className="bg-[#FAF0EA] border border-[#ECD9CE] rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#3D2314] text-white flex items-center justify-center text-lg shrink-0 shadow-xs">
            🎓
          </div>
          <div>
            <h3 className="font-bold text-xs text-[#2D2825]">Kebijakan Finansial Kampus MoneyMate</h3>
            <p className="text-[11px] text-[#554A43] mt-0.5">
              Mahasiswa dengan rasio pengeluaran &gt; 110% selama 2 bulan berturut-turut akan secara otomatis dialokasikan modul micro-learning &quot;Smart Budgeting Mahasiswa&quot; di portal akademik.
            </p>
          </div>
        </div>

        <button className="text-xs font-bold text-[#C25E38] hover:text-[#8C5338] hover:underline shrink-0 flex items-center gap-1 cursor-pointer">
          <span>Lihat Pedoman Lengkap</span>
          <span>→</span>
        </button>
      </div>

      {/* ================================================================================= */}
      {/* MODAL AKSI (SEND / PREVIEW / THUMBS APRESIASI)                                     */}
      {/* ================================================================================= */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fadeIn">
          <div className="bg-[#FAF7F4] border border-[#E5DDD8] rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl space-y-4 text-xs text-[#2D2825] my-auto relative">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-3 border-b border-[#E8DFD8] pb-3.5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#F5EDE8] border border-[#ECD9CE] text-[#C25E38] flex items-center justify-center text-lg shrink-0 mt-0.5 shadow-2xs">
                  {modalMode === 'send' ? '📡' : modalMode === 'thumbs' ? '👍' : '👁️'}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-[#FAF0EB] text-[#5C2D16] rounded-md border border-[#E8D6CB]">
                      {selectedStudent.name} • Smt {selectedStudent.semester}
                    </span>
                    {modalMode === 'preview' && (
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-amber-100 text-amber-900 rounded-md border border-amber-200">
                        Mode Pratinjau
                      </span>
                    )}
                    {modalMode === 'thumbs' && (
                      <span className="px-2 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-900 rounded-md border border-emerald-200">
                        Status Aman (👍 Jempol)
                      </span>
                    )}
                  </div>

                  <h2 className="text-base font-bold text-[#2D2825] mt-1">
                    {modalMode === 'send'
                      ? 'Kirim Peringatan Defisit Anggaran'
                      : modalMode === 'thumbs'
                      ? 'Kirim Apresiasi Kedisiplinan Finansial'
                      : `Pratinjau Status & Audit Anggaran: ${selectedStudent.name}`}
                  </h2>
                  <p className="text-[11px] text-[#8C7A70] mt-0.5">
                    {modalMode === 'send'
                      ? 'Terdeteksi pengeluaran melampaui batas bulanan mahasiswa lebih cepat dari estimasi siklus.'
                      : modalMode === 'thumbs'
                      ? 'Mahasiswa berhasil mempertahankan rasio belanja sehat di bawah batas aman pagu bulanan.'
                      : 'Tinjauan menyeluruh histori alokasi pagu, komposisi pengeluaran, dan kepatuhan finansial mahasiswa.'}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="text-[#8C7A70] hover:text-[#2D2825] p-1 text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* 3 Metric Stat Cards */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* Card 1 */}
              <div className="p-3 bg-[#FAF0EB] border border-[#E8D6CB] rounded-xl space-y-0.5">
                <div className="flex items-center justify-between text-[9px] font-bold text-[#8C7A70] uppercase">
                  <span>{modalMode === 'preview' ? 'TOTAL REALISASI' : modalMode === 'thumbs' ? 'SISA SALDO AMAN' : 'DEFISIT TERCATAT'}</span>
                  <span>{modalMode === 'thumbs' ? '👍' : '↗'}</span>
                </div>
                <div className={`text-base font-black ${modalMode === 'thumbs' ? 'text-emerald-700' : selectedStudent.isOver ? 'text-[#C25E38]' : 'text-[#5C2D16]'}`}>
                  {modalMode === 'preview' ? selectedStudent.realisasi : selectedStudent.quotaText}
                </div>
                <div className="text-[9px] text-[#C25E38] font-bold">
                  • {selectedStudent.percent} dari Pagu {selectedStudent.budget}
                </div>
              </div>

              {/* Card 2 */}
              <div className="p-3 bg-[#FAF0EB] border border-[#E8D6CB] rounded-xl space-y-0.5">
                <div className="flex items-center justify-between text-[9px] font-bold text-[#8C7A70] uppercase">
                  <span>{modalMode === 'preview' ? 'STATUS KEPATUHAN' : 'SISA WAKTU SIKLUS'}</span>
                  <span>📅</span>
                </div>
                <div className="text-base font-black text-[#2D2825]">
                  {modalMode === 'preview' ? selectedStudent.status : '11 Hari Lagi'}
                </div>
                <div className="text-[9px] text-[#8C7A70]">
                  {modalMode === 'preview' ? selectedStudent.quotaText : 'Siklus kiriman: tgl 1 tiap bulan'}
                </div>
              </div>

              {/* Card 3 */}
              <div className="p-3 bg-[#FAF0EB] border border-[#E8D6CB] rounded-xl space-y-0.5">
                <div className="flex items-center justify-between text-[9px] font-bold text-[#8C7A70] uppercase">
                  <span>{modalMode === 'thumbs' ? 'POS PALING HEMAT' : 'POS KRITIS UTAMA'}</span>
                  <span>🍴</span>
                </div>
                <div className="text-sm font-black text-[#5C2D16] truncate" title={selectedStudent.catKritis}>
                  {selectedStudent.catKritis}
                </div>
                <div className="text-[9px] text-[#8C7A70] font-mono">
                  {modalMode === 'thumbs' ? 'Pengeluaran sangat terkontrol' : 'Rp 950.000 / Rp 600.000'}
                </div>
              </div>
            </div>

            {/* Realization Progress Box */}
            <div className="p-3.5 bg-[#FAF0EB] border border-[#E8D6CB] rounded-2xl space-y-2">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#2D2825]">
                  Realisasi Pos {selectedStudent.catKritis} ({selectedStudent.percent} {selectedStudent.isOver ? 'Melampaui Batas' : 'Terpakai'})
                </span>
                <span className={`font-black ${selectedStudent.isOver ? 'text-[#C25E38]' : 'text-emerald-700'}`}>
                  {selectedStudent.isOver ? `Defisit ${selectedStudent.quotaText}` : selectedStudent.quotaText}
                </span>
              </div>

              <div className="w-full h-2.5 bg-[#E2D4CD] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    selectedStudent.isOver
                      ? 'bg-gradient-to-r from-amber-500 to-[#C25E38]'
                      : selectedStudent.statusType === 'waspada'
                      ? 'bg-amber-600'
                      : 'bg-emerald-600'
                  }`}
                  style={{ width: Math.min(parseFloat(selectedStudent.percent), 100) + '%' }}
                ></div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#8C7A70]">
                <span>Rp 0 (Awal)</span>
                <span>Batas Aman: {selectedStudent.budget}</span>
                <span className="font-bold text-[#5C2D16]">Tercapai: {selectedStudent.realisasi}</span>
              </div>
            </div>

            {/* Mode Preview vs Mode Kirim/Thumbs */}
            {modalMode === 'preview' ? (
              /* ================== TAMPILAN MODE PREVIEW ================== */
              <div className="space-y-3">
                {/* Rincian Komposisi Pengeluaran */}
                <div className="bg-white border border-[#E5DDD8] rounded-2xl p-3.5 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#2D2825] flex items-center gap-1.5">
                      <span>📊</span> Komposisi Pengeluaran Finansial Mahasiswa
                    </span>
                    <span className="px-2 py-0.5 text-[9px] font-bold bg-[#FAF4F0] text-[#5C2D16] border border-[#E6D4CB] rounded">
                      Rekam Jejak Terverifikasi
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#554A43]">{selectedStudent.catKritis} (Pos Terbesar)</span>
                        <strong className="text-[#2D2825]">42% • Rp 987.000</strong>
                      </div>
                      <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#5C2D16] rounded-full" style={{ width: '42%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#554A43]">Kebutuhan Studi &amp; Akademik</span>
                        <strong className="text-[#2D2825]">28% • Rp 658.000</strong>
                      </div>
                      <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-600 rounded-full" style={{ width: '28%' }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-[#554A43]">Transportasi &amp; Penunjang Lain</span>
                        <strong className="text-[#2D2825]">30% • Rp 705.000</strong>
                      </div>
                      <div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-600 rounded-full" style={{ width: '30%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Audit AI Analysis */}
                <div className="bg-[#FAF4F0] border border-[#E6D4CB] rounded-2xl p-3.5 space-y-1.5">
                  <div className="font-bold text-[#5C2D16] flex items-center gap-1.5">
                    <span>🤖</span> Evaluasi Pola Transaksi Mahasiswa (AI Insight)
                  </div>
                  <p className="text-[11px] text-[#554A43] leading-relaxed">
                    Berdasarkan audit pola transaksi, <strong>{selectedStudent.name}</strong> menunjukkan kedisiplinan baik pada alokasi biaya akademik, dengan sisa saldo aman tercatat. Rekam jejak transaksi tercatat rapi dan akuntabel.
                  </p>
                </div>

                {/* Rekam Jejak Audit */}
                <div className="p-3 bg-white border border-[#E5DDD8] rounded-xl space-y-1 text-[11px] text-[#554A43]">
                  <div className="flex justify-between py-0.5 border-b border-[#F0E8E4]">
                    <span>✓ Sinkronisasi Rekening Bank Kampus:</span>
                    <strong className="text-emerald-700">Terkoneksi Aktif</strong>
                  </div>
                  <div className="flex justify-between py-0.5 border-b border-[#F0E8E4]">
                    <span>✓ Rekomendasi Batas Belanja Harian:</span>
                    <strong className="text-[#2D2825]">Rp 45.000 / hari</strong>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span>⏱️ Riwayat Intervensi Semester Ini:</span>
                    <strong className="text-[#8C7A70]">Belum pernah ada peringatan tercatat</strong>
                  </div>
                </div>
              </div>
            ) : (
              /* ================== TAMPILAN MODE KIRIM / THUMBS ================== */
              <div className="space-y-3">
                {/* Draft Pesan Intervensi Cerdas (AI Kampus) */}
                <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 space-y-2.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#2D2825] flex items-center gap-1.5">
                      <span>🤖</span> {modalMode === 'thumbs' ? 'Draft Pesan Apresiasi (AI Kampus)' : 'Draft Pesan Intervensi Cerdas (AI Kampus)'}
                    </span>
                    <span className="px-2 py-0.5 text-[9px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded">
                      • Rekomendasi Terpersonalisasi
                    </span>
                  </div>

                  <p className="text-xs text-[#554A43] leading-relaxed bg-[#FAF7F4] p-3 rounded-xl border border-[#E8DFD8]">
                    {aiCustomMessage}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-[#8C7A70] pt-0.5">
                    <span>⚙️ Dihasilkan dari Pola Transaksi Mingguan</span>
                    <button
                      type="button"
                      onClick={handleRegenerateAi}
                      className="font-bold text-[#5C2D16] hover:underline cursor-pointer"
                    >
                      Regenerate AI
                    </button>
                  </div>
                </div>

                {/* Opsi Tindakan */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">
                    {modalMode === 'thumbs' ? 'OPSI APRESIASI MAHASISWA' : 'OPSI TINDAKAN ADMINISTRATIF'}
                  </div>

                  {modalMode === 'thumbs' ? (
                    <div className="space-y-2">
                      <label className="flex items-start gap-2.5 cursor-pointer p-2 bg-white rounded-xl border border-[#E5DDD8]">
                        <input
                          type="checkbox"
                          checked={pushNotif}
                          onChange={e => setPushNotif(e.target.checked)}
                          className="accent-[#5C2D16] w-4 h-4 mt-0.5 rounded cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-xs text-[#2D2825]">Kirimkan Notifikasi Apresiasi &amp; Badge Disiplin Finansial 🎖️</div>
                          <div className="text-[10px] text-[#8C7A70]">Kirimkan pesan apresiasi langsung ke dashboard aplikasi MoneyMate mahasiswa.</div>
                        </div>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer p-2 bg-white rounded-xl border border-[#E5DDD8]">
                        <input
                          type="checkbox"
                          checked={voucherReward}
                          onChange={e => setVoucherReward(e.target.checked)}
                          className="accent-[#5C2D16] w-4 h-4 mt-0.5 rounded cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-xs text-[#2D2825]">Berikan Voucher Diskon Kantin Mitra Kampus 🍽️</div>
                          <div className="text-[10px] text-[#8C7A70]">Klaim promo makan hemat 15% di kantin kampus binaan institusi.</div>
                        </div>
                      </label>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <label className="flex items-start gap-2.5 cursor-pointer p-2 bg-white rounded-xl border border-[#E5DDD8]">
                        <input
                          type="checkbox"
                          checked={pushNotif}
                          onChange={e => setPushNotif(e.target.checked)}
                          className="accent-[#5C2D16] w-4 h-4 mt-0.5 rounded cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-xs text-[#2D2825]">Kirimkan Push Notifikasi &amp; WhatsApp Bot Kampus 📟</div>
                          <div className="text-[10px] text-[#8C7A70]">
                            Pesan langsung dikirimkan ke aplikasi MoneyMate mahasiswa dan nomor terdaftar (+62 821-****-9821).
                          </div>
                        </div>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer p-2 bg-white rounded-xl border border-[#E5DDD8]">
                        <input
                          type="checkbox"
                          checked={autoLockdown}
                          onChange={e => setAutoLockdown(e.target.checked)}
                          className="accent-[#5C2D16] w-4 h-4 mt-0.5 rounded cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-xs text-[#2D2825]">Kunci Pembelian Kategori Fleksibel (Auto-Lockdown) 🔒</div>
                          <div className="text-[10px] text-[#8C7A70]">
                            Nonaktifkan kuota dompet kampus untuk merchant kafe mitra selama sisa 11 hari siklus ini.
                          </div>
                        </div>
                      </label>

                      <label className="flex items-start gap-2.5 cursor-pointer p-2 bg-white rounded-xl border border-[#E5DDD8]">
                        <input
                          type="checkbox"
                          checked={counseling}
                          onChange={e => setCounseling(e.target.checked)}
                          className="accent-[#5C2D16] w-4 h-4 mt-0.5 rounded cursor-pointer"
                        />
                        <div>
                          <div className="font-bold text-xs text-[#554A43]">Alokasikan ke Konseling Keuangan BAAK ☕</div>
                          <div className="text-[10px] text-[#8C7A70]">
                            Jadwalkan sesi pendampingan manajerial keuangan pribadi gratis dengan konselor kemahasiswaan.
                          </div>
                        </div>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Modal Footer */}
            <div className="pt-3 border-t border-[#E8DFD8] flex items-center justify-between">
              <span className="text-[11px] text-[#8C7A70] flex items-center gap-1">
                <span>⏱️</span> Peringatan terakhir: Belum pernah
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-2 border border-[#E5DDD8] bg-white text-[#6E5D53] hover:text-[#2D2825] font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  {modalMode === 'preview' ? 'Tutup Pratinjau' : 'Batal / Tunda'}
                </button>

                {modalMode === 'preview' ? (
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedStudent.statusType === 'aman') {
                        setModalMode('thumbs');
                      } else {
                        setModalMode('send');
                      }
                    }}
                    className="px-4 py-2 bg-[#4A2613] hover:bg-[#381B0C] text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 cursor-pointer transition-all"
                  >
                    <span>{selectedStudent.statusType === 'aman' ? '👍 Beri Apresiasi' : '➤ Kirim Peringatan'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleConfirmSend}
                    className="px-4 py-2 bg-[#4A2613] hover:bg-[#381B0C] text-white font-bold text-xs rounded-xl shadow flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <span>{modalMode === 'thumbs' ? '👍' : '➤'}</span>
                    <span>{modalMode === 'thumbs' ? 'Kirimkan Apresiasi Sekarang' : 'Kirimkan Peringatan Sekarang'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BudgetsPage;
