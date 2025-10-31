import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const viewType = searchParams.get('viewType') || 'day' 
    
    let startDate = new Date()
    
    if (viewType === 'month') {
      startDate.setMonth(startDate.getMonth() - 12) 
    } else if (viewType === 'year') {
      startDate.setFullYear(startDate.getFullYear() - 5) 
    } else {
      startDate.setDate(startDate.getDate() - 30)
    }
    
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
    
    const now = new Date()
    const periods: string[] = []
    
    if (viewType === 'year') {
      for (let i = 0; i < 5; i++) {
        const year = new Date(now.getFullYear() - 4 + i, 0, 1)
        const yearStr = year.getFullYear().toString()
        periods.push(yearStr)
        dataMap.set(yearStr, { views: 0, comments: 0, posts: 0 })
      }
    } else if (viewType === 'month') {
      for (let i = 0; i < 12; i++) {
        const month = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1)
        const monthStr = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`
        periods.push(monthStr)
        dataMap.set(monthStr, { views: 0, comments: 0, posts: 0 })
      }
    } else {
      for (let i = 0; i < 30; i++) {
        const date = new Date(startDate)
        date.setDate(date.getDate() + i)
        const dateStr = date.toISOString().split('T')[0]
        periods.push(dateStr)
        dataMap.set(dateStr, { views: 0, comments: 0, posts: 0 })
      }
    }
    
    views.forEach(view => {
      let key: string
      if (viewType === 'year') {
        key = view.viewedAt.getFullYear().toString()
      } else if (viewType === 'month') {
        key = `${view.viewedAt.getFullYear()}-${String(view.viewedAt.getMonth() + 1).padStart(2, '0')}`
      } else {
        key = view.viewedAt.toISOString().split('T')[0]
      }
      const existing = dataMap.get(key)
      if (existing) {
        existing.views++
      }
    })
    
    comments.forEach(comment => {
      let key: string
      if (viewType === 'year') {
        key = comment.createdAt.getFullYear().toString()
      } else if (viewType === 'month') {
        key = `${comment.createdAt.getFullYear()}-${String(comment.createdAt.getMonth() + 1).padStart(2, '0')}`
      } else {
        key = comment.createdAt.toISOString().split('T')[0]
      }
      const existing = dataMap.get(key)
      if (existing) {
        existing.comments++
      }
    })
    
    posts.forEach(post => {
      let key: string
      if (viewType === 'year') {
        key = post.createdAt.getFullYear().toString()
      } else if (viewType === 'month') {
        key = `${post.createdAt.getFullYear()}-${String(post.createdAt.getMonth() + 1).padStart(2, '0')}`
      } else {
        key = post.createdAt.toISOString().split('T')[0]
      }
      const existing = dataMap.get(key)
      if (existing) {
        existing.posts++
      }
    })
    
    const result = periods
      .map(period => ({
        date: period,
        views: dataMap.get(period)?.views || 0,
        comments: dataMap.get(period)?.comments || 0,
        posts: dataMap.get(period)?.posts || 0
      }))
      .filter(item => item.date)
    
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy dữ liệu phân tích' },
      { status: 500 }
    )
  }
}

