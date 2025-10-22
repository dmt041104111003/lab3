import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { category: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = searchParams.get('limit')
    
    const posts = await prisma.post.findMany({
      where: {
        category: params.category,
        published: true
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        },
        tags: {
          include: {
            tag: true
          }
        },
        images: {
          include: {
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      ...(limit && { take: parseInt(limit) })
    })

    return NextResponse.json(posts)
  } catch (error) {
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy bài viết theo chuyên mục' },
      { status: 500 }
    )
  }
}
