import { Router } from 'express';
import { budgetController } from '../controllers';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', budgetController.getBudgets);
router.post('/', budgetController.addBudget);
router.put('/:id', budgetController.updateBudget);
router.delete('/:id', budgetController.deleteBudget);
router.post('/:id/alert', budgetController.sendBudgetAlert);

export default router;
