// src/modules/auth/auth.controller.ts
import { Request, Response } from "express";
import { login, register, verifyToken } from "./auth.service";
import { LoginBody, RegisterBody } from "./auth.types";

export async function registerHandler(req: Request, res: Response) {
    try {
        const body = req.body as RegisterBody;

        if (!body.name || !body.email || !body.password) {
            return res
                .status(400)
                .json({ message: "이름, 이메일, 비밀번호는 필수입니다." });
        }

        const result = await register(body);
        return res.status(201).json(result);
    } catch (err: any) {
        return res
            .status(400)
            .json({ message: err.message ?? "회원가입에 실패했습니다." });
    }
}

export async function loginHandler(req: Request, res: Response) {
    try {
        const body = req.body as LoginBody;

        if (!body.email || !body.password) {
            return res
                .status(400)
                .json({ message: "이메일과 비밀번호를 입력해주세요." });
        }

        const result = await login(body);
        return res.status(200).json(result);
    } catch (err: any) {
        return res
            .status(400)
            .json({ message: err.message ?? "로그인에 실패했습니다." });
    }
}

export async function meHandler(req: Request, res: Response) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "토큰이 없습니다." });
        }

        const token = authHeader.split(" ")[1];
        const publicUser = await verifyToken(token);

        if (!publicUser) {
            return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
        }

        return res.status(200).json({
            user: publicUser,
        });
    } catch (err: any) {
        console.error("meHandler error:", err);
        return res
            .status(500)
            .json({ message: "사용자 정보를 불러오는 중 오류가 발생했습니다." });
    }
}