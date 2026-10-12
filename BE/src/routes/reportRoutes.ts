import { Router } from 'express';
import {
  getReports,
  createReport,
  deleteReport,
} from '../controllers/reportController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getReports);
router.post('/', createReport);
router.delete('/:id', deleteReport);

export default router;
