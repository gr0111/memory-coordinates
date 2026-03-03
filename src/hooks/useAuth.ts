// src/hooks/useAuth.ts
import { useEffect, useState } from "react";
import { api } from "../lib/api";

export type User = {
  id: number;
  name: string;
  email: string;
  profileImage?: string;
  bio?: string;
};

const TOKEN_KEY = "memory-map-token";
const PROFILE_KEY_PREFIX = "memory-map-profile:";

type ServerUser = {
  id: number;
  name: string;
  email: string;
};

type MeResponse = { user: ServerUser };
type AuthResponse = { user: ServerUser; token: string };

function loadProfile(email: string): Pick<User, "name" | "profileImage" | "bio"> {
  try {
    const raw = localStorage.getItem(`${PROFILE_KEY_PREFIX}${email}`);
    if (!raw) return { name: "", profileImage: undefined, bio: undefined };
    const parsed = JSON.parse(raw) as { name?: string; profileImage?: string; bio?: string };
    return {
      name: parsed.name ?? "",
      profileImage: parsed.profileImage,
      bio: parsed.bio,
    };
  } catch {
    return { name: "", profileImage: undefined, bio: undefined };
  }
}

function saveProfile(email: string, profile: { name?: string; profileImage?: string; bio?: string }) {
  try {
    localStorage.setItem(
        `${PROFILE_KEY_PREFIX}${email}`,
        JSON.stringify({
          name: profile.name ?? "",
          profileImage: profile.profileImage,
          bio: profile.bio,
        }),
    );
  } catch (e) {
    console.error("Failed to save profile", e);
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 토큰이 있으면 /auth/me로 복원
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api<MeResponse>("/auth/me");
        const profile = loadProfile(res.user.email);
        setUser({
          id: res.user.id,
          email: res.user.email,
          name: profile.name || res.user.name,
          profileImage: profile.profileImage,
          bio: profile.bio,
        });
      } catch (e) {
        console.error("Failed to restore session", e);
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    void init();
  }, []);

  // 로그인
  const login = async (email: string, password: string) => {
    const { user: serverUser, token } = await api<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    localStorage.setItem(TOKEN_KEY, token);

    const profile = loadProfile(serverUser.email);
    setUser({
      id: serverUser.id,
      email: serverUser.email,
      name: profile.name || serverUser.name,
      profileImage: profile.profileImage,
      bio: profile.bio,
    });
  };

  // 회원가입
  const register = async (name: string, email: string, password: string) => {
    const { user: serverUser, token } = await api<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    });
    localStorage.setItem(TOKEN_KEY, token);

    // 초기 프로필 저장
    saveProfile(email, { name });

    setUser({
      id: serverUser.id,
      email: serverUser.email,
      name,
      profileImage: undefined,
      bio: undefined,
    });
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  // 이름/프로필/소개는 로컬에서만 관리 (백엔드 라우트 없음)
  const updateProfile = (updates: Partial<Omit<User, "id" | "email">>) => {
    setUser((prev) => {
      if (!prev) return prev;

      const next: User = {
        ...prev,
        ...updates,
      };

      saveProfile(prev.email, {
        name: next.name,
        profileImage: next.profileImage,
        bio: next.bio,
      });

      return next;
    });
  };

  return { user, isLoading, login, register, logout, updateProfile };
}