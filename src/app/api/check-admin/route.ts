import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const userSession = request.cookies.get('user_session')?.value
    if (userSession) {
      const user = JSON.parse(userSession)
      
      if (user.role === 'ADMIN') {
        return NextResponse.json({ 
          isAdmin: true,
          redirect: '/admin'
        })
      }
    }
    
    return NextResponse.json({ 
      isAdmin: false,
      redirect: null
    })
  } catch (error) {
    return NextResponse.json({ 
      isAdmin: false,
      redirect: null
    })
  }
}
