import React, { useState } from 'react';
import { Download } from 'lucide-react';

interface AnalyticsPageProps {
  fmtMoney: (idr: string, usd: string) => string;
  totalUsersCount?: number;
}

type MonthKey = 'current' | 'September' | 'Agustus' | 'Juli' | 'Juni' | 'Mei';

interface MonthAnalyticsData {
  displayLabel: string;
  subHeaderDate: string;
  totalTurnoverIdr: string;
  totalTurnoverUsd: string;
  turnoverMom: string;
  savingRatio: string;
  savingStatus: string;
  savingProgressWidth: string;
  dailyMedianIdr: string;
  dailyMedianUsd: string;
  dailySafeLimit: string;
  healthScore: number;
  healthStatus: string;
  healthPts: string;
  chartPathIn: string;
  chartPathOut: string;
  chartHighlightX: number;
  chartHighlightMonth: string;
  cyclePola: string;
  surplusKas: string;
  proporsiTotalIdr: string;
  proporsiDominanTitle: string;
  proporsiDominanDesc: string;
  categories: {
    name: string;
    amountIdr: string;
    percent: string;
    color: string;
  }[];
  insights: {
    badge: string;
    badgePercent: string;
    title: string;
    description: string;
    recommendation: string;
    impactLabel: string;
    impactValue: string;
    isDefisitAlert?: boolean;
  }[];
  cohort: {
    id: number;
    angkatan: string;
    semester: string;
    badge: string;
    totalMhs: string;
    uangSaku: string;
    tabunganPercent: string;
    tabunganWidth: string;
    literasiScore: string;
    risikoPercent: string;
    risikoStatus: string;
    risikoColor: string;
    evaluasi: string;
    evaluasiColor: string;
  }[];
}

export const AnalyticsPage: React.FC<AnalyticsPageProps> = ({ fmtMoney, totalUsersCount = 1245 }) => {
  // Real-time current month calculation
  const now = new Date();
  const monthNamesIndo = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const currentMonthName = monthNamesIndo[now.getMonth()];
  const currentYear = now.getFullYear();
  const currentMonthDisplay = `Bulan ini : ${currentMonthName} ${currentYear}`;

  const [selectedMonthKey, setSelectedMonthKey] = useState<MonthKey>('current');
  const [sortField, setSortField] = useState<'defisit' | 'literasi' | 'mhs'>('defisit');
  const [actionToast, setActionToast] = useState<string | null>(null);

  // Month-by-month rich dummy datasets
  const monthDatasets: Record<MonthKey, MonthAnalyticsData> = {
    current: {
      displayLabel: currentMonthDisplay,
      subHeaderDate: `${currentMonthName} ${currentYear}`,
      totalTurnoverIdr: 'Rp 5.090.000.000',
      totalTurnoverUsd: '$ 328.380',
      turnoverMom: '↑ +12% MoM vs Rp 4.5M bln lalu',
      savingRatio: '18.2%',
      savingStatus: 'Tercapai',
      savingProgressWidth: '80%',
      dailyMedianIdr: 'Rp 42.500',
      dailyMedianUsd: '$ 2.74',
      dailySafeLimit: 'Batas aman rekomendasi: Rp 45.000',
      healthScore: 74,
      healthStatus: 'Cukup Sehat',
      healthPts: '↑ +4.1 pts sejak awal semester',
      chartPathIn: 'M 60 100 L 130 90 L 210 70 L 290 52 L 370 45 L 460 38',
      chartPathOut: 'M 60 115 L 130 102 L 210 88 L 290 75 L 370 68 L 460 62',
      chartHighlightX: 460,
      chartHighlightMonth: `${currentMonthName} ${currentYear}`,
      cyclePola: 'Pengeluaran memuncak di W1 (bayar kos/UKT) & W4 (persiapan akhir bulan).',
      surplusKas: '+Rp 842 Jt',
      proporsiTotalIdr: 'Rp 1.840.000.000',
      proporsiDominanTitle: 'Makanan & Kos: 62%',
      proporsiDominanDesc: 'Total Rp 1.14 Miliar terserap untuk kebutuhan primer bulanan mahasiswa.',
      categories: [
        { name: 'Makanan & Minuman', amountIdr: 'Rp 699.200.000', percent: '38%', color: 'bg-[#5C2D16]' },
        { name: 'Tempat Tinggal & Kos', amountIdr: 'Rp 441.600.000', percent: '24%', color: 'bg-[#C25E38]' },
        { name: 'Akademik & Kuliah', amountIdr: 'Rp 276.000.000', percent: '15%', color: 'bg-amber-500' },
        { name: 'Transportasi Kampus', amountIdr: 'Rp 165.600.000', percent: '9%', color: 'bg-emerald-600' },
        { name: 'Nongkrong & Hiburan', amountIdr: 'Rp 147.200.000', percent: '8%', color: 'bg-amber-700' },
        { name: 'Lain-lain & Darurat', amountIdr: 'Rp 110.400.000', percent: '6%', color: 'bg-stone-400' }
      ],
      insights: [
        {
          badge: 'Pola Kritis Kampus',
          badgePercent: '62% Mahasiswa',
          title: 'Pola Tanggal Kritis Finansial (Tgl 23 – 28)',
          description: 'Sebanyak 62% mahasiswa mengalami penurunan saldo rekening/dompet hingga di bawah Rp 50.000 pada tanggal 23 hingga 28 menjelang transfer uang saku baru.',
          recommendation: 'Luncurkan fitur "Smart Envelope Lockdown" otomatis di H-10 akhir bulan untuk membatasi belanja non-pokok.',
          impactLabel: 'Dampak Finansial:',
          impactValue: '⚠️ Defisit tinggi',
          isDefisitAlert: true
        },
        {
          badge: 'Adopsi Fitur Pintar',
          badgePercent: '+45% Maba',
          title: 'Lonjakan Metode Pencatatan Digital Terintegrasi',
          description: 'Metode pencatatan pengeluaran digital melonjak 45% adopsinya di kalangan mahasiswa baru (Semester 1). Mengurangi tingkat lupa mencatat pengeluaran kantin dan perlengkapan studi.',
          recommendation: 'Mahasiswa yang mencatat teratur memiliki akurasi estimasi sisa uang bulanan 3x lebih tepat.',
          impactLabel: 'Tingkat Retensi Pengguna:',
          impactValue: '88.4% Aktif'
        },
        {
          badge: 'Riset Demografis',
          badgePercent: '32% Proporsi',
          title: 'Korelasi Pengeluaran Kos Mahasiswa Rantau',
          description: 'Mahasiswa perantau rata-rata menyisihkan 32% dari total uang saku bulanannya khusus untuk biaya sewa kos dan iuran listrik/air, jauh lebih tinggi dari mahasiswa non-rantau (6% transportasi rumah).',
          recommendation: 'Integrasi pengingat tagihan kos bersama bapak/ibu kos via sistem notifikasi WhatsApp MoneyMate.',
          impactLabel: 'Populasi Terdampak:',
          impactValue: '9.190 Mahasiswa Rantau'
        }
      ],
      cohort: [
        { id: 1, angkatan: 'Angkatan 2026', semester: 'Semester 1 - 2', badge: 'Mahasiswa Baru - Transisi Kemandirian', totalMhs: '4.210 mhs', uangSaku: 'Rp 2.100.000 /bln', tabunganPercent: '11.4%', tabunganWidth: '28%', literasiScore: '61 / 100', risikoPercent: '38.5%', risikoStatus: 'Tinggi', risikoColor: 'bg-rose-100 text-rose-800 border-rose-200', evaluasi: 'Perlu Mentoring Budget', evaluasiColor: 'text-amber-800 font-bold' },
        { id: 2, angkatan: 'Angkatan 2025', semester: 'Semester 3 - 4', badge: 'Tahun Kedua - Organisasi & Proyek', totalMhs: '3.850 mhs', uangSaku: 'Rp 2.350.000 /bln', tabunganPercent: '17.8%', tabunganWidth: '45%', literasiScore: '73 / 100', risikoPercent: '19.2%', risikoStatus: 'Moderat', risikoColor: 'bg-amber-100 text-amber-900 border-amber-200', evaluasi: 'Stabil', evaluasiColor: 'text-emerald-700 font-bold' },
        { id: 3, angkatan: 'Angkatan 2024', semester: 'Semester 5 - 6', badge: 'Magang Industri MBKM & Part-time', totalMhs: '3.620 mhs', uangSaku: 'Rp 3.150.000 /bln', tabunganPercent: '23.5%', tabunganWidth: '65%', literasiScore: '82 / 100', risikoPercent: '8.4%', risikoStatus: 'Rendah', risikoColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', evaluasi: 'Mandiri Finansial', evaluasiColor: 'text-emerald-800 font-bold' },
        { id: 4, angkatan: 'Angkatan 2023', semester: 'Semester 7 - 8+', badge: 'Penyusunan Skripsi & Persiapan Karir', totalMhs: '3.140 mhs', uangSaku: 'Rp 2.800.000 /bln', tabunganPercent: '20.1%', tabunganWidth: '55%', literasiScore: '80 / 100', risikoPercent: '12.1%', risikoStatus: 'Terkendali', risikoColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', evaluasi: 'Dana Kelulusan Siap', evaluasiColor: 'text-[#5C2D16] font-bold' }
      ]
    },
    September: {
      displayLabel: 'September',
      subHeaderDate: `September ${currentYear}`,
      totalTurnoverIdr: 'Rp 4.545.000.000',
      totalTurnoverUsd: '$ 293.225',
      turnoverMom: '↑ +7.9% MoM vs Rp 4.21M di Agustus',
      savingRatio: '16.5%',
      savingStatus: 'Tercapai',
      savingProgressWidth: '72%',
      dailyMedianIdr: 'Rp 39.800',
      dailyMedianUsd: '$ 2.56',
      dailySafeLimit: 'Batas aman rekomendasi: Rp 45.000',
      healthScore: 71,
      healthStatus: 'Cukup Sehat',
      healthPts: '↑ +2.8 pts pemulihan pasca registrasi',
      chartPathIn: 'M 60 100 L 130 90 L 210 70 L 290 52 L 370 45 L 460 38',
      chartPathOut: 'M 60 115 L 130 102 L 210 88 L 290 75 L 370 68 L 460 62',
      chartHighlightX: 370,
      chartHighlightMonth: `September ${currentYear}`,
      cyclePola: 'Arus kas mulai stabil pasca-ospek & orientasi, lonjakan terdeteksi pada minggu ke-2 pembelian buku studi.',
      surplusKas: '+Rp 765 Jt',
      proporsiTotalIdr: 'Rp 1.620.000.000',
      proporsiDominanTitle: 'Buku Studi & Makanan: 54%',
      proporsiDominanDesc: 'Total Rp 874.8 Juta terserap untuk modul ajar perkuliahan dan makan harian.',
      categories: [
        { name: 'Makanan & Minuman', amountIdr: 'Rp 615.600.000', percent: '38%', color: 'bg-[#5C2D16]' },
        { name: 'Tempat Tinggal & Kos', amountIdr: 'Rp 388.800.000', percent: '24%', color: 'bg-[#C25E38]' },
        { name: 'Akademik & Buku Kuliah', amountIdr: 'Rp 259.200.000', percent: '16%', color: 'bg-amber-500' },
        { name: 'Transportasi Kampus', amountIdr: 'Rp 145.800.000', percent: '9%', color: 'bg-emerald-600' },
        { name: 'Nongkrong & Kafe', amountIdr: 'Rp 113.400.000', percent: '7%', color: 'bg-amber-700' },
        { name: 'Lain-lain & Kuota Riset', amountIdr: 'Rp 97.200.000', percent: '6%', color: 'bg-stone-400' }
      ],
      insights: [
        {
          badge: 'Pola Kritis Kampus',
          badgePercent: '54% Mahasiswa',
          title: 'Pola Tanggal Kritis Akhir Bulan (Tgl 25 – 30)',
          description: 'Sebanyak 54% mahasiswa mengalami pengetatan belanja pada minggu terakhir September karena pembayaran uang praktikum laboratorium.',
          recommendation: 'Aktifkan reminder batas penarikan ATM harian maksimal Rp 50.000 di 5 hari terakhir bulan.',
          impactLabel: 'Dampak Finansial:',
          impactValue: '⚠️ Defisit moderat',
          isDefisitAlert: true
        },
        {
          badge: 'Adopsi Fitur Pintar',
          badgePercent: '+35% Pengguna',
          title: 'Peningkatan Adopsi Dompet Digital Kampus',
          description: 'Metode pembayaran digital QRIS kantin kampus mencatat peningkatan 35% transaksi non-tunai di bulan September.',
          recommendation: 'Program cashback tabungan mikro otomatis sukses mendorong 420 mahasiswa baru mulai menabung.',
          impactLabel: 'Tingkat Keaktifan:',
          impactValue: '84.2% Aktif'
        },
        {
          badge: 'Riset Demografis',
          badgePercent: '28% Proporsi',
          title: 'Lonjakan Pengeluaran Kuota & Percetakan Tugas',
          description: 'Mahasiswa tingkat awal mengeluarkan rerata Rp 85.000 di minggu ke-3 untuk kebutuhan modul praktikum laboratorium.',
          recommendation: 'Kolaborasi dengan koperasi kampus untuk penyediaan paket buku hemat digital.',
          impactLabel: 'Populasi Terdampak:',
          impactValue: '7.820 Mahasiswa'
        }
      ],
      cohort: [
        { id: 1, angkatan: 'Angkatan 2026', semester: 'Semester 1 - 2', badge: 'Mahasiswa Baru - Adaptasi Perkuliahan', totalMhs: '4.210 mhs', uangSaku: 'Rp 2.050.000 /bln', tabunganPercent: '10.2%', tabunganWidth: '25%', literasiScore: '58 / 100', risikoPercent: '41.2%', risikoStatus: 'Tinggi', risikoColor: 'bg-rose-100 text-rose-800 border-rose-200', evaluasi: 'Adaptasi Pengeluaran', evaluasiColor: 'text-amber-800 font-bold' },
        { id: 2, angkatan: 'Angkatan 2025', semester: 'Semester 3 - 4', badge: 'Tahun Kedua - Organisasi & Kuliah', totalMhs: '3.850 mhs', uangSaku: 'Rp 2.300.000 /bln', tabunganPercent: '16.5%', tabunganWidth: '42%', literasiScore: '70 / 100', risikoPercent: '21.0%', risikoStatus: 'Moderat', risikoColor: 'bg-amber-100 text-amber-900 border-amber-200', evaluasi: 'Stabil Terkendali', evaluasiColor: 'text-emerald-700 font-bold' },
        { id: 3, angkatan: 'Angkatan 2024', semester: 'Semester 5 - 6', badge: 'Magang Industri & Proyek Dosen', totalMhs: '3.620 mhs', uangSaku: 'Rp 3.050.000 /bln', tabunganPercent: '22.1%', tabunganWidth: '60%', literasiScore: '80 / 100', risikoPercent: '9.6%', risikoStatus: 'Rendah', risikoColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', evaluasi: 'Mandiri Finansial', evaluasiColor: 'text-emerald-800 font-bold' },
        { id: 4, angkatan: 'Angkatan 2023', semester: 'Semester 7 - 8+', badge: 'Penyusunan Proposal & Skripsi', totalMhs: '3.140 mhs', uangSaku: 'Rp 2.750.000 /bln', tabunganPercent: '19.4%', tabunganWidth: '50%', literasiScore: '78 / 100', risikoPercent: '13.5%', risikoStatus: 'Terkendali', risikoColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', evaluasi: 'Fokus Riset', evaluasiColor: 'text-[#5C2D16] font-bold' }
      ]
    },
    Agustus: {
      displayLabel: 'Agustus',
      subHeaderDate: `Agustus ${currentYear}`,
      totalTurnoverIdr: 'Rp 4.210.000.000',
      totalTurnoverUsd: '$ 271.612',
      turnoverMom: '↑ +15.4% MoM periode registrasi semester',
      savingRatio: '14.2%',
      savingStatus: 'Mendekati Target',
      savingProgressWidth: '60%',
      dailyMedianIdr: 'Rp 51.500',
      dailyMedianUsd: '$ 3.32',
      dailySafeLimit: 'Puncak Registrasi Mahasiswa Baru',
      healthScore: 67,
      healthStatus: 'Perhatian (Transisi)',
      healthPts: '⚠️ Beban tinggi uang pangkal & kos tahunan',
      chartPathIn: 'M 60 100 L 130 90 L 210 70 L 290 52 L 370 45 L 460 38',
      chartPathOut: 'M 60 115 L 130 102 L 210 88 L 290 75 L 370 68 L 460 62',
      chartHighlightX: 290,
      chartHighlightMonth: `Agustus ${currentYear}`,
      cyclePola: 'Puncak perputaran kas tahunan karena pelunasan UKT semester gasal dan uang sewa kos tahunan.',
      surplusKas: '+Rp 520 Jt',
      proporsiTotalIdr: 'Rp 2.150.000.000',
      proporsiDominanTitle: 'UKT & Tempat Tinggal: 72%',
      proporsiDominanDesc: 'Pengeluaran terkonsentrasi pada pelunasan biaya kuliah awal dan uang muka tempat tinggal.',
      categories: [
        { name: 'UKT Perkuliahan & Registrasi', amountIdr: 'Rp 967.500.000', percent: '45%', color: 'bg-[#5C2D16]' },
        { name: 'Tempat Tinggal & Sewa Kos', amountIdr: 'Rp 580.500.000', percent: '27%', color: 'bg-[#C25E38]' },
        { name: 'Makanan & Kebutuhan Awal', amountIdr: 'Rp 322.500.000', percent: '15%', color: 'bg-amber-500' },
        { name: 'Transportasi Antarkota/Mudik', amountIdr: 'Rp 150.500.000', percent: '7%', color: 'bg-emerald-600' },
        { name: 'Perlengkapan Kamar Kos', amountIdr: 'Rp 86.000.000', percent: '4%', color: 'bg-amber-700' },
        { name: 'Lain-lain & Biaya Administrasi', amountIdr: 'Rp 43.000.000', percent: '2%', color: 'bg-stone-400' }
      ],
      insights: [
        {
          badge: 'Pola Kritis Kampus',
          badgePercent: '78% Transaksi',
          title: 'Periode Pelunasan UKT & Administrasi (Tgl 10 – 18)',
          description: 'Tercatat perputaran kas keluar tertinggi tahunan untuk pelunasan UKT mahasiswa lama dan baru.',
          recommendation: 'Fasilitasi opsi cicilan UKT 3 termin bagi mahasiswa kategori ekonomi rentan.',
          impactLabel: 'Tingkat Realisasi UKT:',
          impactValue: '96.8% Lunas'
        },
        {
          badge: 'Adopsi Fitur Pintar',
          badgePercent: '+82% Aktivasi',
          title: 'Aktivasi Massal Virtual Account Mahasiswa Baru',
          description: 'Sebanyak 4.100 akun mahasiswa baru berhasil terhubung otomatis ke sistem perbankan kampus MoneyMate.',
          recommendation: 'Sosialisasi program literasi keuangan digital langsung saat masa orientasi kampus.',
          impactLabel: 'Akun Terverifikasi:',
          impactValue: '100% Valid'
        },
        {
          badge: 'Riset Demografis',
          badgePercent: '94% Maba Rantau',
          title: 'Konsentrasi Sewa Kos Tahunan di Radius 2 Km Kampus',
          description: 'Rata-rata pengeluaran awal sewa kos berkisar antara Rp 7.500.000 hingga Rp 14.000.000 per tahun.',
          recommendation: 'Direktori kos binaan kampus dengan verifikasi keamanan dan fasilitas resmi.',
          impactLabel: 'Kamar Terverifikasi:',
          impactValue: '1.240 Unit'
        }
      ],
      cohort: [
        { id: 1, angkatan: 'Angkatan 2026', semester: 'Semester 1 - 2', badge: 'Mahasiswa Baru - Pengeluaran Awal Masuk', totalMhs: '4.210 mhs', uangSaku: 'Rp 2.400.000 /bln', tabunganPercent: '8.5%', tabunganWidth: '20%', literasiScore: '54 / 100', risikoPercent: '48.0%', risikoStatus: 'Tinggi', risikoColor: 'bg-rose-100 text-rose-800 border-rose-200', evaluasi: 'Butuh Pendampingan', evaluasiColor: 'text-rose-700 font-bold' },
        { id: 2, angkatan: 'Angkatan 2025', semester: 'Semester 3 - 4', badge: 'Tahun Kedua - Daftar Ulang Semester', totalMhs: '3.850 mhs', uangSaku: 'Rp 2.250.000 /bln', tabunganPercent: '14.8%', tabunganWidth: '38%', literasiScore: '68 / 100', risikoPercent: '24.5%', risikoStatus: 'Moderat', risikoColor: 'bg-amber-100 text-amber-900 border-amber-200', evaluasi: 'Terkendali', evaluasiColor: 'text-emerald-700 font-bold' },
        { id: 3, angkatan: 'Angkatan 2024', semester: 'Semester 5 - 6', badge: 'Persiapan Magang & MBKM', totalMhs: '3.620 mhs', uangSaku: 'Rp 2.900.000 /bln', tabunganPercent: '20.4%', tabunganWidth: '52%', literasiScore: '77 / 100', risikoPercent: '12.0%', risikoStatus: 'Rendah', risikoColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', evaluasi: 'Mandiri Finansial', evaluasiColor: 'text-emerald-800 font-bold' },
        { id: 4, angkatan: 'Angkatan 2023', semester: 'Semester 7 - 8+', badge: 'Tingkat Akhir - KRS & Skripsi', totalMhs: '3.140 mhs', uangSaku: 'Rp 2.700.000 /bln', tabunganPercent: '18.2%', tabunganWidth: '46%', literasiScore: '76 / 100', risikoPercent: '15.2%', risikoStatus: 'Terkendali', risikoColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', evaluasi: 'Stabil', evaluasiColor: 'text-[#5C2D16] font-bold' }
      ]
    },
    Juli: {
      displayLabel: 'Juli',
      subHeaderDate: `Juli ${currentYear}`,
      totalTurnoverIdr: 'Rp 3.650.000.000',
      totalTurnoverUsd: '$ 235.483',
      turnoverMom: '↓ -12% MoM periode libur semester',
      savingRatio: '21.4%',
      savingStatus: 'Tercapai',
      savingProgressWidth: '90%',
      dailyMedianIdr: 'Rp 28.500',
      dailyMedianUsd: '$ 1.83',
      dailySafeLimit: 'Periode Libur Semester',
      healthScore: 78,
      healthStatus: 'Sangat Sehat',
      healthPts: '↑ +6.2 pts periode hemat liburan',
      chartPathIn: 'M 60 100 L 130 90 L 210 70 L 290 52 L 370 45 L 460 38',
      chartPathOut: 'M 60 115 L 130 102 L 210 88 L 290 75 L 370 68 L 460 62',
      chartHighlightX: 210,
      chartHighlightMonth: `Juli ${currentYear}`,
      cyclePola: 'Pengeluaran kampus terendah tahunan karena mayoritas mahasiswa beraktivitas di domisili asal.',
      surplusKas: '+Rp 920 Jt',
      proporsiTotalIdr: 'Rp 1.150.000.000',
      proporsiDominanTitle: 'Tabungan & Kebutuhan Rumah: 68%',
      proporsiDominanDesc: 'Pengeluaran harian berkurang drastis selama masa libur perkuliahan.',
      categories: [
        { name: 'Kebutuhan Pribadi & Rumah', amountIdr: 'Rp 483.000.000', percent: '42%', color: 'bg-[#5C2D16]' },
        { name: 'Makanan & Rekreasi Keluarga', amountIdr: 'Rp 299.000.000', percent: '26%', color: 'bg-[#C25E38]' },
        { name: 'Tabungan Persiapan Semester', amountIdr: 'Rp 184.000.000', percent: '16%', color: 'bg-emerald-600' },
        { name: 'Transportasi & Travelling', amountIdr: 'Rp 115.000.000', percent: '10%', color: 'bg-amber-500' },
        { name: 'Lain-lain', amountIdr: 'Rp 69.000.000', percent: '6%', color: 'bg-stone-400' }
      ],
      insights: [
        {
          badge: 'Pola Kritis Kampus',
          badgePercent: '18% Mahasiswa',
          title: 'Aktivitas Dompet Mahasiswa di Masa Libur',
          description: 'Hanya 18% mahasiswa aktif melakukan transaksi di lingkungan sekitar kampus selama bulan Juli.',
          recommendation: 'Pertahankan proteksi saldo aman untuk persiapan pembayaran UKT bulan Agustus.',
          impactLabel: 'Status Akun:',
          impactValue: 'Aman & Stabil'
        },
        {
          badge: 'Adopsi Fitur Pintar',
          badgePercent: '+28% Auto-Save',
          title: 'Peningkatan Penabungan Otomatis',
          description: 'Mahasiswa memanfaatkan fitur target tabungan untuk mengumpulkan uang semester baru.',
          recommendation: 'Target rata-rata tabungan tercapai 88% di akhir Juli.',
          impactLabel: 'Kepatuhan:',
          impactValue: 'Tinggi'
        },
        {
          badge: 'Riset Demografis',
          badgePercent: '75% Domisili',
          title: 'Aktivitas Mahasiswa di Luar Kampus',
          description: '75% mahasiswa aktif mengakses aplikasi dari luar kota universitas.',
          recommendation: 'Layanan konsultasi keuangan daring dibuka penuh selama libur.',
          impactLabel: 'Akses Daring:',
          impactValue: 'Lancar'
        }
      ],
      cohort: [
        { id: 1, angkatan: 'Angkatan 2026', semester: 'Semester 1 - 2', badge: 'Calon Mahasiswa Baru', totalMhs: '4.210 mhs', uangSaku: 'Rp 1.800.000 /bln', tabunganPercent: '22.0%', tabunganWidth: '55%', literasiScore: '65 / 100', risikoPercent: '14.0%', risikoStatus: 'Rendah', risikoColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', evaluasi: 'Stabil', evaluasiColor: 'text-emerald-700 font-bold' },
        { id: 2, angkatan: 'Angkatan 2025', semester: 'Semester 3 - 4', badge: 'Libur Kenaikan Tingkat', totalMhs: '3.850 mhs', uangSaku: 'Rp 2.000.000 /bln', tabunganPercent: '24.5%', tabunganWidth: '62%', literasiScore: '74 / 100', risikoPercent: '11.5%', risikoStatus: 'Rendah', risikoColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', evaluasi: 'Sehat', evaluasiColor: 'text-emerald-700 font-bold' },
        { id: 3, angkatan: 'Angkatan 2024', semester: 'Semester 5 - 6', badge: 'Magang Liburan & Part-Time', totalMhs: '3.620 mhs', uangSaku: 'Rp 2.800.000 /bln', tabunganPercent: '28.0%', tabunganWidth: '70%', literasiScore: '84 / 100', risikoPercent: '7.2%', risikoStatus: 'Rendah', risikoColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', evaluasi: 'Mandiri Finansial', evaluasiColor: 'text-emerald-800 font-bold' },
        { id: 4, angkatan: 'Angkatan 2023', semester: 'Semester 7 - 8+', badge: 'Persiapan Riset Akhir', totalMhs: '3.140 mhs', uangSaku: 'Rp 2.500.000 /bln', tabunganPercent: '21.0%', tabunganWidth: '53%', literasiScore: '81 / 100', risikoPercent: '10.8%', risikoStatus: 'Terkendali', risikoColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', evaluasi: 'Siap', evaluasiColor: 'text-[#5C2D16] font-bold' }
      ]
    },
    Juni: {
      displayLabel: 'Juni',
      subHeaderDate: `Juni ${currentYear}`,
      totalTurnoverIdr: 'Rp 4.100.000.000',
      totalTurnoverUsd: '$ 264.516',
      turnoverMom: '↑ +4.2% MoM periode akhir semester genap',
      savingRatio: '17.0%',
      savingStatus: 'Tercapai',
      savingProgressWidth: '74%',
      dailyMedianIdr: 'Rp 38.000',
      dailyMedianUsd: '$ 2.45',
      dailySafeLimit: 'Periode Ujian Akhir Semester (UAS)',
      healthScore: 72,
      healthStatus: 'Cukup Sehat',
      healthPts: '↑ +1.5 pts',
      chartPathIn: 'M 60 100 L 130 90 L 210 70 L 290 52 L 370 45 L 460 38',
      chartPathOut: 'M 60 115 L 130 102 L 210 88 L 290 75 L 370 68 L 460 62',
      chartHighlightX: 130,
      chartHighlightMonth: `Juni ${currentYear}`,
      cyclePola: 'Pengeluaran meningkat pada minggu ke-2 dan 3 untuk kebutuhan tugas akhir dan pencetakan laporan UAS.',
      surplusKas: '+Rp 680 Jt',
      proporsiTotalIdr: 'Rp 1.480.000.000',
      proporsiDominanTitle: 'Akademik & Makanan: 58%',
      proporsiDominanDesc: 'Pengeluaran stabil dengan lonjakan percetakan tugas akhir.',
      categories: [
        { name: 'Makanan & Kafe Belajar', amountIdr: 'Rp 562.400.000', percent: '38%', color: 'bg-[#5C2D16]' },
        { name: 'Tempat Tinggal & Kos', amountIdr: 'Rp 355.200.000', percent: '24%', color: 'bg-[#C25E38]' },
        { name: 'Akademik & Cetak Tugas UAS', amountIdr: 'Rp 266.400.000', percent: '18%', color: 'bg-amber-500' },
        { name: 'Transportasi Kampus', amountIdr: 'Rp 148.000.000', percent: '10%', color: 'bg-emerald-600' },
        { name: 'Lain-lain', amountIdr: 'Rp 148.000.000', percent: '10%', color: 'bg-stone-400' }
      ],
      insights: [
        {
          badge: 'Pola Kritis Kampus',
          badgePercent: '42% Mahasiswa',
          title: 'Lonjakan Kafe Belajar Periode UAS',
          description: 'Peningkatan transaksi di kafe dan working space 24 jam selama 2 minggu masa ujian.',
          recommendation: 'Pemanfaatan perpustakaan kampus sebagai ruang belajar gratis malam hari.',
          impactLabel: 'Penghematan:',
          impactValue: 'Rp 120 Jt/kampus'
        },
        {
          badge: 'Adopsi Fitur Pintar',
          badgePercent: '76% Aktif',
          title: 'Kepatuhan Anggaran Semester Genap',
          description: 'Tingkat kepatuhan amplop anggaran mencapai 76% di akhir masa perkuliahan.',
          recommendation: 'Reward apresiasi bagi mahasiswa dengan rekor 0 overbudget.',
          impactLabel: 'Siswa Patuh:',
          impactValue: '2.840 Mahasiswa'
        },
        {
          badge: 'Riset Demografis',
          badgePercent: '30% Mahasiswa',
          title: 'Persiapan Tiket Mudik Libur Semester',
          description: 'Pembelian tiket transportasi antarkota di minggu ke-4 Juni.',
          recommendation: 'Promo diskon kemitraan kereta api & bus resmi kampus.',
          impactLabel: 'Mitra Transport:',
          impactValue: 'Aktif'
        }
      ],
      cohort: [
        { id: 1, angkatan: 'Angkatan 2026', semester: 'Semester 1 - 2', badge: 'Evaluasi Semester Pertama', totalMhs: '4.210 mhs', uangSaku: 'Rp 2.000.000 /bln', tabunganPercent: '12.5%', tabunganWidth: '32%', literasiScore: '63 / 100', risikoPercent: '32.0%', risikoStatus: 'Moderat', risikoColor: 'bg-amber-100 text-amber-900 border-amber-200', evaluasi: 'Meningkat', evaluasiColor: 'text-emerald-700 font-bold' },
        { id: 2, angkatan: 'Angkatan 2025', semester: 'Semester 3 - 4', badge: 'Penutupan Tahun Kedua', totalMhs: '3.850 mhs', uangSaku: 'Rp 2.200.000 /bln', tabunganPercent: '18.0%', tabunganWidth: '45%', literasiScore: '72 / 100', risikoPercent: '18.0%', risikoStatus: 'Moderat', risikoColor: 'bg-amber-100 text-amber-900 border-amber-200', evaluasi: 'Stabil', evaluasiColor: 'text-emerald-700 font-bold' },
        { id: 3, angkatan: 'Angkatan 2024', semester: 'Semester 5 - 6', badge: 'Persiapan MBKM Semester Gasal', totalMhs: '3.620 mhs', uangSaku: 'Rp 2.950.000 /bln', tabunganPercent: '23.0%', tabunganWidth: '60%', literasiScore: '81 / 100', risikoPercent: '8.8%', risikoStatus: 'Rendah', risikoColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', evaluasi: 'Mandiri', evaluasiColor: 'text-emerald-800 font-bold' },
        { id: 4, angkatan: 'Angkatan 2023', semester: 'Semester 7 - 8+', badge: 'Seminar Hasil & Sidang', totalMhs: '3.140 mhs', uangSaku: 'Rp 2.700.000 /bln', tabunganPercent: '19.8%', tabunganWidth: '50%', literasiScore: '79 / 100', risikoPercent: '11.8%', risikoStatus: 'Terkendali', risikoColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', evaluasi: 'Terkendali', evaluasiColor: 'text-[#5C2D16] font-bold' }
      ]
    },
    Mei: {
      displayLabel: 'Mei',
      subHeaderDate: `Mei ${currentYear}`,
      totalTurnoverIdr: 'Rp 3.950.000.000',
      totalTurnoverUsd: '$ 254.838',
      turnoverMom: '↑ +6.8% MoM',
      savingRatio: '15.8%',
      savingStatus: 'Tercapai',
      savingProgressWidth: '68%',
      dailyMedianIdr: 'Rp 36.500',
      dailyMedianUsd: '$ 2.35',
      dailySafeLimit: 'Batas aman rekomendasi: Rp 45.000',
      healthScore: 70,
      healthStatus: 'Cukup Sehat',
      healthPts: '↑ +3.0 pts',
      chartPathIn: 'M 60 100 L 130 90 L 210 70 L 290 52 L 370 45 L 460 38',
      chartPathOut: 'M 60 115 L 130 102 L 210 88 L 290 75 L 370 68 L 460 62',
      chartHighlightX: 60,
      chartHighlightMonth: `Mei ${currentYear}`,
      cyclePola: 'Arus kas stabil dengan pengeluaran rutin makan, kos, dan transportasi perkuliahan.',
      surplusKas: '+Rp 640 Jt',
      proporsiTotalIdr: 'Rp 1.410.000.000',
      proporsiDominanTitle: 'Makanan & Kos: 60%',
      proporsiDominanDesc: 'Pengeluaran primer bulanan mahasiswa berjalan dalam koridor aman.',
      categories: [
        { name: 'Makanan & Minuman', amountIdr: 'Rp 535.800.000', percent: '38%', color: 'bg-[#5C2D16]' },
        { name: 'Tempat Tinggal & Kos', amountIdr: 'Rp 338.400.000', percent: '24%', color: 'bg-[#C25E38]' },
        { name: 'Akademik & Kuliah', amountIdr: 'Rp 211.500.000', percent: '15%', color: 'bg-amber-500' },
        { name: 'Transportasi Kampus', amountIdr: 'Rp 155.100.000', percent: '11%', color: 'bg-emerald-600' },
        { name: 'Nongkrong & Hiburan', amountIdr: 'Rp 112.800.000', percent: '8%', color: 'bg-amber-700' },
        { name: 'Lain-lain', amountIdr: 'Rp 56.400.000', percent: '4%', color: 'bg-stone-400' }
      ],
      insights: [
        {
          badge: 'Pola Kritis Kampus',
          badgePercent: '48% Mahasiswa',
          title: 'Pengeluaran Terkendali Pertengahan Semester',
          description: 'Sebagian besar mahasiswa mempertahankan saldo di atas Rp 200.000 di pertengahan bulan.',
          recommendation: 'Pertahankan disiplin pos belanja mingguan.',
          impactLabel: 'Kesehatan Kas:',
          impactValue: 'Normal'
        },
        {
          badge: 'Adopsi Fitur Pintar',
          badgePercent: '68% Pengguna',
          title: 'Penggunaan Fitur Pembagian Pos Anggaran',
          description: '68% pengguna aktif membagi uang saku ke dalam amplop digital MoneyMate.',
          recommendation: 'Fitur amplop digital terbukti menekan angka overbudget hingga 18%.',
          impactLabel: 'Efektivitas:',
          impactValue: 'Tinggi'
        },
        {
          badge: 'Riset Demografis',
          badgePercent: '22% Mahasiswa',
          title: 'Peningkatan Pendapatan Mahasiswa Pekerja Lepas',
          description: 'Penerimaan honor part-time dan asisten laboratorium terekam di akhir Mei.',
          recommendation: 'Panduan pengelolaan pajak penghasilan mikro mahasiswa.',
          impactLabel: 'Pemasukan Tambahan:',
          impactValue: 'Tercatat'
        }
      ],
      cohort: [
        { id: 1, angkatan: 'Angkatan 2026', semester: 'Semester 1 - 2', badge: 'Tingkat Satu', totalMhs: '4.210 mhs', uangSaku: 'Rp 1.950.000 /bln', tabunganPercent: '11.8%', tabunganWidth: '30%', literasiScore: '60 / 100', risikoPercent: '35.0%', risikoStatus: 'Moderat', risikoColor: 'bg-amber-100 text-amber-900 border-amber-200', evaluasi: 'Cukup', evaluasiColor: 'text-amber-800 font-bold' },
        { id: 2, angkatan: 'Angkatan 2025', semester: 'Semester 3 - 4', badge: 'Tingkat Dua', totalMhs: '3.850 mhs', uangSaku: 'Rp 2.150.000 /bln', tabunganPercent: '17.2%', tabunganWidth: '44%', literasiScore: '71 / 100', risikoPercent: '19.5%', risikoStatus: 'Moderat', risikoColor: 'bg-amber-100 text-amber-900 border-amber-200', evaluasi: 'Stabil', evaluasiColor: 'text-emerald-700 font-bold' },
        { id: 3, angkatan: 'Angkatan 2024', semester: 'Semester 5 - 6', badge: 'Tingkat Tiga', totalMhs: '3.620 mhs', uangSaku: 'Rp 2.900.000 /bln', tabunganPercent: '21.5%', tabunganWidth: '55%', literasiScore: '79 / 100', risikoPercent: '10.2%', risikoStatus: 'Rendah', risikoColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', evaluasi: 'Mandiri', evaluasiColor: 'text-emerald-800 font-bold' },
        { id: 4, angkatan: 'Angkatan 2023', semester: 'Semester 7 - 8+', badge: 'Tingkat Empat', totalMhs: '3.140 mhs', uangSaku: 'Rp 2.650.000 /bln', tabunganPercent: '18.9%', tabunganWidth: '48%', literasiScore: '77 / 100', risikoPercent: '13.0%', risikoStatus: 'Terkendali', risikoColor: 'bg-emerald-100 text-emerald-800 border-emerald-200', evaluasi: 'Aman', evaluasiColor: 'text-[#5C2D16] font-bold' }
      ]
    }
  };

  const activeData = monthDatasets[selectedMonthKey] || monthDatasets.current;

  const sortedCohort = [...activeData.cohort].sort((a, b) => {
    if (sortField === 'defisit') {
      return parseFloat(b.risikoPercent) - parseFloat(a.risikoPercent);
    } else if (sortField === 'literasi') {
      return parseInt(b.literasiScore) - parseInt(a.literasiScore);
    } else {
      return parseInt(b.totalMhs.replace(/\D/g, '')) - parseInt(a.totalMhs.replace(/\D/g, ''));
    }
  });

  const handleDownloadCsv = () => {
    setActionToast(`Memproses ekspor file CSV Analitik Finansial (${activeData.subHeaderDate})...`);
    setTimeout(() => {
      setActionToast(`✅ Berkas Analitik_Finansial_${activeData.subHeaderDate.replace(/\s+/g, '_')}.csv berhasil diunduh!`);
      setTimeout(() => setActionToast(null), 3500);
    }, 1200);
  };

  
  return (
    <div className="p-4 sm:p-5 space-y-5 max-w-7xl mx-auto w-full animate-fadeIn text-xs relative">
      {/* Toast Notification */}
      {actionToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#2D2825] text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-emerald-500/50 animate-fadeIn">
          <span className="text-sm">📄</span>
          <span className="font-semibold text-xs">{actionToast}</span>
        </div>
      )}

      {/* Breadcrumb & Top Page Header */}
      <div>
        <div className="text-[11px] text-[#8C7A70] flex items-center gap-1 mb-1">
          <span>Analisis</span>
          <span>›</span>
          <span className="font-semibold text-[#5C2D16]">Statistik Finansial Mahasiswa</span>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="px-2.5 py-0.5 text-[10px] font-bold bg-[#E6D0C7] text-[#5C2D16] rounded uppercase tracking-wider">
              📄 LAPORAN ANALISIS MAKRO FINANSIAL
            </span>
            <h1 className="text-2xl font-black text-[#2D2825] mt-1 tracking-tight">Statistik & Tren Finansial Mahasiswa</h1>
            <p className="text-xs text-[#8C7A70] mt-0.5 max-w-2xl">
              Eksplorasi tren arus kas masuk, proporsi pengeluaran per kategori mahasiswa, dan tren tabungan per semester untuk perumusan program literasi kampus.
            </p>
          </div>

          {/* Pemilihan Bulan Real-Time & Dinamis (User Request) */}
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-white border border-[#E5DDD8] rounded-xl text-xs font-semibold text-[#5C2D16] shadow-sm shrink-0 flex items-center gap-2">
              <span>📅</span>
              <select
                value={selectedMonthKey}
                onChange={e => setSelectedMonthKey(e.target.value as MonthKey)}
                className="bg-transparent font-bold text-[#5C2D16] focus:outline-none cursor-pointer pr-1"
              >
                <option value="current">{currentMonthDisplay}</option>
                <option value="September">September</option>
                <option value="Agustus">Agustus</option>
                <option value="Juli">Juli</option>
                <option value="Juni">Juni</option>
                <option value="Mei">Mei</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Top 4 Summary Cards (Dynamically Linked to Selected Month) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: TOTAL PERPUTARAN UANG */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">TOTAL PERPUTARAN UANG</span>
              <span className="w-7 h-7 rounded-xl bg-[#FAF4F0] text-[#5C2D16] flex items-center justify-center font-bold text-xs">🔄</span>
            </div>
            <div className="text-xl font-extrabold text-[#2D2825] mt-1.5">{fmtMoney(activeData.totalTurnoverIdr, activeData.totalTurnoverUsd)}</div>
            <p className="text-[10px] text-[#8C7A70] mt-0.5">Arus kas gabungan di dompet mahasiswa</p>
          </div>
          <div className="pt-2 border-t border-[#F0E8E4] text-[10px] font-bold text-emerald-700 flex items-center gap-1">
            <span className="bg-emerald-100 px-1.5 py-0.5 rounded">{activeData.turnoverMom}</span>
          </div>
        </div>

        {/* Card 2: RASIO TABUNGAN RATA-RATA */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">RASIO TABUNGAN RATA-RATA</span>
              <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">📈</span>
            </div>
            <div className="text-xl font-extrabold text-[#2D2825] mt-1.5">{activeData.savingRatio} <span className="text-xs font-normal text-[#8C7A70]">/uang saku</span></div>
            <p className="text-[10px] text-[#8C7A70] mt-0.5">Standar ideal kampus: minimal 15.0%</p>
          </div>
          <div className="pt-2 border-t border-[#F0E8E4] flex items-center justify-between text-[10px]">
            <div className="w-24 h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden">
              <div className="h-full bg-emerald-600 rounded-full" style={{ width: activeData.savingProgressWidth }}></div>
            </div>
            <span className="font-bold text-emerald-700">{activeData.savingStatus}</span>
          </div>
        </div>

        {/* Card 3: MEDIAN PENGELUARAN HARIAN */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">MEDIAN PENGELUARAN HARIAN</span>
              <span className="w-7 h-7 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold text-xs">☕</span>
            </div>
            <div className="text-xl font-extrabold text-[#2D2825] mt-1.5">{fmtMoney(activeData.dailyMedianIdr, activeData.dailyMedianUsd)} <span className="text-xs font-normal text-[#8C7A70]">/hari</span></div>
            <p className="text-[10px] text-[#8C7A70] mt-0.5">Kebutuhan makan, fotokopi, & bensin</p>
          </div>
          <div className="pt-2 border-t border-[#F0E8E4] text-[10px] text-[#8C7A70]">
            <strong className="text-[#5C2D16]">{activeData.dailySafeLimit}</strong>
          </div>
        </div>

        {/* Card 4: SKOR KESEHATAN FINANSIAL */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm space-y-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#8C7A70] uppercase tracking-wider">SKOR KESEHATAN FINANSIAL</span>
              <span className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">🛡️</span>
            </div>
            <div className="flex items-baseline gap-2 mt-1.5">
              <span className="text-2xl font-black text-[#2D2825]">{activeData.healthScore}</span>
              <span className="text-xs font-semibold text-[#8C7A70]">/ 100</span>
              <span className="px-1.5 py-0.5 text-[9px] font-bold bg-emerald-100 text-emerald-800 rounded">{activeData.healthStatus}</span>
            </div>
            <p className="text-[10px] text-[#8C7A70] mt-0.5">Evaluasi kedisiplinan & dana darurat</p>
          </div>
          <div className="pt-2 border-t border-[#F0E8E4] text-[10px] font-bold text-emerald-700">
            {activeData.healthPts}
          </div>
        </div>
      </div>

      {/* Middle Row: Tren Kiri & Proporsi Kanan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Left: Tren Pemasukan vs Pengeluaran */}
        <div className="lg:col-span-2 bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div>
                <h2 className="text-sm font-bold text-[#2D2825]">Tren Pemasukan vs Pengeluaran</h2>
                <p className="text-[10px] text-[#8C7A70]">Data tren agregat perputaran kas bulanan (Fokus: {activeData.subHeaderDate})</p>
              </div>

              <div className="flex items-center gap-3 text-[10px] font-medium">
                <span className="flex items-center gap-1.5 text-[#5C2D16] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#5C2D16]"></span> Pemasukan
                </span>
                <span className="flex items-center gap-1.5 text-[#C25E38] font-bold">
                  <span className="w-2 h-2 rounded-full bg-[#C25E38]"></span> Pengeluaran
                </span>
              </div>
            </div>

            {/* SVG Chart with Grid & Axis Labels */}
            <div className="relative h-48 w-full pt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="anGradInDynamic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#5C2D16" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#5C2D16" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="anGradOutDynamic" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C25E38" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#C25E38" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Y-axis Labels on Left */}
                <text x="5" y="25" fill="#8C7A70" fontSize="8" fontFamily="monospace">Rp 3.0M</text>
                <text x="5" y="55" fill="#8C7A70" fontSize="8" fontFamily="monospace">Rp 2.3M</text>
                <text x="5" y="85" fill="#8C7A70" fontSize="8" fontFamily="monospace">Rp 1.5M</text>
                <text x="5" y="115" fill="#8C7A70" fontSize="8" fontFamily="monospace">Rp 0.8M</text>
                <text x="15" y="140" fill="#8C7A70" fontSize="8" fontFamily="monospace">0</text>

                {/* Grid Lines */}
                <line x1="45" y1="20" x2="490" y2="20" stroke="#F0E8E4" strokeDasharray="3 3" />
                <line x1="45" y1="50" x2="490" y2="50" stroke="#F0E8E4" strokeDasharray="3 3" />
                <line x1="45" y1="80" x2="490" y2="80" stroke="#F0E8E4" strokeDasharray="3 3" />
                <line x1="45" y1="110" x2="490" y2="110" stroke="#F0E8E4" strokeDasharray="3 3" />
                <line x1="45" y1="135" x2="490" y2="135" stroke="#E5DDD8" />

                {/* Area Fills */}
                <path d="M 60 100 L 130 90 L 210 70 L 290 52 L 370 45 L 460 38 L 460 135 L 60 135 Z" fill="url(#anGradInDynamic)" />
                <path d="M 60 115 L 130 102 L 210 88 L 290 75 L 370 68 L 460 62 L 460 135 L 60 135 Z" fill="url(#anGradOutDynamic)" />

                {/* Curve Lines */}
                <path d="M 60 100 L 130 90 L 210 70 L 290 52 L 370 45 L 460 38" fill="none" stroke="#5C2D16" strokeWidth="3" strokeLinecap="round" />
                <path d="M 60 115 L 130 102 L 210 88 L 290 75 L 370 68 L 460 62" fill="none" stroke="#C25E38" strokeWidth="2.5" strokeDasharray="4 2" strokeLinecap="round" />

                {/* Dynamic Month Highlight Guide Line */}
                <line
                  x1={activeData.chartHighlightX}
                  y1={20}
                  x2={activeData.chartHighlightX}
                  y2={135}
                  stroke="#5C2D16"
                  strokeWidth="2"
                  strokeDasharray="2 2"
                  opacity="0.8"
                />

                {/* Points */}
                <circle cx="60" cy="100" r={selectedMonthKey === 'Mei' ? 6 : 3.5} fill="#5C2D16" stroke={selectedMonthKey === 'Mei' ? '#fff' : 'none'} strokeWidth="2" />
                <circle cx="130" cy="90" r={selectedMonthKey === 'Juni' ? 6 : 3.5} fill="#5C2D16" stroke={selectedMonthKey === 'Juni' ? '#fff' : 'none'} strokeWidth="2" />
                <circle cx="210" cy="70" r={selectedMonthKey === 'Juli' ? 6 : 3.5} fill="#5C2D16" stroke={selectedMonthKey === 'Juli' ? '#fff' : 'none'} strokeWidth="2" />
                <circle cx="290" cy="52" r={selectedMonthKey === 'Agustus' ? 6 : 3.5} fill="#5C2D16" stroke={selectedMonthKey === 'Agustus' ? '#fff' : 'none'} strokeWidth="2" />
                <circle cx="370" cy="45" r={selectedMonthKey === 'September' ? 6 : 3.5} fill="#5C2D16" stroke={selectedMonthKey === 'September' ? '#fff' : 'none'} strokeWidth="2" />
                <circle cx="460" cy="38" r={selectedMonthKey === 'current' ? 6 : 3.5} fill="#5C2D16" stroke={selectedMonthKey === 'current' ? '#fff' : 'none'} strokeWidth="2" />

                <circle cx="60" cy="115" r={selectedMonthKey === 'Mei' ? 6 : 3.5} fill="#C25E38" stroke={selectedMonthKey === 'Mei' ? '#fff' : 'none'} strokeWidth="2" />
                <circle cx="130" cy="102" r={selectedMonthKey === 'Juni' ? 6 : 3.5} fill="#C25E38" stroke={selectedMonthKey === 'Juni' ? '#fff' : 'none'} strokeWidth="2" />
                <circle cx="210" cy="88" r={selectedMonthKey === 'Juli' ? 6 : 3.5} fill="#C25E38" stroke={selectedMonthKey === 'Juli' ? '#fff' : 'none'} strokeWidth="2" />
                <circle cx="290" cy="75" r={selectedMonthKey === 'Agustus' ? 6 : 3.5} fill="#C25E38" stroke={selectedMonthKey === 'Agustus' ? '#fff' : 'none'} strokeWidth="2" />
                <circle cx="370" cy="68" r={selectedMonthKey === 'September' ? 6 : 3.5} fill="#C25E38" stroke={selectedMonthKey === 'September' ? '#fff' : 'none'} strokeWidth="2" />
                <circle cx="460" cy="62" r={selectedMonthKey === 'current' ? 6 : 3.5} fill="#C25E38" stroke={selectedMonthKey === 'current' ? '#fff' : 'none'} strokeWidth="2" />
              </svg>

              <div className="flex items-center justify-between text-[10px] font-semibold text-[#8C7A70] pl-10 pr-2 pt-1">
                <span className={selectedMonthKey === 'Mei' ? 'font-bold text-[#5C2D16] bg-[#FAF4F0] px-1.5 py-0.5 rounded' : ''}>Mei</span>
                <span className={selectedMonthKey === 'Juni' ? 'font-bold text-[#5C2D16] bg-[#FAF4F0] px-1.5 py-0.5 rounded' : ''}>Jun</span>
                <span className={selectedMonthKey === 'Juli' ? 'font-bold text-[#5C2D16] bg-[#FAF4F0] px-1.5 py-0.5 rounded' : ''}>Jul</span>
                <span className={selectedMonthKey === 'Agustus' ? 'font-bold text-[#5C2D16] bg-[#FAF4F0] px-1.5 py-0.5 rounded' : ''}>Agu</span>
                <span className={selectedMonthKey === 'September' ? 'font-bold text-[#5C2D16] bg-[#FAF4F0] px-1.5 py-0.5 rounded' : ''}>Sep</span>
                <span className={selectedMonthKey === 'current' ? 'font-bold text-[#5C2D16] bg-[#FAF4F0] px-2 py-0.5 rounded border border-[#E8DCD8]' : ''}>{activeData.chartHighlightMonth}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FAF4F0] border border-[#E6D4CB] rounded-xl p-2.5 text-[11px] flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="text-[#554A43] flex items-center gap-1.5">
              <span className="font-bold text-[#5C2D16]">⚡ Pola Siklus ({activeData.subHeaderDate}):</span> {activeData.cyclePola}
            </span>
            <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">Surplus Kas: {activeData.surplusKas}</span>
          </div>
        </div>

        {/* Right: Proporsi Pengeluaran */}
        <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-sm flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-sm font-bold text-[#2D2825]">Proporsi Pengeluaran</h2>
                <p className="text-[10px] text-[#8C7A70]">Berdasarkan total {activeData.proporsiTotalIdr} ({activeData.subHeaderDate})</p>
              </div>
              <span className="px-2 py-0.5 text-[9px] font-bold bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] rounded">{activeData.categories.length} Pos Alokasi</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-2">
              <div className="flex flex-col items-center justify-center relative">
                <div className="w-28 h-28 rounded-full border-[12px] border-[#5C2D16] flex items-center justify-center border-t-[#C25E38] border-r-amber-500 border-b-emerald-600 shadow-inner">
                  <div className="text-center">
                    <div className="text-[8px] text-[#8C7A70] uppercase font-bold">ALOKASI</div>
                    <div className="text-xs font-extrabold text-[#2D2825]">100%</div>
                  </div>
                </div>
              </div>

              <div className="p-2.5 bg-[#FAF7F4] border border-[#EBE4D8] rounded-xl text-[10px] space-y-1">
                <div className="text-[9px] text-[#8C7A70] font-bold uppercase">Pengeluaran Dominan</div>
                <div className="font-extrabold text-[#5C2D16] text-xs">{activeData.proporsiDominanTitle}</div>
                <p className="text-[9px] text-[#786C65] leading-tight">{activeData.proporsiDominanDesc}</p>
              </div>
            </div>

            <div className="space-y-1.5 text-[10px] pt-3">
              {activeData.categories.map((cat, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${cat.color}`}></span> {cat.name}</span>
                  <span className="font-mono text-[#2D2825]">{cat.amountIdr} <strong className="font-bold text-[#5C2D16]">{cat.percent}</strong></span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-[#F0E8E4] flex items-center justify-end text-[11px]">
            <button
              onClick={() => setActionToast(`Membuka rincian sub-kategori transaksi mahasiswa periode ${activeData.subHeaderDate}...`)}
              className="font-bold text-[#5C2D16] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Lihat Sub-Kategori Terperinci →
            </button>
          </div>
        </div>
      </div>

      {/* AI Financial Insights & Pola Perilaku (Dynamic Per Month) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-base text-[#5C2D16]">🤖</span>
            <h2 className="font-extrabold text-sm text-[#2D2825]">AI Financial Insights & Pola Perilaku ({activeData.subHeaderDate})</h2>
            <span className="px-2 py-0.5 text-[9px] font-extrabold bg-emerald-100 text-emerald-800 rounded-full border border-emerald-300">
              MoneyMate AI Core
            </span>
          </div>
          <span className="text-[10px] text-[#8C7A70]">Dihasilkan otomatis dari pemodelan transaksi mahasiswa</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeData.insights.map((ins, idx) => (
            <div key={idx} className="bg-white border border-[#E5DDD8] rounded-2xl p-4 shadow-xs space-y-2.5 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="px-2 py-0.5 bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] font-bold rounded">
                    {ins.badge}
                  </span>
                  <span className={`font-bold ${ins.isDefisitAlert ? 'text-[#C25E38]' : 'text-emerald-700'}`}>
                    {ins.badgePercent}
                  </span>
                </div>
                <h3 className="font-extrabold text-xs text-[#2D2825] leading-snug">
                  {ins.title}
                </h3>
                <p className="text-[11px] text-[#554A43] leading-relaxed">
                  {ins.description}
                </p>
                <div className="p-2.5 bg-[#FAF4F0] border border-[#E8DCD8] rounded-xl text-[10px] text-[#5C2D16]">
                  <strong>Rekomendasi AI:</strong> {ins.recommendation}
                </div>
              </div>
              <div className="pt-2 border-t border-[#F0E8E4] flex items-center justify-between text-[10px]">
                <span className="text-[#8C7A70]">{ins.impactLabel}</span>
                <span className={`font-bold ${ins.isDefisitAlert ? 'text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200' : 'text-emerald-700'}`}>
                  {ins.impactValue}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Matriks Perilaku Finansial Berdasarkan Angkatan & Semester */}
      <div className="bg-white border border-[#E5DDD8] rounded-2xl p-4 sm:p-5 shadow-sm space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#2D2825]">Matriks Perilaku Finansial Berdasarkan Angkatan & Semester ({activeData.subHeaderDate})</h2>
            <p className="text-[10px] text-[#8C7A70] mt-0.5">Komparasi tingkat literasi keuangan, rerata uang saku, dan risiko defisit per tingkat studi.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#FAF7F4] border border-[#E5DDD8] rounded-xl px-2.5 py-1 text-xs">
              <span className="text-[#8C7A70]">Urutkan:</span>
              <select
                value={sortField}
                onChange={e => setSortField(e.target.value as any)}
                className="bg-transparent font-bold text-[#5C2D16] focus:outline-none cursor-pointer"
              >
                <option value="defisit">Defisit Tertinggi ▾</option>
                <option value="literasi">Literasi Tertinggi ▾</option>
                <option value="mhs">Jumlah Mahasiswa ▾</option>
              </select>
            </div>
            <button
              onClick={handleDownloadCsv}
              title="Cetak Matriks"
              className="p-1.5 bg-white border border-[#E5DDD8] text-[#5C2D16] rounded-xl hover:bg-[#FAF7F4] cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF7F4] text-[#8C7A70] uppercase text-[9px] font-bold tracking-wider border-b border-[#E5DDD8]">
              <tr>
                <th className="py-3 px-4">KELOMPOK ANGKATAN & TINGKAT</th>
                <th className="py-3 px-4">TOTAL MAHASISWA</th>
                <th className="py-3 px-4">RERATA UANG SAKU</th>
                <th className="py-3 px-4">ALOKASI TABUNGAN</th>
                <th className="py-3 px-4">INDEKS LITERASI (1–100)</th>
                <th className="py-3 px-4">TINGKAT RISIKO DEFISIT</th>
                <th className="py-3 px-4 text-right">STATUS EVALUASI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F0E8E4]">
              {sortedCohort.map((row) => (
                <tr key={row.id} className="hover:bg-[#FAF7F2] transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#FAF4F0] border border-[#E8DCD8] text-[#5C2D16] font-bold flex items-center justify-center text-[10px]">
                        T{row.id}
                      </div>
                      <div>
                        <div className="font-bold text-[#2D2825]">{row.angkatan} ({row.semester})</div>
                        <div className="text-[10px] text-[#8C7A70]">{row.badge}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono font-medium text-[#2D2825]">{row.totalMhs}</td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#2D2825]">{row.uangSaku}</td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#2D2825]">{row.tabunganPercent}</span>
                      <div className="w-16 h-1.5 bg-[#F5F2ED] rounded-full overflow-hidden">
                        <div className="h-full bg-[#5C2D16] rounded-full" style={{ width: row.tabunganWidth }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono font-bold text-[#5C2D16]">{row.literasiScore}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${row.risikoColor}`}>
                      {row.risikoPercent} ({row.risikoStatus})
                    </span>
                  </td>
                  <td className={`py-3.5 px-4 text-right ${row.evaluasiColor}`}>
                    {row.evaluasi}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Audit Bar */}
        <div className="pt-3 border-t border-[#E5DDD8] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#8C7A70]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Validitas data terverifikasi via sinkronisasi rekening bank kampus & e-wallet mahasiswa ({totalUsersCount} Pengguna Terdaftar)</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleDownloadCsv}
              className="font-bold text-[#5C2D16] hover:underline cursor-pointer"
            >
              Download CSV
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
