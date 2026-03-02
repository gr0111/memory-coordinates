// src/modules/memory/memory.controller.ts
import { Response } from "express";
import {
    listMemories,
    getMemory,
    createMemory,
    updateMemory,
    deleteMemory,
} from "./memory.service";
import { CreateMemoryBody, UpdateMemoryBody } from "./memory.types";
import { AuthRequest } from "../../middleware/authMiddleware";

// GET /memories
export async function listMemoriesHandler(req: AuthRequest, res: Response) {
    try {
        const userId = req.user!.id;

        const memories = await listMemories(userId);
        return res.status(200).json({ memories });
    } catch (err: any) {
        console.error("listMemoriesHandler error:", err);
        return res
            .status(500)
            .json({ message: "기억 목록을 가져오는 중 오류가 발생했습니다." });
    }
}

// GET /memories/:id
export async function getMemoryHandler(req: AuthRequest, res: Response) {
    try {
        const userId = req.user!.id;
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({ message: "유효하지 않은 ID입니다." });
        }

        const memory = await getMemory(userId, id);
        if (!memory) {
            return res.status(404).json({ message: "기억을 찾을 수 없습니다." });
        }

        return res.status(200).json({ memory });
    } catch (err: any) {
        console.error("getMemoryHandler error:", err);
        return res
            .status(500)
            .json({ message: "기억을 가져오는 중 오류가 발생했습니다." });
    }
}

// POST /memories
export async function createMemoryHandler(req: AuthRequest, res: Response) {
    try {
        const userId = req.user!.id;
        const body = req.body as CreateMemoryBody;

        const memory = await createMemory(userId, body);
        return res.status(201).json({ memory });
    } catch (err: any) {
        console.error("createMemoryHandler error:", err);
        return res
            .status(400)
            .json({ message: err.message ?? "기억을 생성하는 데 실패했습니다." });
    }
}

// PUT /memories/:id
export async function updateMemoryHandler(req: AuthRequest, res: Response) {
    try {
        const userId = req.user!.id;
        const id = Number(req.params.id);
        const body = req.body as UpdateMemoryBody;

        if (Number.isNaN(id)) {
            return res.status(400).json({ message: "유효하지 않은 ID입니다." });
        }

        const memory = await updateMemory(userId, id, body);
        return res.status(200).json({ memory });
    } catch (err: any) {
        console.error("updateMemoryHandler error:", err);
        return res
            .status(400)
            .json({ message: err.message ?? "기억을 수정하는 데 실패했습니다." });
    }
}

// DELETE /memories/:id
export async function deleteMemoryHandler(req: AuthRequest, res: Response) {
    try {
        const userId = req.user!.id;
        const id = Number(req.params.id);

        if (Number.isNaN(id)) {
            return res.status(400).json({ message: "유효하지 않은 ID입니다." });
        }

        await deleteMemory(userId, id);
        return res.status(204).send();
    } catch (err: any) {
        console.error("deleteMemoryHandler error:", err);
        return res
            .status(400)
            .json({ message: err.message ?? "기억을 삭제하는 데 실패했습니다." });
    }
}