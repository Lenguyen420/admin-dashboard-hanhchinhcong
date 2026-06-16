export type ApiResponse<T> = {
    success: boolean;
    message: string;
    data: T;
  };
  
  export type IndustrialParkQuery = {
    page?: number;
    size?: number;
    keyword?: string;
  };
  
  export type PaginatedResponse<T> = {
    data?: T[];
    items?: T[];
    industrialParks?: T[];
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
  
  export type IndustrialPark = {
    id: string;
    createdAt?: string;
    updatedAt?: string;
  
    name?: string;
    description?: string;
    address?: string;
    province?: string;
    district?: string;
    ward?: string;
  
    area?: number | string;
    occupancyRate?: number | string;
    investor?: string;
    phone?: string;
    email?: string;
    website?: string;
    imageUrl?: string;
    logoUrl?: string;
    status?: string;
  
    [key: string]: unknown;
  };
  
  export type CreateIndustrialParkPayload = {
    name?: string;
    description?: string;
    address?: string;
    province?: string;
    district?: string;
    ward?: string;
  
    area?: number | string;
    occupancyRate?: number | string;
    investor?: string;
    phone?: string;
    email?: string;
    website?: string;
    imageUrl?: string;
    logoUrl?: string;
    status?: string;
  
    [key: string]: unknown;
  };
  
  export type UpdateIndustrialParkPayload = Partial<CreateIndustrialParkPayload>;
  
  const API_URL =
    process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") ??
    "";
  
  const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "";
  
  const RESOURCE = "industrial-parks";
  
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
  
  function buildQueryString(query?: IndustrialParkQuery): string {
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
  
      const items = body.items ?? body.industrialParks ?? body.data ?? [];
  
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
  
  // GET /industrial-parks
  export async function getIndustrialParks(
    query?: IndustrialParkQuery,
  ): Promise<IndustrialPark[]> {
    const queryString = buildQueryString(query);
  
    const data = await request<unknown>(`/${RESOURCE}${queryString}`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
  
    return normalizeListResponse<IndustrialPark>(data);
  }
  
  // GET /industrial-parks/:id
  export async function getIndustrialParkById(
    id: string | number,
  ): Promise<IndustrialPark> {
    const data = await request<unknown>(`/${RESOURCE}/${id}`, {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    });
  
    return normalizeSingleResponse<IndustrialPark>(data);
  }
  
  // POST /industrial-parks
  export async function createIndustrialPark(
    payload: CreateIndustrialParkPayload,
  ): Promise<IndustrialPark> {
    const data = await request<unknown>(`/${RESOURCE}`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
  
    return normalizeSingleResponse<IndustrialPark>(data);
  }
  
  // PATCH /industrial-parks/:id
  export async function updateIndustrialPark(
    id: string | number,
    payload: UpdateIndustrialParkPayload,
  ): Promise<IndustrialPark> {
    const data = await request<unknown>(`/${RESOURCE}/${id}`, {
      method: "PATCH",
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    });
  
    return normalizeSingleResponse<IndustrialPark>(data);
  }
  
  // DELETE /industrial-parks/:id
  export async function deleteIndustrialPark(
    id: string | number,
  ): Promise<void> {
    await request<unknown>(`/${RESOURCE}/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
  }