import { Request, Response } from 'express';
import * as txService from '../services/transactionService';
import { AuthRequest } from '../middleware/authMiddleware';

// ---- GET transactions ----
export const getTransactions = async (req: AuthRequest, res: Response) => {
  try {
    const { type, search, category_id, start_date, end_date, limit, offset } = req.query;
    const user_id = req.user!.role === 'admin' ? undefined : req.user!.id;

    const list = await txService.getAllTransactions({
      user_id,
      type: type as string,
      category_id: category_id ? Number(category_id) : undefined,
      search: search as string,
      start_date: start_date as string,
      end_date: end_date as string,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });
    res.json({ success: true, data: list, message: 'Transactions retrieved successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- GET single transaction ----
export const getTransaction = async (req: Request, res: Response) => {
  try {
    const tx = await txService.getTransactionById(Number(req.params.id));
    if (!tx) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.json({ success: true, data: tx });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- CREATE transaction ----
export const addTransaction = async (req: AuthRequest, res: Response) => {
  try {
    const { type, amount, category_id, income_source_id, date, note, receipt_image_url } = req.body;
    if (!amount || !category_id || !date) {
      return res.status(400).json({ success: false, message: 'amount, category_id, and date are required' });
    }
    const created = await txService.createTransaction({
      user_id: req.user!.id,
      type: type || 'expense',
      amount,
      category_id,
      income_source_id,
      date,
      note,
      receipt_image_url,
    });
    res.status(201).json({ success: true, data: created, message: 'Transaction created successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- UPDATE transaction ----
export const updateTransaction = async (req: Request, res: Response) => {
  try {
    const updated = await txService.updateTransaction(Number(req.params.id), req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.json({ success: true, data: updated, message: 'Transaction updated successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- DELETE transaction ----
export const removeTransaction = async (req: Request, res: Response) => {
  try {
    const deleted = await txService.deleteTransaction(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }
    res.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- GET monthly summary ----
export const getMonthlySummary = async (req: AuthRequest, res: Response) => {
  try {
    const { month, year } = req.query;
    const now = new Date();
    const m = month ? Number(month) : now.getMonth() + 1;
    const y = year ? Number(year) : now.getFullYear();
    const summary = await txService.getMonthlySummary(req.user!.id, m, y);
    res.json({ success: true, data: summary });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
