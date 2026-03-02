// src/modules/memory/memory.routes.ts
import { Router } from "express";
import { authMiddleware } from "../../middleware/authMiddleware";
import {
    listMemoriesHandler,
    getMemoryHandler,
    createMemoryHandler,
    updateMemoryHandler,
    deleteMemoryHandler,
} from "./memory.controller";

const router = Router();

// 이 라우터 이하 모든 라우트에 인증 적용
router.use(authMiddleware);

router.get("/", listMemoriesHandler);
router.get("/:id", getMemoryHandler);
router.post("/", createMemoryHandler);
router.put("/:id", updateMemoryHandler);
router.delete("/:id", deleteMemoryHandler);

export default router;