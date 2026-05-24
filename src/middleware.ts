import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Array of public paths that don't require authentication
const publicPaths = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for the session cookie
  const hasSession = request.cookies.has('nestsheet_session');

  // If trying to access a public path while logged in, redirect to dashboard
  if (publicPaths.includes(pathname)) {
    if (hasSession) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  // If trying to access a protected path while NOT logged in, redirect to login
  if (!hasSession && pathname !== '/') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  // Root path handling - redirect to dashboard if logged in, else login
  if (pathname === '/') {
    if (hasSession) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/login', request.url));
    }
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
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - public files (svg, png, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg).*)',
  ],
};
