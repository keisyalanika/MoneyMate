import { Router } from 'express';
import { notificationController } from '../controllers';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', notificationController.getNotifications);
router.post('/', notificationController.addNotification);
router.put('/read-all', notificationController.markAllAsRead);
router.put('/:id/read', notificationController.markAsRead);
router.delete('/:id', notificationController.deleteNotification);

export default router;
