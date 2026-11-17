import { NextRequest, NextResponse } from "next/server";

const TOKEN_COOKIE = "mm_token";
const API_BASE = process.env.API_BASE_URL ?? "http://localhost:5000/api";

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Sesi tidak valid. Silakan login ulang." }, { status: 401 });
  }

  const { path } = await context.params;
  const target = `${API_BASE}/${path.join("/")}${request.nextUrl.search}`;
  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
  };

  const contentType = request.headers.get("content-type");
  if (contentType) headers["Content-Type"] = contentType;

  let body: ArrayBuffer | undefined;
  if (!["GET", "HEAD"].includes(request.method)) {
    const buffer = await request.arrayBuffer();
    if (buffer.byteLength > 0) body = buffer;
  }

  try {
    const response = await fetch(target, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });

    const data = await response.arrayBuffer();
    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": response.headers.get("content-type") ?? "application/json",
      },
    });
  } catch {
    return NextResponse.json(
      { message: "Tidak dapat terhubung ke server backend." },
      { status: 503 }
    );
  }
}

export {
  proxy as GET,
  proxy as POST,
  proxy as PUT,
  proxy as PATCH,
  proxy as DELETE,
};
