import { NextRequest, NextResponse } from "next/server";

const KNOWLEDGE_API_BASE_URL =
  process.env.KNOWLEDGE_API_BASE_URL?.trim().replace(/\/$/, "") ??
  process.env.NEXT_PUBLIC_CHAT_API_BASE_URL?.trim().replace(/\/$/, "") ??
  "";

const ADMIN_API_KEY = process.env.ADMIN_API_KEY;

type RouteParams = {
  params: Promise<{
    path?: string[];
  }>;
};

async function proxyToKnowledgeAdmin(request: NextRequest, { params }: RouteParams) {
  if (!request.headers.get("authorization")) {
    return NextResponse.json(
      { message: "Bạn cần đăng nhập để thực hiện thao tác này." },
      { status: 401 },
    );
  }

  if (!KNOWLEDGE_API_BASE_URL || !ADMIN_API_KEY) {
    return NextResponse.json(
      { message: "Thiếu cấu hình KNOWLEDGE_API_BASE_URL hoặc ADMIN_API_KEY trên server." },
      { status: 500 },
    );
  }

  const { path } = await params;
  const suffix = path && path.length > 0 ? `/${path.join("/")}` : "";

  const incomingUrl = new URL(request.url);
  const backendUrl = new URL(`${KNOWLEDGE_API_BASE_URL}/admin/knowledge${suffix}`);
  backendUrl.search = incomingUrl.search;

  const headers = new Headers();
  headers.set("Accept", "application/json");
  headers.set("x-admin-key", ADMIN_API_KEY);
  headers.set("ngrok-skip-browser-warning", "true");

  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("Content-Type", contentType);
  }

  const hasRequestBody = !["GET", "HEAD"].includes(request.method);
  const body = hasRequestBody ? await request.arrayBuffer() : undefined;

  try {
    const backendResponse = await fetch(backendUrl, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });

    const responseHeaders = new Headers();
    const responseContentType = backendResponse.headers.get("content-type");
    if (responseContentType) {
      responseHeaders.set("content-type", responseContentType);
    }

    return new NextResponse(backendResponse.body, {
      status: backendResponse.status,
      statusText: backendResponse.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected backend error.";

    return NextResponse.json({ message }, { status: 502 });
  }
}

export const GET = proxyToKnowledgeAdmin;
export const POST = proxyToKnowledgeAdmin;
export const PATCH = proxyToKnowledgeAdmin;
