"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.verifyToken = verifyToken;
// server/src/modules/auth/auth.service.ts
const db_1 = __importDefault(require("../../config/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
function toPublicUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
    };
}
async function register(body) {
    const { name, email, password } = body;
    const existing = await db_1.default.user.findUnique({
        where: { email },
    });
    if (existing) {
        throw new Error("이미 사용 중인 이메일입니다.");
    }
    const passwordHash = await bcrypt_1.default.hash(password, 10);
    const newUser = await db_1.default.user.create({
        data: {
            name,
            email,
            password: passwordHash,
        },
    });
    const publicUser = toPublicUser(newUser);
    const token = jsonwebtoken_1.default.sign({ id: publicUser.id, email: publicUser.email }, JWT_SECRET, { expiresIn: "7d" });
    return { user: publicUser, token };
}
async function login(body) {
    const { email, password } = body;
    const user = await db_1.default.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
    const isValid = await bcrypt_1.default.compare(password, user.password);
    if (!isValid) {
        throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    }
    const publicUser = toPublicUser(user);
    const token = jsonwebtoken_1.default.sign({ id: publicUser.id, email: publicUser.email }, JWT_SECRET, { expiresIn: "7d" });
    return { user: publicUser, token };
}
async function verifyToken(token) {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        const user = await db_1.default.user.findUnique({
            where: { id: decoded.id },
        });
        if (!user)
            return null;
        return toPublicUser(user);
    }
    catch {
        return null;
    }
}
