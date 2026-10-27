import { Router } from 'express';
import {
  getReports,
  createReport,
  getExportSummary,
  scheduleReport,
  deleteReport,
} from '../controllers/reportController';
import { protect, admin } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getReports);
router.get('/export', getExportSummary);
router.post('/schedule', admin, scheduleReport);
router.post('/', createReport);
router.delete('/:id', deleteReport);

export default router;
