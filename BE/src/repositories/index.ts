// ============================================
// Repository container
// Semua akses database lewat layer ini (Prisma).
// ============================================

export * from './base/BaseRepository';

export * from './interfaces/IUserRepository';
export * from './interfaces/ICategoryRepository';
export * from './interfaces/IIncomeSourceRepository';
export * from './interfaces/IWalletRepository';
export * from './interfaces/ITransactionRepository';
export * from './interfaces/IBudgetRepository';
export * from './interfaces/IGoalRepository';
export * from './interfaces/INotificationRepository';
export * from './interfaces/IInsightRepository';
export * from './interfaces/IReportRepository';
export * from './interfaces/ISettingsRepository';
export * from './interfaces/IAuditRepository';
export * from './interfaces/ISummaryRepository';

import { UserRepository } from './UserRepository';
import { CategoryRepository } from './CategoryRepository';
import { IncomeSourceRepository } from './IncomeSourceRepository';
import { WalletRepository } from './WalletRepository';
import { TransactionRepository } from './TransactionRepository';
import { BudgetRepository } from './BudgetRepository';
import { GoalRepository } from './GoalRepository';
import { NotificationRepository } from './NotificationRepository';
import { InsightRepository } from './InsightRepository';
import { ReportRepository } from './ReportRepository';
import { SettingsRepository } from './SettingsRepository';
import { AuditRepository } from './AuditRepository';
import { SummaryRepository } from './SummaryRepository';

export {
  UserRepository,
  CategoryRepository,
  IncomeSourceRepository,
  WalletRepository,
  TransactionRepository,
  BudgetRepository,
  GoalRepository,
  NotificationRepository,
  InsightRepository,
  ReportRepository,
  SettingsRepository,
  AuditRepository,
  SummaryRepository,
};

export const userRepository = new UserRepository();
export const categoryRepository = new CategoryRepository();
export const incomeSourceRepository = new IncomeSourceRepository();
export const walletRepository = new WalletRepository();
export const transactionRepository = new TransactionRepository();
export const budgetRepository = new BudgetRepository();
export const goalRepository = new GoalRepository();
export const notificationRepository = new NotificationRepository();
export const insightRepository = new InsightRepository();
export const reportRepository = new ReportRepository();
export const settingsRepository = new SettingsRepository();
export const auditRepository = new AuditRepository();
export const summaryRepository = new SummaryRepository();
