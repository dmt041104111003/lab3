import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { parseSessionCookie } from '@/lib/server-session'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/auth/')) {
    if (pathname === '/auth/change-password') {
      return NextResponse.next()
    }
    
    const user = parseSessionCookie(request.cookies.get('user_session')?.value)
    if (user?.role) {
      if (user.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/auth/:path*',
    '/',
  ],
}
