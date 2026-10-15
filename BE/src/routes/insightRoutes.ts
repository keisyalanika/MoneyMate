import { Router } from 'express';
import {
  getInsights,
  createInsight,
  chatWithAi,
  generateInsights,
  deleteInsight,
} from '../controllers/insightController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getInsights);
router.post('/', createInsight);
router.post('/chat', chatWithAi);
router.post('/generate', generateInsights);
router.delete('/:id', deleteInsight);

export default router;
