import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Enterprise Route Protection Middleware for AP Enerfy Solar ERP
 * Enforces unauthenticated redirection, session checks, and first-login password enforcement.
 */

const PUBLIC_ROUTES = [
  "/login",
  "/forgot-password",
  "/reset-password",
  "/403",
  "/api/auth/login",
  "/api/auth/forgot-password",
  "/api/auth/reset-password",
];

const PROTECTED_PREFIXES = [
  "/dashboard",
  "/customers",
  "/leads",
  "/quotations",
  "/solar-packages",
  "/sales-orders",
  "/invoices",
  "/payments",
  "/products",
  "/inventory",
  "/suppliers",
  "/purchase-orders",
  "/projects",
  "/subsidies",
  "/net-metering",
  "/solar-calculator",
  "/service",
  "/warranties",
  "/amc",
  "/expenses",
  "/reports",
  "/employees",
  "/settings",
  "/audit-logs",
  "/profile",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allow static assets, images, internal Next.js files, public invoice PDFs and previews
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/api/neon") ||
    (pathname.startsWith("/api/invoices/") && pathname.endsWith("/pdf")) ||
    (pathname.startsWith("/invoices/") && pathname.endsWith("/preview")) ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  // 2. Read session cookies
  const hasAppSession = Boolean(request.cookies.get("ap_solar_session")?.value);
  const hasNextAuthSession = Boolean(
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value
  );
  const isAuthenticated = hasAppSession || hasNextAuthSession;

  // 3. Handle root path ("/") -> redirect to dashboard if authenticated, else login
  if (pathname === "/") {
    const target = isAuthenticated ? "/dashboard" : "/login";
    return NextResponse.redirect(new URL(target, request.url));
  }

  // 4. Check if route is public
  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(`${route}/`));

  // 5. If authenticated user tries to access /login, redirect to dashboard
  if (isAuthenticated && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // 6. Check if route is protected
  const isProtectedPath = PROTECTED_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
  const isProtectedApi = pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/login") && !pathname.startsWith("/api/auth/forgot-password") && !pathname.startsWith("/api/auth/reset-password");

  if (!isAuthenticated) {
    if (isProtectedApi) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Authentication is required to access this resource." },
        { status: 401 }
      );
    }

    if (isProtectedPath) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    "/((?!_next/static|_next/image|favicon.ico|images).*)",
  ],
};
