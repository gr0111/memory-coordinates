// server/src/modules/memory/memory.service.ts
import prisma from "../../config/db";
import { CreateMemoryBody, MemoryDto, UpdateMemoryBody } from "./memory.types";
import { Memory } from "@prisma/client";

function toDto(memory: Memory): MemoryDto {
    return {
        id: memory.id,
        title: memory.title,
        memo: memory.memo ?? undefined,
        // Prisma DateTime -> ISO string
        date: memory.date.toISOString(),
        // "tag1,tag2" -> ["tag1","tag2"]
        tags: memory.tags ? memory.tags.split(",").filter(Boolean) : [],
        lat: memory.lat,
        lng: memory.lng,
        addressText: memory.addressText ?? undefined,
        fullAddress: memory.fullAddress ?? undefined,
        createdAt: memory.createdAt.toISOString(),
        updatedAt: memory.updatedAt.toISOString(),
    };
}

export async function listMemories(userId: number): Promise<MemoryDto[]> {
    const memories = await prisma.memory.findMany({
        where: { userId },
        orderBy: { date: "desc" },
    });

    return memories.map(toDto);
}

export async function getMemory(
    userId: number,
    id: number
): Promise<MemoryDto | null> {
    const memory = await prisma.memory.findFirst({
        where: { id, userId },
    });

    return memory ? toDto(memory) : null;
}

export async function createMemory(
    userId: number,
    body: CreateMemoryBody
): Promise<MemoryDto> {
    const date = new Date(body.date);
    if (isNaN(date.getTime())) {
        throw new Error("유효한 날짜를 입력해주세요.");
    }

    // body.tags 가 옵션일 수 있다고 가정
    const tagsString =
        body.tags && body.tags.length > 0 ? body.tags.join(",") : null;

    const memory = await prisma.memory.create({
        data: {
            title: body.title,
            memo: body.memo ?? null,
            date,
            tags: tagsString,
            lat: body.lat,
            lng: body.lng,
            addressText: body.addressText ?? null,
            fullAddress: body.fullAddress ?? null,
            userId,
        },
    });

    return toDto(memory);
}

export async function updateMemory(
    userId: number,
    id: number,
    body: UpdateMemoryBody
): Promise<MemoryDto> {
    const existing = await prisma.memory.findFirst({
        where: { id, userId },
    });

    if (!existing) {
        throw new Error("기억을 찾을 수 없습니다.");
    }

    const date = body.date ? new Date(body.date) : existing.date;
    if (body.date && isNaN(date.getTime())) {
        throw new Error("유효한 날짜를 입력해주세요.");
    }

    const tagsString =
        body.tags && body.tags.length > 0
            ? body.tags.join(",")
            : existing.tags;

    const updated = await prisma.memory.update({
        where: { id },
        data: {
            title: body.title ?? existing.title,
            memo: body.memo ?? existing.memo,
            date,
            tags: tagsString,
            lat: body.lat ?? existing.lat,
            lng: body.lng ?? existing.lng,
            addressText: body.addressText ?? existing.addressText,
            fullAddress: body.fullAddress ?? existing.fullAddress,
        },
    });

    return toDto(updated);
}

export async function deleteMemory(
    userId: number,
    id: number
): Promise<void> {
    const existing = await prisma.memory.findFirst({
        where: { id, userId },
    });

    if (!existing) {
        throw new Error("기억을 찾을 수 없습니다.");
    }

    await prisma.memory.delete({
        where: { id },
    });
}