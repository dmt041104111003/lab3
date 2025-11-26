import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const response = NextResponse.json({
      message: 'Đăng xuất thành công'
    })

    response.cookies.set('user_session', '', {
      path: '/',
      maxAge: 0,
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production'
    })

    return response
  } catch (error) {
    return NextResponse.json(
      { message: 'Có lỗi xảy ra' },
      { status: 500 }
    )
  }
}
