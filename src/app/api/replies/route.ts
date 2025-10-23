import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST new reply
export async function POST(request: NextRequest) {
  try {
    // Get session from cookies
    const sessionCookie = request.cookies.get('user_session')
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const session = JSON.parse(sessionCookie.value)

    // Check if user is banned
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

    // Verify comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true }
    })

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Verify mentioned user exists if provided
    if (mentionedUserId) {
      const mentionedUser = await prisma.user.findUnique({
        where: { id: mentionedUserId },
        select: { id: true }
      })

      if (!mentionedUser) {
        return NextResponse.json({ error: 'Mentioned user not found' }, { status: 404 })
      }
    }

    // Create reply
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
    console.error('Create reply error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
