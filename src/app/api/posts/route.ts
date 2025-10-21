import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/posts - Lấy danh sách bài viết
export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(posts)
  } catch (error) {
    console.error('Get posts error:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy danh sách bài viết' },
      { status: 500 }
    )
  }
}

// POST /api/posts - Tạo bài viết mới (chỉ admin)
export async function POST(request: NextRequest) {
  try {
    const { title, content, excerpt, authorId } = await request.json()

    // In a real app, you would check if the user is admin here
    // For now, we'll just create the post

    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt,
        slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        authorId,
        published: false // Default to draft
      }
    })

    return NextResponse.json({
      message: 'Tạo bài viết thành công',
      post
    })

  } catch (error) {
    console.error('Create post error:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi tạo bài viết' },
      { status: 500 }
    )
  }
}
