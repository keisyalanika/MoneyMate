import { Request, Response } from 'express';
import { auditService, categoryService } from '../services';
import { AuthRequest } from '../middleware/authMiddleware';
import { asyncHandler } from '../middleware/asyncHandler';
import { AppError } from '../errors/AppError';
import { AppBaseResponse } from '../responses/AppBaseResponse';

export class CategoryController {
  constructor(
    private readonly categories = categoryService,
    private readonly audits = auditService
  ) {}

  // ---- GET all categories ----
  getCategories = asyncHandler(async (req: Request, res: Response) => {
    const { type } = req.query;
    const list = await this.categories.getCategories(type as string);
    return AppBaseResponse.success(res, list, 'Categories retrieved successfully');
  });

  // ---- CREATE category ----
  addCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { name, type, icon } = req.body;
    if (!name || !type) {
      throw AppError.badRequest('Name and type are required', 'VALIDATION_ERROR');
    }

    const created = await this.categories.createCategory({ name, type, icon });

    await this.audits.logAction({
      admin_id: req.user!.id,
      action: 'CREATE_CATEGORY',
      target_table: 'categories',
      target_id: created.id,
      description: `Menambahkan kategori ${created.name}`,
    });

    return AppBaseResponse.created(res, created, 'Category created successfully');
  });

  // ---- UPDATE category ----
  updateCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const updated = await this.categories.updateCategory(Number(req.params.id), req.body);
    if (!updated) {
      throw AppError.notFound('Category not found', 'CATEGORY_NOT_FOUND');
    }

    await this.audits.logAction({
      admin_id: req.user!.id,
      action: 'UPDATE_CATEGORY',
      target_table: 'categories',
      target_id: updated.id,
      description: `Memperbarui kategori ${updated.name}`,
    });

    return AppBaseResponse.updated(res, updated, 'Category updated successfully');
  });

  // ---- DELETE category ----
  deleteCategory = asyncHandler(async (req: AuthRequest, res: Response) => {
    const deleted = await this.categories.deleteCategory(Number(req.params.id));
    if (!deleted) {
      throw AppError.notFound('Category not found', 'CATEGORY_NOT_FOUND');
    }

    await this.audits.logAction({
      admin_id: req.user!.id,
      action: 'DELETE_CATEGORY',
      target_table: 'categories',
      target_id: Number(req.params.id),
      description: `Menghapus kategori #${req.params.id}`,
    });

    return AppBaseResponse.deleted(res, 'Category deleted successfully');
  });
}

export const categoryController = new CategoryController();
