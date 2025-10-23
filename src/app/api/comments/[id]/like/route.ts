import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const sessionCookie = request.cookies.get('user_session')
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const session = JSON.parse(sessionCookie.value)

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
