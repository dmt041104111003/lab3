import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { user } = await request.json()
    
    const response = NextResponse.json({ success: true })
    
    response.cookies.set('user_session', encodeURIComponent(JSON.stringify(user)), {
      path: '/',
      maxAge: 86400,
      sameSite: 'strict',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    })
    
    return response
  } catch (error) {
    return NextResponse.json({ success: false, error: (error as Error).message })
  }
}
