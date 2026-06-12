export type KnowledgeStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type KnowledgeItem = {
  id: string;
  title: string;
  category: string;
  keywords: string[];
  content: string;
  sourceLabel: string;
  sourceUrl: string | null;
  status: KnowledgeStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateKnowledgePayload = {
  title: string;
  category: string;
  keywords: string[];
  content: string;
  sourceLabel: string;
  sourceUrl?: string | null;
};

export type UpdateKnowledgePayload = Partial<CreateKnowledgePayload>;

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

const ADMIN_KEY =
  process.env.NEXT_PUBLIC_ADMIN_KEY ?? "";

function getHeaders(
  hasJsonBody = false,
): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",

    // Đổi tên header tại đây nếu AdminKeyGuard dùng tên khác.
    "x-admin-key": ADMIN_KEY,
  };

  if (hasJsonBody) {
    headers["Content-Type"] =
      "application/json";
  }

  return headers;
}

async function handleResponse<T>(
  response: Response,
): Promise<T> {
  if (!response.ok) {
    const errorBody =
      await response.text();

    throw new Error(
      errorBody ||
        `API request failed: ${response.status}`,
    );
  }

  if (
    response.status === 204 ||
    response.headers.get(
      "content-length",
    ) === "0"
  ) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function getKnowledgeItems(): Promise<
  KnowledgeItem[]
> {
  const response = await fetch(
    `${API_URL}/admin/knowledge`,
    {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    },
  );

  return handleResponse<KnowledgeItem[]>(
    response,
  );
}

export async function getKnowledgeById(
  id: string,
): Promise<KnowledgeItem> {
  const response = await fetch(
    `${API_URL}/admin/knowledge/${id}`,
    {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    },
  );

  return handleResponse<KnowledgeItem>(
    response,
  );
}

export async function createKnowledge(
  payload: CreateKnowledgePayload,
): Promise<KnowledgeItem> {
  const response = await fetch(
    `${API_URL}/admin/knowledge`,
    {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    },
  );

  return handleResponse<KnowledgeItem>(
    response,
  );
}

export async function updateKnowledge(
  id: string,
  payload: UpdateKnowledgePayload,
): Promise<KnowledgeItem> {
  const response = await fetch(
    `${API_URL}/admin/knowledge/${id}`,
    {
      method: "PATCH",
      headers: getHeaders(true),
      body: JSON.stringify(payload),
    },
  );

  return handleResponse<KnowledgeItem>(
    response,
  );
}

export async function publishKnowledge(
  id: string,
): Promise<KnowledgeItem> {
  const response = await fetch(
    `${API_URL}/admin/knowledge/${id}/publish`,
    {
      method: "POST",
      headers: getHeaders(),
    },
  );

  return handleResponse<KnowledgeItem>(
    response,
  );
}

export async function archiveKnowledge(
  id: string,
): Promise<KnowledgeItem> {
  const response = await fetch(
    `${API_URL}/admin/knowledge/${id}/archive`,
    {
      method: "POST",
      headers: getHeaders(),
    },
  );

  return handleResponse<KnowledgeItem>(
    response,
  );
}