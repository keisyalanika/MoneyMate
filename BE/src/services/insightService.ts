import pool from '../config/database';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import * as txService from './transactionService';
import * as budgetService from './budgetService';
import * as walletService from './walletService';

// ---- GET AI insights for user ----
export const getInsights = async (user_id: number) => {
  const [rows] = await pool.query<RowDataPacket[]>(
    'SELECT * FROM ai_insights WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
    [user_id]
  );
  return rows;
};

// ---- GET all insights (admin) ----
export const getAllInsights = async () => {
  const [rows] = await pool.query<RowDataPacket[]>(`
    SELECT ai.*, u.name AS user_name
    FROM ai_insights ai
    LEFT JOIN users u ON ai.user_id = u.id
    ORDER BY ai.created_at DESC LIMIT 50
  `);
  return rows;
};

// ---- CREATE insight ----
export const createInsight = async (data: { user_id: number; insight_type: string; content: string }) => {
  const [result] = await pool.query<ResultSetHeader>(
    'INSERT INTO ai_insights (user_id, insight_type, content) VALUES (?, ?, ?)',
    [data.user_id, data.insight_type, data.content]
  );
  return { id: result.insertId, ...data };
};

// ---- DELETE insight ----
export const deleteInsight = async (id: number) => {
  const [result] = await pool.query<ResultSetHeader>('DELETE FROM ai_insights WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

// ---- CHAT WITH FINANCIAL AI ASSISTANT ----
export const chatWithAi = async (
  userId: number,
  message: string,
  _history: any[] = []
) => {
  // 1. Gather actual user financial data
  const userWallets = await walletService.getWallets(userId);
  const transactions = await txService.getAllTransactions({ user_id: userId, limit: 100 });
  const budgets = await budgetService.getBudgets(userId);

  // 2. Compute metrics
  const expenses = transactions.filter((t: any) => String(t.type).toLowerCase() === 'expense');
  const totalExpense = expenses.reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);

  const incomes = transactions.filter((t: any) => String(t.type).toLowerCase() === 'income');
  const totalIncome = incomes.reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);

  // Group expenses by category
  const categoryMap: Record<string, number> = {};
  for (const exp of expenses) {
    const cat = exp.category_name || 'Lainnya';
    categoryMap[cat] = (categoryMap[cat] || 0) + Number(exp.amount);
  }

  const sortedCategories = Object.entries(categoryMap).sort((a, b) => b[1] - a[1]);
  const topCategory = sortedCategories[0] || ['Makanan & Minuman', 0];
  const topCategoryName = topCategory[0];
  const topCategoryAmount = topCategory[1];
  const topCategoryPercent = totalExpense > 0 ? Math.round((topCategoryAmount / totalExpense) * 100) : 0;

  // Check budgets
  const overBudgets = (budgets as any[]).filter(b => (b.percentage || 0) >= 80);

  const lowerMsg = message.toLowerCase();

  let reply = '';
  let categoryHighlight = topCategoryName;
  let tip = '';

  if (lowerMsg.includes('pengeluaran terbesar') || lowerMsg.includes('terbesar') || lowerMsg.includes('paling boros')) {
    reply = `Bulan ini pengeluaran terbesar kamu ada di pos **${topCategoryName}** dengan total **Rp ${topCategoryAmount.toLocaleString('id-ID')}** (${topCategoryPercent}% dari seluruh pengeluaran bulanan).\n\n💡 **Tips Hemat:**\n1. Alokasikan batas belanja harian maksimal Rp ${Math.round(topCategoryAmount / 30).toLocaleString('id-ID')} per hari.\n2. Manfaatkan diskon kantin mitra kampus atau bawa bekal untuk menekan pengeluaran konsumsi hingga 30%.\n3. Pertahankan pencatatan setiap selesai bertransaksi agar tidak ada pengeluaran 'bocor halus'.`;
    tip = 'Batasi jajan impulsif di luar jam kuliah utama.';
  } else if (lowerMsg.includes('tips hemat') || lowerMsg.includes('cara hemat') || lowerMsg.includes('menabung')) {
    reply = `Berikut 3 strategi hemat cerdas khusus mahasiswa MoneyMate:\n\n1. **Gunakan Aturan 50/30/20**:\n   - 50% untuk Kebutuhan Pokok (makan, kos, transportasi)\n   - 30% untuk Akademik & Kebutuhan Sosial terkontrol\n   - 20% langsung sisihkan untuk Tabungan / Dana Darurat saat pertama kali kiriman masuk.\n2. **Kunci Saldo Darurat**: Saat ini total saldo aktif kamu sebesar **Rp ${userWallets.totalBalance.toLocaleString('id-ID')}**. Pastikan minimal 1 bulan biaya hidup tetap berada di rekening cadangan.\n3. **Cek Pagu Anggaran**: Kamu punya ${budgets.length} pos anggaran aktif. Pastikan pos ${topCategoryName} tidak melewati pagu batas aman.`;
    tip = 'Sisihkan uang di awal siklus, bukan dari sisa akhir bulan!';
  } else if (lowerMsg.includes('budget') || lowerMsg.includes('anggaran') || lowerMsg.includes('pagu') || lowerMsg.includes('defisit')) {
    if (overBudgets.length > 0) {
      const overNames = overBudgets.map(b => `${b.category_name} (${b.percentage}%)`).join(', ');
      reply = `⚠️ **Peringatan Pagu Anggaran:**\nTerdapat pos anggaran yang sudah mendekati/melampaui batas aman: **${overNames}**.\n\nSaran MoneyMate: Tahan pengeluaran non-esensial di pos tersebut hingga akhir periode siklus bulanan ini.`;
      tip = 'Prioritaskan kebutuhan primer hingga tanggal kiriman berikutnya.';
    } else {
      reply = `Kabar baik! Seluruh pos anggaran kamu bulan ini berada dalam status **AMAN** (di bawah 80%). Realisasi belanja terjaga dengan baik. Terus pertahankan kedisiplinan finansial ini! 👏`;
      tip = 'Kedisiplinan anggaran kamu luar biasa, pertahankan!';
    }
  } else if (lowerMsg.includes('saldo') || lowerMsg.includes('uang') || lowerMsg.includes('dompet')) {
    reply = `Total saldo aktif di seluruh dompet kamu saat ini adalah **Rp ${userWallets.totalBalance.toLocaleString('id-ID')}** terbagi dalam ${userWallets.wallets.length} dompet/rekening aktif.\n\nTotal pemasukan tercatat: Rp ${totalIncome.toLocaleString('id-ID')}\nTotal pengeluaran: Rp ${totalExpense.toLocaleString('id-ID')}`;
    tip = 'Pantau mutasi saldo secara berkala untuk menjaga transparansi keuangan.';
  } else {
    reply = `Halo! Aku asisten AI cerdas MoneyMate. Berdasarkan catatan keuanganmu bulan ini:\n- Total saldo aktif: **Rp ${userWallets.totalBalance.toLocaleString('id-ID')}**\n- Pengeluaran terbesar: **${topCategoryName}** (Rp ${topCategoryAmount.toLocaleString('id-ID')})\n\nAda yang ingin kamu tanyakan lebih lanjut tentang pengeluaran, tips menabung, atau analisis anggaran?`;
    tip = 'Tanyakan apa saja seputar tips menghemat atau analisis pengeluaranmu!';
  }

  return {
    reply,
    top_category: categoryHighlight,
    top_amount: topCategoryAmount,
    total_balance: userWallets.totalBalance,
    total_expense: totalExpense,
    total_income: totalIncome,
    tip,
    timestamp: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
  };
};

// ---- GENERATE PROACTIVE INSIGHTS ----
export const generateProactiveInsights = async (userId: number) => {
  const transactions = await txService.getAllTransactions({ user_id: userId, limit: 50 });
  const budgets = await budgetService.getBudgets(userId);

  const expenses = transactions.filter((t: any) => String(t.type).toLowerCase() === 'expense');
  const totalExpense = expenses.reduce((sum: number, t: any) => sum + (Number(t.amount) || 0), 0);

  const newInsights = [];

  // 1. Spending Habit Insight
  if (totalExpense > 0) {
    const item = await createInsight({
      user_id: userId,
      insight_type: 'spending_habit',
      content: `Total pengeluaran tercatat periode ini adalah Rp ${totalExpense.toLocaleString('id-ID')}. Evaluasi pos belanja harian untuk meningkatkan rasio tabungan.`,
    });
    newInsights.push(item);
  }

  // 2. Budget Alert
  const over = (budgets as any[]).find(b => (b.percentage || 0) >= 80);
  if (over) {
    const item = await createInsight({
      user_id: userId,
      insight_type: 'budget_alert',
      content: `Perhatian: Pagu kategori ${over.category_name} telah terpakai ${over.percentage}%. Batasi konsumsi non-primer untuk pos ini.`,
    });
    newInsights.push(item);
  }

  return newInsights;
};
