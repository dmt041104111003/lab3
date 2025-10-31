import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '5')
    
    const viewCounts = await prisma.postView.groupBy({
      by: ['postId'],
      _count: {
        id: true
      }
    })

    viewCounts.sort((a, b) => b._count.id - a._count.id)
    const topViewCounts = viewCounts.slice(0, limit * 2)

    const postIds = topViewCounts.map((v: { postId: string; _count: { id: number } }) => v.postId)

    const posts = await prisma.post.findMany({
      where: {
        id: {
          in: postIds
        },
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
      }
    })

    const viewCountMap = new Map(topViewCounts.map((v: { postId: string; _count: { id: number } }) => [v.postId, v._count.id]))

    const sortedPosts = posts
      .sort((a, b) => {
        const aViews = viewCountMap.get(a.id) || 0
        const bViews = viewCountMap.get(b.id) || 0
        return bViews - aViews
      })
      .slice(0, limit)

    const postsWithViewCount = sortedPosts.map(post => {
      const viewCount = viewCountMap.get(post.id) || 0
      return {
        ...post,
        viewCount
      }
    })

    return NextResponse.json(postsWithViewCount)
  } catch (error) {
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy bài viết đọc nhiều nhất' },
      { status: 500 }
    )
  }
}

