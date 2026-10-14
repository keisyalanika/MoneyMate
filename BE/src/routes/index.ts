import { Router } from 'express';
import authRoutes from './authRoutes';
import summaryRoutes from './summaryRoutes';
import transactionRoutes from './transactionRoutes';
import categoryRoutes from './categoryRoutes';
import budgetRoutes from './budgetRoutes';
import goalRoutes from './goalRoutes';
import notificationRoutes from './notificationRoutes';
import adminRoutes from './adminRoutes';
import reportRoutes from './reportRoutes';
import settingsRoutes from './settingsRoutes';
import userRoutes from './userRoutes';
import incomeSourceRoutes from './incomeSourceRoutes';
import insightRoutes from './insightRoutes';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/summary', summaryRoutes);
apiRouter.use('/transactions', transactionRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/budgets', budgetRoutes);
apiRouter.use('/goals', goalRoutes);
apiRouter.use('/notifications', notificationRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/reports', reportRoutes);
apiRouter.use('/settings', settingsRoutes);
apiRouter.use('/users', userRoutes);
apiRouter.use('/income-sources', incomeSourceRoutes);
apiRouter.use('/insights', insightRoutes);

export default apiRouter;
