import React, { useState } from 'react';

interface SettingsPageProps {
  onTriggerSaveToast?: () => void;
  fmtMoney?: (idr: string, usd: string) => string;
}

export interface CategoryItem {
  id: string;
  name: string;
  subtext: string;
  type: 'Pengeluaran' | 'Pemasukan';
  icon: string;
  badgeBg: string;
  badgeText: string;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onTriggerSaveToast, fmtMoney }) => {
  // Category Filter state
  const [filterType, setFilterType] = useState<'Semua' | 'Pengeluaran' | 'Pemasukan'>('Semua');

  // Categories Data State
  const [categories, setCategories] = useState<CategoryItem[]>([
    { id: 'c1', name: 'Makanan & Minuman', subtext: 'Pagu harian & konsumsi kantin', type: 'Pengeluaran', icon: '🍴', badgeBg: 'bg-rose-100/70', badgeText: 'text-rose-800' },
    { id: 'c2', name: 'Tempat Tinggal & Kos', subtext: 'Sewa bulanan atau semesteran', type: 'Pengeluaran', icon: '🏠', badgeBg: 'bg-rose-100/70', badgeText: 'text-rose-800' },
    { id: 'c3', name: 'Akademik & Kuliah / UKT', subtext: 'Biaya kuliah wajib & buku studi', type: 'Pengeluaran', icon: '🎓', badgeBg: 'bg-rose-100/70', badgeText: 'text-rose-800' },
    { id: 'c4', name: 'Transportasi Kampus', subtext: 'Bensin, commuter line, dan ojek', type: 'Pengeluaran', icon: '🚌', badgeBg: 'bg-rose-100/70', badgeText: 'text-rose-800' },
    { id: 'c5', name: 'Beasiswa & Hibah', subtext: 'KIP-K & tunjangan rektorat', type: 'Pemasukan', icon: '💵', badgeBg: 'bg-emerald-100/80', badgeText: 'text-emerald-800' },
    { id: 'c6', name: 'Kiriman Orang Tua / Honor', subtext: 'Pemasukan bulanan mandiri', type: 'Pemasukan', icon: '🏛️', badgeBg: 'bg-emerald-100/80', badgeText: 'text-emerald-800' },
    { id: 'c7', name: 'Hiburan & Ekstrakurikuler', subtext: 'Kegiatan UKM & hobi mahasiswa', type: 'Pengeluaran', icon: '🎮', badgeBg: 'bg-rose-100/70', badgeText: 'text-rose-800' },
  ]);

  // Form States for Right Cards
  const [paguNominal, setPaguNominal] = useState('2.500.000');
  const [ewsEnabled, setEwsEnabled] = useState(true);

  // Modal State for Add/Edit Category
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatSubtext, setNewCatSubtext] = useState('');
  const [newCatType, setNewCatType] = useState<'Pengeluaran' | 'Pemasukan'>('Pengeluaran');
  const [newCatIcon, setNewCatIcon] = useState('🏷️');

  // Toast Notification State
  const [showSavedToast, setShowSavedToast] = useState(false);

  const handleSaveSettings = () => {
    setShowSavedToast(true);
    if (onTriggerSaveToast) onTriggerSaveToast();
    setTimeout(() => setShowSavedToast(false), 5000);
  };

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const newItem: CategoryItem = {
      id: 'c' + (categories.length + 1),
      name: newCatName,
      subtext: newCatSubtext || 'Kategori tambahan kampus',
      type: newCatType,
      icon: newCatIcon || '🏷️',
      badgeBg: newCatType === 'Pengeluaran' ? 'bg-rose-100/70' : 'bg-emerald-100/80',
      badgeText: newCatType === 'Pengeluaran' ? 'text-rose-800' : 'text-emerald-800'
    };

    setCategories([newItem, ...categories]);
    setShowAddModal(false);
    setNewCatName('');
    setNewCatSubtext('');

    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 5000);
  };

  const filteredCategories = categories.filter(c => {
    if (filterType === 'Semua') return true;
    return c.type === filterType;
  });

  const countPengeluaran = categories.filter(c => c.type === 'Pengeluaran').length;
  const countPemasukan = categories.filter(c => c.type === 'Pemasukan').length;

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto w-full animate-fadeIn text-xs relative">
      {/* Top Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="text-[11px] text-[#8C7A70] flex items-center gap-1 mb-0.5 font-medium">
            <span>Manajemen</span>
            <span>›</span>
            <span className="font-semibold text-[#5C2D16]">Settings & Kategori</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[9px] font-bold bg-[#E6D0C7] text-[#5C2D16] rounded uppercase flex items-center gap-1">
              ⚙️ PENGATURAN & ATURAN SISTEM
            </span>
          </div>

          <h1 className="text-2xl font-bold text-[#2D2825] mt-1">Pengaturan Sistem</h1>
          <p className="text-xs text-[#8C7A70] mt-0.5 max-w-2xl">
            Kelola konfigurasi akun kampus, ambang batas anggaran (thresholds), dan taksonomi kategori pengeluaran dan pemasukan mahasiswa.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 border border-[#E5DDD8] bg-white text-[#5C2D16] font-bold text-xs rounded-xl hover:bg-[#FAF7F4] shadow-xs flex items-center gap-1.5 transition-all"
          >
            <span>✕</span> Batal
          </button>
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-[#5C2D16] hover:bg-[#462211] text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-all"
          >
            <span>✓</span> Simpan Perubahan
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* LEFT COLUMN: Daftar Kategori Utama (2/3 width) */}
        <div className="lg:col-span-2 bg-white border border-[#E5DDD8] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-[#2D2825]">Daftar Kategori Utama</h2>
              <p className="text-[11px] text-[#8C7A70] mt-0.5">Taksonomi pengeluaran dan pemasukan resmi dompet mahasiswa.</p>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 bg-[#5C2D16] hover:bg-[#462211] text-white text-xs font-bold rounded-xl shadow flex items-center gap-1.5 shrink-0 transition-all"
            >
              <span>+</span> Tambah Kategori
            </button>
          </div>

          {/* Filter Pill Tabs */}
          <div className="flex items-center gap-2 pt-1 border-b border-[#F0E8E4] pb-3">
            <button
              onClick={() => setFilterType('Semua')}
              className={'px-3 py-1.5 rounded-xl font-bold text-xs transition-all ' + (
                filterType === 'Semua'
                  ? 'bg-[#5C2D16] text-white shadow-xs'
                  : 'bg-[#F5F2ED] text-[#6E5D53] hover:text-[#5C2D16]'
              )}
            >
              Semua ({categories.length})
            </button>
            <button
              onClick={() => setFilterType('Pengeluaran')}
              className={'px-3 py-1.5 rounded-xl font-bold text-xs transition-all ' + (
                filterType === 'Pengeluaran'
                  ? 'bg-[#5C2D16] text-white shadow-xs'
                  : 'bg-[#F5F2ED] text-[#6E5D53] hover:text-[#5C2D16]'
              )}
            >
              Pengeluaran ({countPengeluaran})
            </button>
            <button
              onClick={() => setFilterType('Pemasukan')}
              className={'px-3 py-1.5 rounded-xl font-bold text-xs transition-all ' + (
                filterType === 'Pemasukan'
                  ? 'bg-[#5C2D16] text-white shadow-xs'
                  : 'bg-[#F5F2ED] text-[#6E5D53] hover:text-[#5C2D16]'
              )}
            >
              Pemasukan ({countPemasukan})
            </button>
          </div>

          {/* Categories List */}
          <div className="divide-y divide-[#F0E8E4]">
            {filteredCategories.map((item) => (
              <div key={item.id} className="py-3.5 flex items-center justify-between hover:bg-[#FAF7F4] px-2 rounded-xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-[#FAF4F0] border border-[#E8DCD8] flex items-center justify-center text-base shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#2D2825]">{item.name}</h3>
                    <p className="text-[11px] text-[#8C7A70]">{item.subtext}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className={'px-2.5 py-1 text-[10px] font-bold rounded-lg border border-transparent ' + item.badgeBg + ' ' + item.badgeText}>
                    {item.type}
                  </span>
                  <button className="p-1.5 text-[#8C7A70] hover:text-[#5C2D16] rounded-lg transition-colors">
                    ✏️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Settings Cards (1/3 width) */}
        <div className="space-y-4">
          {/* Card 1: Batas Pagu Default */}
          <div className="bg-white border border-[#E5DDD8] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#FAF4F0] text-[#5C2D16] flex items-center justify-center font-bold text-base shrink-0 mt-0.5 border border-[#E8DCD8]">
                👛
              </div>
              <div>
                <h2 className="font-bold text-xs text-[#2D2825]">Batas Pagu Default</h2>
                <p className="text-[10px] text-[#8C7A70] leading-tight">Nominal batas pagu bulanan acuan mahasiswa</p>
              </div>
            </div>

            <div className="space-y-1.5 pt-1">
              <label className="block text-[11px] font-semibold text-[#6E5D53]">Standar Pagu Bulanan</label>
              <div className="flex items-center bg-[#F5F2ED] border border-[#E5DDD8] rounded-xl overflow-hidden focus-within:ring-1 focus-within:ring-[#5C2D16]">
                <span className="px-3 text-xs font-bold text-[#8C7A70] border-r border-[#E5DDD8]">Rp</span>
                <input
                  type="text"
                  value={paguNominal}
                  onChange={e => setPaguNominal(e.target.value)}
                  className="w-full bg-transparent px-3 py-2 text-xs font-extrabold text-[#2D2825] focus:outline-none"
                />
                <span className="px-3 text-[10px] font-semibold text-[#8C7A70] whitespace-nowrap">/ bulan</span>
              </div>
              <p className="text-[10px] text-[#8C7A70] pt-0.5">Standar pagu pengeluaran mahasiswa per semester ({fmtMoney ? fmtMoney('Rp 2.500.000', '$ 161.29') : 'Rp 2.500.000'}).</p>
            </div>
          </div>

          {/* Card 2: Toleransi Defisit (Early Warning System) */}
          <div className="bg-white border border-[#E5DDD8] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center font-bold text-base shrink-0 mt-0.5 border border-amber-200">
                ⚠️
              </div>
              <div>
                <h2 className="font-bold text-xs text-[#2D2825]">Toleransi Defisit (Early Warning System)</h2>
                <p className="text-[10px] text-[#8C7A70] leading-tight">Peringatan dini serapan kas</p>
              </div>
            </div>

            <div className="pt-1 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs text-[#2D2825]">Peringatan Saldo Kritis (EWS)</span>
                <button
                  onClick={() => setEwsEnabled(!ewsEnabled)}
                  className={'w-11 h-6 rounded-full transition-colors relative p-0.5 ' + (ewsEnabled ? 'bg-[#5C2D16]' : 'bg-[#E5DDD8]')}
                >
                  <div className={'w-5 h-5 rounded-full bg-white shadow-xs transition-transform ' + (ewsEnabled ? 'translate-x-5' : 'translate-x-0')}></div>
                </button>
              </div>
              <p className="text-[10px] text-[#6E5D53] leading-relaxed">
                Kirim sinyal peringatan otomatis jika serapan anggaran kas tersisa di bawah 20% sebelum akhir bulan.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Tambah Kategori Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-[#E5DDD8] rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0E8E4] pb-3">
              <h3 className="font-bold text-sm text-[#2D2825]">Tambah Kategori Utama Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#8C7A70] hover:text-[#2D2825] font-bold">✕</button>
            </div>

            <form onSubmit={handleAddCategorySubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#6E5D53] mb-1">Nama Kategori</label>
                <input
                  type="text"
                  placeholder="Contoh: Tagihan Listrik & WiFi Kos"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-2 text-xs font-medium text-[#2D2825] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#6E5D53] mb-1">Deskripsi Singkat</label>
                <input
                  type="text"
                  placeholder="Contoh: Pembayaran utilitas bulanan"
                  value={newCatSubtext}
                  onChange={e => setNewCatSubtext(e.target.value)}
                  className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-2 text-xs font-medium text-[#2D2825] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#6E5D53] mb-1">Tipe Kategori</label>
                  <select
                    value={newCatType}
                    onChange={e => setNewCatType(e.target.value as 'Pengeluaran' | 'Pemasukan')}
                    className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-2 text-xs font-medium text-[#2D2825] focus:outline-none"
                  >
                    <option value="Pengeluaran">Pengeluaran</option>
                    <option value="Pemasukan">Pemasukan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#6E5D53] mb-1">Ikon Emoji</label>
                  <input
                    type="text"
                    value={newCatIcon}
                    onChange={e => setNewCatIcon(e.target.value)}
                    className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-2 text-xs font-medium text-[#2D2825] focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#F0E8E4]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3.5 py-1.5 border border-[#E5DDD8] text-[#6E5D53] font-bold text-xs rounded-xl hover:bg-[#FAF7F4]"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#5C2D16] hover:bg-[#462211] text-white font-bold text-xs rounded-xl shadow"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SINGLE TOAST: Perubahan Berhasil Disimpan (Matching Gambar 2 Specs) */}
      {showSavedToast && (
        <div className="fixed top-20 right-6 z-50 bg-white border border-emerald-300 rounded-2xl p-4 shadow-2xl max-w-sm w-full space-y-2 animate-fadeIn">
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
            <button onClick={() => setShowSavedToast(false)} className="text-[#8C7A70] hover:text-[#2D2825] text-xs font-bold">✕</button>
          </div>

          <p className="text-[11px] text-[#554A43] leading-relaxed">
            Kategori anggaran baru dan ambang batas peringatan 80% telah diperbarui ke sistem SIAKAD kampus.
          </p>

          <div className="flex items-center gap-3 pt-1 text-[11px] border-t border-[#F0E8E4]">
            <button onClick={() => setShowSavedToast(false)} className="font-bold text-[#5C2D16] hover:underline">
              ↩ Batalkan (Undo)
            </button>
            <span className="text-[#8C7A70]">•</span>
            <span className="font-bold text-emerald-700 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Tersinkronisasi
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
