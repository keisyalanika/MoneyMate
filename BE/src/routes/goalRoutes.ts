import { Router } from 'express';
import { goalController } from '../controllers';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', goalController.getGoals);
router.get('/:id', goalController.getGoal);
router.post('/', goalController.addGoal);
router.put('/:id', goalController.updateGoal);
router.delete('/:id', goalController.deleteGoal);
router.post('/:id/funds', goalController.addFund);
router.get('/:id/funds', goalController.getGoalFunds);

export default router;
