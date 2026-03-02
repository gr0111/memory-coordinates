// src/modules/auth/auth.routes.ts
import { Router } from "express";
import {
    loginHandler,
    meHandler,
    registerHandler,
} from "./auth.controller";

const router = Router();

// ✅ POST /auth/register
router.post("/register", registerHandler);

// ✅ POST /auth/login
router.post("/login", loginHandler);

// ✅ GET /auth/me
router.get("/me", meHandler);

export default router;