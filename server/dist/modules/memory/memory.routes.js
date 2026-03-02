"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/memory/memory.routes.ts
const express_1 = require("express");
const authMiddleware_1 = require("../../middleware/authMiddleware");
const memory_controller_1 = require("./memory.controller");
const router = (0, express_1.Router)();
// 이 라우터 이하 모든 라우트에 인증 적용
router.use(authMiddleware_1.authMiddleware);
router.get("/", memory_controller_1.listMemoriesHandler);
router.get("/:id", memory_controller_1.getMemoryHandler);
router.post("/", memory_controller_1.createMemoryHandler);
router.put("/:id", memory_controller_1.updateMemoryHandler);
router.delete("/:id", memory_controller_1.deleteMemoryHandler);
exports.default = router;
