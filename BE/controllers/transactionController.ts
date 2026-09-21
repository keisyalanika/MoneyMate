import { Request, Response } from 'express';
import * as txService from '../services/transactionService';
import { successResponse, errorResponse } from '../utils/responseHandler';

export const getTransactions = (req: Request, res: Response) => {
  try {
    const { type, search } = req.query;
    const list = txService.getAllTransactions(type as string, search as string);
    return successResponse(res, list, 'Transactions retrieved successfully');
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
};

export const addTransaction = (req: Request, res: Response) => {
  try {
    const { title, amount, type, categoryId, notes } = req.body;
    if (!title || !amount || !categoryId) {
      return errorResponse(res, 'Title, amount, and categoryId are required fields', 400);
    }
    const created = txService.createTransaction({ title, amount, type, categoryId, notes });
    return successResponse(res, created, 'Transaction created successfully', 201);
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
};

export const removeTransaction = (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = txService.deleteTransaction(id);
    if (!deleted) {
      return errorResponse(res, 'Transaction not found', 404);
    }
    return successResponse(res, null, 'Transaction deleted successfully');
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
};
