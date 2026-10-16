'use client';

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

// Comprehensive iOS Emoji Categories
const IOS_EMOJI_CATEGORIES = [
  {
    id: 'smileys',
    name: 'Smileys & Orang',
    icon: '😊',
    emojis: [
      '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '🥹', '☺️',
      '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰', '😘', '😋',
      '😛', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🥸', '🤩', '🥳',
      '😏', '😒', '😞', '😔', '😟', '😕', '🥺', '😢', '😭', '😤',
      '😠', '😡', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥',
      '😓', '🤗', '🤔', '🫣', '🤭', '🫡', '🤫', '🫠', '🤥', '😶'
    ]
  },
  {
    id: 'food',
    name: 'Makanan & Minuman',
    icon: '🍔',
    emojis: [
      '🍴', '🍽️', '🥢', '🥄', '☕', '🧋', '🍵', '🥤', '🧃', '🥛',
      '🍔', '🍟', '🍕', '🌭', '🥪', '🌮', '🌯', '🥙', '🧆', '🥗',
      '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🍤', '🍙', '🍚',
      '🥑', '🍎', '🍌', '🍉', '🍇', '🍓', '🫐', '🍑', '🥐', '🥯',
      '🍞', '🥖', '🥨', '🧀', '🍳', '🥞', '🧇', '🍗', '🥩', '🍢',
      '🍡', '🍧', '🍨', '🍦', '🍰', '🎂', '🧁', '🍮', '🍩', '🍫'
    ]
  },
  {
    id: 'campus',
    name: 'Kampus & Finansial',
    icon: '🎓',
    emojis: [
      '🎓', '📚', '📖', '💵', '💰', '💳', '🪙', '💎', '🏛️', '🏫',
      '🎒', '📝', '✏️', '✒️', '🖋️', '🖊️', '🗒️', '🗓️', '📅', '📆',
      '📈', '📉', '📊', '📋', '📌', '📍', '📎', '🖇️', '📏', '📐',
      '✂️', '🗃️', '🗄️', '🔒', '🔑', '🏷️', '💻', '🖥️', '🖨️', '⌨️',
      '📱', '📲', '☎️', '📞', '💾', '💿', '📀', '📠', '💼', '📁'
    ]
  },
  {
    id: 'living',
    name: 'Rumah & Kos',
    icon: '🏠',
    emojis: [
      '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏪', '🏬',
      '🛏️', '🛋️', '🚪', '🪑', '🚽', '🚿', '🛁', '🧴', '🧹', '🧺',
      '🧻', '🪣', '🧼', '🧽', '🛒', '🛍️', '👕', '👖', '👗', '👟',
      '👓', '🕶️', '🧢', '👒', '🧳', '📦', '💡', '🔌', '📶', '🔋'
    ]
  },
  {
    id: 'travel',
    name: 'Transportasi',
    icon: '🚗',
    emojis: [
      '🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐',
      '🚚', '🚛', '🛵', '🏍️', '🚲', '🛴', '🛺', '🚆', '🚇', '🚈',
      '🚉', '✈️', '🛫', '🛬', '🚀', '🚁', '⛴️', '🚢', '⚓', '⛽'
    ]
  },
  {
    id: 'activities',
    name: 'Aktivitas & UKM',
    icon: '🎮',
    emojis: [
      '🎮', '🕹️', '🎲', '♟️', '🎯', '🎳', '⚽', '🏀', '🏈', '⚾',
      '🎾', '🏐', '🏸', '🏓', '🥊', '🥋', '🛹', '🛼', '🏋️', '🧘',
      '🎨', '🎭', '🎪', '🎤', '🎧', '🎼', '🎹', '🎸', '🥁', '🎬',
      '🎟️', '🎫', '🏆', '🥇', '🥈', '🥉', '🏅', '📸', '🍿', '🏕️'
    ]
  },
  {
    id: 'symbols',
    name: 'Simbol & Penanda',
    icon: '💖',
    emojis: [
      '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💖',
      '✨', '⭐', '🌟', '🔥', '💥', '⚡', '☀️', '🌈', '☀️', '🌙',
      '✅', '❌', '⚠️', '🚨', '💯', '🔔', '📣', '📢', '💬', '💭',
      '✔️', '➕', '➖', '➗', '💲', '💱', '🆗', '🆒', '🆕', '🆓'
    ]
  }
];

export const SettingsPage: React.FC<SettingsPageProps> = ({ fmtMoney }) => {
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

  // iOS Emoji Keyboard States
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedEmojiCategory, setSelectedEmojiCategory] = useState('food');
  const [emojiSearch, setEmojiSearch] = useState('');

  // Toast Notification State for Settings Saved ONLY
  const [showSavedToast, setShowSavedToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', desc: '' });

  const handleSaveSettings = () => {
    // Only show saved toast, NO PDF download
    setToastMessage({
      title: 'Perubahan Berhasil Disimpan!',
      desc: `Standar pagu default berhasil diperbarui menjadi Rp ${paguNominal} / bulan.`
    });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 4500);
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
    setShowEmojiPicker(false);
    setNewCatName('');
    setNewCatSubtext('');

    setToastMessage({
      title: 'Kategori Berhasil Ditambahkan!',
      desc: `Kategori "${newCatName}" (${newCatType}) dengan ikon ${newCatIcon} telah tersimpan.`
    });
    setShowSavedToast(true);
    setTimeout(() => setShowSavedToast(false), 4500);
  };

  const filteredCategories = categories.filter(c => {
    if (filterType === 'Semua') return true;
    return c.type === filterType;
  });

  const countPengeluaran = categories.filter(c => c.type === 'Pengeluaran').length;
  const countPemasukan = categories.filter(c => c.type === 'Pemasukan').length;

  // Active emojis list based on category & search
  const currentCategoryData = IOS_EMOJI_CATEGORIES.find(cat => cat.id === selectedEmojiCategory) || IOS_EMOJI_CATEGORIES[0];
  const displayedEmojis = emojiSearch.trim()
    ? IOS_EMOJI_CATEGORIES.flatMap(c => c.emojis).filter((_e, idx, arr) => arr.indexOf(_e) === idx)
    : currentCategoryData.emojis;

  return (
    <div className="p-4 space-y-4 max-w-7xl mx-auto w-full animate-fadeIn text-xs relative">
      {/* Toast Notification: Perubahan Disimpan (TIDAK ADA UNDUH PDF) */}
      {showSavedToast && (
        <div className="fixed top-14 right-5 z-50 w-full max-w-sm pointer-events-auto transition-all animate-fadeIn">
          <div className="bg-white/95 backdrop-blur-md border border-[#E5DDD8] rounded-2xl p-4 shadow-2xl text-xs space-y-2 border-l-4 border-emerald-500">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-[#2D2825] text-xs">{toastMessage.title}</div>
                  <div className="text-[10px] text-[#8C7A70]">Baru saja • Database Kampus Terupdate</div>
                </div>
              </div>
              <button
                onClick={() => setShowSavedToast(false)}
                className="text-[#8C7A70] hover:text-[#2D2825] p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <p className="text-[#554A43] text-[11px] leading-relaxed bg-[#FAF7F4] p-2.5 rounded-xl border border-[#E5DDD8]">
              {toastMessage.desc}
            </p>
          </div>
        </div>
      )}

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
            className="px-4 py-2 border border-[#E5DDD8] bg-white text-[#6E5D53] hover:text-[#2D2825] font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <span>↻</span> Batalkan
          </button>
          <button
            onClick={handleSaveSettings}
            className="px-4 py-2 bg-[#5C2D16] hover:bg-[#462211] text-white font-bold text-xs rounded-xl shadow flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <span>✓</span> Simpan Perubahan
          </button>
        </div>
      </div>

      {/* Main 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* LEFT COLUMN: Daftar Kategori Utama (2/3 width) */}
        <div className="lg:col-span-2 bg-white border border-[#E5DDD8] rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F0E8E4] pb-4">
            <div>
              <h2 className="text-base font-bold text-[#2D2825] flex items-center gap-2">
                <span>🏷️</span> Taksonomi Kategori Finansial
              </h2>
              <p className="text-xs text-[#8C7A70] mt-0.5">
                Kategori aktif yang digunakan mahasiswa saat mencatat transaksi pengeluaran dan pemasukan.
              </p>
            </div>

            <button
              onClick={() => {
                setShowAddModal(true);
                setShowEmojiPicker(false);
              }}
              className="px-3.5 py-2 bg-[#FAF4F0] border border-[#E6D4CB] text-[#5C2D16] hover:bg-[#5C2D16] hover:text-white font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
            >
              <span>+</span> Tambah Kategori
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setFilterType('Semua')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === 'Semua' ? 'bg-[#5C2D16] text-white' : 'bg-[#FAF7F4] text-[#8C7A70] hover:text-[#2D2825]'
              }`}
            >
              Semua ({categories.length})
            </button>
            <button
              onClick={() => setFilterType('Pengeluaran')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === 'Pengeluaran' ? 'bg-rose-700 text-white' : 'bg-[#FAF7F4] text-[#8C7A70] hover:text-[#2D2825]'
              }`}
            >
              Pengeluaran ({countPengeluaran})
            </button>
            <button
              onClick={() => setFilterType('Pemasukan')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                filterType === 'Pemasukan' ? 'bg-emerald-700 text-white' : 'bg-[#FAF7F4] text-[#8C7A70] hover:text-[#2D2825]'
              }`}
            >
              Pemasukan ({countPemasukan})
            </button>
          </div>

          {/* Category List */}
          <div className="space-y-2.5">
            {filteredCategories.map(cat => (
              <div
                key={cat.id}
                className="p-3 bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl flex items-center justify-between gap-3 hover:border-[#5C2D16]/30 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-[#E5DDD8] flex items-center justify-center text-lg shadow-2xs shrink-0">
                    {cat.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-xs text-[#2D2825]">{cat.name}</h3>
                    <p className="text-[10px] text-[#8C7A70]">{cat.subtext}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${cat.badgeBg} ${cat.badgeText}`}>
                    {cat.type}
                  </span>
                  <button
                    onClick={() => {
                      setCategories(categories.filter(c => c.id !== cat.id));
                    }}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                    title="Hapus Kategori"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Konfigurasi Ambang Batas Pagu & EWS */}
        <div className="space-y-5">
          {/* Card 1: Standar Pagu Default Mahasiswa */}
          <div className="bg-white border border-[#E5DDD8] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="border-b border-[#F0E8E4] pb-3">
              <span className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">AMBANG BATAS UMUM</span>
              <h2 className="text-sm font-bold text-[#2D2825] mt-0.5">Standar Pagu Default Mahasiswa</h2>
              <p className="text-[11px] text-[#8C7A70]">Batas aman pengeluaran bulanan default saat mahasiswa baru mendaftar.</p>
            </div>

            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-[#6E5D53]">Nominal Pagu Bulanan (IDR)</label>
              <div className="flex items-center bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl overflow-hidden focus-within:border-[#5C2D16]">
                <span className="px-3 text-xs font-bold text-[#5C2D16] bg-[#FAF4F0] py-2 border-r border-[#E5DDD8]">Rp</span>
                <input
                  type="text"
                  value={paguNominal}
                  onChange={e => setPaguNominal(e.target.value)}
                  className="w-full bg-transparent px-3 py-2 text-xs font-extrabold text-[#2D2825] focus:outline-none"
                  placeholder="2.500.000"
                />
                <span className="px-3 text-[10px] font-semibold text-[#8C7A70] whitespace-nowrap">/ bulan</span>
              </div>
              <p className="text-[10px] text-[#8C7A70] pt-0.5">
                Standar pagu pengeluaran mahasiswa ({fmtMoney ? fmtMoney(`Rp ${paguNominal}`, '$ 161.29') : `Rp ${paguNominal}`}).
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={handleSaveSettings}
                className="w-full py-2 bg-[#5C2D16] hover:bg-[#462211] text-white font-bold text-xs rounded-xl shadow transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>✓</span> Simpan Perubahan Pagu
              </button>
            </div>
          </div>

          {/* Card 2: Toleransi Defisit & EWS */}
          <div className="bg-white border border-[#E5DDD8] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="border-b border-[#F0E8E4] pb-3">
              <span className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">EARLY WARNING SYSTEM</span>
              <h2 className="text-sm font-bold text-[#2D2825] mt-0.5">Deteksi & Peringatan Otomatis</h2>
              <p className="text-[11px] text-[#8C7A70]">Sistem notifikasi cerdas ketika mahasiswa melampaui 80% pagu.</p>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#FAF7F4] rounded-xl border border-[#E5DDD8]">
              <div>
                <div className="font-bold text-xs text-[#2D2825]">Aktifkan EWS Kampus</div>
                <div className="text-[10px] text-[#8C7A70]">Kirim push notif otomatis jika defisit</div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={ewsEnabled}
                  onChange={e => setEwsEnabled(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#5C2D16]"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Tambah Kategori Baru dengan Keyboard Emoji iOS */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-[#E5DDD8] rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#F0E8E4] pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FAF4F0] text-[#5C2D16] flex items-center justify-center font-bold text-base">
                  🏷️
                </div>
                <h3 className="font-bold text-sm text-[#2D2825]">Tambah Kategori Utama Baru</h3>
              </div>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEmojiPicker(false);
                }}
                className="text-[#8C7A70] hover:text-[#2D2825] font-bold text-base cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCategorySubmit} className="space-y-3.5">
              <div>
                <label className="block text-[11px] font-semibold text-[#6E5D53] mb-1">Nama Kategori</label>
                <input
                  type="text"
                  placeholder="Contoh: Tagihan Listrik & WiFi Kos"
                  value={newCatName}
                  onChange={e => setNewCatName(e.target.value)}
                  className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-2 text-xs font-medium text-[#2D2825] focus:outline-none focus:border-[#5C2D16]"
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
                  className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-2 text-xs font-medium text-[#2D2825] focus:outline-none focus:border-[#5C2D16]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#6E5D53] mb-1">Tipe Kategori</label>
                  <select
                    value={newCatType}
                    onChange={e => setNewCatType(e.target.value as 'Pengeluaran' | 'Pemasukan')}
                    className="w-full bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-3 py-2 text-xs font-medium text-[#2D2825] focus:outline-none focus:border-[#5C2D16] cursor-pointer"
                  >
                    <option value="Pengeluaran">Pengeluaran</option>
                    <option value="Pemasukan">Pemasukan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-[#6E5D53] mb-1">Ikon Emoji</label>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="w-full bg-[#FAF7F4] border border-[#E5DDD8] hover:border-[#5C2D16] rounded-xl px-3 py-1.5 flex items-center justify-between transition-all cursor-pointer"
                  >
                    <span className="text-xl">{newCatIcon}</span>
                    <span className="text-[10px] text-[#5C2D16] font-bold bg-[#FAF4F0] px-2 py-0.5 rounded border border-[#E6D4CB]">
                      Pilih ⌨️
                    </span>
                  </button>
                </div>
              </div>

              {/* iOS EMOJI KEYBOARD POPUP / PICKER */}
              {showEmojiPicker && (
                <div className="bg-[#E5E5EA] border border-[#C7C7CC] rounded-2xl p-3 shadow-xl space-y-2.5 animate-fadeIn">
                  <div className="flex items-center justify-between text-[11px] text-[#3A3A3C] font-semibold pb-1 border-b border-[#D1D1D6]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm"></span>
                      <span>Papan Tombol Emoji iOS</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(false)}
                      className="px-2 py-0.5 bg-white text-[#007AFF] hover:bg-stone-100 rounded-lg font-bold text-[10px] shadow-2xs cursor-pointer"
                    >
                      Selesai
                    </button>
                  </div>

                  {/* Search Bar iOS Style */}
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Cari emoji..."
                      value={emojiSearch}
                      onChange={e => setEmojiSearch(e.target.value)}
                      className="w-full bg-white/90 text-[#1C1C1E] placeholder-stone-400 px-7 py-1.5 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-[#007AFF] border border-[#D1D1D6]"
                    />
                    <span className="absolute left-2.5 top-1.5 text-xs text-stone-400">🔍</span>
                    {emojiSearch && (
                      <button
                        type="button"
                        onClick={() => setEmojiSearch('')}
                        className="absolute right-2.5 top-1.5 text-xs text-stone-400 hover:text-stone-700 cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Category Pills iOS Style */}
                  {!emojiSearch && (
                    <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 px-1">
                      {IOS_EMOJI_CATEGORIES.map(cat => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setSelectedEmojiCategory(cat.id)}
                          title={cat.name}
                          className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm transition-all cursor-pointer ${
                            selectedEmojiCategory === cat.id
                              ? 'bg-white shadow-xs scale-110'
                              : 'hover:bg-white/50 text-stone-600'
                          }`}
                        >
                          {cat.icon}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Emoji Grid iOS Matrix */}
                  <div className="bg-[#F2F2F7] p-2 rounded-xl border border-[#D1D1D6] max-h-36 overflow-y-auto">
                    <div className="grid grid-cols-8 gap-1.5 text-center">
                      {displayedEmojis.map((emoji, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setNewCatIcon(emoji);
                            setShowEmojiPicker(false);
                          }}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xl hover:scale-125 transition-transform hover:bg-white shadow-2xs cursor-pointer ${
                            newCatIcon === emoji ? 'bg-white ring-2 ring-[#007AFF]' : ''
                          }`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-[#F0E8E4] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEmojiPicker(false);
                  }}
                  className="px-4 py-2 border border-[#E5DDD8] bg-white text-[#6E5D53] hover:text-[#2D2825] font-bold text-xs rounded-xl cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#5C2D16] hover:bg-[#462211] text-white font-bold text-xs rounded-xl shadow cursor-pointer"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
