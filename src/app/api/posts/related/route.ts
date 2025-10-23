import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET related posts (3 latest posts from entire website)
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const excludeSlug = searchParams.get('excludeSlug')
  const limit = parseInt(searchParams.get('limit') || '3')

  try {
    // Always get latest posts from entire website, optionally exclude current post
    const whereCondition = excludeSlug 
      ? { published: true, slug: { not: excludeSlug } }
      : { published: true }

    const posts = await prisma.post.findMany({
      where: whereCondition,
      include: {
        author: {
          select: {
            id: true,
            name: true
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                id: true,
                name: true,
                slug: true,
                color: true
              }
            }
          }
        },
        images: {
          include: {
            image: true
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    // Transform the data to match the expected format
    const transformedPosts = posts.map(post => ({
      id: post.id,
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      createdAt: post.createdAt,
      author: post.author,
      tags: post.tags.map(pt => pt.tag),
      image: post.images[0]?.image || null
    }))


    return NextResponse.json({ posts: transformedPosts })
  } catch (error) {
    console.error('Related posts API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
