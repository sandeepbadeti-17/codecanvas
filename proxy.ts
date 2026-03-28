// proxy.ts
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  // logged in + on root → send to /notes
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/notes", request.url));
  }

  // not logged in + on protected route → send to login
  if (!token && (pathname.startsWith("/notes") || pathname.startsWith("/dashboard"))) {
    const loginUrl = new URL("/api/auth/signin", request.url);
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/notes/:path*", "/dashboard/:path*"],
};