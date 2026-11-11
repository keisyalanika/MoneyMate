import { Router } from 'express';
import {
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
  sendBudgetAlert,
} from '../controllers/budgetController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getBudgets);
router.post('/', addBudget);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);
router.post('/:id/alert', sendBudgetAlert);

export default router;
