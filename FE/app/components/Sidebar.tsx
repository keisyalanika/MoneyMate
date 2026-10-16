'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Target,
  Sparkles,
  TrendingUp,
  FileText,
  Settings,
  User,
  LogOut,
  Zap
} from 'lucide-react';

interface SidebarProps {
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  activeMenu?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab = 'overview', setActiveTab, activeMenu }) => {
  const router = useRouter();

  let currentTab = activeTab;
  if (activeMenu) {
    const map: Record<string, string> = {
      'dashboard overview': 'overview',
      'user management': 'users',
      'transactions': 'transactions',
      'budget monitoring': 'budgets',
      'ai financial insight': 'ai',
      'analytics & statistik': 'analytics',
      'analytics & statistics': 'analytics',
      'reports': 'reports',
      'settings': 'settings',
      'profil admin': 'profile',
      'profile': 'profile'
    };
    currentTab = map[activeMenu.toLowerCase()] || currentTab;
  }

  const handleTabClick = (tab: string) => {
    if (setActiveTab) {
      setActiveTab(tab);
    } else {
      router.push(tab === 'overview' ? '/dashboard' : `/dashboard/${tab}`);
    }
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('moneymate_user_email');
      localStorage.removeItem('moneymate_users_db');
      sessionStorage.clear();
    }
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-[#FAF7F4] border-r border-[#E5DDD8] flex flex-col justify-between p-4 shrink-0 shadow-xs select-none">
      <div className="space-y-5">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-xl bg-[#5C2D16] text-[#F7F5F0] font-black text-xl flex items-center justify-center shadow-md">
            M
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-[#5C2D16]">MoneyMate</div>
            <div className="text-[10px] text-[#8C7A70] font-medium uppercase tracking-wider">Campus Finance</div>
          </div>
          <span className="px-2 py-0.5 text-[9px] font-bold bg-[#E6D0C7] text-[#5C2D16] rounded ml-auto uppercase">ADMIN</span>
        </div>

        {/* Navigation Items (Consistent English) */}
        <nav className="space-y-1 text-xs font-semibold">
          {/* Section 1: MAIN MENU */}
          <div className="pt-1 pb-1">
            <div className="text-[10px] font-bold text-[#8C7A70] uppercase px-3 tracking-wider">MAIN MENU</div>
          </div>

          <button
            onClick={() => handleTabClick('overview')}
            className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ' + (
              currentTab === 'overview'
                ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
            )}
          >
            <LayoutDashboard className={'w-4 h-4 ' + (currentTab === 'overview' ? 'text-white' : 'text-[#6E5D53]')} />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => handleTabClick('users')}
            className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ' + (
              currentTab === 'users'
                ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
            )}
          >
            <Users className={'w-4 h-4 ' + (currentTab === 'users' ? 'text-white' : 'text-[#6E5D53]')} />
            <span>User Management</span>
          </button>

          <button
            onClick={() => handleTabClick('transactions')}
            className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ' + (
              currentTab === 'transactions'
                ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
            )}
          >
            <CreditCard className={'w-4 h-4 ' + (currentTab === 'transactions' ? 'text-white' : 'text-[#6E5D53]')} />
            <span>Transactions</span>
          </button>

          <button
            onClick={() => handleTabClick('budgets')}
            className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ' + (
              currentTab === 'budgets'
                ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
            )}
          >
            <Target className={'w-4 h-4 ' + (currentTab === 'budgets' ? 'text-white' : 'text-[#6E5D53]')} />
            <span>Budget Monitoring</span>
          </button>

          {/* Section 2: SMART FEATURES */}
          <div className="pt-3 pb-1">
            <div className="text-[10px] font-bold text-[#8C7A70] uppercase px-3 tracking-wider">SMART FEATURES</div>
          </div>

          <button
            onClick={() => handleTabClick('ai')}
            className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ' + (
              currentTab === 'ai'
                ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
            )}
          >
            <Sparkles className={'w-4 h-4 ' + (currentTab === 'ai' ? 'text-white' : 'text-[#C25E38]')} />
            <span>AI Financial Insight</span>
          </button>

          <button
            onClick={() => handleTabClick('analytics')}
            className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ' + (
              currentTab === 'analytics'
                ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
            )}
          >
            <TrendingUp className={'w-4 h-4 ' + (currentTab === 'analytics' ? 'text-white' : 'text-[#6E5D53]')} />
            <span>Analytics & Statistics</span>
          </button>

          {/* Section 3: MANAGEMENT */}
          <div className="pt-3 pb-1">
            <div className="text-[10px] font-bold text-[#8C7A70] uppercase px-3 tracking-wider">MANAGEMENT</div>
          </div>

          <button
            onClick={() => handleTabClick('reports')}
            className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ' + (
              currentTab === 'reports'
                ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
            )}
          >
            <FileText className={'w-4 h-4 ' + (currentTab === 'reports' ? 'text-white' : 'text-[#6E5D53]')} />
            <span>Reports</span>
          </button>

          <button
            onClick={() => handleTabClick('settings')}
            className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ' + (
              currentTab === 'settings'
                ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
            )}
          >
            <Settings className={'w-4 h-4 ' + (currentTab === 'settings' ? 'text-white' : 'text-[#6E5D53]')} />
            <span>Settings</span>
          </button>

          <button
            onClick={() => handleTabClick('profile')}
            className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ' + (
              currentTab === 'profile'
                ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
            )}
          >
            <User className={'w-4 h-4 ' + (currentTab === 'profile' ? 'text-white' : 'text-[#6E5D53]')} />
            <span>Profil Admin</span>
          </button>
        </nav>
      </div>

      {/* Sidebar Bottom: Server Status & Quick Logout Button */}
      <div className="pt-4 border-t border-[#E5DDD8] space-y-2.5">
        <div className="p-2.5 bg-white border border-[#E5DDD8] rounded-xl text-[10px] space-y-1 shadow-xs">
          <div className="flex items-center gap-1.5 font-bold text-[#2D2825]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Server JKT-01
          </div>
          <div className="flex items-center justify-between text-[#8C7A70]">
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3 text-emerald-600" /> 99.98% Normal
            </span>
            <span className="font-mono">34ms</span>
          </div>
        </div>

        {/* Dedicated Sidebar Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full py-2 px-3 bg-rose-50 hover:bg-rose-100 border border-rose-200/80 text-rose-700 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-98"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-600" />
          <span>Keluar (Logout)</span>
        </button>
      </div>
    </aside>
  );
};
