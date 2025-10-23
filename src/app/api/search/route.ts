import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] })
    }

    const searchTerm = query.trim()

    // Build search conditions
    const whereConditions: any = {
      published: true,
      OR: [
        {
          title: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        },
        {
          content: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        },
        {
          excerpt: {
            contains: searchTerm,
            mode: 'insensitive'
          }
        }
      ]
    }

    // Add category filter if specified
    if (category && category !== 'all') {
      whereConditions.category = category
    }

    // Search posts
    const posts = await prisma.post.findMany({
      where: whereConditions,
      include: {
        author: {
          select: {
            name: true
          }
        },
        tags: {
          include: {
            tag: {
              select: {
                name: true,
                color: true
              }
            }
          }
        },
        images: {
          include: {
            image: {
              select: {
                path: true,
                alt: true
              }
            }
          },
          take: 1
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    // Format results
    const results = posts.map(post => ({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      slug: post.slug,
      category: post.category,
      subcategory: post.subcategory,
      author: post.author.name,
      createdAt: post.createdAt,
      tags: post.tags.map(pt => ({
        name: pt.tag.name,
        color: pt.tag.color
      })),
      image: post.images[0]?.image?.path || null,
      imageAlt: post.images[0]?.image?.alt || null,
      type: 'post'
    }))

    return NextResponse.json({ 
      results,
      total: results.length,
      query: searchTerm
    })

  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Lỗi tìm kiếm' },
      { status: 500 }
    )
  }
}
