import { aiChatRepository, type ProposalRecord } from "../repositories/AiChatRepository";
import { isGeminiEnabled, runGemini } from "./GeminiProvider";
import { WRITE_TOOLS, executeReadTool, executeWriteTool } from "./tools";
import { AppError } from "../errors/AppError";
import { budgetService, goalService, transactionService } from "../services";

const RATE_LIMIT = 20;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const buckets = new Map<number, number[]>();

function checkRateLimit(userId: number) {
  const now = Date.now();
  const recent = (buckets.get(userId) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    throw new AppError(
      "Batas 20 pesan per jam tercapai. Coba lagi nanti.",
      429,
      "RATE_LIMITED"
    );
  }
  recent.push(now);
  buckets.set(userId, recent);
}

function parseAmount(text: string): number | null {
  const lowered = text.toLowerCase().replace(/\./g, "");

  const juta = lowered.match(/(\d+(?:[.,]\d+)?)\s*(juta|jt)/);
  if (juta) return Math.round(Number(juta[1].replace(",", ".")) * 1_000_000);

  const ribu = lowered.match(/(\d+(?:[.,]\d+)?)\s*(ribu|rb|k)\b/);
  if (ribu) return Math.round(Number(ribu[1].replace(",", ".")) * 1_000);

  const plain = lowered.match(/(\d{3,})/);
  if (plain) return Number(plain[1]);

  return null;
}

const CATEGORY_HINTS: Array<{ keywords: string[]; id: number }> = [
  { keywords: ["makan", "minum", "kantin", "kopi", "jajan"], id: 7 },
  { keywords: ["transport", "ojek", "bensin", "bus", "grab", "gojek"], id: 8 },
  { keywords: ["belanja", "baju", "sepatu"], id: 9 },
  { keywords: ["tagihan", "listrik", "kuota", "internet"], id: 10 },
  { keywords: ["pendidikan", "buku", "kursus"], id: 11 },
  { keywords: ["hiburan", "nonton", "game", "musik"], id: 12 },
  { keywords: ["kesehatan", "obat", "dokter"], id: 13 },
];

function guessCategory(text: string): number {
  const lowered = text.toLowerCase();
  for (const item of CATEGORY_HINTS) {
    if (item.keywords.some((keyword) => lowered.includes(keyword))) return item.id;
  }
  return 14;
}

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

function describeProposal(proposal: ProposalRecord): string {
  const payload = proposal.payload;

  if (proposal.tool_name === "propose_transaction") {
    const type = payload.type === "income" ? "pemasukan" : "pengeluaran";
    return `Saya siapkan usulan ${type} ${formatRupiah(Number(payload.amount))}${
      payload.note ? ` (${payload.note})` : ""
    }. Konfirmasi dulu ya.`;
  }
  if (proposal.tool_name === "propose_goal") {
    return `Saya siapkan goal "${payload.title}" dengan target ${formatRupiah(
      Number(payload.target_amount)
    )}. Konfirmasi untuk menyimpan.`;
  }
  if (proposal.tool_name === "propose_goal_fund") {
    return `Saya siapkan setoran ${formatRupiah(Number(payload.amount))} ke goal yang dipilih. Konfirmasi dulu.`;
  }
  if (proposal.tool_name === "propose_budget") {
    return `Saya siapkan budget ${formatRupiah(Number(payload.amount))} untuk kategori tersebut. Konfirmasi dulu.`;
  }
  return "Saya siapkan usulan aksi. Konfirmasi dulu ya.";
}

interface ChatInput {
  message: string;
  conversationId?: number;
}

export class AiChatService {
  constructor(private readonly repo = aiChatRepository) {}

  async chat(userId: number, input: ChatInput) {
    const message = input.message.trim();
    if (!message) throw AppError.badRequest("Pesan tidak boleh kosong.", "VALIDATION_ERROR");
    if (message.length > 1000) throw AppError.badRequest("Pesan terlalu panjang.", "VALIDATION_ERROR");

    checkRateLimit(userId);

    const conversationId = await this.repo.getOrCreateConversation(
      userId,
      input.conversationId,
      message.slice(0, 60)
    );

    const history = await this.repo.recentMessages(conversationId, 12);
    await this.repo.addMessage(conversationId, "user", message);

    const proposals: ProposalRecord[] = [];
    let reply = "";
    let model = "mock";

    if (isGeminiEnabled()) {
      const started = Date.now();
      try {
        const result = await runGemini({
          history: history.map((row) => ({ role: row.role, content: row.content })),
          message,
          onToolCall: async (name, args) => {
            if (WRITE_TOOLS.has(name)) {
              const proposal = await executeWriteTool(name, userId, args);
              proposals.push(proposal);
              return {
                proposal_created: true,
                proposal_id: proposal.id,
                summary: describeProposal(proposal),
              };
            }
            return executeReadTool(name, userId, args);
          },
        });
        reply = result.text;
        model = result.model;
        await this.repo.logUsage({
          userId,
          model,
          latencyMs: Date.now() - started,
        });
      } catch (error) {
        console.warn("[AI] Gemini gagal, fallback ke mock:", (error as Error).message);
      }
    }

    if (!reply) {
      const fallback = await this.mockReply(userId, message, proposals);
      reply = fallback;
    }

    if (!reply && proposals.length > 0) reply = describeProposal(proposals[0]);

    await this.repo.addMessage(conversationId, "assistant", reply);

    return {
      conversation_id: conversationId,
      reply,
      proposal: proposals[0] ?? null,
      model,
    };
  }

  private async mockReply(
    userId: number,
    message: string,
    proposals: ProposalRecord[]
  ): Promise<string> {
    const text = message.toLowerCase();
    const amount = parseAmount(message);

    const wantsTransaction =
      amount !== null &&
      /catat|pengeluaran|pemasukan|beli|bayar|gaji|masuk|makan|minum|kopi|jajan|transport|ojek|bensin|belanja|tagihan|nonton|obat|kantin/.test(
        text
      );
    const wantsGoal = /goal|target|nabung|tabung/.test(text);
    const wantsBudget = /budget|anggaran/.test(text);

    if (wantsTransaction) {
      const type = /pemasukan|gaji|masuk|terima/.test(text) ? "income" : "expense";
      try {
        const proposal = await executeWriteTool("propose_transaction", userId, {
          type,
          amount,
          category_id: type === "income" ? 1 : guessCategory(text),
          note: message.slice(0, 80),
        });
        proposals.push(proposal);
        return describeProposal(proposal);
      } catch {
        return "Nominalnya kurang jelas. Bisa sebutkan angkanya, misal “makan siang 25rb”?";
      }
    }

    if (wantsGoal && amount) {
      try {
        const proposal = await executeWriteTool("propose_goal", userId, {
          title: message.replace(/buat|goal|target|nabung|tabung/gi, "").trim().slice(0, 60) || "Target baru",
          target_amount: amount,
        });
        proposals.push(proposal);
        return describeProposal(proposal);
      } catch {
        return "Target goal-nya belum jelas. Sebutkan nama target dan nominalnya ya.";
      }
    }

    if (wantsBudget) {
      const budgets = (await executeReadTool("get_budgets", userId, {})) as any[];
      if (!budgets.length) return "Kamu belum punya budget. Mau saya bantu buatkan?";
      const lines = budgets
        .slice(0, 4)
        .map((item) => `• ${item.category}: ${formatRupiah(item.spent)} / ${formatRupiah(item.amount)} (${item.percentage}%)`)
        .join("\n");
      return `Ini budget kamu bulan ini:\n${lines}`;
    }

    if (/saldo|ringkasan|berapa|sisa|pengeluaran|pemasukan/.test(text)) {
      const summary: any = await executeReadTool("get_finance_summary", userId, {});
      return [
        `Saldo kamu saat ini ${formatRupiah(summary.total_balance)}.`,
        `Pemasukan ${formatRupiah(summary.total_income)}, pengeluaran ${formatRupiah(summary.total_expense)}.`,
        `Budget aktif: ${summary.active_budgets}, goal aktif: ${summary.active_goals}.`,
        "Mau lihat detail transaksi atau kategori terbesar?",
      ].join("\n");
    }

    return [
      "Halo! Aku Mate, asisten keuanganmu.",
      "Aku bisa bantu:",
      "• mencatat transaksi (contoh: “makan siang 25rb”)",
      "• membuat goal (contoh: “goal laptop 8 juta”)",
      "• cek budget dan ringkasan keuangan",
      "Mau mulai dari mana?",
    ].join("\n");
  }

  async confirmAction(userId: number, proposalId: number) {
    const proposal = await this.repo.findProposal(proposalId, userId);
    if (!proposal) throw AppError.notFound("Usulan tidak ditemukan.", "PROPOSAL_NOT_FOUND");
    if (proposal.status !== "pending") {
      throw AppError.badRequest("Usulan ini sudah diproses.", "PROPOSAL_NOT_PENDING");
    }
    if (new Date(proposal.expires_at).getTime() < Date.now()) {
      await this.repo.updateProposalStatus(proposal.id, "expired");
      throw AppError.badRequest("Usulan sudah kedaluwarsa.", "PROPOSAL_EXPIRED");
    }

    const payload = proposal.payload;
    let result: unknown;

    switch (proposal.tool_name) {
      case "propose_transaction":
        result = await transactionService.createTransaction({
          user_id: userId,
          type: String(payload.type),
          amount: Number(payload.amount),
          category_id: Number(payload.category_id),
          date: String(payload.date ?? new Date().toISOString().slice(0, 10)),
          note: payload.note ? String(payload.note) : undefined,
        });
        break;

      case "propose_goal":
        result = await goalService.createGoal({
          user_id: userId,
          title: String(payload.title),
          target_amount: Number(payload.target_amount),
          deadline: payload.deadline ? String(payload.deadline) : undefined,
        });
        break;

      case "propose_goal_fund":
        result = await goalService.addFund({
          goal_id: Number(payload.goal_id),
          user_id: userId,
          amount: Number(payload.amount),
          note: payload.note ? String(payload.note) : undefined,
        });
        break;

      case "propose_budget":
        result = await budgetService.createBudget({
          user_id: userId,
          category_id: Number(payload.category_id),
          amount: Number(payload.amount),
          month: Number(payload.month),
          year: Number(payload.year),
        });
        break;

      default:
        throw AppError.badRequest("Jenis usulan tidak dikenal.", "UNKNOWN_PROPOSAL");
    }

    await this.repo.updateProposalStatus(proposal.id, "confirmed");
    return { proposal_id: proposal.id, status: "confirmed", result };
  }

  async cancelAction(userId: number, proposalId: number) {
    const proposal = await this.repo.findProposal(proposalId, userId);
    if (!proposal) throw AppError.notFound("Usulan tidak ditemukan.", "PROPOSAL_NOT_FOUND");
    if (proposal.status === "pending") {
      await this.repo.updateProposalStatus(proposal.id, "cancelled");
    }
    return { proposal_id: proposal.id, status: "cancelled" };
  }

  listConversations(userId: number) {
    return this.repo.listConversations(userId);
  }

  async getConversation(userId: number, conversationId: number) {
    const messages = await this.repo.getMessages(conversationId, userId);
    if (messages.length === 0) {
      throw AppError.notFound("Percakapan tidak ditemukan.", "CONVERSATION_NOT_FOUND");
    }
    return { conversation_id: conversationId, messages };
  }
}

export const aiChatService = new AiChatService();
