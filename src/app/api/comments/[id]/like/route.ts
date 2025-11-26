import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseSessionCookie } from '@/lib/server-session'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = parseSessionCookie(request.cookies.get('user_session')?.value)
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const commentId = params.id

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, likes: true }
    })

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        likes: comment.likes + 1
      },
      select: {
        id: true,
        likes: true
      }
    })

    return NextResponse.json({ comment: updatedComment })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
