import React, { ReactNode } from "react";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";

interface AdminLayoutProps {
  children: ReactNode;
  activeMenu?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  activeMenu,
}) => {
  return (
    <div className="flex min-h-screen bg-[#FDFBF7]">
      {/* Sidebar Kiri */}
      <Sidebar activeMenu={activeMenu} />

      {/* Konten Utama Kanan */}
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};
