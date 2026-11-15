import { NextResponse } from "next/server";
import { TOKEN_COOKIE } from "../login/route";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.cookies.set(TOKEN_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return response;
}
