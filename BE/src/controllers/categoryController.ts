import { Response } from 'express';
import * as catService from '../services/categoryService';
import { AuthRequest } from '../middleware/authMiddleware';

// ---- GET all categories ----
export const getCategories = async (req: AuthRequest, res: Response) => {
  try {
    const { type } = req.query;
    const userId = req.user ? req.user.id : undefined;
    const list = await catService.getCategories(type as string, userId);
    res.json({ success: true, data: list, message: 'Categories retrieved successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- CREATE category (Admin creates system category, Student creates personal category) ----
export const addCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { name, type, icon, color, is_pinned } = req.body;
    if (!name || !type) {
      return res.status(400).json({ success: false, message: 'Name and type are required' });
    }

    // If student, attach their user_id
    const userId = req.user?.role === 'admin' ? null : req.user?.id;

    const created = await catService.createCategory({
      name,
      type,
      icon,
      color,
      is_pinned,
      user_id: userId,
    });

    res.status(201).json({ success: true, data: created, message: 'Category created successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- UPDATE category ----
export const updateCategory = async (req: AuthRequest, res: Response) => {
  try {
    const cat = await catService.getCategoryById(Number(req.params.id));
    if (!cat) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Only creator or admin can edit
    if (cat.user_id && req.user?.role !== 'admin' && Number(cat.user_id) !== Number(req.user?.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this category' });
    }

    const updated = await catService.updateCategory(Number(req.params.id), req.body);
    res.json({ success: true, data: updated, message: 'Category updated successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- TOGGLE PIN status ----
export const togglePinCategory = async (req: AuthRequest, res: Response) => {
  try {
    const { is_pinned } = req.body;
    const updated = await catService.togglePin(Number(req.params.id), is_pinned !== undefined ? Boolean(is_pinned) : true);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: updated, message: 'Category pin status updated' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- DELETE category ----
export const deleteCategory = async (req: AuthRequest, res: Response) => {
  try {
    const cat = await catService.getCategoryById(Number(req.params.id));
    if (!cat) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    // Only creator or admin can delete
    if (cat.user_id && req.user?.role !== 'admin' && Number(cat.user_id) !== Number(req.user?.id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this category' });
    }

    await catService.deleteCategory(Number(req.params.id));
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
