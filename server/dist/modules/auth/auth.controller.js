"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerHandler = registerHandler;
exports.loginHandler = loginHandler;
exports.meHandler = meHandler;
const auth_service_1 = require("./auth.service");
async function registerHandler(req, res) {
    try {
        const body = req.body;
        if (!body.name || !body.email || !body.password) {
            return res
                .status(400)
                .json({ message: "이름, 이메일, 비밀번호는 필수입니다." });
        }
        const result = await (0, auth_service_1.register)(body);
        return res.status(201).json(result);
    }
    catch (err) {
        return res
            .status(400)
            .json({ message: err.message ?? "회원가입에 실패했습니다." });
    }
}
async function loginHandler(req, res) {
    try {
        const body = req.body;
        if (!body.email || !body.password) {
            return res
                .status(400)
                .json({ message: "이메일과 비밀번호를 입력해주세요." });
        }
        const result = await (0, auth_service_1.login)(body);
        return res.status(200).json(result);
    }
    catch (err) {
        return res
            .status(400)
            .json({ message: err.message ?? "로그인에 실패했습니다." });
    }
}
async function meHandler(req, res) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith("Bearer ")) {
            return res.status(401).json({ message: "토큰이 없습니다." });
        }
        const token = authHeader.split(" ")[1];
        const publicUser = await (0, auth_service_1.verifyToken)(token);
        if (!publicUser) {
            return res.status(401).json({ message: "유효하지 않은 토큰입니다." });
        }
        return res.status(200).json({
            user: publicUser,
        });
    }
    catch (err) {
        console.error("meHandler error:", err);
        return res
            .status(500)
            .json({ message: "사용자 정보를 불러오는 중 오류가 발생했습니다." });
    }
}
