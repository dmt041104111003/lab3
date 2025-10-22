import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { OAuth2Client } from 'google-auth-library'

const client = new OAuth2Client(process.env.GOOGLE_ID)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { provider, email, password, token } = body

    // --- ĐĂNG NHẬP GOOGLE ---
    if (provider === 'google') {
      // Xác thực token Google
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_ID,
      })
      const payload = ticket.getPayload()

      if (!payload?.email) {
        return NextResponse.json({ message: 'Token Google không hợp lệ' }, { status: 401 })
      }

      // Kiểm tra user trong DB
      let user = await prisma.user.findUnique({
        where: { email: payload.email },
      })

      // Nếu chưa có thì tạo mới user Google
      if (!user) {
        user = await prisma.user.create({
          data: {
            email: payload.email,
            name: payload.name || 'Người dùng Google',
            password: '', // Google không dùng password
            role: 'USER',
          },
        })
      }

      return NextResponse.json({
        message: 'Đăng nhập Google thành công',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      })
    }

    // --- ĐĂNG NHẬP THƯỜNG ---
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      )
    }

    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return NextResponse.json(
        { message: 'Email hoặc mật khẩu không đúng' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      message: 'Đăng nhập thành công',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra' },
      { status: 500 }
    )
  }
}
