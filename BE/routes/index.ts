import { Router } from 'express';
import summaryRoutes from './summaryRoutes';
import transactionRoutes from './transactionRoutes';
import categoryRoutes from './categoryRoutes';
import budgetRoutes from './budgetRoutes';

const apiRouter = Router();

apiRouter.use('/summary', summaryRoutes);
apiRouter.use('/transactions', transactionRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/budgets', budgetRoutes);

export default apiRouter;
