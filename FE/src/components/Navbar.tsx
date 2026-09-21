import React from 'react';
import { PlusCircle } from 'lucide-react';

interface Props {
  onAddClick: () => void;
}

export const Navbar: React.FC<Props> = ({ onAddClick }) => {
  return (
    <header className="topbar">
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Admin Dashboard</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Kelola arus kas & laporan keuangan MoneyMate</p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button className="btn-primary" onClick={onAddClick}>
          <PlusCircle size={18} />
          <span>Tambah Transaksi</span>
        </button>
        <div className="avatar">AD</div>
      </div>
    </header>
  );
};
