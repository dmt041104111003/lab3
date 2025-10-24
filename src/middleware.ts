import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/auth/')) {
    if (pathname === '/auth/change-password') {
      return NextResponse.next()
    }
    
    const userSession = request.cookies.get('user_session')?.value
    if (userSession) {
      try {
        const user = JSON.parse(userSession)
        if (user.role === 'ADMIN') {
          return NextResponse.redirect(new URL('/admin', request.url))
        } else {
          return NextResponse.redirect(new URL('/', request.url))
        }
      } catch (error) {
      }
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
