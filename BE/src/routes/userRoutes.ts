import { Router } from 'express';
import { userController } from '../controllers';
import { protect, admin } from '../middleware/authMiddleware';

const router = Router();

// /api/users/me (User self profile)
router.get('/me', protect, userController.getProfileMe);
router.put('/me', protect, userController.updateProfileMe);

// /api/users (Admin user list & creation)
router.get('/', userController.getUsers);
router.post('/', userController.createUser);

// /api/users/:id/saldo (Admin adjust saldo)
router.put('/:id/saldo', protect, admin, userController.updateUserSaldo);

export default router;
