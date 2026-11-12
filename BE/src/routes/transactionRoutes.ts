import { Router } from 'express';
import { transactionController } from '../controllers';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// All transaction routes are protected
router.use(protect);

router.get('/', transactionController.getTransactions);
router.get('/monthly-summary', transactionController.getMonthlySummary);
router.get('/:id', transactionController.getTransaction);
router.post('/', transactionController.addTransaction);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.removeTransaction);

export default router;
