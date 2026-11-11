import React from 'react';
import './globals.css';
import '../src/index.css';

export const metadata = {
  title: 'MoneyMate - Portal Keuangan Kampus & Budget Monitoring',
  description: 'Sistem manajemen anggaran mahasiswa, monitoring real-time, dan tata kelola akun terverifikasi.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-[#F7F5F0] text-[#2D2825] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
