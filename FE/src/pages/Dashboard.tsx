import React from 'react';
import { FinancialSummary, Transaction, Budget } from '../models/types';
import { StatCard } from '../components/StatCard';
import { formatRupiah, formatDate } from '../utils/formatters';

interface Props {
  summary: FinancialSummary | null;
  transactions: Transaction[];
  budgets: Budget[];
}

export const Dashboard: React.FC<Props> = ({ summary, transactions, budgets }) => {
  return (
    <div style={{ padding: '32px' }}>
      <div className="stats-grid">
        <StatCard
          title="TOTAL SALDO AKSIF"
          value={summary ? formatRupiah(summary.totalBalance) : 'Rp 0'}
          subtext="Update real-time dari semua rekening"
          icon="💳"
        />
        <StatCard
          title="TOTAL PEMASUKAN"
          value={summary ? formatRupiah(summary.totalIncome) : 'Rp 0'}
          subtext="Bulan ini"
          icon="📈"
          colorClass="income-text"
        />
        <StatCard
          title="TOTAL PENGELUARAN"
          value={summary ? formatRupiah(summary.totalExpense) : 'Rp 0'}
          subtext="Bulan ini"
          icon="📉"
          colorClass="expense-text"
        />
        <StatCard
          title="ANGGARAN AKTIF"
          value={summary ? `${summary.activeBudgetsCount} Kategori` : '0 Kategori'}
          subtext="Batas pengeluaran bulanan"
          icon="📊"
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
        <div className="glass-card">
          <h3 style={{ marginBottom: '16px' }}>Riwayat Transaksi Terakhir</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Judul</th>
                  <th>Kategori</th>
                  <th>Tanggal</th>
                  <th>Nominal</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map(t => (
                  <tr key={t.id}>
                    <td>
                      <div style={{ fontWeight: 600 }}>{t.title}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.notes}</div>
                    </td>
                    <td>{t.categoryName}</td>
                    <td>{formatDate(t.date)}</td>
                    <td>
                      <span className={`badge ${t.type === 'INCOME' ? 'badge-income' : 'badge-expense'}`}>
                        {t.type === 'INCOME' ? '+' : '-'} {formatRupiah(t.amount)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="glass-card">
          <h3 style={{ marginBottom: '16px' }}>Monitoring Anggaran</h3>
          {budgets.map(b => (
            <div key={b.id} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
                <span>{b.categoryName}</span>
                <span style={{ fontWeight: 700 }}>{b.percentage}%</span>
              </div>
              <div style={{ height: '8px', background: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${Math.min(100, b.percentage)}%`,
                    background: b.percentage > 80 ? 'var(--accent-red)' : 'var(--accent-primary)',
                    borderRadius: '4px',
                    transition: 'width 0.3s'
                  }}
                />
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Terpakai: {formatRupiah(b.spentAmount)} dari {formatRupiah(b.limitAmount)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
