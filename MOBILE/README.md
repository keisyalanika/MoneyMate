# MoneyMate Mobile - Offline-First Persistence & Local Storage 📱

Aplikasi mobile **MoneyMate** dibangun dengan **Flutter** menerapkan arsitektur **Offline-First**, **Clean Architecture**, serta pemisahan jenis penyimpanan lokal sesuai tipe dan sensitivitas datanya sesuai standar **Tugas 9 Project-Based Learning (PBL)**.

---

## 🎨 Tautan Desain Figma PBL UAS
- **Figma Design Link:** [Figma PBL UAS - MoneyMate Mobile & Web Admin Design](https://www.figma.com/design/MoneyMate-PBL-UAS)
- **Kompatibilitas Tampilan UI:** Disesuaikan dengan rancangan Figma resmi untuk layar Dashboard, Transaksi, Laporan, Anggaran, Tambah Transaksi, dan Profil Pengaturan.

---

## 🏗️ Arsitektur Penyimpanan & Data Persistence

Aplikasi memisahkan strategi penyimpanan ke dalam 3 tier sesuai kebutuhan dan sensitivitas data:

```text
┌────────────────────────────────────────────────────────────────────────┐
│                        MoneyMate Mobile Layer                          │
└──────────────────────────────────┬─────────────────────────────────────┘
                                   │
       ┌───────────────────────────┼───────────────────────────┐
       ▼                           ▼                           ▼
┌──────────────┐            ┌──────────────┐            ┌──────────────┐
│  Tier 1: DB  │            │Tier 2: Config│            │Tier 3: Secret│
│    Drift     │            │SharedPrefs   │            │SecureStorage │
│(SQLite / ORM)│            │ (Non-Secret) │            │ (Encrypted)  │
└──────┬───────┘            └──────┬───────┘            └──────┬───────┘
       │                           │                           │
  • Data Terstruktur          • Mode Gelap                • Access Token
  • Offline Cache             • Status Notif              • Refresh Token
  • .watch() Streams          • Default Filter            • User Auth Creds
  • Atomic Transactions       • UI Preferences
  • last_fetched (UTC ms)
```

### 1. Penyimpanan Terstruktur: Drift (SQLite Type-Safe & Reaktif)
- **Package:** `drift: ^2.35.2`, `sqlite3_flutter_libs: ^0.6.0+eol`, `path_provider`, `path`
- **Tabel Lokal:**
  - `LocalTransactions`: Menyimpan seluruh riwayat transaksi (id, title, amount, type, categoryId, date, description, lastFetched, updatedAt).
  - `LocalCategories`: Menyimpan daftar kategori pemasukan dan pengeluaran.
  - `LocalBudgets`: Menyimpan pos anggaran bulanan.
  - `LocalWalletSummary`: Menyimpan agregasi saldo (balance, income, expense).
- **Atribut Penanda Cache:**
  - `last_fetched`: Menyimpan timestamp UTC epoch milliseconds saat data disinkronkan dari backend.
  - `updated_at`: Melacak mutasi lokal atau pembaruan terakhir record.
- **Reaktivitas UI (Stream .watch()):**
  - Menggunakan query stream Drift (`select().watch()`) yang diekspos melalui `OfflineFirstRepository` dan `FinanceProvider`. Setiap kali data lokal diperbarui atau ditambahkan, tampilan layar (Dashboard, Transaksi) langsung diperbarui otomatis tanpa perlu full re-fetch manual.
- **Transaksi Database Multi-Baris (Atomic Writes):**
  - Menggunakan `transaction(() async { ... })` pada Drift untuk menjamin integritas data (ACID) saat batch write/caching dari respons API backend.

### 2. Pengaturan Aplikasi: SharedPreferences (Non-Sensitif)
- **Package:** `shared_preferences: ^2.5.6`
- **File Service:** `lib/core/storage/preferences_service.dart`
- **Data yang Disimpan:**
  - Preferensi tema aplikasi (`isDarkMode`)
  - Status notifikasi push/pengingat transaksi (`isNotificationEnabled`)
  - Filter default transaksi (`defaultFilter`)
- **Prinsip Keamanan:** Dilarang keras dan tidak pernah digunakan untuk menyimpan token otentikasi maupun data kredensial.

### 3. Keamanan Rahasia: FlutterSecureStorage (Encrypted)
- **Package:** `flutter_secure_storage: ^11.2.0`
- **File Service:** `lib/core/storage/secure_storage_service.dart`
- **Data Sensitif:**
  - JWT Access Token (`mm_access_token`)
  - Refresh Token (`mm_refresh_token`)
  - ID Pengguna & Email Sesi Aktif
- **Mekanisme Keamanan:** Menggunakan Android KeyStore / iOS Keychain enkripsi tingkat sistem operasi, bertahan aman melewati rilis atau restart aplikasi.

---

## 📁 Struktur Direktori Clean Architecture

```text
MOBILE/
├── lib/
│   ├── core/
│   │   ├── database/
│   │   │   ├── app_database.dart       # Skema tabel Drift, query reaktif, & atomic transactions
│   │   │   └── app_database.g.dart     # Generated type-safe code dari drift_dev
│   │   ├── storage/
│   │   │   ├── secure_storage_service.dart # FlutterSecureStorage (Tokens & Credentials)
│   │   │   └── preferences_service.dart    # SharedPreferences (Theme & Notifications)
│   │   └── theme/
│   │       └── app_colors.dart         # Palet warna serasi Figma
│   ├── data/
│   │   └── repositories/
│   │       └── offline_first_repository.dart # Single Source of Truth: Drift Cache + API Sync
│   ├── providers/
│   │   ├── finance_provider.dart       # State management transaksi & saldo (Drift stream listener)
│   │   └── settings_provider.dart      # State management tema & notifikasi lokal
│   ├── services/
│   │   ├── api_service.dart            # HTTP Client ke Backend Express
│   │   └── auth_provider.dart          # Autentikasi terintegrasi Secure Storage
│   ├── screens/
│   │   ├── dashboard_screen.dart       # Saldo & ringkasan reaktif dari Drift
│   │   ├── transaction_screen.dart     # List transaksi reaktif, filter chip, & indikator cache
│   │   ├── add_transaction_screen.dart # Form input transaksi dengan optimis write ke Drift
│   │   ├── profile_screen.dart         # Pengaturan switch SharedPreferences & status SecureStorage
│   │   └── ...
│   └── main.dart                       # MultiProvider registration & App Entry Point
├── pubspec.yaml
└── README.md
```

---

## ⚡ Fitur Interaktif Terintegrasi Global State

1. **Tambah Transaksi Instan (Optimistic & Reactive):**
   - Ketika pengguna mengisi form di `AddTransactionScreen` dan menekan Simpan, transaksi langsung ditulis ke database lokal Drift secara atomik.
   - Stream reaktif Drift langsung memicu update pada `FinanceProvider`.
   - Layar `DashboardScreen` (saldo bertambah/berkurang) dan `TransactionScreen` (item baru di urutan teratas) ter-update seketika tanpa jeda loading.
   - Sinkronisasi backend berjalan di latar belakang (background sync).
2. **Filter Interaktif Multi-Kategori:**
   - Filter chips di `TransactionScreen` (`Semua`, `Pemasukan`, `Pengeluaran`) terhubung langsung ke `FinanceProvider`, menyaring data reaktif Drift secara instan.
3. **Penyimpanan Pengaturan Tema & Notifikasi:**
   - Switch toggle di menu Pengaturan Profil langsung menyimpan status ke `SharedPreferences` dan merefleksikan perubahan status secara global.

---

## 🚀 Panduan Menjalankan Proyek

### 1. Prasyarat
- Flutter SDK 3.x+
- Dart SDK 3.x+
- Android Studio / VS Code / Xcode

### 2. Instalasi Dependensi
```bash
cd MOBILE
flutter pub get
```

### 3. Generate Kode Database Drift (Opsional jika ingin rebuild schema)
```bash
dart run build_runner build --delete-conflicting-outputs
```

### 4. Menjalankan Aplikasi
```bash
flutter run
```

---

## 🧪 Validasi Kualitas Kode

Aplikasi telah divalidasi menggunakan linter Flutter:
```bash
flutter analyze
```
Hasil: Seluruh file arsitektur database, repository, provider, dan services bebas dari error kompilasi dan mengikuti standar *Clean Code*.
