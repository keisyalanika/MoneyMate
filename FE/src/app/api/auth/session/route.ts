import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const TOKEN_COOKIE = "mm_token";
const API_BASE = process.env.API_BASE_URL ?? "http://localhost:5000/api";

export async function GET() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Belum login." }, { status: 401 });
  }

  try {
    const response = await fetch(`${API_BASE}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!response.ok) {
      const res = NextResponse.json({ message: "Sesi kedaluwarsa." }, { status: 401 });
      res.cookies.set(TOKEN_COOKIE, "", { path: "/", maxAge: 0 });
      return res;
    }

    const body = await response.json();
    const user = body?.data ?? body;
    if (user?.role !== "admin") {
      return NextResponse.json({ message: "Akun ini bukan administrator." }, { status: 403 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar_url: user.avatar_url ?? "",
      },
    });
  } catch {
    return NextResponse.json({ message: "Gagal menghubungi backend." }, { status: 503 });
  }
}
