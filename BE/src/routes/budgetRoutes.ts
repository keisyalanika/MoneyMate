import { Router } from 'express';
import {
  getBudgets,
  addBudget,
  updateBudget,
  deleteBudget,
  sendBudgetAlert,
} from '../controllers/budgetController';
import { protect, admin } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getBudgets);
router.post('/', addBudget);
router.post('/:id/alert', admin, sendBudgetAlert);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

export default router;
