import { Router } from 'express';
import { insightController } from '../controllers';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', insightController.getInsights);
router.post('/', insightController.createInsight);
router.delete('/:id', insightController.deleteInsight);

export default router;
