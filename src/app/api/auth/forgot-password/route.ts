import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendPasswordResetEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json({ error: 'Email là bắt buộc' }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 })
    }

    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json({ 
        message: 'Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu' 
      }, { status: 200 })
    }

    const resetToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000) 

    await prisma.passwordReset.deleteMany({
      where: { userId: user.id }
    })

    await prisma.passwordReset.create({
      data: {
        token: resetToken,
        expiresAt,
        userId: user.id
      }
    })

    const emailSent = await sendPasswordResetEmail(email, resetToken)
    
    if (!emailSent) {
      return NextResponse.json({ 
        error: 'Không thể gửi email. Vui lòng thử lại sau.' 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Nếu email tồn tại, bạn sẽ nhận được link đặt lại mật khẩu' 
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({ error: 'Có lỗi xảy ra khi xử lý yêu cầu' }, { status: 500 })
  }
}
