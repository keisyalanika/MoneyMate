import { NextResponse, type NextRequest } from "next/server";

const TOKEN_COOKIE = "mm_token";

export default function proxy(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  if (token) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/users/:path*",
    "/kategori/:path*",
    "/notifikasi/:path*",
    "/logs/:path*",
    "/settings/:path*",
  ],
};
