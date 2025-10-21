import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateSlug, generateUniqueSlug } from '@/lib/slug'

export async function GET(request: NextRequest) {
  try {
    const posts = await prisma.post.findMany({
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

export async function POST(request: NextRequest) {
  try {
    const { title, content, excerpt, authorId, category, subcategory } = await request.json()

    // Generate slug from title with Vietnamese character support
    const baseSlug = generateSlug(title)
    
    // Check for existing slugs to ensure uniqueness
    const existingPosts = await prisma.post.findMany({
      select: { slug: true }
    })
    const existingSlugs = existingPosts.map(post => post.slug)
    const uniqueSlug = await generateUniqueSlug(baseSlug, existingSlugs)

    const post = await prisma.post.create({
      data: {
        title,
        content,
        excerpt,
        slug: uniqueSlug,
        authorId,
        category,
        subcategory
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
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

export async function PUT(request: NextRequest) {
  try {
    const { id, title, content, excerpt, published, category, subcategory } = await request.json()

    // Generate slug from title with Vietnamese character support
    const baseSlug = generateSlug(title)
    
    // Check for existing slugs to ensure uniqueness (excluding current post)
    const existingPosts = await prisma.post.findMany({
      select: { slug: true },
      where: { id: { not: id } }
    })
    const existingSlugs = existingPosts.map(post => post.slug)
    const uniqueSlug = await generateUniqueSlug(baseSlug, existingSlugs)

    const post = await prisma.post.update({
      where: { id },
      data: {
        title,
        content,
        excerpt,
        slug: uniqueSlug,
        published,
        category,
        subcategory
      },
      include: {
        author: {
          select: {
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Cập nhật bài viết thành công',
      post
    })
  } catch (error) {
    console.error('Update post error:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi cập nhật bài viết' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { message: 'ID bài viết không được để trống' },
        { status: 400 }
      )
    }

    await prisma.post.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Xóa bài viết thành công'
    })
  } catch (error) {
    console.error('Delete post error:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi xóa bài viết' },
      { status: 500 }
    )
  }
}