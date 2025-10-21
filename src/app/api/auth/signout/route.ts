import { NextResponse } from 'next/server'

export async function POST() {
  try {
    return NextResponse.json({
      message: 'Đăng xuất thành công'
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Có lỗi xảy ra' },
      { status: 500 }
    )
  }
}
