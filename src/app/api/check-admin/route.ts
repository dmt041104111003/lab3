import { NextRequest, NextResponse } from 'next/server'
import { parseSessionCookie } from '@/lib/server-session'

export async function GET(request: NextRequest) {
  try {
    const user = parseSessionCookie(request.cookies.get('user_session')?.value)
    if (user) {
      
      if (user.role === 'ADMIN') {
        return NextResponse.json({ 
          isAdmin: true,
          redirect: '/admin',
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
          }
        })
      }
    }
    
    return NextResponse.json({ 
      isAdmin: false,
      redirect: null,
      user: null
    })
  } catch (error) {
    return NextResponse.json({ 
      isAdmin: false,
      redirect: null,
      user: null
    })
  }
}
