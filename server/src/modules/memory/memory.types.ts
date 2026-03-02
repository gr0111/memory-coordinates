// server/src/modules/memory/memory.types.ts

// 클라이언트에서 보내는 생성용 바디
export interface CreateMemoryBody {
    title: string;
    memo?: string;
    date: string;          // ISO 또는 'YYYY-MM-DD' 문자열
    tags: string[];        // ["여행", "맛집"] 이런 식
    lat: number;
    lng: number;
    addressText?: string;
    fullAddress?: string;
}

// 수정용 바디 - 전부 optional
export interface UpdateMemoryBody {
    title?: string;
    memo?: string;
    date?: string;
    tags?: string[];
    lat?: number;
    lng?: number;
    addressText?: string;
    fullAddress?: string;
}

// 서버에서 클라이언트로 내려주는 DTO
export interface MemoryDto {
    id: number;
    title: string;
    memo?: string;
    date: string;          // ISO string
    tags: string[];        // 분리된 태그 배열

    lat: number;
    lng: number;
    addressText?: string;
    fullAddress?: string;

    createdAt: string;
    updatedAt: string;
}