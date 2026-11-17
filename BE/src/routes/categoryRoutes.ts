import { Router } from 'express';
import { categoryController } from '../controllers';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Categories can be viewed by authenticated users
router.get('/', protect, categoryController.getCategories);

// Category modifications require an authenticated user
router.post('/', protect, categoryController.addCategory);
router.put('/:id', protect, categoryController.updateCategory);
router.delete('/:id', protect, categoryController.deleteCategory);

export default router;
