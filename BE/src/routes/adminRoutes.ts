import { Router } from 'express';
import {
  getAllUsers,
  getUser,
  toggleUserActive,
  deleteUser,
  getAuditLogs,
} from '../controllers/adminController';
import { protect, admin } from '../middleware/authMiddleware';

const router = Router();

// All admin routes require authentication and admin role
router.use(protect, admin);

router.get('/users', getAllUsers);
router.get('/users/:id', getUser);
router.put('/users/:id/status', toggleUserActive);
router.delete('/users/:id', deleteUser);
router.get('/audit-logs', getAuditLogs);

export default router;
