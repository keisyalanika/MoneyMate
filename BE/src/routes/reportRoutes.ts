import { Router } from 'express';
import { reportController } from '../controllers';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', reportController.getReports);
router.post('/', reportController.createReport);
router.delete('/:id', reportController.deleteReport);

export default router;
