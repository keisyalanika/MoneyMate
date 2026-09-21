import { Request, Response } from 'express';
import * as catService from '../services/categoryService';
import { successResponse, errorResponse } from '../utils/responseHandler';

export const getCategories = (req: Request, res: Response) => {
  try {
    const list = catService.getCategories();
    return successResponse(res, list, 'Categories retrieved successfully');
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
};

export const addCategory = (req: Request, res: Response) => {
  try {
    const { name, type, icon, color } = req.body;
    if (!name) return errorResponse(res, 'Category name is required', 400);
    const created = catService.createCategory({ name, type, icon, color });
    return successResponse(res, created, 'Category created successfully', 201);
  } catch (err: any) {
    return errorResponse(res, err.message);
  }
};
