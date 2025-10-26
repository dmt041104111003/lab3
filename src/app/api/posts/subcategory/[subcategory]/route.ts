import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { subcategory: string } }
) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '6')
    const skip = (page - 1) * limit

    const [posts, totalCount] = await Promise.all([
      prisma.post.findMany({
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
          },
          _count: {
            select: {
              comments: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        skip,
        take: limit
      }),
      prisma.post.count({
        where: {
          subcategory: params.subcategory,
          published: true
        }
      })
    ])

    const totalPages = Math.ceil(totalCount / limit)

    return NextResponse.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy bài viết theo tiểu mục' },
      { status: 500 }
    )
  }
}
