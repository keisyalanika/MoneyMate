import React from "react";
import { Search, Bell } from "lucide-react";

export const Navbar: React.FC = () => {
  return (
    <header className="h-20 bg-[#FDFBF7] border-b border-[#EADCC9] px-8 flex items-center justify-between sticky top-0 z-20 font-sans">
      {/* Global Search */}
      <div className="relative w-96">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-[#8C7A6B]">
          <Search size={16} />
        </span>
        <input
          type="text"
          placeholder="Cari user (nama, email, ID)..."
          className="w-full bg-[#F8F4EC] border border-[#EADCC9] rounded-xl pl-10 pr-12 py-2 text-sm text-[#3D2314] placeholder-[#8C7A6B] focus:outline-none focus:ring-2 focus:ring-[#3D2314]/20 focus:border-[#3D2314] transition-all"
        />
        <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-[10px] bg-[#EADCC9]/60 text-[#5C4A3D] px-1.5 py-1 rounded font-mono h-fit my-auto">
          ⌘K
        </span>
      </div>

      {/* Right Actions & Profile */}
      <div className="flex items-center gap-4">
        {/* Currency Switcher Pill */}
        <div className="bg-[#F8F4EC] p-1 rounded-xl border border-[#EADCC9] flex items-center text-xs font-medium">
          <button className="bg-[#3D2314] text-white px-3 py-1 rounded-lg shadow-sm">
            IDR (Rp)
          </button>
          <button className="text-[#7C6A5B] px-3 py-1 rounded-lg hover:text-[#3D2314]">
            USD ($)
          </button>
        </div>

        {/* Notification Bell */}
        <button className="w-10 h-10 bg-[#F8F4EC] border border-[#EADCC9] rounded-xl flex items-center justify-center text-[#5C4A3D] hover:bg-[#EADCC9]/50 transition-all relative">
          <Bell size={18} />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <div className="h-8 w-[1px] bg-[#EADCC9]"></div>

        {/* Admin Profile */}
        <div className="flex items-center gap-3 text-right">
          <div>
            <p className="text-sm font-bold text-[#3D2314] leading-tight">
              Admin Master
            </p>
            <p className="text-[11px] text-[#8C7A6B] leading-tight mt-0.5">
              Super Administrator
            </p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#3D2314] text-white font-bold text-sm flex items-center justify-center shadow-sm">
            KL
          </div>
        </div>
      </div>
    </header>
  );
};
