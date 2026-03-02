// server/src/middleware/authMiddleware.ts

import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../modules/auth/auth.service";

export interface AuthRequest extends Request {
    user?: {
        id: number;
        email?: string;
    };
}

export const authMiddleware = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = await verifyToken(token);
        // decoded가 string일 수도, 객체일 수도 있다고 가정하고 처리
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }

        let userId: number;
        let email: string | undefined;

        if (typeof decoded === "string" || typeof decoded === "number") {
            // 예: 토큰 안에 userId만 들어있을 때
            userId = Number(decoded);
        } else {
            // 예: { id, email } 형태로 들어있을 때
            const d: any = decoded;
            userId = Number(d.id);
            email = d.email;
        }

        if (!userId || Number.isNaN(userId)) {
            return res.status(401).json({ message: "Invalid token payload" });
        }

        req.user = { id: userId, email };
        next();
    } catch (error) {
        console.error("authMiddleware error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};