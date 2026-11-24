import { Router } from 'express';
import { userController } from '../controllers';
import { protect, admin } from '../middleware/authMiddleware';
import { uploadAvatar } from '../middleware/uploadAvatar';

const router = Router();

// /api/users/me (User self profile)
router.get('/me', protect, userController.getProfileMe);
router.put('/me', protect, userController.updateProfileMe);
router.post('/me/avatar', protect, uploadAvatar.single('avatar'), userController.uploadAvatar);
router.delete('/me', protect, userController.deleteMe);

// /api/users (Admin user list & creation)
router.get('/', protect, admin, userController.getUsers);
router.post('/', protect, admin, userController.createUser);

// /api/users/:id/saldo (Admin adjust saldo)
router.put('/:id/saldo', protect, admin, userController.updateUserSaldo);

export default router;
