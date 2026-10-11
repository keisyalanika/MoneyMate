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
