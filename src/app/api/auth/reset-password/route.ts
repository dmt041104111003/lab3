import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token và mật khẩu là bắt buộc' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Mật khẩu phải có ít nhất 6 ký tự' }, { status: 400 })
    }

    const resetRecord = await prisma.passwordReset.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!resetRecord) {
      return NextResponse.json({ error: 'Token không hợp lệ' }, { status: 400 })
    }

    if (new Date() > resetRecord.expiresAt) {
      await prisma.passwordReset.delete({
        where: { id: resetRecord.id }
      })
      return NextResponse.json({ error: 'Token đã hết hạn' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    await prisma.user.update({
      where: { id: resetRecord.userId },
      data: { password: hashedPassword }
    })

    await prisma.passwordReset.delete({
      where: { id: resetRecord.id }
    })

    return NextResponse.json({ 
      message: 'Đặt lại mật khẩu thành công' 
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ error: 'Có lỗi xảy ra khi đặt lại mật khẩu' }, { status: 500 })
  }
}
