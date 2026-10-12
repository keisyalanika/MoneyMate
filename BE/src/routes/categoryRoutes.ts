import { Router } from 'express';
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController';
import { protect, admin } from '../middleware/authMiddleware';

const router = Router();

// Categories can be viewed by authenticated users
router.get('/', protect, getCategories);

// Category modifications are restricted to admin
router.post('/', protect, admin, addCategory);
router.put('/:id', protect, admin, updateCategory);
router.delete('/:id', protect, admin, deleteCategory);

export default router;
