import { Router } from 'express';
import { walletController } from '../controllers';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// All wallet endpoints are authenticated
router.use(protect);

router.get('/', walletController.getWallets);
router.post('/', walletController.createWallet);
router.post('/setup-initial', walletController.setupInitialBalance);
router.get('/:id', walletController.getWallet);
router.put('/:id', walletController.updateWallet);
router.delete('/:id', walletController.deleteWallet);
router.post('/:id/adjust', walletController.adjustBalance);

export default router;
