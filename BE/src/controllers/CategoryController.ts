import { Request, Response } from 'express';
import { categoryService } from '../services';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../errors/AppError';
import { AppBaseResponse } from '../responses/AppBaseResponse';

export class CategoryController {
  constructor(private readonly categories = categoryService) {}

  // ---- GET all categories ----
  getCategories = asyncHandler(async (req: Request, res: Response) => {
    const { type } = req.query;
    const list = await this.categories.getCategories(type as string);
    return AppBaseResponse.success(res, list, 'Categories retrieved successfully');
  });

  // ---- CREATE category ----
  addCategory = asyncHandler(async (req: Request, res: Response) => {
    const { name, type, icon } = req.body;
    if (!name || !type) {
      throw AppError.badRequest('Name and type are required', 'VALIDATION_ERROR');
    }

    const created = await this.categories.createCategory({ name, type, icon });
    return AppBaseResponse.created(res, created, 'Category created successfully');
  });

  // ---- UPDATE category ----
  updateCategory = asyncHandler(async (req: Request, res: Response) => {
    const updated = await this.categories.updateCategory(Number(req.params.id), req.body);
    if (!updated) {
      throw AppError.notFound('Category not found', 'CATEGORY_NOT_FOUND');
    }
    return AppBaseResponse.updated(res, updated, 'Category updated successfully');
  });

  // ---- DELETE category ----
  deleteCategory = asyncHandler(async (req: Request, res: Response) => {
    const deleted = await this.categories.deleteCategory(Number(req.params.id));
    if (!deleted) {
      throw AppError.notFound('Category not found', 'CATEGORY_NOT_FOUND');
    }
    return AppBaseResponse.deleted(res, 'Category deleted successfully');
  });
}

export const categoryController = new CategoryController();
