import { Request, Response } from 'express';
import { transactionService } from '../services';
import { AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../errors/AppError';
import { AppBaseResponse } from '../responses/AppBaseResponse';

export class TransactionController {
  constructor(private readonly transactions = transactionService) {}

  // ---- GET transactions ----
  getTransactions = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { type, search, category_id, start_date, end_date, limit, offset } = req.query;
    const user_id = req.user!.role === 'admin' ? undefined : req.user!.id;

    const list = await this.transactions.getAllTransactions({
      user_id,
      type: type as string,
      category_id: category_id ? Number(category_id) : undefined,
      search: search as string,
      start_date: start_date as string,
      end_date: end_date as string,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
    });

    return AppBaseResponse.success(res, list, 'Transactions retrieved successfully');
  });

  // ---- GET single transaction ----
  getTransaction = asyncHandler(async (req: Request, res: Response) => {
    const transaction = await this.transactions.getTransactionById(Number(req.params.id));
    if (!transaction) {
      throw AppError.notFound('Transaction not found', 'TRANSACTION_NOT_FOUND');
    }
    return AppBaseResponse.success(res, transaction);
  });

  // ---- CREATE transaction ----
  addTransaction = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { type, amount, category_id, income_source_id, date, note, receipt_image_url } = req.body;
    if (!amount) {
      throw AppError.badRequest('amount is required', 'VALIDATION_ERROR');
    }

    const txType = (type || 'expense').toLowerCase();
    let catId = Number(category_id);
    if (!catId || isNaN(catId)) {
      catId = txType === 'income' ? 8 : 1;
    }

    const created = await this.transactions.createTransaction({
      user_id: req.user?.id || 2,
      type: txType,
      amount: Number(amount),
      category_id: catId,
      income_source_id,
      date: date || new Date().toISOString().slice(0, 10),
      note,
      receipt_image_url,
    });

    return AppBaseResponse.created(res, created, 'Transaction created successfully');
  });

  // ---- UPDATE transaction ----
  updateTransaction = asyncHandler(async (req: Request, res: Response) => {
    const updated = await this.transactions.updateTransaction(Number(req.params.id), req.body);
    if (!updated) {
      throw AppError.notFound('Transaction not found', 'TRANSACTION_NOT_FOUND');
    }
    return AppBaseResponse.updated(res, updated, 'Transaction updated successfully');
  });

  // ---- DELETE transaction ----
  removeTransaction = asyncHandler(async (req: Request, res: Response) => {
    const deleted = await this.transactions.deleteTransaction(Number(req.params.id));
    if (!deleted) {
      throw AppError.notFound('Transaction not found', 'TRANSACTION_NOT_FOUND');
    }
    return AppBaseResponse.deleted(res, 'Transaction deleted successfully');
  });

  // ---- GET monthly summary ----
  getMonthlySummary = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { month, year } = req.query;
    const now = new Date();
    const m = month ? Number(month) : now.getMonth() + 1;
    const y = year ? Number(year) : now.getFullYear();

    const summary = await this.transactions.getMonthlySummary(req.user!.id, m, y);
    return AppBaseResponse.success(res, summary);
  });
}

export const transactionController = new TransactionController();
