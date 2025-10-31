import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const days = parseInt(searchParams.get('days') || '30') 
    
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)
    
    const views = await prisma.postView.findMany({
      where: {
        viewedAt: {
          gte: startDate
        }
      },
      select: {
        viewedAt: true,
        postId: true
      }
    })
    
    const comments = await prisma.comment.findMany({
      where: {
        createdAt: {
          gte: startDate
        }
      },
      select: {
        createdAt: true,
        postId: true
      }
    })
    
    const posts = await prisma.post.findMany({
      where: {
        createdAt: {
          gte: startDate
        },
        published: true
      },
      select: {
        createdAt: true
      }
    })
    
    const dataMap = new Map<string, { views: number, comments: number, posts: number }>()
    
    for (let i = 0; i < days; i++) {
      const date = new Date(startDate)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      dataMap.set(dateStr, { views: 0, comments: 0, posts: 0 })
    }
    
    views.forEach(view => {
      const dateStr = view.viewedAt.toISOString().split('T')[0]
      const existing = dataMap.get(dateStr)
      if (existing) {
        existing.views++
      }
    })
    
    comments.forEach(comment => {
      const dateStr = comment.createdAt.toISOString().split('T')[0]
      const existing = dataMap.get(dateStr)
      if (existing) {
        existing.comments++
      }
    })
    
    posts.forEach(post => {
      const dateStr = post.createdAt.toISOString().split('T')[0]
      const existing = dataMap.get(dateStr)
      if (existing) {
        existing.posts++
      }
    })
    
    const result = Array.from(dataMap.entries())
      .map(([date, data]) => ({
        date,
        views: data.views,
        comments: data.comments,
        posts: data.posts
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy dữ liệu phân tích' },
      { status: 500 }
    )
  }
}

