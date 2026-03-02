"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const memory_routes_1 = __importDefault(require("./modules/memory/memory.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// ✅ 여기 경로가 "/auth"인지 꼭 확인
app.use("/auth", auth_routes_1.default);
// 메모리 API
app.use("/memories", memory_routes_1.default);
exports.default = app;
