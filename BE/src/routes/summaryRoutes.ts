import { Router } from 'express';
import { getSummary } from '../controllers/summaryController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/', protect, getSummary);

export default router;
