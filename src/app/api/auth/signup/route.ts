import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json()

    const existingUser = await prisma.user.findUnique({
      where: {
        email: email
      }
    })

    if (existingUser) {
      return NextResponse.json(
        { message: 'Email đã được sử dụng' },
        { status: 400 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: 'USER'
      }
    })

    return NextResponse.json({
      message: 'Đăng ký thành công',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    })

  } catch (error) {
    return NextResponse.json(
      { message: 'Có lỗi xảy ra' },
      { status: 500 }
    )
  }
}
