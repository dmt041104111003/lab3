import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// DELETE comment
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Get session from cookies
    const sessionCookie = request.cookies.get('user_session')
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const session = JSON.parse(sessionCookie.value)
    const commentId = parseInt(params.id)

    if (isNaN(commentId)) {
      return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 })
    }

    // Find the comment and check ownership
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: {
        id: true,
        authorId: true,
        author: {
          select: {
            role: true
          }
        }
      }
    })

    if (!comment) {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 })
    }

    // Check if user is the author or admin
    const isAuthor = comment.authorId === session.id
    const isAdmin = comment.author.role === 'ADMIN'

    if (!isAuthor && !isAdmin) {
      return NextResponse.json({ 
        error: 'Bạn không có quyền xóa bình luận này' 
      }, { status: 403 })
    }

    // Delete the comment (this will also delete all replies due to cascade)
    await prisma.comment.delete({
      where: { id: commentId }
    })

    return NextResponse.json({ 
      message: 'Bình luận đã được xóa thành công' 
    })
  } catch (error) {
    console.error('Delete comment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
