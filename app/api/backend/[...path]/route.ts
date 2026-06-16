const BACKEND_API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL?.trim().replace(/\/$/, "") ?? "";

const ADMIN_KEY = process.env.NEXT_PUBLIC_ADMIN_KEY ?? "";

const ALLOWED_PATH_PREFIXES = ["admin/knowledge", "chat/unanswered-questions"];

type RouteParams = {
  params: Promise<{
    path: string[];
  }>;
};

function isAllowedPath(pathname: string) {
  return ALLOWED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

async function proxyToBackend(request: Request, { params }: RouteParams) {
  if (!BACKEND_API_URL) {
    return Response.json(
      { message: "Missing NEXT_PUBLIC_API_BASE_URL." },
      { status: 500 },
    );
  }

  const { path } = await params;
  const pathname = path.join("/");

  if (!isAllowedPath(pathname)) {
    return Response.json(
      { message: "Unsupported backend path." },
      { status: 404 },
    );
  }

  const incomingUrl = new URL(request.url);
  const backendUrl = new URL(`${BACKEND_API_URL}/${pathname}`);
  backendUrl.search = incomingUrl.search;

  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");
  headers.delete("origin");
  headers.delete("referer");

  headers.delete("connection");
  headers.delete("upgrade");
  headers.delete("keep-alive");
  headers.delete("proxy-authenticate");
  headers.delete("proxy-authorization");
  headers.delete("te");
  headers.delete("trailer");
  headers.delete("transfer-encoding");
  headers.set("accept", headers.get("accept") ?? "application/json");
  headers.set("ngrok-skip-browser-warning", "true");

  if (ADMIN_KEY && !headers.has("x-admin-key")) {
    headers.set("x-admin-key", ADMIN_KEY);
  }

  try {
    const hasRequestBody = !["GET", "HEAD"].includes(request.method);

    return await fetch(backendUrl, {
      method: request.method,
      headers,
      body: hasRequestBody ? await request.arrayBuffer() : undefined,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unexpected backend error.";

    return Response.json({ message }, { status: 502 });
  }
}

export const GET = proxyToBackend;
export const POST = proxyToBackend;
export const PATCH = proxyToBackend;
export const DELETE = proxyToBackend;
