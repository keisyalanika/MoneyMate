import React from 'react';
import { Budget } from '../models/types';
import { formatRupiah } from '../utils/formatters';

interface Props {
  budgets: Budget[];
}

export const BudgetsPage: React.FC<Props> = ({ budgets }) => {
  return (
    <div style={{ padding: '32px' }}>
      <h3 style={{ marginBottom: '24px' }}>Alokasi & Progres Anggaran</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {budgets.map(b => (
          <div key={b.id} className="glass-card">
            <h4 style={{ marginBottom: '12px' }}>{b.categoryName}</h4>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '8px' }}>
              {formatRupiah(b.limitAmount)}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Terpakai: {formatRupiah(b.spentAmount)} ({b.percentage}%)
            </div>
            <div style={{ height: '10px', background: '#334155', borderRadius: '5px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.min(100, b.percentage)}%`,
                  background: b.percentage > 80 ? 'var(--accent-red)' : 'var(--accent-green)',
                  transition: 'width 0.3s'
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
