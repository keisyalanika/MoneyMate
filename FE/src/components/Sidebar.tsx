import React from 'react';
import { LayoutDashboard, ReceiptText, PieChart } from 'lucide-react';

interface Props {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<Props> = ({ activeTab, setActiveTab }) => {
  const navs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transaksi', icon: ReceiptText },
    { id: 'budgets', label: 'Anggaran', icon: PieChart }
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="logo-badge">💰</span>
        <span>MoneyMate</span>
      </div>
      <nav>
        {navs.map(n => {
          const Icon = n.icon;
          return (
            <div
              key={n.id}
              className={`nav-item ${activeTab === n.id ? 'active' : ''}`}
              onClick={() => setActiveTab(n.id)}
            >
              <Icon size={20} />
              <span>{n.label}</span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};
