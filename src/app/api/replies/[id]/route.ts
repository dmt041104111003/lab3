import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { parseSessionCookie } from '@/lib/server-session'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = parseSessionCookie(request.cookies.get('user_session')?.value)
    if (!session?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const replyId = params.id

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

    const isAuthor = reply.authorId === session.id
    const isAdmin = reply.author.role === 'ADMIN'

    if (!isAuthor && !isAdmin) {
      return NextResponse.json({ 
        error: 'Bạn không có quyền xóa phản hồi này' 
      }, { status: 403 })
    }

    await prisma.reply.delete({
      where: { id: replyId }
    })

    return NextResponse.json({ 
      message: 'Phản hồi đã được xóa thành công' 
    })
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
