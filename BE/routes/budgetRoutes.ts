import { Router } from 'express';
import { getBudgets } from '../controllers/budgetController';

const router = Router();
router.get('/', getBudgets);

export default router;
