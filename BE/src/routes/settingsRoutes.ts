import { Router } from 'express';
import { settingsController } from '../controllers';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', settingsController.getSettings);
router.put('/', settingsController.updateSettings);

export default router;
