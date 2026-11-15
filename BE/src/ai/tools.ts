import { Type } from "@google/genai";
import { budgetService, goalService, summaryService, transactionService, walletService } from "../services";
import { aiChatRepository } from "../repositories/AiChatRepository";
import { categoryRepository } from "../repositories";
import { AppError } from "../errors/AppError";
import type { TransactionType } from "../types";

export const WRITE_TOOLS = new Set([
  "propose_transaction",
  "propose_goal",
  "propose_goal_fund",
  "propose_budget",
]);

export const TOOL_DECLARATIONS: any[] = [
  {
    name: "get_finance_summary",
    description: "Ringkasan keuangan pengguna: total saldo, pemasukan, pengeluaran, jumlah budget aktif, dan goal aktif.",
    parameters: { type: Type.OBJECT, properties: {} },
  },
  {
    name: "list_recent_transactions",
    description: "Ambil transaksi terakhir pengguna.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        limit: { type: Type.NUMBER, description: "Jumlah transaksi (maks 20), default 10" },
      },
    },
  },
  {
    name: "get_budgets",
    description: "Daftar budget pengguna beserta terpakai dan persentasenya.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        month: { type: Type.NUMBER },
        year: { type: Type.NUMBER },
      },
    },
  },
  {
    name: "get_goals",
    description: "Daftar target/goal tabungan pengguna beserta progres.",
    parameters: { type: Type.OBJECT, properties: {} },
  },
  {
    name: "get_top_categories",
    description: "Kategori pengeluaran terbesar pengguna dalam N hari terakhir.",
    parameters: {
      type: Type.OBJECT,
      properties: { days: { type: Type.NUMBER, description: "Default 30" } },
    },
  },
  {
    name: "propose_transaction",
    description: "Usulkan pencatatan transaksi. Tidak menyimpan sebelum dikonfirmasi pengguna.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        type: { type: Type.STRING, enum: ["income", "expense"] },
        amount: { type: Type.NUMBER, description: "Nominal rupiah tanpa titik" },
        category_id: { type: Type.NUMBER, description: "ID kategori (opsional jika category_name diisi)" },
        category_name: { type: Type.STRING, description: "Nama kategori, contoh: Makanan & Minuman, Transportasi" },
        note: { type: Type.STRING },
        date: { type: Type.STRING, description: "YYYY-MM-DD, default hari ini" },
      },
      required: ["type", "amount"],
    },
  },
  {
    name: "propose_goal",
    description: "Usulkan pembuatan target tabungan baru. Tidak menyimpan sebelum dikonfirmasi.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        target_amount: { type: Type.NUMBER },
        deadline: { type: Type.STRING, description: "YYYY-MM-DD (opsional)" },
      },
      required: ["title", "target_amount"],
    },
  },
  {
    name: "propose_goal_fund",
    description: "Usulkan setoran dana ke goal yang sudah ada. Tidak menyimpan sebelum dikonfirmasi.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        goal_id: { type: Type.NUMBER },
        amount: { type: Type.NUMBER },
        note: { type: Type.STRING },
      },
      required: ["goal_id", "amount"],
    },
  },
  {
    name: "propose_budget",
    description: "Usulkan pembuatan/perubahan budget bulanan kategori. Tidak menyimpan sebelum dikonfirmasi.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        category_id: { type: Type.NUMBER },
        amount: { type: Type.NUMBER },
        month: { type: Type.NUMBER },
        year: { type: Type.NUMBER },
      },
      required: ["category_id", "amount"],
    },
  },
];

function numberArg(value: unknown): number | undefined {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export async function executeReadTool(
  name: string,
  userId: number,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "get_finance_summary": {
      const [summary, wallets] = await Promise.all([
        summaryService.getUserSummary(userId),
        walletService.getWallets(userId),
      ]);
      return {
        total_balance: wallets.totalBalance,
        total_income: summary.totalIncome,
        total_expense: summary.totalExpense,
        active_budgets: summary.activeBudgetsCount,
        active_goals: summary.activeGoalsCount,
      };
    }

    case "list_recent_transactions": {
      const limit = Math.min(Math.max(numberArg(args.limit) ?? 10, 1), 20);
      const rows = await transactionService.getAllTransactions({
        user_id: userId,
        limit,
      } as never);
      return rows.map((row: any) => ({
        id: row.id,
        type: row.type,
        amount: Number(row.amount),
        category: row.category_name ?? null,
        date: row.date,
        note: row.note ?? null,
      }));
    }

    case "get_budgets": {
      const now = new Date();
      const month = numberArg(args.month) ?? now.getMonth() + 1;
      const year = numberArg(args.year) ?? now.getFullYear();
      const rows = await budgetService.getBudgets(userId, month, year);
      return rows.map((row: any) => ({
        category: row.category_name ?? null,
        amount: Number(row.amount),
        spent: Number(row.spent_amount ?? 0),
        percentage: row.percentage ?? 0,
        month: row.month,
        year: row.year,
      }));
    }

    case "get_goals": {
      const rows = await goalService.getGoals(userId);
      return rows.map((row: any) => ({
        id: row.id,
        title: row.title,
        target: Number(row.target_amount),
        current: Number(row.current_amount),
        completed: Boolean(row.is_completed),
        deadline: row.deadline ?? null,
      }));
    }

    case "get_top_categories": {
      const days = Math.min(Math.max(numberArg(args.days) ?? 30, 1), 180);
      const start = new Date(Date.now() - days * 24 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10);
      const rows = await transactionService.getAllTransactions({
        user_id: userId,
        type: "expense",
        start_date: start,
        limit: 500,
      } as never);

      const totals = new Map<string, number>();
      for (const row of rows as any[]) {
        const key = row.category_name ?? "Lainnya";
        totals.set(key, (totals.get(key) ?? 0) + Number(row.amount));
      }

      return Array.from(totals.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 7)
        .map(([category, total]) => ({ category, total }));
    }

    default:
      throw AppError.badRequest(`Tool tidak dikenal: ${name}`, "UNKNOWN_TOOL");
  }
}

export async function executeWriteTool(
  name: string,
  userId: number,
  args: Record<string, unknown>
) {
  const payload: Record<string, unknown> = { ...args };

  if (name === "propose_transaction") {
    const amount = numberArg(args.amount);
    const type = String(args.type ?? "");
    if (!amount || amount <= 0) throw AppError.badRequest("Nominal transaksi tidak valid.", "INVALID_AMOUNT");
    if (type !== "income" && type !== "expense") {
      throw AppError.badRequest("Tipe transaksi harus income atau expense.", "INVALID_TYPE");
    }

    let categoryId = numberArg(args.category_id);
    const categoryName = String(args.category_name ?? "").trim();

    if (!categoryId && categoryName) {
      const list = await categoryRepository.findAll(type as TransactionType);
      const match = list.find((item) =>
        item.name.toLowerCase().includes(categoryName.toLowerCase())
      ) ?? list.find((item) =>
        categoryName.toLowerCase().includes(item.name.toLowerCase())
      );
      categoryId = match?.id;
    }

    if (!categoryId) {
      throw AppError.badRequest(
        "Kategori transaksi belum jelas. Sebutkan kategorinya, misal Makanan & Minuman.",
        "INVALID_CATEGORY"
      );
    }
    payload.amount = amount;
    payload.category_id = categoryId;
    payload.type = type as TransactionType;
    payload.date = String(args.date ?? new Date().toISOString().slice(0, 10));
  }

  if (name === "propose_goal") {
    const amount = numberArg(args.target_amount);
    if (!amount || amount <= 0) throw AppError.badRequest("Target goal tidak valid.", "INVALID_TARGET");
    payload.target_amount = amount;
    payload.title = String(args.title ?? "Target baru");
  }

  if (name === "propose_goal_fund") {
    const amount = numberArg(args.amount);
    const goalId = numberArg(args.goal_id);
    if (!amount || amount <= 0) throw AppError.badRequest("Nominal setoran tidak valid.", "INVALID_AMOUNT");
    if (!goalId) throw AppError.badRequest("Goal belum dipilih.", "INVALID_GOAL");
    payload.amount = amount;
    payload.goal_id = goalId;
  }

  if (name === "propose_budget") {
    const amount = numberArg(args.amount);
    const categoryId = numberArg(args.category_id);
    const now = new Date();
    if (!amount || amount <= 0) throw AppError.badRequest("Nominal budget tidak valid.", "INVALID_AMOUNT");
    if (!categoryId) throw AppError.badRequest("Kategori budget belum dipilih.", "INVALID_CATEGORY");
    payload.amount = amount;
    payload.category_id = categoryId;
    payload.month = numberArg(args.month) ?? now.getMonth() + 1;
    payload.year = numberArg(args.year) ?? now.getFullYear();
  }

  return aiChatRepository.createProposal(userId, name, payload);
}
