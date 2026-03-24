import { NextRequest, NextResponse } from 'next/server';

const COOKIE_NAME = 'admin_session';
const PUBLIC_ADMIN_PATHS = ['/admin/login'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin')) return NextResponse.next();
  if (PUBLIC_ADMIN_PATHS.some((p) => pathname.startsWith(p))) return NextResponse.next();

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const expected = process.env.ADMIN_SESSION_TOKEN;

  if (!token || !expected || token !== expected) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
