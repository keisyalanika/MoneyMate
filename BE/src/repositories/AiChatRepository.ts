import { Prisma } from "../generated/prisma/client";
import { BaseRepository } from "./base/BaseRepository";

export interface ConversationSummary {
  id: number;
  title: string | null;
  updated_at: Date;
}

export interface ChatMessageRecord {
  id: number;
  role: string;
  content: string;
  tool_name: string | null;
  tool_payload: unknown;
  created_at: Date;
}

export interface ProposalRecord {
  id: number;
  tool_name: string;
  payload: Record<string, unknown>;
  status: string;
  created_at: Date;
  expires_at: Date;
}

export class AiChatRepository extends BaseRepository {
  async getOrCreateConversation(
    userId: number,
    conversationId?: number,
    title?: string
  ): Promise<number> {
    if (conversationId) {
      const existing = await this.db.aiConversation.findFirst({
        where: { id: conversationId, userId },
      });
      if (existing) {
        await this.db.aiConversation.update({
          where: { id: existing.id },
          data: { updatedAt: new Date() },
        });
        return existing.id;
      }
    }

    const created = await this.db.aiConversation.create({
      data: { userId, title: title?.slice(0, 150) ?? "Percakapan baru" },
    });
    return created.id;
  }

  async addMessage(
    conversationId: number,
    role: "user" | "assistant" | "tool",
    content: string,
    toolName?: string,
    toolPayload?: unknown
  ) {
    await this.db.aiMessage.create({
      data: {
        conversationId,
        role,
        content,
        toolName: toolName ?? null,
        toolPayload: toolPayload === undefined ? Prisma.JsonNull : (toolPayload as Prisma.InputJsonValue),
      },
    });
  }

  async listConversations(userId: number): Promise<ConversationSummary[]> {
    const rows = await this.db.aiConversation.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
      take: 30,
    });
    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      updated_at: row.updatedAt,
    }));
  }

  async getMessages(conversationId: number, userId: number): Promise<ChatMessageRecord[]> {
    const conversation = await this.db.aiConversation.findFirst({
      where: { id: conversationId, userId },
    });
    if (!conversation) return [];

    const rows = await this.db.aiMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "asc" },
      take: 200,
    });

    return rows.map((row) => ({
      id: row.id,
      role: row.role,
      content: row.content,
      tool_name: row.toolName,
      tool_payload: row.toolPayload,
      created_at: row.createdAt,
    }));
  }

  async recentMessages(conversationId: number, limit = 12) {
    const rows = await this.db.aiMessage.findMany({
      where: { conversationId },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return rows.reverse();
  }

  async createProposal(
    userId: number,
    toolName: string,
    payload: Record<string, unknown>,
    ttlMinutes = 15
  ): Promise<ProposalRecord> {
    const row = await this.db.aiActionProposal.create({
      data: {
        userId,
        toolName,
        payload: payload as Prisma.InputJsonValue,
        status: "pending",
        expiresAt: new Date(Date.now() + ttlMinutes * 60 * 1000),
      },
    });

    return {
      id: row.id,
      tool_name: row.toolName,
      payload: row.payload as Record<string, unknown>,
      status: row.status,
      created_at: row.createdAt,
      expires_at: row.expiresAt,
    };
  }

  async findProposal(id: number, userId: number): Promise<ProposalRecord | null> {
    const row = await this.db.aiActionProposal.findFirst({ where: { id, userId } });
    if (!row) return null;
    return {
      id: row.id,
      tool_name: row.toolName,
      payload: row.payload as Record<string, unknown>,
      status: row.status,
      created_at: row.createdAt,
      expires_at: row.expiresAt,
    };
  }

  async updateProposalStatus(id: number, status: string) {
    await this.db.aiActionProposal.update({ where: { id }, data: { status } });
  }

  async logUsage(data: {
    userId: number;
    model: string;
    promptTokens?: number;
    completionTokens?: number;
    latencyMs?: number;
  }) {
    await this.db.aiUsageLog.create({
      data: {
        userId: data.userId,
        model: data.model,
        promptTokens: data.promptTokens ?? null,
        completionTokens: data.completionTokens ?? null,
        latencyMs: data.latencyMs ?? null,
      },
    });
  }
}

export const aiChatRepository = new AiChatRepository();
