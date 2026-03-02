"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/modules/auth/auth.routes.ts
const express_1 = require("express");
const auth_controller_1 = require("./auth.controller");
const router = (0, express_1.Router)();
// ✅ POST /auth/register
router.post("/register", auth_controller_1.registerHandler);
// ✅ POST /auth/login
router.post("/login", auth_controller_1.loginHandler);
// ✅ GET /auth/me
router.get("/me", auth_controller_1.meHandler);
exports.default = router;
