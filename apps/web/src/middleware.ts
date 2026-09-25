import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const { auth } = NextAuth(authConfig);

// Routes that require authentication
const AUTHENTICATED_ROUTES = ["/console", "/contractor", "/auditor", "/dashboard", "/profile"];

// Routes that require specific roles
const ROLE_ROUTES: Record<string, string[]> = {
  "/console": ["PROCUREMENT_OFFICER", "EVALUATOR", "ADMIN"],
  "/auditor": ["AUDITOR", "ADMIN"],
  "/contractor": ["CONTRACTOR", "ADMIN"],
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if this is an authenticated route
  const isAuthenticatedRoute = AUTHENTICATED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!isAuthenticatedRoute) {
    return NextResponse.next();
  }

  const session = await auth();

  if (!session?.user) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Check role-based access
  for (const [route, allowedRoles] of Object.entries(ROLE_ROUTES)) {
    if (pathname.startsWith(route)) {
      if (!allowedRoles.includes(session.user.role)) {
        // Redirect to their appropriate dashboard
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/console/:path*",
    "/contractor/:path*",
    "/auditor/:path*",
    "/dashboard/:path*",
    "/profile/:path*",
  ],
};
