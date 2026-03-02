"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listMemoriesHandler = listMemoriesHandler;
exports.getMemoryHandler = getMemoryHandler;
exports.createMemoryHandler = createMemoryHandler;
exports.updateMemoryHandler = updateMemoryHandler;
exports.deleteMemoryHandler = deleteMemoryHandler;
const memory_service_1 = require("./memory.service");
// GET /memories
async function listMemoriesHandler(req, res) {
    try {
        const userId = req.user.id;
        const memories = await (0, memory_service_1.listMemories)(userId);
        return res.status(200).json({ memories });
    }
    catch (err) {
        console.error("listMemoriesHandler error:", err);
        return res
            .status(500)
            .json({ message: "기억 목록을 가져오는 중 오류가 발생했습니다." });
    }
}
// GET /memories/:id
async function getMemoryHandler(req, res) {
    try {
        const userId = req.user.id;
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ message: "유효하지 않은 ID입니다." });
        }
        const memory = await (0, memory_service_1.getMemory)(userId, id);
        if (!memory) {
            return res.status(404).json({ message: "기억을 찾을 수 없습니다." });
        }
        return res.status(200).json({ memory });
    }
    catch (err) {
        console.error("getMemoryHandler error:", err);
        return res
            .status(500)
            .json({ message: "기억을 가져오는 중 오류가 발생했습니다." });
    }
}
// POST /memories
async function createMemoryHandler(req, res) {
    try {
        const userId = req.user.id;
        const body = req.body;
        const memory = await (0, memory_service_1.createMemory)(userId, body);
        return res.status(201).json({ memory });
    }
    catch (err) {
        console.error("createMemoryHandler error:", err);
        return res
            .status(400)
            .json({ message: err.message ?? "기억을 생성하는 데 실패했습니다." });
    }
}
// PUT /memories/:id
async function updateMemoryHandler(req, res) {
    try {
        const userId = req.user.id;
        const id = Number(req.params.id);
        const body = req.body;
        if (Number.isNaN(id)) {
            return res.status(400).json({ message: "유효하지 않은 ID입니다." });
        }
        const memory = await (0, memory_service_1.updateMemory)(userId, id, body);
        return res.status(200).json({ memory });
    }
    catch (err) {
        console.error("updateMemoryHandler error:", err);
        return res
            .status(400)
            .json({ message: err.message ?? "기억을 수정하는 데 실패했습니다." });
    }
}
// DELETE /memories/:id
async function deleteMemoryHandler(req, res) {
    try {
        const userId = req.user.id;
        const id = Number(req.params.id);
        if (Number.isNaN(id)) {
            return res.status(400).json({ message: "유효하지 않은 ID입니다." });
        }
        await (0, memory_service_1.deleteMemory)(userId, id);
        return res.status(204).send();
    }
    catch (err) {
        console.error("deleteMemoryHandler error:", err);
        return res
            .status(400)
            .json({ message: err.message ?? "기억을 삭제하는 데 실패했습니다." });
    }
}
