import { Router } from 'express';
import { adminController } from '../controllers';
import { protect, admin } from '../middleware/authMiddleware';

const router = Router();

// All admin routes require authentication and admin role
router.use(protect, admin);

router.get('/users', adminController.getAllUsers);
router.get('/users/:id', adminController.getUser);
router.put('/users/:id/status', adminController.toggleUserActive);
router.delete('/users/:id', adminController.deleteUser);
router.get('/audit-logs', adminController.getAuditLogs);

export default router;
