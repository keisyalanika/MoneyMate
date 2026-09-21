import React, { useState, useEffect } from 'react';
import { AdminLayout } from './layouts/AdminLayout';
import { Dashboard } from './pages/Dashboard';
import { TransactionsPage } from './pages/TransactionsPage';
import { BudgetsPage } from './pages/BudgetsPage';
import { TransactionModal } from './components/TransactionModal';
import { fetchSummary, fetchTransactions, fetchCategories, fetchBudgets, createTransaction, deleteTransaction } from './services/api';
import { FinancialSummary, Transaction, Category, Budget, TransactionType } from './models/types';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const loadData = async () => {
    const s = await fetchSummary();
    const t = await fetchTransactions();
    const c = await fetchCategories();
    const b = await fetchBudgets();
    setSummary(s);
    setTransactions(t);
    setCategories(c);
    setBudgets(b);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddTransaction = async (data: { title: string; amount: number; type: TransactionType; categoryId: string; notes: string }) => {
    await createTransaction(data);
    await loadData();
  };

  const handleDeleteTransaction = async (id: string) => {
    await deleteTransaction(id);
    await loadData();
  };

  return (
    <AdminLayout activeTab={activeTab} setActiveTab={setActiveTab} onAddClick={() => setIsModalOpen(true)}>
      {activeTab === 'dashboard' && <Dashboard summary={summary} transactions={transactions} budgets={budgets} />}
      {activeTab === 'transactions' && <TransactionsPage transactions={transactions} onDelete={handleDeleteTransaction} />}
      {activeTab === 'budgets' && <BudgetsPage budgets={budgets} />}

      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        onSubmit={handleAddTransaction}
      />
    </AdminLayout>
  );
};

export default App;
