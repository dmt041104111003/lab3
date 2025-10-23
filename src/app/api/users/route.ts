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

    // Check if email already exists for other users
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

    // Get user info before deletion for logging
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

    // Use transaction to ensure all related data is deleted
    await prisma.$transaction(async (tx) => {
      // Delete all user's posts (cascade will handle PostTag, PostImage)
      await tx.post.deleteMany({
        where: { authorId: id }
      })

      // Delete all user's comments (cascade will handle replies)
      await tx.comment.deleteMany({
        where: { authorId: id }
      })

      // Delete all user's replies
      await tx.reply.deleteMany({
        where: { authorId: id }
      })

      // Delete all replies that mention this user
      await tx.reply.deleteMany({
        where: { mentionedUserId: id }
      })

      // Finally delete the user
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
    console.error('Delete user error:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi xóa người dùng' },
      { status: 500 }
    )
  }
}
