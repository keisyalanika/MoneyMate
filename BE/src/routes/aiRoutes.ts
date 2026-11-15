import { Router } from "express";
import { aiController } from "../controllers/AiController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.use(protect);

router.post("/chat", aiController.chat);
router.get("/conversations", aiController.conversations);
router.get("/conversations/:id", aiController.conversation);
router.post("/actions/:id/confirm", aiController.confirmAction);
router.post("/actions/:id/cancel", aiController.cancelAction);

export default router;
