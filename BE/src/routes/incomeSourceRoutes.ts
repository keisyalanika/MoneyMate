import { Router } from 'express';
import { incomeSourceController } from '../controllers';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Require login for income sources
router.use(protect);

router.get('/', incomeSourceController.getIncomeSources);
router.post('/', incomeSourceController.addIncomeSource);
router.delete('/:id', incomeSourceController.removeIncomeSource);

export default router;
