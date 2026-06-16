// src/services/auth.service.ts

export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
};

export type AdminLoginPayload = {
    username: string;
    password: string;
};

export type AdminUser = {
    id?: string;
    username?: string;
    email?: string;
    name?: string;
    role?: string;

    [key: string]: unknown;
};

export type AdminLoginData = {
    accessToken?: string;
    token?: string;
    refreshToken?: string;
    user?: AdminUser;
    admin?: AdminUser;

    [key: string]: unknown;
};

const API_URL = "/api/auth";

function getHeaders(hasJsonBody = false): HeadersInit {
    const headers: Record<string, string> = {
        Accept: "application/json",
    };

    if (hasJsonBody) {
        headers["Content-Type"] = "application/json";
    }

    return headers;
}

async function handleResponse<T>(response: Response): Promise<T> {
    const text = await response.text();

    if (!response.ok) {
        let message = `API request failed: ${response.status}`;

        if (text) {
            try {
                const body = JSON.parse(text) as {
                    message?: string | string[];
                    error?: string;
                };

                if (Array.isArray(body.message)) {
                    message = body.message.join(", ");
                } else {
                    message = body.message ?? body.error ?? message;
                }
            } catch {
                message = text;
            }
        }

        throw new Error(message);
    }

    if (response.status === 204 || !text) {
        return undefined as T;
    }

    return JSON.parse(text) as T;
}

function isApiResponse<T>(value: unknown): value is ApiResponse<T> {
    return (
        typeof value === "object" &&
        value !== null &&
        "success" in value &&
        "message" in value &&
        "data" in value
    );
}

function unwrapApiResponse<T>(value: T | ApiResponse<T>): T {
    if (isApiResponse<T>(value)) {
        return value.data;
    }

    return value as T;
}

async function request<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, options);

    return handleResponse<T>(response);
}

export async function adminLogin(
    payload: AdminLoginPayload,
): Promise<AdminLoginData> {
    const data = await request<unknown>("/admin-login", {
        method: "POST",
        headers: getHeaders(true),
        body: JSON.stringify(payload),
        cache: "no-store",
        credentials: "same-origin",
    });

    return unwrapApiResponse<AdminLoginData>(data as ApiResponse<AdminLoginData>);
}

export function getAdminToken(data: AdminLoginData): string {
    return String(data.accessToken ?? data.token ?? "");
}
