import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const userSession = request.cookies.get('user_session')?.value
    console.log('API - userSession:', userSession)
    
    if (userSession) {
      const user = JSON.parse(userSession)
      console.log('API - user:', user)
      
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
    console.log('API - Error:', error)
    return NextResponse.json({ 
      isAdmin: false,
      redirect: null
    })
  }
}
