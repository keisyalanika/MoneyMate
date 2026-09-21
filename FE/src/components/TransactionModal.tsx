import React, { useState, useEffect } from 'react';
import { Category, TransactionType } from '../models/types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSubmit: (data: { title: string; amount: number; type: TransactionType; categoryId: string; notes: string }) => void;
}

export const TransactionModal: React.FC<Props> = ({ isOpen, onClose, categories, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('EXPENSE');
  const [categoryId, setCategoryId] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (categories.length > 0 && !categoryId) {
      setCategoryId(categories[0].id);
    }
  }, [categories]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount || !categoryId) return;
    onSubmit({
      title,
      amount: Number(amount),
      type,
      categoryId,
      notes
    });
    setTitle('');
    setAmount('');
    setNotes('');
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <h3 style={{ marginBottom: '20px' }}>Catat Transaksi Baru</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Tipe Transaksi</label>
            <select className="form-control" value={type} onChange={e => setType(e.target.value as TransactionType)}>
              <option value="EXPENSE">Pengeluaran (Expense)</option>
              <option value="INCOME">Pemasukan (Income)</option>
            </select>
          </div>

          <div className="form-group">
            <label>Judul Transaksi</label>
            <input
              type="text"
              className="form-control"
              placeholder="Contoh: Makan Siang / Gaji Project"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Nominal (Rp)</label>
            <input
              type="number"
              className="form-control"
              placeholder="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Kategori</label>
            <select className="form-control" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Catatan (Opsional)</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Keterangan rincian transaksi"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '24px' }}>
            <button type="button" className="btn-primary" style={{ background: '#334155' }} onClick={onClose}>Batal</button>
            <button type="submit" className="btn-primary">Simpan Transaksi</button>
          </div>
        </form>
      </div>
    </div>
  );
};
