// server/src/modules/auth/auth.service.ts
import prisma from "../../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@prisma/client";
import { AuthResult, LoginBody, PublicUser, RegisterBody } from "./auth.types";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";

function toPublicUser(user: User): PublicUser {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
    };
}

export async function register(body: RegisterBody): Promise<AuthResult> {
    const { name, email, password } = body;

    const existing = await prisma.user.findUnique({
        where: { email },
    });

    if (existing) {
        throw new Error("이미 사용 중인 이메일입니다.");
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: passwordHash,
        },
    });

    const publicUser = toPublicUser(newUser);

    const token = jwt.sign(
        { id: publicUser.id, email: publicUser.email },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    return { user: publicUser, token };
}

export async function login(body: LoginBody): Promise<AuthResult> {
    const { email, password } = body;

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
    }

    const publicUser = toPublicUser(user);

    const token = jwt.sign(
        { id: publicUser.id, email: publicUser.email },
        JWT_SECRET,
        { expiresIn: "7d" }
    );

    return { user: publicUser, token };
}

export async function verifyToken(
    token: string
): Promise<PublicUser | null> {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: number;
            email: string;
            iat: number;
            exp: number;
        };

        const user = await prisma.user.findUnique({
            where: { id: decoded.id },
        });

        if (!user) return null;

        return toPublicUser(user);
    } catch {
        return null;
    }
}