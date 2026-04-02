
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request });
  const { pathname } = request.nextUrl;

  console.log("TOKEN:", {
    name: token?.name,
    isNewUser: token?.isNewUser,
  });

  // ❌ Not logged in → protect routes
  if (!token && (pathname.startsWith("/notes") || pathname.startsWith("/dashboard"))) {
    const loginUrl = new URL("/api/auth/signin", request.url);
    loginUrl.searchParams.set("callbackUrl", request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 🟡 New user → force onboarding
  if (token && token.isNewUser && pathname !== "/onboarding") {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  // 🔵 Already onboarded → block onboarding page
  if (token && !token.isNewUser && pathname === "/onboarding") {
    return NextResponse.redirect(new URL("/notes", request.url));
  }

  // 🟢 Logged in user on root → send to notes
  if (token && pathname === "/") {
    return NextResponse.redirect(new URL("/notes", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/notes/:path*", "/dashboard/:path*", "/onboarding/:path*"],
};