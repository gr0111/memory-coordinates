// src/hooks/useAuth.ts
import { useState, useEffect } from "react";

export type User = {
  email: string;
  name: string;
  profileImage?: string;
  bio?: string;
  isNewUser?: boolean;
};

const CURRENT_USER_KEY = "memory-map-current-user";
const USERS_KEY = "memory-map-users";

/**
 * localStorage 기반 간단 로그인 훅
 * - users: { [email]: { password, name } }
 * - current user: { email, name, profileImage?, bio?, isNewUser? }
 */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 앱 시작 시 localStorage에서 현재 사용자 복원
  useEffect(() => {
    try {
      const currentUser = localStorage.getItem(CURRENT_USER_KEY);
      if (currentUser) {
        setUser(JSON.parse(currentUser));
      }
    } catch (e) {
      console.error("Failed to parse current user", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 로그인: AuthScreen에서 이메일/이름 넘겨줌
  const login = (email: string, name: string, isNewUser: boolean = false) => {
    const userData: User = { email, name, isNewUser };
    setUser(userData);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateProfile = (updates: Partial<Omit<User, "email">>) => {
    if (!user) return;

    const updatedUser: User = { ...user, ...updates, isNewUser: false };
    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));

    // users “DB”도 같이 갱신
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || "{}");
      if (users[user.email]) {
        users[user.email] = {
          ...users[user.email],
          name: updatedUser.name,
          // 비밀번호는 그대로 두고 이름/프로필만 갱신
        };
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    } catch (e) {
      console.error("Failed to update users DB", e);
    }
  };

  return { user, isLoading, login, logout, updateProfile };
}