import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionId = request.cookies.get("session_id")?.value;
  const sessionType = request.cookies.get("session_type")?.value;

  // Define public routes that should NOT be accessible if logged in
  const isPublicRoute =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/admin/login" ||
    pathname.startsWith("/events/register");

  // Define protected routes
  const isUserProtectedRoute = pathname.startsWith("/dashboard");
  const isAdminProtectedRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";

  // 1. If logged in and trying to access a public route, redirect to dashboard
  if (sessionId && isPublicRoute) {
    if (sessionType === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 2. If NOT logged in and trying to access a protected route, redirect to login
  if (!sessionId) {
    if (isAdminProtectedRoute) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
    if (isUserProtectedRoute) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // 3. Prevent cross-access (Admin trying to access user dashboard or vice versa)
  if (sessionId && sessionType === "admin" && isUserProtectedRoute) {
    return NextResponse.redirect(new URL("/admin/dashboard", request.url));
  }

  if (sessionId && sessionType === "user" && isAdminProtectedRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
