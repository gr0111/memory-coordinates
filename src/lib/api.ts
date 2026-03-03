// src/lib/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

function getAuthToken() {
    return localStorage.getItem("memory-map-token");
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
    const token = getAuthToken();
    const headers: HeadersInit = {
        "Content-Type": "application/json",
        ...(options.headers || {}),
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Request failed: ${res.status}`);
    }

    return res.json() as Promise<T>;
}