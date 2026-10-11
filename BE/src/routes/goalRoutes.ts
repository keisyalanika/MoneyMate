import { Router } from 'express';
import {
  getGoals,
  getGoal,
  addGoal,
  updateGoal,
  deleteGoal,
  addFund,
  getGoalFunds,
} from '../controllers/goalController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getGoals);
router.get('/:id', getGoal);
router.post('/', addGoal);
router.put('/:id', updateGoal);
router.delete('/:id', deleteGoal);
router.post('/:id/funds', addFund);
router.get('/:id/funds', getGoalFunds);

export default router;
