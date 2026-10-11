import React from 'react';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  Target,
  Sparkles,
  TrendingUp,
  FileText,
  Settings,
  Zap
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-64 bg-[#FAF7F4] border-r border-[#E5DDD8] flex flex-col justify-between p-4 shrink-0 shadow-xs">
      <div className="space-y-5">
        {/* Brand Logo Header */}
        <div className="flex items-center gap-3 px-2 py-1">
          <div className="w-9 h-9 rounded-xl bg-[#5C2D16] text-[#F7F5F0] font-black text-xl flex items-center justify-center shadow-md">
            M
          </div>
          <div>
            <div className="font-extrabold text-base tracking-tight text-[#5C2D16]">MoneyMate</div>
            <div className="text-[10px] text-[#8C7A70] font-medium uppercase tracking-wider">Keuangan Kampus</div>
          </div>
          <span className="px-2 py-0.5 text-[9px] font-bold bg-[#E6D0C7] text-[#5C2D16] rounded ml-auto uppercase">ADMIN</span>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1 text-xs font-semibold">
          {/* Section 1: MENU UTAMA */}
          <div className="pt-1 pb-1">
            <div className="text-[10px] font-bold text-[#8C7A70] uppercase px-3 tracking-wider">MENU UTAMA</div>
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ' + (
              activeTab === 'overview'
                ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
            )}
          >
            <LayoutDashboard className={'w-4 h-4 ' + (activeTab === 'overview' ? 'text-white' : 'text-[#6E5D53]')} />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ' + (
              activeTab === 'users'
                ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
            )}
          >
            <Users className={'w-4 h-4 ' + (activeTab === 'users' ? 'text-white' : 'text-[#6E5D53]')} />
            <span>User Management</span>
          </button>

          <button
            onClick={() => setActiveTab('transactions')}
            className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ' + (
              activeTab === 'transactions'
                ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
            )}
          >
            <CreditCard className={'w-4 h-4 ' + (activeTab === 'transactions' ? 'text-white' : 'text-[#6E5D53]')} />
            <span>Transactions</span>
          </button>

          <button
            onClick={() => setActiveTab('budgets')}
            className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ' + (
              activeTab === 'budgets'
                ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
            )}
          >
            <Target className={'w-4 h-4 ' + (activeTab === 'budgets' ? 'text-white' : 'text-[#6E5D53]')} />
            <span>Budget Monitoring</span>
          </button>

          {/* Section 2: FITUR PINTAR */}
          <div className="pt-3 pb-1">
            <div className="text-[10px] font-bold text-[#8C7A70] uppercase px-3 tracking-wider">FITUR PINTAR</div>
          </div>

          <button
            onClick={() => setActiveTab('ai')}
            className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ' + (
              activeTab === 'ai'
                ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
            )}
          >
            <Sparkles className={'w-4 h-4 ' + (activeTab === 'ai' ? 'text-white' : 'text-[#C25E38]')} />
            <span>AI Financial Insight</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ' + (
              activeTab === 'analytics'
                ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
            )}
          >
            <TrendingUp className={'w-4 h-4 ' + (activeTab === 'analytics' ? 'text-white' : 'text-[#6E5D53]')} />
            <span>Analytics & Statistik</span>
          </button>

          {/* Section 3: MANAJEMEN */}
          <div className="pt-3 pb-1">
            <div className="text-[10px] font-bold text-[#8C7A70] uppercase px-3 tracking-wider">MANAJEMEN</div>
          </div>

          <button
            onClick={() => setActiveTab('reports')}
            className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ' + (
              activeTab === 'reports'
                ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
            )}
          >
            <FileText className={'w-4 h-4 ' + (activeTab === 'reports' ? 'text-white' : 'text-[#6E5D53]')} />
            <span>Reports</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ' + (
              activeTab === 'settings'
                ? 'bg-[#5C2D16] text-white shadow-md font-bold'
                : 'text-[#6E5D53] hover:bg-[#EAE0DB]/60 hover:text-[#5C2D16]'
            )}
          >
            <Settings className={'w-4 h-4 ' + (activeTab === 'settings' ? 'text-white' : 'text-[#6E5D53]')} />
            <span>Settings</span>
          </button>
        </nav>
      </div>

      {/* Sidebar Bottom Server Status Card */}
      <div className="pt-4 border-t border-[#E5DDD8]">
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
      </div>
    </aside>
  );
};
