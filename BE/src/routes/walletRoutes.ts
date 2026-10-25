import { Router } from 'express';
import {
  getWallets,
  getWallet,
  createWallet,
  updateWallet,
  deleteWallet,
  adjustBalance,
  setupInitialBalance,
} from '../controllers/walletController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// All wallet endpoints are authenticated
router.use(protect);

router.get('/', getWallets);
router.post('/', createWallet);
router.post('/setup-initial', setupInitialBalance);
router.get('/:id', getWallet);
router.put('/:id', updateWallet);
router.delete('/:id', deleteWallet);
router.post('/:id/adjust', adjustBalance);

export default router;
