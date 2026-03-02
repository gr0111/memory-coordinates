// src/app.ts
import express from "express";
import cors from "cors";
import authRouter from "./modules/auth/auth.routes";
import memoryRouter from "./modules/memory/memory.routes";

const app = express();

app.use(cors());
app.use(express.json());

// ✅ 여기 경로가 "/auth"인지 꼭 확인
app.use("/auth", authRouter);

// 메모리 API
app.use("/memories", memoryRouter);

export default app;