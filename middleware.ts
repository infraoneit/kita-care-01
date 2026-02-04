import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const session = request.cookies.get("kita_session")?.value;
  const userId = request.cookies.get("userId")?.value;
  const isLoginPage = request.nextUrl.pathname === "/login";
  const isApiRoute = request.nextUrl.pathname.startsWith("/api");

  if (isApiRoute) return NextResponse.next();

  if ((!session || !userId) && !isLoginPage) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    if (session) response.cookies.delete("kita_session");
    if (userId) response.cookies.delete("userId");
    return response;
  }

  if (session && userId && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
