import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const sessionCookie = request.cookies.get('user_session')
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const session = JSON.parse(sessionCookie.value)
    const commentId = params.id

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

    const isAuthor = comment.authorId === session.id
    const isAdmin = comment.author.role === 'ADMIN'

    if (!isAuthor && !isAdmin) {
      return NextResponse.json({ 
        error: 'Bạn không có quyền xóa bình luận này' 
      }, { status: 403 })
    }

    await prisma.comment.delete({
      where: { id: commentId }
    })

    return NextResponse.json({ 
      message: 'Bình luận đã được xóa thành công' 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
