export type AdminRecord = Record<string, unknown> & {
  id?: string | number;
  _id?: string | number;
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "";

function getHeaders(hasJsonBody = false): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
    "x-admin-key": ADMIN_KEY,
  };

  if (hasJsonBody) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

function getErrorMessage(body: string, status: number) {
  if (!body.trim()) {
    return `API request failed: ${status}`;
  }

  try {
    const parsed = JSON.parse(body) as { message?: unknown; error?: unknown };
    const message = parsed.message ?? parsed.error;

    if (Array.isArray(message)) {
      return message.join(", ");
    }

    if (typeof message === "string") {
      return message;
    }
  } catch {
    return body;
  }

  return body;
}

async function handleResponse<T>(response: Response): Promise<T> {
  const body = await response.text();

  if (!response.ok) {
    throw new Error(getErrorMessage(body, response.status));
  }

  if (response.status === 204 || !body.trim()) {
    return undefined as T;
  }

  return JSON.parse(body) as T;
}

function buildUrl(resource: string, id?: string | number) {
  const cleanResource = resource.replace(/^\/+|\/+$/g, "");
  const path = id === undefined ? cleanResource : `${cleanResource}/${id}`;

  return `${API_BASE_URL}/${path}`;
}

export function getRecordId(record: AdminRecord) {
  return record.id ?? record._id;
}

export function normalizeRecordList(payload: unknown): AdminRecord[] {
  if (Array.isArray(payload)) {
    return payload.filter(isRecord);
  }

  if (!isRecord(payload)) {
    return [];
  }

  const candidates = [
    payload.data,
    payload.items,
    payload.results,
    payload.records,
    payload.feedbacks,
    payload.users,
    payload.feedbackTypes,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate.filter(isRecord);
    }
  }

  return [payload];
}

function isRecord(value: unknown): value is AdminRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function listResource(resource: string): Promise<AdminRecord[]> {
  const response = await fetch(buildUrl(resource), {
    method: "GET",
    headers: getHeaders(),
    cache: "no-store",
  });

  const payload = await handleResponse<unknown>(response);

  return normalizeRecordList(payload);
}

export async function getResourceById(
  resource: string,
  id: string | number,
): Promise<AdminRecord> {
  const response = await fetch(buildUrl(resource, id), {
    method: "GET",
    headers: getHeaders(),
    cache: "no-store",
  });

  return handleResponse<AdminRecord>(response);
}

export async function createResource(
  resource: string,
  payload: AdminRecord,
): Promise<AdminRecord> {
  const response = await fetch(buildUrl(resource), {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  });

  return handleResponse<AdminRecord>(response);
}

export async function updateResource(
  resource: string,
  id: string | number,
  payload: AdminRecord,
): Promise<AdminRecord> {
  const response = await fetch(buildUrl(resource, id), {
    method: "PATCH",
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  });

  return handleResponse<AdminRecord>(response);
}

export async function deleteResource(
  resource: string,
  id: string | number,
): Promise<void> {
  const response = await fetch(buildUrl(resource, id), {
    method: "DELETE",
    headers: getHeaders(),
  });

  await handleResponse<void>(response);
}
