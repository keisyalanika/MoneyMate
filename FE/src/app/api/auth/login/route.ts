import { NextResponse } from "next/server";

export const TOKEN_COOKIE = "mm_token";

export async function POST(request: Request) {
  let body: { email?: string; password?: string } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Body tidak valid." }, { status: 400 });
  }

  const email = body.email?.trim().toLowerCase();
  const password = body.password;

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email dan kata sandi wajib diisi." },
      { status: 400 }
    );
  }

  const apiBase = process.env.API_BASE_URL ?? "http://localhost:5000/api";

  let token: string | null = null;
  let user: { id: number; name: string; email: string; role: string } | null = null;

  try {
    const res = await fetch(`${apiBase}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      cache: "no-store",
      signal: AbortSignal.timeout(3500),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return NextResponse.json(
        { message: data?.message ?? "Email atau kata sandi salah." },
        { status: res.status }
      );
    }

    token = data?.token ?? null;
    user = {
      id: Number(data?.id),
      name: String(data?.name ?? "Admin"),
      email: String(data?.email ?? email),
      role: String(data?.role ?? ""),
    };
  } catch {
    const useMock = process.env.NEXT_PUBLIC_USE_MOCK !== "false";
    if (useMock && email === "admin@moneymate.com" && password === "admin123") {
      token = "mock-admin-token";
      user = { id: 1, name: "Admin MoneyMate", email, role: "admin" };
    } else {
      return NextResponse.json(
        { message: "Tidak dapat terhubung ke server. Coba lagi." },
        { status: 503 }
      );
    }
  }

  if (!token || !user) {
    return NextResponse.json({ message: "Respons login tidak valid." }, { status: 502 });
  }

  if (user.role !== "admin") {
    return NextResponse.json(
      { message: "Akun ini bukan administrator." },
      { status: 403 }
    );
  }

  const response = NextResponse.json({ success: true, user });
  response.cookies.set(TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}
