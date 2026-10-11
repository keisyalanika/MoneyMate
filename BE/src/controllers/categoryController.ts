import { Request, Response } from 'express';
import * as catService from '../services/categoryService';

// ---- GET all categories ----
export const getCategories = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;
    const list = await catService.getCategories(type as string);
    res.json({ success: true, data: list, message: 'Categories retrieved successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- CREATE category ----
export const addCategory = async (req: Request, res: Response) => {
  try {
    const { name, type, icon } = req.body;
    if (!name || !type) {
      return res.status(400).json({ success: false, message: 'Name and type are required' });
    }
    const created = await catService.createCategory({ name, type, icon });
    res.status(201).json({ success: true, data: created, message: 'Category created successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- UPDATE category ----
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const updated = await catService.updateCategory(Number(req.params.id), req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, data: updated, message: 'Category updated successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ---- DELETE category ----
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const deleted = await catService.deleteCategory(Number(req.params.id));
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
