import React from 'react';
import { Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import '../src/index.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
});

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
    <html lang="id" className={plusJakartaSans.variable}>
      <body className="bg-[#F7F5F0] text-[#2D2825] font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
