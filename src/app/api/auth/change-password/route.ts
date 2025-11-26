import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { parseSessionCookie } from '@/lib/server-session'

export async function POST(request: NextRequest) {
  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Vui lòng nhập đầy đủ thông tin' }, { status: 400 })
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'Mật khẩu mới phải có ít nhất 6 ký tự' }, { status: 400 })
    }

    const session = parseSessionCookie(request.cookies.get('user_session')?.value)
    if (!session?.id) {
      return NextResponse.json({ error: 'Chưa đăng nhập' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id }
    })

    if (!user) {
      return NextResponse.json({ error: 'Người dùng không tồn tại' }, { status: 404 })
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password)
    if (!isCurrentPasswordValid) {
      return NextResponse.json({ error: 'Mật khẩu hiện tại không đúng' }, { status: 400 })
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNewPassword }
    })

    return NextResponse.json({ message: 'Đổi mật khẩu thành công' }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ error: 'Có lỗi xảy ra khi đổi mật khẩu' }, { status: 500 })
  }
}
