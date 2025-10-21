import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  if (pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  if (pathname === '/') {
    const userSession = request.cookies.get('user_session')?.value
    console.log('Middleware - userSession:', userSession)
    if (userSession) {
      try {
        const user = JSON.parse(userSession)
        console.log('Middleware - user:', user)
        if (user.role === 'ADMIN') {
          console.log('Middleware - Redirecting admin to /admin')
          return NextResponse.redirect(new URL('/admin', request.url))
        }
      } catch (error) {
        console.log('Middleware - Error parsing user session:', error)
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/',
  ],
}
