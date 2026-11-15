import { Response } from "express";
import { aiChatService } from "../ai/AiChatService";
import { AuthRequest } from "../middleware/authMiddleware";
import { asyncHandler } from "../middleware/asyncHandler";
import { AppError } from "../errors/AppError";
import { AppBaseResponse } from "../responses/AppBaseResponse";

export class AiController {
  constructor(private readonly ai = aiChatService) {}

  chat = asyncHandler(async (req: AuthRequest, res: Response) => {
    const { message, conversation_id } = req.body ?? {};
    if (!message || typeof message !== "string") {
      throw AppError.badRequest("message wajib diisi.", "VALIDATION_ERROR");
    }

    const result = await this.ai.chat(req.user!.id, {
      message,
      conversationId: conversation_id ? Number(conversation_id) : undefined,
    });

    return AppBaseResponse.success(res, result);
  });

  conversations = asyncHandler(async (req: AuthRequest, res: Response) => {
    const list = await this.ai.listConversations(req.user!.id);
    return AppBaseResponse.success(res, list);
  });

  conversation = asyncHandler(async (req: AuthRequest, res: Response) => {
    const data = await this.ai.getConversation(req.user!.id, Number(req.params.id));
    return AppBaseResponse.success(res, data);
  });

  confirmAction = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await this.ai.confirmAction(req.user!.id, Number(req.params.id));
    return AppBaseResponse.success(res, result, "Aksi berhasil dikonfirmasi");
  });

  cancelAction = asyncHandler(async (req: AuthRequest, res: Response) => {
    const result = await this.ai.cancelAction(req.user!.id, Number(req.params.id));
    return AppBaseResponse.success(res, result, "Usulan dibatalkan");
  });
}

export const aiController = new AiController();
