import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { user } = await request.json()
    
    const response = NextResponse.json({ success: true })
    
    // Set cookie in response
    response.cookies.set('user_session', JSON.stringify(user), {
      path: '/',
      maxAge: 86400,
      sameSite: 'strict'
    })
    
    return response
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message })
  }
}
