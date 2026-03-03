// src/components/AuthScreen.tsx
import type { FormEvent } from "react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { TAG_OPTIONS } from "../types/memory";
import { TagIcon } from "./TagIcon";
import { Logo } from "./Logo";
import { Heart, Mail, Lock, User, Sparkles } from "lucide-react";
import { toast } from "sonner";

type Props = {
  onLogin: (email: string, password: string) => Promise<void> | void;
  onRegister: (name: string, email: string, password: string) => Promise<void> | void;
};

export function AuthScreen({ onLogin, onRegister }: Props) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    if (!isLogin && !name.trim()) {
      toast.error("이름을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (isLogin) {
        await onLogin(email.trim(), password);
        toast.success("환영합니다! ✨");
      } else {
        await onRegister(name.trim(), email.trim(), password);
        toast.success(`회원가입이 완료되었습니다. 환영해요, ${name.trim()}님! 🎉`);
      }
    } catch (err: any) {
      let message = "요청 처리에 실패했어요.";

      if (err?.message) {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed?.message) {
            message = parsed.message;
          }
        } catch {
          message = err.message;
        }
      }

      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* 로고 & 타이틀 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <Logo size={80} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">기억의 좌표</h1>
            <p className="text-gray-600 flex items-center justify-center gap-1">
              <Heart className="size-4 text-pink-400 fill-pink-400" />
              기억이 머문 자리
            </p>
          </div>

          {/* 카드 */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-6 space-y-6">
            {/* 탭 */}
            <div className="flex border-b border-gray-200 mb-2 relative">
              <button
                  type="button"
                  className={`flex-1 pb-2 text-sm font-medium ${
                      isLogin ? "text-purple-600" : "text-gray-500"
                  }`}
                  onClick={() => setIsLogin(true)}
              >
                로그인
                {isLogin && (
                    <div className="absolute bottom-0 left-0 right-1/2 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                )}
              </button>
              <button
                  type="button"
                  className={`flex-1 pb-2 text-sm font-medium ${
                      !isLogin ? "text-purple-600" : "text-gray-500"
                  }`}
                  onClick={() => setIsLogin(false)}
              >
                회원가입
                {!isLogin && (
                    <div className="absolute bottom-0 left-1/2 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full" />
                )}
              </button>
            </div>

            {/* 폼 */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                  <div>
                    <Label htmlFor="name" className="text-gray-700">
                      이름
                    </Label>
                    <div className="relative mt-1">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                      <Input
                          id="name"
                          type="text"
                          className="pl-9"
                          placeholder="이름을 입력하세요"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                      />
                    </div>
                  </div>
              )}

              <div>
                <Label htmlFor="email" className="text-gray-700">
                  이메일
                </Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                      id="email"
                      type="email"
                      className="pl-9"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-700">
                  비밀번호
                </Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                  <Input
                      id="password"
                      type="password"
                      className="pl-9"
                      placeholder="비밀번호를 입력하세요"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-2 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg"
              >
                {isSubmitting ? "처리 중..." : isLogin ? "로그인" : "회원가입"}
              </Button>
            </form>

            {/* 하단 안내 텍스트 */}
            <div className="mt-4 text-center text-xs text-gray-500 space-y-2">
              <p>기억들이 기다리고 있어요 ✨</p>
              <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1">
                {TAG_OPTIONS.map((tag) => (
                    <span key={tag.value} className="flex items-center gap-1.5 text-xs">
                  <TagIcon iconName={tag.icon} className="size-3.5" />
                  <span>{tag.label}</span>
                </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-4">
                당신의 특별한 시간들을 지도에 기록하세요
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}