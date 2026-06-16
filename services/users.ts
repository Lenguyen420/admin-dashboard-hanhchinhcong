export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
  };
  
  export type UserQuery = {
    page?: number;
    size?: number;
    keyword?: string;
  };
  
  export type PaginatedResponse<T> = {
    data?: T[];
    items?: T[];
    users?: T[];
    total?: number;
    page?: number;
    size?: number;
    totalPages?: number;
    pagination?: {
      page?: number;
      size?: number;
      total?: number;
      totalPages?: number;
    };
  };
  
  export type User = {
    id: string;
    username: string;
    zalo_id: string;
    avatar?: string;
    image?: string;
    url?: string;
    role?: string;
    createdAt?: string;
    updatedAt?: string;
  
    [key: string]: unknown;
  };
  
  export type CreateUserPayload = {
    username: string;
    zalo_id: string;
    avatar?: string;
    image?: string;
    url?: string;
    role?: string;
    password?: string;
  
    [key: string]: unknown;
  };
  
  
  export type UpdateUserPayload = Partial<CreateUserPayload>;
  
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
    "";
  
  const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "";
  
  const RESOURCE = "users";
  
  if (!API_URL) {
    throw new Error(
      "Thiếu NEXT_PUBLIC_API_URL hoặc NEXT_PUBLIC_API_BASE_URL. Hãy kiểm tra file .env.local và khởi động lại FE.",
    );
  }
  
  function getHeaders(hasJsonBody = false): HeadersInit {
    const headers: Record<string, string> = {
      Accept: "application/json",
    };
  
    if (ADMIN_KEY) {
      headers["x-admin-key"] = ADMIN_KEY;
    }
  
    if (hasJsonBody) {
      headers["Content-Type"] = "application/json";
    }
  
    return headers;
  }
  
  function buildQueryString(query?: UserQuery): string {
    if (!query) {
      return "";
    }
  
    const params = new URLSearchParams();
  
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      }
    });
  
    const queryString = params.toString();
  
    return queryString ? `?${queryString}` : "";
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
  
  function normalizeListResponse<T>(value: unknown): T[] {
    const unwrapped = unwrapApiResponse<unknown>(value as ApiResponse<unknown>);
  
    if (Array.isArray(unwrapped)) {
      return unwrapped as T[];
    }
  
    if (typeof unwrapped === "object" && unwrapped !== null) {
      const body = unwrapped as PaginatedResponse<T>;
  
      const items = body.items ?? body.users ?? body.data ?? [];
  
      return Array.isArray(items) ? items : [];
    }
  
    return [];
  }
  
  function normalizeSingleResponse<T>(value: unknown): T {
    const unwrapped = unwrapApiResponse<unknown>(value as ApiResponse<unknown>);
  
    if (
      typeof unwrapped === "object" &&
      unwrapped !== null &&
      !Array.isArray(unwrapped)
    ) {
      return unwrapped as T;
    }
  
    return {} as T;
  }
  
  async function request<T>(
    path: string,
    options: RequestInit = {},
  ): Promise<T> {
    const response = await fetch(`${API_URL}${path}`, options);
  
    return handleResponse<T>(response);
  }
  
  // GET /users
  export async function getUsers(query?: UserQuery): Promise<User[]> {
    const queryString = buildQueryString(query);
  
    const data = await request<unknown>(`/${RESOURCE}${queryString}`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
  
    return normalizeListResponse<User>(data);
  }
  
  // GET /users/:id
  export async function getUserById(id: string | number): Promise<User> {
    const data = await request<unknown>(`/${RESOURCE}/${id}`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
  
    return normalizeSingleResponse<User>(data);
  }
  
  // POST /users
  export async function createUser(
    payload: CreateUserPayload,
  ): Promise<User> {
    const data = await request<unknown>(`/${RESOURCE}`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
  
    return normalizeSingleResponse<User>(data);
  }
  
  // PATCH /users/:id
  export async function updateUser(
    id: string | number,
    payload: UpdateUserPayload,
  ): Promise<User> {
    const data = await request<unknown>(`/${RESOURCE}/${id}`, {
      method: "PATCH",
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
  
    return normalizeSingleResponse<User>(data);
  }
  
  // DELETE /users/:id
  export async function deleteUser(id: string | number): Promise<void> {
    await request<unknown>(`/${RESOURCE}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
  }
