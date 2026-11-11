import { Router } from 'express';
import {
  getUsers,
  createUser,
  getProfileMe,
  updateProfileMe,
  updateUserSaldo,
} from '../controllers/userController';
import { protect, admin } from '../middleware/authMiddleware';

const router = Router();

// /api/users/me (User self profile)
router.get('/me', protect, getProfileMe);
router.put('/me', protect, updateProfileMe);

// /api/users (Admin user list & creation)
router.get('/', getUsers);
router.post('/', createUser);

// /api/users/:id/saldo (Admin adjust saldo)
router.put('/:id/saldo', protect, admin, updateUserSaldo);

export default router;
