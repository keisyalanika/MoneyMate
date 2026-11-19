/// Data FAQ MoneyMate — dipisahkan dari UI agar mudah diperbarui.
///
/// Struktur tiap item:
///   - category : label kategori untuk filter
///   - question  : teks pertanyaan
///   - answer    : teks jawaban
///
/// Untuk menambah/mengubah pertanyaan, cukup edit list ini.
/// Komponen UI di help_center_screen.dart akan menyesuaikan secara otomatis.

const List<Map<String, String>> faqItems = [
  // ─── TRANSAKSI ───────────────────────────────────────────────
  {
    'category': 'Transaksi',
    'question': 'Bagaimana cara mencatat transaksi baru?',
    'answer':
        'Tekan tombol tambah (+) di tengah navigation bar bawah. Pilih jenis '
        'transaksi (Pemasukan atau Pengeluaran), masukkan nominal, pilih '
        'kategori, tentukan tanggal, lalu tekan "Simpan Transaksi".',
  },
  {
    'category': 'Transaksi',
    'question': 'Bisakah saya mengedit atau menghapus transaksi yang sudah disimpan?',
    'answer':
        'Ya. Buka daftar transaksi, ketuk transaksi yang ingin diubah, lalu '
        'pilih ikon edit (pensil) untuk mengubah atau ikon hapus (tong sampah) '
        'untuk menghapus. Perubahan akan langsung memperbarui saldo dan laporan.',
  },
  {
    'category': 'Transaksi',
    'question': 'Apakah ada fitur scan struk untuk mencatat transaksi?',
    'answer':
        'Ya, MoneyMate menyediakan fitur scan struk. Tekan tombol kamera saat '
        'menambah transaksi baru. Ambil foto struk belanja, dan sistem akan '
        'mencoba mengisi detail transaksi secara otomatis.',
  },
  {
    'category': 'Transaksi',
    'question': 'Apa perbedaan jenis transaksi "Pemasukan" dan "Pengeluaran"?',
    'answer':
        'Pemasukan (income) menambah saldo dompet Anda (gaji, bonus, dsb.). '
        'Pengeluaran (expense) mengurangi saldo (makan, transportasi, dsb.). '
        'Keduanya akan muncul di laporan dan grafik keuangan bulanan.',
  },

  // ─── KATEGORI ────────────────────────────────────────────────
  {
    'category': 'Kategori',
    'question': 'Bagaimana cara menambah atau mengubah kategori transaksi?',
    'answer':
        'Buka menu Profil → Kelola Kategori. Di sana Anda bisa menambah '
        'kategori baru, mengubah nama, mengganti ikon, atau menghapus kategori '
        'yang tidak terpakai. Kategori tersedia untuk Pemasukan dan Pengeluaran.',
  },
  {
    'category': 'Kategori',
    'question': 'Apakah bisa membuat kategori khusus sendiri?',
    'answer':
        'Tentu. Tekan "Tambah Kategori" di halaman Kelola Kategori, masukkan '
        'nama, pilih ikon, dan tentukan tipenya (pemasukan atau pengeluaran). '
        'Kategori baru langsung tersedia saat mencatat transaksi.',
  },

  // ─── ANGGARAN / BUDGET ───────────────────────────────────────
  {
    'category': 'Anggaran',
    'question': 'Bagaimana cara mengatur batas anggaran bulanan?',
    'answer':
        'Buka menu Anggaran dari navigation bar. Tekan "+ Tambah Anggaran", '
        'pilih kategori, tentukan limit nominal, dan pilih bulan berlakunya. '
        'MoneyMate akan memberi notifikasi saat pengeluaran mendekati batas.',
  },
  {
    'category': 'Anggaran',
    'question': 'Apa yang terjadi jika pengeluaran melampaui anggaran?',
    'answer':
        'MoneyMate akan menampilkan indikator merah di kartu anggaran dan '
        'mengirim notifikasi peringatan. Transaksi tetap bisa disimpan, namun '
        'Anda diingatkan untuk menyesuaikan kebiasaan belanja.',
  },

  // ─── TABUNGAN / GOALS ────────────────────────────────────────
  {
    'category': 'Tabungan',
    'question': 'Bagaimana cara membuat target tabungan (Goal)?',
    'answer':
        'Buka menu Goals, tekan "Tambah Goal", masukkan nama tujuan '
        '(misalnya "Liburan Bali"), target nominal, dan tenggat waktu. '
        'Anda bisa menambahkan dana secara berkala dan memantau progres tabungan.',
  },
  {
    'category': 'Tabungan',
    'question': 'Bisakah saya menambah dana ke goal secara manual?',
    'answer':
        'Ya. Buka detail Goal, tekan "Tambah Dana", masukkan jumlah yang ingin '
        'dialokasikan. Nominal akan dikurangkan dari saldo utama Anda dan '
        'ditambahkan ke progres goal.',
  },

  // ─── LOGIN & AKUN ─────────────────────────────────────────────
  {
    'category': 'Akun',
    'question': 'Bagaimana cara mendaftar akun MoneyMate?',
    'answer':
        'Buka aplikasi, tekan "Daftar Sekarang" di halaman login. Isi nama, '
        'email aktif, dan kata sandi (minimal 6 karakter), lalu tekan "Daftar". '
        'Setelah berhasil, Anda langsung bisa masuk ke akun.',
  },
  {
    'category': 'Akun',
    'question': 'Bagaimana cara login menggunakan akun Google?',
    'answer':
        'Di halaman login, tekan tombol "Lanjutkan dengan Google". Pilih akun '
        'Google yang ingin digunakan. Jika email belum terdaftar, akun baru '
        'akan dibuat otomatis. Jika sudah terdaftar, Anda langsung masuk.',
  },
  {
    'category': 'Akun',
    'question': 'Bagaimana jika saya lupa kata sandi akun?',
    'answer':
        'Di halaman login, tekan "Lupa kata sandi?". Masukkan email terdaftar '
        'dan tekan "Kirim Kode Pemulihan". Cek inbox email Anda (periksa juga '
        'folder spam), masukkan kode 6 digit, lalu buat kata sandi baru.',
  },
  {
    'category': 'Akun',
    'question': 'Bagaimana cara mengganti foto profil atau nama akun?',
    'answer':
        'Buka menu Profil → Edit Profil. Ketuk foto profil untuk mengganti '
        'gambar (dari galeri atau kamera), ubah nama atau nomor telepon, '
        'lalu tekan "Simpan Perubahan".',
  },

  // ─── SALDO & DOMPET ──────────────────────────────────────────
  {
    'category': 'Saldo',
    'question': 'Bagaimana cara mengatur saldo awal dompet?',
    'answer':
        'Setelah login pertama kali, Anda akan diarahkan untuk memasukkan '
        'saldo awal. Untuk mengubahnya nanti, buka halaman Beranda → tekan '
        '"Sesuaikan Saldo" dan masukkan nominal yang sesuai kondisi keuangan Anda.',
  },
  {
    'category': 'Saldo',
    'question': 'Apakah MoneyMate terhubung langsung ke rekening bank saya?',
    'answer':
        'MoneyMate saat ini tidak terhubung langsung ke rekening bank secara '
        'real-time. Pencatatan dilakukan secara manual atau via scan struk. '
        'Fitur koneksi bank masih dalam pengembangan.',
  },

  // ─── LAPORAN & AI ────────────────────────────────────────────
  {
    'category': 'Laporan',
    'question': 'Di mana saya bisa melihat laporan keuangan bulanan?',
    'answer':
        'Buka menu Laporan di navigation bar. Tersedia grafik pengeluaran per '
        'kategori, perbandingan pemasukan vs pengeluaran, dan ringkasan bulanan. '
        'Gunakan filter bulan/tahun untuk melihat periode tertentu.',
  },
  {
    'category': 'Laporan',
    'question': 'Apa itu fitur AI Insight di MoneyMate?',
    'answer':
        'AI Insight menganalisis pola keuangan Anda dan memberikan saran '
        'otomatis, seperti kategori pengeluaran terbesar, potensi penghematan, '
        'dan perkiraan sisa budget. Buka menu AI Insight atau tanya langsung '
        'lewat fitur Chat AI.',
  },

  // ─── NOTIFIKASI ──────────────────────────────────────────────
  {
    'category': 'Notifikasi',
    'question': 'Notifikasi MoneyMate tidak muncul, bagaimana mengaktifkannya?',
    'answer':
        'Pastikan izin notifikasi untuk MoneyMate sudah diaktifkan di '
        'Pengaturan HP → Aplikasi → MoneyMate → Notifikasi. Di dalam aplikasi, '
        'buka Profil → Notifikasi untuk mengatur jenis notifikasi yang diinginkan.',
  },

  // ─── KEAMANAN & DATA ─────────────────────────────────────────
  {
    'category': 'Keamanan',
    'question': 'Apakah data keuangan saya aman di MoneyMate?',
    'answer':
        'Ya. MoneyMate menggunakan enkripsi standar industri (256-bit) untuk '
        'melindungi data Anda. Kata sandi disimpan dalam bentuk terenkripsi '
        'dan tidak pernah dapat dibaca oleh siapapun, termasuk tim MoneyMate.',
  },
  {
    'category': 'Keamanan',
    'question': 'Bagaimana cara mengubah kata sandi akun?',
    'answer':
        'Buka Profil → Keamanan → Ubah Kata Sandi. Masukkan kata sandi lama, '
        'kata sandi baru (minimal 8 karakter, kombinasi huruf besar, kecil, '
        'angka, dan simbol), lalu konfirmasi dan simpan.',
  },
  {
    'category': 'Keamanan',
    'question': 'Bagaimana cara menghapus semua data akun saya?',
    'answer':
        'Buka Profil → Kelola Data → Hapus Semua Data. Proses ini permanen '
        'dan tidak dapat dibatalkan. Semua transaksi, anggaran, dan goals '
        'akan dihapus sepenuhnya dari server MoneyMate.',
  },
];

/// Ambil daftar kategori unik dari [faqItems], urut alfabet.
List<String> get faqCategories {
  final cats = faqItems.map((e) => e['category']!).toSet().toList();
  cats.sort();
  return cats;
}
