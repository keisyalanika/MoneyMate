import { transactions, budgets } from '../models/mockDb';
import { FinancialSummary } from '../models/types';

export const getFinancialSummary = (): FinancialSummary => {
  let totalIncome = 0;
  let totalExpense = 0;

  for (const t of transactions) {
    if (t.type === 'INCOME') totalIncome += t.amount;
    if (t.type === 'EXPENSE') totalExpense += t.amount;
  }

  return {
    totalBalance: totalIncome - totalExpense,
    totalIncome,
    totalExpense,
    activeBudgetsCount: budgets.length,
    recentTransactionsCount: transactions.length
  };
};
