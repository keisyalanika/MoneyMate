import { Router } from 'express';
import {
  getIncomeSources,
  addIncomeSource,
  removeIncomeSource,
} from '../controllers/incomeSourceController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Require login for income sources
router.use(protect);

router.get('/', getIncomeSources);
router.post('/', addIncomeSource);
router.delete('/:id', removeIncomeSource);

export default router;
