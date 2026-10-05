import React from "react";
import {
  LayoutDashboard,
  Users,
  ArrowLeftRight,
  Target,
  Zap,
  TrendingUp,
  FileText,
  Settings,
} from "lucide-react";

interface SidebarProps {
  activeMenu?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeMenu = "User Management",
}) => {
  const menuUtama = [
    { name: "Dashboard Overview", icon: LayoutDashboard },
    { name: "User Management", icon: Users },
    { name: "Transactions", icon: ArrowLeftRight },
    { name: "Budget Monitoring", icon: Target },
  ];

  const fiturPintar = [
    { name: "AI Financial Insight", icon: Zap, isSpecial: true, hasDot: true },
    { name: "Analytics & Statistik", icon: TrendingUp },
  ];

  const manajemen = [
    { name: "Reports", icon: FileText },
    { name: "Settings", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#FDF8F2] border-r border-[#F3E7DC] flex flex-col justify-between h-screen sticky top-0 font-sans select-none">
      {/* Top Section: Logo & ADMIN badge */}
      <div>
        <div className="p-5 flex items-center justify-between border-b border-[#F3E7DC]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#5C3317] rounded-xl flex items-center justify-center text-white font-bold text-base shadow-sm">
              M
            </div>
            <span className="font-bold text-lg text-[#3D2314] tracking-tight">
              MoneyMate
            </span>
          </div>
          <span className="bg-[#F3E7DC] text-[#5C3317] text-[10px] font-extrabold px-2 py-0.5 rounded-md tracking-wider">
            ADMIN
          </span>
        </div>

        {/* Navigation Links */}
        <div className="px-4 py-5 space-y-6">
          {/* Menu Utama */}
          <div>
            <p className="px-3 text-[10px] font-bold text-[#8C7A6B] tracking-wider uppercase mb-2">
              MENU UTAMA
            </p>
            <nav className="space-y-1.5">
              {menuUtama.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.name;
                return (
                  <a
                    key={item.name}
                    href="#"
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[#5C3317] text-white shadow-md shadow-[#5C3317]/15"
                        : "text-[#5C4A3D] hover:bg-[#F3E7DC]/50"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={isActive ? "text-white" : "text-[#7C6A5B]"}
                    />
                    <span className="leading-tight">{item.name}</span>
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Fitur Pintar */}
          <div>
            <p className="px-3 text-[10px] font-bold text-[#8C7A6B] tracking-wider uppercase mb-2">
              FITUR PINTAR
            </p>
            <nav className="space-y-1.5">
              {fiturPintar.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.name;
                return (
                  <a
                    key={item.name}
                    href="#"
                    className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[#5C3317] text-white shadow-md"
                        : item.isSpecial
                          ? "bg-[#F9ECE3] text-[#A0522D] font-semibold border border-[#EEDFD2]/60"
                          : "text-[#5C4A3D] hover:bg-[#F3E7DC]/50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        size={18}
                        className={
                          isActive
                            ? "text-white"
                            : item.isSpecial
                              ? "text-[#C05621]"
                              : "text-[#7C6A5B]"
                        }
                      />
                      <span className="leading-tight">{item.name}</span>
                    </div>
                    {item.hasDot && (
                      <span className="w-2 h-2 rounded-full bg-[#C05621]"></span>
                    )}
                  </a>
                );
              })}
            </nav>
          </div>

          {/* Manajemen */}
          <div>
            <p className="px-3 text-[10px] font-bold text-[#8C7A6B] tracking-wider uppercase mb-2">
              MANAJEMEN
            </p>
            <nav className="space-y-1.5">
              {manajemen.map((item) => {
                const Icon = item.icon;
                const isActive = activeMenu === item.name;
                return (
                  <a
                    key={item.name}
                    href="#"
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-[#5C3317] text-white shadow-md"
                        : "text-[#5C4A3D] hover:bg-[#F3E7DC]/50"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={isActive ? "text-white" : "text-[#7C6A5B]"}
                    />
                    <span className="leading-tight">{item.name}</span>
                  </a>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Footer / Server Status */}
      <div className="p-4 border-t border-[#F3E7DC] flex items-center justify-between text-xs text-[#7C6A5B]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
          <span className="font-medium text-[#4A3B32]">Server JKT-01</span>
        </div>
        <span className="font-mono text-[11px] text-[#8C7A6B]">14ms</span>
      </div>
    </aside>
  );
};
