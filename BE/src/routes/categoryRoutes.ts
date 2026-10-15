import { Router } from 'express';
import {
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  togglePinCategory,
} from '../controllers/categoryController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Category routes are protected
router.use(protect);

router.get('/', getCategories);
router.post('/', addCategory);
router.put('/:id/pin', togglePinCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
