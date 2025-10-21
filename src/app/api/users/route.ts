import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBanned: true,
        bannedUntil: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    console.error('Get users error:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy danh sách người dùng' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, role, isBanned, bannedUntil } = await request.json()

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        role,
        isBanned,
        bannedUntil: bannedUntil ? new Date(bannedUntil) : null
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isBanned: true,
        bannedUntil: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            posts: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Cập nhật người dùng thành công',
      user: updatedUser
    })
  } catch (error) {
    console.error('Update user error:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi cập nhật người dùng' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { message: 'ID người dùng không được để trống' },
        { status: 400 }
      )
    }

    await prisma.user.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Xóa người dùng thành công'
    })
  } catch (error) {
    console.error('Delete user error:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi xóa người dùng' },
      { status: 500 }
    )
  }
}
