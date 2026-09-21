import React, { useState } from 'react';
import { Transaction } from '../models/types';
import { formatRupiah, formatDate } from '../utils/formatters';
import { Trash2 } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  onDelete: (id: string) => void;
}

export const TransactionsPage: React.FC<Props> = ({ transactions, onDelete }) => {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filtered = transactions.filter(t => {
    if (filter !== 'ALL' && t.type !== filter) return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={{ padding: '32px' }}>
      <div className="glass-card" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Cari transaksi..."
            style={{ maxWidth: '300px' }}
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button
            className="btn-primary"
            style={{ background: filter === 'ALL' ? 'var(--accent-primary)' : '#334155' }}
            onClick={() => setFilter('ALL')}
          >
            Semua
          </button>
          <button
            className="btn-primary"
            style={{ background: filter === 'INCOME' ? 'var(--accent-green)' : '#334155' }}
            onClick={() => setFilter('INCOME')}
          >
            Pemasukan
          </button>
          <button
            className="btn-primary"
            style={{ background: filter === 'EXPENSE' ? 'var(--accent-red)' : '#334155' }}
            onClick={() => setFilter('EXPENSE')}
          >
            Pengeluaran
          </button>
        </div>
      </div>

      <div className="glass-card">
        <h3 style={{ marginBottom: '16px' }}>Kelola Data Transaksi ({filtered.length})</h3>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Judul & Catatan</th>
                <th>Kategori</th>
                <th>Tipe</th>
                <th>Tanggal</th>
                <th>Nominal</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{t.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.notes || '-'}</div>
                  </td>
                  <td>{t.categoryName}</td>
                  <td>
                    <span className={`badge ${t.type === 'INCOME' ? 'badge-income' : 'badge-expense'}`}>
                      {t.type}
                    </span>
                  </td>
                  <td>{formatDate(t.date)}</td>
                  <td style={{ fontWeight: 700 }}>{formatRupiah(t.amount)}</td>
                  <td>
                    <button
                      style={{ background: 'none', border: 'none', color: 'var(--accent-red)', cursor: 'pointer' }}
                      onClick={() => onDelete(t.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
