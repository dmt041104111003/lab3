import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST like/unlike reply
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get session from cookies
    const sessionCookie = request.cookies.get('user_session')
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const session = JSON.parse(sessionCookie.value)

    const replyId = params.id

    // Check if reply exists
    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
      select: { id: true, likes: true }
    })

    if (!reply) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 })
    }

    // For now, just increment likes (in real app, you'd track individual likes)
    const updatedReply = await prisma.reply.update({
      where: { id: replyId },
      data: {
        likes: reply.likes + 1
      },
      select: {
        id: true,
        likes: true
      }
    })

    return NextResponse.json({ reply: updatedReply })
  } catch (error) {
    console.error('Like reply error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
