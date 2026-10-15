import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import * as txService from './transactionService';
import * as budgetService from './budgetService';
import * as userService from './userService';

// ---- GET reports ----
export const getReports = async (filters?: { user_id?: number; report_type?: string }) => {
  let query = `
    SELECT r.*, u.name AS user_name, admin.name AS generated_by_name
    FROM reports r
    LEFT JOIN users u ON r.user_id = u.id
    LEFT JOIN users admin ON r.generated_by = admin.id
    WHERE 1=1
  `;
  const params: any[] = [];
  if (filters?.user_id) { query += ' AND r.user_id = ?'; params.push(filters.user_id); }
  if (filters?.report_type) { query += ' AND r.report_type = ?'; params.push(filters.report_type); }
  query += ' ORDER BY r.created_at DESC';
  const [rows] = await pool.query<RowDataPacket[]>(query, params);
  return rows;
};

// ---- CREATE report ----
export const createReport = async (data: {
  user_id?: number;
  generated_by: number;
  report_type: string;
  title?: string;
  period_start?: string;
  period_end?: string;
  file_url?: string;
}) => {
  const [result] = await pool.query<ResultSetHeader>(
    `INSERT INTO reports (user_id, generated_by, report_type, title, period_start, period_end, file_url)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [data.user_id || null, data.generated_by, data.report_type, data.title || null, data.period_start || null, data.period_end || null, data.file_url || null]
  );
  return { id: result.insertId, ...data };
};

// ---- DELETE report ----
export const deleteReport = async (id: number) => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM reports WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

// ---- GENERATE EXPORT FINANCIAL SUMMARY ----
export const generateExportSummary = async (filters?: {
  user_id?: number;
  period_start?: string;
  period_end?: string;
  report_type?: string;
}) => {
  const transactions = await txService.getAllTransactions({
    user_id: filters?.user_id,
    start_date: filters?.period_start,
    end_date: filters?.period_end,
    limit: 500,
  });

  const budgets = filters?.user_id
    ? await budgetService.getBudgets(filters.user_id)
    : await budgetService.getAllBudgets();

  const users = await userService.getAllUsers();
  const totalUsersCount = users.length;

  const incomes = transactions.filter((t: any) => String(t.type).toLowerCase() === 'income');
  const expenses = transactions.filter((t: any) => String(t.type).toLowerCase() === 'expense');

  const totalIncome = incomes.reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);
  const totalExpense = expenses.reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);
  const netCashFlow = totalIncome - totalExpense;

  // Category breakdown
  const categoryBreakdown: Record<string, { name: string; amount: number; count: number; icon: string }> = {};
  for (const exp of expenses) {
    const cName = exp.category_name || 'Lainnya';
    if (!categoryBreakdown[cName]) {
      categoryBreakdown[cName] = { name: cName, amount: 0, count: 0, icon: exp.category_icon || 'tag' };
    }
    categoryBreakdown[cName].amount += Number(exp.amount) || 0;
    categoryBreakdown[cName].count += 1;
  }

  const categoryList = Object.values(categoryBreakdown).sort((a, b) => b.amount - a.amount);

  // Overbudget list
  const overBudgets = (budgets as any[])
    .filter(b => (b.percentage || 0) >= 80)
    .map(b => ({
      category: b.category_name,
      student: b.user_name || 'Pengguna',
      limit: Number(b.amount || 0),
      spent: Number(b.spent_amount || 0),
      percentage: Number(b.percentage || 0),
      isOver: Number(b.percentage || 0) > 100,
    }));

  return {
    generated_at: new Date().toISOString(),
    period: {
      start: filters?.period_start || 'Awal Semester',
      end: filters?.period_end || 'Sekarang',
    },
    cash_flow: {
      total_income: totalIncome,
      total_expense: totalExpense,
      net_cashflow: netCashFlow,
      avg_expense_per_student: totalUsersCount > 0 ? Math.round(totalExpense / totalUsersCount) : 0,
      savings_rate: totalIncome > 0 ? Math.max(0, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)) : 0,
    },
    category_breakdown: categoryList,
    over_budget_analysis: {
      total_warning_count: overBudgets.length,
      items: overBudgets,
    },
    transactions_count: transactions.length,
    students_count: totalUsersCount,
  };
};

// ---- SCHEDULE AUTOMATIC REPORT ----
export const scheduleAutomaticReport = async (
  adminId: number,
  data: {
    frequency: string;
    time: string;
    recipients?: string[];
    subject?: string;
  }
) => {
  // Create audit log for scheduled job
  await pool.query(
    'INSERT INTO audit_logs (admin_id, action, target_table, description) VALUES (?, ?, ?, ?)',
    [
      adminId,
      'SCHEDULE_REPORT',
      'reports',
      `Jadwal laporan otomatis diatur: ${data.frequency} pukul ${data.time} (Subject: ${data.subject || 'Rekap Finansial'})`
    ]
  );

  return {
    status: 'active',
    frequency: data.frequency,
    time: data.time,
    recipients: data.recipients || ['admin@moneymate.com'],
    subject: data.subject || 'Rekap Finansial Kampus MoneyMate',
    next_run: 'Sesuai siklus periode yang ditentukan',
  };
};
