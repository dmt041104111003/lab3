import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// DELETE reply
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
    const replyId = parseInt(params.id)

    if (isNaN(replyId)) {
      return NextResponse.json({ error: 'Invalid reply ID' }, { status: 400 })
    }

    // Find the reply and check ownership
    const reply = await prisma.reply.findUnique({
      where: { id: replyId },
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

    if (!reply) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 })
    }

    // Check if user is the author or admin
    const isAuthor = reply.authorId === session.id
    const isAdmin = reply.author.role === 'ADMIN'

    if (!isAuthor && !isAdmin) {
      return NextResponse.json({ 
        error: 'Bạn không có quyền xóa phản hồi này' 
      }, { status: 403 })
    }

    // Delete the reply
    await prisma.reply.delete({
      where: { id: replyId }
    })

    return NextResponse.json({ 
      message: 'Phản hồi đã được xóa thành công' 
    })
  } catch (error) {
    console.error('Delete reply error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
