import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_CONFIG } from '@/config/api.config';

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_CONFIG.cookieNames.auth)?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
  const isRootPage = request.nextUrl.pathname === "/";

  // If accessing root page, let the page component handle redirection
  if (isRootPage) {
    return NextResponse.next();
  }

  // If accessing auth pages while authenticated, redirect to dashboard
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // If accessing protected pages without auth, redirect to login
  if (!isAuthPage && !token) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
}; 