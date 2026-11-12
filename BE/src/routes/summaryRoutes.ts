import { Router } from 'express';
import { summaryController } from '../controllers';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, summaryController.getSummary);

export default router;
