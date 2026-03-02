"use strict";
// server/src/middleware/authMiddleware.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const auth_service_1 = require("../modules/auth/auth.service");
const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization header missing" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = await (0, auth_service_1.verifyToken)(token);
        // decoded가 string일 수도, 객체일 수도 있다고 가정하고 처리
        if (!decoded) {
            return res.status(401).json({ message: "Invalid token" });
        }
        let userId;
        let email;
        if (typeof decoded === "string" || typeof decoded === "number") {
            // 예: 토큰 안에 userId만 들어있을 때
            userId = Number(decoded);
        }
        else {
            // 예: { id, email } 형태로 들어있을 때
            const d = decoded;
            userId = Number(d.id);
            email = d.email;
        }
        if (!userId || Number.isNaN(userId)) {
            return res.status(401).json({ message: "Invalid token payload" });
        }
        req.user = { id: userId, email };
        next();
    }
    catch (error) {
        console.error("authMiddleware error:", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.authMiddleware = authMiddleware;
