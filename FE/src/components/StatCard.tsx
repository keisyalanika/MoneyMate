import React from 'react';

interface Props {
  title: string;
  value: string;
  subtext?: string;
  icon: string;
  colorClass?: string;
}

export const StatCard: React.FC<Props> = ({ title, value, subtext, icon, colorClass }) => {
  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>{title}</span>
        <span style={{ fontSize: '1.4rem' }}>{icon}</span>
      </div>
      <div className={`stat-val ${colorClass || ''}`}>{value}</div>
      {subtext && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>{subtext}</div>}
    </div>
  );
};
