import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('better-auth.session_token')
    || request.cookies.get('__Secure-better-auth.session_token')
  const hasSession = !!sessionCookie?.value

  const protectedRoutes = ['/dashboard', '/predictions', '/admin', '/head-to-head']
  const isProtectedRoute = protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))

  if (isProtectedRoute && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (request.nextUrl.pathname === '/login' && hasSession) {
    const from = request.nextUrl.searchParams.get('from')
    if (from !== 'expired') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
