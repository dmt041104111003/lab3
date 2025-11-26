import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseSessionCookie } from '@/lib/server-session'

export async function POST(request: NextRequest) {
  try {
    const session = parseSessionCookie(request.cookies.get('user_session')?.value)
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.id },
      select: { isBanned: true, bannedUntil: true }
    })

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.isBanned) {
      const now = new Date()
      if (user.bannedUntil && user.bannedUntil > now) {
        return NextResponse.json({ 
          error: 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.' 
        }, { status: 403 })
      }
    }

    const { commentId, content, mentionedUserId } = await request.json()

    if (!commentId || !content?.trim()) {
      return NextResponse.json({ error: 'Comment ID and content are required' }, { status: 400 })
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true }
    })

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    if (mentionedUserId) {
      const mentionedUser = await prisma.user.findUnique({
        where: { id: mentionedUserId },
        select: { id: true }
      })

      if (!mentionedUser) {
        return NextResponse.json({ error: 'Mentioned user not found' }, { status: 404 })
      }
    }

    const reply = await prisma.reply.create({
      data: {
        content: content.trim(),
        commentId,
        authorId: session.id,
        mentionedUserId: mentionedUserId || null
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        mentionedUser: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json({ reply }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
