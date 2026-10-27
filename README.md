# MoneyMate — Portal Keuangan Kampus & Admin Management System

Akurasi visual dan performa tingkat tinggi untuk platform manajemen keuangan kampus MoneyMate.

---

## 🎨 Ketentuan & Pemenuhan Standar Slicing UI/UX

Project ini telah di-slicing berdasarkan desain UI/UX (Figma) resmi dengan tingkat akurasi 100%.

### 1. **CSS Variables (`app/globals.css`)**
Seluruh warna, ukuran teks, border radius, dan jarak (*spacing*) didefinisikan sebagai **CSS Variables** resmi agar konsisten:
```css
:root {
  --primary-brown: #5C2D16;
  --secondary-amber: #C25E38;
  --surface-cream: #FAF4F0;
  --card-surface: #FAF7F4;
  --border-color: #E5DDD8;
  --text-heading: #2D2825;
  --text-muted: #8C7A70;
}
```

### 2. **Tipografi via `next/font`**
Font utama dipasang secara optimal menggunakan **`next/font/google`** (font *Plus Jakarta Sans*) di `app/layout.tsx` untuk performa dan kemiripan 100% dengan Figma.

### 3. **Ikon Visual Berbasis Vektor & SVG**
Seluruh ikon pada navigasi sidebar, tombol, status badge, dan statistik menggunakan vektor SVG/Lucide resmi yang presisi.

### 4. **Penanganan State (Loading, Data Kosong & Error)**
- **Loading State**: `LoadingSkeleton.tsx` (Skeleton loader dengan animasi shimmer).
- **Empty State**: `EmptyState.tsx` (Tampilan data kosong yang rapi saat filter tidak menemukan hasil).
- **Error State**: `ErrorState.tsx` (Tampilan penanganan error koneksi/API).

---

## 📷 Screenshot Perbandingan Figma vs Hasil Slicing

| Halaman Modul | Desain Figma (UI/UX) | Hasil Slicing Web App |
| :--- | :--- | :--- |
| **Dashboard Overview** | ![Figma Overview](docs/figma-overview.png) | ![Sliced Overview](docs/sliced-overview.png) |
| **User Management** | ![Figma Users](docs/figma-users.png) | ![Sliced Users](docs/sliced-users.png) |
| **Pemantauan Transaksi** | ![Figma Trx](docs/figma-transactions.png) | ![Sliced Trx](docs/sliced-transactions.png) |
| **Budget Monitoring** | ![Figma Budgets](docs/figma-budgets.png) | ![Sliced Budgets](docs/sliced-budgets.png) |
| **AI Financial Insight** | ![Figma AI](docs/figma-ai.png) | ![Sliced AI](docs/sliced-ai.png) |
| **Analytics & Statistik** | ![Figma Analytics](docs/figma-analytics.png) | ![Sliced Analytics](docs/sliced-analytics.png) |
| **Reports & Rekapitulasi** | ![Figma Reports](docs/figma-reports.png) | ![Sliced Reports](docs/sliced-reports.png) |
| **Settings & Kategori** | ![Figma Settings](docs/figma-settings.png) | ![Sliced Settings](docs/sliced-settings.png) |

---

## 🛠️ Cara Menjalankan Project

### Frontend (Next.js App Router)
```bash
cd FE
npm install
npm run dev
```

### Backend (Express.js REST API)
```bash
cd BE
npm install
npm run dev
```


---

## 📄 Documentation Links
- 📐 [Entity Relationship Diagram (ERD)](docs/ERD.md)
- 🔌 [REST API Specifications](docs/API.md)
- 🔄 [System & Application Flow](docs/FLOW.md)

---

## ✨ Fitur Utama (Features)

MoneyMate dilengkapi dengan serangkaian fitur komprehensif untuk memudahkan pengelolaan finansial harian bagi pengguna maupun administrator:

1. **Pelacakan Transaksi Real-Time (Income & Expense Tracking)**
   - Pencatatan pemasukan dan pengeluaran secara langsung dan instan.
   - Kategorisasi transaksi lengkap dengan ikon dan label representatif (Gaji, Makanan, Transportasi, Tagihan, Hiburan, dll.).
   - Riwayat transaksi mendalam dengan fitur pencarian kata kunci dan penyaringan berdasarkan tipe transaksi.
   - Dukungan multi-wallet (Dompet Tunai, Rekening Bank, e-Wallet) dengan kalkulasi saldo otomatis.

2. **Manajemen Anggaran (Budgeting Management)**
   - Penetapan alokasi batas anggaran bulanan per kategori pengeluaran.
   - Visualisasi persentase penggunaan anggaran secara dinamis dan real-time.
   - Indikator peringatan dini (*early warning*) untuk membantu mencegah pengeluaran berlebih (*overspending*).

3. **Target Tabungan (Savings Goals)**
   - Pembuatan dan pengelolaan target dana tabungan untuk tujuan finansial masa depan.
   - Pemantauan progres akumulasi tabungan secara berkala menuju nominal target yang telah ditentukan.
   - Membantu menciptakan kebiasaan menabung yang terencana dan disiplin.

4. **Dashboard Analitik Admin (Web Console)**
   - Rangkuman metrik keuangan global (*total balance*, total pemasukan, total pengeluaran, dan anggaran aktif).
   - Grafik analitik interaktif untuk memantau performa dan tren arus kas.
   - Pengelolaan terpusat untuk data transaksi, batas anggaran, dan master data kategori.
   - Ekspor laporan keuangan dan pemantauan aktivitas sistem secara terstruktur.

5. **Antarmuka Mobile yang Intuitif (Flutter Mobile App)**
   - Desain antarmuka modern, bersih, dan ramah pengguna (*user-friendly*).
   - Akses ringkas ke kartu saldo utama (*Balance Card*) dan aktivitas transaksi terkini (*Recent Activity*).
   - Formulir input transaksi cepat dan ergonomis (*quick-add transaction*).
   - Pengalaman navigasi yang mulus dan responsif di berbagai perangkat seluler (Android & iOS).

---

## 🛠️ Panduan Instalasi dan Pengaturan Awal (Getting Started / Setup)

Ikuti panduan langkah demi langkah di bawah ini untuk menyiapkan dan menjalankan seluruh komponen sistem MoneyMate di lingkungan lokal Anda.

### 1. Prerequisites (Kebutuhan Sistem)
Pastikan perangkat Anda telah terpasang perangkat lunak pendukung berikut:
- **Git**: Versi terbaru untuk *version control*.
- **Node.js**: Versi `18.x` atau lebih baru ([Unduh Node.js](https://nodejs.org/)).
- **npm** (bawaan Node.js) atau **yarn**.
- **Flutter SDK**: Versi `3.x` atau lebih baru ([Unduh Flutter SDK](https://docs.flutter.dev/get-started/install)).
- **Database**: PostgreSQL / MySQL / SQLite atau konfigurasi Mock Data Store bawaan Express.
- **Emulator / Device**: Android Studio (Emulator Android), Xcode (iOS Simulator di macOS), atau perangkat fisik dengan fitur *USB Debugging* aktif.

---

### 2. Backend Setup (Express.js REST API)
Backend bertugas menangani logika bisnis, pengolahan data, dan penyediaan REST API endpoint.

1. **Clone repositori dan masuk ke direktori backend:**
   ```bash
   git clone https://github.com/keisyalanika/MoneyMate.git
   cd MoneyMate/BE    # atau cd backend
   ```

2. **Install dependensi Node.js:**
   ```bash
   npm install
   ```

3. **Setup environment variable (`.env`):**
   Salin atau buat file `.env` di dalam direktori `BE/`:
   ```env
   PORT=5000
   NODE_ENV=development
   DATABASE_URL=postgres://user:password@localhost:5432/moneymate
   JWT_SECRET=supersecretjwtkeymoneymate2026
   CLIENT_URL=http://localhost:3000
   ```

4. **Migrasi dan Seed Database:**
   Inisialisasi skema tabel dan data awal (apabila menggunakan skema database):
   ```bash
   npm run db:migrate    # atau npm run seed (sesuai script database yang dikonfigurasi)
   ```

5. **Jalankan server Backend:**
   ```bash
   npm run dev
   ```
   Server backend akan aktif pada: `http://localhost:5000` (Base API: `http://localhost:5000/api`).

---

### 3. Web Admin Setup (React + Vite)
Portal web admin digunakan oleh administrator untuk memantau ringkasan analitik dan manajemen data keuangan.

1. **Masuk ke direktori frontend admin:**
   ```bash
   cd ../FE            # atau cd frontend
   ```

2. **Install dependensi paket:**
   ```bash
   npm install
   ```

3. **Setup environment variable (`.env`):**
   Buat file `.env` di dalam direktori `FE/` untuk mengarahkan request ke backend:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api
   ```

4. **Jalankan server lokal pengembangan:**
   ```bash
   npm run dev
   ```
   *(atau gunakan `npm start` sesuai script yang tersedia)*.
   Buka peramban (browser) dan akses portal admin di: `http://localhost:3000` (atau port lokal yang ditampilkan terminal Vite).

---

### 4. Mobile App Setup (Flutter)
Aplikasi mobile diperuntukkan bagi pengguna untuk mencatat dan memantau keuangan harian.

1. **Masuk ke direktori mobile:**
   ```bash
   cd ../MOBILE        # atau cd mobile
   ```

2. **Unduh seluruh dependensi Flutter:**
   ```bash
   flutter pub get
   ```

3. **Konfigurasi Base URL API:**
   Buka file `lib/services/api_service.dart` dan sesuaikan nilai `baseUrl` dengan target perangkat yang Anda gunakan:
   - **Android Emulator:** `http://10.0.2.2:5000/api`
   - **iOS Simulator / Desktop / Web:** `http://localhost:5000/api`
   - **Perangkat Fisik (Real Device):** `http://<IP_KOMPUTER_ANDA>:5000/api` *(pastikan ponsel dan komputer terhubung pada jaringan Wi-Fi lokal yang sama)*.

4. **Jalankan aplikasi ke target device/emulator:**
   ```bash
   flutter run
   ```

---

## 💻 Cara Penggunaan (Usage)

### Alur Menjalankan Sistem Secara End-to-End
Untuk menjalankan seluruh ekosistem MoneyMate secara terintegrasi, ikuti alur berikut:

1. **Nyalakan Backend Terlebih Dahulu**
   Pastikan REST API Server Express telah berjalan di port `5000`. Uji ketersediaan API dengan membuka `http://localhost:5000/api/summary` di browser atau API client (Postman/Curl).
2. **Akses Portal Admin Web di Browser**
   Jalankan server Frontend React dan buka `http://localhost:3000` pada browser. Anda dapat melihat dashboard analitik, ringkasan saldo, daftar transaksi, serta melakukan pemantauan anggaran.
3. **Jalankan Aplikasi Mobile via Emulator / Perangkat Fisik**
   Jalankan aplikasi Flutter pada emulator atau smartphone fisik Anda. Aplikasi akan terhubung langsung ke API Backend untuk sinkronisasi pemasukan, pengeluaran, dan tabungan secara real-time.

### Ringkasan Endpoint Utama REST API
Seluruh request API menggunakan awalan (*prefix*) `/api`:

| HTTP Method | Endpoint | Deskripsi Fungsi |
| :--- | :--- | :--- |
| `GET` | `/api/summary` | Mengambil rangkuman total saldo, pemasukan, pengeluaran, dan progres anggaran |
| `GET` | `/api/transactions` | Mengambil daftar riwayat transaksi (mendukung query parameter `type` & `search`) |
| `POST` | `/api/transactions` | Menambahkan pencatatan transaksi baru (pemasukan atau pengeluaran) |
| `DELETE` | `/api/transactions/:id` | Menghapus data transaksi tertentu berdasarkan ID |
| `GET` | `/api/categories` | Mengambil daftar master kategori transaksi, warna tema, dan ikon |
| `GET` | `/api/budgets` | Mengambil data anggaran bulanan, limit pengeluaran, dan persentase penggunaan |

### Alur Login dan Akses Akun
1. **Pendaftaran / Autentikasi Pengguna:** Pengguna memasukkan email dan kata sandi pada halaman Login/Register di aplikasi mobile atau portal web admin.
2. **Verifikasi Kredensial:** Backend memverifikasi data pengguna dan menerbitkan token otentikasi / session data.
3. **Penyimpanan Sesi:** Client (Mobile/Web) menyimpan token otentikasi secara aman untuk otorisasi request transaksi berikutnya.
4. **Akses Dashboard Utama:** Setelah berhasil diautentikasi, pengguna diarahkan ke Dashboard utama untuk mulai mencatat dan memantau transaksi finansial.

---

## 🤝 Panduan Kontribusi (Contributing)

Kami sangat menyambut kontribusi dari seluruh anggota tim maupun komunitas untuk pengembangan MoneyMate. Silakan ikuti alur standar kontribusi tim berikut:

1. **Fork Repositori**
   Klik tombol **Fork** di pojok kanan atas repositori ini untuk membuat salinan repositori pada akun GitHub Anda.

2. **Buat Feature Branch Baru**
   Clone repositori hasil fork ke komputer lokal Anda dan buat branch baru untuk fitur atau perbaikan yang akan dikerjakan:
   ```bash
   git checkout -b feature/NamaFitur
   ```
   *Contoh penamaan branch:*
   - `feature/savings-goal-reminder`
   - `fix/budget-calculation-bug`
   - `refactor/api-response-handler`

3. **Terapkan Perubahan & Standar Commit Message**
   Gunakan format *Conventional Commits* agar riwayat commit rapi dan mudah ditelusuri:
   - `feat:` Penambahan fitur baru (misal: `feat: implementasi target tabungan dan reminder`)
   - `fix:` Perbaikan bug atau kendala (misal: `fix: perbaikan kalkulasi persentase anggaran`)
   - `docs:` Pembaruan atau penambahan dokumentasi (misal: `docs: update setup guide di README`)
   - `style:` Perubahan format kode, spasi, atau styling tanpa memengaruhi logika program
   - `refactor:` Restrukturisasi kode tanpa menambah fitur baru atau memperbaiki bug
   - `test:` Penambahan atau pembaruan pengujian (unit/integration test)

   Simpan perubahan Anda:
   ```bash
   git add .
   git commit -m "feat: tambahkan fitur pelacakan target tabungan"
   ```

4. **Push ke Branch Repositori Anda**
   ```bash
   git push origin feature/NamaFitur
   ```

5. **Buat Pull Request (PR)**
   - Masuk ke repositori utama MoneyMate di GitHub.
   - Klik tab **Pull Requests** lalu pilih **New Pull Request**.
   - Bandingkan branch Anda dengan branch `main` repositori utama.
   - Berikan judul yang jelas dan deskripsikan secara rinci perubahan yang dibuat, konteks, serta screenshot (bila ada perubahan antarmuka pengguna).
   - Tunggu tim peninjau (*code reviewer*) melakukan peninjauan sebelum di-merge ke branch utama.

