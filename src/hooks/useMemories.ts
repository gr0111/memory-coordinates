// src/hooks/useMemories.ts
import { useState, useEffect } from "react";
import type { Memory } from "../types/memory";

const STORAGE_KEY = "memory-map-memories";

export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([]);

  // 1) 처음 마운트될 때 localStorage에서 불러오기
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return;

      const parsed: Memory[] = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        setMemories(parsed);
      }
    } catch (error) {
      console.error("Failed to parse memories from localStorage:", error);
    }
  }, []);

  // 2) memories 변경될 때마다 localStorage에 저장
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
    } catch (error) {
      console.error("Failed to save memories to localStorage:", error);
    }
  }, [memories]);

  // 3) 새 기억 추가
  const addMemory = (m: Omit<Memory, "id" | "createdAt">): Memory => {
    const newMemory: Memory = {
      ...m,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };

    setMemories((prev) => [newMemory, ...prev]);
    return newMemory;
  };

  // 4) 기존 기억 수정
  const updateMemory = (id: string, data: Partial<Memory>) => {
    setMemories((prev) =>
        prev.map((m) => (m.id === id ? { ...m, ...data } : m)),
    );
  };

  // 5) 기억 삭제
  const deleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  return { memories, addMemory, updateMemory, deleteMemory };
}