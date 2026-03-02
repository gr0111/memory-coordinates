"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMemories = listMemories;
exports.getMemory = getMemory;
exports.createMemory = createMemory;
exports.updateMemory = updateMemory;
exports.deleteMemory = deleteMemory;
// server/src/modules/memory/memory.service.ts
const db_1 = __importDefault(require("../../config/db"));
function toDto(memory) {
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
async function listMemories(userId) {
    const memories = await db_1.default.memory.findMany({
        where: { userId },
        orderBy: { date: "desc" },
    });
    return memories.map(toDto);
}
async function getMemory(userId, id) {
    const memory = await db_1.default.memory.findFirst({
        where: { id, userId },
    });
    return memory ? toDto(memory) : null;
}
async function createMemory(userId, body) {
    const date = new Date(body.date);
    if (isNaN(date.getTime())) {
        throw new Error("유효한 날짜를 입력해주세요.");
    }
    // body.tags 가 옵션일 수 있다고 가정
    const tagsString = body.tags && body.tags.length > 0 ? body.tags.join(",") : null;
    const memory = await db_1.default.memory.create({
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
async function updateMemory(userId, id, body) {
    const existing = await db_1.default.memory.findFirst({
        where: { id, userId },
    });
    if (!existing) {
        throw new Error("기억을 찾을 수 없습니다.");
    }
    const date = body.date ? new Date(body.date) : existing.date;
    if (body.date && isNaN(date.getTime())) {
        throw new Error("유효한 날짜를 입력해주세요.");
    }
    const tagsString = body.tags && body.tags.length > 0
        ? body.tags.join(",")
        : existing.tags;
    const updated = await db_1.default.memory.update({
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
async function deleteMemory(userId, id) {
    const existing = await db_1.default.memory.findFirst({
        where: { id, userId },
    });
    if (!existing) {
        throw new Error("기억을 찾을 수 없습니다.");
    }
    await db_1.default.memory.delete({
        where: { id },
    });
}
