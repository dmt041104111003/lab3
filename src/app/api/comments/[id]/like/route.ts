import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// POST like/unlike comment
export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Get session from cookies
    const sessionCookie = request.cookies.get('user_session')
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const session = JSON.parse(sessionCookie.value)

    const commentId = params.id

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { id: true, likes: true }
    })

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // For now, just increment likes (in real app, you'd track individual likes)
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
    console.error('Like comment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
