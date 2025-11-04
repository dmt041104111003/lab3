import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const excludeSlug = searchParams.get('excludeSlug')
  const limit = parseInt(searchParams.get('limit') || '3')

  try {
    const whereCondition = excludeSlug 
      ? { published: true, slug: { not: excludeSlug } }
      : { published: true }

    const posts = await prisma.post.findMany({
      where: whereCondition,
      select: {
        id: true,
        title: true,
        excerpt: true,
        slug: true,
        createdAt: true,
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
