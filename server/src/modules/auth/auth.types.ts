// server/src/modules/auth/auth.types.ts
export interface RegisterBody {
    name: string;
    email: string;
    password: string;
}

export interface LoginBody {
    email: string;
    password: string;
}

export interface PublicUser {
    id: number;
    name: string;
    email: string;
}

export interface AuthResult {
    user: PublicUser;
    token: string;
}