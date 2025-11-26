import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseSessionCookie } from '@/lib/server-session'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = parseSessionCookie(request.cookies.get('user_session')?.value)
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const replyId = params.id

    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
      select: { id: true, likes: true }
    })

    if (!reply) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 })
    }

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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
