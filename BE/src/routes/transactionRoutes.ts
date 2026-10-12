import { Router } from 'express';
import {
  getTransactions,
  getTransaction,
  addTransaction,
  updateTransaction,
  removeTransaction,
  getMonthlySummary,
} from '../controllers/transactionController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// All transaction routes are protected
router.use(protect);

router.get('/', getTransactions);
router.get('/monthly-summary', getMonthlySummary);
router.get('/:id', getTransaction);
router.post('/', addTransaction);
router.put('/:id', updateTransaction);
router.delete('/:id', removeTransaction);

export default router;
