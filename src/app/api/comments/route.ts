import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET comments for a post
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const postSlug = searchParams.get('postSlug')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')

  if (!postSlug) {
    return NextResponse.json({ error: 'Post slug is required' }, { status: 400 })
  }

  try {
    // Find post by slug
    const post = await prisma.post.findUnique({
      where: { slug: postSlug },
      select: { id: true }
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Get comments with replies
    const comments = await prisma.comment.findMany({
      where: { postId: post.id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        replies: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true
              }
            },
            mentionedUser: {
              select: {
                id: true,
                name: true
              }
            }
          },
          orderBy: {
            createdAt: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      skip: (page - 1) * limit,
      take: limit
    })

    const totalComments = await prisma.comment.count({
      where: { postId: post.id }
    })

    return NextResponse.json({
      comments,
      pagination: {
        page,
        limit,
        total: totalComments,
        pages: Math.ceil(totalComments / limit)
      }
    })
  } catch (error) {
    console.error('Comments API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST new comment
export async function POST(request: NextRequest) {
  try {
    // Get session from cookies
    const sessionCookie = request.cookies.get('user_session')
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const session = JSON.parse(sessionCookie.value)

    const { postSlug, content } = await request.json()

    if (!postSlug || !content?.trim()) {
      return NextResponse.json({ error: 'Post slug and content are required' }, { status: 400 })
    }

    // Find post by slug
    const post = await prisma.post.findUnique({
      where: { slug: postSlug },
      select: { id: true }
    })

    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 })
    }

    // Create comment
    const comment = await prisma.comment.create({
      data: {
        content: content.trim(),
        postId: post.id,
        authorId: session.id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        replies: true
      }
    })

    return NextResponse.json({ comment }, { status: 201 })
  } catch (error) {
    console.error('Create comment error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
