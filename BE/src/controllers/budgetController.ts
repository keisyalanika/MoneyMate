import { Response } from 'express';
import * as budgetService from '../services/budgetService';
import { AuthRequest } from '../middleware/authMiddleware';
import pool from '../config/database';
import { RowDataPacket } from 'mysql2';

// ---- GET budgets ----
export const getBudgets = async (req: AuthRequest, res: Response) => {
  try {
    const { month, year } = req.query;
    if (req.user!.role === 'admin') {
      const list = await budgetService.getAllBudgets();
      return res.json({ success: true, data: list });
    }
    const list = await budgetService.getBudgets(
      req.user!.id,
      month ? Number(month) : undefined,
      year ? Number(year) : undefined
    );
    res.json({ success: true, data: list, message: 'Budgets retrieved successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- CREATE budget ----
export const addBudget = async (req: AuthRequest, res: Response) => {
  try {
    const { category_id, amount, month, year } = req.body;
    if (!category_id || !amount || !month || !year) {
      return res.status(400).json({ success: false, message: 'category_id, amount, month, and year are required' });
    }
    const created = await budgetService.createBudget({
      user_id: req.user!.id,
      category_id,
      amount,
      month,
      year,
    });
    res.status(201).json({ success: true, data: created, message: 'Budget created successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- UPDATE budget ----
export const updateBudget = async (req: AuthRequest, res: Response) => {
  try {
    const updated = await budgetService.updateBudget(Number(req.params.id), req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }
    res.json({ success: true, data: updated, message: 'Budget updated successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- DELETE budget ----
export const deleteBudget = async (req: AuthRequest, res: Response) => {
  try {
    const deleted = await budgetService.deleteBudget(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }
    res.json({ success: true, message: 'Budget deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- SEND BUDGET ALERT (Admin Intervention -> User Notification) ----
export const sendBudgetAlert = async (req: AuthRequest, res: Response) => {
  try {
    const budgetId = Number(req.params.id);
    const { alert_type, custom_message } = req.body;

    const [rows] = await pool.query<RowDataPacket[]>(
      `SELECT b.*, c.name AS category_name, u.name AS user_name
       FROM budgets b
       LEFT JOIN categories c ON b.category_id = c.id
       LEFT JOIN users u ON b.user_id = u.id
       WHERE b.id = ?`,
      [budgetId]
    );

    if (!rows || rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    const budget = rows[0];
    const isWarning = alert_type === 'warning';
    const title = isWarning ? '⚠️ Peringatan Anggaran dari Admin' : '👏 Apresiasi Keuangan dari Admin';
    const message = custom_message || (isWarning
      ? `Pengeluaran Anda untuk kategori ${budget.category_name || 'ini'} sudah mendekati atau melebihi limit anggaran. Mohon evaluasi pengeluaran Anda.`
      : `Pengeluaran Anda untuk kategori ${budget.category_name || 'ini'} terkontrol dengan sangat baik! Terus pertahankan kedisiplinan keuangan Anda.`);

    await pool.query(
      'INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)',
      [budget.user_id, title, message]
    );

    res.json({
      success: true,
      message: `Pemberitahuan berhasil dikirimkan ke ${budget.user_name || 'mahasiswa'}`,
      data: {
        user_id: budget.user_id,
        title,
        message,
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
