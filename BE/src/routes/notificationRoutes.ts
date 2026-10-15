import { Router } from 'express';
import {
  getNotifications,
  addNotification,
  broadcastNotification,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} from '../controllers/notificationController';
import { protect, admin } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', getNotifications);
router.post('/', addNotification);
router.post('/broadcast', admin, broadcastNotification);
router.put('/read-all', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

export default router;
