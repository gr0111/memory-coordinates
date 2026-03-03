// src/hooks/useMemories.ts
import { useEffect, useState } from "react";
import type { Memory } from "../types/memory";
import { api } from "../lib/api";

// 서버가 주는 DTO 타입 (memory.service.ts 기준)
type ServerMemory = {
  id: number;
  title: string;
  memo?: string;
  date: string;
  tags: string[];
  lat: number;
  lng: number;
  addressText?: string;
  fullAddress?: string;
  createdAt: string;
  updatedAt: string;
};

type ListMemoriesResponse = { memories: ServerMemory[] };
type MemoryResponse = { memory: ServerMemory };

function fromServer(memory: ServerMemory): Memory {
  return {
    id: String(memory.id),
    title: memory.title,
    description: memory.memo,
    date: memory.date,
    tags: memory.tags,
    lat: memory.lat,
    lng: memory.lng,
    address: memory.fullAddress ?? memory.addressText,
    // placeName / shortLocation / photo 는 서버에 없음
    placeName: undefined,
    shortLocation: undefined,
    photo: undefined,
    createdAt: memory.createdAt,
  };
}

function toCreateBody(m: Omit<Memory, "id" | "createdAt">) {
  return {
    title: m.title,
    memo: m.description,
    date: m.date,
    tags: m.tags,
    lat: m.lat,
    lng: m.lng,
    addressText: m.address,
    fullAddress: m.address,
  };
}

function toUpdateBody(m: Partial<Memory>) {
  const body: any = {};

  if (m.title !== undefined) body.title = m.title;
  if (m.description !== undefined) body.memo = m.description;
  if (m.date !== undefined) body.date = m.date;
  if (m.tags !== undefined) body.tags = m.tags;
  if (m.lat !== undefined) body.lat = m.lat;
  if (m.lng !== undefined) body.lng = m.lng;
  if (m.address !== undefined) {
    body.addressText = m.address;
    body.fullAddress = m.address;
  }

  return body;
}

export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 1) 최초 로드: 서버에서 가져오기
  useEffect(() => {
    const fetchMemories = async () => {
      try {
        const res = await api<ListMemoriesResponse>("/memories");
        setMemories(res.memories.map(fromServer));
      } catch (e) {
        console.error("Failed to fetch memories:", e);
      } finally {
        setIsLoading(false);
      }
    };

    void fetchMemories();
  }, []);

  // 2) 새 기억 추가
  const addMemory = async (m: Omit<Memory, "id" | "createdAt">): Promise<Memory> => {
    const res = await api<MemoryResponse>("/memories", {
      method: "POST",
      body: JSON.stringify(toCreateBody(m)),
    });

    const newMemory = fromServer(res.memory);
    setMemories((prev) => [newMemory, ...prev]);
    return newMemory;
  };

  // 3) 기존 기억 수정
  const updateMemory = async (id: string, data: Partial<Memory>) => {
    const body = toUpdateBody(data);

    const res = await api<MemoryResponse>(`/memories/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });

    const updated = fromServer(res.memory);
    setMemories((prev) => prev.map((m) => (m.id === id ? updated : m)));
  };

  // 4) 기억 삭제
  const deleteMemory = async (id: string) => {
    await api<{}>(`/memories/${id}`, { method: "DELETE" });
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  return { memories, isLoading, addMemory, updateMemory, deleteMemory };
}