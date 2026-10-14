import { Router } from 'express';
import {
  getInsights,
  createInsight,
  deleteInsight,
} from '../controllers/insightController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getInsights);
router.post('/', createInsight);
router.delete('/:id', deleteInsight);

export default router;
