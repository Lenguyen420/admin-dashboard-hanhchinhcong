import { FeedbackType } from "@/types";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, "") ?? "";

if (!API_BASE_URL) {
  throw new Error(
    "Thiếu VITE_API_BASE_URL. Hãy kiểm tra file .env và khởi động lại FE.",
  );
}


export type FeedbackStatus =
  | "PENDING"
  | "PROCESSING"
  | "RESOLVED"
  | "REJECTED";

export type Feedback = {
  id: string;
  title: string;
  content: string;
  feedbackTypeId?: string;
  feedbackType?: FeedbackType;
  status?: FeedbackStatus;
  senderName?: string;
  phone?: string;
  email?: string;
  address?: string;
  images?: string[];
  response?: string | null;
  createdAt?: string;
  updatedAt?: string;
};
export type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};
export type CreateFeedbackTypePayload = {
  title: string;
  description?: string;
  order?: number;
};

export type UpdateFeedbackTypePayload = Partial<CreateFeedbackTypePayload>;

export type CreateFeedbackPayload = {
  title: string;
  content: string;
  feedbackTypeId: string;
  senderName?: string;
  phone?: string;
  email?: string;
  address?: string;
  images?: string[];
};

export type UpdateFeedbackPayload = Partial<
  CreateFeedbackPayload & {
    status: FeedbackStatus;
    response: string;
  }
>;

export type FeedbackQuery = {
  page?: number;
  limit?: number;
  keyword?: string;
  status?: FeedbackStatus;
  feedbackTypeId?: string;
};

export type PaginatedResponse<T> = {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
};

function getHeaders(hasJsonBody = false): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  if (hasJsonBody) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

function buildQuery(params: Record<string, unknown>) {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (
      value !== undefined &&
      value !== null &&
      value !== ""
    ) {
      searchParams.set(key, String(value));
    }
  });

  const queryString = searchParams.toString();

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

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

/* =========================================================
 * Feedback types
 * ======================================================= */

export async function getFeedbackTypes(): Promise<FeedbackType[]> {
  const response = await fetch(`${API_BASE_URL}/feedback-types`, {
      method: "GET",
      headers: getHeaders(),
  });

  const result =
      await handleResponse<ApiResponse<FeedbackType[]>>(response);

  return result.data;
}

export async function getFeedbackType(id: string): Promise<FeedbackType> {
  const response = await fetch(`${API_BASE_URL}/feedback-types/${id}`, {
    method: "GET",
    headers: getHeaders(),
    cache: "no-store",
  });

  return handleResponse<FeedbackType>(response);
}

export async function createFeedbackType(
  payload: CreateFeedbackTypePayload,
): Promise<FeedbackType> {
  const response = await fetch(`${API_BASE_URL}/feedback-types`, {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  });

  return handleResponse<FeedbackType>(response);
}

export async function updateFeedbackType(
  id: string,
  payload: UpdateFeedbackTypePayload,
): Promise<FeedbackType> {
  const response = await fetch(`${API_BASE_URL}/feedback-types/${id}`, {
    method: "PATCH",
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  });

  return handleResponse<FeedbackType>(response);
}

export async function deleteFeedbackType(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/feedback-types/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  return handleResponse<void>(response);
}

/* =========================================================
 * Feedbacks
 * ======================================================= */

export async function getFeedbacks(
  query: FeedbackQuery = {},
): Promise<PaginatedResponse<Feedback> | Feedback[]> {
  const response = await fetch(
    `${API_BASE_URL}/feedbacks${buildQuery(query)}`,
    {
      method: "GET",
      headers: getHeaders(),
      cache: "no-store",
    },
  );

  return handleResponse<PaginatedResponse<Feedback> | Feedback[]>(response);
}

export async function getFeedback(id: string): Promise<Feedback> {
  const response = await fetch(`${API_BASE_URL}/feedbacks/${id}`, {
    method: "GET",
    headers: getHeaders(),
    cache: "no-store",
  });

  return handleResponse<Feedback>(response);
}

export async function createFeedback(
  payload: CreateFeedbackPayload,
): Promise<Feedback> {
  const response = await fetch(`${API_BASE_URL}/feedbacks`, {
      method: "POST",
      headers: getHeaders(true),
      body: JSON.stringify(payload),
  });

  const result = await handleResponse<ApiResponse<Feedback>>(response);

  return result.data;
}

export async function updateFeedback(
  id: string,
  payload: UpdateFeedbackPayload,
): Promise<Feedback> {
  const response = await fetch(`${API_BASE_URL}/feedbacks/${id}`, {
    method: "PATCH",
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  });

  return handleResponse<Feedback>(response);
}

export async function deleteFeedback(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/feedbacks/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  return handleResponse<void>(response);
}
