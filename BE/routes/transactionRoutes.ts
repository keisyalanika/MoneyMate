import { Router } from 'express';
import { getTransactions, addTransaction, removeTransaction } from '../controllers/transactionController';

const router = Router();
router.get('/', getTransactions);
router.post('/', addTransaction);
router.delete('/:id', removeTransaction);

export default router;
