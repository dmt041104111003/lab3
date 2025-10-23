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
            posts: true,
            comments: true,
            replies: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy danh sách người dùng' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, name, email, role, isBanned, bannedUntil } = await request.json()

    if (email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: { not: id }
        }
      })
      
      if (existingUser) {
        return NextResponse.json(
          { message: 'Email đã được sử dụng bởi người dùng khác' },
          { status: 400 }
        )
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role }),
        isBanned: isBanned !== undefined ? isBanned : undefined,
        bannedUntil: bannedUntil ? new Date(bannedUntil) : (bannedUntil === null ? null : undefined)
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
            posts: true,
            comments: true,
            replies: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Cập nhật người dùng thành công',
      user: updatedUser
    })
  } catch (error) {
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

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        name: true,
        email: true,
        _count: {
          select: {
            posts: true,
            comments: true,
            replies: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { message: 'Người dùng không tồn tại' },
        { status: 404 }
      )
    }

    await prisma.$transaction(async (tx) => {
      await tx.post.deleteMany({
        where: { authorId: id }
      })

      await tx.comment.deleteMany({
        where: { authorId: id }
      })

      await tx.reply.deleteMany({
        where: { authorId: id }
      })

      await tx.reply.deleteMany({
        where: { mentionedUserId: id }
      })

      await tx.user.delete({
        where: { id }
      })
    })

    return NextResponse.json({
      message: 'Xóa người dùng và tất cả dữ liệu liên quan thành công',
      deletedData: {
        user: user.name,
        email: user.email,
        posts: user._count.posts,
        comments: user._count.comments,
        replies: user._count.replies
      }
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi xóa người dùng' },
      { status: 500 }
    )
  }
}
