# MoneyMate - REST API Specification

Dokumentasi lengkap RESTful API MoneyMate. Digunakan oleh **FE (Frontend Web Admin)** dan **MOBILE (Flutter App)**.

**Base URL:** `http://localhost:5000/api`

---

## 1. Authentication & User API (`/api/auth`)

### POST `/auth/login`
Autentikasi akun pengguna (Mahasiswa & Admin).
- **Body**: `{ "email": "user@example.com", "password": "password" }`
- **Response**: `{ "id": 2, "name": "...", "email": "...", "role": "student", "token": "..." }`

### POST `/auth/register`
Pendaftaran akun baru mahasiswa.
- **Body**: `{ "name": "...", "email": "...", "password": "...", "phone": "..." }`

### POST `/auth/forgot-password`
Meminta pengiriman 6-digit kode pemulihan OTP ke email terdaftar.
- **Body**: `{ "email": "keisyaexahaniyah@gmail.com" }`
- **Response**: `{ "success": true, "message": "Kode pemulihan OTP 6-digit berhasil dikirimkan", "otp_preview": "123456" }`

### POST `/auth/verify-otp`
Memverifikasi validitas kode OTP.
- **Body**: `{ "email": "keisyaexahaniyah@gmail.com", "otp_code": "123456" }`
- **Response**: `{ "success": true, "message": "Kode OTP berhasil diverifikasi", "reset_token": "..." }`

### POST `/auth/reset-password`
Menyimpan kata sandi baru menggunakan kode OTP valid tanpa login.
- **Body**: `{ "email": "keisyaexahaniyah@gmail.com", "otp_code": "123456", "new_password": "NewPassword123" }`

### GET `/auth/profile` & PUT `/auth/profile`
Mengambil & memperbarui data profil (termasuk `birth_date` dan `bio`).

---

## 2. Wallets & Balance API (`/api/wallets`)

### GET `/wallets`
Mengambil seluruh daftar dompet/rekening pengguna beserta total saldo akumulatif.
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": [
    { "id": 1, "name": "Dompet Utama (Cash)", "balance": 1500000, "currency": "IDR", "is_default": 1 },
    { "id": 2, "name": "Rekening Bank BCA", "balance": 850000, "currency": "IDR", "is_default": 0 }
  ],
  "totalBalance": 2350000
}
```

### POST `/wallets/setup-initial`
Menyimpan saldo awal mahasiswa saat pertama kali onboarding (`setup_saldo_screen.dart`).
- **Body**: `{ "amount": 1500000, "wallet_name": "Dompet Utama" }`

### POST `/wallets/:id/adjust`
Menambah atau mengurangi saldo dompet secara cepat dan mencatat transaksi penyesuaian otomatis.
- **Body**: `{ "type": "add" | "subtract", "amount": 50000, "note": "Top up saldo cash" }`

---

## 3. Categories API (`/api/categories`)

### GET `/categories`
Mengambil daftar kategori (Kategori default sistem + Kategori kustom milik mahasiswa yang login).
- **Query**: `type=income` atau `type=expense`
- **Item Fields**: `id`, `name`, `type`, `icon`, `color`, `is_pinned`

### POST `/categories`
Menambah kategori baru (Mahasiswa menambahkan kategori personal ber-`user_id`, Admin menambahkan kategori publik).
- **Body**: `{ "name": "Buku & Alat Tulis", "type": "expense", "icon": "school", "color": "#D95B27", "is_pinned": true }`

### PUT `/categories/:id/pin`
Menyematkan (pin) kategori prioritas agar tampil di posisi teratas.
- **Body**: `{ "is_pinned": true }`

---

## 4. AI Financial Insights & Chatbot (`/api/insights`)

### POST `/insights/chat`
Endpoint interaktif asisten AI keuangan mahasiswa (digunakan oleh `ai_chat_screen.dart`).
- **Body**: `{ "message": "Bulan ini pengeluaran terbesar aku di mana ya? Dan gimana tips hematnya?" }`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "reply": "Bulan ini pengeluaran terbesar kamu ada di pos Makanan & Minuman sebesar Rp 1.420.000...",
    "top_category": "Makanan & Minuman",
    "top_amount": 1420000,
    "total_balance": 2450000,
    "tip": "Batasi jajan impulsif di luar jam kuliah utama."
  }
}
```

### POST `/insights/generate`
Menganalisis catatan keuangan dan membuat insight finansial proaktif baru.

---

## 5. Budget Alerts & Interventions (`/api/budgets`)

### POST `/budgets/:id/alert`
Admin kampus mengirim peringatan defisit atau apresiasi kedisiplinan keuangan ke notifikasi mahasiswa (`BudgetsPage.tsx`).
- **Body**:
```json
{
  "alert_type": "warning",
  "custom_message": "Pengeluaran pos Makanan & Minuman melebihi pagu bulanan. Silakan konsultasikan dengan BAAK.",
  "push_notif": true
}
```

---

## 6. Notifications API (`/api/notifications`)

### GET `/notifications`
Mengambil daftar notifikasi pengguna beserta jumlah pesan belum dibaca (`unreadCount`).

### POST `/notifications`
Membuat notifikasi baru untuk pengguna tertentu.
- **Body**: `{ "user_id": 2, "title": "...", "message": "..." }`

### POST `/notifications/broadcast`
Admin kampus mengirim notifikasi massal ke seluruh mahasiswa.

---

## 7. Reports & Summary Export API (`/api/reports`)

### GET `/reports/export`
Menghasilkan ringkasan laporan finansial komprehensif (arus kas, rincian per pos belanja, over-budget, rasio tabungan).

### POST `/reports/schedule`
Menyimpan jadwal otomatis pembuatan laporan berkala.
- **Body**: `{ "frequency": "Setiap Senin", "time": "08:00 WIB", "subject": "Laporan Arus Kas Mingguan" }`
