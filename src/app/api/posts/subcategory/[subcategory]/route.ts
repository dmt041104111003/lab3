import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { subcategory: string } }
) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        subcategory: params.subcategory,
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
      }
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Get posts by subcategory error:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy bài viết theo tiểu mục' },
      { status: 500 }
    )
  }
}
